import React from 'react';
import PropTypes from 'prop-types';
import './LocationInfoCard.css';

const LocationInfoCard = ({ locationData, onClose, className = '' }) => {
  if (!locationData || !locationData.location) {
    return null;
  }

  const { location } = locationData;

  // Format camelCase keys to proper display names
  const formatKey = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
      .trim(); // Remove any extra whitespace
  };

  // Determine if value is long and needs full width
  const isLongValue = (value) => {
    return typeof value === 'string' && value.length > 20;
  };

  // Group metrics by length for better layout
  const groupMetrics = (metrics) => {
    const shortMetrics = [];
    const longMetrics = [];

    Object.entries(metrics).forEach(([key, value]) => {
      if (isLongValue(value)) {
        longMetrics.push([key, value]);
      } else {
        shortMetrics.push([key, value]);
      }
    });

    return { shortMetrics, longMetrics };
  };

  const { shortMetrics, longMetrics } = location.metrics
    ? groupMetrics(location.metrics)
    : { shortMetrics: [], longMetrics: [] };

  return (
    <div className={`location-info-card ${className}`}>
      <div className="location-info-header">
        <div className="location-info-title">
          <h3>{location.company || 'Career Position'}</h3>
          {location.role && <p className="location-role">{location.role}</p>}
        </div>
        <button className="location-close-btn" onClick={onClose} aria-label="Close location info">
          <span className="close-icon">×</span>
        </button>
      </div>

      <div className="location-info-content">
        {/* Primary Information - Smart Grid Layout */}
        <div className="location-primary-info">
          {location.period && (
            <div className={`info-item ${isLongValue(location.period) ? 'full-width' : ''}`}>
              <span className="info-label">Period</span>
              <span className="info-value">{location.period}</span>
            </div>
          )}

          {location.city && (
            <div className={`info-item ${isLongValue(location.city) ? 'full-width' : ''}`}>
              <span className="info-label">Location</span>
              <span className="info-value">{location.city}</span>
            </div>
          )}
        </div>

        {/* Description - Compact */}
        {locationData.desc && (
          <div className="location-description">
            <p>{locationData.desc}</p>
          </div>
        )}

        {/* Metrics - Intelligent Grid Layout */}
        {(shortMetrics.length > 0 || longMetrics.length > 0) && (
          <div className="location-metrics">
            <div className="metrics-grid">
              {/* Short metrics in grid */}
              {shortMetrics.map(([key, value]) => (
                <div key={key} className="metric-card">
                  <span className="metric-label">{formatKey(key)}</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}

              {/* Long metrics full width */}
              {longMetrics.map(([key, value]) => (
                <div key={key} className="metric-card full-width">
                  <span className="metric-label">{formatKey(key)}</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies - Inline Flow */}
        {location.technologies && location.technologies.length > 0 && (
          <div className="location-technologies">
            <div className="tech-grid">
              {location.technologies.map((tech, index) => (
                <span key={index} className="tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information - Only if exists */}
        {(location.patents || location.certification || location.whitepapers) && (
          <div className="location-additional">
            {location.patents && (
              <div className="info-item">
                <span className="info-label">Patents</span>
                <span className="info-value">{location.patents}</span>
              </div>
            )}

            {location.certification && (
              <div className="info-item">
                <span className="info-label">Certification</span>
                <span className="info-value">{location.certification}</span>
              </div>
            )}

            {location.whitepapers && (
              <div className="info-item">
                <span className="info-label">Whitepapers</span>
                <span className="info-value">{location.whitepapers}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

LocationInfoCard.propTypes = {
  locationData: PropTypes.shape({
    location: PropTypes.object,
    desc: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default LocationInfoCard;
