import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = useCallback((customConfig = {}) => {
    const currentTheme = document.body.getAttribute('data-theme');

    const themeColors =
      currentTheme === 'dark'
        ? ['#97F0E5', '#C584F6', '#8CF28A', '#F946AC', '#F97946']
        : ['#089280', '#A56FF1', '#6BCC69', '#F72C8F', '#F5623C'];

    const defaultConfig = {
      particleCount: 50,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: themeColors,
      scalar: 0.8,
      gravity: 1.2,
      drift: Math.random() * 2 - 1,
    };

    confetti({
      ...defaultConfig,
      ...customConfig,
    });
  }, []);

  const triggerThemeConfetti = useCallback((buttonElement) => {
    if (!buttonElement) return;

    const rect = buttonElement.getBoundingClientRect();
    const currentTheme = document.body.getAttribute('data-theme');

    const themeColors =
      currentTheme === 'dark'
        ? ['#97F0E5', '#C584F6', '#8CF28A']
        : ['#FFC700', '#F946AC', '#6366F1'];

    confetti({
      particleCount: 25,
      angle: 90,
      spread: 80,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: themeColors,
      scalar: 0.6,
      gravity: 0.8,
    });
  }, []);

  return { triggerConfetti, triggerThemeConfetti };
};
