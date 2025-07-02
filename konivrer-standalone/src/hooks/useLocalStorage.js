import { useState, useEffect } from 'react';
import { safeParse, safeStringify } from '../utils';

/**
 * Custom hook for using localStorage with React state
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if no value exists in localStorage
 * @returns {Array} [storedValue, setValue] - State value and setter function
 */
const useLocalStorage = (key, initialValue) => {
  // Get from localStorage then parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error on server
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? safeParse(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, safeStringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === key && e.newValue) {
        setStoredValue(safeParse(e.newValue, initialValue));
      }
    };

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Remove event listener on cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
