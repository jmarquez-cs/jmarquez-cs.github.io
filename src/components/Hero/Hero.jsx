import React, { useCallback, useRef, useEffect, useState } from 'react';

import TechnologyIcon from '../TechnologyIcon';
import { WaveBackground } from '../WaveBackground';
import './Hero.css';

const HeroComponent = () => {
  const heroRenderCount = useRef(0);
  const heroSectionRef = useRef(null);
  const [dynamicHeight, setDynamicHeight] = useState('100vh');
  const swimlaneRef = useRef(null);

  // Technology swimlane carousel - horizontal scrolling showcase
  const technologySwimlane = [
    // Core Frontend
    { id: 1, size: 36, tier: 'primary' }, // React
    { id: 25, size: 32, tier: 'primary' }, // JavaScript

    // Backend Systems
    { id: 2, size: 34, tier: 'primary' }, // NodeJS
    { id: 11, size: 30, tier: 'primary' }, // Python
    { id: 18, size: 28, tier: 'secondary' }, // Go

    // Cloud & DevOps
    { id: 8, size: 32, tier: 'primary' }, // AWS
    { id: 9, size: 28, tier: 'secondary' }, // GCP
    { id: 4, size: 30, tier: 'primary' }, // Docker
    { id: 6, size: 28, tier: 'secondary' }, // Kubernetes

    // Database & Storage
    { id: 27, size: 26, tier: 'secondary' }, // PostgreSQL
    { id: 3, size: 24, tier: 'secondary' }, // MongoDB

    // Blockchain & Security
    { id: 12, size: 26, tier: 'accent' }, // Blockchain
    { id: 14, size: 24, tier: 'accent' }, // Security
    { id: 31, size: 22, tier: 'accent' }, // Ethereum

    // Infrastructure & Tools
    { id: 21, size: 22, tier: 'ambient' }, // Express
    { id: 29, size: 20, tier: 'ambient' }, // Nginx
    { id: 35, size: 20, tier: 'ambient' }, // Git
    { id: 10, size: 18, tier: 'discovery' }, // Prometheus
  ];

  // Dynamic height calculation based on footer height
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const footer = document.querySelector('.footer');
      const navigation = document.querySelector('.navigation');

      if (footer && navigation) {
        const footerHeight = footer.offsetHeight;
        const navHeight = navigation.offsetHeight;

        // Calculate the ideal height: full viewport minus footer height
        const calculatedHeight = `calc(100vh - ${footerHeight}px)`;

        setDynamicHeight(calculatedHeight);

        // Apply the height via CSS custom property and direct style
        document.documentElement.style.setProperty('--hero-dynamic-height', calculatedHeight);

        if (heroSectionRef.current) {
          heroSectionRef.current.style.minHeight = calculatedHeight;
        }

        console.log(
          `[Hero] Dynamic height calculated: ${calculatedHeight} (Footer: ${footerHeight}px, Nav: ${navHeight}px)`,
        );
      }
    };

    // Calculate on mount
    calculateDynamicHeight();

    // Recalculate on window resize
    const handleResize = () => {
      requestAnimationFrame(calculateDynamicHeight);
    };

    window.addEventListener('resize', handleResize);

    // Use ResizeObserver for more precise footer height changes
    let footerObserver;
    const footer = document.querySelector('.footer');
    if (footer && 'ResizeObserver' in window) {
      footerObserver = new ResizeObserver(() => {
        requestAnimationFrame(calculateDynamicHeight);
      });
      footerObserver.observe(footer);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (footerObserver) {
        footerObserver.disconnect();
      }
    };
  }, []);

  // Dynamic fade effect based on icon position
  useEffect(() => {
    const updateIconFadeEffects = () => {
      if (!swimlaneRef.current) return;

      const swimlaneRect = swimlaneRef.current.getBoundingClientRect();
      const fadeZoneWidth = 400; // Match CSS variable
      const icons = swimlaneRef.current.querySelectorAll('.tech-swimlane-icon');

      icons.forEach((icon) => {
        const iconRect = icon.getBoundingClientRect();
        const iconCenter = iconRect.left + iconRect.width / 2;
        const swimlaneLeft = swimlaneRect.left;
        const swimlaneRight = swimlaneRect.right;

        let opacity = 1;

        // Calculate fade on left side
        if (iconCenter < swimlaneLeft + fadeZoneWidth) {
          const distanceFromLeft = iconCenter - swimlaneLeft;
          opacity = Math.max(0, Math.min(1, distanceFromLeft / fadeZoneWidth));
        }
        // Calculate fade on right side
        else if (iconCenter > swimlaneRight - fadeZoneWidth) {
          const distanceFromRight = swimlaneRight - iconCenter;
          opacity = Math.max(0, Math.min(1, distanceFromRight / fadeZoneWidth));
        }

        icon.style.opacity = opacity;
      });
    };

    // Update fade effects on animation frame
    const rafId = requestAnimationFrame(function updateLoop() {
      updateIconFadeEffects();
      requestAnimationFrame(updateLoop);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Track Hero renders for debugging (throttled logging)
  heroRenderCount.current++;
  if (heroRenderCount.current % 100 === 0 && process.env.NODE_ENV === 'development') {
    console.log('[Hero] Render count:', heroRenderCount.current);
  }

  return (
    <section id="hero" className="hero" ref={heroSectionRef} style={{ minHeight: dynamicHeight }}>
      {/* WaveBackground nested directly in Hero for desired positioning */}
      <div className="hero-wave-background">
        <WaveBackground />
      </div>

      {/* Technology swimlane - horizontal scrolling carousel above content */}
      <div className="hero-tech-swimlane" ref={swimlaneRef}>
        <div className="tech-swimlane-track">
          {/* First set of icons */}
          {technologySwimlane.map((tech, index) => (
            <div key={`tech-${tech.id}-1`} className="tech-swimlane-icon" data-tier={tech.tier}>
              <TechnologyIcon
                technologyId={tech.id}
                size={tech.size}
                animated={false}
                glowing={tech.tier === 'primary'}
                showTooltip={true}
              />
            </div>
          ))}
          {/* Second set for seamless loop */}
          {technologySwimlane.map((tech, index) => (
            <div key={`tech-${tech.id}-2`} className="tech-swimlane-icon" data-tier={tech.tier}>
              <TechnologyIcon
                technologyId={tech.id}
                size={tech.size}
                animated={false}
                glowing={tech.tier === 'primary'}
                showTooltip={true}
              />
            </div>
          ))}
          {/* Third set for ultra-smooth infinite scroll */}
          {technologySwimlane.map((tech, index) => (
            <div key={`tech-${tech.id}-3`} className="tech-swimlane-icon" data-tier={tech.tier}>
              <TechnologyIcon
                technologyId={tech.id}
                size={tech.size}
                animated={false}
                glowing={tech.tier === 'primary'}
                showTooltip={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content layer */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            FRACTIONAL <span className="highlight">CTO</span>
          </h1>
          <h2 className="hero-subtitle">DevSecOps & Blockchain Expert</h2>
          <p className="hero-description">
            I scale emerging technology and secure cloud infrastructure.
          </p>
        </div>
      </div>

      {/* Parallax performance logging removed to prevent re-render issues */}
    </section>
  );
};

HeroComponent.displayName = 'Hero';
export const Hero = React.memo(HeroComponent);
