import React from 'react';
import PropTypes from 'prop-types';
import './HamburgerMenu.css';

export const HamburgerMenu = React.memo(({ isOpen, onClick, ariaLabel }) => {
  return (
    <button
      className={`hamburger-menu ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel || (isOpen ? 'Close menu' : 'Open menu')}
      aria-expanded={isOpen}
      type="button"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
});

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

HamburgerMenu.displayName = 'HamburgerMenu';
