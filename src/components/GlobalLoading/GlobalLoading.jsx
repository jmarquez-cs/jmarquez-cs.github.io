import React from 'react';
import PropTypes from 'prop-types';
import './GlobalLoading.css';

const GlobalLoading = ({ componentName = 'Component' }) => {
  return (
    <div className="global-loading">
      <div className="global-loading-spinner"></div>
      <p>Loading {componentName}...</p>
    </div>
  );
};

GlobalLoading.propTypes = {
  componentName: PropTypes.string,
};

export { GlobalLoading };
