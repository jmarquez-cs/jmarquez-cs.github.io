/**
 * Utility functions for managing glitch text effects
 */

export const GLITCH_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generate random character from glitch character set
 */
export const getRandomChar = () => {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
};

/**
 * Create a glitch version of text with partial reveal
 * @param {string} originalText - The target text
 * @param {number} revealedChars - Number of characters to reveal correctly
 * @param {boolean} preserveSpaces - Whether to preserve spaces
 */
export const createGlitchText = (originalText, revealedChars, preserveSpaces = true) => {
  return originalText
    .split('')
    .map((char, index) => {
      if (index < revealedChars) {
        return char; // Revealed correctly
      }
      if (char === ' ' && preserveSpaces) {
        return ' '; // Preserve spaces
      }
      return getRandomChar(); // Random character
    })
    .join('');
};

/**
 * Calculate optimal animation timing based on text length
 * @param {string} text - The text to animate
 * @param {number} baseDuration - Base duration in milliseconds
 */
export const calculateGlitchTiming = (text, baseDuration = 2000) => {
  const textLength = text.length;
  const charactersPerFrame = Math.max(1, Math.floor(textLength / 20)); // ~20 frames
  const duration = Math.max(1000, baseDuration + textLength * 50); // Scale with length

  return {
    duration,
    charactersPerFrame,
    frameCount: Math.ceil(textLength / charactersPerFrame),
  };
};

export default {
  GLITCH_CHARS,
  getRandomChar,
  createGlitchText,
  calculateGlitchTiming,
};
