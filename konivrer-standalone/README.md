# KONIVRER Advanced TCG Platform

A comprehensive TCG platform featuring physical matchmaking, AI card verification, blockchain integration, ML deck analysis, and augmented reality card viewing. This bleeding-edge implementation showcases the future of trading card game technology.

## Build Status

✅ **Production Ready**: This standalone version has been fully optimized, tested, and is ready for production deployment. It can be deployed independently from the main project.

## Features

### Core Features
- **Physical Match Management**: Create and manage physical matches between players
- **Tournament Organization**: Set up and track tournaments with various formats
- **QR Code Generation**: Generate QR codes for matches and tournaments
- **Bayesian Rating System**: Calculate accurate player ratings based on match history
- **Ancient-Esoteric Theme**: Toggle between standard and ancient-esoteric visual themes
- **Responsive Design**: Works on all screen sizes from mobile to desktop
- **Offline Support**: All data is stored locally in the browser
- **Performance Optimized**: Lazy loading, code splitting, and memoization for optimal performance

### Bleeding-Edge Technology
- **AI Card Verification**: Use your device camera to scan and verify physical cards with TensorFlow.js
- **Blockchain Integration**: Secure tournament results and card ownership with blockchain verification
- **Machine Learning Deck Analysis**: Analyze deck compositions, predict win rates, and get optimization suggestions
- **Augmented Reality Card Viewer**: Experience your cards in AR with 3D models and animations

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Implementation Details](#implementation-details)
- [QR Code Implementation](#qr-code-implementation)
- [Integration with Main Project](#integration-with-main-project)
- [Documentation](#documentation)
- [Dependencies](#dependencies)

## Installation

```bash
# Clone the repository
git clone https://github.com/MichaelWBrennan/KONIVRER-deck-database.git

# Navigate to the standalone directory
cd KONIVRER-deck-database/konivrer-standalone

# Install dependencies
npm install
```

## Usage

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5173
```

### Features Usage

1. **Match Management**
   - Select a match from the dropdown to generate a QR code
   - The QR code contains player information, match format, and Bayesian ratings

2. **Tournament Management**
   - Select a tournament from the dropdown to generate a QR code
   - The QR code contains tournament details, participants, and format information

3. **Theme Toggle**
   - Toggle between standard and ancient-esoteric themes
   - Theme preference is saved in localStorage

4. **Debug Mode**
   - Enable debug mode to view the raw QR code data
   - Useful for development and troubleshooting

## Deployment

### Standard Deployment

```bash
# Build the project
npm run build

# Start the preview server
npm run preview

# Access the application at http://localhost:12000
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t konivrer-physical-matchmaking .

# Run the container
docker run -p 80:80 konivrer-physical-matchmaking

# Access the application at http://localhost:80
```

## Implementation Details

### Project Structure

```
konivrer-standalone/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .dockerignore        # Docker ignore file
├── Dockerfile           # Docker configuration
├── nginx.conf           # Nginx configuration for Docker
├── OPTIMIZATIONS.md     # Documentation of optimizations
├── UTILITIES.md         # Documentation of utility functions
└── vite.config.js       # Vite configuration
```

### Components

#### Core Components
1. **PhysicalMatchmaking**: Main component that displays matches, tournaments, and player statistics
2. **QRCodeGenerator**: Standard QR code generator component
3. **AncientThemeQRCodeGenerator**: QR code generator with ancient-esoteric styling

#### Bleeding-Edge Components
4. **AICardVerification**: AI-powered card verification using TensorFlow.js and device camera
5. **BlockchainVerification**: Blockchain integration for secure tournament results and card ownership
6. **MLDeckAnalysis**: Machine learning deck analysis with archetype identification and win rate prediction
7. **AugmentedRealityViewer**: AR card viewer with 3D models and animations

### Hooks

1. **useLocalStorage**: Custom hook for localStorage persistence
2. **useTheme**: Custom hook for theme management
3. **useDebugMode**: Custom hook for debug mode management

### Context

- **PhysicalMatchmakingContext**: Provides state management and business logic for the physical matchmaking system

### Utilities

- **Utility Functions**: Common functions for formatting, calculations, and data handling
- **Constants**: Centralized configuration values and constants

## QR Code Implementation

The QR codes contain structured JSON data that includes:

### Match QR Codes
- Match ID and type
- Player information (names, IDs, Bayesian ratings)
- Match format and status
- Timestamp and app version

### Tournament QR Codes
- Tournament ID, name, and type
- Format and status
- Participant details with Bayesian ratings
- Round information
- Timestamp and app version

## Integration with Main Project

To integrate this component with the main KONIVRER Deck Database:

1. Copy the components, contexts, hooks, and utils to the appropriate directories
2. Import and use the PhysicalMatchmaking component in your routes
3. Ensure the PhysicalMatchmakingProvider is available in the component tree
4. Import the CSS files or integrate the styles into your existing CSS system

## Documentation

- [UTILITIES.md](./UTILITIES.md) - Documentation of utility functions and hooks
- [OPTIMIZATIONS.md](./OPTIMIZATIONS.md) - Documentation of performance optimizations

## Dependencies

### Core Dependencies
- **React**: UI library
- **React DOM**: React renderer for the DOM
- **qrcode.react**: QR code generation library
- **web-vitals**: Performance monitoring library

### Bleeding-Edge Dependencies
- **TensorFlow.js**: Machine learning library for AI card verification
- **Ethers.js**: Ethereum library for blockchain integration
- **Chart.js & React-ChartJS-2**: Data visualization for ML deck analysis
- **Three.js & React-Three-Fiber**: 3D rendering for augmented reality card viewing
- **Vite Plugin PWA**: Progressive Web App capabilities