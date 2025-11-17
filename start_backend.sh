#!/bin/bash

# Script to start the backend server
cd "$(dirname "$0")/backend"

# Set the Gemini API key
export GEMINI_API_KEY='AIzaSyCkfQWUwMoC8kXVu9UjIWqFCXQwh4o3uJ8'

# Kill any existing server on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "🚀 Starting FastAPI backend server..."
echo "📍 Server will run on: http://127.0.0.1:8000"
echo "🔑 Gemini API Key: ${GEMINI_API_KEY:0:10}..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 server.py

