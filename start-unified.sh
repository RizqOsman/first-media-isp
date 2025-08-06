#!/bin/bash

# First Media Authentication System - Unified Server Startup Script
# This script runs everything on port 3000 using Node.js

echo "🚀 Starting First Media Authentication System (Unified)..."
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed!"
    echo "Please install npm (comes with Node.js)"
    exit 1
fi

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Warning: Port 3000 is already in use!"
    echo "Killing existing process on port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies!"
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
fi

# Start the unified server
echo "🔧 Starting unified server on port 3000..."
echo "================================================"
echo "🔐 Login Page (Main): http://172.15.1.21:3000/auth.html"
echo "📊 Admin Panel: http://172.15.1.21:3000/admin"
echo "🏠 Old Home Page: http://172.15.1.21:3000/Login.html"
echo "📱 Dashboard: http://172.15.1.21:3000/dashboard.html"
echo "================================================"
echo "Press Ctrl+C to stop server"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down server..."
    echo "👋 Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the unified server
node unified-server.js 