require("dotenv").config();
const { OpenAI } = require("openai");

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const extractSkillsWithOpenAI = async (jdText) => {
    const prompt = `
    Extract **hard skills** and **soft skills** from this Job Description.
    - Hard skills are technical skills (e.g., Python, React.js, Cloud Computing).
    - Soft skills are interpersonal skills (e.g., Communication, Leadership).
    - **Return ONLY JSON** in this format:
    
    {
      "hard_skills": ["Skill1", "Skill2"],
      "soft_skills": ["Skill3", "Skill4"]
    }

    **Job Description:**
    ${jdText}
  `;

    try {
        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Use the same working model
            messages: [
                { role: "system", content: "You are an AI that extracts skills from job descriptions." },
                { role: "user", content: prompt },
            ],
            temperature: 1,
            max_tokens: 512,
        });

        // Extract response text
        const jsonResponse = response.choices[0].message.content.trim();

        // Log OpenAI response for debugging
        console.log("OpenAI Response:", jsonResponse);

        // Ensure it's a valid JSON format
        return JSON.parse(jsonResponse);
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        return { error: "OpenAI failed to extract skills. Check logs." };
    }
};

// Process JD and Extract Skills
exports.processJD = async (req, res) => {
    const jdText = req.body.jobDescription;

    if (!jdText) {
        return res.status(400).json({ error: "No Job Description provided." });
    }

    try {
        const skillsData = await extractSkillsWithOpenAI(jdText);
        res.json(skillsData);
    } catch (error) {
        console.error("Error processing JD:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
