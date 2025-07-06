# Unified Components Documentation

## Overview

This document provides information about the unified components created to reduce code duplication and improve maintainability in the KONIVRER Deck Database application.

## Component List

### UI Components

1. **UnifiedHome**
   - Combines: `Home.tsx`, `Home_backup.tsx`, `Home_simple.tsx`, `MobileHome.tsx`, `MobileHomePage.tsx`
   - Props: `variant` - Can be "standard", "mobile", or "simple"
   - Usage: `<UnifiedHome variant="mobile" />`

2. **UnifiedLayout**
   - Combines: `Layout.tsx`, `MobileLayout.tsx`, `SimpleMobileLayout.tsx`, `MobileFirstLayout.tsx`
   - Props: `variant` - Can be "standard", "mobile", "simple", or "modern"
   - Usage: `<UnifiedLayout variant="mobile" currentPage="home">{children}</UnifiedLayout>`

3. **UnifiedPDFViewer**
   - Combines: `PDFViewer.tsx`, `EnhancedPDFViewer.tsx`, `MobilePDFViewer.tsx`
   - Props: `variant` - Can be "standard", "enhanced", or "mobile"
   - Usage: `<UnifiedPDFViewer variant="enhanced" url="path/to/pdf" />`

4. **UnifiedAuthModal**
   - Combines: `MobileAuthModal.tsx`, `ModernAuthModal.tsx`, `ModernAuthModal_broken.tsx`
   - Props: `variant` - Can be "standard", "mobile", or "modern"
   - Usage: `<UnifiedAuthModal variant="modern" isOpen={isOpen} onClose={handleClose} />`

### Card Components

5. **UnifiedCard**
   - Combines: `Card.tsx`, `GameCard.tsx`, `KonivrERCard.tsx`, `CardPreview.tsx`
   - Props: `variant` - Can be "standard", "game", "konivrer", or "preview"
   - Usage: `<UnifiedCard variant="game" card={cardData} location="hand" />`

6. **UnifiedCardSearch**
   - Combines all card search components
   - Props: `variant` - Can be "standard", "enhanced", "mobile", or "advanced"
   - Usage: `<UnifiedCardSearch variant="enhanced" onCardSelect={handleCardSelect} />`

### Game Components

7. **UnifiedGameBoard**
   - Combines: `GameBoard.tsx`, `EnhancedGameBoard.tsx`, `MTGArenaStyleGameBoard.tsx`
   - Props: `variant` - Can be "standard", "enhanced", or "arena"
   - Usage: `<UnifiedGameBoard variant="enhanced" gameEngine={gameEngine} />`

8. **UnifiedGameControls**
   - Combines all game control components
   - Props: `variant` - Can be "standard", "mobile", or "advanced"
   - Usage: `<UnifiedGameControls variant="mobile" onAction={handleAction} />`

9. **UnifiedGameEngine**
   - Combines: `GameEngine.ts`, `AIPlayer.ts`, `CuttingEdgeAI.ts`, `NeuralAI.ts`
   - Usage: `const engine = new UnifiedGameEngine(options)`

### Feature Components

10. **UnifiedTournamentManager**
    - Combines all tournament management components
    - Props: `variant` - Can be "standard", "advanced", or "mobile"
    - Usage: `<UnifiedTournamentManager variant="advanced" />`

11. **UnifiedMatchmaking**
    - Combines online and physical matchmaking components
    - Props: `variant` - Can be "online", "physical", or "hybrid"
    - Usage: `<UnifiedMatchmaking variant="online" />`

12. **UnifiedDeckBuilder**
    - Combines all deck builder components
    - Props: `variant` - Can be "standard", "enhanced", or "mobile"
    - Usage: `<UnifiedDeckBuilder variant="enhanced" />`

13. **UnifiedNotification**
    - Combines all notification components
    - Props: `variant` - Can be "toast", "popup", or "inline"
    - Usage: `<UnifiedNotification variant="toast" message="Card added to deck" />`

## Utility Scripts

1. **unified-optimize.ts**
   - Combines: `optimize-and-deploy.js`, `optimize-and-deploy.ts`, `optimize-build.ts`, `optimize-performance.ts`
   - Usage: `npm run build:unified`

2. **unified-ai.js**
   - Combines: `ai-build.js`, `ai-integration-demo.js`, `ai-recorder.js`, `ai-test.js`, `integrate-ai-recorder.js`
   - Usage: `npm run ai:start`

## Migration Guide

### Step 1: Update Import Statements

Replace imports of original components with unified components:

```jsx
// Before
import Card from './Card';

// After
import UnifiedCard from './UnifiedCard';
```

### Step 2: Update Component Usage

Add the appropriate variant prop when using unified components:

```jsx
// Before
<Card card={cardData} location="hand" />

// After
<UnifiedCard variant="standard" card={cardData} location="hand" />
```

### Step 3: Update Script References

Update package.json scripts to use unified scripts:

```json
// Before
"deploy": "node scripts/optimize-and-deploy.js"

// After
"deploy": "tsx scripts/unified-optimize.ts --deploy"
```

## Best Practices

1. **Responsive Detection**: Let the component automatically detect the device type when possible:
   ```jsx
   <UnifiedLayout currentPage="home">{children}</UnifiedLayout>
   ```

2. **Explicit Variants**: Use explicit variants when you need specific behavior:
   ```jsx
   <UnifiedGameBoard variant="enhanced" gameEngine={gameEngine} />
   ```

3. **Gradual Migration**: Migrate components gradually to avoid breaking changes.

4. **Testing**: Test each variant thoroughly after migration.