# Contributing to KONIVRER Deck Database

Thank you for your interest in contributing to the KONIVRER Deck Database! This document provides guidelines and information for contributors following 2025 coding standards.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Git
- Modern web browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Crypto3k/KONIVRER-deck-database.git
   cd KONIVRER-deck-database
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Configure your local environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic only

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow the established folder structure

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── config/        # Configuration files
└── context/       # React context providers
```

### Naming Conventions
- **Components**: PascalCase (`CardViewer.jsx`)
- **Files**: camelCase (`apiClient.js`)
- **Variables**: camelCase (`cardData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🔧 Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(deck-builder): add card filtering functionality
fix(api): resolve authentication token refresh
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, tested code
   - Follow the style guidelines
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Running Tests
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build
```

### Writing Tests
- Write unit tests for utility functions
- Test component behavior, not implementation
- Mock external dependencies
- Aim for meaningful test coverage

## 📝 Documentation

### Code Documentation
- Document complex functions and algorithms
- Use JSDoc for function documentation
- Keep README.md updated with new features

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error scenarios

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

## 💡 Feature Requests

### Before Submitting
- Check if the feature already exists
- Search existing issues and discussions
- Consider if it fits the project scope

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🏗️ Architecture Guidelines

### State Management
- Use React hooks for local state
- Use Context API for global state
- Keep state as close to where it's used as possible

### Performance
- Use React.memo for expensive components
- Implement code splitting for large features
- Optimize images and assets
- Monitor bundle size

### Security
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all API calls
- Follow OWASP guidelines

## 📦 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Create release notes

## 🤝 Community

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain a professional environment

### Getting Help
- Check the documentation first
- Search existing issues
- Ask questions in discussions
- Be specific about your problem

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to KONIVRER Deck Database! 🎉