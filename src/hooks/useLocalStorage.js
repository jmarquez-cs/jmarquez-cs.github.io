import { useState, useEffect, useCallback, useMemo } from 'react';

export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validator = null,
    onError = console.error,
  } = options;

  // Memoize the initial value to prevent re-creation
  const memoizedInitialValue = useMemo(() => {
    if (typeof initialValue === 'function') {
      return initialValue();
    }
    return initialValue;
  }, [initialValue]);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return memoizedInitialValue;

      const parsedValue = JSON.parse(item);

      // Validate the parsed value if validator is provided
      if (validator && !validator(parsedValue)) {
        console.warn(`Invalid value for key "${key}":`, parsedValue);
        // Clear invalid data from localStorage
        window.localStorage.removeItem(key);
        return memoizedInitialValue;
      }

      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      if (onError) {
        onError(error);
      }
      // Clear corrupted data from localStorage
      try {
        window.localStorage.removeItem(key);
      } catch (clearError) {
        console.error('Failed to clear corrupted localStorage data:', clearError);
      }
      return memoizedInitialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const previousValue = storedValue;

      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        const serializedValue = serialize(valueToStore);

        // Validate before storing
        if (options.validator && !options.validator(valueToStore)) {
          const message = `Validation failed for key "${key}"`;
          if (options.onError) options.onError(message, new Error(message));
          return Promise.reject(new Error(message));
        }

        // Optimistic update - apply immediately to state
        setStoredValue(valueToStore);

        return new Promise((resolve, reject) => {
          try {
            window.localStorage.setItem(key, serializedValue);

            // Dispatch storage event for cross-tab sync
            window.dispatchEvent(
              new StorageEvent('storage', {
                key,
                newValue: serializedValue,
                oldValue: window.localStorage.getItem(key),
              }),
            );

            resolve(true);
          } catch (storageError) {
            // Rollback optimistic update on storage failure
            setStoredValue(previousValue);

            const message = `Error setting localStorage key "${key}"`;
            console.error(message, storageError);
            if (options.onError) options.onError(message, storageError);
            reject(storageError);
          }
        });
      } catch (error) {
        // Rollback optimistic update on validation/serialization failure
        setStoredValue(previousValue);

        const message = `Error processing value for key "${key}"`;
        console.error(message, error);
        if (options.onError) options.onError(message, error);
        return Promise.reject(error);
      }
    },
    [key, storedValue, serialize, options],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(memoizedInitialValue);
    } catch (error) {
      onError(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, memoizedInitialValue, onError]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          if (!validator || validator(newValue)) {
            setStoredValue(newValue);
          }
        } catch (error) {
          onError(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, validator, onError]);

  return [storedValue, setValue, removeValue];
};
