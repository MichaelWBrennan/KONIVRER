#!/bin/bash

# 🤖 KONIVRER Auto-Start Script - ZERO MANUAL COMMANDS REQUIRED
# This script automatically starts the autonomous automation system

echo "🚀 KONIVRER Auto-Start: Initializing autonomous automation..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js if not present
install_nodejs() {
    if ! command_exists node; then
        echo "📦 Installing Node.js..."
        if command_exists curl; then
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command_exists wget; then
            wget -qO- https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            echo "⚠️ Please install Node.js manually"
            exit 1
        fi
    fi
}

# Function to auto-install dependencies
auto_install_deps() {
    if [ ! -d "node_modules" ]; then
        echo "📦 Auto-installing dependencies..."
        if command_exists npm; then
            npm install --silent
        else
            echo "⚠️ npm not found, installing..."
            install_nodejs
            npm install --silent
        fi
    fi
}

# Function to start automation in background
start_automation() {
    echo "🤖 Starting autonomous automation in background..."
    
    # Kill any existing automation processes
    pkill -f "automation/all-in-one.ts" 2>/dev/null || true
    
    # Start autonomous automation in background
    nohup npm run autonomous > automation-auto.log 2>&1 &
    AUTOMATION_PID=$!
    
    echo "✅ Autonomous automation started (PID: $AUTOMATION_PID)"
    echo "📝 Logs available in: automation-auto.log"
    
    # Save PID for later management
    echo $AUTOMATION_PID > .automation.pid
}

# Function to setup git hooks
setup_git_hooks() {
    echo "🔧 Setting up git hooks for auto-start..."
    
    # Create git hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Post-checkout hook (runs after git checkout)
    cat > .git/hooks/post-checkout << 'EOF'
#!/bin/bash
echo "🔄 Git checkout detected, auto-starting automation..."
./auto-start.sh &
EOF
    
    # Post-merge hook (runs after git merge/pull)
    cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash
echo "🔄 Git merge detected, auto-starting automation..."
./auto-start.sh &
EOF
    
    # Make hooks executable
    chmod +x .git/hooks/post-checkout
    chmod +x .git/hooks/post-merge
    
    echo "✅ Git hooks configured"
}

# Function to create auto-start service
create_auto_service() {
    echo "🔧 Creating auto-start service..."
    
    cat > auto-service.sh << 'EOF'
#!/bin/bash
# Auto-start service that runs in background

while true; do
    # Check if automation is running
    if ! pgrep -f "automation/all-in-one.ts" > /dev/null; then
        echo "🔄 Automation not running, restarting..."
        ./auto-start.sh
    fi
    
    # Wait 30 seconds before checking again
    sleep 30
done
EOF
    
    chmod +x auto-service.sh
    
    # Start the service in background
    nohup ./auto-service.sh > auto-service.log 2>&1 &
    echo $! > .auto-service.pid
    
    echo "✅ Auto-start service created and running"
}

# Function to create desktop shortcut (if in GUI environment)
create_desktop_shortcut() {
    if [ -n "$DISPLAY" ] && [ -d "$HOME/Desktop" ]; then
        echo "🖥️ Creating desktop shortcut..."
        
        cat > "$HOME/Desktop/KONIVRER-Automation.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=KONIVRER Autonomous Automation
Comment=Start KONIVRER autonomous automation system
Exec=$(pwd)/auto-start.sh
Icon=utilities-terminal
Terminal=true
Categories=Development;
EOF
        
        chmod +x "$HOME/Desktop/KONIVRER-Automation.desktop"
        echo "✅ Desktop shortcut created"
    fi
}

# Main execution
main() {
    echo "🤖 KONIVRER AUTONOMOUS AUTO-START"
    echo "=================================="
    echo "🎯 Goal: ZERO manual commands required"
    echo ""
    
    # Change to script directory
    cd "$(dirname "$0")"
    
    # Install Node.js if needed
    install_nodejs
    
    # Auto-install dependencies
    auto_install_deps
    
    # Setup git hooks
    setup_git_hooks
    
    # Start automation
    start_automation
    
    # Create auto-start service
    create_auto_service
    
    # Create desktop shortcut if possible
    create_desktop_shortcut
    
    echo ""
    echo "🎉 AUTO-START COMPLETE!"
    echo "========================"
    echo "✅ Autonomous automation is now running in background"
    echo "✅ Git hooks configured for auto-restart"
    echo "✅ Auto-service monitoring automation health"
    echo "✅ Zero manual intervention required"
    echo ""
    echo "📊 Status:"
    echo "   Automation PID: $(cat .automation.pid 2>/dev/null || echo 'Not found')"
    echo "   Service PID: $(cat .auto-service.pid 2>/dev/null || echo 'Not found')"
    echo "   Logs: automation-auto.log, auto-service.log"
    echo ""
    echo "🔄 The system will automatically:"
    echo "   - Restart automation if it stops"
    echo "   - Start automation after git operations"
    echo "   - Monitor and heal itself continuously"
    echo "   - Require ZERO human interaction"
}

# Run main function
main "$@"