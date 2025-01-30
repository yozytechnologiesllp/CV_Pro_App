require("dotenv").config();
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");
const { createClient } = require("@supabase/supabase-js");
const { supabaseAnalyze } = require("./supabaseAnalyze");
const mammoth = require("mammoth");
const path = require("path");

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Extract text from a PDF file
const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return "";
    }
};

// Extract text from a Word (DOCX) file
const extractTextFromWord = async (filePath) => {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        return data.value;
    } catch (error) {
        console.error("DOCX Parsing Error:", error);
        return "";
    }
};

// Function to process file based on type
const processFile = async (filePath, fileType) => {
    if (fileType === "pdf") {
        return await extractTextFromPDF(filePath);
    } else if (fileType === "docx") {
        return await extractTextFromWord(filePath);
    } else {
        throw new Error("Unsupported file format. Only PDF and DOCX are allowed.");
    }
};

// Function to analyze resume using OpenAI
const analyzeResumeWithOpenAI = async (jd, resumeText) => {
    const prompt = `
    You are an advanced ATS (Applicant Tracking System) AI. Analyze the following resume against the provided job description.
    Provide a match percentage, list of missing keywords, list of matching keywords, a short profile summary, 
    and detailed suggestions for improving the resume.

    **Resume:**
    ${resumeText}

    **Job Description:**
    ${jd}

    Format the response strictly in JSON:
    {
      "JD Match": "80%",
      "MissingKeywords": ["Docker", "Kubernetes"],
      "MatchingKeywords": ["React.js", "Node.js", "JavaScript"],
      "ProfileSummary": "This candidate is proficient in React and Node.js but lacks experience in cloud computing.",
      "Suggestions": [
        "Include a section on DevOps experience, specifically Docker and Kubernetes.",
        "Highlight projects that demonstrate cloud computing skills.",
        "Add certifications related to cloud technologies, such as AWS or Azure."
      ]
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Change to "gpt-4" if needed
            messages: [{ role: "user", content: prompt }],
            max_tokens: 600,
            temperature: 1,
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return { error: "Failed to analyze resume." };
    }
};


// Process JD and Resume
exports.processResume = async (req, res) => {
    const jd = req.body.jobDescription;
    const resumeFile = req.file;

    if (!jd || !resumeFile) {
        return res.status(400).json({ error: "Job description and resume are required." });
    }

    try {
        const fileExtension = path.extname(resumeFile.originalname).toLowerCase().replace(".", "");

        const resumeText = await processFile(resumeFile.path, fileExtension);
        const analysisResult = await analyzeResumeWithOpenAI(jd, resumeText);

        // Delete uploaded file after processing
        fs.unlinkSync(resumeFile.path);

        // Save results to Supabase
        await supabaseAnalyze(analysisResult);

        res.json(analysisResult);
    } catch (error) {
        console.error("Processing Error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

// Retrieve previous analysis results from Supabase
exports.getPreviousResults = async (req, res) => {
    try {
        const { data, error } = await supabase.from("analysis_results").select("*");
        if (error) {
            console.error("Supabase Retrieval Error:", error);
            return res.status(500).json({ error: "Failed to retrieve previous results." });
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
