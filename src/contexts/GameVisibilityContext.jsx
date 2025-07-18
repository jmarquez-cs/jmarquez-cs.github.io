import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  gameReducer,
  initialGameState,
  GAME_ACTIONS,
  GAME_STATES,
  GAME_TYPES,
} from '../reducers/gameReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GameVisibilityContext = createContext();

export const useGameVisibility = () => {
  const context = useContext(GameVisibilityContext);
  if (!context) {
    throw new Error('useGameVisibility must be used within a GameVisibilityProvider');
  }
  return context;
};

export const GameVisibilityProvider = ({ children }) => {
  // Enhanced localStorage for high score persistence with validation
  const [persistedHighScore, setPersistedHighScore] = useLocalStorage('gameHighScore', 0, {
    serialize: (value) => value.toString(),
    deserialize: (value) => parseInt(value, 10),
    validator: (value) => Number.isInteger(value) && value >= 0,
    onError: (message, error) => console.warn('Game high score persistence error:', message, error),
  });

  // Enhanced localStorage for game settings
  const [gameSettings, setGameSettings] = useLocalStorage(
    'gameSettings',
    {
      soundEnabled: true,
      difficulty: 'normal',
      lastPlayedType: GAME_TYPES.FLAPPY_BIRD,
    },
    {
      validator: (value) =>
        typeof value === 'object' &&
        typeof value.soundEnabled === 'boolean' &&
        ['easy', 'normal', 'hard'].includes(value.difficulty) &&
        Object.values(GAME_TYPES).includes(value.lastPlayedType),
    },
  );

  const [gameState, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    highScore: persistedHighScore,
    gameType: gameSettings.lastPlayedType,
  });

  // Persist high score when it changes
  useEffect(() => {
    if (gameState.highScore !== persistedHighScore) {
      setPersistedHighScore(gameState.highScore);
    }
  }, [gameState.highScore, persistedHighScore, setPersistedHighScore]);

  // Persist game type when it changes
  useEffect(() => {
    if (gameState.gameType !== gameSettings.lastPlayedType) {
      setGameSettings((prev) => ({
        ...prev,
        lastPlayedType: gameState.gameType,
      }));
    }
  }, [gameState.gameType, gameSettings.lastPlayedType, setGameSettings]);

  const contextValue = useMemo(
    () => ({
      // State
      showGame: gameState.isVisible,
      gameType: gameState.gameType,
      currentGameState: gameState.gameState,
      score: gameState.score,
      highScore: gameState.highScore,
      isLoading: gameState.isLoading,

      // Settings
      gameSettings,
      soundEnabled: gameSettings.soundEnabled,
      difficulty: gameSettings.difficulty,

      // Enhanced state queries
      isGameActive: gameState.gameState === GAME_STATES.PLAYING,
      isGamePaused: gameState.gameState === GAME_STATES.PAUSED,
      isGameOver: gameState.gameState === GAME_STATES.GAME_OVER,
      isGameIdle: gameState.gameState === GAME_STATES.IDLE,
      hasHighScore: gameState.highScore > 0,
      isNewHighScore: gameState.score > 0 && gameState.score === gameState.highScore,

      // Actions
      setShowGame: (show) => {
        dispatch({
          type: show ? GAME_ACTIONS.SHOW_GAME : GAME_ACTIONS.HIDE_GAME,
        });
      },
      setGameType: (type) => {
        if (!Object.values(GAME_TYPES).includes(type)) {
          console.warn(`Invalid game type: ${type}`);
          return;
        }
        dispatch({
          type: GAME_ACTIONS.SET_GAME_TYPE,
          payload: type,
        });
      },
      setGameState: (state, additionalData = {}) => {
        if (!Object.values(GAME_STATES).includes(state)) {
          console.warn(`Invalid game state: ${state}`);
          return;
        }
        dispatch({
          type: GAME_ACTIONS.SET_GAME_STATE,
          payload: { gameState: state, ...additionalData },
        });
      },
      resetGame: () => {
        dispatch({ type: GAME_ACTIONS.RESET_GAME });
      },

      // Settings actions
      updateGameSettings: (newSettings) => {
        setGameSettings((prev) => ({ ...prev, ...newSettings }));
      },
      toggleSound: () => {
        setGameSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      },
      setDifficulty: (difficulty) => {
        if (!['easy', 'normal', 'hard'].includes(difficulty)) {
          console.warn(`Invalid difficulty: ${difficulty}`);
          return;
        }
        setGameSettings((prev) => ({ ...prev, difficulty }));
      },

      // Game type management
      availableGameTypes: Object.values(GAME_TYPES),
      gameStates: GAME_STATES,
      gameTypes: GAME_TYPES,

      // Utility functions
      canShowGame: !gameState.isLoading,
      canStartGame:
        gameState.gameState === GAME_STATES.IDLE || gameState.gameState === GAME_STATES.GAME_OVER,
      canPauseGame: gameState.gameState === GAME_STATES.PLAYING,
      canResumeGame: gameState.gameState === GAME_STATES.PAUSED,
    }),
    [gameState, gameSettings, setGameSettings],
  );

  return (
    <GameVisibilityContext.Provider value={contextValue}>{children}</GameVisibilityContext.Provider>
  );
};

GameVisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
