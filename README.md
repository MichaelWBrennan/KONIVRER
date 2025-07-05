# KONIVRER - Trading Card Game Platform

A modern, mobile-first trading card game platform with advanced matchmaking, tournament management, and deck building capabilities.

## Game Rules

📖 **[KONIVRER Basic Rules](./KONIVRER_BASIC_RULES.pdf)** - Complete rulebook covering all game mechanics

### Core Rule Summary
- **No artifacts or sorceries** - Everything can be cast at instant speed but doesn't need instant typing
- **All familiars have haste and vigilance**
- **No graveyard** - Only a removed from play zone
- **Power and toughness are combined into one stat called "strength"**

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

#### Card Images

The repository includes placeholder card images for all 64 cards in the KONIVRER deck. These images are located in the `public/assets/cards/` directory and are available in both WebP and PNG formats. The WebP format is used as the primary format for better compression, while PNG is provided as a fallback for older browsers.

To add your own card images:
1. Create images with dimensions 412×562 pixels
2. Save them with the card name as the filename (e.g., `ABISS.webp`, `ANGEL.png`)
3. Place them in the `public/assets/cards/` directory
4. The application will automatically use your images instead of the placeholders

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
