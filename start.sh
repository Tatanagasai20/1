#!/bin/bash

echo "🚀 Starting Kickstart Portal..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd server
npm install

echo "📦 Installing frontend dependencies..."
cd ../client
npm install

echo "🔧 Setting up environment..."
cd ../server
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your database credentials!"
fi

echo "🌐 Starting backend server..."
cd ../server
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

echo "🎨 Starting frontend..."
cd ../client
npm start &
FRONTEND_PID=$!

echo "✅ Kickstart Portal is starting!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait