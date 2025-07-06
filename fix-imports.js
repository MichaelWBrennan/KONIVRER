#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all files with unused import errors
const files = [
  'src/pages/UnifiedTournaments.tsx',
  'src/pages/UnifiedMatchmakingPage.tsx', 
  'src/pages/UnifiedHome.tsx',
  'src/pages/TournamentCreate.tsx',
  'src/pages/SyntaxGuide.tsx',
  'src/pages/StreamlinedGamePlatform.tsx',
  'src/pages/SingularityControlCenter.tsx',
  'src/pages/Rules.tsx',
  'src/pages/PlayerPortal.tsx',
  'src/pages/PlayGame.tsx',
  'src/pages/PhysicalMatchmakingPage.tsx',
  'src/pages/OrganizationDashboard.tsx',
  'src/pages/MobileRules.tsx',
  'src/pages/MobilePhysicalMatchmakingPage.tsx',
  'src/pages/MobileMatchmaking.tsx',
  'src/pages/MobileHome.tsx',
  'src/pages/MobileGamePage.tsx',
  'src/pages/MobileDeckSearch.tsx',
  'src/pages/MobileCardExplorer.tsx',
  'src/pages/Matchmaking.tsx',
  'src/pages/LiveTournament.tsx',
  'src/pages/JudgeCenter.tsx',
  'src/pages/IndustryLeadingFeaturesPage.tsx',
  'src/pages/Home_simple.tsx',
  'src/pages/Home.tsx'
];

console.log(`🔧 Fixing import issues in ${files.length} files...\n`);

let successCount = 0;

files.forEach((filePath) => {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove unused imports from lucide-react
    const fixedContent = content.replace(
      /import\s*{\s*[^}]*\s*}\s*from\s*['"]lucide-react['"];?\s*/g,
      ''
    ).replace(
      /import\s*{\s*[^}]*\s*}\s*from\s*['"]framer-motion['"];?\s*/g,
      ''
    );

    // Write the fixed content
    fs.writeFileSync(fullPath, fixedContent);
    console.log(`✅ Fixed imports: ${filePath}`);
    successCount++;
    
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log(`\n✨ Import fixing complete!`);
console.log(`✅ Fixed: ${successCount} files`);