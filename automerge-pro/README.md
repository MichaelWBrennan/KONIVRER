# Automerge-Pro: Enterprise GitHub App

[![CI/CD Status](https://github.com/MichaelWBrennan/KONIVRER-deck-database/actions/workflows/automerge-pro.yml/badge.svg)](https://github.com/MichaelWBrennan/KONIVRER-deck-database/actions/workflows/automerge-pro.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-Automerge--Pro-blue)](https://github.com/marketplace/automerge-pro)

**Automerge-Pro** is an enterprise-grade GitHub App that automates pull request management with intelligent rules, marketplace billing, and comprehensive monitoring. Built for teams that need reliable, scalable, and secure automated workflows.

## 🚀 Features

### Core Automation
- **Smart Auto-Merge**: Configurable rules based on status checks, reviews, labels, and more
- **Multiple Merge Strategies**: Support for merge commits, squash, and rebase
- **Conditional Logic**: Advanced rule conditions with priority-based execution
- **Branch Protection**: Integration with GitHub's branch protection rules

### Enterprise Features
- **GitHub Marketplace Integration**: Seamless billing with Free, Pro, and Enterprise tiers
- **License Validation**: Real-time license checking with feature gating
- **AWS Infrastructure**: Serverless deployment with Lambda, API Gateway, and DynamoDB
- **Multi-tenant Architecture**: Secure data isolation with RBAC

### Monitoring & Analytics
- **Real-time Monitoring**: CloudWatch integration with custom metrics
- **Error Tracking**: Comprehensive logging with Sentry integration
- **Performance Optimization**: Redis caching and cold start reduction
- **Audit Logging**: GDPR and SOC 2 compliant audit trails

### Developer Experience
- **CLI Tools**: Interactive setup, configuration validation, and development licensing
- **Visual Dashboard**: Web-based configuration and monitoring interface
- **Extensive Documentation**: OpenAPI specs with interactive examples
- **24/7 Support**: GitHub issue templates and automated support workflows

## 📦 Installation

### GitHub App Installation
1. Visit the [GitHub Marketplace](https://github.com/marketplace/automerge-pro)
2. Choose your billing plan (Free, Pro, or Enterprise)
3. Install on your repositories
4. Configure your `.automerge-pro.yml` file

### CLI Installation
```bash
# Install globally
npm install -g automerge-pro-cli

# Initialize in your repository
automerge-pro setup init --tier=pro --interactive

# Generate sample configuration
automerge-pro config generate --tier=enterprise -o .automerge-pro.yml
```

## ⚙️ Configuration

Create a `.automerge-pro.yml` file in your repository root:

### Development Setup

1. Clone and navigate to the automerge-pro directory:
```bash
cd automerge-pro
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

5. Start development server:
```bash
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

### Building

```bash
npm run build
```

## Architecture

```
src/
├── handlers/          # HTTP request handlers
├── services/          # Business logic services
├── middleware/        # Express middleware
├── types/            # TypeScript type definitions
├── config/           # Configuration management
└── utils/            # Utility functions

tests/
├── unit/             # Unit tests
└── integration/      # Integration tests

infrastructure/
├── aws/              # AWS SAM templates
└── github/           # GitHub App configuration
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /webhook` - GitHub webhook handler

## Deployment

### AWS Lambda Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy using AWS SAM:
```bash
npm run deploy
```

### Local Testing

```bash
# Start local Lambda environment
npm run local
```

## Environment Variables

See `.env.example` for all required and optional environment variables.

## License Tiers

### Free Tier
- Up to 5 repositories
- Basic automerge functionality
- Community support

### Pro Tier ($9/month)
- Up to 50 repositories  
- Advanced conditions and scheduling
- Custom merge rules
- Email support

### Enterprise Tier ($29/month)
- Unlimited repositories
- Priority support
- Advanced security features
- Custom integrations

## Support

- 📖 [Documentation](https://automerge-pro.dev/docs)
- 💬 [Community Support](https://github.com/automerge-pro/discussions)
- 📧 [Enterprise Support](mailto:enterprise@automerge-pro.dev)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

