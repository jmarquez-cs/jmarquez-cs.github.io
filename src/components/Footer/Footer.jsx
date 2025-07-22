import React, { useCallback } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { useConfetti } from '../../hooks/useConfetti';
import './Footer.css';

const FooterComponent = () => {
  const { triggerConfetti } = useConfetti();

  const handleContactClick = useCallback(
    async (contactMethod, event) => {
      const contactCard = event.currentTarget;

      // Enhanced optimistic feedback with scale and glow
      contactCard.style.transform = 'translateY(-2px) scale(1.05)';
      contactCard.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      contactCard.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.25)';

      try {
        await triggerConfetti(contactCard);
        console.log(`Contact method clicked: ${contactMethod}`);

        // Success feedback with gradient pulse
        contactCard.style.transform = 'translateY(-2px) scale(1.02)';
        contactCard.style.background =
          'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)';
        contactCard.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        contactCard.style.color = 'var(--success-color, #059669)';

        // Reset after animation
        setTimeout(() => {
          contactCard.style.transform = '';
          contactCard.style.background = '';
          contactCard.style.borderColor = '';
          contactCard.style.color = '';
          contactCard.style.boxShadow = '';
        }, 600);
      } catch (error) {
        // Enhanced error feedback
        console.error('Contact interaction failed:', error);
        contactCard.style.transform = 'translateY(-1px) scale(1.01)';
        contactCard.style.background =
          'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)';
        contactCard.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        contactCard.style.color = 'var(--error-color, #dc2626)';

        // Reset after longer delay for error state
        setTimeout(() => {
          contactCard.style.transform = '';
          contactCard.style.background = '';
          contactCard.style.borderColor = '';
          contactCard.style.color = '';
          contactCard.style.boxShadow = '';
        }, 800);
      }
    },
    [triggerConfetti],
  );

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-sparkle" aria-hidden="true">
              ✨
            </span>
            <span className="footer-copyright">
              © 2025 John Marquez. Fractional CTO & Blockchain Expert.
            </span>
          </div>
          <div className="footer-links">
            <a
              href="https://www.linkedin.com/in/jmarquez-cs"
              className="footer-link linkedin"
              onClick={(e) => handleContactClick('linkedin', e)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile (opens in new tab)"
            >
              <FaLinkedin className="footer-icon" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/jmarquez-cs"
              className="footer-link github"
              onClick={(e) => handleContactClick('github', e)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile (opens in new tab)"
            >
              <FaGithub className="footer-icon" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
Footer.displayName = 'Footer';
