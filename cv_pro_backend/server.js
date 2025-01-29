const express = require("express");
const cors = require("cors");
const openaiRoute = require("./routes/openaiRoute");
const supabaseRoute = require("./routes/supbaseRoute")
const cvroutes = require("./routes/cvroutes");
const jdRoutes = require("./routes/jdroutes");
const atsRoutes = require("./routes/atsroutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use the OpenAI route
app.use("/api/openai", openaiRoute);
app.use("/api/supabase", supabaseRoute);
// app.use("/api", cvroutes);
app.use("/api", jdRoutes);
app.use("/api", atsRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
