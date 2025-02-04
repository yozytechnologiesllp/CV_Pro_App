const express = require("express");
const cors = require("cors");
const jdRoutes = require("./routes/jdroutes");
const atsRoutes = require("./routes/atsroutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// API Routes
app.use("/api", jdRoutes);
app.use("/api", atsRoutes);

// Export the Express app for Vercel
module.exports = app;
