#!/bin/bash

# 🚀 KONIVRER One-Command Setup - ZERO MANUAL STEPS
# Run this ONCE and everything works automatically forever

echo "🚀 KONIVRER ONE-COMMAND SETUP"
echo "=============================="
echo "🎯 Setting up autonomous automation that requires ZERO manual commands"
echo ""

# Function to check if running in CI/automated environment
is_automated_env() {
    [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$AUTOMATION" ]
}

# Function to install dependencies automatically
auto_setup() {
    echo "📦 Auto-installing dependencies..."
    
    # Install dependencies with automatic yes responses
    if command -v npm >/dev/null 2>&1; then
        echo "y" | npm install
    else
        echo "⚠️ npm not found, please install Node.js first"
        exit 1
    fi
    
    echo "✅ Dependencies installed"
}

# Function to make everything executable
make_executable() {
    echo "🔧 Making scripts executable..."
    chmod +x auto-start.sh
    chmod +x setup.sh
    echo "✅ Scripts are executable"
}

# Function to create instant-start alias
create_instant_alias() {
    echo "⚡ Creating instant-start alias..."
    
    # Create a simple start command
    cat > start << 'EOF'
#!/bin/bash
echo "🚀 Starting KONIVRER autonomous automation..."
./auto-start.sh
EOF
    
    chmod +x start
    echo "✅ Created './start' command for instant startup"
}

# Function to create README for users
create_user_readme() {
    echo "📝 Creating user instructions..."
    
    cat > QUICK-START.md << 'EOF'
# 🚀 KONIVRER Quick Start - ZERO COMMANDS NEEDED

## Instant Setup (One Time Only)
```bash
./setup.sh
```

## Instant Start (Anytime)
```bash
./start
```

## That's It! 🎉

The system will automatically:
- ✅ Install all dependencies
- ✅ Start autonomous automation
- ✅ Monitor and heal itself
- ✅ Auto-commit and push changes
- ✅ Require ZERO manual intervention

## What Happens Automatically:
- 🤖 Every-second automation monitoring
- 🔧 Auto-fix TypeScript issues
- 🛡️ Auto-update security vulnerabilities  
- 🎯 Auto-fix code quality issues
- ⚡ Auto-optimize performance
- 🩹 Auto-heal system issues
- 📝 Auto-commit all changes
- 🚀 Auto-push to remote
- 🔄 Auto-restart on git operations

## Status Check:
```bash
# Check if automation is running
ps aux | grep automation

# View logs
tail -f automation-auto.log
```

## Zero Human Interaction Required! 🤖
EOF
    
    echo "✅ Created QUICK-START.md with user instructions"
}

# Main setup function
main() {
    echo "🔧 Running one-time setup..."
    
    # Make scripts executable
    make_executable
    
    # Auto-install dependencies
    auto_setup
    
    # Create instant-start alias
    create_instant_alias
    
    # Create user readme
    create_user_readme
    
    echo ""
    echo "🎉 SETUP COMPLETE!"
    echo "=================="
    echo "✅ All dependencies installed"
    echo "✅ Autonomous automation configured"
    echo "✅ Zero-interaction system ready"
    echo ""
    echo "🚀 TO START AUTOMATION:"
    echo "   ./start"
    echo ""
    echo "📖 FOR MORE INFO:"
    echo "   cat QUICK-START.md"
    echo ""
    echo "🤖 The system will now work completely automatically!"
    echo "   No more manual commands needed EVER!"
    
    # Auto-start if in automated environment
    if is_automated_env; then
        echo ""
        echo "🤖 Detected automated environment, auto-starting..."
        ./auto-start.sh
    else
        echo ""
        echo "💡 Run './start' to begin autonomous automation"
    fi
}

# Run main setup
main "$@"