require("dotenv").config();
const { OpenAI } = require("openai");
const { supabaseSkillExtract } = require("./supabaseSkillExtract");

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
            model: "gpt-3.5-turbo", // Change to "gpt-4" if needed
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 1,
        });

        // Extract response text
        const jsonResponse = response.choices[0].message.content.trim();

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
        if (skillsData?.error) {
            return res.status(400).json({ error: skillsData?.error })
        }
        // Save results to Supabase
        await supabaseSkillExtract(jdText, skillsData?.hard_skills, skillsData?.soft_skills);
        res.json(skillsData);
    } catch (error) {
        console.error("Error processing JD:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
