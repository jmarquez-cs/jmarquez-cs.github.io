import React, { Suspense, lazy, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useGameVisibility } from '../../contexts/GameVisibilityContext';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import './Games.css';

// Lazy load FlappyBird component
const FlappyBird = lazy(() => import('./FlappyBird'));

// Loading component for Games
const GamesLoading = () => (
  <div className="game-loading">
    <div className="game-loading-spinner"></div>
    <p>Loading game...</p>
  </div>
);

export const Games = () => {
  usePerformanceMonitor('Games');

  const {
    showGame,
    setShowGame,
    currentGameState,
    score,
    highScore,
    isLoading,
    setGameState,
    resetGame,
  } = useGameVisibility();

  const handleClose = useCallback(() => {
    resetGame();
    setShowGame(false);
  }, [setShowGame, resetGame]);

  if (!showGame) {
    return null;
  }

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-content">
        <button className="game-modal-close" onClick={handleClose} aria-label="Close game">
          &times;
        </button>
        <Suspense fallback={<GamesLoading />}>
          <FlappyBird />
        </Suspense>
      </div>
    </div>
  );
};

Games.propTypes = {
  children: PropTypes.node,
};

Games.displayName = 'Games';
