/**
 * @file server.js
 * @description Entry point for the backend application. Sets up Express server, middleware, database connection, and routes.
 */

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

/**
 * @route   GET /
 * @desc    Basic route to confirm server is running
 * @access  Public
 */
app.get('/', (req, res) => res.send('Hello World!'));

// Init Middleware
app.use(express.json({ extended: false })); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Define API Routes
app.use('/api/auth', require('./routes/API/auth')); // Authentication routes
app.use('/api/building', require('./routes/API/building')); // Building management routes
app.use('/api/apartment', require('./routes/API/apartment')); // Apartment-related routes
app.use('/api/expense', require('./routes/API/expense')); // Expense tracking routes

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, '192.168.1.103', () =>
  console.log(`Example app listening on port ${PORT}!`),
);
