#!/bin/bash

echo "🚀 Starting Backend and Frontend Servers"
echo "=========================================="
echo ""

# Check if backend is already running
if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is already running on http://127.0.0.1:8000"
else
    echo "📦 Starting Backend Server..."
    cd "$(dirname "$0")/backend"
    export GEMINI_API_KEY='AIzaSyCkfQWUwMoC8kXVu9UjIWqFCXQwh4o3uJ8'
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    python3 server.py &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
    sleep 2
    if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "✅ Backend is responding!"
    else
        echo "❌ Backend failed to start. Check logs."
        exit 1
    fi
fi

echo ""
echo "📦 Starting Frontend Server..."
cd "$(dirname "$0")/frontend"
npm run dev

