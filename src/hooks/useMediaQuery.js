import { useState, useEffect, useMemo } from 'react';

export const useMediaQuery = (query, options = {}) => {
  const { defaultValue = false, initializeWithValue = true } = options;

  const memoizedQuery = useMemo(() => query, [query]);

  const [matches, setMatches] = useState(() => {
    if (!initializeWithValue || typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      return window.matchMedia(memoizedQuery).matches;
    } catch (error) {
      console.warn('useMediaQuery: Invalid media query', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mediaQueryList;
    try {
      mediaQueryList = window.matchMedia(memoizedQuery);
    } catch (error) {
      console.warn('useMediaQuery: Invalid media query', error);
      return;
    }

    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial value if not initialized
    if (!initializeWithValue) {
      setMatches(mediaQueryList.matches);
    }

    // Use addEventListener for modern browsers, addListener for legacy
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    } else {
      // Legacy support
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [memoizedQuery, initializeWithValue]);

  return matches;
};

// Predefined breakpoints for common use cases
export const useBreakpoint = (breakpoint) => {
  const breakpoints = useMemo(
    () => ({
      sm: '(min-width: 640px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
      xl: '(min-width: 1280px)',
      '2xl': '(min-width: 1536px)',
    }),
    [],
  );

  return useMediaQuery(breakpoints[breakpoint] || breakpoint);
};

export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

export const usePrefersDarkScheme = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};
