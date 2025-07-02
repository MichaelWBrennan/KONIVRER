import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for managing debug mode
 * @returns {Object} Debug mode state and functions
 */
const useDebugMode = () => {
  const [debugMode, setDebugMode] = useLocalStorage(
    STORAGE_KEYS.DEBUG_MODE,
    false,
  );

  /**
   * Toggle debug mode on/off
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(current => !current);
  }, [setDebugMode]);

  /**
   * Enable debug mode
   */
  const enableDebugMode = useCallback(() => {
    setDebugMode(true);
  }, [setDebugMode]);

  /**
   * Disable debug mode
   */
  const disableDebugMode = useCallback(() => {
    setDebugMode(false);
  }, [setDebugMode]);

  return {
    debugMode,
    toggleDebugMode,
    enableDebugMode,
    disableDebugMode,
  };
};

export default useDebugMode;
