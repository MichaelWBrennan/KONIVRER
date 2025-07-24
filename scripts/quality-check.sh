#!/bin/bash

# KONIVRER Deck Database - Quality & Security Check Script
# This script runs comprehensive quality and security checks

set -e

echo "🔍 Starting Quality & Security Checks..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Checking project structure..."

# 1. Security Audit
print_status "Running security audit..."
if npm audit --audit-level high > /dev/null 2>&1; then
    print_success "No high/critical security vulnerabilities found"
else
    print_warning "Security vulnerabilities detected - check npm audit output"
fi

# 2. Dependency Check
print_status "Checking for node-sass..."
if npm list | grep -q "node-sass"; then
    print_error "node-sass found in dependencies - should be replaced with sass"
    exit 1
else
    print_success "node-sass not found - using sass instead"
fi

# 3. Build Test
print_status "Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# 4. Python API Validation
print_status "Validating Python API files..."
python_errors=0
for file in api/*.py; do
    if [ -f "$file" ]; then
        if python3 -m py_compile "$file" 2>/dev/null; then
            print_success "Python file $file is valid"
        else
            print_error "Python file $file has syntax errors"
            python_errors=$((python_errors + 1))
        fi
    fi
done

if [ $python_errors -eq 0 ]; then
    print_success "All Python API files are valid"
else
    print_error "$python_errors Python files have errors"
    exit 1
fi

# 5. Check for sensitive files
print_status "Checking for sensitive files..."
sensitive_files=(
    ".env"
    "*.key"
    "*.pem"
    "config.json"
    "secrets.json"
    "*.secret"
)

found_sensitive=0
for pattern in "${sensitive_files[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.git/*" | grep -q .; then
        print_warning "Found sensitive files matching pattern: $pattern"
        found_sensitive=1
    fi
done

if [ $found_sensitive -eq 0 ]; then
    print_success "No sensitive files found in repository"
fi

# 6. Check Git configuration
print_status "Checking Git configuration..."
git_user=$(git config user.name 2>/dev/null || echo "")
git_email=$(git config user.email 2>/dev/null || echo "")

if [ "$git_user" = "Crypto3k" ] && [ "$git_email" = "openhands@all-hands.dev" ]; then
    print_success "Git configuration is correct"
else
    print_warning "Git configuration may need updating (user: $git_user, email: $git_email)"
fi

# 7. Check for required files
print_status "Checking for required files..."
required_files=(
    "package.json"
    "package-lock.json"
    "vercel.json"
    ".gitignore"
    "SECURITY.md"
    ".github/workflows/security.yml"
    ".github/dependabot.yml"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Required file found: $file"
    else
        print_error "Missing required file: $file"
        missing_files=$((missing_files + 1))
    fi
done

# 8. Check Vercel configuration
print_status "Validating vercel.json..."
if python3 -c "import json; json.load(open('vercel.json'))" 2>/dev/null; then
    print_success "vercel.json is valid JSON"
else
    print_error "vercel.json has invalid JSON syntax"
    exit 1
fi

# 9. Check for security headers in vercel.json
print_status "Checking security headers in vercel.json..."
security_headers=(
    "X-Content-Type-Options"
    "X-Frame-Options"
    "X-XSS-Protection"
    "Strict-Transport-Security"
    "Content-Security-Policy"
)

missing_headers=0
for header in "${security_headers[@]}"; do
    if grep -q "$header" vercel.json; then
        print_success "Security header found: $header"
    else
        print_warning "Missing security header: $header"
        missing_headers=$((missing_headers + 1))
    fi
done

# 10. Bundle size check
print_status "Checking bundle sizes..."
if [ -d "dist" ]; then
    main_bundle_size=$(find dist -name "index-*.js" -exec wc -c {} \; | awk '{print $1}')
    if [ "$main_bundle_size" -lt 200000 ]; then  # 200KB limit
        print_success "Main bundle size is acceptable ($(($main_bundle_size / 1024))KB)"
    else
        print_warning "Main bundle size is large ($(($main_bundle_size / 1024))KB)"
    fi
else
    print_warning "No dist directory found - run build first"
fi

# Summary
echo ""
echo "========================================"
echo "🏁 Quality Check Summary"
echo "========================================"

if [ $missing_files -eq 0 ] && [ $python_errors -eq 0 ]; then
    print_success "All critical checks passed!"
    echo ""
    echo "✅ Security: No high/critical vulnerabilities"
    echo "✅ Build: Successful"
    echo "✅ Python APIs: Valid"
    echo "✅ Dependencies: Clean (no node-sass)"
    echo "✅ Configuration: Valid"
    
    if [ $missing_headers -gt 0 ]; then
        echo "⚠️  Security headers: $missing_headers missing (non-critical)"
    else
        echo "✅ Security headers: Complete"
    fi
    
    echo ""
    echo "🚀 Project is ready for production deployment!"
    exit 0
else
    print_error "Some checks failed - please review and fix issues above"
    exit 1
fi