import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useBundleAnalyzerVisibility = () => {
  const [isVisible, setIsVisible] = useLocalStorage('bundleAnalyzerVisible', false);
  const [isPending, setIsPending] = useState(false);

  const toggleVisibility = async () => {
    console.log(
      '[useBundleAnalyzerVisibility] toggleVisibility called, current isVisible:',
      isVisible,
    );
    setIsPending(true);
    try {
      // Add small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsVisible((prev) => {
        console.log('[useBundleAnalyzerVisibility] setIsVisible: prev =', prev, 'new =', !prev);
        return !prev;
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    isVisible: process.env.NODE_ENV === 'development' ? isVisible : false,
    setIsVisible,
    toggleVisibility,
    hideBundleAnalyzer: () => setIsVisible(false),
    isPending,
  };
};
