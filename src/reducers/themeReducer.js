const THEME_ACTIONS = {
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',
  START_TRANSITION: 'START_TRANSITION',
  COMPLETE_TRANSITION: 'COMPLETE_TRANSITION',
  ROLLBACK_THEME: 'ROLLBACK_THEME',
};

const THEME_STATES = {
  LIGHT: 'light',
  DARK: 'dark',
  TRANSITIONING_TO_LIGHT: 'transitioning_to_light',
  TRANSITIONING_TO_DARK: 'transitioning_to_dark',
};

const initialThemeState = {
  theme: localStorage.getItem('theme') || THEME_STATES.LIGHT,
  isTransitioning: false,
  previousTheme: null,
};

export const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === THEME_STATES.LIGHT ? THEME_STATES.DARK : THEME_STATES.LIGHT;
      const transitionState =
        newTheme === THEME_STATES.LIGHT
          ? THEME_STATES.TRANSITIONING_TO_LIGHT
          : THEME_STATES.TRANSITIONING_TO_DARK;

      return {
        ...state,
        theme: transitionState,
        isTransitioning: true,
        previousTheme: state.theme,
      };

    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        isTransitioning: false,
        previousTheme: state.theme !== action.payload ? state.theme : state.previousTheme,
      };

    case THEME_ACTIONS.START_TRANSITION:
      return {
        ...state,
        isTransitioning: true,
      };

    case THEME_ACTIONS.COMPLETE_TRANSITION:
      const finalTheme =
        state.theme === THEME_STATES.TRANSITIONING_TO_LIGHT
          ? THEME_STATES.LIGHT
          : state.theme === THEME_STATES.TRANSITIONING_TO_DARK
            ? THEME_STATES.DARK
            : state.theme;

      return {
        ...state,
        theme: finalTheme,
        isTransitioning: false,
      };

    case THEME_ACTIONS.ROLLBACK_THEME:
      return {
        ...state,
        theme: state.previousTheme || state.theme,
        isTransitioning: false,
        previousTheme: null,
      };

    default:
      return state;
  }
};

export { THEME_ACTIONS, THEME_STATES, initialThemeState };
