import React, { useCallback, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useConfetti } from '../../hooks/useConfetti';
import FloatingButton from '../FloatingButton';

const ThemeToggle = () => {
  const { theme: currentTheme, toggleTheme, isPending: themeIsPending } = useTheme();
  const { triggerConfetti, isPending: confettiIsPending } = useConfetti();

  const handleClick = useCallback(() => {
    toggleTheme();
    triggerConfetti();
  }, [toggleTheme, triggerConfetti]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Shift + T for theme toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        handleClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClick]);

  const icon = currentTheme === 'light' ? '🌙' : '☀️';
  const ariaLabel = `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`;
  const title = `${ariaLabel} (Ctrl+Shift+T)`;

  return (
    <FloatingButton
      position="center"
      icon={icon}
      isPending={themeIsPending || confettiIsPending}
      onClick={handleClick}
      ariaLabel={ariaLabel}
      title={title}
      zIndex={9999}
    />
  );
};

export default React.memo(ThemeToggle);
