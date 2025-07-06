/**
 * Unified Context
 * 
 * Provides unified application state and methods throughout the application.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface UnifiedState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  currentPage: string;
  isLoading: boolean;
}

interface UnifiedContextType {
  state: UnifiedState;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
}

interface UnifiedProviderProps {
  children: ReactNode;
}

// Create context
const UnifiedContext = createContext<UnifiedContextType | undefined>(undefined);

/**
 * Unified Provider Component
 */
export const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  const [state, setState] = useState<UnifiedState>({
    theme: 'dark',
    sidebarOpen: false,
    currentPage: 'home',
    isLoading: false,
  });

  const setTheme = (theme: 'light' | 'dark' | 'auto'): void => {
    setState(prev => ({ ...prev, theme }));
  };

  const setSidebarOpen = (sidebarOpen: boolean): void => {
    setState(prev => ({ ...prev, sidebarOpen }));
  };

  const setCurrentPage = (currentPage: string): void => {
    setState(prev => ({ ...prev, currentPage }));
  };

  const setLoading = (isLoading: boolean): void => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const value: UnifiedContextType = {
    state,
    setTheme,
    setSidebarOpen,
    setCurrentPage,
    setLoading,
  };

  return (
    <UnifiedContext.Provider value={value}>
      {children}
    </UnifiedContext.Provider>
  );
};

/**
 * Hook to use unified context
 */
export const useUnified = (): UnifiedContextType => {
  const context = useContext(UnifiedContext);
  if (context === undefined) {
    throw new Error('useUnified must be used within a UnifiedProvider');
  }
  return context;
};

export default UnifiedProvider;