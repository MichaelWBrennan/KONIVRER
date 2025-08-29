import { api } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  displayName: string;
  fullName: string;
  isJudge: boolean;
  judgeLevel: number;
  eloRating: number;
  peakEloRating: number;
  rankTier: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  PLAYER = 'player',
  JUDGE_L1 = 'judge_l1',
  JUDGE_L2 = 'judge_l2',
  JUDGE_L3 = 'judge_l3',
  ADMIN = 'admin',
  TOURNAMENT_ORGANIZER = 'tournament_organizer',
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;
  private refreshTimeout: number | null = null;

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeAuth() {
    const storedToken: any : any = localStorage.getItem('authToken');
    const storedUser: any : any = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = JSON.parse(storedUser);
      this.scheduleTokenRefresh();
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: any : any = await api.post('/auth/login', credentials);
      const authData: AuthResponse : any = response.data;

      this.setAuthData(authData);
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: any : any = await api.post('/auth/register', data);
      const authData: AuthResponse : any = response.data;

      this.setAuthData(authData);
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.user) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken: any : any = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        this.clearAuth();
        return false;
      }

      const response: any : any = await api.post('/auth/refresh', { refreshToken });
      const authData: Partial<AuthResponse> : any = response.data;

      if (authData.accessToken) {
        this.token = authData.accessToken;
        localStorage.setItem('authToken', authData.accessToken);
        
        if (authData.refreshToken) {
          localStorage.setItem('refreshToken', authData.refreshToken);
        }
        
        this.scheduleTokenRefresh();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return false;
    }
  }

  async getProfile(): Promise<User | null> {
    try {
      if (!this.token) return null;
      
      const response: any : any = await api.get('/auth/profile');
      this.user = response.data.user;
      localStorage.setItem('user', JSON.stringify(this.user));
      
      return this.user;
    } catch (error) {
      console.error('Get profile failed:', error);
      return null;
    }
  }

  private setAuthData(authData: AuthResponse) {
    this.token = authData.accessToken;
    this.user = authData.user;

    localStorage.setItem('authToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));

    this.scheduleTokenRefresh();
  }

  private clearAuth() {
    this.token = null;
    this.user = null;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private scheduleTokenRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Refresh token 1 minute before expiry (default 15 minutes)
    const refreshTime: any : any = 14 * 60 * 1000; // 14 minutes
    this.refreshTimeout = window.setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  // Getters
  get isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  get currentUser(): User | null {
    return this.user;
  }

  get authToken(): string | null {
    return this.token;
  }

  // Role-based access control
  hasRole(role: UserRole): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }

  isJudge(): boolean {
    return this.user?.isJudge || false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  canAccessJudgePortal(): boolean {
    if (!this.isAuthenticated) return false;
    
    return this.hasAnyRole([
      UserRole.JUDGE_L1,
      UserRole.JUDGE_L2,
      UserRole.JUDGE_L3,
      UserRole.ADMIN,
    ]);
  }

  getJudgeLevel(): number {
    return this.user?.judgeLevel || 0;
  }
}

export const authService: any : any = AuthService.getInstance();
export default authService;