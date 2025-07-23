import { useState, useEffect, useCallback, useRef } from 'react';

export const useAboutParallax = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const aboutRef = useRef(null);

  const updateScrollPosition = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollPosition();
    };

    // Passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollPosition]);

  // Intersection observer for About section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const currentAboutRef = aboutRef.current;
    if (currentAboutRef) {
      observer.observe(currentAboutRef);
    }

    return () => {
      if (currentAboutRef) {
        observer.unobserve(currentAboutRef);
      }
    };
  }, []);

  // Calculate transform for sliding effect
  const getAboutTransform = useCallback(() => {
    if (!isInView) return 'translateY(0)';

    // Calculate how far we've scrolled into the About section
    const heroHeight = window.innerHeight; // Assuming hero is 100vh
    const aboutScrollStart = heroHeight;
    const scrollProgress = Math.max(0, scrollY - aboutScrollStart);

    // Create sliding effect - section slides up as user scrolls
    const translateY = Math.min(scrollProgress * 0.3, window.innerHeight * 0.2);

    return `translateY(-${translateY}px)`;
  }, [scrollY, isInView]);

  return {
    aboutRef,
    isInView,
    getAboutTransform,
    scrollY,
  };
};
