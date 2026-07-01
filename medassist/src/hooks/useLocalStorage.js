import { useState, useEffect } from 'react';

/**
 * useState backed by localStorage. Stays in sync across renders.
 * Falls back gracefully if localStorage is unavailable (private browsing, etc).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage unavailable — fail silently.
    }
  }, [key, value]);

  return [value, setValue];
}
