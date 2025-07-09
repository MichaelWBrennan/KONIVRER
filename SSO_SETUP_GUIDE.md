# SSO Setup Guide for KONIVRER

## Overview

This guide explains how to set up Single Sign-On (SSO) authentication for the KONIVRER application using various OAuth providers including Google, GitHub, Discord, Steam, and Apple.

## 🔧 Quick Setup

### 1. Environment Configuration

Copy the example environment file and configure your OAuth credentials:

```bash
cp .env.example .env
```

Edit `.env` with your OAuth application credentials from each provider.

### 2. Development Mode

In development mode, the SSO system will simulate OAuth flows for testing purposes. No real OAuth credentials are required for basic testing.

### 3. Production Setup

For production deployment, you'll need to register OAuth applications with each provider and configure the environment variables.

## 🌐 Provider Setup Instructions

### Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/callback/google` (development)
     - `https://yourdomain.com/auth/callback/google` (production)

4. **Configure Environment**
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Configure OAuth App**
   - Application name: "KONIVRER"
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/auth/callback/github`

3. **Configure Environment**
   ```env
   REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
   REACT_APP_GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Discord OAuth Setup

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Click "New Application"

2. **Configure OAuth2**
   - Go to "OAuth2" section
   - Add redirect URIs:
     - `http://localhost:3000/auth/callback/discord` (development)
     - `https://yourdomain.com/auth/callback/discord` (production)
   - Select scopes: `identify`, `email`

3. **Configure Environment**
   ```env
   REACT_APP_DISCORD_CLIENT_ID=your_discord_client_id
   REACT_APP_DISCORD_CLIENT_SECRET=your_discord_client_secret
   ```

### Steam OAuth Setup

1. **Register Steam Web API Key**
   - Visit: https://steamcommunity.com/dev/apikey
   - Register your domain

2. **Steam OpenID Setup**
   - Steam uses OpenID 2.0, not OAuth2
   - No client secret required
   - Configure return URL: `https://yourdomain.com/auth/callback/steam`

3. **Configure Environment**
   ```env
   REACT_APP_STEAM_CLIENT_ID=your_steam_api_key
   ```

### Apple OAuth Setup

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/
   - Sign in with Apple Developer account

2. **Create App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Create new App ID with "Sign In with Apple" capability

3. **Create Service ID**
   - Create new Service ID
   - Configure "Sign In with Apple"
   - Add return URLs: `https://yourdomain.com/auth/callback/apple`

4. **Configure Environment**
   ```env
   REACT_APP_APPLE_CLIENT_ID=your_apple_service_id
   REACT_APP_APPLE_CLIENT_SECRET=your_apple_client_secret
   ```

## 🔒 Security Configuration

### HTTPS Requirements

Most OAuth providers require HTTPS for production. Ensure your production deployment uses SSL/TLS certificates.

### CORS Configuration

Configure your server to allow CORS requests from OAuth providers:

```javascript
// Example Express.js CORS configuration
app.use(cors({
  origin: [
    'https://accounts.google.com',
    'https://github.com',
    'https://discord.com',
    'https://steamcommunity.com',
    'https://appleid.apple.com'
  ],
  credentials: true
}));
```

### State Parameter Security

The SSO service automatically generates secure state parameters to prevent CSRF attacks. Each state parameter includes:
- Provider identifier
- Timestamp (10-minute expiry)
- Cryptographic nonce

## 🧪 Testing SSO Integration

### Development Testing

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Open Login Modal**
   - Click login button
   - SSO buttons will appear with provider logos

3. **Test SSO Flow**
   - Click any SSO provider button
   - In development mode, it will simulate OAuth flow
   - Check browser console for detailed logs

### Production Testing

1. **Deploy Application**
   - Ensure all environment variables are set
   - Verify HTTPS is enabled
   - Check OAuth redirect URIs match deployment URL

2. **Test Each Provider**
   - Test login flow with each configured provider
   - Verify user profile data is correctly retrieved
   - Check session management and logout functionality

## 🔧 Customization

