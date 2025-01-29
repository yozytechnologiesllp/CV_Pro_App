const express = require("express");
const { analyzeData, testOpenAIConnection } = require("../Controllers/openaicontroller");

const router = express.Router();

// POST route to interact with OpenAI API
router.post("/analyze", analyzeData);
router.get("/test", testOpenAIConnection)

module.exports = router;
