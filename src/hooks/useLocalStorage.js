import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Handle case where item is null, undefined, or invalid JSON
      if (item === null || item === 'undefined' || item === undefined) {
        return initialValue;
      }
      
      // Try to parse the item, if it fails return initialValue
      try {
        return JSON.parse(item);
      } catch (parseError) {
        console.warn(`Error parsing localStorage key "${key}":`, parseError);
        // If parsing fails, remove the invalid item and return initialValue
        window.localStorage.removeItem(key);
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
