import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeveloperMode } from '../../contexts/DeveloperModeContext';
import FloatingButton from '../FloatingButton';

const PerformanceDashboardToggle = ({ isVisible, onToggle }) => {
  const { shouldShowDeveloperFeatures } = useDeveloperMode();

  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  if (!shouldShowDeveloperFeatures()) {
    return null;
  }

  const icon = isVisible ? '❌' : '📊';
  const ariaLabel = `${isVisible ? 'Hide' : 'Show'} Performance Dashboard`;
  const title = `${ariaLabel} - Real-time Performance Metrics`;

  return (
    <FloatingButton
      position="above"
      icon={icon}
      isActive={isVisible}
      onClick={handleToggle}
      ariaLabel={ariaLabel}
      title={title}
      zIndex={9999}
    />
  );
};

PerformanceDashboardToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(PerformanceDashboardToggle);
