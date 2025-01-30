require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🟢 Function to Save Extracted Skills to Supabase
const supabaseSkillExtract = async (Job_Description, hard_skills, soft_skills) => {
    try {
        const { data, error } = await supabase
            .from("Extracted_Skills") // Your Supabase table name
            .insert([{
                Job_Description,
                Hard_Skills: hard_skills,
                Soft_Skills: soft_skills
            }], { onConflict: ["Job_Description"] }); // Ensures uniqueness on Job_Description

        if (error) {
            if (error.code === '23505') {
                console.warn("Duplicate entry detected. Consider using upsert.");
                return { error: "This job description already exists." };
            }
            console.error("Supabase Error:", error);
            return { error: "Failed to save results to database." };
        }

        return { success: "Results successfully saved to Supabase!", data };
    } catch (error) {
        console.error("Supabase Insert Error:", error);
        return { error: "Database insertion failed." };
    }
};

module.exports = { supabaseSkillExtract };
