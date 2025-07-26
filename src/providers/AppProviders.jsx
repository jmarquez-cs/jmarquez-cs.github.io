import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '../contexts/ThemeContext';
import { GameVisibilityProvider } from '../contexts/GameVisibilityContext';
import { DeveloperModeProvider } from '../contexts/DeveloperModeContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <DeveloperModeProvider>
        <GameVisibilityProvider>{children}</GameVisibilityProvider>
      </DeveloperModeProvider>
    </ThemeProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
