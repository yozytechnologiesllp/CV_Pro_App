const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch all rows from a table
const getAllData = async (req, res) => {
    try {
        const { data, error } = await supabase.from("sample2").select("*");
        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Insert a new row into a table
const insertData = async (req, res) => {
    const { column1, column2 } = req.body;

    try {
        const { data, error } = await supabase.from("your_table_name").insert([
            { column1, column2 },
        ]);
        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (error) {
        console.error("Error inserting data:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a row in a table
const updateData = async (req, res) => {
    const { id, column1, column2 } = req.body;

    try {
        const { data, error } = await supabase
            .from("your_table_name")
            .update({ column1, column2 })
            .eq("id", id);
        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error updating data:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a row from a table
const deleteData = async (req, res) => {
    const { id } = req.body;

    try {
        const { data, error } = await supabase
            .from("your_table_name")
            .delete()
            .eq("id", id);
        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error deleting data:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllData,
    insertData,
    updateData,
    deleteData,
};
