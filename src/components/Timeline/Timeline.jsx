import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { careerLocations } from '../../data/worldGlobeData';
import { portfolioSchema } from '../../data/portfolioData';
import './Timeline.css';

const Timeline = ({ onYearChange }) => {
  const timelineRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Smooth scrolling and momentum tracking
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [momentum, setMomentum] = useState({ velocity: 0, timestamp: 0 });
  const [isSnapping, setIsSnapping] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, timestamp: 0 });

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

  // Generate visible dots for the current viewport (always show 7 dots with center active)
  const visibleDots = useMemo(() => {
    const dots = [];
    const totalDots = 7;
    const centerIndex = Math.floor(totalDots / 2);

    // If no selection (currentIndex = -1), show middle section of timeline
    const baseIndex = currentIndex === -1 ? Math.floor(timelineData.length / 2) : currentIndex;

    for (let i = 0; i < totalDots; i++) {
      const offset = i - centerIndex;
      const dataIndex = (baseIndex + offset + timelineData.length) % timelineData.length;
      const item = timelineData[dataIndex];

      dots.push({
        ...item,
        position: i,
        isCenter: i === centerIndex && currentIndex !== -1, // No center highlighting when no selection
        offset: offset,
      });
    }

    return dots;
  }, [currentIndex, timelineData]);

  // Haptic feedback utility
  const triggerHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Subtle 10ms vibration
    }
  }, []);

  // Navigate to next/previous year with seamless wrapping and haptic feedback
  const navigateToIndex = useCallback(
    (targetIndex) => {
      if (!timelineRef.current) return;

      setIsAutoScrolling(true);

      // Normalize the target index to stay within bounds
      const normalizedIndex =
        ((targetIndex % timelineData.length) + timelineData.length) % timelineData.length;

      // Trigger haptic feedback when snapping to a new year
      if (normalizedIndex !== currentIndex) {
        triggerHapticFeedback();
      }

      setCurrentIndex(normalizedIndex);

      setTimeout(() => setIsAutoScrolling(false), 300);
    },
    [timelineData.length, currentIndex, triggerHapticFeedback],
  );

  // Handle click on timeline dots
  const handleDotClick = useCallback(
    (offset) => {
      if (currentIndex === -1) {
        // First click from no selection state - select the center position
        const centerIndex = Math.floor(timelineData.length / 2);
        navigateToIndex(centerIndex + offset);
      } else {
        const targetIndex = currentIndex + offset;
        navigateToIndex(targetIndex);
      }
    },
    [currentIndex, navigateToIndex, timelineData.length],
  );

  // Smooth scroll to specific index with momentum - defined before dependent callbacks
  const smoothScrollToIndex = useCallback((targetIndex) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const itemWidth = 120; // Timeline section width + gap
    const containerWidth = container.offsetWidth;
    const targetScrollLeft = targetIndex * itemWidth - containerWidth / 2 + itemWidth / 2;

    setIsSnapping(true);
    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });

    setTimeout(() => setIsSnapping(false), 400);
  }, []);

  // Handle keyboard navigation with smooth scrolling
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const targetIndex =
          currentIndex === -1 ? Math.floor(timelineData.length / 2) - 1 : currentIndex - 1;
        navigateToIndex(targetIndex);
        smoothScrollToIndex(targetIndex);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const targetIndex =
          currentIndex === -1 ? Math.floor(timelineData.length / 2) + 1 : currentIndex + 1;
        navigateToIndex(targetIndex);
        smoothScrollToIndex(targetIndex);
      }
    },
    [currentIndex, navigateToIndex, smoothScrollToIndex, timelineData.length],
  );

  // Handle scroll wheel navigation with smooth scrolling
  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const centerIndex = Math.floor(timelineData.length / 2);

      // Only respond to horizontal scroll or if vertical scroll is more significant
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const targetIndex =
          event.deltaX > 0
            ? currentIndex === -1
              ? centerIndex + 1
              : currentIndex + 1
            : currentIndex === -1
              ? centerIndex - 1
              : currentIndex - 1;
        navigateToIndex(targetIndex);
        smoothScrollToIndex(targetIndex);
      } else if (Math.abs(event.deltaY) > 5) {
        // Convert vertical scroll to horizontal navigation
        const targetIndex =
          event.deltaY > 0
            ? currentIndex === -1
              ? centerIndex + 1
              : currentIndex + 1
            : currentIndex === -1
              ? centerIndex - 1
              : currentIndex - 1;
        navigateToIndex(targetIndex);
        smoothScrollToIndex(targetIndex);
      }
    },
    [currentIndex, navigateToIndex, smoothScrollToIndex, timelineData.length],
  );

  // Initialize with no selection (null state)
  useEffect(() => {
    setCurrentIndex(-1); // Start with no selection
  }, [timelineData.length]);

  // Notify parent component when year changes
  useEffect(() => {
    if (onYearChange) {
      if (currentIndex >= 0 && timelineData[currentIndex]) {
        onYearChange(timelineData[currentIndex].date);
      } else {
        onYearChange(null); // Explicitly communicate no selection
      }
    }
  }, [currentIndex, timelineData, onYearChange]);

  // Handle drag start for momentum scrolling
  const handleDragStart = useCallback(
    (event) => {
      if (isSnapping) return;

      const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
      const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

      setIsDragging(true);
      setDragStart({ x: clientX, scrollLeft });
      setMomentum({ velocity: 0, timestamp: Date.now() });
      lastTouchRef.current = { x: clientX, timestamp: Date.now() };

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [isSnapping],
  );

  // Handle drag move for momentum calculation
  const handleDragMove = useCallback(
    (event) => {
      if (!isDragging || isSnapping) return;

      event.preventDefault();
      const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const deltaX = clientX - dragStart.x;
      const newScrollLeft = dragStart.scrollLeft - deltaX;

      // Calculate velocity for momentum
      const now = Date.now();
      const timeDelta = now - lastTouchRef.current.timestamp;
      if (timeDelta > 0) {
        const velocity = (clientX - lastTouchRef.current.x) / timeDelta;
        setMomentum({ velocity, timestamp: now });
      }

      lastTouchRef.current = { x: clientX, timestamp: now };

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = newScrollLeft;
      }
    },
    [isDragging, dragStart, isSnapping],
  );

  // Handle drag end with momentum and snap-to effect
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Apply momentum if velocity is significant
    if (Math.abs(momentum.velocity) > 0.5 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = 120;
      const currentScroll = container.scrollLeft;
      const momentumDistance = momentum.velocity * 200; // Momentum factor
      const targetScroll = currentScroll + momentumDistance;

      // Find nearest snap point
      const nearestIndex = Math.round(targetScroll / itemWidth);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, timelineData.length - 1));

      navigateToIndex(clampedIndex);
      smoothScrollToIndex(clampedIndex);
    } else {
      // Snap to nearest without momentum
      const container = scrollContainerRef.current;
      if (container) {
        const itemWidth = 120;
        const nearestIndex = Math.round(container.scrollLeft / itemWidth);
        const clampedIndex = Math.max(0, Math.min(nearestIndex, timelineData.length - 1));

        navigateToIndex(clampedIndex);
        smoothScrollToIndex(clampedIndex);
      }
    }
  }, [isDragging, momentum, timelineData.length, navigateToIndex, smoothScrollToIndex]);

  // Handle touch zone clicks
  const handleLeftZoneClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const centerIndex = Math.floor(timelineData.length / 2);
      const targetIndex = currentIndex === -1 ? centerIndex - 1 : currentIndex - 1;
      navigateToIndex(targetIndex);
      smoothScrollToIndex(targetIndex);
    },
    [currentIndex, navigateToIndex, smoothScrollToIndex, timelineData.length],
  );

  const handleRightZoneClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const centerIndex = Math.floor(timelineData.length / 2);
      const targetIndex = currentIndex === -1 ? centerIndex + 1 : currentIndex + 1;
      navigateToIndex(targetIndex);
      smoothScrollToIndex(targetIndex);
    },
    [currentIndex, navigateToIndex, smoothScrollToIndex, timelineData.length],
  );

  // Prevent all scrolling and touch behaviors
  const preventScrolling = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Add event listeners including drag handlers
  useEffect(() => {
    const container = timelineRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container) return;

    // Capture animation frame ref at effect start to avoid stale closure
    const currentAnimationFrame = animationFrameRef.current;

    // Timeline container events
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('tabindex', '0');

    // Scroll container drag events
    if (scrollContainer) {
      scrollContainer.addEventListener('mousedown', handleDragStart);
      scrollContainer.addEventListener('mousemove', handleDragMove);
      scrollContainer.addEventListener('mouseup', handleDragEnd);
      scrollContainer.addEventListener('mouseleave', handleDragEnd);
      scrollContainer.addEventListener('touchstart', handleDragStart, { passive: false });
      scrollContainer.addEventListener('touchmove', handleDragMove, { passive: false });
      scrollContainer.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);

      if (scrollContainer) {
        scrollContainer.removeEventListener('mousedown', handleDragStart);
        scrollContainer.removeEventListener('mousemove', handleDragMove);
        scrollContainer.removeEventListener('mouseup', handleDragEnd);
        scrollContainer.removeEventListener('mouseleave', handleDragEnd);
        scrollContainer.removeEventListener('touchstart', handleDragStart);
        scrollContainer.removeEventListener('touchmove', handleDragMove);
        scrollContainer.removeEventListener('touchend', handleDragEnd);
      }

      // Use captured value to avoid stale closure warning
      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
      }
    };
  }, [handleWheel, handleKeyDown, handleDragStart, handleDragMove, handleDragEnd]);

  // Get the current year being displayed
  const getCurrentYear = () => {
    return timelineData[currentIndex]?.date || '';
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-container" ref={timelineRef}>
        {/* Left navigation zone */}
        <button
          className="timeline-nav-zone left"
          onClick={handleLeftZoneClick}
          onTouchEnd={handleLeftZoneClick}
          aria-label="Navigate to previous year"
          type="button"
        />

        {/* Right navigation zone */}
        <button
          className="timeline-nav-zone right"
          onClick={handleRightZoneClick}
          onTouchEnd={handleRightZoneClick}
          aria-label="Navigate to next year"
          type="button"
        />

        <div
          className={`timeline-scroll ${isDragging ? 'dragging' : ''} ${isSnapping ? 'snapping' : ''}`}
          ref={scrollContainerRef}
        >
          <div className="timeline-center-indicator"></div>
          {timelineData.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              className={`timeline-section ${currentIndex === index ? 'center active' : ''} ${
                Math.abs(currentIndex - index) === 1 ? 'adjacent' : ''
              } ${Math.abs(currentIndex - index) > 1 ? 'distant' : ''}`}
              data-year={item.date}
              data-index={index}
              onClick={() => {
                navigateToIndex(index);
                smoothScrollToIndex(index);
              }}
              aria-label={`Navigate to ${item.date} - ${item.title || item.company || 'Timeline item'}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
              type="button"
            >
              <div className="timeline-dot"></div>
              <div className="timeline-year">{item.date}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  onYearChange: PropTypes.func,
};

export default Timeline;
