# Keycloak Integration Guide for KONIVRER

## 🔐 Overview

This guide explains how to set up and integrate Keycloak with the KONIVRER application for enterprise-grade identity and access management. Keycloak provides advanced features like role-based access control, single sign-on, and centralized user management.

## 🚀 Quick Start

### 1. Development Setup with Docker

The fastest way to get started with Keycloak for development:

```bash
# Run Keycloak with Docker
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

Access Keycloak Admin Console at: http://localhost:8080/admin
- Username: `admin`
- Password: `admin`

### 2. Environment Configuration

Copy and configure your environment variables:

```bash
cp .env.example .env
```

Update the Keycloak section in `.env`:

```env
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=konivrer
REACT_APP_KEYCLOAK_CLIENT_ID=konivrer-app
REACT_APP_KEYCLOAK_CLIENT_SECRET=your_client_secret_here
```

## 🏗️ Keycloak Configuration

### Step 1: Create a Realm

1. **Access Admin Console**
   - Go to http://localhost:8080/admin
   - Login with admin credentials

2. **Create New Realm**
   - Click "Create Realm" button
   - Name: `konivrer`
   - Display name: `KONIVRER Gaming Platform`
   - Click "Create"

### Step 2: Configure Client

1. **Create Client**
   - Go to "Clients" section
   - Click "Create client"
   - Client ID: `konivrer-app`
   - Client type: `OpenID Connect`
   - Click "Next"

2. **Client Settings**
   - Client authentication: `On` (for confidential client)
   - Authorization: `On` (for fine-grained permissions)
   - Standard flow: `Enabled`
   - Direct access grants: `Enabled`
   - Click "Next"

3. **Login Settings**
   - Valid redirect URIs:
     - `http://localhost:3000/auth/callback/keycloak`
     - `https://yourdomain.com/auth/callback/keycloak`
   - Valid post logout redirect URIs:
     - `http://localhost:3000`
     - `https://yourdomain.com`
   - Web origins: `*` (or specific domains for production)

### Step 3: Configure Roles

1. **Create Realm Roles**
   - Go to "Realm roles"
   - Create the following roles:
     - `user` - Basic user access
     - `premium` - Premium features access
     - `deck-builder` - Deck building features
     - `tournament-organizer` - Tournament management
     - `moderator` - Content moderation
     - `admin` - Administrative access
     - `super-admin` - Full system access

2. **Role Descriptions**
   ```
   user: Basic authenticated user
   premium: Access to premium features and content
   deck-builder: Can create and share custom decks
   tournament-organizer: Can create and manage tournaments
   moderator: Can moderate content and users
   admin: Administrative privileges
   super-admin: Full system administration
   ```

### Step 4: Create Groups (Optional)

1. **Create Groups**
   - Go to "Groups"
   - Create groups like:
     - `konivrer-users`
     - `premium-members`
     - `tournament-organizers`
     - `staff`

2. **Assign Roles to Groups**
   - Select group → "Role mapping"
   - Assign appropriate roles to each group

### Step 5: Configure User Registration

1. **Realm Settings**
   - Go to "Realm settings" → "Login"
   - Enable "User registration"
   - Enable "Email as username"
   - Enable "Login with email"

2. **Email Configuration** (Optional)
   - Go to "Realm settings" → "Email"
   - Configure SMTP settings for email verification

## 🔧 Client Integration

### Basic SSO Integration

The KONIVRER app automatically integrates with Keycloak through the SSO service:

```typescript
import { useSSO } from '../services/ssoService';
import { useKeycloak } from '../services/keycloakService';

function LoginComponent() {
  const { initiateLogin } = useSSO();
  
  const handleKeycloakLogin = () => {
    initiateLogin('keycloak');
  };

  return (
    <button onClick={handleKeycloakLogin}>
      Login with Keycloak
    </button>
  );
}
```

### Role-Based Access Control

Use the built-in role-based access components:

```typescript
import { AdminAccess, PremiumAccess, DeckBuilderAccess } from '../components/RoleBasedAccess';

function App() {
  return (
    <div>
      {/* Only admins can see this */}
      <AdminAccess>
        <AdminPanel />
      </AdminAccess>

      {/* Premium users only */}
      <PremiumAccess>
        <PremiumFeatures />
      </PremiumAccess>

      {/* Deck builders */}
      <DeckBuilderAccess>
        <DeckEditor />
      </DeckBuilderAccess>
    </div>
  );
}
```

### Using Role Hooks

Check roles programmatically:

```typescript
import { useRoleAccess } from '../components/RoleBasedAccess';

function UserProfile() {
  const { hasRole, hasAnyRole, roles, isKeycloakUser } = useRoleAccess();

  if (!isKeycloakUser) {
    return <div>Please login with Keycloak</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Roles: {roles.join(', ')}</p>
      
      {hasRole('admin') && <AdminTools />}
      {hasAnyRole(['premium', 'admin']) && <PremiumContent />}
    </div>
  );
}
```

## 🔒 Advanced Security Features

### Token Validation

Automatic token validation with Keycloak:

```typescript
import { useKeycloak } from '../services/keycloakService';

function SecureComponent() {
  const { validateToken, isTokenExpired } = useKeycloak();
  
  useEffect(() => {
    const checkToken = async () => {
      const user = getCurrentUser();
      if (user && isTokenExpired(user.accessToken)) {
        // Token expired, refresh or logout
        logout();
      }
    };
    
    checkToken();
  }, []);
}
```

### Auto Token Refresh

Automatic token refresh before expiration:

```typescript
import { useKeycloak } from '../services/keycloakService';

function App() {
  const { setupAutoRefresh } = useKeycloak();
  const { getCurrentUser } = useSSO();

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.provider === 'keycloak') {
      const cleanup = setupAutoRefresh(user, (newProfile) => {
        // Update user session with new tokens
        console.log('Token refreshed:', newProfile);
      });

      return cleanup; // Cleanup on unmount
    }
  }, []);
}
```

