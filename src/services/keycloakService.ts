import { SSOUserProfile } from './ssoService';

// Keycloak-specific interfaces
export interface KeycloakToken {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
}

export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
  groups: string[];
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  clientSecret?: string;
}

// Keycloak Service for advanced features
export class KeycloakService {
  private static instance: KeycloakService;
  private config: KeycloakConfig;

  private constructor() {
    this.config = {
      url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.REACT_APP_KEYCLOAK_REALM || 'konivrer',
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'konivrer-app',
      clientSecret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET
    };
  }

  public static getInstance(): KeycloakService {
    if (!KeycloakService.instance) {
      KeycloakService.instance = new KeycloakService();
    }
    return KeycloakService.instance;
  }

  // Get Keycloak realm URL
  public getRealmUrl(): string {
    return `${this.config.url}/realms/${this.config.realm}`;
  }

  // Get OpenID Connect endpoints
  public getEndpoints() {
    const realmUrl = this.getRealmUrl();
    return {
      auth: `${realmUrl}/protocol/openid-connect/auth`,
      token: `${realmUrl}/protocol/openid-connect/token`,
      userinfo: `${realmUrl}/protocol/openid-connect/userinfo`,
      logout: `${realmUrl}/protocol/openid-connect/logout`,
      introspect: `${realmUrl}/protocol/openid-connect/token/introspect`,
      wellKnown: `${realmUrl}/.well-known/openid_configuration`
    };
  }

  // Validate token with Keycloak introspection endpoint
  public async validateToken(accessToken: string): Promise<boolean> {
    try {
      const endpoints = this.getEndpoints();
      const response = await fetch(endpoints.introspect, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`
        },
        body: new URLSearchParams({
          token: accessToken,
          client_id: this.config.clientId,
          ...(this.config.clientSecret && { client_secret: this.config.clientSecret })
        })
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.active === true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  // Refresh token using Keycloak
  public async refreshToken(refreshToken: string): Promise<KeycloakToken> {
    const endpoints = this.getEndpoints();
    
    const response = await fetch(endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        ...(this.config.clientSecret && { client_secret: this.config.clientSecret })
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
  }

  // Get user roles from Keycloak
  public async getUserRoles(accessToken: string): Promise<string[]> {
    try {
      const userInfo = await this.getUserInfo(accessToken);
      return userInfo.realm_access?.roles || [];
    } catch (error) {
      console.error('Failed to get user roles:', error);
      return [];
    }
  }

  // Get user info from Keycloak
  public async getUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
    const endpoints = this.getEndpoints();
    
    const response = await fetch(endpoints.userinfo, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return await response.json();
  }

  // Check if user has specific role
  public hasRole(profile: SSOUserProfile, role: string): boolean {
    return profile.roles?.includes(role) || false;
  }

  // Check if user has any of the specified roles
  public hasAnyRole(profile: SSOUserProfile, roles: string[]): boolean {
    if (!profile.roles) return false;
    return roles.some(role => profile.roles!.includes(role));
  }

  // Check if user has all specified roles
  public hasAllRoles(profile: SSOUserProfile, roles: string[]): boolean {
    if (!profile.roles) return false;
    return roles.every(role => profile.roles!.includes(role));
  }

  // Get user's client-specific roles
  public getClientRoles(userInfo: KeycloakUserInfo, clientId: string): string[] {
    return userInfo.resource_access?.[clientId]?.roles || [];
  }

  // Create logout URL with post-logout redirect
  public createLogoutUrl(redirectUri?: string): string {
    const endpoints = this.getEndpoints();
    const params = new URLSearchParams();
    
    if (redirectUri) {
      params.append('post_logout_redirect_uri', redirectUri);
    }

    return `${endpoints.logout}?${params.toString()}`;
  }

  // Parse JWT token (client-side only for debugging)
  public parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  // Check if token is expired
  public isTokenExpired(token: string): boolean {
    const payload = this.parseJWT(token);
    if (!payload || !payload.exp) return true;
    
    return Date.now() >= payload.exp * 1000;
  }

  // Get token expiration time
  public getTokenExpiration(token: string): Date | null {
    const payload = this.parseJWT(token);
    if (!payload || !payload.exp) return null;
    
    return new Date(payload.exp * 1000);
  }

  // Auto-refresh token before expiration
  public setupAutoRefresh(profile: SSOUserProfile, callback: (newProfile: SSOUserProfile) => void): () => void {
    if (!profile.refreshToken) {
      console.warn('No refresh token available for auto-refresh');
      return () => {};
    }

    const refreshBeforeExpiry = 5 * 60 * 1000; // 5 minutes
    const timeUntilExpiry = profile.expiresAt - Date.now();
    const refreshTime = Math.max(0, timeUntilExpiry - refreshBeforeExpiry);

    const timeoutId = setTimeout(async () => {
      try {
        const newToken = await this.refreshToken(profile.refreshToken!);
        const userInfo = await this.getUserInfo(newToken.access_token);
        
        const updatedProfile: SSOUserProfile = {
          ...profile,
          accessToken: newToken.access_token,
          refreshToken: newToken.refresh_token,
          expiresAt: Date.now() + (newToken.expires_in * 1000),
          roles: userInfo.realm_access?.roles || [],
          groups: userInfo.groups || []
        };

        callback(updatedProfile);
        
        // Setup next refresh
        this.setupAutoRefresh(updatedProfile, callback);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        // Dispatch logout event on refresh failure
        window.dispatchEvent(new CustomEvent('sso-logout'));
      }
    }, refreshTime);

    // Return cleanup function
    return () => clearTimeout(timeoutId);
  }

  // Get Keycloak configuration from well-known endpoint
  public async getConfiguration(): Promise<any> {
    try {
      const endpoints = this.getEndpoints();
      const response = await fetch(endpoints.wellKnown);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Keycloak configuration');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get Keycloak configuration:', error);
      throw error;
    }
  }

  // Development mode simulation
  public simulateKeycloakLogin(): SSOUserProfile {
    return {
      id: 'keycloak-demo-user',
      email: 'demo@konivrer.com',
      name: 'Demo User',
      username: 'demo-user',
      firstName: 'Demo',
      lastName: 'User',
      provider: 'keycloak',
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      expiresAt: Date.now() + (60 * 60 * 1000),
      roles: ['user', 'player', 'deck-builder'],
      groups: ['konivrer-users'],
      realm: this.config.realm,
      emailVerified: true
    };
  }
}

// React hook for Keycloak integration
export const useKeycloak = () => {
  const keycloakService = KeycloakService.getInstance();

  return {
    validateToken: keycloakService.validateToken.bind(keycloakService),
    refreshToken: keycloakService.refreshToken.bind(keycloakService),
    getUserRoles: keycloakService.getUserRoles.bind(keycloakService),
    getUserInfo: keycloakService.getUserInfo.bind(keycloakService),
    hasRole: keycloakService.hasRole.bind(keycloakService),
    hasAnyRole: keycloakService.hasAnyRole.bind(keycloakService),
    hasAllRoles: keycloakService.hasAllRoles.bind(keycloakService),
    createLogoutUrl: keycloakService.createLogoutUrl.bind(keycloakService),
    isTokenExpired: keycloakService.isTokenExpired.bind(keycloakService),
    getTokenExpiration: keycloakService.getTokenExpiration.bind(keycloakService),
    setupAutoRefresh: keycloakService.setupAutoRefresh.bind(keycloakService),
    getConfiguration: keycloakService.getConfiguration.bind(keycloakService)
  };
};

export default KeycloakService;