#!/bin/bash

echo "🚀 Starting First Media Admin System with SQLite Database..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Kill any process running on port 3000
echo "🔍 Checking port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use. Killing existing process..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create data directory if it doesn't exist
echo "📁 Creating data directory..."
mkdir -p data

# Start the unified server
echo "🚀 Starting unified server..."
echo ""
echo "✅ System is ready!"
echo ""
echo "🌐 Available URLs:"
echo "  🔐 Login Page (Main): http://localhost:3000/auth.html"
echo "  📊 Admin Panel: http://localhost:3000/admin"
echo "  🏠 Old Home Page: http://localhost:3000/Login.html"
echo "  📱 Dashboard: http://localhost:3000/dashboard.html"
echo "  💾 Database: SQLite (data/user_data.db)"
echo ""
echo "📝 Features:"
echo "  ✅ SQLite database storage"
echo "  ✅ Real-time data collection"
echo "  ✅ Search and filter functionality"
echo "  ✅ Export to CSV/JSON"
echo "  ✅ Admin panel with statistics"
echo ""
echo "🔄 Server will auto-restart on file changes"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

npm run dev 