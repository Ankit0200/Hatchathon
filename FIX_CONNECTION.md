# 🔧 FIX: Backend/Frontend Connection Issue

## ✅ Current Status
- ✅ Backend server is RUNNING on http://127.0.0.1:8000
- ✅ Gemini API is WORKING (tested successfully)
- ✅ Backend endpoints are responding correctly

## 🚀 Quick Fix (Do This Now)

### Option 1: Use the startup script (EASIEST)
```bash
cd /Users/prashrittiwari/Desktop/hackk/Hatchathon
./start_backend.sh
```

Then in a **NEW terminal window**:
```bash
cd /Users/prashrittiwari/Desktop/hackk/Hatchathon/frontend
npm run dev
```

### Option 2: Manual Start

**Terminal 1 (Backend):**
```bash
cd backend
export GEMINI_API_KEY='AIzaSyCkfQWUwMoC8kXVu9UjIWqFCXQwh4o3uJ8'
python3 server.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 🔄 After Starting Servers

1. **Open your browser** to the frontend URL (usually `http://localhost:5173`)
2. **Open Browser DevTools** (F12 or Cmd+Option+I)
3. **Go to Console tab**
4. **Hard Refresh** the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
5. You should see: `✅ Backend connected: {status: "ok", time: "..."}`

## ✅ Verification

Test if backend is running:
```bash
curl http://127.0.0.1:8000/health
```

Should return: `{"status":"ok","time":"..."}`

## ❌ If Still Not Working

1. **Check if backend is actually running:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```

2. **Check browser console** for errors

3. **Check backend terminal** for error messages

4. **Make sure both servers are running:**
   - Backend: http://127.0.0.1:8000
   - Frontend: http://localhost:5173 (or whatever port Vite shows)

## 📝 Important Notes

- Backend MUST be running BEFORE you open the frontend
- If you close the backend terminal, the server stops
- Always start backend first, then frontend
- Keep both terminals open while working

