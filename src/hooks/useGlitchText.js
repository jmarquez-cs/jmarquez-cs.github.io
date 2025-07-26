import { useState, useCallback } from 'react';

export const useGlitchText = (initialTrigger = 'onMount') => {
  const [trigger, setTrigger] = useState(initialTrigger);
  const [key, setKey] = useState(0);

  const triggerGlitch = useCallback(() => {
    setKey((prev) => prev + 1);
    setTrigger('manual');
    // Reset trigger after a brief delay to allow re-triggering
    setTimeout(() => setTrigger('onMount'), 10);
  }, []);

  const setTriggerType = useCallback((newTrigger) => {
    setTrigger(newTrigger);
  }, []);

  return {
    trigger,
    key,
    triggerGlitch,
    setTriggerType,
  };
};

export default useGlitchText;
