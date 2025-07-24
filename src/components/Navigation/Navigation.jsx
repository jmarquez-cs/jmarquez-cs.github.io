import React, { useCallback } from 'react';
import './Navigation.css';
import { useTheme } from '../../hooks/useTheme';

export const Navigation = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 70; // fallback to 70px
      const elementPosition = element.offsetTop;
      const viewportHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;

      // Calculate offset - for full-height sections (like skills radar), just offset by navbar
      // For smaller sections, center them in viewport
      let offsetPosition;
      if (elementHeight >= viewportHeight * 0.9) {
        // If section is nearly full height or larger, just offset by navbar height
        offsetPosition = elementPosition - navbarHeight;
      } else {
        // If section is smaller than viewport, center it
        offsetPosition =
          elementPosition - navbarHeight - (viewportHeight - navbarHeight - elementHeight) / 2;
      }

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }, []);

  const handleHomeClick = useCallback(() => scrollToSection('hero'), [scrollToSection]);
  const handleAboutClick = useCallback(() => scrollToSection('about'), [scrollToSection]);
  const handlePortfolioClick = useCallback(() => scrollToSection('portfolio'), [scrollToSection]);
  const handlePaletteClick = useCallback(() => scrollToSection('skills'), [scrollToSection]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">JOHN MARQUEZ</div>
        <ul className="nav-menu">
          <li>
            <button className="nav-link" onClick={handleHomeClick} aria-label="Go to home section">
              Home
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={handleAboutClick}
              aria-label="Go to about section"
            >
              About
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={handlePortfolioClick}
              aria-label="Go to portfolio section"
            >
              Portfolio
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={handlePaletteClick}
              aria-label="Go to color palette section"
            >
              Tech
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';
