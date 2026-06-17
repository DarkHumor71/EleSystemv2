# EleSystemv2 - Smart Elevator & Building Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive IoT-based elevator and building management system that integrates hardware control, electricity expense tracking, and a web-based admin dashboard. The system combines ESP32 microcontrollers for elevator control and QR code authentication with a full-stack web application for building and apartment management.

## 🏗️ Project Overview

EleSystemv2 is a multi-component system designed to modernize building management by:

- **Automated Elevator Control**: ESP32-based elevator controller with floor selection and queue management
- **QR Code Authentication**: Camera module for secure apartment access verification
- **Electricity Monitoring**: Track and calculate power consumption per apartment
- **Web Dashboard**: Modern React admin interface for managing buildings, apartments, and expenses
- **Role-Based Access**: Support for admin, moderator, and resident user roles

## 📁 Project Structure

```
EleSystemv2/
├── backend/              # Node.js/Express REST API
│   ├── config/          # Database and configuration files
│   ├── middleware/      # Authentication and authorization middleware
│   ├── models/          # MongoDB/Mongoose data models
│   └── routes/          # API route handlers
├── client/              # React admin dashboard
│   ├── public/          # Static assets
│   └── src/
│       ├── actions/     # Redux actions
│       ├── components/  # Reusable React components
│       ├── scenes/      # Page-level components
│       ├── reducers/    # Redux reducers
│       └── utils/       # Helper utilities
├── board/               # ESP32 elevator controller firmware
├── camera/              # ESP32-CAM QR code reader firmware
└── CAD/                 # KiCad PCB design files
```

## 🚀 Features

### Backend (REST API)

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Building Management**: CRUD operations for buildings with soft-delete support
- **Apartment Management**: Manage apartments within buildings, assign moderators
- **Expense Tracking**: Record and retrieve electricity usage data per apartment
- **Session Management**: Secure session handling for active users

### Frontend (React Dashboard)

- **Modern UI**: Material-UI components with light/dark mode
- **Data Visualization**: Charts and graphs for expense tracking
- **Building Administration**: Create and manage multiple buildings
- **Apartment Management**: Register apartments, generate QR codes
- **Expense Reports**: View and analyze electricity consumption
- **User Profiles**: Manage user information and roles

### Hardware Components

- **Elevator Controller** (`board/`):

  - 4-floor elevator control system
  - Button inputs and IR sensors per floor
  - Motor control (up/down)
  - 7-segment display for floor indication
  - Power monitoring and expense calculation
  - WiFi connectivity for data transmission

- **QR Code Reader** (`camera/`):
  - ESP32-CAM based authentication
  - Real-time QR code scanning
  - Server validation for apartment access
  - Scan cooldown to prevent duplicates

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

### Frontend

- **Framework**: React 18.3.1
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v7
- **Data Grid**: MUI X Data Grid
- **Charts**: Nivo, Chart.js
- **Form Handling**: Formik

### Hardware

- **Microcontroller**: ESP32 / ESP32-CAM
- **Connectivity**: WiFi (HTTP/HTTPS)
- **Development**: Arduino IDE
- **Libraries**: ESP32QRCodeReader, ArduinoJson, HTTPClient

### PCB Design

- **Tool**: KiCad
- **Modules**: Brain, Cabin, Display, Motor, Sensors

## 📋 Prerequisites

- **Node.js** v14+ and npm
- **MongoDB** v4+ (local or cloud instance)
- **Arduino IDE** with ESP32 board support
- **Git** for version control

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DarkHumor71/EleSystemv2.git
cd EleSystemv2
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `config/default.json` file:

```json
{
  "mongoURI": "mongodb://localhost:27017/elesystem",
  "jwtSecret": "your_jwt_secret_key_here"
}
```

Or create a `.env` file with:

```
MONGO_URI=mongodb://localhost:27017/elesystem
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Start the backend server:

```bash
npm run server    # Development mode with nodemon
npm start         # Production mode
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Update the proxy in `client/package.json` to match your backend URL:

```json
"proxy": "http://localhost:5000/"
```

Start the React development server:

