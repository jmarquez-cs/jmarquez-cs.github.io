import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeveloperMode } from '../../contexts/DeveloperModeContext';
import FloatingButton from '../FloatingButton';

const SEODashboardToggle = ({ isVisible, onToggle }) => {
  const { shouldShowDeveloperFeatures } = useDeveloperMode();

  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  if (!shouldShowDeveloperFeatures()) {
    return null;
  }

  const icon = isVisible ? '❌' : '🔍';
  const ariaLabel = `${isVisible ? 'Hide' : 'Show'} SEO Dashboard`;
  const title = `${ariaLabel} - SEO Performance Monitor`;

  return (
    <FloatingButton
      position="below"
      icon={icon}
      isActive={isVisible}
      onClick={handleToggle}
      ariaLabel={ariaLabel}
      title={title}
      zIndex={9997}
    />
  );
};

SEODashboardToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(SEODashboardToggle);
