#!/bin/bash

# Data Migration App - Quick Start Script

echo "🚀 Starting Data Migration Application..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --legacy-peer-deps
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if database exists
if [ ! -f "backend/database.sqlite" ]; then
    echo "🗄️  Initializing database..."
    cd backend && npm run db:push && cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📍 Starting servers..."
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:5173"
echo ""
echo "⚠️  Opening two terminal windows..."
echo "   Press Ctrl+C in each to stop"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
npm run dev

# When frontend stops, stop backend too
kill $BACKEND_PID

