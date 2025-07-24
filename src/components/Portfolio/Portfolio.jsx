import React, { useState, useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { WorldGlobe } from '../WorldGlobe';
import { Timeline } from '../Timeline';
import { careerLocations } from '../../data/worldGlobeData';
import './Portfolio.css';

const PortfolioComponent = () => {
  usePerformanceMonitor();

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedLocationData, setSelectedLocationData] = useState(null);

  // Find the closest career location for a given year
  const findClosestLocation = (year) => {
    if (!year) return null;

    const targetYear = parseInt(year);
    let closestLocation = null;
    let smallestDifference = Infinity;

    careerLocations.forEach((location) => {
      const periodMatch = location.period.match(/(\d{4})/g);
      if (periodMatch) {
        const locationYear = parseInt(periodMatch[0]);
        const difference = Math.abs(locationYear - targetYear);

        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestLocation = location;
        }
      }
    });

    return closestLocation;
  };

  // Handle timeline year changes
  const handleTimelineChange = useCallback((year) => {
    console.log('Timeline year change:', year); // Debug log

    if (!year || year === null) {
      // Handle null/undefined year (no selection state)
      setSelectedYear(null);
      setSelectedLocationData(null);
      return;
    }

    setSelectedYear(year);

    // Find matching location data
    const matchingLocation = careerLocations.find((location) => {
      const locationYear = location.period.match(/(\d{4})/)?.[1];
      return locationYear === year;
    });

    if (matchingLocation) {
      setSelectedLocationData(matchingLocation);
    } else {
      setSelectedLocationData(null);
    }
  }, []);

  // Handle click-away to close info-content
  useEffect(() => {
    const handleClickAway = (event) => {
      // Only close if there's selected location data to close
      if (!selectedLocationData) return;

      // Check if click is outside the world-globe-info and timeline areas
      const worldGlobeInfo = document.querySelector('.world-globe-info');
      const timelineSection = document.querySelector('.portfolio-timeline-section');

      if (worldGlobeInfo && timelineSection) {
        const isClickInsideInfo = worldGlobeInfo.contains(event.target);
        const isClickInsideTimeline = timelineSection.contains(event.target);

        // Close if click is outside both areas
        if (!isClickInsideInfo && !isClickInsideTimeline) {
          setSelectedLocationData(null);
        }
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('touchstart', handleClickAway);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('touchstart', handleClickAway);
    };
  }, [selectedLocationData]);

  return (
    <section id="portfolio" className="section section-alt">
      <div className="container">
        <h2 className="section-title">PORTFOLIO</h2>
        <div className="portfolio-globe-section">
          <div className="portfolio-globe">
            <React.Suspense
              fallback={
                <div className="globe-loading-fallback">
                  <div className="loading-spinner"></div>
                  <p>Loading interactive globe...</p>
                </div>
              }
            >
              <WorldGlobe
                enableRotation={true}
                enableZoom={false}
                enableScrollRotation={true}
                locations={careerLocations}
                colors={{
                  white: {
                    land: 0xffffff,
                    border: 0x000000,
                    dot: 0xff0000,
                    background: 0x000000,
                  },
                  black: {
                    land: 0x000000,
                    border: 0xffffff,
                    dot: 0xff0000,
                    background: 0x000000,
                  },
                }}
              />
            </React.Suspense>
            {/* Timeline-controlled info display */}
            {selectedYear && selectedLocationData ? (
              <div className="world-globe-info">
                <div className="info-header">
                  <button
                    onClick={() => {
                      setSelectedYear(null);
                      setSelectedLocationData(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#666',
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="info-content">
                  <div className="info-meta">
                    <span className="meta-label">Company:</span>
                    <span className="meta-value">{selectedLocationData.company}</span>
                  </div>
                  <div className="info-meta">
                    <span className="meta-label">Role:</span>
                    <span className="meta-value">{selectedLocationData.role}</span>
                  </div>
                  <div className="info-meta">
                    <span className="meta-label">Period:</span>
                    <span className="meta-value">{selectedLocationData.period}</span>
                  </div>
                  <div className="info-meta">
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{selectedLocationData.city}</span>
                  </div>

                  {selectedLocationData.desc && (
                    <div className="info-description">
                      <p>{selectedLocationData.desc}</p>
                    </div>
                  )}

                  {selectedLocationData.technologies && (
                    <div className="info-technologies">
                      <h4>Technologies:</h4>
                      <div className="tech-tags">
                        {selectedLocationData.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLocationData.patents && (
                    <div className="info-meta">
                      <span className="meta-label">Patents:</span>
                      <span className="meta-value">{selectedLocationData.patents}</span>
                    </div>
                  )}

                  {selectedLocationData.certification && (
                    <div className="info-meta">
                      <span className="meta-label">Certification:</span>
                      <span className="meta-value">{selectedLocationData.certification}</span>
                    </div>
                  )}

                  {selectedLocationData.whitepapers && (
                    <div className="info-meta">
                      <span className="meta-label">Whitepapers:</span>
                      <span className="meta-value">{selectedLocationData.whitepapers}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Timeline Section - overlay within portfolio section */}
          <div className="portfolio-timeline-section">
            <Timeline onYearChange={handleTimelineChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Portfolio = React.memo(PortfolioComponent);
