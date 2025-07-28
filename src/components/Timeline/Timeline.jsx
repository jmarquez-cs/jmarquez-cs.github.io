import React, { useMemo, useRef, useCallback, useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { careerLocations } from '../../data/worldGlobeData';
import { portfolioSchema } from '../../data/portfolioData';
import {
  timelineReducer,
  TIMELINE_ACTIONS,
  initialTimelineState,
} from '../../reducers/timelineReducer';
import './Timeline.css';

const Timeline = ({ onYearChange }) => {
  const timelineRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, timestamp: 0 });
  const momentumTimeoutRef = useRef(null);
  const [timelineState, dispatch] = useReducer(timelineReducer, initialTimelineState);

  // Destructure commonly used state values for easier access
  const {
    currentIndex,
    isAutoScrolling,
    scrollOffset,
    isDragging,
    dragStart,
    dragOffset,
    momentum,
    isSnapping,
    isRailMode,
    railOffset,
    railPerformanceMetrics,
    performanceDegraded,
  } = timelineState;
  const railAnimationFrameRef = useRef(null);
  const railCalculationCacheRef = useRef(new Map());
  const virtualScrollStateRef = useRef({
    startIndex: 0,
    endIndex: 0,
    viewportWidth: 0,
    itemWidth: 152, // 120px + 32px gap
  });
  const performanceMonitorRef = useRef(null);

  // Combine and sort timeline data chronologically, removing duplicates
  const timelineData = useMemo(() => {
    const combined = [];
    const yearSet = new Set();

    // Add career locations from worldGlobeData
    careerLocations.forEach((location) => {
      const startYear = location.period.match(/(\d{4})/)?.[1];
      if (startYear && !yearSet.has(startYear)) {
        yearSet.add(startYear);
        combined.push({
          id: `career-${location.company}`,
          type: 'career',
          date: startYear,
          title: location.title,
          company: location.company,
          period: location.period,
        });
      }
    });

    // Add projects from portfolioData
    portfolioSchema.projects.allIds.forEach((id) => {
      const project = portfolioSchema.projects.byId[id];
      const projectYear = project.createdAt.split('-')[0];
      if (!yearSet.has(projectYear)) {
        yearSet.add(projectYear);
        combined.push({
          id: `project-${id}`,
          type: 'project',
          date: projectYear,
          title: project.title,
        });
      }
    });

    // Sort by date and return unique years
    return combined.sort((a, b) => parseInt(a.date) - parseInt(b.date));
  }, []);

  // Performance monitoring integration
  const performanceMonitor = useRef(null);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && !performanceMonitor.current) {
      // Import performance monitor hook dynamically to avoid SSR issues
      import('../../hooks/usePerformanceMonitor').then(({ usePerformanceMonitor }) => {
        // Store reference for rail-specific metrics
        performanceMonitorRef.current = {
          record: (eventType, data) => {
            if (performanceMonitor.current?.record) {
              performanceMonitor.current.record(`timeline-rail-${eventType}`, {
                ...data,
                railMode: isRailMode,
                railOffset,
                performanceMetrics: railPerformanceMetrics,
              });
            }
          },
        };
      });
    }
  }, [isRailMode, railOffset, railPerformanceMetrics]);

  // Virtual scrolling calculations with caching
  const calculateVirtualScrollBounds = useCallback(() => {
    const cacheKey = `${railOffset}-${window.innerWidth}`;

    if (railCalculationCacheRef.current.has(cacheKey)) {
      return railCalculationCacheRef.current.get(cacheKey);
    }

    const viewportWidth = window.innerWidth;
    const itemWidth = virtualScrollStateRef.current.itemWidth;
    const centerOffset = viewportWidth / 2;

    // Calculate visible range with buffer for smooth scrolling
    const buffer = 3; // Show 3 extra items on each side
    const visibleStart = Math.max(
      0,
      Math.floor((railOffset - centerOffset - itemWidth * buffer) / itemWidth),
    );
    const visibleEnd = Math.min(
      timelineData.length - 1,
      Math.ceil((railOffset + centerOffset + itemWidth * buffer) / itemWidth),
    );

    const bounds = {
      startIndex: visibleStart,
      endIndex: visibleEnd,
      visibleCount: visibleEnd - visibleStart + 1,
      totalItems: timelineData.length,
    };

    // Cache the calculation
    railCalculationCacheRef.current.set(cacheKey, bounds);

    // Limit cache size to prevent memory leaks
    if (railCalculationCacheRef.current.size > 50) {
      const firstKey = railCalculationCacheRef.current.keys().next().value;
      railCalculationCacheRef.current.delete(firstKey);
    }

    return bounds;
  }, [railOffset, timelineData.length]);

  // Timeline rail for continuous scrolling with virtual scrolling optimization
  const timelineRail = useMemo(() => {
    const startTime = performance.now();

    // Use virtual scrolling for large timelines (>20 items)
    const useVirtualScrolling = timelineData.length > 20;
    const itemsToRender = useVirtualScrolling ? calculateVirtualScrollBounds() : null;

    const railItems = timelineData
      .slice(
        useVirtualScrolling ? itemsToRender.startIndex : 0,
        useVirtualScrolling ? itemsToRender.endIndex + 1 : undefined,
      )
      .map((item, virtualIndex) => {
        const actualIndex = useVirtualScrolling
          ? itemsToRender.startIndex + virtualIndex
          : virtualIndex;

        return {
          ...item,
          railPosition: actualIndex,
          railIndex: actualIndex,
          virtualIndex,
          // Calculate distance from center for visual states
          distanceFromCenter: Math.abs(actualIndex - Math.floor(timelineData.length / 2)),
          // Add performance optimization flags
          shouldUseGPU: true,
          isVirtual: useVirtualScrolling,
        };
      });

    const renderTime = performance.now() - startTime;

    // Update performance metrics
    dispatch({
      type: TIMELINE_ACTIONS.UPDATE_RAIL_PERFORMANCE,
      payload: {
        renderTime,
        visibleItems: railItems.length,
        recycledItems: useVirtualScrolling ? timelineData.length - railItems.length : 0,
      },
    });

    // Record performance data
    if (performanceMonitorRef.current?.record) {
      performanceMonitorRef.current.record('rail-render', {
        renderTime,
        itemCount: railItems.length,
        totalItems: timelineData.length,
        useVirtualScrolling,
      });
    }

    return railItems;
  }, [timelineData, calculateVirtualScrollBounds]);

  // Haptic feedback utility
  const triggerHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Subtle 10ms vibration
    }
  }, []);

  // Navigate to next/previous year with smooth snap-to animation and deceleration
  const navigateToIndex = useCallback(
    (targetIndex) => {
      if (!timelineRef.current || timelineData.length === 0) return;

      dispatch({ type: TIMELINE_ACTIONS.SET_AUTO_SCROLLING, payload: true });
      dispatch({ type: TIMELINE_ACTIONS.SET_SNAPPING, payload: true });

      // Ensure we stay within actual data boundaries while creating infinite illusion
      let normalizedIndex = targetIndex;

      // Wrap around actual data range (like iPhone Timer - seamless but bounded)
      if (normalizedIndex < 0) {
        normalizedIndex = timelineData.length - 1; // Jump to end when going past beginning
      } else if (normalizedIndex >= timelineData.length) {
        normalizedIndex = 0; // Jump to beginning when going past end
      }

      // Trigger haptic feedback when snapping to a new year
      if (normalizedIndex !== currentIndex) {
        triggerHapticFeedback();
      }

      // Smooth transition with deceleration curve
      const container = timelineRef.current;
      if (container) {
        container.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        // Add a subtle bounce effect for the snap
        requestAnimationFrame(() => {
          container.style.transform = 'translateX(0px)';
        });
      }

      dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_INDEX, payload: normalizedIndex });

      // Reset transitions after animation completes
      setTimeout(() => {
        dispatch({ type: TIMELINE_ACTIONS.SET_AUTO_SCROLLING, payload: false });
        dispatch({ type: TIMELINE_ACTIONS.SET_SNAPPING, payload: false });
        if (container) {
          container.style.transition = '';
          container.style.transform = '';
        }
      }, 600);
    },
    [timelineData.length, currentIndex, triggerHapticFeedback],
  );

  // Handle click on timeline dots
  const handleDotClick = useCallback(
    (targetIndex) => {
      console.log('Timeline: Dot clicked', { targetIndex, wasInteracted: hasUserInteracted.current });
      hasUserInteracted.current = true; // Mark that user has interacted
      navigateToIndex(targetIndex);
    },
    [navigateToIndex],
  );

  // Handle keyboard navigation with infinite scrolling
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const targetIndex =
          currentIndex === -1 ? Math.floor(timelineData.length / 2) - 1 : currentIndex - 1;
        navigateToIndex(targetIndex);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const targetIndex =
          currentIndex === -1 ? Math.floor(timelineData.length / 2) + 1 : currentIndex + 1;
        navigateToIndex(targetIndex);
      }
    },
    [currentIndex, navigateToIndex, timelineData.length],
  );

  // PERSISTENT initialization tracking - survives all re-renders and cleanups
  const hasInitialized = useRef(false);
  const hasUserInteracted = useRef(false);

  // Single initialization effect - ABSOLUTELY one-time only
  useEffect(() => {
    // CRITICAL: Only initialize if we have data AND have never initialized before
    if (timelineData.length > 0 && !hasInitialized.current) {
      // IMMEDIATELY set to true to prevent any race conditions
      hasInitialized.current = true;

      // Get persisted state at initialization time only
      const persistedState = typeof window !== 'undefined' 
        ? (() => {
            try {
              const stored = localStorage.getItem('timelineState');
              const parsed = stored ? JSON.parse(stored) : {};
              return parsed;
            } catch {
              return {};
            }
          })()
        : {};

      console.log('✅ Timeline: ONE-TIME initialization with persisted state:', persistedState);

      dispatch({
        type: TIMELINE_ACTIONS.INITIALIZE_TIMELINE,
        payload: {
          timelineData,
          persistedState,
        },
      });
    }
  }, [timelineData.length]); // Only depend on data length, not the data itself

  // State persistence - follows React principles for side effects
  useEffect(() => {
    if (typeof window !== 'undefined' && currentIndex >= 0 && timelineData[currentIndex] && hasInitialized.current) {
      const stateToSave = { selectedYear: timelineData[currentIndex].date };
      console.log('💾 Timeline: Saving state to localStorage:', stateToSave, {
        currentIndex,
        hasInitialized: hasInitialized.current,
        triggerReason: 'currentIndex changed after initialization'
      });
      localStorage.setItem('timelineState', JSON.stringify(stateToSave));
    }
  }, [currentIndex, timelineData]);

  // Handle momentum target navigation
  useEffect(() => {
    if (timelineState.momentumTarget !== null) {
      // Reset rail offset and navigate to target
      dispatch({ type: TIMELINE_ACTIONS.SET_RAIL_OFFSET, payload: 0 });
      navigateToIndex(timelineState.momentumTarget);

      // Clear the momentum target
      dispatch({
        type: TIMELINE_ACTIONS.CALCULATE_MOMENTUM_TARGET,
        payload: { timelineLength: 0, itemSpacing: 0 },
      });
    }
  }, [timelineState.momentumTarget, navigateToIndex]);

  // Notify parent component when year changes
  useEffect(() => {
    if (onYearChange) {
      if (currentIndex >= 0 && timelineData[currentIndex]) {
        const selectedYear = timelineData[currentIndex].date;
        console.log('Timeline year change:', selectedYear, {
          currentIndex,
          hasInitialized: hasInitialized.current,
          timelineDataLength: timelineData.length
        });
        onYearChange(selectedYear);
      } else if (currentIndex === -1) {
        // Only send null if we're truly uninitialized, not during normal operation
        if (!hasInitialized.current) {
          console.log('Timeline year change: null (not yet initialized)');
          onYearChange(null);
        } else {
          console.warn('⚠️ Timeline: currentIndex is -1 but hasInitialized is true - this should not happen!', {
            currentIndex,
            hasInitialized: hasInitialized.current,
            timelineDataLength: timelineData.length
          });
        }
      }
    }
  }, [currentIndex, timelineData, onYearChange]);

  // Handle drag start for smooth dragging
  const handleDragStart = useCallback(
    (event) => {
      if (isSnapping) return;

      const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;

      // Prevent all default touch behaviors that interfere with dragging
      event.preventDefault();
      event.stopPropagation();

      // Specifically prevent horizontal scrolling on mobile
      if (event.type === 'touchstart') {
        document.body.style.overflow = 'hidden'; // Temporarily disable body scroll
        document.documentElement.style.overflow = 'hidden';
      }

      console.log('🖱️ Timeline: Drag started', { 
        wasInteracted: hasUserInteracted.current,
        currentIndex,
        currentYear: timelineData[currentIndex]?.date,
        clientX,
        isSnapping,
        isDragging,
        railOffset,
        resettingRailOffset: 'rail will be reset to 0'
      });
      hasUserInteracted.current = true;

      // CRITICAL: Reset rail offset to 0 when starting a new drag
      // This ensures we start from the current index position, not a leftover offset
      dispatch({
        type: TIMELINE_ACTIONS.START_DRAG,
        payload: {
          dragStart: { x: clientX, offset: 0 }, // Always start with 0 offset
          timestamp: Date.now(),
        },
      });
      lastTouchRef.current = { x: clientX, timestamp: Date.now() };

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (momentumTimeoutRef.current) {
        clearTimeout(momentumTimeoutRef.current);
      }

      // Add visual feedback for dragging
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = 'grabbing';
      }

      // Trigger haptic feedback when starting drag
      triggerHapticFeedback();
    },
    [isSnapping, triggerHapticFeedback, currentIndex, timelineData, isDragging, railOffset],
  );

  // Handle drag move with visual feedback and performance optimization
  const handleDragMove = useCallback(
    (event) => {
      if (!isDragging || isSnapping) return;

      event.preventDefault();
      event.stopPropagation();

      const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const deltaX = clientX - dragStart.x;

      // Performance monitoring for drag operations
      const dragStartTime = performance.now();

      // Check for performance degradation
      if (railPerformanceMetrics.fps < 30) {
        dispatch({ type: TIMELINE_ACTIONS.SET_PERFORMANCE_DEGRADED, payload: true });

        if (performanceMonitorRef.current?.record) {
          performanceMonitorRef.current.record('performance-fallback', {
            reason: 'low-fps',
            fps: railPerformanceMetrics.fps,
          });
        }
      }

      // Use requestAnimationFrame for smooth updates
      if (!performanceDegraded) {
        if (railAnimationFrameRef.current) {
          cancelAnimationFrame(railAnimationFrameRef.current);
        }

        railAnimationFrameRef.current = requestAnimationFrame(() => {
          // Enhanced rail translation with responsive resistance feel
          // More responsive on mobile devices
          const isMobile = window.innerWidth <= 768;
          const resistanceMultiplier = isMobile ? 0.9 : 0.8;
          const railTranslation = deltaX * resistanceMultiplier;

          // Calculate which timeline item is currently centered during rail drag
          const itemSpacing = 120 + 32; // Current item spacing (120px width + 32px gap)

          // Calculate the index of the item that's closest to center
          const baseCurrentIndex =
            currentIndex === -1 ? Math.floor(timelineData.length / 2) : currentIndex;
          const railOffsetInItems = -railTranslation / itemSpacing;
          const targetIndex = Math.round(baseCurrentIndex + railOffsetInItems);

          // Clamp to valid range with wrapping
          let normalizedIndex = targetIndex;
          if (normalizedIndex < 0) {
            normalizedIndex = timelineData.length + (normalizedIndex % timelineData.length);
          } else if (normalizedIndex >= timelineData.length) {
            normalizedIndex = normalizedIndex % timelineData.length;
          }

          // Enhanced velocity calculation for momentum (preserving existing physics)
          const now = Date.now();
          const timeDelta = now - lastTouchRef.current.timestamp;
          let smoothedVelocity = 0;

          if (timeDelta > 0) {
            // Improved velocity tracking with smoothing for better momentum physics
            const rawVelocity = (clientX - lastTouchRef.current.x) / timeDelta;

            // Apply slight smoothing to velocity for more natural momentum decay
            const smoothingFactor = 0.7;
            smoothedVelocity =
              momentum.velocity * (1 - smoothingFactor) + rawVelocity * smoothingFactor;
          }

          // Update drag state with rail offset but don't update currentIndex during drag
          dispatch({
            type: TIMELINE_ACTIONS.UPDATE_DRAG,
            payload: {
              railOffset: railTranslation,
              // Don't update currentIndex during drag to prevent rapid LocationInfoCard updates
              momentum: {
                velocity: smoothedVelocity,
                timestamp: now,
              },
            },
          });

          // Update performance metrics
          const dragTime = performance.now() - dragStartTime;
          dispatch({
            type: TIMELINE_ACTIONS.UPDATE_RAIL_PERFORMANCE,
            payload: {
              renderTime: Math.max(railPerformanceMetrics.renderTime, dragTime),
            },
          });
        });
      }

      // Update tracking reference for next calculation
      const now = Date.now();
      lastTouchRef.current = { x: clientX, timestamp: now };
    },
    [
      isDragging,
      dragStart,
      isSnapping,
      momentum.velocity,
      railPerformanceMetrics.fps,
      railPerformanceMetrics.renderTime,
      performanceDegraded,
      currentIndex,
      timelineData.length,
    ],
  );

  // Handle drag end with momentum and snap-to behavior
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    // Restore body scroll on mobile
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
    }

    // Calculate the final index based on current rail position
    const itemSpacing = 120 + 32; // Current item spacing (120px width + 32px gap)
    const baseCurrentIndex = currentIndex === -1 ? Math.floor(timelineData.length / 2) : currentIndex;
    const railOffsetInItems = -railOffset / itemSpacing;
    let finalIndex = Math.round(baseCurrentIndex + railOffsetInItems);

    // Ensure final index is within bounds with wrapping
    if (finalIndex < 0) {
      finalIndex = timelineData.length + (finalIndex % timelineData.length);
    } else if (finalIndex >= timelineData.length) {
      finalIndex = finalIndex % timelineData.length;
    }

    console.log('🏁 Timeline: Drag ended', {
      currentIndex,
      currentYear: timelineData[currentIndex]?.date,
      railOffset,
      railOffsetInItems,
      finalIndex,
      finalYear: timelineData[finalIndex]?.date,
      willUpdateIndex: finalIndex !== currentIndex,
      hasUserInteracted: hasUserInteracted.current
    });

    // CRITICAL: Always reset rail offset to 0 after calculating final index
    // This ensures the next drag starts from the correct visual position
    dispatch({ type: TIMELINE_ACTIONS.SET_RAIL_OFFSET, payload: 0 });

    // Update to final index immediately when drag ends
    if (finalIndex !== currentIndex && finalIndex >= 0 && finalIndex < timelineData.length) {
      console.log('📍 Timeline: Updating index after drag', {
        from: currentIndex,
        to: finalIndex,
        fromYear: timelineData[currentIndex]?.date,
        toYear: timelineData[finalIndex]?.date
      });
      dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_INDEX, payload: finalIndex });
    }

    // Calculate momentum target using reducer
    dispatch({
      type: TIMELINE_ACTIONS.CALCULATE_MOMENTUM_TARGET,
      payload: {
        timelineLength: timelineData.length,
        itemSpacing,
      },
    });

    // Reset drag states with snap animation (preserved timing and behavior)
    dispatch({
      type: TIMELINE_ACTIONS.END_DRAG,
      payload: { shouldSnap: timelineState.momentumTarget !== null },
    });

    // Preserve existing 600ms timeout for consistency
    if (timelineState.momentumTarget !== null) {
      momentumTimeoutRef.current = setTimeout(() => {
        dispatch({ type: TIMELINE_ACTIONS.SET_SNAPPING, payload: false });
      }, 600);
    }
  }, [isDragging, timelineData.length, timelineState.momentumTarget, currentIndex, railOffset, timelineData]);

  // Performance monitoring
  useEffect(() => {
    let fpsCounter = 0;
    let lastFpsTime = performance.now();

    const measureRailPerformance = () => {
      fpsCounter++;
      const now = performance.now();

      // Calculate FPS every second
      if (now - lastFpsTime >= 1000) {
        const fps = Math.round((fpsCounter * 1000) / (now - lastFpsTime));

        dispatch({
          type: TIMELINE_ACTIONS.UPDATE_RAIL_PERFORMANCE,
          payload: { fps },
        });

        // Check for performance degradation
        if (fps < 30) {
          dispatch({ type: TIMELINE_ACTIONS.SET_PERFORMANCE_DEGRADED, payload: true });

          if (performanceMonitorRef.current?.record) {
            performanceMonitorRef.current.record('performance-warning', {
              fps,
              memoryUsage: performance.memory?.usedJSHeapSize || 0,
              renderTime: railPerformanceMetrics.renderTime,
            });
          }
        }

        fpsCounter = 0;
        lastFpsTime = now;
      }

      if (!performanceDegraded) {
        requestAnimationFrame(measureRailPerformance);
      }
    };

    const performanceFrame = requestAnimationFrame(measureRailPerformance);

    return () => {
      cancelAnimationFrame(performanceFrame);
    };
  }, [performanceDegraded, railPerformanceMetrics.renderTime]);

  // Memory management and cache cleanup
  useEffect(() => {
    // Store ref value at effect start to avoid stale closure warning
    const currentCacheRef = railCalculationCacheRef.current;

    // Memory monitoring
    const memoryInterval = setInterval(() => {
      if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize;

        dispatch({
          type: TIMELINE_ACTIONS.UPDATE_RAIL_PERFORMANCE,
          payload: { memoryUsage },
        });

        // Check for memory pressure
        const memoryPressure = memoryUsage / performance.memory.jsHeapSizeLimit;
        if (memoryPressure > 0.8) {
          dispatch({ type: TIMELINE_ACTIONS.SET_PERFORMANCE_DEGRADED, payload: true });

          if (performanceMonitorRef.current?.record) {
            performanceMonitorRef.current.record('memory-pressure', {
              memoryUsage,
              memoryPressure: Math.round(memoryPressure * 100),
            });
          }
        }
      }
    }, 2000);

    return () => {
      clearInterval(memoryInterval);
      // Use stored ref to avoid stale closure
      currentCacheRef.clear();
    };
  }, []);

  // Add event listeners including drag handlers with enhanced cleanup
  useEffect(() => {
    const container = timelineRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer) return;

    // SAFETY: Preserve initialization state across effect cleanups
    const wasInitialized = hasInitialized.current;

    // Capture animation frame refs at effect start to avoid stale closure
    const currentAnimationFrame = animationFrameRef.current;
    const currentRailAnimationFrame = railAnimationFrameRef.current;

    // Timeline container events
    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('tabindex', '0');

    // Drag events for smooth timeline interaction
    scrollContainer.addEventListener('mousedown', handleDragStart);
    scrollContainer.addEventListener('touchstart', handleDragStart, { passive: false });

    // Global events for drag handling
    const handleGlobalMouseMove = (e) => handleDragMove(e);
    const handleGlobalTouchMove = (e) => handleDragMove(e);
    const handleGlobalMouseUp = () => handleDragEnd();
    const handleGlobalTouchEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);
    document.addEventListener('touchcancel', handleGlobalTouchEnd); // Handle touch cancellation

    return () => {
      // NOTE: hasInitialized.current must NEVER be reset - it's persistent across all re-renders

      container.removeEventListener('keydown', handleKeyDown);

      scrollContainer.removeEventListener('mousedown', handleDragStart);
      scrollContainer.removeEventListener('touchstart', handleDragStart);

      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchEnd);

      // Enhanced cleanup for rail mode
      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
      }
      if (currentRailAnimationFrame) {
        cancelAnimationFrame(currentRailAnimationFrame);
      }
      if (momentumTimeoutRef.current) {
        clearTimeout(momentumTimeoutRef.current);
      }

      // Clean up performance monitoring
      railCalculationCacheRef.current.clear();
    };
  }, [handleKeyDown, handleDragStart, handleDragMove, handleDragEnd]);

  // Render timeline rail for continuous scrolling with GPU acceleration and virtual scrolling
  const renderTimelineRail = useCallback(() => {
    const renderStartTime = performance.now();
    const itemSpacing = 120 + 32; // Current item spacing (120px width + 32px gap)
    const centerPosition = window.innerWidth / 2;
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // CRITICAL: Ensure we have valid currentIndex for visual rendering
    const validCurrentIndex = currentIndex >= 0 ? currentIndex : Math.floor(timelineData.length / 2);

    // Use virtual scrolled items for performance
    return timelineRail
      .map((item, virtualIndex) => {
        const index = item.railIndex;

        // Calculate position relative to the CURRENT item, not the middle of data
        const basePosition = (index - validCurrentIndex) * itemSpacing;

        // GPU-accelerated transform with translateZ(0) for hardware acceleration
        const railTransform = `translate3d(${basePosition + railOffset}px, 0, 0)`;

        // Calculate visual state based on distance from center indicator
        const itemPosition = centerPosition + basePosition + railOffset;
        const distanceFromCenter = Math.abs(itemPosition - centerPosition);

        // Determine visual state classes with smooth transitions
        let stateClass = 'distant';
        let isActive = false;

        // Check if this is the current selected item (should be centered)
        if (index === validCurrentIndex && Math.abs(railOffset) < itemSpacing / 2) {
          stateClass = 'center';
          isActive = true;
        } else if (distanceFromCenter < itemSpacing / 3) {
          stateClass = 'center';
          isActive = true;
        } else if (distanceFromCenter < itemSpacing) {
          stateClass = 'adjacent';
        }

        // Performance optimization: Skip rendering items far outside viewport
        const isOutsideViewport = Math.abs(itemPosition - centerPosition) > window.innerWidth;
        if (isOutsideViewport && timelineData.length > 20) {
          return null; // DOM recycling - don't render distant items
        }

        return (
          <div
            key={`rail-${index}`}
            className={`timeline-section ${stateClass} ${isActive ? 'active' : ''} rail-optimized`}
            data-year={item.date}
            data-rail-position={index}
            data-virtual-index={virtualIndex}
            onClick={() => handleDotClick(index)}
            aria-label={`Navigate to ${item.date} - ${item.title || item.company || 'Timeline item'}`}
            aria-current={isActive ? 'true' : 'false'}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDotClick(index);
              }
            }}
            style={{
              // GPU acceleration with translate3d and will-change
              transform: railTransform,
              willChange: 'transform',
              position: 'absolute',
              left: '50%', // Center the rail around the middle
              marginLeft: isSmallMobile ? '-60px' : isMobile ? '-60px' : '-60px', // Consistent centering across all screen sizes
              transition: 'none', // No transitions during drag for smooth rail movement
              zIndex: isActive ? 60 : 52,
              // Additional GPU optimizations
              backfaceVisibility: 'hidden',
              perspective: 1000,
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="timeline-dot"></span>
            <span className="timeline-year" data-debug-year={item.date} data-debug-active={isActive}>
              {item.date}
            </span>
          </div>
        );
      })
      .filter(Boolean); // Remove null items from DOM recycling
  }, [timelineRail, railOffset, handleDotClick, timelineData.length]);

  // Get the current year being displayed
  const getCurrentYear = () => {
    return timelineData[currentIndex]?.date || '';
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-container" ref={timelineRef}>
        <div
          className={`timeline-scroll rail-active ${isDragging ? 'dragging' : ''} ${isSnapping ? 'snapping' : ''}`}
          ref={scrollContainerRef}
        >
          <div className="timeline-center-indicator"></div>
          <div className="timeline-items-container rail-mode">{renderTimelineRail()}</div>
        </div>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  onYearChange: PropTypes.func,
};

export default Timeline;