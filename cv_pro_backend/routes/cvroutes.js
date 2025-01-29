const express = require("express");
const multer = require("multer");
const { processCV } = require("../Controllers/cvcontroller");

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Define API Route
router.post("/process-cv", upload.single("cv"), processCV);

module.exports = router;
