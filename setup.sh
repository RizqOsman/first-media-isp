#!/bin/bash

# Setup script for First Media Authentication System
# This script makes bash files executable and provides setup instructions

echo "🔧 Setting up First Media Authentication System..."
echo "================================================"

# Make bash scripts executable
echo "📝 Making bash scripts executable..."
chmod +x start-server.sh
chmod +x start-unified.sh
chmod +x setup.sh

echo "✅ Scripts are now executable!"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    echo "For macOS (using Homebrew):"
    echo "  brew install node"
    echo ""
    echo "For Ubuntu/Debian:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    echo "For Windows:"
    echo "  Download from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js is installed (version: $(node --version))"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
else
    echo "✅ npm is installed (version: $(npm --version))"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Available commands:"
echo "  ./start-server.sh     - Run with separate ports (admin:3000, html:8080)"
echo "  ./start-unified.sh    - Run everything on port 3000 (RECOMMENDED)"
echo ""
echo "🚀 Quick start:"
echo "  ./start-unified.sh"
echo ""
echo "📱 Access URLs (after running start-unified.sh):"
echo "  🔐 Login Page (Main): http://172.15.1.21:3000/auth.html"
echo "  📊 Admin Panel: http://172.15.1.21:3000/admin"
echo "  🏠 Old Home Page: http://172.15.1.21:3000/Login.html"
echo "  📱 Dashboard: http://172.15.1.21:3000/dashboard.html"
echo ""
echo "💡 Tips:"
echo "  - Press Ctrl+C to stop the server"
echo "  - All data is saved to ./data/user_data.json"
echo "  - Admin panel auto-refreshes every 30 seconds"
echo "" 