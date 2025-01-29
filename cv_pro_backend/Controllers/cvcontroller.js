require("dotenv").config();
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
};

// Extract text from DOCX
const extractTextFromDocx = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
};

// Analyze CV using OpenAI
const analyzeCVWithOpenAI = async (cvText, jdText) => {
    const prompt = `
    I have uploaded my CV and a job description (JD). Analyze my CV against the JD and provide:
    - Missing skills/keywords
    - Recommended improvements
    - ATS optimization suggestions
    - Areas to strengthen my experience

    **My CV:**  
    ${cvText}

    **Job Description:**  
    ${jdText}

    Provide clear, structured feedback.
  `;

    try {
        const response = await openai.completions.create({
            model: "gpt-4",
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.7,
        });

        return response.choices[0].text.trim();
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "Error processing CV analysis.";
    }
};

// Process CV and Generate Suggestions
exports.processCV = async (req, res) => {
    if (!req.file || !req.body.jobDescription) {
        return res.status(400).json({ error: "Missing CV or Job Description" });
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription;
    let cvText = "";

    try {
        // Extract text from CV
        if (req.file.mimetype === "application/pdf") {
            cvText = await extractTextFromPDF(filePath);
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cvText = await extractTextFromDocx(filePath);
        } else {
            return res.status(400).json({ error: "Unsupported file type" });
        }

        // Call OpenAI for analysis
        const suggestions = await analyzeCVWithOpenAI(cvText, jobDescription);

        res.json({ cvText, suggestions });

        // Cleanup uploaded file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error processing CV:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