## 🌐 Production Deployment

### Docker Compose Setup

Create `docker-compose.yml` for production:

```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: ${KEYCLOAK_DB_PASSWORD}
      KC_HOSTNAME: ${KEYCLOAK_HOSTNAME}
      KC_HTTPS_CERTIFICATE_FILE: /opt/keycloak/conf/server.crt.pem
      KC_HTTPS_CERTIFICATE_KEY_FILE: /opt/keycloak/conf/server.key.pem
    ports:
      - "8080:8080"
      - "8443:8443"
    volumes:
      - ./certs:/opt/keycloak/conf
    depends_on:
      - postgres
    command: start

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: ${KEYCLOAK_DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### SSL/TLS Configuration

1. **Generate SSL Certificates**
   ```bash
   # Self-signed for development
   openssl req -x509 -newkey rsa:4096 -keyout server.key.pem -out server.crt.pem -days 365 -nodes
   ```

2. **Production Certificates**
   - Use Let's Encrypt or your certificate authority
   - Place certificates in `./certs` directory

### Environment Variables

Production `.env` file:

```env
# Keycloak Production Configuration
REACT_APP_KEYCLOAK_URL=https://auth.yourdomain.com
REACT_APP_KEYCLOAK_REALM=konivrer
REACT_APP_KEYCLOAK_CLIENT_ID=konivrer-app
REACT_APP_KEYCLOAK_CLIENT_SECRET=your_production_secret

# Database
KEYCLOAK_DB_PASSWORD=secure_db_password
KEYCLOAK_ADMIN_PASSWORD=secure_admin_password
KEYCLOAK_HOSTNAME=auth.yourdomain.com
```

## 🔧 Customization

### Custom Login Theme

1. **Create Theme Directory**
   ```bash
   mkdir -p themes/konivrer/login
   ```

2. **Theme Configuration**
   Create `themes/konivrer/theme.properties`:
   ```properties
   parent=keycloak
   import=common/keycloak
   
   styles=css/login.css
   ```

3. **Custom CSS**
   Create `themes/konivrer/login/resources/css/login.css`:
   ```css
   .login-pf body {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   }
   
   .card-pf {
     background: rgba(255, 255, 255, 0.95);
     border-radius: 16px;
     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
   }
   ```

### Custom User Attributes

1. **Add User Attributes**
   - Go to "Realm settings" → "User profile"
   - Add custom attributes like:
     - `gaming_level`
     - `preferred_game_mode`
     - `tournament_rating`

2. **Include in Token**
   - Go to "Client scopes" → "roles" → "Mappers"
   - Create new mapper for custom attributes

## 📊 Monitoring and Analytics

### Admin Events

1. **Enable Event Logging**
   - Go to "Realm settings" → "Events"
   - Enable "Save events"
   - Configure event types to log

2. **Event Types to Monitor**
   - LOGIN
   - LOGOUT
   - REGISTER
   - UPDATE_PROFILE
   - CLIENT_LOGIN

### Metrics Integration

Keycloak provides metrics endpoints for monitoring:

```bash
# Metrics endpoint (if enabled)
curl http://localhost:8080/realms/konivrer/metrics
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check "Web origins" in client settings
   - Ensure correct redirect URIs

2. **Token Validation Fails**
   - Verify client secret configuration
   - Check token expiration settings

3. **Role Mapping Issues**
   - Verify role assignments in user profile
   - Check client scope mappings

### Debug Mode

Enable debug logging in development:

```typescript
// In keycloakService.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Keycloak Debug:', { token, userInfo, roles });
}
```

### Health Checks

Monitor Keycloak health:

```bash
# Health check endpoint
curl http://localhost:8080/health

# Ready check
curl http://localhost:8080/health/ready
```

## 🔄 Migration and Backup

### Export Realm Configuration

```bash
# Export realm
docker exec -it keycloak_container /opt/keycloak/bin/kc.sh export \
  --realm konivrer \
  --file /tmp/konivrer-realm.json
```

### Import Realm Configuration

```bash
# Import realm
docker exec -it keycloak_container /opt/keycloak/bin/kc.sh import \
  --file /tmp/konivrer-realm.json
```

## 📚 Additional Resources

- **Keycloak Documentation**: https://www.keycloak.org/documentation
- **OpenID Connect Spec**: https://openid.net/connect/
- **OAuth 2.0 Spec**: https://oauth.net/2/
- **Keycloak REST API**: https://www.keycloak.org/docs-api/

## 🎯 Best Practices

1. **Security**
   - Use HTTPS in production
   - Regularly rotate client secrets
   - Enable brute force protection
   - Configure session timeouts

2. **Performance**
   - Use connection pooling for database
   - Configure appropriate cache settings
   - Monitor memory usage

3. **User Experience**
   - Customize login themes
   - Configure appropriate session lengths
   - Provide clear error messages

4. **Maintenance**
   - Regular backups of realm configuration
   - Monitor logs for security events
   - Keep Keycloak updated

---

## 📝 Summary

The KONIVRER Keycloak integration provides:

- ✅ **Enterprise SSO**: Full OpenID Connect integration
- ✅ **Role-Based Access**: Granular permission system
- ✅ **Token Management**: Automatic refresh and validation
- ✅ **Security Features**: Brute force protection, session management
- ✅ **Customizable**: Themes, user attributes, and workflows
- ✅ **Production Ready**: Docker deployment, SSL/TLS support
- ✅ **Monitoring**: Event logging and metrics
- ✅ **Developer Friendly**: React hooks and components

For additional support, refer to the main SSO documentation or Keycloak's official documentation.