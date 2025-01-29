const { OpenAI } = require("openai");
const axios = require("axios");
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Controller function to interact with OpenAI
const analyzeData = async (req, res) => {
    const { prompt, model = "gpt-3.5-turbo" } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt is required." });
    }

    try {
        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that analyzes user input.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        // Extract and return the response
        const message = response.choices[0].message.content;
        return res.json({ success: true, message });
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to process the request." });
    }
};

// Test OpenAI connection
const testOpenAIConnection = async (req, res) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Say hello!" }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json({
            success: true,
            message: response.data.choices[0].message.content,
        });
    } catch (error) {
        console.error("Axios Error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || "Failed to connect to OpenAI.",
        });
    }
};


module.exports = {
    analyzeData, testOpenAIConnection,
};
