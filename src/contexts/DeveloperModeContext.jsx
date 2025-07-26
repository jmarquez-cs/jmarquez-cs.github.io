import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const DeveloperModeContext = createContext();

export const useDeveloperMode = () => {
  const context = useContext(DeveloperModeContext);
  if (!context) {
    throw new Error('useDeveloperMode must be used within a DeveloperModeProvider');
  }
  return context;
};

export const DeveloperModeProvider = ({ children }) => {
  // Initialize state from URL hash - default to false, enable with dev=true
  const [isDeveloperMode, setIsDeveloperMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('dev=true');
    }
    return false;
  });

  // Update URL when developer mode changes
  const updateURL = useCallback((enabled) => {
    if (typeof window === 'undefined') return;

    const currentHash = window.location.hash;
    let newHash;

    if (enabled) {
      // Add dev=true to hash
      if (currentHash.includes('dev=true')) {
        return; // Already enabled
      }
      newHash = currentHash ? `${currentHash}&dev=true` : '#dev=true';
    } else {
      // Remove dev=true from hash
      newHash = currentHash
        .replace(/[&#]dev=true/g, '')
        .replace(/^#&/, '#') // Clean up leading &
        .replace(/&#/g, '#'); // Clean up multiple &

      // Remove empty hash
      if (newHash === '#') {
        newHash = '';
      }
    }

    // Update URL without triggering page reload
    if (newHash !== currentHash) {
      window.history.replaceState(null, null, newHash || window.location.pathname);
    }
  }, []);

  // Listen for hash changes from other tabs/windows
  useEffect(() => {
    const handleHashChange = () => {
      const newDevMode = window.location.hash.includes('dev=true');
      if (newDevMode !== isDeveloperMode) {
        setIsDeveloperMode(newDevMode);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isDeveloperMode]);

  const toggleDeveloperMode = useCallback(() => {
    const newMode = !isDeveloperMode;
    setIsDeveloperMode(newMode);
    updateURL(newMode);
  }, [isDeveloperMode, updateURL]);

  const setDeveloperMode = useCallback(
    (enabled) => {
      setIsDeveloperMode(enabled);
      updateURL(enabled);
    },
    [updateURL],
  );

  const shouldShowDeveloperFeatures = useCallback(() => {
    return isDeveloperMode;
  }, [isDeveloperMode]);

  const value = {
    isDeveloperMode,
    setIsDeveloperMode: setDeveloperMode,
    toggleDeveloperMode,
    shouldShowDeveloperFeatures,
  };

  return <DeveloperModeContext.Provider value={value}>{children}</DeveloperModeContext.Provider>;
};

DeveloperModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
