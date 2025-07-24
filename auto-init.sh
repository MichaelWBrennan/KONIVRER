#!/bin/bash
# KONIVRER Auto-Init System
# This script automatically starts the development environment
# without requiring any npm commands.

# Check if this is the first time running
if [ ! -f ".auto-init-ran" ]; then
  echo "🚀 First time initialization - setting up KONIVRER development environment..."
  
  # Install dependencies if node_modules doesn't exist
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --silent
  fi
  
  # Create marker file
  touch .auto-init-ran
  
  # Start development server
  echo "🌐 Starting development server..."
  npm run dev &
  
  # Open browser after a short delay
  (sleep 3 && open http://localhost:12000 || xdg-open http://localhost:12000 || start http://localhost:12000) &
else
  # Not first time, just start the server
  echo "🔄 Starting KONIVRER development environment..."
  npm run dev &
  
  # Open browser after a short delay
  (sleep 2 && open http://localhost:12000 || xdg-open http://localhost:12000 || start http://localhost:12000) &
fi

# Create a Git hook to auto-start when repository is accessed
if [ ! -f ".git/hooks/post-checkout" ]; then
  echo "🔄 Setting up Git hooks for auto-start..."
  mkdir -p .git/hooks
  
  # Create post-checkout hook
  cat > .git/hooks/post-checkout << 'EOF'
#!/bin/bash
# Auto-start development environment after checkout
./auto-init.sh &
EOF
  
  # Make hook executable
  chmod +x .git/hooks/post-checkout
  
  # Create post-merge hook (runs after pull)
  cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash
# Auto-start development environment after pull
./auto-init.sh &
EOF
  
  # Make hook executable
  chmod +x .git/hooks/post-merge
fi

echo "✅ KONIVRER environment initialized successfully!"
echo "🌐 Access the application at: http://localhost:12000"