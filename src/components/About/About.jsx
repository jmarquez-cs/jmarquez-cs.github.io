import React, { useCallback, useState, useRef } from 'react';
import './About.css';
import { useGameVisibility } from '../../contexts/GameVisibilityContext';
import { MatrixRain } from '../MatrixRain';

const AboutComponent = () => {
  const { setShowGame } = useGameVisibility();
  const [showMatrixRain, setShowMatrixRain] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const aboutRef = useRef(null);

  const skills = [
    'Linux System Administration',
    'Google Cloud Platform',
    'Startups',
    'Blockchain Technologies',
    'Hyperledger Indy',
    'Hedera',
    'Ethereum',
    'DevSecOps',
    'CI/CD',
    'Terraform',
    'Docker',
    'Go',
    'TypeScript',
    'JavaScript',
    'AWS',
    'GitHub',
  ];

  const handleSkillClick = useCallback(
    (skill) => {
      if (skill === 'Startups') {
        setShowGame(true);
      }
    },
    [setShowGame],
  );

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging) return;

      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Trigger matrix effect if dragged more than 50 pixels
      if (distance > 50 && !showMatrixRain) {
        setShowMatrixRain(true);
        setIsDragging(false);
      }
    },
    [isDragging, showMatrixRain],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMatrixComplete = useCallback(() => {
    setShowMatrixRain(false);
  }, []);

  return (
    <section id="about" className="section" ref={aboutRef}>
      <div className="container">
        <h2 className="section-title">ABOUT</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              As a Fractional CTO, I help startups and small business enterprises implement secure,
              scalable solutions using cutting-edge technologies.
            </p>
            <p>
              My experience allows me to build and scale a product from 0 to 1 with with development
              pipelines, security, and standard operating procedures.
            </p>
          </div>
          <div className="profile-image" style={{ position: 'relative' }}>
            <button
              ref={imageRef}
              className={`profile-image-button ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
              aria-label="Drag to activate matrix effect"
            >
              <img
                src="https://avatars.githubusercontent.com/u/12912585?v=4"
                alt="John Marquez - Fractional CTO and Blockchain Expert"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
              />
            </button>
            <MatrixRain
              isActive={showMatrixRain}
              onComplete={handleMatrixComplete}
              targetElement={imageRef.current}
            />
          </div>
        </div>

        {/* Skills Swimlane */}
        <div className="skills-swimlane">
          <div className="skills-track">
            {/* First set of skills */}
            {skills.map((skill, index) => (
              <span
                key={`skill-${index}-1`}
                className="skill-tag"
                onClick={() => handleSkillClick(skill)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSkillClick(skill);
                  }
                }}
                role="button"
                tabIndex={skill === 'Startups' ? 0 : -1}
                style={{ cursor: skill === 'Startups' ? 'pointer' : 'default' }}
              >
                {skill}
              </span>
            ))}
            {/* Second set for seamless loop */}
            {skills.map((skill, index) => (
              <span
                key={`skill-${index}-2`}
                className="skill-tag"
                onClick={() => handleSkillClick(skill)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSkillClick(skill);
                  }
                }}
                role="button"
                tabIndex={-1}
                style={{ cursor: skill === 'Startups' ? 'pointer' : 'default' }}
              >
                {skill}
              </span>
            ))}
            {/* Third set for ultra-smooth scroll */}
            {skills.map((skill, index) => (
              <span
                key={`skill-${index}-3`}
                className="skill-tag"
                onClick={() => handleSkillClick(skill)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSkillClick(skill);
                  }
                }}
                role="button"
                tabIndex={-1}
                style={{ cursor: skill === 'Startups' ? 'pointer' : 'default' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const About = React.memo(AboutComponent);
