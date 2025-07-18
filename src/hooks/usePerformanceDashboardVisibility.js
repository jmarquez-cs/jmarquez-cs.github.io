import { useLocalStorage } from './useLocalStorage';

export const usePerformanceDashboardVisibility = () => {
  const [isVisible, setIsVisible] = useLocalStorage('performanceDashboardVisible', false);

  return {
    isVisible: process.env.NODE_ENV === 'development' ? isVisible : false,
    setIsVisible,
    toggleVisibility: () => setIsVisible((prev) => !prev),
  };
};
