import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useConfetti } from '../../hooks/useConfetti';
import './ThemeToggle.css';

export const ThemeToggle = ({ onToggle, currentTheme }) => {
  const { triggerThemeConfetti } = useConfetti();

  // Auto-detect theme based on local time
  useEffect(() => {
    const autoDetectTheme = () => {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18; // 6 AM to 6 PM is day
      const preferredTheme = isDaytime ? 'light' : 'dark';

      // Only auto-switch if user hasn't manually set a preference recently
      const lastManualToggle = localStorage.getItem('lastManualToggle');
      const oneHourAgo = Date.now() - 60 * 60 * 1000;

      if (!lastManualToggle || parseInt(lastManualToggle) < oneHourAgo) {
        if (currentTheme !== preferredTheme) {
          onToggle();
        }
      }
    };

    // Check on mount
    autoDetectTheme();

    // Check every hour
    const interval = setInterval(autoDetectTheme, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentTheme, onToggle]);

  const handleClick = (e) => {
    // Mark as manual toggle to prevent auto-switching for an hour
    localStorage.setItem('lastManualToggle', Date.now().toString());

    triggerThemeConfetti(e.currentTarget);
    onToggle();
  };

  return (
    <button
      className="theme-toggle theme-toggle-floating"
      onClick={handleClick}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {currentTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

// Add propTypes validation
ThemeToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  currentTheme: PropTypes.string.isRequired,
};
