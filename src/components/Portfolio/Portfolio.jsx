import React from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { WorldGlobe } from '../WorldGlobe';
import { Timeline } from '../Timeline';
import { careerLocations } from '../../data/worldGlobeData';
import './Portfolio.css';

const PortfolioComponent = () => {
  usePerformanceMonitor('Portfolio');

  return (
    <section id="portfolio" className="section section-alt">
      <div className="container">
        <h2 className="section-title">PORTFOLIO</h2>

        {/* World Globe - completely independent layout */}
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
          </div>

          {/* Timeline Section - overlay within portfolio section */}
          <div className="portfolio-timeline-section">
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Portfolio = React.memo(PortfolioComponent);
