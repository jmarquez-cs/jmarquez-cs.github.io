import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useConfetti } from '../../hooks/useConfetti';
import './ColorPalette.css';

const ColorPaletteComponent = ({
  title = 'Color Palette',
  description = 'A vibrant palette representing energy, growth, and innovation through carefully balanced hues.',
  colors = [
    { name: 'Lime', emoji: '🍃', cssVar: '--lime', hexValue: '#8cf28a' },
    { name: 'Pears', emoji: '🍐', cssVar: '--pears', hexValue: '#f6ce9e' },
    { name: 'Guava', emoji: '🌺', cssVar: '--guava', hexValue: '#f946ac' },
    { name: 'Mandarin', emoji: '🍊', cssVar: '--mandarin', hexValue: '#f97946' },
    { name: 'Blueberry', emoji: '🫐', cssVar: '--blueberry', hexValue: '#613dff' },
    { name: 'Banana', emoji: '🍌', cssVar: '--banana', hexValue: '#f9d546' },
  ],
}) => {
  const { triggerConfetti } = useConfetti();
  const [selectedColor, setSelectedColor] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, using fallback:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }, []);

  const handleCardClick = useCallback(
    async (event, color) => {
      const card = event.currentTarget;

      // Set selected color for CSS value display
      setSelectedColor(color);

      // Copy CSS variable to clipboard
      const cssText = `var(${color.cssVar})`;
      const copied = await copyToClipboard(cssText);

      if (copied) {
        setCopiedColor(color.cssVar);
        setTimeout(() => setCopiedColor(null), 2000);
      }

      // Enhanced visual feedback
      card.style.transform = 'scale(1.1) translateY(-8px)';
      card.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

      try {
        await triggerConfetti(card);

        // Success state
        card.style.transform = 'scale(1.05) translateY(-5px)';
        card.style.filter = 'brightness(1.2) saturate(1.3)';
        card.style.boxShadow = `0 15px 35px ${color.hexValue}40`;

        setTimeout(() => {
          card.style.transform = '';
          card.style.filter = '';
          card.style.boxShadow = '';
        }, 600);
      } catch (error) {
        console.error('Confetti trigger failed:', error);
        card.style.transform = '';
        card.style.backgroundColor = 'var(--error-color, #ff6b6b)';

        setTimeout(() => {
          card.style.backgroundColor = '';
        }, 600);
      }
    },
    [triggerConfetti, copyToClipboard],
  );

  return (
    <div className="color-palette-container">
      <div className="palette-showcase">
        <p>{description}</p>
        {selectedColor && (
          <div className="color-info-display">
            <div className="color-preview" style={{ background: `var(${selectedColor.cssVar})` }}>
              <span className="color-emoji">{selectedColor.emoji}</span>
            </div>
            <div className="color-details">
              <h4>{selectedColor.name}</h4>
              <div className="css-values">
                <div className="css-value">
                  <span className="css-label">CSS Variable:</span>
                  <code className={copiedColor === selectedColor.cssVar ? 'copied' : ''}>
                    var({selectedColor.cssVar})
                  </code>
                </div>
                <div className="css-value">
                  <span className="css-label">Hex Value:</span>
                  <code>{selectedColor.hexValue}</code>
                </div>
              </div>
              {copiedColor === selectedColor.cssVar && (
                <div className="copy-notification">✨ Copied to clipboard!</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="color-flow" role="group" aria-label="Interactive color palette showcase">
        {colors.map((color, index) => (
          <button
            key={index}
            className="flow-card"
            style={{ background: `var(${color.cssVar})` }}
            onClick={(e) => handleCardClick(e, color)}
            aria-label={`${color.name} color - click to view details and copy CSS value`}
            type="button"
          >
            <span className="flow-emoji" aria-hidden="true">
              {color.emoji}
            </span>
            <span className="flow-name">{color.name}</span>
            <span className="flow-value">{color.hexValue}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

ColorPaletteComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      emoji: PropTypes.string.isRequired,
      cssVar: PropTypes.string.isRequired,
      hexValue: PropTypes.string.isRequired,
    }),
  ),
};

export const ColorPalette = React.memo(ColorPaletteComponent);
ColorPalette.displayName = 'ColorPalette';
