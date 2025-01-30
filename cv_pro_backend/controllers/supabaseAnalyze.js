require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🟢 Function to Save Analysis Results to Supabase
const supabaseAnalyze = async (analysisResult) => {
    try {
        const { data, error } = await supabase
            .from("Analyzed_CV") // Your Supabase table name
            .insert({
                match_percentage: analysisResult["JD Match"],
                matching_keywords: analysisResult["MatchingKeywords"],
                missing_keywords: analysisResult["MissingKeywords"],
                profile_summary: analysisResult["ProfileSummary"],
            });

        if (error) {
            console.error("Supabase Error:", error);
            return { error: "Failed to save results to database." };
        }

        return { success: "Results successfully saved to Supabase!" };
    } catch (error) {
        console.error("Supabase Insert Error:", error);
        return { error: "Database insertion failed." };
    }
};

module.exports = { supabaseAnalyze };
