
# CV Pro - JD Parsing & Skill Extraction

## 🚀 Overview
CV Pro is an AI-powered tool that extracts and categorizes **hard and soft skills** from job descriptions using **OpenAI GPT**. Users can edit and save the results, which are stored in **Supabase**.

## 🎯 Features
✅ Extract skills from job descriptions  
✅ Categorize skills into **Hard Skills** & **Soft Skills**  
✅ Allow users to verify and edit extracted skills  
✅ Save & Retrieve data from **Supabase**  
✅ **React.js + Vite (Frontend), Node.js (Backend), OpenAI, Supabase**  

---

## 🛠️ Tech Stack
### **Frontend**
- **React.js + Vite** (UI)
- **Axios** (API calls)
- **Ant Design** (Styling)

### **Backend**
- **Node.js** (Server)
- **Express.js** (API handling)
- **OpenAI API** (LLM skill extraction)
- **Supabase** (Database)

---

## 🏗️ Project Setup

### **1️⃣ Install Dependencies**
Clone the repository:
```bash
git clone https://github.com/yourusername/cv_pro_project.git

## Frontend Setup 
cd CV_PRO_FRONTEND
npm install
npm run dev

## Backend Setup 
cd CV_PRO_BACKEND
npm install
npm start


 📂 cv_pro_project
 ├── 📂 CV_PRO_FRONTEND (React Frontend)
 │    ├── src/
 │    │    ├── components/  # Reusable UI components
 │    │    ├── pages/       # Page-level components
 │    │    ├── App.js       # Main component
 │    │    ├── index.js     # Entry point
 │    ├── package.json      # Dependencies
 ├── 📂 CV_PRO_BACKEND (Node.js Backend)
 │    ├── controllers/      # API logic
 │    ├── routes/           # API endpoints
 │    ├── server.js         # Main server file
 │    ├── package.json      # Dependencies
 │    ├── .env              # Environment variables
 ├── README.md              # Project documentation
 ├── LICENSE (Optional)     # License information

🔑 Environment Variables
Backend (.env)
-PORT=3001
-OPENAI_API_KEY=your_openai_api_key
-SUPABASE_URL=your_supabase_url
-SUPABASE_KEY=your_supabase_key

🚀 Running the Project

1️⃣ Start the Backend
cd CV_PRO_BACKTEND
npm start
The backend will run on http://localhost:3001

2️⃣ Start the Frontend
cd CV_PRO_FRONTEND
npm run dev
The frontend will run on http://localhost:3000