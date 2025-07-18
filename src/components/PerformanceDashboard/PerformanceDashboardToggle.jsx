import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FloatingButton from '../FloatingButton';

const PerformanceDashboardToggle = ({ isVisible, onToggle }) => {
  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const icon = isVisible ? '❌' : '📊';
  const ariaLabel = `${isVisible ? 'Hide' : 'Show'} Performance Dashboard`;
  const isProd = process.env.NODE_ENV === 'production';
  const title = isProd
    ? `${ariaLabel} - Site Performance Metrics`
    : `${ariaLabel} - Real-time Performance Metrics`;

  return (
    <FloatingButton
      position="above"
      icon={icon}
      isActive={isVisible}
      onClick={handleToggle}
      ariaLabel={ariaLabel}
      title={title}
      zIndex={9998}
    />
  );
};

PerformanceDashboardToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(PerformanceDashboardToggle);
