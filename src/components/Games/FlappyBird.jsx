import React, { useEffect, useRef, useState } from 'react';
import kaplay from 'kaplay'; // Re-import kaplay

const FlappyBird = () => {
  const gameContainerRef = useRef(null);
  const kaplayInstanceRef = useRef(null); // Re-introduce kaplayInstanceRef
  const [isKaplayInitialized, setIsKaplayInitialized] = useState(false); // Track initialization

  console.log('FlappyBird: Component Render');

  // useEffect for kaplay initialization, canvas appending, and resize logic
  useEffect(() => {
    console.log('FlappyBird: useEffect for kaplay setup running');
    const container = gameContainerRef.current;
    console.log('FlappyBird: useEffect setup - container ref:', container);

    // Only proceed if container is available and kaplay hasn't been initialized yet
    if (!container || isKaplayInitialized) {
      console.log('FlappyBird: Container not available or kaplay already initialized, returning.');
      return;
    }

    let k;

    // Initialize Kaplay
    console.log('FlappyBird: Initializing kaplay...');
    k = kaplay({
      canvas: document.createElement('canvas'), // Kaplay creates its own canvas
    });
    kaplayInstanceRef.current = k;
    setIsKaplayInitialized(true); // Mark as initialized
    console.log('FlappyBird: kaplay initialized, instance:', k);

    // Append the kaplay canvas to the ref's current element
    // Ensure it's only appended once
    if (container.children.length === 0 || container.children[0] !== k.canvas) {
      // Clear existing children if any, to prevent multiple canvases
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(k.canvas);
      console.log('FlappyBird: Appended kaplay canvas to container');
    } else {
      console.log('FlappyBird: Kaplay canvas already appended');
    }

    // Function to resize kaplay canvas
    const resizeKaplay = () => {
      // Ensure kaplay canvas has dimensions before accessing properties
      if (!k.canvas || k.canvas.offsetWidth === 0 || k.canvas.offsetHeight === 0) {
        console.log('FlappyBird: Kaplay canvas not ready for resize, skipping.', k.canvas);
        return;
      }
      const { clientWidth, clientHeight } = container;
      console.log(`FlappyBird: Resizing kaplay to ${clientWidth}x${clientHeight}`);
      k.resize(clientWidth, clientHeight);
      console.log('FlappyBird: Kaplay canvas dimensions after resize:', k.canvas.width, k.canvas.height);
    };

    // Initial resize after canvas is appended and container is available
    // Use requestAnimationFrame for initial resize to ensure layout is ready
    let animationFrameId;
    const scheduleResize = () => {
      animationFrameId = requestAnimationFrame(() => {
        resizeKaplay();
      });
    };
    scheduleResize();

    // Observe container resize
    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(container);

    // Cleanup for kaplay setup useEffect
    return () => {
      console.log('FlappyBird: kaplay setup useEffect Cleanup function running');
      resizeObserver.disconnect(); // Disconnect ResizeObserver
      cancelAnimationFrame(animationFrameId); // Cancel any pending animation frame

      // Destroy kaplay instance only if it was created by this component
      if (kaplayInstanceRef.current && typeof kaplayInstanceRef.current.destroy === 'function') {
        console.log('FlappyBird: Calling destroy() on kaplay instance');
        kaplayInstanceRef.current.destroy();
        kaplayInstanceRef.current = null; // Clear the ref
        console.log('FlappyBird: kaplay instance destroyed and ref cleared');
      }
    };
  }, [gameContainerRef.current]); // Dependency on gameContainerRef.current

  // useEffect for game logic that doesn't require immediate DOM measurements
  useEffect(() => {
    console.log('FlappyBird: useEffect for game logic running');
    const k = kaplayInstanceRef.current; // Get kaplay instance from ref
    if (!k) {
      console.error('FlappyBird: kaplay instance not available for game logic');
      return;
    }

    // Game variables
    const JUMP_FORCE = 320;
    const PIPE_SPEED = 100;
    const PIPE_OPEN = 120;
    const BIRD_X = 80;

    // Game scene (only set up once)
    // Check if scenes are already defined to prevent re-definition on re-render
    if (!k.getScene('game')) { // Assuming getScene exists or similar check
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
    }

    k.go('game'); // Always go to game scene on mount

    // Cleanup function for game logic useEffect
    return () => {
      console.log('FlappyBird: game logic useEffect Cleanup function running');
      // Optionally, you might want to pause the game or reset the scene here
      // if the FlappyBird component unmounts.
    };
  }, [isKaplayInitialized]); // Dependency on isKaplayInitialized

  return <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default FlappyBird;
