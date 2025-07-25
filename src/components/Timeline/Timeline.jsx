import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { careerLocations } from '../../data/worldGlobeData';
import { portfolioSchema } from '../../data/portfolioData';
import './Timeline.css';

const Timeline = ({ onYearChange }) => {
  const timelineRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

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

  // Navigate to next/previous year with seamless wrapping
  const navigateToIndex = useCallback(
    (targetIndex) => {
      if (!timelineRef.current) return;

      setIsAutoScrolling(true);

      // Normalize the target index to stay within bounds
      const normalizedIndex =
        ((targetIndex % timelineData.length) + timelineData.length) % timelineData.length;
      setCurrentIndex(normalizedIndex);

      setTimeout(() => setIsAutoScrolling(false), 300);
    },
    [timelineData.length],
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

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentIndex === -1) {
          navigateToIndex(Math.floor(timelineData.length / 2) - 1);
        } else {
          navigateToIndex(currentIndex - 1);
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentIndex === -1) {
          navigateToIndex(Math.floor(timelineData.length / 2) + 1);
        } else {
          navigateToIndex(currentIndex + 1);
        }
      }
    },
    [currentIndex, navigateToIndex, timelineData.length],
  );

  // Handle scroll wheel navigation (prevent all scrolling)
  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const centerIndex = Math.floor(timelineData.length / 2);

      // Only respond to horizontal scroll or if vertical scroll is more significant
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        if (event.deltaX > 0) {
          navigateToIndex(currentIndex === -1 ? centerIndex + 1 : currentIndex + 1);
        } else {
          navigateToIndex(currentIndex === -1 ? centerIndex - 1 : currentIndex - 1);
        }
      } else if (Math.abs(event.deltaY) > 5) {
        // Convert vertical scroll to horizontal navigation
        if (event.deltaY > 0) {
          navigateToIndex(currentIndex === -1 ? centerIndex + 1 : currentIndex + 1);
        } else {
          navigateToIndex(currentIndex === -1 ? centerIndex - 1 : currentIndex - 1);
        }
      }
    },
    [currentIndex, navigateToIndex, timelineData.length],
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

  // Handle touch zone clicks
  const handleLeftZoneClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const centerIndex = Math.floor(timelineData.length / 2);
      navigateToIndex(currentIndex === -1 ? centerIndex - 1 : currentIndex - 1);
    },
    [currentIndex, navigateToIndex, timelineData.length],
  );

  const handleRightZoneClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const centerIndex = Math.floor(timelineData.length / 2);
      navigateToIndex(currentIndex === -1 ? centerIndex + 1 : currentIndex + 1);
    },
    [currentIndex, navigateToIndex, timelineData.length],
  );

  // Prevent all scrolling and touch behaviors
  const preventScrolling = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Add event listeners
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;

    // Prevent all forms of scrolling
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchmove', preventScrolling, { passive: false });
    container.addEventListener('touchstart', preventScrolling, { passive: false });
    container.addEventListener('scroll', preventScrolling, { passive: false });
    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('tabindex', '0');

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', preventScrolling);
      container.removeEventListener('touchstart', preventScrolling);
      container.removeEventListener('scroll', preventScrolling);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown, preventScrolling]);

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

        <div className="timeline-scroll">
          <div className="timeline-center-indicator"></div>
          {visibleDots.map((item) => (
            <button
              key={`${item.id}-${item.position}`}
              className={`timeline-section ${item.isCenter ? 'center' : ''}`}
              data-year={item.date}
              data-offset={item.offset}
              onClick={() => handleDotClick(item.offset)}
              aria-label={`Navigate to ${item.date} - ${item.title || item.company || 'Timeline item'}`}
              aria-current={item.isCenter ? 'true' : 'false'}
              type="button"
            >
              <div className="timeline-dot"></div>
              <div className="timeline-year-hidden">{item.date}</div>
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
