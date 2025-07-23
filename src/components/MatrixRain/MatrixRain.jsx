import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './MatrixRain.css';

const MatrixRainComponent = ({ isActive, onComplete, targetElement }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dropsRef = useRef([]);

  const startMatrixEffect = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !targetElement || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use offsetWidth/Height for more accurate sizing within the container
    const width = targetElement.offsetWidth;
    const height = targetElement.offsetHeight;
    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;

    // Matrix characters (including Japanese katakana)
    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890123456789';
    const charArray = chars.split('');

    const fontSize = 5;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    dropsRef.current = drops;

    let startTime = Date.now();
    const duration = 5000; // 5 seconds

    const animate = () => {
      if (!canvas || !ctx || !isActive) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fade out background
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + progress * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green color with fade
      const alpha = Math.max(0, 1 - progress);
      ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top when it goes off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Effect complete
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        onComplete();
      }
    };

    animate();
  }, [isActive, onComplete, targetElement]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && isActive && targetElement) {
      const width = targetElement.offsetWidth;
      const height = targetElement.offsetHeight;
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }, [isActive, targetElement]);

  useEffect(() => {
    if (isActive && targetElement) {
      startMatrixEffect();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, startMatrixEffect, targetElement]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  if (!isActive || !targetElement) return null;

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        background: 'transparent',
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    />
  );
};

MatrixRainComponent.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
  targetElement: PropTypes.object,
};

MatrixRainComponent.displayName = 'MatrixRain';

export default React.memo(MatrixRainComponent);
