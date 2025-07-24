#!/bin/bash

# KONIVRER Deck Database - Deployment Setup Script
# This script helps set up the deployment configuration

set -e

echo "🚀 KONIVRER Deck Database - Deployment Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Checking project structure..."

# Check for required files
required_files=(
    "package.json"
    "vite.config.js"
    "vercel.json"
    "Backend/package.json"
    "Backend/server.js"
    "Backend/render.yaml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing $file"
        exit 1
    fi
done

echo ""
print_info "Setting up environment files..."

# Create .env file for local development if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_status "Created .env file from .env.example"
    print_warning "Please update .env with your actual values"
else
    print_info ".env file already exists"
fi

# Create backend .env file if it doesn't exist
if [ ! -f "Backend/.env" ]; then
    cp Backend/.env.example Backend/.env
    print_status "Created Backend/.env file from Backend/.env.example"
    print_warning "Please update Backend/.env with your actual values"
else
    print_info "Backend/.env file already exists"
fi

echo ""
print_info "Installing dependencies..."

# Install frontend dependencies
if [ -d "node_modules" ]; then
    print_info "Frontend dependencies already installed"
else
    npm install
    print_status "Frontend dependencies installed"
fi

# Install backend dependencies
cd Backend
if [ -d "node_modules" ]; then
    print_info "Backend dependencies already installed"
else
    npm install
    print_status "Backend dependencies installed"
fi
cd ..

echo ""
print_info "Testing build process..."

# Test frontend build
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

echo ""
print_info "Deployment setup complete!"
echo ""
echo "📋 Next Steps:"
echo "==============="
echo ""
echo "1. 🗄️  Set up MongoDB Atlas:"
echo "   - Go to https://mongodb.com/atlas"
echo "   - Create a cluster and get connection string"
echo ""
echo "2. 🖥️  Deploy Backend to Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'Backend'"
echo "   - Add environment variables (see Backend/.env.example)"
echo ""
echo "3. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Import your GitHub repository"
echo "   - Add environment variables (see .env.example)"
echo "   - Update VITE_BACKEND_URL with your Render URL"
echo ""
echo "4. 🔗 Update CORS:"
echo "   - Update FRONTEND_URL in Render with your Vercel URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
print_status "Setup complete! Happy deploying! 🎉"