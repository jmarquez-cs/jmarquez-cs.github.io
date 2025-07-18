import React, { useCallback } from 'react';
import { useConfetti } from '../../hooks/useConfetti';
import './Contact.css';

const ContactComponent = () => {
  const { triggerConfetti } = useConfetti();

  const colorFlowCards = [
    { name: 'Mint', icon: '🌿', class: 'mint-flow' },
    { name: 'Grape', icon: '🍇', class: 'grape-flow' },
    { name: 'Lime', icon: '🍃', class: 'lime-flow' },
    { name: 'Pears', icon: '🍐', class: 'pears-flow' },
    { name: 'Guava', icon: '🥭', class: 'guava-flow' },
    { name: 'Mandarin', icon: '🍊', class: 'mandarin-flow' },
  ];

  const handleCardClick = useCallback(
    async (event) => {
      const card = event.currentTarget;

      // Optimistic feedback - immediate pulse effect
      card.style.transform = 'scale(1.05)';
      card.style.transition = 'transform 0.15s ease';

      try {
        await triggerConfetti(card);

        // Success feedback
        card.style.transform = '';
        card.style.backgroundColor = 'var(--success-color, #8cf28a)';

        setTimeout(() => {
          card.style.backgroundColor = '';
        }, 400);
      } catch (error) {
        // Error feedback
        console.error('Confetti trigger failed:', error);
        card.style.transform = '';
        card.style.backgroundColor = 'var(--error-color, #ff6b6b)';

        setTimeout(() => {
          card.style.backgroundColor = '';
        }, 600);
      }
    },
    [triggerConfetti],
  );

  const handleContactClick = useCallback(
    async (contactMethod, event) => {
      const contactCard = event.currentTarget;

      // Optimistic feedback - immediate pulse effect
      contactCard.style.transform = 'scale(1.02)';
      contactCard.style.transition = 'transform 0.15s ease';

      try {
        await triggerConfetti(contactCard);
        console.log(`Contact method clicked: ${contactMethod}`);

        // Success feedback
        contactCard.style.transform = '';
        contactCard.style.backgroundColor = 'var(--success-color, #8cf28a)';

        setTimeout(() => {
          contactCard.style.backgroundColor = '';
        }, 400);
      } catch (error) {
        // Error feedback
        console.error('Contact interaction failed:', error);
        contactCard.style.transform = '';
        contactCard.style.backgroundColor = 'var(--error-color, #ff6b6b)';

        setTimeout(() => {
          contactCard.style.backgroundColor = '';
        }, 600);
      }
    },
    [triggerConfetti],
  );

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">CONTACT</h2>
        <div className="contact-content">
          <div className="contact-text">
            <p>
              Ready to transform your startup&apos;s technology infrastructure? Let&apos;s discuss
              how I can help scale your vision securely and efficiently.
            </p>
            <div className="contact-links">
              <a
                href="https://www.linkedin.com/in/jmarquez-cs"
                className="contact-link"
                onClick={(e) => handleContactClick('linkedin', e)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile (opens in new tab)"
              >
                <span aria-hidden="true">💼</span> LinkedIn
              </a>
              <a
                href="https://github.com/jmarquez-cs"
                className="contact-link"
                onClick={(e) => handleContactClick('github', e)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub profile (opens in new tab)"
              >
                <span aria-hidden="true">⚡</span> GitHub
              </a>
            </div>
          </div>
          <div className="creative-visual">
            <div className="palette-showcase">
              <h3>Color Palette</h3>
              <p>
                A vibrant palette representing energy, growth, and innovation through carefully
                balanced hues.
              </p>
            </div>
            <div
              className="color-flow"
              role="group"
              aria-label="Interactive color palette showcase"
            >
              {colorFlowCards.map((card, index) => (
                <button
                  key={index}
                  className={`flow-card ${card.class}`}
                  onClick={handleCardClick}
                  aria-label={`${card.name} color - click to trigger confetti effect`}
                  type="button"
                >
                  <span className="flow-icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <span>{card.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact = React.memo(ContactComponent);
Contact.displayName = 'Contact';
