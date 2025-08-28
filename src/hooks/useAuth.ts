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
  const [state, setState]: any = useState<AuthState>({
    isAuthenticated: authService.isAuthenticated,
    user: authService.currentUser,
    isLoading: false,
    error: null,
  });

  // Check for authentication changes on mount
  useEffect(() => {
    const checkAuth: any = async () => {
      if (authService.isAuthenticated && !authService.currentUser) {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
          const user: any = await authService.getProfile();
          setState((prev) => ({
            ...prev,
            isAuthenticated: !!user,
            user,
            isLoading: false,
          }));
        } catch (error) {
          setState((prev) => ({
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

  const login: any = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const authData: any = await authService.login(credentials);
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: authData.user,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const register: any = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const authData: any = await authService.register(data);
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: authData.user,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const logout: any = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      }));
    }
  }, []);

  const refreshProfile: any = useCallback(async () => {
    if (!authService.isAuthenticated) return;

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user: any = await authService.getProfile();
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  const clearError: any = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Role-based access control functions
  const canAccessJudgePortal: any = useCallback(() => {
    return authService.canAccessJudgePortal();
  }, [state.user]);

  const hasRole: any = useCallback(
    (role: UserRole) => {
      return authService.hasRole(role);
    },
    [state.user]
  );

  const hasAnyRole: any = useCallback(
    (roles: UserRole[]) => {
      return authService.hasAnyRole(roles);
    },
    [state.user]
  );

  const isJudge: any = useCallback(() => {
    return authService.isJudge();
  }, [state.user]);

  const isAdmin: any = useCallback(() => {
    return authService.isAdmin();
  }, [state.user]);

  const getJudgeLevel: any = useCallback(() => {
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
