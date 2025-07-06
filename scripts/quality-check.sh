#!/bin/bash

# Quality Check Script
# This script runs various quality checks on the codebase

echo "🔍 Starting Quality Check..."

# Check for linting issues
echo -e "\n📋 Checking for linting issues..."
npm run lint
LINT_RESULT=$?

# Check for formatting issues
echo -e "\n✨ Checking for formatting issues..."
npm run format:check
FORMAT_RESULT=$?

# Check for type errors
echo -e "\n🔧 Checking for TypeScript errors..."
npm run type-check
TYPE_RESULT=$?

# Check for duplicate code
echo -e "\n🔄 Checking for duplicate code..."
npx jscpd src --ignore "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx" --threshold 5
DUPLICATE_RESULT=$?

# Check for outdated dependencies
echo -e "\n📦 Checking for outdated dependencies..."
npm outdated
OUTDATED_RESULT=$?

# Check for unused dependencies
echo -e "\n🧹 Checking for unused dependencies..."
npx depcheck
UNUSED_RESULT=$?

# Summarize results
echo -e "\n📊 Quality Check Summary:"
echo "Linting: $([ $LINT_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Formatting: $([ $FORMAT_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "TypeScript: $([ $TYPE_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Duplicate Code: $([ $DUPLICATE_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Dependencies: $([ $OUTDATED_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Unused Dependencies: $([ $UNUSED_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"

# Calculate overall result
if [ $LINT_RESULT -eq 0 ] && [ $FORMAT_RESULT -eq 0 ] && [ $TYPE_RESULT -eq 0 ]; then
  echo -e "\n✅ Core quality checks passed!"
  exit 0
else
  echo -e "\n❌ Some quality checks failed. Please fix the issues above."
  exit 1
fi