import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useTransition,
} from 'react';
import PropTypes from 'prop-types';
import {
  themeReducer,
  initialThemeState,
  THEME_ACTIONS,
  THEME_STATES,
} from '../reducers/themeReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePrefersDarkScheme } from '../hooks/useMediaQuery';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize with a safe default first
  const [themeState, dispatch] = useReducer(themeReducer, {
    theme: 'light',
    isOptimistic: false,
    previousTheme: 'light',
  });

  const prefersDarkScheme = usePrefersDarkScheme();

  // Enhanced localStorage integration with validation
  const [persistedTheme, setPersistedTheme] = useLocalStorage('theme', null, {
    validator: (value) => Object.values(THEME_STATES).includes(value),
    onError: (message, error) => console.warn('Theme persistence error:', message, error),
  });

  // Initialize theme state with system preference fallback
  const getInitialTheme = useCallback(() => {
    if (persistedTheme) return persistedTheme;
    return prefersDarkScheme ? THEME_STATES.DARK : THEME_STATES.LIGHT;
  }, [persistedTheme, prefersDarkScheme]);

  const [isPending, startTransition] = useTransition();

  // Get the actual theme for DOM updates (handle transition states)
  const actualTheme = useMemo(() => {
    if (themeState.theme === THEME_STATES.TRANSITIONING_TO_LIGHT) return THEME_STATES.LIGHT;
    if (themeState.theme === THEME_STATES.TRANSITIONING_TO_DARK) return THEME_STATES.DARK;
    return themeState.theme;
  }, [themeState.theme]);

  // Persist theme and apply to DOM
  useEffect(() => {
    setPersistedTheme(actualTheme);
    document.body.setAttribute('data-theme', actualTheme);

    // Also set CSS custom property for advanced theming
    document.documentElement.style.setProperty('--current-theme', actualTheme);
  }, [actualTheme, setPersistedTheme]);

  // Complete transition after DOM update
  useEffect(() => {
    if (themeState.isTransitioning) {
      const timer = setTimeout(() => {
        dispatch({ type: THEME_ACTIONS.COMPLETE_TRANSITION });
      }, 200); // Allow for CSS transition

      return () => clearTimeout(timer);
    }
  }, [themeState.isTransitioning]);

  // Auto-sync with system preference if no user preference is set
  useEffect(() => {
    if (!persistedTheme) {
      const newTheme = prefersDarkScheme ? THEME_STATES.DARK : THEME_STATES.LIGHT;
      if (actualTheme !== newTheme) {
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: newTheme });
      }
    }
  }, [prefersDarkScheme, persistedTheme, actualTheme]);

  const toggleTheme = useCallback(() => {
    // Optimistic update - immediate UI feedback
    const optimisticTheme =
      actualTheme === THEME_STATES.LIGHT ? THEME_STATES.DARK : THEME_STATES.LIGHT;

    // Apply optimistic theme immediately
    document.body.setAttribute('data-theme', optimisticTheme);
    document.documentElement.style.setProperty('--current-theme', optimisticTheme);

    startTransition(() => {
      try {
        dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
      } catch (error) {
        // Rollback on error
        console.error('Theme toggle failed:', error);
        document.body.setAttribute('data-theme', actualTheme);
        document.documentElement.style.setProperty('--current-theme', actualTheme);

        // Dispatch rollback action
        dispatch({ type: THEME_ACTIONS.ROLLBACK_THEME });
      }
    });
  }, [startTransition, actualTheme]);

  const setTheme = useCallback(
    (theme) => {
      if (!Object.values(THEME_STATES).includes(theme)) {
        console.warn(`Invalid theme: ${theme}`);
        return Promise.reject(new Error(`Invalid theme: ${theme}`));
      }

      // Store previous theme for rollback
      const previousTheme = actualTheme;

      // Optimistic update - immediate UI feedback
      document.body.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--current-theme', theme);

      return new Promise((resolve, reject) => {
        startTransition(() => {
          try {
            dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
            setPersistedTheme(theme);
            resolve(theme);
          } catch (error) {
            // Rollback on error
            console.error('Theme set failed:', error);
            document.body.setAttribute('data-theme', previousTheme);
            document.documentElement.style.setProperty('--current-theme', previousTheme);

            dispatch({ type: THEME_ACTIONS.ROLLBACK_THEME });
            reject(error);
          }
        });
      });
    },
    [startTransition, actualTheme, setPersistedTheme],
  );

  const resetToSystemTheme = useCallback(() => {
    setPersistedTheme(null);
    const systemTheme = prefersDarkScheme ? THEME_STATES.DARK : THEME_STATES.LIGHT;
    setTheme(systemTheme);
  }, [setPersistedTheme, prefersDarkScheme, setTheme]);

  const value = useMemo(
    () => ({
      // Current theme state
      theme: actualTheme,
      themeState: themeState.theme,
      isTransitioning: themeState.isTransitioning || isPending,
      previousTheme: themeState.previousTheme,

      // System integration
      prefersDarkScheme,
      isSystemTheme: !persistedTheme,

      // Actions
      toggleTheme,
      setTheme,
      resetToSystemTheme,

      // State machine queries
      isLight: actualTheme === THEME_STATES.LIGHT,
      isDark: actualTheme === THEME_STATES.DARK,
      isTransitioningToLight: themeState.theme === THEME_STATES.TRANSITIONING_TO_LIGHT,
      isTransitioningToDark: themeState.theme === THEME_STATES.TRANSITIONING_TO_DARK,

      // Enhanced state information
      themeStates: THEME_STATES,
      canToggle: !themeState.isTransitioning && !isPending,

      // Legacy compatibility
      isPending: themeState.isTransitioning || isPending,
    }),
    [
      actualTheme,
      themeState,
      isPending,
      prefersDarkScheme,
      persistedTheme,
      toggleTheme,
      setTheme,
      resetToSystemTheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
