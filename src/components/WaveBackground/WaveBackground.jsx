import React, { useEffect, useRef, useCallback } from 'react';
import './WaveBackground.css';

const WaveBackgroundComponent = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);
  const lastLogTimeRef = useRef(Date.now());

  // Stable resize handler - memoized once
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = 300;
  }, []);

  // Main animation function - memoized with stable dependencies
  const drawSineWaves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Track animation health
    frameCountRef.current++;
    const now = Date.now();
    if (now - lastLogTimeRef.current > 5000) {
      const fps = (frameCountRef.current / (now - lastLogTimeRef.current)) * 1000;
      console.log(
        `[WaveBackground] Animation health: ${fps.toFixed(1)} fps, ${frameCountRef.current} frames`,
      );
      frameCountRef.current = 0;
      lastLogTimeRef.current = now;
    }

    // Sine wave parameters - exactly like original
    const amplitude = 40;
    const frequency = 0.01;
    const waveCount = 5;
    const waveSpacing = 20;
    const phaseDelay = 0.4;
    const verticalAmplitude = 40;
    const verticalFrequency = 0.6;
    const rippleAmplitude = 12;
    const rippleFrequency = 0.03;
    const waveCenter = canvas.height * 0.7;

    // Boat parameters - exactly like original
    const boatX = canvas.width / 2;
    const boatEmoji = '⛵';
    const boatSize = 24;
    const fadeRange = 20;

    // Create gradient - exactly like original
    const waveGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    waveGradient.addColorStop(0, 'rgba(0, 100, 200, 0.7)');
    waveGradient.addColorStop(1, 'rgba(0, 200, 150, 0.7)');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = performance.now() / 1000;

    // Store points and y-positions for all waves - exactly like original
    const wavePoints = Array(waveCount)
      .fill()
      .map(() => []);
    const yAtBoatX = [];

    // Calculate points for each wave - exactly like original
    for (let i = 0; i < waveCount; i++) {
      const verticalOffset =
        verticalAmplitude * Math.sin(time * verticalFrequency - i * phaseDelay * 1.2);
      for (let x = 0; x < canvas.width; x += 0.5) {
        const y =
          waveCenter +
          amplitude * Math.sin(frequency * x + time - i * phaseDelay) +
          rippleAmplitude * Math.sin(rippleFrequency * x + time * 1.5 - i * phaseDelay) +
          verticalOffset +
          i * waveSpacing -
          ((waveCount - 1) * waveSpacing) / 2;
        wavePoints[i].push({ x, y });
        if (Math.abs(x - boatX) < 0.5) {
          yAtBoatX[i] = y;
        }
      }
    }

    // Draw water effect below the lowest wave - exactly like original
    ctx.save();
    ctx.fillStyle = waveGradient;
    ctx.filter = 'blur(3px)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (const point of wavePoints[waveCount - 1]) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();
    ctx.restore();

    // Draw gradient between waves - exactly like original
    ctx.save();
    ctx.fillStyle = waveGradient;
    for (let i = 0; i < waveCount - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(wavePoints[i][0].x, wavePoints[i][0].y);
      for (let j = 0; j < wavePoints[i].length; j++) {
        ctx.lineTo(wavePoints[i][j].x, wavePoints[i][j].y);
      }
      for (let j = wavePoints[i + 1].length - 1; j >= 0; j--) {
        ctx.lineTo(wavePoints[i + 1][j].x, wavePoints[i + 1][j].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Draw inner waves (indices 1 to 4) - exactly like original
    for (let i = 1; i < waveCount; i++) {
      ctx.beginPath();
      ctx.strokeStyle = waveGradient;
      ctx.lineWidth = 2;
      for (let j = 0; j < wavePoints[i].length; j++) {
        if (j === 0) {
          ctx.moveTo(wavePoints[i][j].x, wavePoints[i][j].y);
        } else {
          ctx.lineTo(wavePoints[i][j].x, wavePoints[i][j].y);
        }
      }
      ctx.stroke();
    }

    // Draw outermost wave with fading near overlaps - exactly like original
    ctx.save();
    ctx.strokeStyle = waveGradient;
    ctx.lineWidth = 2;
    let isDrawing = false;
    ctx.beginPath();
    for (let j = 0; j < wavePoints[0].length; j++) {
      const x = wavePoints[0][j].x;
      const y0 = wavePoints[0][j].y;
      let minOtherY = Math.min(...wavePoints.slice(1).map((points) => points[j].y));
      let opacity = 1;
      if (y0 > minOtherY) {
        opacity = Math.max(0, 1 - (y0 - minOtherY) / fadeRange);
      }
      if (opacity > 0) {
        ctx.globalAlpha = opacity;
        if (!isDrawing) {
          ctx.moveTo(x, y0);
          isDrawing = true;
        } else {
          ctx.lineTo(x, y0);
        }
      } else {
        if (isDrawing) {
          ctx.stroke();
          ctx.beginPath();
          isDrawing = false;
        }
      }
    }
    if (isDrawing) {
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Draw boat with fading and rotation - exactly like original
    const minOtherY = Math.min(...yAtBoatX.slice(1));
    const boatY = yAtBoatX[0];
    let boatOpacity = 1;
    if (boatY > minOtherY) {
      boatOpacity = Math.max(0, 1 - (boatY - minOtherY) / fadeRange);
    }
    if (boatOpacity > 0) {
      ctx.save();
      ctx.font = `${boatSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = boatOpacity;

      // Calculate boat angle - exactly like original
      const dx = 0.5;
      const y1 =
        waveCenter +
        amplitude * Math.sin(frequency * (boatX - dx) + time) +
        rippleAmplitude * Math.sin(rippleFrequency * (boatX - dx) + time * 1.5) +
        verticalAmplitude * Math.sin(time * verticalFrequency) -
        ((waveCount - 1) * waveSpacing) / 2;
      const y2 =
        waveCenter +
        amplitude * Math.sin(frequency * (boatX + dx) + time) +
        rippleAmplitude * Math.sin(rippleFrequency * (boatX + dx) + time * 1.5) +
        verticalAmplitude * Math.sin(time * verticalFrequency) -
        ((waveCount - 1) * waveSpacing) / 2;
      const slope = (y2 - y1) / (2 * dx);
      const angle = Math.atan(slope);

      // Draw boat with rotation - exactly like original
      ctx.translate(boatX, boatY);
      ctx.rotate(angle);
      ctx.fillText(boatEmoji, 0, 0);
      ctx.restore();
    }

    // Continue animation loop - exactly like original
    animationRef.current = requestAnimationFrame(drawSineWaves);
  }, []); // Empty deps - all values are defined inside the function

  useEffect(() => {
    console.log('[WaveBackground] useEffect starting');
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas size - exactly like original
    canvas.width = window.innerWidth;
    canvas.height = 300;

    // Reset frame tracking
    frameCountRef.current = 0;
    lastLogTimeRef.current = Date.now();

    // Start animation - exactly like original
    drawSineWaves();

    // Handle window resize - exactly like original
    window.addEventListener('resize', handleResize);

    return () => {
      console.log('[WaveBackground] Cleanup');
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [drawSineWaves, handleResize]); // Stable dependencies only

  return <canvas ref={canvasRef} className="wave-background" />;
};

WaveBackgroundComponent.displayName = 'WaveBackground';
export const WaveBackground = React.memo(WaveBackgroundComponent);
