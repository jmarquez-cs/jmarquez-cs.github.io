import React from 'react';
import { useConfetti } from '../../hooks/useConfetti';
import './Portfolio.css';

export const Portfolio = () => {
  const { triggerConfetti } = useConfetti();

  const projects = [
    {
      title: '🏢 Distributed Ledger Workforce Data - Fathom PBC',
      description:
        'Led adoption of distributed ledger technologies to address data bottlenecks in public workforce system. Participated in Techstars Workforce Development Accelerator (2024).',
      tags: ['Distributed Ledger', 'Workforce Data', 'Techstars', 'NSF I-Corps'],
      gradient: 'lime-guava',
    },
    {
      title: '🌍 Tolan Earth - Carbon Assets Platform',
      description:
        'Contributed to Hedera-based digital marketplace for carbon assets under a $2B HBAR Foundation grant at Object Computing, integrating AI/ML with OpenSearch and Google Cloud Pub/Sub.',
      tags: ['Hedera', 'Climate Tech', 'Go', 'AI/ML'],
      gradient: 'grape-lime',
    },
    {
      title: '🎥 U42 Creator Platform - You42',
      description:
        'Led development of platform for content creators to share videos across social media, featuring U42 Token integration for advertising purchases, built on AWS with CI/CD pipelines.',
      tags: ['AWS', 'CI/CD', 'Content Platform', 'Token Integration'],
      gradient: 'guava-mandarin',
    },
    {
      title: '🛒 Walmart Self-Checkout Blockchain - NCR/Cryptstax',
      description:
        "Subcontracted for 6 months to research and develop Walmart's Self-Checkout system using blockchain technology through NCR Global partnership.",
      tags: ['Blockchain', 'Retail Tech', 'NCR', 'Walmart'],
      gradient: 'mandarin-mint',
    },
    {
      title: '₿ Bitcoin Payment Processing - Privi Protocol',
      description:
        'Subcontracted for 3 months to support Bitcoin payment processing infrastructure for blockchain startup, enabling seamless cryptocurrency transactions.',
      tags: ['Bitcoin', 'Payment Processing', 'Cryptocurrency', 'Privi'],
      gradient: 'mint-grape',
    },
    {
      title: '🔗 Blockchain Supply Chain - Blocnets',
      description:
        'Developed blockchain-based supply chain application interfacing with SAP, securing $1.8M in seed funding and a provisional patent. Collaborated with IBM, HP, and Oracle.',
      tags: ['Blockchain', 'SAP', 'Supply Chain', 'Patent'],
      gradient: 'grape-lime',
    },
  ];

  const handleProjectClick = () => {
    triggerConfetti();
  };

  return (
    <section id="portfolio" className="section section-alt">
      <div className="container">
        <h2 className="section-title">PORTFOLIO</h2>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-card ${project.gradient}`}
              onClick={handleProjectClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectClick();
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={`View ${project.title} project details`}
            >
              <div className="project-image">
                <span>{project.title}</span>
              </div>
              <div className="project-content">
                <h3>{project.title.replace(/^[🔗🌍🏢🎥🛒₿]\s/, '')}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
