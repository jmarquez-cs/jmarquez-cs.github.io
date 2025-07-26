import { useLocalStorage } from './useLocalStorage';

export const usePerformanceDashboardVisibility = () => {
  const [isVisible, setIsVisible] = useLocalStorage('performanceDashboardVisible', false);

  return {
    isVisible,
    setIsVisible,
    toggleVisibility: () => setIsVisible((prev) => !prev),
  };
};
