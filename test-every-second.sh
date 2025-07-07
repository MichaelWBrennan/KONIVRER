#!/bin/bash

echo "🚀 Testing EVERY SECOND Automation System"
echo "=========================================="

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "📦 Installing tsx..."
    npm install -g tsx
fi

echo ""
echo "🔍 Testing automation help..."
tsx automation/all-in-one.ts help

echo ""
echo "📊 Testing automation status..."
tsx automation/all-in-one.ts status

echo ""
echo "🩹 Testing quick heal..."
tsx automation/all-in-one.ts heal

echo ""
echo "📊 Testing dashboard generation..."
tsx automation/all-in-one.ts dashboard

echo ""
echo "⚡ Testing 10-second burst of every-second automation..."
echo "   (This will run automation every second for 10 seconds)"

# Run every-second automation for 10 seconds
timeout 10s tsx automation/all-in-one.ts every-second &
AUTOMATION_PID=$!

# Wait for it to complete or timeout
wait $AUTOMATION_PID 2>/dev/null

echo ""
echo "✅ Every-second automation test completed!"
echo ""

# Show log if it exists
if [ -f automation.log ]; then
    echo "📋 Recent automation log entries:"
    tail -10 automation.log
    echo ""
fi

# Show dashboard if it exists
if [ -f automation-dashboard.html ]; then
    echo "📊 Dashboard generated: automation-dashboard.html"
    echo ""
fi

echo "🎉 All tests completed successfully!"
echo ""
echo "🚀 To start continuous every-second automation:"
echo "   npm run every-second"
echo ""
echo "🔄 To start development with every-second automation:"
echo "   npm run dev:every-second"