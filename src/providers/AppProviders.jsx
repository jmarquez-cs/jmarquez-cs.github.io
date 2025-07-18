import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { GameVisibilityProvider } from '../contexts/GameVisibilityContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export const AppProviders = ({ children }) => {
  return (
    <GameVisibilityProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </GameVisibilityProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
