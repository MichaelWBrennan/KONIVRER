#!/bin/bash

# Test script for dependabot workflows
# This script helps test the dependabot automation workflows

set -e

echo "🤖 Dependabot Workflow Test Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_status $RED "❌ Not in a git repository. Please run this script from the repository root."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_status $RED "❌ GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    print_status $RED "❌ Not authenticated with GitHub. Please run 'gh auth login' first."
    exit 1
fi

print_status $GREEN "✅ Prerequisites check passed"

# Function to create a test dependabot branch
create_test_branch() {
    local package_name="test-package"
    local old_version="1.0.0"
    local new_version="1.0.1"
    
    print_status $BLUE "🔧 Creating test dependabot branch"
    
    # Create and checkout new branch
    git checkout -b "dependabot/test-$(date +%s)"
    
    # Create a fake package.json change to simulate dependabot
    if [ -f "package.json" ]; then
        # Backup original package.json
        cp package.json package.json.backup
        
        # Add a test dependency
        jq '.dependencies["test-dependabot-package"] = "'$old_version'"' package.json > package.json.tmp && mv package.json.tmp package.json
        
        # Commit the change
        git add package.json
        git commit -m "Bump test-dependabot-package from $old_version to $new_version

        Bumps [test-dependabot-package](https://github.com/test/test-dependabot-package) from $old_version to $new_version.
        - [Release notes](https://github.com/test/test-dependabot-package/releases/tag/v$new_version)
        - [Changelog](https://github.com/test/test-dependabot-package/blob/main/CHANGELOG.md)
        - [Commits](https://github.com/test/test-dependabot-package/compare/v$old_version...v$new_version)

        ---
        updated-dependencies:
        - dependency-name: test-dependabot-package
          dependency-type: direct:production
          update-type: version-update:semver-patch
        ..."
        
        print_status $GREEN "✅ Test branch created"
        echo "Commit: $(git rev-parse HEAD)"
        echo "Message: $(git log -1 --pretty=format:'%s')"
        
        # Push the branch
        git push origin "dependabot/test-$(date +%s)"
        print_status $GREEN "✅ Test branch pushed to remote"
        
        # Return to main branch
        git checkout main
        
        # Restore original package.json
        mv package.json.backup package.json
        
        echo ""
        print_status $YELLOW "🧪 Test branch created successfully!"
        print_status $YELLOW "   This should trigger the dependabot-branch-auto-process workflow"
        echo ""
        
        return 0
    else
        print_status $RED "❌ package.json not found. Cannot create test branch."
        git checkout main
        return 1
    fi
}

# Function to test the force merge workflow
test_force_merge() {
    local pr_number=$1
    
    if [ -z "$pr_number" ]; then
        print_status $RED "❌ PR number required for force merge test"
        return 1
    fi
    
    print_status $BLUE "🚀 Testing force merge workflow for PR #$pr_number"
    
    # Trigger the force merge workflow
    gh workflow run "dependabot-force-merge.yml" \
        --ref main \
        -f pr_number="$pr_number"
    
    print_status $GREEN "✅ Force merge workflow triggered"
    print_status $YELLOW "   Check the Actions tab to see the workflow progress"
}

# Function to list recent dependabot PRs
list_dependabot_prs() {
    print_status $BLUE "📋 Recent dependabot PRs:"
    echo ""
    
    gh pr list \
        --author "dependabot[bot]" \
        --state all \
        --limit 10 \
        --json number,title,state,createdAt \
        --jq '.[] | "\(.number) | \(.state) | \(.title) | \(.createdAt)"' | \
    while IFS='|' read -r number state title created; do
        printf "%-6s | %-8s | %-50s | %s\n" \
            "$number" "$state" "${title:0:50}" "${created:0:10}"
    done
}

# Function to show workflow status
show_workflow_status() {
    print_status $BLUE "📊 Recent workflow runs:"
    echo ""
    
    gh run list \
        --workflow "dependabot-force-merge.yml" \
        --limit 5 \
        --json databaseId,status,conclusion,createdAt \
        --jq '.[] | "\(.databaseId) | \(.status) | \(.conclusion // "N/A") | \(.createdAt)"' | \
    while IFS='|' read -r id status conclusion created; do
        printf "%-10s | %-10s | %-10s | %s\n" \
            "$id" "$status" "$conclusion" "${created:0:10}"
    done
    
    echo ""
    gh run list \
        --workflow "dependabot-branch-auto-process.yml" \
        --limit 5 \
        --json databaseId,status,conclusion,createdAt \
        --jq '.[] | "\(.databaseId) | \(.status) | \(.conclusion // "N/A") | \(.createdAt)"' | \
    while IFS='|' read -r id status conclusion created; do
        printf "%-10s | %-10s | %-10s | %s\n" \
            "$id" "$status" "$conclusion" "${created:0:10}"
    done
}

# Main menu
show_menu() {
    echo ""
    print_status $BLUE "🤖 Dependabot Workflow Test Menu"
    echo "======================================"
    echo "1. Create test dependabot branch"
    echo "2. Test force merge workflow (requires PR number)"
    echo "3. List recent dependabot PRs"
    echo "4. Show workflow status"
    echo "5. Exit"
    echo ""
    read -p "Choose an option (1-5): " choice
    
    case $choice in
        1)
            create_test_branch
            ;;
        2)
            read -p "Enter PR number: " pr_number
            test_force_merge "$pr_number"
            ;;
        3)
            list_dependabot_prs
            ;;
        4)
            show_workflow_status
            ;;
        5)
            print_status $GREEN "👋 Goodbye!"
            exit 0
            ;;
        *)
            print_status $RED "❌ Invalid option. Please choose 1-5."
            ;;
    esac
}

# Check if script is being run with arguments
if [ $# -gt 0 ]; then
    case $1 in
        "create-branch")
            create_test_branch
            ;;
        "force-merge")
            test_force_merge "$2"
            ;;
        "list-prs")
            list_dependabot_prs
            ;;
        "workflow-status")
            show_workflow_status
            ;;
        *)
            echo "Usage: $0 [create-branch|force-merge <pr_number>|list-prs|workflow-status]"
            exit 1
            ;;
    esac
else
    # Interactive mode
    while true; do
        show_menu
        echo ""
        read -p "Press Enter to continue..."
    done
fi