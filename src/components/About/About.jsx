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
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">ABOUT</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              As a Fractional CTO and DevSecOps Engineer, I specialize in blockchain technologies,
              distributed ledger systems, and cloud infrastructure. I help startups and enterprises
              implement secure, scalable solutions using cutting-edge technologies.
            </p>
            <p>
              My expertise includes Hyperledger Indy, Hedera Hashgraph, Ethereum, and Lightning
              Network, combined with enterprise-grade DevSecOps practices using GCP, AWS, and modern
              CI/CD pipelines. I&apos;m fluent in both English and Spanish (native).
            </p>
            <p>
              I hold certifications in Cloud Digital Leader and Hyperledger blockchain development,
              with extensive experience at companies like Cryptstax, Fathom PBC, Object Computing,
              and leading blockchain initiatives that have secured millions in funding.
            </p>
            <div className="skills">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                  onClick={() => handleSkillClick(skill)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSkillClick(skill);
                    }
                  }}
                  role="button"
                  tabIndex={skill === 'Startups' ? 0 : -1} // Only make 'Startups' focusable
                  style={{ cursor: skill === 'Startups' ? 'pointer' : 'default' }}
                >
                  {skill}
                </span>
              ))}
            </div>
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
          </div>
        </div>
      </div>
      <MatrixRain
        isActive={showMatrixRain}
        onComplete={handleMatrixComplete}
        targetElement={imageRef.current}
      />
    </section>
  );
};

export const About = React.memo(AboutComponent);
