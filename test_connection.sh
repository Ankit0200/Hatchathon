#!/bin/bash
echo "Testing backend connection..."
echo "1. Checking if backend is running..."
if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    curl -s http://127.0.0.1:8000/health | python3 -m json.tool
else
    echo "❌ Backend is NOT running!"
    echo "Please start the backend server with:"
    echo "  cd backend && python3 server.py"
    echo "Or use: cd backend && ./start_server.sh"
fi
