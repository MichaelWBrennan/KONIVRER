#!/bin/bash

# Script to clean up unused files after migrating to unified components
# This script should be run after all components have been migrated to use unified components

echo "Starting cleanup of unused files..."

# List of files to be removed
FILES_TO_REMOVE=(
  # Original card components
  "src/components/Card.tsx"
  "src/components/CardActions.tsx"
  "src/components/CardPreview.tsx"
  
  # Original layout components
  "src/components/SimpleMobileLayout.tsx"
  "src/components/MobileLayout.tsx"
  "src/components/MobileFirstLayout.tsx"
  
  # Original game components
  "src/components/game/GameBoard.tsx"
  "src/components/game/EnhancedGameBoard.tsx"
  "src/components/game/MTGArenaStyleGameBoard.tsx"
  "src/components/game/GameCard.tsx"
  "src/components/game/KonivrERCard.tsx"
  
  # Original AI implementations
  "src/ai/AIPlayer.ts"
  "src/ai/CuttingEdgeAI.ts"
  "src/ai/NeuralAI.ts"
  
  # Original home components
  "src/components/Home.tsx"
  "src/components/Home_backup.tsx"
  "src/components/Home_simple.tsx"
  "src/components/MobileHome.tsx"
  "src/components/MobileHomePage.tsx"
  
  # Original PDF viewers
  "src/components/PDFViewer.tsx"
  "src/components/EnhancedPDFViewer.tsx"
  "src/components/MobilePDFViewer.tsx"
  
  # Original auth modals
  "src/components/MobileAuthModal.tsx"
  "src/components/ModernAuthModal.tsx"
  "src/components/ModernAuthModal_broken.tsx"
  
  # Original matchmaking components
  "src/components/matchmaking/PlayerCard.tsx"
  
  # Original optimization scripts
  "scripts/optimize-and-deploy.js"
  "scripts/optimize-and-deploy.ts"
  "scripts/optimize-build.ts"
  "scripts/optimize-performance.ts"
  
  # Original AI scripts
  "scripts/ai-build.js"
  "scripts/ai-integration-demo.js"
  "scripts/ai-recorder.js"
  "scripts/ai-test.js"
  "scripts/integrate-ai-recorder.js"
)

# Check if each file exists before removing
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm "$file"
  else
    echo "File $file not found, skipping..."
  fi
done

echo "Cleanup complete!"
echo "Note: Make sure all components have been migrated to use unified components before running this script."
echo "You may need to update imports in files that still reference the removed components."