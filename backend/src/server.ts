/**
 * @file server.ts
 * @description Entry point for the backend application. Sets up Express server, middleware, database connection, and routes.
 */

import express from "express";
import connectDB from "./config/db";
import cors = require("cors");
import { Request, Response } from "express";
import auth from "./routes/API/auth";
import building from "./routes/API/building";
import apartment from "./routes/API/apartment";
import expense from "./routes/API/expense";

const app = express();

// Connect to MongoDB
connectDB();
app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

// Init Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Define API Routes
app.use("/api/auth", auth); // Authentication routes
app.use("/api/building", building); // Building management routes
app.use("/api/apartment", apartment); // Apartment-related routes
app.use("/api/expense", expense); // Expense tracking routes

// Define Port
const PORT = parseInt(process.env.PORT || "5000", 10);

// Start Server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`EleSystem listening on port ${PORT}!`)
);
