import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { ThemeToggle } from '../ThemeToggle';
import './Navigation.css';

export const Navigation = ({ theme, onThemeToggle }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">JOHN MARQUEZ</div>
        <ul className="nav-menu">
          <li>
            <button
              className="nav-link"
              onClick={() => scrollToSection('hero')}
              aria-label="Go to home section"
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => scrollToSection('about')}
              aria-label="Go to about section"
            >
              About
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => scrollToSection('portfolio')}
              aria-label="Go to portfolio section"
            >
              Portfolio
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => scrollToSection('contact')}
              aria-label="Go to contact section"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Add propTypes validation
Navigation.propTypes = {
  theme: PropTypes.string.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
};
