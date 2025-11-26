# survAI – Voice Feedback Intelligence 🎤🤖

**Hackathon Project | Built with FastAPI, Python, React, Gemini API**

survAI is a real-time voice feedback platform designed to replace manual surveys with automated sentiment analysis. It helps businesses understand customer emotions instantly and make actionable decisions to improve customer satisfaction and retention.

---

## 🏆 Hackathon Context
Built as part of a team of 5 for the Hatchathon 2025, survAI demonstrates a full-stack solution integrating voice-to-text conversion, LLM-based sentiment analysis, and a clean, responsive frontend.

---

## ⚙️ Features
- Record or upload voice feedback and convert it to text in real-time.
- Analyze customer sentiment using LLM (Gemini API) pipelines.
- Dashboard displays insights and trends from collected feedback.
- Designed for high-volume sectors like retail and e-commerce.

---

## 🛠️ Tech Stack
- **Frontend:** React, React Hooks, Tailwind CSS
- **Backend:** FastAPI, Python
- **AI Integration:** Gemini API for sentiment analysis, Speech-to-Text models
- **Database:** SQLite (for prototype)
- **Version Control:** Git, GitHub

---

## 📁 Project Structure
survAI/
├── frontend/ # React app for recording and viewing feedback
├── backend/ # FastAPI server for processing voice and analysis
├── models/ # Pre-trained models for speech-to-text and sentiment
├── requirements.txt # Python dependencies
└── README.md

yaml
Copy code

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Installation
1. Clone the repo:
```bash
git clone https://github.com/Ankit0200/survAI.git
cd survAI
Install backend dependencies:

bash
Copy code
cd backend
pip install -r requirements.txt
Install frontend dependencies:

bash
Copy code
cd frontend
npm install
npm start
Run the FastAPI server:

bash
Copy code
uvicorn main:app --reload
Open the frontend at http://localhost:3000 and start recording feedback.



📌 Notes
Built as a hackathon prototype; improvements can include authentication, persistent database storage, and cloud deployment.

Gemini API keys are required for sentiment analysis.

📄 License
MIT License © 2025 Ankit Devkota







