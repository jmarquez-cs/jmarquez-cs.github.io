import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const GameVisibilityContext = createContext();

export const useGameVisibility = () => {
  return useContext(GameVisibilityContext);
};

export const GameVisibilityProvider = ({ children }) => {
  const [showGame, setShowGame] = useState(false);

  return (
    <GameVisibilityContext.Provider value={{ showGame, setShowGame }}>
      {children}
    </GameVisibilityContext.Provider>
  );
};

// Add propTypes validation
GameVisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
