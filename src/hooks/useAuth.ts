import { useState, useEffect, useCallback } from "react";
import {
  authService,
  User,
  LoginCredentials,
  RegisterData,
  UserRole,
} from "../services/authService";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
  canAccessJudgePortal: () => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isJudge: () => boolean;
  isAdmin: () => boolean;
  getJudgeLevel: () => number;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState]: any : any = useState<AuthState>({
    isAuthenticated: authService.isAuthenticated,
    user: authService.currentUser,
    isLoading: false,
    error: null,
  });

  // Check for authentication changes on mount
  useEffect(() => {
    const checkAuth: any : any = async () => {
      if (authService.isAuthenticated && !authService.currentUser) {
        setState((prev: any) => ({ ...prev, isLoading: true }));
        try {
          const user: any : any = await authService.getProfile();
          setState((prev: any) => ({
            ...prev,
            isAuthenticated: !!user,
            user,
            isLoading: false,
          }));
        } catch (error) {
          setState((prev: any) => ({
            ...prev,
            isAuthenticated: false,
            user: null,
            isLoading: false,
          }));
        }
      }
    };

    checkAuth();
  }, []);

  const login: any : any = useCallback(async (credentials: LoginCredentials) => {
    setState((prev: any) => ({ ...prev, isLoading: true, error: null }));
    try {
      const authData: any : any = await authService.login(credentials);
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: true,
        user: authData.user,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const register: any : any = useCallback(async (data: RegisterData) => {
    setState((prev: any) => ({ ...prev, isLoading: true, error: null }));
    try {
      const authData: any : any = await authService.register(data);
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: true,
        user: authData.user,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const logout: any : any = useCallback(async () => {
    setState((prev: any) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      setState((prev: any) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));
    }
  }, []);

  const refreshProfile: any : any = useCallback(async () => {
    if (!authService.isAuthenticated) return;

    setState((prev: any) => ({ ...prev, isLoading: true }));
    try {
      const user: any : any = await authService.getProfile();
      setState((prev: any) => ({
        ...prev,
        user,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prev: any) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  const clearError: any : any = useCallback(() => {
    setState((prev: any) => ({ ...prev, error: null }));
  }, []);

  // Role-based access control functions
  const canAccessJudgePortal: any : any = useCallback(() => {
    return authService.canAccessJudgePortal();
  }, [state.user]);

  const hasRole: any : any = useCallback(
    (role: UserRole) => {
      return authService.hasRole(role);
    },
    [state.user]
  );

  const hasAnyRole: any : any = useCallback(
    (roles: UserRole[]) => {
      return authService.hasAnyRole(roles);
    },
    [state.user]
  );

  const isJudge: any : any = useCallback(() => {
    return authService.isJudge();
  }, [state.user]);

  const isAdmin: any : any = useCallback(() => {
    return authService.isAdmin();
  }, [state.user]);

  const getJudgeLevel: any : any = useCallback(() => {
    return authService.getJudgeLevel();
  }, [state.user]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshProfile,
    clearError,
    canAccessJudgePortal,
    hasRole,
    hasAnyRole,
    isJudge,
    isAdmin,
    getJudgeLevel,
  };
}
