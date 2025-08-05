#!/bin/bash

# Script to delete branches corresponding to closed/merged pull requests
# This script identifies and deletes remote branches for PRs that have been closed or merged
# Updated: August 2025 - Synchronized with current repository state
# Current active PRs: #877, #880

echo "🧹 KONIVRER Branch Cleanup - Delete Closed PR Branches"
echo "====================================================="

# Branches to KEEP (correspond to open PRs or main)
declare -a KEEP_BRANCHES=(
    "main"
    "copilot/fix-1708d50b-0ab1-4dc7-ac21-e3543b575232"  # PR #877 - open
    "copilot/fix-e8312904-c589-4acc-bff1-808c9fefce1c"  # PR #880 - open
)

# Branches to DELETE (correspond to closed/merged PRs)
# Note: These branches have been checked and no longer exist in the repository
# The script will safely handle non-existent branches
declare -a DELETE_BRANCHES=(
    # All previously tracked closed PR branches have been cleaned up
    # This array is kept for future use when branches need to be deleted
)

echo "📋 Analysis Results:"
echo "Branches to keep: ${#KEEP_BRANCHES[@]}"
echo "Branches to delete: ${#DELETE_BRANCHES[@]}"
echo ""

# Check which branches exist remotely
echo "🔍 Checking remote branches..."
echo "Branches that will be KEPT:"
for branch in "${KEEP_BRANCHES[@]}"; do
    if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
        echo "  ✅ $branch (exists)"
    else
        echo "  ⚠️  $branch (not found)"
    fi
done

echo ""
echo "Branches that will be DELETED:"
for branch in "${DELETE_BRANCHES[@]}"; do
    if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
        echo "  🗑️  $branch (exists - will be deleted)"
    else
        echo "  ℹ️  $branch (already deleted or not found)"
    fi
done

echo ""
read -p "❓ Do you want to proceed with deleting these branches? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting branch deletion..."
    
    deleted_count=0
    error_count=0
    
    for branch in "${DELETE_BRANCHES[@]}"; do
        echo "Deleting: $branch"
        if git push origin --delete "$branch" 2>/dev/null; then
            echo "  ✅ Successfully deleted $branch"
            ((deleted_count++))
        else
            echo "  ❌ Failed to delete $branch (may not exist or permission issue)"
            ((error_count++))
        fi
    done
    
    echo ""
    echo "📊 Cleanup Summary:"
    echo "  Deleted: $deleted_count branches"
    echo "  Errors: $error_count branches"
    echo "  Kept: ${#KEEP_BRANCHES[@]} branches"
    
    if [ $error_count -eq 0 ]; then
        echo "🎉 All cleanup completed successfully!"
    else
        echo "⚠️  Some branches could not be deleted. This may be due to:"
        echo "   - Branches already deleted"
        echo "   - Insufficient permissions"
        echo "   - Network connectivity issues"
    fi
else
    echo "❌ Branch deletion cancelled by user"
    echo ""
    echo "💡 To manually delete these branches, run:"
    for branch in "${DELETE_BRANCHES[@]}"; do
        echo "   git push origin --delete $branch"
    done
fi

echo ""
echo "✨ Branch cleanup script completed"