```bash
npm start
```

### 4. Full Stack Development

From the `backend` directory:

```bash
npm run dev    # Runs both backend and frontend concurrently
```

### 5. Hardware Setup

#### Elevator Controller

1. Open `board/board.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "your_wifi_ssid";
   const char* password = "your_wifi_password";
   ```
3. Update the server URL to match your backend IP
4. Upload to ESP32 board

#### Camera Module

1. Open `camera/camera.ino` in Arduino IDE
2. Update WiFi credentials and validation server URL
3. Upload to ESP32-CAM board

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/apartment` - Apartment authentication

### Buildings

- `GET /api/building/:id` - Get building details
- `POST /api/building` - Create new building
- `PUT /api/building/:id` - Update building
- `DELETE /api/building/:id` - Soft delete building

### Apartments

- `GET /api/apartment/:id` - Get apartment details
- `POST /api/apartment` - Create new apartment
- `PUT /api/apartment/:id` - Update apartment
- `GET /api/apartment/exists` - Validate apartment (for QR authentication)

### Expenses

- `POST /api/expense` - Record electricity usage
- `GET /api/expense/apartment/:id` - Get expenses for apartment
- `GET /api/expense/building/:id` - Get all expenses for building
- `DELETE /api/expense/:id` - Delete expense record

## 🔐 Authentication & Authorization

The system uses JWT tokens with three permission levels:

1. **Admin**: Full system access, manage all buildings and apartments
2. **Moderator**: Building-specific access, manage apartments in their building
3. **Resident**: View personal apartment information and expenses

Middleware components:

- `auth.js` - Validates JWT token
- `admin.js` - Requires admin permissions
- `moderator.js` - Requires moderator permissions
- `building.js` - Validates building-level access
- `sameBuildingMod.js` - Ensures moderator belongs to the target building

## 📊 Data Models

### Building

- Name, email, address, city, state
- Soft delete support
- One-to-many relationship with apartments

### Apartment

- 4-digit PIN for authentication
- Apartment number (unique within building)
- Resident information (first name, last name, email)
- Moderator designation flag
- Reference to parent building

### Expense

- Time duration (in seconds)
- Power consumption (kWh)
- Cost calculation
- Timestamp of recording
- Reference to apartment

### Session

- Active user sessions
- Token management
- Automatic cleanup on server restart

## 🖥️ Dashboard Features

- **Admin Dashboard**: Overview of all buildings, apartments, and expenses
- **Moderator Dashboard**: Building-specific management
- **Apartment Dashboard**: Resident view of their expenses
- **Building List**: Browse and manage buildings
- **Apartment Management**: Add, edit, view apartments
- **Expense Tracking**: Visualize electricity usage over time
- **QR Code Generation**: Create QR codes for apartment authentication
- **Profile Management**: Update user information

## 🔧 Hardware Configuration

### Elevator Controller Pins

- **Buttons**: GPIO 19, 21, 22, 23 (floors 0-3)
- **IR Sensors**: GPIO 18, 5, 17, 16 (floors 0-3)
- **Motor Up**: GPIO 13
- **Motor Down**: GPIO 12
- **7-Segment Display**: Latch (26), Clock (25), Data (27)
- **Power Monitoring**: GPIO 34 (analog sensor)

### Camera Module

- ESP32-CAM with CAMERA_MODEL_AI_THINKER
- QR code scanning with 5-second cooldown
- HTTP validation with backend server

## 🎨 Frontend Theming

The dashboard supports light and dark modes with customizable Material-UI themes. Theme configuration is in `client/src/theme.js`.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd client
npm test
```

## 📦 Building for Production

### Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

### Backend

The backend runs in production mode with:

```bash
cd backend
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mohammad Youssef** (DarkHumor71) **Ahmad Ayoub** (AhmadAybb) 

## 🙏 Acknowledgments

- React Admin Dashboard template
- Material-UI component library
- ESP32 community and libraries
- KiCad for PCB design tools

## 📞 Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

**Note**: This is a development project. Ensure proper security measures (strong JWT secrets, HTTPS, input validation) before deploying to production.
