# Backend & Frontend Connection Guide

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd Hatchathon/backend
```

2. Set your Gemini API key as an environment variable:
```bash
export GEMINI_API_KEY='your-gemini-api-key-here'
```

OR use the start_server.sh script which already has the API key:
```bash
chmod +x start_server.sh
./start_server.sh
```

3. Install backend dependencies (if not already installed):
```bash
pip install fastapi uvicorn google-generative-ai python-multipart
```

4. Start the backend server:
```bash
python server.py
```

The backend will run on: `http://127.0.0.1:8000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Hatchathon/frontend
```

2. Install frontend dependencies (if not already installed):
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, if backend is not on default port):
```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will typically run on: `http://localhost:5173` (or another port shown in terminal)

## API Endpoints

### Backend Endpoints

1. **GET /health** - Health check endpoint
   - Returns: `{"status": "ok", "time": "..."}`

2. **POST /submit_feedback** - Submit initial feedback
   - Parameters:
     - `score` (int, required): NPS score 0-10
     - `transcription` (string, optional): Pre-transcribed text
     - `audio_data` (file, optional): Audio file (webm, mp3, wav, etc.)
   - Returns: JSON with transcription, sentiment, feedback points, conversationalResponse, and requiresFollowUp

3. **POST /submit_followup** - Submit follow-up response
   - Parameters:
     - `score` (int, required): Original NPS score
     - `conversation_history` (string, required): JSON string of conversation history
     - `transcription` (string, optional): Pre-transcribed text
     - `audio_data` (file, optional): Audio file
   - Returns: JSON with transcription, conversationalResponse, requiresFollowUp, and conversationComplete

## How It Works

### Voice Feedback Flow:
1. User records voice → Frontend captures audio blob
2. Frontend sends audio to backend `/submit_feedback` endpoint
3. Backend uploads audio to Gemini API
4. Gemini transcribes audio and analyzes feedback
5. Gemini returns: transcription, sentiment, feedback points, and conversational response
6. If `requiresFollowUp: true`, Gemini asks a follow-up question
7. User can respond via voice or text
8. Process repeats until conversation is complete

### Text Feedback Flow:
1. User types text → Frontend sends text to backend `/submit_feedback` endpoint
2. Backend sends text directly to Gemini API (faster, no transcription needed)
3. Gemini analyzes text feedback
4. Gemini returns: sentiment, feedback points, and conversational response
5. If `requiresFollowUp: true`, Gemini asks a follow-up question
6. User can respond via voice or text
7. Process repeats until conversation is complete

### Follow-up Flow:
1. After initial feedback, if `requiresFollowUp: true`, user sees follow-up question
2. User responds via voice or text
3. Frontend sends to backend `/submit_followup` endpoint with conversation history
4. Backend sends to Gemini with full conversation context
5. Gemini generates contextual response
6. If more details needed, another follow-up is asked
7. Once complete, conversation is saved to `conversations/` directory

## Testing the Connection

1. Check backend is running:
```bash
curl http://127.0.0.1:8000/health
```

2. Check frontend console logs - you should see:
   - `📤 Sending initial feedback to backend: http://127.0.0.1:8000`
   - `✅ Received response from backend: {...}`

3. Check backend terminal logs - you should see:
   - `Using frontend transcription for initial feedback` (for text)
   - `Upload error: ...` or success messages (for audio)
   - `Raw model response (truncated): ...`

## Troubleshooting

### Frontend can't connect to backend:
- Make sure backend is running on `http://127.0.0.1:8000`
- Check CORS settings in `server.py` (currently allows all origins)
- Verify `VITE_BACKEND_URL` in frontend `.env` file matches backend URL

### Gemini API errors:
- Verify `GEMINI_API_KEY` is set correctly
- Check API key is valid and has proper permissions
- Check backend terminal for error messages

### Audio not working:
- Check browser permissions for microphone access
- Verify audio format is supported (webm recommended)
- Check browser console for errors

### Text feedback not working:
- Verify text input is not empty before submitting
- Check backend receives transcription in FormData
- Verify Gemini API is responding correctly

