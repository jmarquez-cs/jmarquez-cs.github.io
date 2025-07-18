import { useCallback, useTransition } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from './useTheme';

export const useConfetti = () => {
  const { theme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const triggerConfetti = useCallback(
    (element = null) => {
      if (isPending) return Promise.resolve();

      // Optimistic feedback - immediate visual indication
      const optimisticElement = element;
      if (optimisticElement) {
        optimisticElement.style.transform = 'scale(1.05)';
        optimisticElement.style.transition = 'transform 0.1s ease';
      }

      return new Promise((resolve, reject) => {
        startTransition(() => {
          try {
            const rect = element?.getBoundingClientRect() || {
              left: window.innerWidth / 2,
              top: window.innerHeight / 2,
            };

            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
              particleCount: 50,
              spread: 70,
              origin: { x, y },
              colors: ['#97f0e5', '#8cf28a', '#f9d546', '#f946ac', '#613dff'],
            });

            setTimeout(() => {
              // Reset optimistic feedback
              if (optimisticElement) {
                optimisticElement.style.transform = '';
              }

              resolve();
            }, 500);
          } catch (error) {
            // Rollback optimistic feedback on error
            if (optimisticElement) {
              optimisticElement.style.transform = '';
              optimisticElement.style.backgroundColor = '#ff6b6b';
              setTimeout(() => {
                optimisticElement.style.backgroundColor = '';
              }, 200);
            }

            console.error('Confetti failed:', error);
            reject(error);
          }
        });
      });
    },
    [isPending, startTransition],
  );

  const triggerThemeConfetti = useCallback(() => {
    const colors =
      theme === 'dark'
        ? ['#97f0e5', '#613dff', '#f946ac', '#f97946', '#f9d546']
        : ['#37c5b3', '#089280', '#4a3b2b', '#f6ce9e', '#8cf28a'];

    // Theme-specific confetti animation
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.5 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });
  }, [theme]);

  return { triggerConfetti, triggerThemeConfetti, isPending };
};
