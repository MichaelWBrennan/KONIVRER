/**
 * Modern OAuth2/OIDC Authentication Service
 * Industry-leading authentication with multiple providers
 */

export interface AuthProvider {
  id: string;
  name: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  tokenEndpoint: string;
  userInfoEndpoint: string;
  authorizeUrl: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  roles: string[];
  permissions: string[];
  lastLogin: Date;
  metadata: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export class ModernAuthService {
  private providers: Map<string, AuthProvider> = new Map();
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    this.initializeProviders();
    this.loadStoredAuth();
    this.setupTokenRefresh();
  }

  private initializeProviders(): void {
    // Google OAuth2
    this.addProvider({
      id: 'google',
      name: 'Google',
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/google`,
      scopes: ['openid', 'profile', 'email'],
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    // GitHub OAuth2
    this.addProvider({
      id: 'github',
      name: 'GitHub',
      clientId: process.env.VITE_GITHUB_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/github`,
      scopes: ['user:email', 'read:user'],
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
      userInfoEndpoint: 'https://api.github.com/user',
      authorizeUrl: 'https://github.com/login/oauth/authorize',
    });

    // Microsoft OAuth2
    this.addProvider({
      id: 'microsoft',
      name: 'Microsoft',
      clientId: process.env.VITE_MICROSOFT_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/microsoft`,
      scopes: ['openid', 'profile', 'email'],
      tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
      authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    });
  }

  private addProvider(provider: AuthProvider): void {
    this.providers.set(provider.id, provider);
  }

  public async login(providerId: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}`);
    }

    this.updateState({ isLoading: true, error: null });

    try {
      // Generate state and PKCE parameters for security
      const state = this.generateState();
      const { codeVerifier, codeChallenge } = this.generatePKCE();

      // Store PKCE verifier for later use
      sessionStorage.setItem('auth_code_verifier', codeVerifier);
      sessionStorage.setItem('auth_state', state);

      // Build authorization URL
      const params = new URLSearchParams({
        client_id: provider.clientId,
        redirect_uri: provider.redirectUri,
        response_type: 'code',
        scope: provider.scopes.join(' '),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      // Redirect to provider
      window.location.href = `${provider.authorizeUrl}?${params.toString()}`;
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  }

  public async handleCallback(providerId: string, code: string, state: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}`);
    }

    // Verify state parameter
    const storedState = sessionStorage.getItem('auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      // Exchange code for tokens
      const codeVerifier = sessionStorage.getItem('auth_code_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      const tokenResponse = await this.exchangeCodeForTokens(provider, code, codeVerifier);
      const userInfo = await this.fetchUserInfo(provider, tokenResponse.access_token);

      // Create user object
      const user: User = {
        id: userInfo.id || userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.login,
        avatar: userInfo.picture || userInfo.avatar_url,
        provider: providerId,
        roles: ['user'], // Default role
        permissions: ['read', 'write'], // Default permissions
        lastLogin: new Date(),
        metadata: userInfo,
      };

      // Store tokens securely
      this.storeTokens(tokenResponse);

      this.updateState({
        user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
      });

      // Clean up
      sessionStorage.removeItem('auth_code_verifier');
      sessionStorage.removeItem('auth_state');

    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    // Clear tokens
    localStorage.removeItem('auth_tokens');
    sessionStorage.removeItem('auth_code_verifier');
    sessionStorage.removeItem('auth_state');

    // Reset state
    this.updateState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
  }

  public async refreshAccessToken(): Promise<void> {
    if (!this.state.refreshToken || !this.state.user) {
      throw new Error('No refresh token available');
    }

    const provider = this.providers.get(this.state.user.provider);
    if (!provider) {
      throw new Error('Provider not found');
    }

    try {
      const response = await fetch(provider.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.state.refreshToken,
          client_id: provider.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokenData = await response.json();
      
      this.updateState({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || this.state.refreshToken,
        expiresAt: Date.now() + (tokenData.expires_in * 1000),
      });

      this.storeTokens(tokenData);
    } catch (error) {
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private updateState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  private generateState(): string {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  }

  private generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
      .then(hash => ({
        codeVerifier,
        codeChallenge: btoa(String.fromCharCode(...new Uint8Array(hash)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
      })) as any;
  }

  private async exchangeCodeForTokens(provider: AuthProvider, code: string, codeVerifier: string): Promise<any> {
    const response = await fetch(provider.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: provider.redirectUri,
        client_id: provider.clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async fetchUserInfo(provider: AuthProvider, accessToken: string): Promise<any> {
    const response = await fetch(provider.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`User info fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  private storeTokens(tokens: any): void {
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      stored_at: Date.now(),
    };

    localStorage.setItem('auth_tokens', JSON.stringify(tokenData));
  }

  private loadStoredAuth(): void {
    try {
      const stored = localStorage.getItem('auth_tokens');
      if (stored) {
        const tokens = JSON.parse(stored);
        const expiresAt = tokens.stored_at + (tokens.expires_in * 1000);
        
        if (Date.now() < expiresAt) {
          // Tokens are still valid, restore state
          this.updateState({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt,
            isAuthenticated: true,
          });
        } else {
          // Tokens expired, clear storage
          localStorage.removeItem('auth_tokens');
        }
      }
    } catch (error) {
      console.warn('Failed to load stored auth:', error);
      localStorage.removeItem('auth_tokens');
    }
  }

  private setupTokenRefresh(): void {
    // Check for token expiry every minute
    setInterval(() => {
      if (this.state.isAuthenticated && this.state.expiresAt) {
        // Refresh if token expires in the next 5 minutes
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() + fiveMinutes > this.state.expiresAt) {
          this.refreshAccessToken().catch(console.error);
        }
      }
    }, 60000);
  }
}

// Global instance
export const authService = new ModernAuthService();