import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './GlitchText.css';

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const GlitchText = ({
  children,
  trigger = 'onMount',
  duration = 2000,
  charactersPerFrame = 1,
  className = '',
  style = {},
  preserveSpaces = true,
  ...props
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  const observerRef = useRef(null);

  const originalText = typeof children === 'string' ? children : children?.toString() || '';

  const startGlitchEffect = useCallback(() => {
    if (isAnimating || !originalText || displayText === originalText) return;

    setIsAnimating(true);
    const textLength = originalText.length;
    let currentFrame = 0;
    const totalFrames = Math.ceil(textLength / charactersPerFrame);
    const frameInterval = duration / totalFrames;

    const animate = () => {
      currentFrame++;
      const revealedChars = Math.min(currentFrame * charactersPerFrame, textLength);

      let newText = '';

      for (let i = 0; i < textLength; i++) {
        if (i < revealedChars) {
          // Character is revealed - show correct character
          newText += originalText[i];
        } else if (i < revealedChars + 3) {
          // Show glitch characters for next few positions to create typing effect
          if (originalText[i] === ' ' && preserveSpaces) {
            newText += ' ';
          } else {
            newText += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        } else {
          // Characters not yet reached - show spaces or original character based on preserveSpaces
          if (originalText[i] === ' ' && preserveSpaces) {
            newText += ' ';
          } else {
            newText += ' '; // Empty space for unreached characters
          }
        }
      }

      setDisplayText(newText);

      if (currentFrame < totalFrames) {
        animationRef.current = setTimeout(animate, frameInterval);
      } else {
        // Animation complete - set final text and stop
        setDisplayText(originalText);
        setIsAnimating(false);
      }
    };

    animate();
  }, [originalText, duration, charactersPerFrame, preserveSpaces, isAnimating, displayText]);

  // Handle different trigger types
  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(startGlitchEffect, 100);
      return () => clearTimeout(timer);
    }
  }, [trigger, startGlitchEffect]);

  useEffect(() => {
    if (trigger === 'onScroll' && elementRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isAnimating) {
            startGlitchEffect();
          }
        },
        { threshold: 0.1 },
      );

      observerRef.current.observe(elementRef.current);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [trigger, startGlitchEffect, isAnimating]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize display text
  useEffect(() => {
    if (!displayText && originalText) {
      if (trigger === 'onMount') {
        // Start with spaces/preserved characters only
        const initialText = originalText
          .split('')
          .map((char) => (char === ' ' && preserveSpaces ? ' ' : ' '))
          .join('');
        setDisplayText(initialText);
      } else {
        setDisplayText(originalText);
      }
    }
  }, [originalText, displayText, trigger, preserveSpaces]);

  return (
    <span ref={elementRef} className={className} style={style} {...props}>
      {displayText || originalText}
    </span>
  );
};

GlitchText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  trigger: PropTypes.oneOf(['onMount', 'onScroll', 'manual']),
  duration: PropTypes.number,
  charactersPerFrame: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  preserveSpaces: PropTypes.bool,
};

export default React.memo(GlitchText);
