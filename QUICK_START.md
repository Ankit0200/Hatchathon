# Quick Start Guide - Fix Backend/Frontend Connection

## Problem
After merge, backend and frontend are not connecting and Gemini responses are not working.

## Solution

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
chmod +x start_server.sh  # if not already executable
./start_server.sh
```

OR manually:

```bash
cd backend
export GEMINI_API_KEY='AIzaSyCkfQWUwMoC8kXVu9UjIWqFCXQwh4o3uJ8'
python3 server.py
```

The backend should start on `http://127.0.0.1:8000`

You should see:
- `✅ Gemini API configured`
- `Starting server on http://127.0.0.1:8000`

### Step 2: Start the Frontend Server

Open a **NEW** terminal window and run:

```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

The frontend should start on `http://localhost:5173` (or similar port shown in terminal)

### Step 3: Verify Connection

1. Open your browser to the frontend URL (usually `http://localhost:5173`)
2. Open browser Developer Tools (F12 or Cmd+Option+I)
3. Go to Console tab
4. You should see: `✅ Backend connected: {status: "ok", time: "..."}`

### Step 4: Test the Flow

1. Select a score (0-10)
2. Type some feedback OR click "Start Recording"
3. Click "Submit Feedback"
4. Check:
   - Browser console for any errors
   - Backend terminal for API calls and Gemini responses

## Troubleshooting

### Backend won't start:
- Check if port 8000 is already in use: `lsof -i :8000`
- Make sure GEMINI_API_KEY is set
- Check Python dependencies: `pip install -r requirements.txt`

### Frontend can't connect:
- Make sure backend is running first
- Check browser console for CORS errors
- Verify BACKEND_URL in frontend/src/Components/RateUs.jsx (should be `http://127.0.0.1:8000`)

### Gemini not responding:
- Check if GEMINI_API_KEY is valid
- Check backend terminal for API errors
- Verify API key has proper permissions

## Backend URL Configuration

The frontend uses this backend URL:
- Default: `http://127.0.0.1:8000`
- Can be overridden with environment variable: `VITE_BACKEND_URL`

The backend URL is set in:
- `frontend/src/Components/RateUs.jsx` (line 9)
- `frontend/src/Components/Dashboard.jsx` (line 19)

Both use: `import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"`

