<<<<<<< HEAD
# KONIVRER Deck Database

A professional deck building and card database application for the KONIVRER trading card game. Built with React, Vite, and optimized for Vercel deployment.

## 🚀 Features

- **Modern React Frontend**: Built with React 18 and modern hooks
- **Professional Deck Builder**: Drag-and-drop interface with real-time validation
- **Comprehensive Card Database**: Search, filter, and browse all cards
- **Complete Card Art Collection**: 64 high-quality card arts (825x1125px RGBA)
- **Card Art Display Components**: Ready-to-use React components for card visualization
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Fast Performance**: Optimized with Vite for lightning-fast development and builds
- **Type Safety**: TypeScript support for better development experience
- **Professional Architecture**: Clean, maintainable code structure

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests

### Backend & API

- **Python 3.12** - Serverless functions for Vercel
- **Node.js/Express** - Traditional backend API
- **Vercel Functions** - Serverless API endpoints

### Development Tools

- **ESLint** - Code linting and formatting
- **Vercel** - Deployment and hosting platform
- **Environment Configuration** - Centralized config management

## 📁 Project Structure

```
konivrer-deck-database/
├── public/                 # Static assets
│   ├── assets/
│   │   └── cards/         # KONIVRER card art collection (64 PNG files)
│   └── index.html         # Main HTML template
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   │   └── cards/         # Card-related components (CardArtDisplay, etc.)
│   ├── pages/            # Page components (CardArtShowcase, etc.)
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   └── data/             # Static data files
├── api/                  # Python serverless functions
│   ├── hello.py          # Example Python API endpoint
│   ├── cards.py          # Cards API endpoint
│   └── README.md         # Python API documentation
├── Backend/              # Backend API (Node.js/Express)
├── legacy/               # Legacy Bootstrap files (archived)
├── requirements.txt      # Python dependencies
├── runtime.txt           # Python runtime version
└── dist/                 # Build output (generated)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Crypto3k/KONIVRER-deck-database.git
   cd KONIVRER-deck-database
   ```

2. **Install dependencies**

=======
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
>>>>>>> af774a41 (Initial commit)
   ```bash
   npm install
   ```

<<<<<<< HEAD
3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

=======
2. **Start development server:**
>>>>>>> af774a41 (Initial commit)
   ```bash
   npm run dev
   ```

<<<<<<< HEAD
   The application will be available at `http://localhost:12000`

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build directory
npm run clean

# Run quality checks
npm run quality:check

# Run full validation (lint + test + quality)
npm run quality:full

# Security audit
npm run security:audit
```

## 🎨 Card Arts

The repository includes a complete collection of 64 high-quality KONIVRER card arts located in `public/assets/cards/`.

### Card Categories

- **Characters**: ABISS, ANGEL, ASH, AVRORA, AZOTH, GNOME, SALAMANDER, SILPh, VNDINE, SADE
- **Elemental**: DVST, ICE, LAHAR, LAVA, LIGTNING, STEAM, FOG, FROST, etc.
- **Bright Variants**: BRIGT_DVST, BRIGT_FVLGVRITE, BRIGT_LAHAR, etc.
- **Dark Variants**: DARK_DVST, DARK_FVLGVRITE, DARK_ICE, etc.
- **Chaos Variants**: XAOS_DVST, XAOS_LAVA, XAOS_GNOME, etc.
- **Special**: PhVE_ELEMENT_PhLAG

### Using Card Arts

#### React Components

```jsx
import CardArtDisplay from './components/cards/CardArtDisplay';

// Display a single card
<CardArtDisplay cardName="ABISS" className="w-48 h-64" />

// Display multiple cards
import { CardArtGallery } from './components/cards/CardArtDisplay';
<CardArtGallery cards={['ABISS', 'ANGEL', 'ASH']} columns={3} />
```

#### Direct Image Paths

```
/assets/cards/ABISS[face,1].png
/assets/cards/XAOS_LAVA[face,1].png
/assets/cards/PhVE_ELEMENT_PhLAG[face,6].png
```

### Card Art Showcase

Visit the `CardArtShowcase` page to explore all card arts with:
- Search and filter functionality
- Category-based filtering
- Gallery and preview modes
- Usage examples

## 🌐 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

The `vercel.json` configuration handles:

- Automatic builds with Vite
- SPA routing
- Security headers
- Static asset caching

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_BACKEND_URL=https://your-backend-url.com

# Application Configuration
VITE_APP_NAME=KONIVRER Deck Database
VITE_ENABLE_DEBUG=false
```

### Backend Integration

Update the backend URL in `vercel.json`:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    }
  ]
}
```

## 🏗️ Architecture

### Component Structure

- **Layout Components**: Navigation, sidebar, footer
- **Page Components**: Home, deck builder, card database
- **Feature Components**: Card viewer, deck stats, search
- **UI Components**: Buttons, modals, forms

### State Management

- React hooks for local state
- Context API for global state
- Custom hooks for business logic

### API Integration

- Centralized API configuration
- Request/response interceptors
- Error handling and retry logic

## 🧪 Development

### Code Style

- ESLint configuration for consistent code style
- React best practices and hooks rules
- Automatic formatting on save

### Performance Optimization

- Code splitting with dynamic imports
- Lazy loading of components
- Optimized bundle chunks
- Image optimization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security & Quality

### Security Features

- **Comprehensive Security Headers**: CSP, HSTS, XSS protection, frame options
- **Input Validation**: All API endpoints validate and sanitize user input
- **Dependency Security**: Regular security audits with automated vulnerability scanning
- **Secure Deployment**: Vercel deployment with security best practices
- **No Sensitive Data**: No API keys or secrets in client-side code

### Quality Assurance

- **Automated Testing**: Comprehensive test suite with Vitest
- **Code Quality**: ESLint and Prettier for consistent code style
- **Type Safety**: TypeScript for better development experience
- **Performance Monitoring**: Bundle size optimization and performance tracking
- **Dependency Management**: Automated dependency updates with Dependabot

### Security Workflows

- **GitHub Security**: CodeQL analysis and dependency review
- **Automated Audits**: Daily security scans via GitHub Actions
- **Vulnerability Management**: Automatic security updates for dependencies

### Quality Checks

Run the comprehensive quality check script:

```bash
npm run quality:check
```

This validates:

- ✅ No security vulnerabilities
- ✅ Build process works
- ✅ Python API files are valid
- ✅ No sensitive files in repository
- ✅ All required configuration files present
- ✅ Security headers configured
- ✅ Bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and updates.

---

**Built with ❤️ by the KONIVRER Team**

# Force deployment refresh
=======
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
>>>>>>> af774a41 (Initial commit)
