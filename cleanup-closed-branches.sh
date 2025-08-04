#!/bin/bash

# Script to delete branches corresponding to closed/merged pull requests
# This script identifies and deletes remote branches for PRs that have been closed or merged

echo "🧹 KONIVRER Branch Cleanup - Delete Closed PR Branches"
echo "====================================================="

# Branches to KEEP (correspond to open PRs or main)
declare -a KEEP_BRANCHES=(
    "main"
    "copilot/fix-9ebb10ce-ffa1-4649-b662-2937a08c5867"  # PR #851 - open
    "copilot/fix-3894c120-0c57-4128-814f-b09b11abe594"  # PR #837 - open
    "copilot/fix-4f3310e6-5582-40df-826f-db3a106e33d2"  # PR #835 - open
    "copilot/fix-e7eb9f0e-1fe2-40f8-b886-778e67247d32"  # PR #816 - open
)

# Branches to DELETE (correspond to closed/merged PRs)
declare -a DELETE_BRANCHES=(
    "copilot/fix-5cef6195-a423-4b63-9ef6-c04bc555d7b4"  # Closed PR
    "copilot/fix-9a8050a5-9f7f-4d93-b3ea-0d176b98bc1d"  # Closed PR
    "copilot/fix-74c899c1-33f3-46ae-9116-5c2e78fdba70"  # Closed PR
    "copilot/fix-560b0654-1f87-4505-812d-923905679271"  # Closed PR
    "copilot/fix-874ed1f5-8131-409e-8d48-0d45a5346b82"  # Closed PR
    "copilot/fix-b06e2c7d-386b-4c77-bd85-f084fee2d5c3"  # Closed PR
    "copilot/fix-b9f9e005-0a8a-4e9c-80b9-eccd5fb2b924"  # Closed PR
    "copilot/fix-b170fd51-1c1f-43d9-9f00-77a58e43b3c6"  # Closed PR
    "copilot/fix-dd40ab33-6740-4256-81e3-db063b14d23e"  # Closed PR
    "copilot/fix-e465f4cc-3f2b-4e96-bbbf-f75e7464230e"  # Closed PR
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