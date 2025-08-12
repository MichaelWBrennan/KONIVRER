# Automerge-Pro GitHub App Backend

A comprehensive, industry-leading GitHub App backend for automated pull request merging with enterprise-grade features.

## Features

### Core Functionality
- 🔄 Automated pull request merging with configurable conditions
- ⚡ Real-time webhook processing
- 🎯 Smart merge strategies (merge, squash, rebase)
- 🔍 Status check validation
- 👥 Review requirement enforcement
- 🏷️ Label-based automation rules

### Enterprise Features
- 💳 GitHub Marketplace integration with tiered pricing
- 🔐 Secure GitHub App authentication
- ☁️ AWS Lambda serverless architecture
- 📊 Comprehensive monitoring and logging
- 🔒 Advanced security features
- 📅 Scheduled merge windows

### Configuration
Projects can be configured using a `.automerge-pro.yml` file in their repository:

```yaml
enabled: true
strategy: merge
conditions:
  required_status_checks:
    - "ci/tests"
    - "ci/lint"
  required_reviews: 1
  required_labels:
    - "automerge"
  blocked_labels:
    - "wip"
    - "do-not-merge"
schedule:
  timezone: "America/New_York"
  hours: [9, 10, 11, 12, 13, 14, 15, 16, 17]
```

## Quick Start

### Prerequisites
- Node.js 18+
- AWS Account (for deployment)
- GitHub App created and installed

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