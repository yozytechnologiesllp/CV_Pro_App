const express = require("express");
const cors = require("cors");
const jdRoutes = require("./routes/jdroutes");
const atsRoutes = require("./routes/atsroutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use the OpenAI route
app.use("/api", jdRoutes);
app.use("/api", atsRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
