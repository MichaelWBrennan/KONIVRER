# KONIVRER - Trading Card Game Platform

A modern, mobile-first trading card game platform with advanced matchmaking, tournament management, and deck building capabilities.

## Features

### Core Gameplay
- **Mobile-Optimized Game Engine** - Smooth touch controls and responsive design
- **Advanced Deck Builder** - Intuitive deck construction with card recommendations
- **Real-time Multiplayer** - Online matches with instant synchronization
- **Physical Matchmaking** - Connect with local players for in-person games

### Tournament System
- **Tournament Management** - Create and manage tournaments of any size
- **Live Brackets** - Real-time bracket updates and match tracking
- **Judge Center** - Comprehensive tournament administration tools

### Card Database
- **Complete Card Explorer** - Browse all cards with advanced filtering
- **Card Art Showcase** - High-resolution card artwork display
- **Custom Card Maker** - Create and share custom cards

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── contexts/      # React context providers
├── engine/        # Game logic and engines
├── services/      # API and external services
├── styles/        # CSS and styling
└── utils/         # Utility functions
```

## Development

- **Framework:** React 18 with Vite
- **Styling:** Modern CSS with utility classes
- **State Management:** React Context API
- **Routing:** React Router v6
- **Build Tool:** Vite with optimized bundling

## Deployment

Run the optimized deployment script:

```bash
node scripts/optimize-and-deploy.js
```

This will:
- Clean and build the project
- Run quality checks
- Deploy to production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.