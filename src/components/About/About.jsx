import React from 'react';
import './About.css';
import { useGameVisibility } from '../../contexts/GameVisibilityContext';

export const About = () => {
  const { setShowGame } = useGameVisibility();

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

  const handleSkillClick = (skill) => {
    if (skill === 'Startups') {
      setShowGame(true);
    }
  };

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
          <div className="profile-image">
            <img
              src="https://avatars.githubusercontent.com/u/12912585?v=4"
              alt="John Marquez - Fractional CTO and Blockchain Expert"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
