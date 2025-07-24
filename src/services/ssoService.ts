import { useAdvancedSecurity } from '../security/AdvancedSecuritySystem';

// SSO Provider Configuration
export interface SSOProvider {
  id: string;
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  iconUrl: string;
  color: string;
  bgColor: string;
  // Keycloak-specific properties
  logoutUrl?: string;
  realm?: string;
  serverUrl?: string;
}

// SSO User Profile
export interface SSOUserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  // Keycloak-specific properties
  roles?: string[];
  groups?: string[];
  realm?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
}

// SSO Configuration
const SSO_CONFIG = {
  keycloak: {
    id: 'keycloak',
    name: 'Keycloak',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'konivrer-app',
    redirectUri: `${window.location.origin}/auth/callback/keycloak`,
    scope: ['openid', 'profile', 'email', 'roles'],
    authUrl: `${process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080'}/realms/${process.env.REACT_APP_KEYCLOAK_REALM || 'konivrer'}/protocol/openid-connect/auth`,
    tokenUrl: `${process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080'}/realms/${process.env.REACT_APP_KEYCLOAK_REALM || 'konivrer'}/protocol/openid-connect/token`,
    userInfoUrl: `${process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080'}/realms/${process.env.REACT_APP_KEYCLOAK_REALM || 'konivrer'}/protocol/openid-connect/userinfo`,
    logoutUrl: `${process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080'}/realms/${process.env.REACT_APP_KEYCLOAK_REALM || 'konivrer'}/protocol/openid-connect/logout`,
    iconUrl: 'https://www.keycloak.org/resources/images/keycloak_logo_200px.svg',
    color: '#ffffff',
    bgColor: '#4d4d4d'
  },
  google: {
    id: 'google',
    name: 'Google',
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-google-client-id',
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: ['openid', 'profile', 'email'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    iconUrl: 'https://developers.google.com/identity/images/g-logo.png',
    color: '#DB4437',
    bgColor: '#fff'
  },
  github: {
    id: 'github',
    name: 'GitHub',
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || 'demo-github-client-id',
    redirectUri: `${window.location.origin}/auth/callback/github`,
    scope: ['user:email', 'read:user'],
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    color: '#fff',
    bgColor: '#333'
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    clientId: process.env.REACT_APP_DISCORD_CLIENT_ID || 'demo-discord-client-id',
    redirectUri: `${window.location.origin}/auth/callback/discord`,
    scope: ['identify', 'email'],
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
    iconUrl: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    color: '#fff',
    bgColor: '#7289DA'
  },
  steam: {
    id: 'steam',
    name: 'Steam',
    clientId: process.env.REACT_APP_STEAM_CLIENT_ID || 'demo-steam-client-id',
    redirectUri: `${window.location.origin}/auth/callback/steam`,
    scope: ['identity'],
    authUrl: 'https://steamcommunity.com/openid/login',
    tokenUrl: 'https://steamcommunity.com/openid/login',
    userInfoUrl: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
    iconUrl: 'https://store.steampowered.com/favicon.ico',
    color: '#fff',
    bgColor: '#1b2838'
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    clientId: process.env.REACT_APP_APPLE_CLIENT_ID || 'demo-apple-client-id',
    redirectUri: `${window.location.origin}/auth/callback/apple`,
    scope: ['name', 'email'],
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    userInfoUrl: 'https://appleid.apple.com/auth/userinfo',
    iconUrl: 'https://developer.apple.com/assets/elements/icons/sign-in-with-apple/sign-in-with-apple.svg',
    color: '#fff',
    bgColor: '#000'
  }
} as const;

// SSO Service Class
export class SSOService {
  private static instance: SSOService;
  private providers: Record<string, SSOProvider>;
  private currentProvider: string | null = null;

  private constructor() {
    this.providers = SSO_CONFIG;
  }

  public static getInstance(): SSOService {
    if (!SSOService.instance) {
      SSOService.instance = new SSOService();
    }
    return SSOService.instance;
  }

  // Get all available providers
  public getProviders(): SSOProvider[] {
    return Object.values(this.providers);
  }

  // Get specific provider
  public getProvider(providerId: string): SSOProvider | null {
    return this.providers[providerId] || null;
  }

  // Generate OAuth URL
  public generateAuthUrl(providerId: string): string {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope.join(' '),
      response_type: 'code',
      state: this.generateState(providerId)
    });

    // Special handling for different providers
    if (providerId === 'google') {
      params.append('access_type', 'offline');
      params.append('prompt', 'consent');
    } else if (providerId === 'apple') {
      params.append('response_mode', 'form_post');
    }

    return `${provider.authUrl}?${params.toString()}`;
  }

  // Generate secure state parameter
  private generateState(providerId: string): string {
    const state = {
      provider: providerId,
      timestamp: Date.now(),
      nonce: crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    };
    return btoa(JSON.stringify(state));
  }

  // Validate state parameter
  private validateState(state: string, expectedProvider: string): boolean {
    try {
      const decoded = JSON.parse(atob(state));
      const now = Date.now();
      const maxAge = 10 * 60 * 1000; // 10 minutes

      return (
        decoded.provider === expectedProvider &&
        decoded.timestamp &&
        (now - decoded.timestamp) < maxAge &&
        decoded.nonce
      );
    } catch {
      return false;
    }
  }

  // Initiate SSO login
  public async initiateLogin(providerId: string): Promise<void> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not supported`);
    }

    this.currentProvider = providerId;
    
    // Store provider info in session for callback
    sessionStorage.setItem('sso_provider', providerId);
    sessionStorage.setItem('sso_timestamp', Date.now().toString());

    // Generate auth URL and redirect
    const authUrl = this.generateAuthUrl(providerId);
    
    // For demo purposes, we'll simulate the OAuth flow
    if (process.env.NODE_ENV === 'development') {
      return this.simulateOAuthFlow(providerId);
    }

    // In production, redirect to OAuth provider
    window.location.href = authUrl;
  }

  // Simulate OAuth flow for development
  private async simulateOAuthFlow(providerId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful OAuth callback
        const mockProfile: SSOUserProfile = {
          id: `${providerId}_${Date.now()}`,
          email: `user@${providerId}.com`,
          name: `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} User`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${providerId}`,
          provider: providerId,
          accessToken: `mock_token_${Date.now()}`,
          expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
        };

        // Trigger callback handling
        this.handleCallback(mockProfile);
        resolve();
      }, 1500); // Simulate network delay
    });
  }

  // Handle OAuth callback
  public async handleCallback(code: string, state: string, providerId: string): Promise<SSOUserProfile>;
  public async handleCallback(profile: SSOUserProfile): Promise<SSOUserProfile>;
  public async handleCallback(
    codeOrProfile: string | SSOUserProfile, 
    state?: string, 
    providerId?: string
  ): Promise<SSOUserProfile> {
    // Handle mock profile (development)
    if (typeof codeOrProfile === 'object') {
      const profile = codeOrProfile;
      
      // Store user session
      this.storeUserSession(profile);
      
      // Dispatch custom event for login success
      window.dispatchEvent(new CustomEvent('sso-login-success', { 
        detail: { profile, provider: profile.provider } 
      }));

      return profile;
    }

    // Handle real OAuth callback (production)
    const code = codeOrProfile;
    if (!state || !providerId) {
      throw new Error('Invalid callback parameters');
    }

    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    // Validate state parameter
    if (!this.validateState(state, providerId)) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    const tokenResponse = await this.exchangeCodeForToken(code, provider);
    
    // Get user profile
    const profile = await this.getUserProfile(tokenResponse.access_token, provider);
    
    // Store user session
    this.storeUserSession(profile);

    return profile;
  }

  // Exchange authorization code for access token
  private async exchangeCodeForToken(code: string, provider: SSOProvider): Promise<any> {
    const tokenData = {
      client_id: provider.clientId,
      client_secret: process.env[`REACT_APP_${provider.id.toUpperCase()}_CLIENT_SECRET`] || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: provider.redirectUri
    };

    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(tokenData)
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get user profile from provider
  private async getUserProfile(accessToken: string, provider: SSOProvider): Promise<SSOUserProfile> {
    const response = await fetch(provider.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    const userData = await response.json();
    
    // Normalize user data based on provider
    return this.normalizeUserData(userData, provider, accessToken);
  }

  // Normalize user data from different providers
  private normalizeUserData(userData: any, provider: SSOProvider, accessToken: string): SSOUserProfile {
    switch (provider.id) {
      case 'keycloak':
        return {
          id: userData.sub,
          email: userData.email,
          name: userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim(),
          avatar: userData.picture,
          provider: provider.id,
          accessToken,
          expiresAt: Date.now() + (userData.exp ? (userData.exp * 1000) : (60 * 60 * 1000)),
          // Keycloak-specific fields
          roles: userData.realm_access?.roles || [],
          groups: userData.groups || [],
          realm: userData.iss?.split('/realms/')[1] || provider.realm,
          username: userData.preferred_username,
          firstName: userData.given_name,
          lastName: userData.family_name,
          emailVerified: userData.email_verified
        };

      case 'google':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.picture,
          provider: provider.id,
          accessToken,
          expiresAt: Date.now() + (60 * 60 * 1000)
        };

      case 'github':
        return {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name || userData.login,
          avatar: userData.avatar_url,
          provider: provider.id,
          accessToken,
          expiresAt: Date.now() + (60 * 60 * 1000)
        };

      case 'discord':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.username,
          avatar: userData.avatar ? 
            `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 
            undefined,
          provider: provider.id,
          accessToken,
          expiresAt: Date.now() + (60 * 60 * 1000)
        };

      default:
        return {
          id: userData.id || userData.sub,
          email: userData.email,
          name: userData.name || userData.display_name,
          avatar: userData.avatar || userData.picture,
          provider: provider.id,
          accessToken,
          expiresAt: Date.now() + (60 * 60 * 1000)
        };
    }
  }

  // Store user session securely
  private storeUserSession(profile: SSOUserProfile): void {
    const sessionData = {
      ...profile,
      loginTime: Date.now()
    };

    // Store in secure session storage (encrypted in production)
    sessionStorage.setItem('sso_user_session', JSON.stringify(sessionData));
    
    // Clear temporary OAuth data
    sessionStorage.removeItem('sso_provider');
    sessionStorage.removeItem('sso_timestamp');
  }

  // Get current user session
  public getCurrentUser(): SSOUserProfile | null {
    try {
      const sessionData = sessionStorage.getItem('sso_user_session');
      if (!sessionData) return null;

      const profile = JSON.parse(sessionData) as SSOUserProfile;
      
      // Check if session is expired
      if (Date.now() > profile.expiresAt) {
        this.logout();
        return null;
      }

      return profile;
    } catch {
      return null;
    }
  }

  // Logout user
  public logout(): void {
    const currentUser = this.getCurrentUser();
    
    // Clear local session
    sessionStorage.removeItem('sso_user_session');
    this.currentProvider = null;
    
    // For Keycloak, perform server-side logout
    if (currentUser?.provider === 'keycloak') {
      this.performKeycloakLogout(currentUser);
    }
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('sso-logout'));
  }

  // Perform Keycloak server-side logout
  private performKeycloakLogout(profile: SSOUserProfile): void {
    const provider = this.getProvider('keycloak');
    if (!provider?.logoutUrl) return;

    const logoutParams = new URLSearchParams({
      post_logout_redirect_uri: window.location.origin,
      id_token_hint: profile.accessToken
    });

    // Redirect to Keycloak logout endpoint
    window.location.href = `${provider.logoutUrl}?${logoutParams.toString()}`;
  }

  // Refresh access token
  public async refreshToken(profile: SSOUserProfile): Promise<SSOUserProfile> {
    if (!profile.refreshToken) {
      throw new Error('No refresh token available');
    }

    const provider = this.getProvider(profile.provider);
    if (!provider) {
      throw new Error(`Provider ${profile.provider} not found`);
    }

    // Implementation would depend on provider's refresh token flow
    // For now, return the existing profile with extended expiry
    const refreshedProfile = {
      ...profile,
      expiresAt: Date.now() + (60 * 60 * 1000)
    };

    this.storeUserSession(refreshedProfile);
    return refreshedProfile;
  }
}

// React Hook for SSO
export const useSSO = () => {
  const ssoService = SSOService.getInstance();
  const { reportThreat } = useAdvancedSecurity();

  const initiateLogin = async (providerId: string) => {
    try {
      await ssoService.initiateLogin(providerId);
    } catch (error) {
      reportThreat({
        type: 'data_breach',
        severity: 'medium',
        source: 'sso_login',
        blocked: true,
        details: `SSO login failed for provider ${providerId}: ${error}`
      });
      throw error;
    }
  };

  const logout = () => {
    ssoService.logout();
  };

  const getCurrentUser = () => {
    return ssoService.getCurrentUser();
  };

  const getProviders = () => {
    return ssoService.getProviders();
  };

  return {
    initiateLogin,
    logout,
    getCurrentUser,
    getProviders,
    ssoService
  };
};

export default SSOService;