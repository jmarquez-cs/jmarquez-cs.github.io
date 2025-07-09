import React from 'react';
import PropTypes from 'prop-types';
import { useGameVisibility } from '../../contexts/GameVisibilityContext';
import FlappyBird from './FlappyBird'; // Import FlappyBird
import './Games.css'; // This will now contain modal styling

export const Games = () => {
  // Keeping the name Games for colocation
  const { showGame, setShowGame } = useGameVisibility();

  if (!showGame) {
    return null; // Don't render anything if the game is not supposed to be shown
  }

  const handleClose = () => {
    setShowGame(false);
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-content">
        <button className="game-modal-close" onClick={handleClose} aria-label="Close game">
          &times;
        </button>
        <FlappyBird />
      </div>
    </div>
  );
};

Games.propTypes = {
  children: PropTypes.node, // Keep children propType for consistency, though not directly used here
};
