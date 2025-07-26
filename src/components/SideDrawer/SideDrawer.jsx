import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SideDrawer.css';

export const SideDrawer = React.memo(
  ({ isOpen, onClose, title = 'Menu', children, position = 'left' }) => {
    const drawerRef = useRef(null);

    // Handle escape key and click outside
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      const handleClickOutside = (e) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target) && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        // Prevent body scroll when drawer is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    return (
      <>
        {/* Drawer Overlay */}
        <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
          {/* Drawer */}
          <div
            ref={drawerRef}
            className={`drawer drawer--${position} ${isOpen ? 'open' : ''}`}
            role="dialog"
            aria-label={title}
            aria-modal="true"
          >
            <div className="drawer-header">
              <h2 className="drawer-title">{title}</h2>
              <button
                className="drawer-close"
                onClick={onClose}
                aria-label="Close menu"
                type="button"
              >
                ×
              </button>
            </div>
            <div className="drawer-content">{children}</div>
          </div>
        </div>
      </>
    );
  },
);

SideDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  position: PropTypes.oneOf(['left', 'right']),
};

SideDrawer.displayName = 'SideDrawer';
