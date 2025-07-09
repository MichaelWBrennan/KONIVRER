# Unused Pages in KONIVRER Deck Database

## Overview
After analyzing the codebase, I've identified several page components that exist in the repository but are not currently being used in the active application. The main application is using `AllInOne-simple.tsx` which has a streamlined set of pages, while other versions of the application (`AllInOne.tsx` and `AllInOne-build-safe.tsx`) contain additional pages that are not currently accessible.

## Currently Used Pages (in AllInOne-simple.tsx)
The active application uses these pages:
- **HomePage** - Main landing page with navigation buttons
- **CardsPage** - Card database/browser
- **DecksPage** - Deck builder functionality
- **PlayPage** - Game center/rules
- **EventsPage** - Tournaments page

## Unused Pages

### In AllInOne.tsx
1. **BlogPage** - A blog component that isn't used in the simple version
   ```tsx
   const BlogPage: React.FC = () => {
     // Blog page implementation
   }
   ```

2. **RulesPage** - A dedicated rules page (some of this functionality is in PlayPage)
   ```tsx
   const RulesPage: React.FC = () => (
     // Rules page implementation
   )
   ```

3. **KonivreDemoPage** - A demo page for KONIVRER
   ```tsx
   const KonivreDemoPage: React.FC = () => (
     // KONIVRER demo implementation
   )
   ```

4. **AIDemoPage** - A demo page for AI features
   ```tsx
   const AIDemoPage: React.FC = () => (
     // AI demo implementation
   )
   ```

### In AllInOne-build-safe.tsx
1. **LoginPage** - A login page that isn't used in the simple version
   ```tsx
   const LoginPage: React.FC = () => (
     // Login page implementation
   )
   ```

## Potential Future Pages
The automation code (`BackgroundCodeEvolution.tsx`) references potential pages in a `src/pages` directory, but this directory doesn't exist yet:

```tsx
// References to potential future pages
'const HomePage = lazy(() => import("../pages/HomePage"));',
'const CardsPage = lazy(() => import("../pages/CardsPage"));',
'const DeckBuilderPage = lazy(() => import("../pages/DeckBuilderPage"));',
```

## Recommendations

If these unused pages contain valuable functionality, consider:

1. **Adding routes** for these pages in the active application (`AllInOne-simple.tsx`)
2. **Creating navigation links** to these pages
3. **Extracting the components** into separate files in a dedicated `pages` directory (as suggested by the automation code)
4. **Removing unused code** if these pages are no longer needed

This would make the application more modular and easier to maintain while providing additional features to users.