# KONIVRER Deck Database

A professional deck building and card database application for the KONIVRER trading card game. Built with React, Vite, and optimized for Vercel deployment.

## 🚀 Features

- **Modern React Frontend**: Built with React 18 and modern hooks
- **Professional Deck Builder**: Drag-and-drop interface with real-time validation
- **Comprehensive Card Database**: Search, filter, and browse all cards
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
│   └── index.html         # Main HTML template
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
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

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

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
