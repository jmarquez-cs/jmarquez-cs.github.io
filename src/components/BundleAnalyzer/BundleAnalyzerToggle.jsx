import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FloatingButton from '../FloatingButton';

const BundleAnalyzerToggle = ({ isVisible, onToggle }) => {
  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

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
      developmentOnly={true}
    />
  );
};

BundleAnalyzerToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(BundleAnalyzerToggle);
