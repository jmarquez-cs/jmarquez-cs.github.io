import React, { useCallback } from 'react';
import './Navigation.css';
import { useTheme } from '../../hooks/useTheme';

export const Navigation = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleHomeClick = useCallback(() => scrollToSection('hero'), [scrollToSection]);
  const handleAboutClick = useCallback(() => scrollToSection('about'), [scrollToSection]);
  const handlePortfolioClick = useCallback(() => scrollToSection('portfolio'), [scrollToSection]);
  const handleContactClick = useCallback(() => scrollToSection('contact'), [scrollToSection]);

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
              onClick={handleContactClick}
              aria-label="Go to contact section"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';
