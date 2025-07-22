import { useState, useEffect, useCallback, useRef } from 'react';

export const useParallaxScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const frameRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const updateScrollPosition = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollPosition();
    };

    // Passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateScrollPosition]);

  // Calculate parallax transforms for different layers with throttled updates
  const getParallaxTransform = useCallback(
    (speed) => {
      // Only recalculate if scrollY changed significantly (reduce floating point precision issues)
      const translateY = Math.round(scrollY * speed);
      return `translate3d(0, ${translateY}px, 0)`;
    },
    [scrollY],
  );

  const getParallaxWithRotation = useCallback(
    (speed, rotationFactor = 0.1) => {
      // Optimize calculations with integer arithmetic where possible
      const translateY = Math.round(scrollY * speed);
      const rotation = Math.round(scrollY * rotationFactor * 10) / 10; // Reduced precision for performance
      return `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg)`;
    },
    [scrollY],
  );

  return {
    scrollY,
    isScrolling,
    getParallaxTransform,
    getParallaxWithRotation,
  };
};
