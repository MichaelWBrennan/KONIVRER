# Security Policy

## Supported Versions

We actively support the following versions of KONIVRER Deck Database:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email security concerns to: [security@konivrer.com] (or create a private security advisory)
3. Include detailed information about the vulnerability
4. Allow reasonable time for response and fix

## Security Measures

This project implements the following security measures:

### Frontend Security

- Content Security Policy (CSP) headers
- XSS protection headers
- Frame options to prevent clickjacking
- HTTPS enforcement
- Input validation and sanitization

### Dependency Security

- Regular dependency audits
- Automated security updates
- Pinned dependency versions
- Security-focused package resolutions

### Build Security

- Secure build pipeline
- Environment variable protection
- Source map disabled in production
- Minification and obfuscation

### API Security

- Rate limiting
- Input validation
- CORS configuration
- Secure headers

## Security Headers

The application implements the following security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com
```

## Dependency Management

We use:

- Yarn for consistent dependency resolution
- Security-focused package resolutions
- Regular security audits
- Automated dependency updates

## Contact

For security-related questions or concerns, please contact the development team.
