import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS, THEMES } from '../utils/constants';

/**
 * Custom hook for managing theme preferences
 * @returns {Object} Theme state and functions
 */
const useTheme = () => {
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME_PREFERENCE,
    THEMES.ANCIENT,
  );

  /**
   * Toggle between standard and ancient themes
   */
  const toggleTheme = useCallback(() => {
    setTheme(currentTheme =>
      currentTheme === THEMES.STANDARD ? THEMES.ANCIENT : THEMES.STANDARD,
    );
  }, [setTheme]);

  /**
   * Set theme to standard
   */
  const setStandardTheme = useCallback(() => {
    setTheme(THEMES.STANDARD);
  }, [setTheme]);

  /**
   * Set theme to ancient
   */
  const setAncientTheme = useCallback(() => {
    setTheme(THEMES.ANCIENT);
  }, [setTheme]);

  /**
   * Check if current theme is ancient
   * @returns {boolean} True if ancient theme is active
   */
  const isAncientTheme = theme === THEMES.ANCIENT;

  return {
    theme,
    isAncientTheme,
    toggleTheme,
    setStandardTheme,
    setAncientTheme,
  };
};

export default useTheme;
