import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import WorldGlobe from './WorldGlobe';
import {
  careerLocations,
  defaultGlobeConfig,
  themePresets,
  locationUtils,
} from '../../data/worldGlobeData';

const WorldGlobeContainer = ({
  config = defaultGlobeConfig,
  themePreset = 'default',
  filterTechnology = null,
  filterPeriod = null,
  onLocationSelect = null,
  className = '',
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  // Apply filters to locations
  const filteredLocations = React.useMemo(() => {
    let locations = [...careerLocations];

    if (filterTechnology) {
      locations = locationUtils.filterByTechnology(locations, filterTechnology);
    }

    if (filterPeriod) {
      locations = locationUtils.filterByPeriod(locations, filterPeriod.start, filterPeriod.end);
    }

    return locationUtils.sortByDate(locations);
  }, [filterTechnology, filterPeriod]);

  // Get theme colors based on preset
  const themeColors = React.useMemo(() => {
    if (themePreset === 'default') {
      return config.colors || defaultGlobeConfig.colors;
    }
    return themePresets[themePreset] || defaultGlobeConfig.colors;
  }, [themePreset, config.colors]);

  const handleMarkerClick = useCallback(
    (locationData, event) => {
      setSelectedLocation(locationData);
      if (onLocationSelect) {
        onLocationSelect(locationData, event);
      }
    },
    [onLocationSelect],
  );

  const handleMarkerHover = useCallback((locationData, event) => {
    setHoveredLocation(locationData);
  }, []);

  const globeConfig = {
    ...defaultGlobeConfig,
    ...config,
    colors: themeColors,
    // Theme is now handled by global context
  };

  return (
    <div className={`world-globe-container-wrapper ${className}`}>
      <WorldGlobe
        {...globeConfig}
        locations={filteredLocations}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={handleMarkerHover}
      />

      {/* Optional overlay with location details */}
      {selectedLocation && (
        <div className="location-details-overlay">
          <div className="location-details">
            <h2>{selectedLocation.title}</h2>
            <div className="location-meta">
              <p>
                <strong>Company:</strong> {selectedLocation.company}
              </p>
              <p>
                <strong>Role:</strong> {selectedLocation.role}
              </p>
              <p>
                <strong>Period:</strong> {selectedLocation.period}
              </p>
              <p>
                <strong>Location:</strong> {selectedLocation.city}
              </p>
            </div>
            <div className="location-description">
              <p>{selectedLocation.desc}</p>
            </div>
            {selectedLocation.technologies && (
              <div className="location-technologies">
                <h4>Technologies:</h4>
                <div className="tech-tags">
                  {selectedLocation.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setSelectedLocation(null)} className="close-details">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

WorldGlobeContainer.propTypes = {
  config: PropTypes.object,
  themePreset: PropTypes.oneOf(['default', 'ocean', 'forest', 'sunset']),
  filterTechnology: PropTypes.string,
  filterPeriod: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }),
  onLocationSelect: PropTypes.func,
  className: PropTypes.string,
};

export default WorldGlobeContainer;
