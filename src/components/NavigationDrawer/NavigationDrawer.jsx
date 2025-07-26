import React from 'react';
import PropTypes from 'prop-types';
import { useDeveloperMode } from '../../contexts/DeveloperModeContext';
import './NavigationDrawer.css';

export const NavigationDrawer = React.memo(
  ({ onHomeClick, onAboutClick, onPortfolioClick, onSkillsClick, onThemeToggle, theme }) => {
    const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

    return (
      <nav className="drawer-nav">
        <ul className="drawer-menu" role="menubar">
          <li role="none">
            <button
              className="drawer-link"
              onClick={onHomeClick}
              aria-label="Go to home section"
              role="menuitem"
              type="button"
            >
              Home
            </button>
          </li>
          <li role="none">
            <button
              className="drawer-link"
              onClick={onAboutClick}
              aria-label="Go to about section"
              role="menuitem"
              type="button"
            >
              About
            </button>
          </li>
          <li role="none">
            <button
              className="drawer-link"
              onClick={onPortfolioClick}
              aria-label="Go to portfolio section"
              role="menuitem"
              type="button"
            >
              Portfolio
            </button>
          </li>
          <li role="none">
            <button
              className="drawer-link"
              onClick={onSkillsClick}
              aria-label="Go to tech skills section"
              role="menuitem"
              type="button"
            >
              Tech
            </button>
          </li>
          <li role="none">
            <button
              className="drawer-link theme-toggle-drawer"
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              role="menuitem"
              type="button"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </li>
          <li role="none">
            <button
              className="drawer-link developer-toggle-drawer"
              onClick={toggleDeveloperMode}
              aria-label={`${isDeveloperMode ? 'Disable' : 'Enable'} developer mode`}
              role="menuitem"
              type="button"
            >
              {isDeveloperMode ? '🔧 Dev Mode: ON' : '⚙️ Dev Mode: OFF'}
            </button>
          </li>
        </ul>
      </nav>
    );
  },
);

NavigationDrawer.propTypes = {
  onHomeClick: PropTypes.func.isRequired,
  onAboutClick: PropTypes.func.isRequired,
  onPortfolioClick: PropTypes.func.isRequired,
  onSkillsClick: PropTypes.func.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};

NavigationDrawer.displayName = 'NavigationDrawer';
