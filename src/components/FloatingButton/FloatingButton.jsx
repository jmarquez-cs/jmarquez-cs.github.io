import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useDeveloperMode } from '../../contexts/DeveloperModeContext';
import './FloatingButton.css';

const FloatingButton = ({
  position = 'center',
  icon,
  pendingIcon = '⏳',
  isPending = false,
  isActive = false,
  isDisabled = false,
  onClick,
  ariaLabel,
  title,
  className = '',
  zIndex = 9998,
}) => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
  const { shouldShowDeveloperFeatures } = useDeveloperMode();

  const handleClick = useCallback(() => {
    if (!isPending && !isDisabled && onClick) {
      onClick();
    }
  }, [isPending, isDisabled, onClick]);

  const positionClass = `floating-button-${position}`;

  const responsiveClasses = [
    'floating-button-base',
    'floating-button-floating',
    positionClass,
    theme,
    isPending ? 'pending' : '',
    isActive ? 'active' : '',
    isMobile ? 'mobile' : '',
    isTablet ? 'tablet' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonStyle = {
    zIndex,
  };

  return (
    <button
      className={responsiveClasses}
      style={buttonStyle}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel}
      disabled={isPending || isDisabled}
    >
      {isPending ? pendingIcon : icon}
    </button>
  );
};

FloatingButton.propTypes = {
  position: PropTypes.oneOf(['center', 'above', 'below']).isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  pendingIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isPending: PropTypes.bool,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  zIndex: PropTypes.number,
  developmentOnly: PropTypes.bool,
};

FloatingButton.defaultProps = {
  pendingIcon: '⏳',
  isPending: false,
  isActive: false,
  isDisabled: false,
  className: '',
  zIndex: 9998,
  developmentOnly: false,
};

export default React.memo(FloatingButton);
