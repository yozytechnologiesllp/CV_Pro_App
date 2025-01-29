const express = require("express");
const { processJD } = require("../Controllers/jdcontroller");

const router = express.Router();

// Define API Route
router.post("/extract-skills", processJD);

module.exports = router;
