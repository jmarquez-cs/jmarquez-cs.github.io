const TIMELINE_ACTIONS = {
  INITIALIZE_TIMELINE: 'INITIALIZE_TIMELINE',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  START_DRAG: 'START_DRAG',
  UPDATE_DRAG: 'UPDATE_DRAG',
  END_DRAG: 'END_DRAG',
  SET_SNAPPING: 'SET_SNAPPING',
  SET_RAIL_OFFSET: 'SET_RAIL_OFFSET',
  UPDATE_MOMENTUM: 'UPDATE_MOMENTUM',
  SET_AUTO_SCROLLING: 'SET_AUTO_SCROLLING',
  SET_PERFORMANCE_DEGRADED: 'SET_PERFORMANCE_DEGRADED',
  UPDATE_RAIL_PERFORMANCE: 'UPDATE_RAIL_PERFORMANCE',
  RESET_DRAG_STATE: 'RESET_DRAG_STATE',
  CALCULATE_MOMENTUM_TARGET: 'CALCULATE_MOMENTUM_TARGET',
};

const initialTimelineState = {
  // Core timeline state
  currentIndex: -1, // Start with no selection until properly initialized
  isAutoScrolling: false,
  scrollOffset: 0,

  // Drag and interaction state
  isDragging: false,
  dragStart: { x: 0, offset: 0 },
  dragOffset: 0,
  momentum: { velocity: 0, timestamp: 0 },
  isSnapping: false,

  // Rail mode state
  isRailMode: true,
  railOffset: 0,

  // Performance state
  railPerformanceMetrics: {
    renderTime: 0,
    visibleItems: 0,
    recycledItems: 0,
    fps: 60,
    memoryUsage: 0,
  },
  performanceDegraded: false,

  // Momentum calculation state
  momentumTarget: null,
};

export const timelineReducer = (state, action) => {
  switch (action.type) {
    case TIMELINE_ACTIONS.INITIALIZE_TIMELINE:
      const { timelineData, persistedState } = action.payload;

      // ABSOLUTE GUARD: Never allow re-initialization if already initialized
      if (state.currentIndex !== -1) {
        return state; // Return exact same state object to prevent any changes
      }

      // Additional safety check for any non-default state
      if (
        state.isDragging ||
        state.isSnapping ||
        state.railOffset !== 0 ||
        state.dragOffset !== 0
      ) {
        return state;
      }

      // Try to restore from persisted state only on first load
      if (persistedState?.selectedYear) {
        const restoredIndex = timelineData.findIndex(
          (item) => item.date === persistedState.selectedYear,
        );
        if (restoredIndex !== -1) {
          return {
            ...state,
            currentIndex: restoredIndex,
          };
        }
      }

      // If no persisted state, start with no selection instead of defaulting to middle

      return {
        ...state,
        currentIndex: -1,
      };

    case TIMELINE_ACTIONS.SET_CURRENT_INDEX:
      // SAFETY GUARD: Never allow currentIndex to become -1 after initialization
      if (action.payload < 0) {
        return state;
      }
      return {
        ...state,
        currentIndex: action.payload,
      };

    case TIMELINE_ACTIONS.START_DRAG:
      return {
        ...state,
        isDragging: true,
        dragStart: action.payload.dragStart,
        railOffset: 0, // Always reset to 0 to start from current index position
        dragOffset: 0, // Also reset drag offset
        momentum: { velocity: 0, timestamp: action.payload.timestamp },
        isSnapping: false,
        // CRITICAL: Preserve current index when starting drag
        // This ensures we don't jump back to any persisted state
      };

    case TIMELINE_ACTIONS.UPDATE_DRAG:
      return {
        ...state,
        railOffset: action.payload.railOffset,
        momentum: action.payload.momentum,
        // Don't update currentIndex during drag operations
      };

    case TIMELINE_ACTIONS.END_DRAG:
      return {
        ...state,
        isDragging: false,
        isSnapping: action.payload.shouldSnap || false,
        dragOffset: 0,
      };

    case TIMELINE_ACTIONS.SET_SNAPPING:
      return {
        ...state,
        isSnapping: action.payload,
      };

    case TIMELINE_ACTIONS.SET_RAIL_OFFSET:
      return {
        ...state,
        railOffset: action.payload,
      };

    case TIMELINE_ACTIONS.UPDATE_MOMENTUM:
      return {
        ...state,
        momentum: action.payload,
      };

    case TIMELINE_ACTIONS.SET_AUTO_SCROLLING:
      return {
        ...state,
        isAutoScrolling: action.payload,
      };

    case TIMELINE_ACTIONS.SET_PERFORMANCE_DEGRADED:
      return {
        ...state,
        performanceDegraded: action.payload,
      };

    case TIMELINE_ACTIONS.UPDATE_RAIL_PERFORMANCE:
      return {
        ...state,
        railPerformanceMetrics: {
          ...state.railPerformanceMetrics,
          ...action.payload,
        },
      };

    case TIMELINE_ACTIONS.CALCULATE_MOMENTUM_TARGET:
      const { timelineLength, itemSpacing } = action.payload;
      const { velocity } = state.momentum;

      // Check if we should apply momentum or just stay in place
      const minimumMomentumThreshold = 0.5;
      const shouldApplyMomentum = Math.abs(velocity) > minimumMomentumThreshold;

      if (!shouldApplyMomentum) {
        return {
          ...state,
          momentumTarget: null,
        };
      }

      // Enhanced momentum calculation with configurable decay curves
      const velocityDecay = Math.abs(velocity) > 1 ? 0.4 : 0.2;
      const momentumWithDecay = velocity * velocityDecay;

      // Apply easing function for natural deceleration
      const easedMomentum =
        momentumWithDecay > 0
          ? Math.pow(momentumWithDecay, 0.8)
          : -Math.pow(Math.abs(momentumWithDecay), 0.8);

      // Calculate momentum in rail coordinates
      const momentumDistance = easedMomentum * itemSpacing * 2.5;

      // Calculate final position based on current index and momentum
      let baseCurrentIndex = state.currentIndex;
      if (baseCurrentIndex === -1) {
        const railOffsetInItems = -state.railOffset / itemSpacing;
        baseCurrentIndex = Math.max(
          0,
          Math.min(
            timelineLength - 1,
            Math.round(Math.floor(timelineLength / 2) + railOffsetInItems),
          ),
        );
      }

      // Calculate how many items the momentum would move us
      const momentumIndexChange = Math.round(momentumDistance / itemSpacing);

      // Find target index based on current position plus momentum
      let targetIndex = baseCurrentIndex + momentumIndexChange;

      // Ensure we have a valid target index
      if (targetIndex < 0 || targetIndex >= timelineLength) {
        if (momentumIndexChange === 0) {
          targetIndex = baseCurrentIndex;
        } else {
          // Apply wrapping for momentum-based movement
          if (targetIndex < 0) {
            targetIndex = timelineLength - 1;
          } else if (targetIndex >= timelineLength) {
            targetIndex = 0;
          }
        }
      }

      return {
        ...state,
        momentumTarget: targetIndex,
      };

    case TIMELINE_ACTIONS.RESET_DRAG_STATE:
      return {
        ...state,
        isDragging: false,
        isSnapping: false,
        dragOffset: 0,
        railOffset: 0,
        momentum: { velocity: 0, timestamp: 0 },
        momentumTarget: null,
      };

    default:
      return state;
  }
};

export { TIMELINE_ACTIONS, initialTimelineState };
