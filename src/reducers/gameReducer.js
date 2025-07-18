const GAME_ACTIONS = {
  SHOW_GAME: 'SHOW_GAME',
  HIDE_GAME: 'HIDE_GAME',
  SET_GAME_TYPE: 'SET_GAME_TYPE',
  SET_GAME_STATE: 'SET_GAME_STATE',
  RESET_GAME: 'RESET_GAME',
};

const GAME_STATES = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

const GAME_TYPES = {
  FLAPPY_BIRD: 'FLAPPY_BIRD',
  // Future games can be added here
};

const initialGameState = {
  isVisible: false,
  gameType: GAME_TYPES.FLAPPY_BIRD,
  gameState: GAME_STATES.IDLE,
  score: 0,
  highScore: parseInt(localStorage.getItem('gameHighScore') || '0', 10),
  isLoading: false,
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SHOW_GAME:
      return {
        ...state,
        isVisible: true,
        gameState: GAME_STATES.LOADING,
        isLoading: true,
      };

    case GAME_ACTIONS.HIDE_GAME:
      return {
        ...state,
        isVisible: false,
        gameState: GAME_STATES.IDLE,
        isLoading: false,
        score: 0,
      };

    case GAME_ACTIONS.SET_GAME_TYPE:
      return {
        ...state,
        gameType: action.payload,
        gameState: GAME_STATES.IDLE,
        score: 0,
      };

    case GAME_ACTIONS.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload.gameState,
        ...(action.payload.score !== undefined && { score: action.payload.score }),
        ...(action.payload.isLoading !== undefined && { isLoading: action.payload.isLoading }),
        ...(action.payload.score > state.highScore && {
          highScore: action.payload.score,
        }),
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...state,
        gameState: GAME_STATES.IDLE,
        score: 0,
        isLoading: false,
      };

    default:
      return state;
  }
};

export { GAME_ACTIONS, GAME_STATES, GAME_TYPES, initialGameState };
