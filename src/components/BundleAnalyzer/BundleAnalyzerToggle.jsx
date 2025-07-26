import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeveloperMode } from '../../contexts/DeveloperModeContext';
import FloatingButton from '../FloatingButton';

const BundleAnalyzerToggle = ({ isVisible, onToggle }) => {
  const { shouldShowDeveloperFeatures } = useDeveloperMode();

  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  if (!shouldShowDeveloperFeatures()) {
    return null;
  }

  const icon = isVisible ? '❌' : '📦';
  const ariaLabel = `${isVisible ? 'Hide' : 'Show'} Bundle Analyzer`;
  const title = `${ariaLabel} - Development Tool`;

  return (
    <FloatingButton
      position="above"
      icon={icon}
      isActive={isVisible}
      onClick={handleToggle}
      ariaLabel={ariaLabel}
      title={title}
      zIndex={9996}
    />
  );
};

BundleAnalyzerToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(BundleAnalyzerToggle);
