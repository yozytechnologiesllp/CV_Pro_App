const express = require("express");
const multer = require("multer");
const { processResume, getPreviousResults } = require("../Controllers/atscontroller");

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// API Routes
router.post("/analyze-cv", upload.single("cv"), processResume);
router.get("/previous-results", getPreviousResults);

module.exports = router;
