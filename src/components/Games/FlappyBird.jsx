import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Preload kaplay chunks when component becomes visible
const preloadKaplayChunks = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      import('kaplay').catch(() => {});
    });
  }
};

// Enhanced lazy loading with intelligent chunking
const loadKaplay = async () => {
  try {
    const kaplayModule = await import('kaplay');
    return kaplayModule.default;
  } catch (error) {
    console.error('Failed to load Kaplay:', error);
    throw error;
  }
};

export const FlappyBird = ({ onClose }) => {
  const gameContainerRef = useRef(null);
  const kaplayInstanceRef = useRef(null);
  const intersectionRef = useRef(null);
  const [isKaplayInitialized, setIsKaplayInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);

  console.log('FlappyBird: Component Render');

  // Intersection Observer for intelligent preloading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            preloadKaplayChunks();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced kaplay initialization with progress tracking
  const initializeKaplay = useCallback(async () => {
    const container = gameContainerRef.current;
    console.log('FlappyBird: useEffect setup - container ref:', container);

    if (!container || isKaplayInitialized) {
      console.log('FlappyBird: Container not available or kaplay already initialized, returning.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(10);

      console.log('FlappyBird: Loading kaplay...');
      const kaplay = await loadKaplay();
      setLoadingProgress(40);

      console.log('FlappyBird: Initializing kaplay...');
      const k = kaplay({
        canvas: document.createElement('canvas'),
        width: container.clientWidth || 800,
        height: container.clientHeight || 600,
      });
      setLoadingProgress(70);

      kaplayInstanceRef.current = k;
      setIsKaplayInitialized(true);
      console.log('FlappyBird: kaplay initialized, instance:', k);

      // Append the kaplay canvas to the ref's current element
      if (container.children.length === 0 || container.children[0] !== k.canvas) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(k.canvas);
        console.log('FlappyBird: Appended kaplay canvas to container');
      }
      setLoadingProgress(90);

      // Function to resize kaplay canvas
      const resizeKaplay = () => {
        if (!k.canvas || k.canvas.offsetWidth === 0 || k.canvas.offsetHeight === 0) {
          console.log('FlappyBird: Kaplay canvas not ready for resize, skipping.', k.canvas);
          return;
        }
        const { clientWidth, clientHeight } = container;
        console.log(`FlappyBird: Resizing kaplay to ${clientWidth}x${clientHeight}`);
        k.resize(clientWidth, clientHeight);
      };

      // Initial resize and setup resize observer
      let animationFrameId = requestAnimationFrame(resizeKaplay);
      const resizeObserver = new ResizeObserver(() => {
        animationFrameId = requestAnimationFrame(resizeKaplay);
      });
      resizeObserver.observe(container);

      setLoadingProgress(100);
      setIsLoading(false);

      // Cleanup function
      return () => {
        console.log('FlappyBird: kaplay setup cleanup');
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId);

        if (kaplayInstanceRef.current && typeof kaplayInstanceRef.current.destroy === 'function') {
          console.log('FlappyBird: Calling destroy() on kaplay instance');
          kaplayInstanceRef.current.destroy();
          kaplayInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.error('Failed to initialize kaplay:', err);
      setError(err);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, [isKaplayInitialized]);

  useEffect(() => {
    let cleanup;
    initializeKaplay().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeKaplay]);

  // Game logic setup
  useEffect(() => {
    console.log('FlappyBird: useEffect for game logic running');
    const k = kaplayInstanceRef.current;
    if (!k || !isKaplayInitialized) {
      console.error('FlappyBird: kaplay instance not available for game logic');
      return;
    }

    try {
      // Game variables
      const JUMP_FORCE = 320;
      const PIPE_SPEED = 100;
      const PIPE_OPEN = 120;
      const BIRD_X = 80;

      // Game scene setup
      k.scene('game', () => {
        console.log('FlappyBird: Setting up game scene');
        k.add([k.rect(k.width, k.height), k.color(0.5, 0.7, 1)]); // Background

        const score = k.add([k.text(0), { value: 0, z: 100 }]);

        const bird = k.add([
          k.rect(30, 30),
          k.color(1, 1, 0), // Yellow bird
          k.pos(BIRD_X, 40),
          k.area(),
          k.body(),
        ]);

        bird.onUpdate(() => {
          if (bird.isFalling() && bird.pos.y >= k.height) {
            k.go('lose', score.value);
          }
        });

        bird.onCollide('pipe', () => {
          k.go('lose', score.value);
        });

        bird.onCollide('ground', () => {
          k.go('lose', score.value);
        });

        k.onClick(() => {
          bird.jump(JUMP_FORCE);
        });

        function producePipes() {
          const pipeY = k.rand(0, k.height - PIPE_OPEN);
          const pipeWidth = 50;

          k.add([
            k.rect(pipeWidth, pipeY + PIPE_OPEN / 2 + 80),
            k.color(0, 1, 0), // Green pipe
            k.pos(k.width, 0),
            k.area(),
            k.move(k.LEFT, PIPE_SPEED),
            'pipe',
            { passed: false },
          ]);

          k.add([
            k.rect(pipeWidth, k.height - (pipeY + PIPE_OPEN / 2 + 80) - PIPE_OPEN),
            k.color(0, 1, 0), // Green pipe
            k.pos(k.width, pipeY + PIPE_OPEN),
            k.area(),
            k.move(k.LEFT, PIPE_SPEED),
            'pipe',
          ]);
        }

        k.loop(1.5, () => {
          producePipes();
        });

        k.onUpdate('pipe', (p) => {
          if (p.pos.x + p.width < bird.pos.x && !p.passed) {
            score.value++;
            score.text = score.value;
            p.passed = true;
          }
        });

        k.add([
          k.rect(k.width, 50),
          k.color(0.6, 0.4, 0.2), // Brown ground
          k.pos(0, k.height - 50),
          k.area(),
          'ground',
        ]);
      });

      k.scene('lose', (score) => {
        console.log('FlappyBird: Setting up lose scene');
        k.add([k.text('Game Over!'), k.pos(k.width / 2, k.height / 2 - 50), k.origin('center')]);
        k.add([k.text(`Score: ${score}`), k.pos(k.width / 2, k.height / 2), k.origin('center')]);
        k.add([
          k.text('Click to Play Again'),
          k.pos(k.width / 2, k.height / 2 + 50),
          k.origin('center'),
        ]);

        k.onClick(() => k.go('game'));
      });

      k.go('game');
    } catch (err) {
      console.error('Error setting up game logic:', err);
      setError(err);
    }

    return () => {
      console.log('FlappyBird: game logic useEffect cleanup');
    };
  }, [isKaplayInitialized]);

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px',
          color: 'var(--text-error)',
        }}
      >
        <h3>Failed to load game</h3>
        <p>{error.message}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(false);
          }}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            background: 'var(--text-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            border: '6px solid var(--bg-secondary)',
            borderTop: '6px solid var(--text-accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <div
          style={{
            width: '200px',
            height: '8px',
            background: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--text-accent), var(--mint-800))',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          ></div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Loading game... {loadingProgress}%
        </p>
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        gameContainerRef.current = el;
        intersectionRef.current = el;
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

FlappyBird.displayName = 'FlappyBird';
FlappyBird.propTypes = {
  onClose: PropTypes.func.isRequired,
};
