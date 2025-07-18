import React, { useCallback, useRef, useEffect } from 'react';
import { useConfetti } from '../../hooks/useConfetti';
import { WaveBackground } from '../WaveBackground';
import './Hero.css';

const HeroComponent = () => {
  const { triggerConfetti } = useConfetti();
  const cardRefs = useRef({});
  const heroRenderCount = useRef(0);

  const handleCTAClick = useCallback(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  const scrollToContact = useCallback(() => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToPortfolio = useCallback(() => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCardClick = useCallback(
    (event, cardType) => {
      event.preventDefault();
      event.stopPropagation();

      const card = event.currentTarget;
      if (!card || !card.style) return;

      // Prevent multiple clicks during animation
      if (
        card.style.transform &&
        card.style.transform !== '' &&
        !card.style.transform.includes('scale(1)')
      ) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clickX = event.clientX;
      const clickY = event.clientY;

      // Calculate direction from click point to card center
      const deltaX = centerX - clickX;
      const deltaY = centerY - clickY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Normalize the direction (or use random direction if click is at center)
      const normalizedX = distance > 10 ? deltaX / distance : (Math.random() - 0.5) * 2;
      const normalizedY = distance > 10 ? deltaY / distance : (Math.random() - 0.5) * 2;

      // Create physics effect based on card type - crisp and fast
      const effects = {
        mint: {
          moveDistance: 90,
          rotation: 450,
          scale: 1.4,
          duration: 350,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        grape: {
          moveDistance: 70,
          rotation: -270,
          scale: 1.3,
          duration: 300,
          easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        lime: {
          moveDistance: 110,
          rotation: 540,
          scale: 1.5,
          duration: 400,
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
      };

      const effect = effects[cardType] || effects.mint;

      // Disable the floating animation temporarily
      card.style.animation = 'none';

      // Apply the physics animation
      card.style.transition = `transform ${effect.duration}ms ${effect.easing}`;
      card.style.transform = `
      translateX(${normalizedX * effect.moveDistance}px) 
      translateY(${normalizedY * effect.moveDistance}px) 
      rotate(${effect.rotation}deg) 
      scale(${effect.scale})
    `;

      // Reset after animation - much faster
      setTimeout(() => {
        if (card && card.style && card.parentNode) {
          card.style.transition = `transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
          card.style.transform = 'translateX(0) translateY(0) rotate(0deg) scale(1)';

          // Re-enable floating animation after reset
          setTimeout(() => {
            if (card && card.style && card.parentNode) {
              card.style.animation = '';
            }
          }, 200);
        }
      }, effect.duration);

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Trigger confetti for extra satisfaction
      triggerConfetti({
        particleCount: 30,
        angle: (Math.atan2(-normalizedY, -normalizedX) * 180) / Math.PI,
        spread: 60,
        origin: {
          x: clickX / window.innerWidth,
          y: clickY / window.innerHeight,
        },
        colors:
          cardType === 'mint' ? ['#97F0E5'] : cardType === 'grape' ? ['#C584F6'] : ['#8CF28A'],
      });
    },
    [triggerConfetti],
  );

  // Cleanup function for any pending timeouts
  useEffect(() => {
    const currentRefs = cardRefs.current;
    return () => {
      // Clear any pending animations on unmount
      Object.values(currentRefs).forEach((card) => {
        if (card && card.style) {
          card.style.animation = '';
          card.style.transform = '';
          card.style.transition = '';
        }
      });
    };
  }, []);

  // Track Hero renders to detect if it's causing WaveBackground issues
  heroRenderCount.current++;
  if (heroRenderCount.current % 100 === 0) {
    console.log('[Hero] Render count:', heroRenderCount.current);
  }

  return (
    <section id="hero" className="hero">
      {console.log('[Hero] About to render WaveBackground')}
      <WaveBackground />
      {console.log('[Hero] WaveBackground rendered')}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            FRACTIONAL <span className="highlight">CTO</span>
          </h1>
          <h2 className="hero-subtitle">DevSecOps & Blockchain Expert</h2>
          <p className="hero-description">
            I build scalable blockchain solutions and secure cloud infrastructures for startups.
            Specializing in Sui, Hedera, and enterprise-grade DevSecOps.
          </p>
          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleCTAClick();
                scrollToContact();
              }}
            >
              Let&apos;s Connect
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleCTAClick();
                scrollToPortfolio();
              }}
            >
              View Projects
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <button
            ref={(el) => (cardRefs.current.mint = el)}
            className="floating-card card-mint interactive-card"
            onClick={(e) => handleCardClick(e, 'mint')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(e, 'mint');
              }
            }}
          ></button>
          <button
            ref={(el) => (cardRefs.current.grape = el)}
            className="floating-card card-grape interactive-card"
            onClick={(e) => handleCardClick(e, 'grape')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(e, 'grape');
              }
            }}
          ></button>
          <button
            ref={(el) => (cardRefs.current.lime = el)}
            className="floating-card card-lime interactive-card easter-egg-card"
            onClick={(e) => handleCardClick(e, 'lime')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(e, 'lime');
              }
            }}
          ></button>
        </div>
      </div>
    </section>
  );
};

HeroComponent.displayName = 'Hero';
export const Hero = React.memo(HeroComponent);
