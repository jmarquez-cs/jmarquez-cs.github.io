import { useCallback, useMemo } from 'react';

/**
 * Custom hook for section scrolling with smooth navigation
 * Follows ReactPrinciples.md: single responsibility, stable references
 */
export const useScrollToSection = () => {
  const scrollUtilities = useMemo(() => {
    const calculateScrollPosition = (element, navbarHeight, viewportHeight) => {
      const elementPosition = element.offsetTop;
      const elementHeight = element.offsetHeight;

      // For full-height sections, offset by navbar only
      // For smaller sections, center in viewport
      if (elementHeight >= viewportHeight * 0.9) {
        return elementPosition - navbarHeight;
      } else {
        return elementPosition - navbarHeight - (viewportHeight - navbarHeight - elementHeight) / 2;
      }
    };

    const performScroll = (element, offsetPosition) => {
      // Force layout recalculation before smooth scroll
      element.scrollIntoView({ behavior: 'instant', block: 'end' });

      setTimeout(() => {
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
      }, 10);
    };

    return { calculateScrollPosition, performScroll };
  }, []);

  const scrollToSection = useCallback(
    (sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) {
        console.warn(`Section with id "${sectionId}" not found`);
        return false;
      }

      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar?.offsetHeight ?? 70;
      const viewportHeight = window.innerHeight;

      const offsetPosition = scrollUtilities.calculateScrollPosition(
        element,
        navbarHeight,
        viewportHeight,
      );

      scrollUtilities.performScroll(element, offsetPosition);
      return true;
    },
    [scrollUtilities],
  );

  const findSectionByAlternatives = useCallback((primaryId, alternatives = []) => {
    const allIds = [primaryId, ...alternatives];
    for (const id of allIds) {
      const element = document.getElementById(id);
      if (element) return element.id;
    }
    return null;
  }, []);

  return { scrollToSection, findSectionByAlternatives };
};