### Adding New Providers

1. **Update SSO Configuration**
   ```typescript
   // In src/services/ssoService.ts
   const SSO_CONFIG = {
     // ... existing providers
     newprovider: {
       id: 'newprovider',
       name: 'New Provider',
       clientId: process.env.REACT_APP_NEWPROVIDER_CLIENT_ID,
       // ... other configuration
     }
   };
   ```

2. **Add Provider Logo**
   - Add provider icon URL to configuration
   - Ensure icon is accessible and properly sized

3. **Implement User Data Normalization**
   ```typescript
   // In normalizeUserData method
   case 'newprovider':
     return {
       id: userData.user_id,
       email: userData.email_address,
       name: userData.display_name,
       // ... normalize other fields
     };
   ```

### Customizing Button Appearance

Modify the SSO button styles in `src/components/SSOButton.tsx`:

```typescript
const customButtonStyle = {
  backgroundColor: provider.bgColor,
  color: provider.color,
  border: `1px solid ${provider.color}`,
  // ... additional styles
};
```

## 📊 Monitoring and Analytics

### SSO Usage Tracking

The SSO service integrates with the security system to track:
- Login attempts by provider
- Success/failure rates
- Security threats and blocked attempts
- User session duration

### Error Handling

Common SSO errors and solutions:

1. **Invalid Redirect URI**
   - Ensure redirect URIs match exactly in OAuth app configuration
   - Check for trailing slashes and protocol (http vs https)

2. **Invalid Client Credentials**
   - Verify client ID and secret are correctly set in environment
   - Check for extra spaces or special characters

3. **Scope Permissions**
   - Ensure requested scopes are approved in OAuth app
   - Some providers require additional approval for email access

4. **CORS Issues**
   - Configure server CORS settings
   - Check browser console for CORS errors

## 🚀 Production Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```bash
# Check environment variables
echo $REACT_APP_GOOGLE_CLIENT_ID
echo $REACT_APP_GITHUB_CLIENT_ID
# ... check all providers
```

### Security Checklist

- [ ] HTTPS enabled for all OAuth redirect URIs
- [ ] Client secrets stored securely (not in client-side code)
- [ ] CORS properly configured
- [ ] Rate limiting implemented for OAuth endpoints
- [ ] Session security configured (secure cookies, CSRF protection)
- [ ] Error handling doesn't expose sensitive information

### Performance Optimization

- [ ] OAuth provider icons optimized and cached
- [ ] SSO service lazy-loaded to reduce initial bundle size
- [ ] Session storage optimized for performance
- [ ] Network requests minimized during OAuth flow

## 🆘 Troubleshooting

### Common Issues

1. **SSO Button Not Appearing**
   - Check if providers are properly configured in SSO service
   - Verify component imports and exports
   - Check browser console for JavaScript errors

2. **OAuth Flow Fails**
   - Verify redirect URIs match exactly
   - Check network tab for failed requests
   - Ensure OAuth app is properly configured

3. **User Profile Not Loading**
   - Check user info API permissions
   - Verify access token is valid
   - Check data normalization logic

### Debug Mode

Enable debug logging in development:

```typescript
// In src/services/ssoService.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('SSO Debug:', { provider, profile, token });
}
```

### Support Resources

- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **GitHub OAuth**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Discord OAuth**: https://discord.com/developers/docs/topics/oauth2
- **Steam OpenID**: https://steamcommunity.com/dev
- **Apple Sign In**: https://developer.apple.com/sign-in-with-apple/

---

## 📝 Summary

The KONIVRER SSO system provides:
- ✅ **Multi-provider support**: Google, GitHub, Discord, Steam, Apple
- ✅ **Security-first design**: CSRF protection, secure state management
- ✅ **Development-friendly**: Simulated OAuth flows for testing
- ✅ **Production-ready**: Full OAuth 2.0 implementation
- ✅ **Customizable**: Easy to add new providers and customize appearance
- ✅ **Integrated monitoring**: Security tracking and analytics

For additional support or questions, refer to the main application documentation or contact the development team.