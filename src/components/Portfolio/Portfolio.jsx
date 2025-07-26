import React, { useState, useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { WorldGlobe } from '../WorldGlobe';
import { Timeline } from '../Timeline';
import LocationInfoCard from '../LocationInfoCard';
import { careerLocations } from '../../data/worldGlobeData';
import './Portfolio.css';

const PortfolioComponent = () => {
  usePerformanceMonitor();

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedLocationData, setSelectedLocationData] = useState(null);

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
            <LocationInfoCard
              locationData={selectedLocationData ? { location: selectedLocationData } : null}
              onClose={() => {
                setSelectedYear(null);
                setSelectedLocationData(null);
              }}
            />
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
