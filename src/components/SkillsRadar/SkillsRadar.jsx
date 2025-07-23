import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';
import { portfolioSelectors } from '../../data/portfolioData';
import { useTheme } from '../../hooks/useTheme';
import './SkillsRadar.css';

const SkillsRadar = ({ portfolioData, animated = true, showLegend = true }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    if (!canvasRef.current || !portfolioData) return;

    // Extract technology experience data from portfolio with proper error handling
    let technologyExperience = [];
    try {
      technologyExperience = portfolioSelectors?.getTechnologyExperience?.(portfolioData) || [];
    } catch (error) {
      console.warn('SkillsRadar: Using fallback data due to selector error:', error);
      // Fallback to direct extraction if selector fails
      technologyExperience = portfolioData.projects?.byId?.[1]?.technologies || [];
    }

    // Validate and format data for Chart.js (matching original Radar.html structure)
    if (!Array.isArray(technologyExperience) || technologyExperience.length === 0) {
      console.warn('SkillsRadar: No valid technology experience data available');
      return;
    }

    const labels = technologyExperience.map((tech) => tech.name || 'Unknown');
    const data = technologyExperience.map((tech) => tech.years || 0);

    const ctx = canvasRef.current.getContext('2d');

    // Get CSS custom properties for theme-aware colors
    const computedStyles = getComputedStyle(document.documentElement);
    const primaryColor = computedStyles.getPropertyValue('--accent-color').trim() || '#54a0ff';
    const textColor =
      computedStyles.getPropertyValue('--text-primary').trim() || (isDark ? '#ffffff' : '#000000');
    const gridColor =
      computedStyles.getPropertyValue('--border-color').trim() ||
      (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)');
    const backgroundColor =
      computedStyles.getPropertyValue('--card-background').trim() ||
      (isDark ? '#2c3e50' : '#ffffff');

    // Create gradient colors based on primary
    const primaryRgb = hexToRgb(primaryColor) || { r: 84, g: 160, b: 255 };
    const datasetBg = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`;
    const datasetBorder = primaryColor;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Years of Experience',
            data: data,
            backgroundColor: datasetBg,
            borderColor: datasetBorder,
            borderWidth: 3,
            pointBackgroundColor: datasetBorder,
            pointBorderColor: backgroundColor,
            pointHoverBackgroundColor: backgroundColor,
            pointHoverBorderColor: datasetBorder,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: animated ? 1000 : 0,
        },
        scales: {
          r: {
            angleLines: {
              display: true,
              color: gridColor,
            },
            grid: {
              color: gridColor,
            },
            ticks: {
              stepSize: 2,
              font: {
                size: 14,
                family: 'var(--font-family)',
                weight: 'bold',
              },
              color: textColor,
              backdropColor: backgroundColor,
            },
            pointLabels: {
              font: {
                size: 16,
                family: 'var(--font-family)',
                weight: 'bold',
              },
              color: textColor,
            },
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
        plugins: {
          legend: {
            display: showLegend,
            position: 'top',
            labels: {
              font: {
                size: 16,
                family: 'var(--font-family)',
                weight: 'bold',
              },
              color: textColor,
              padding: 20,
            },
          },
        },
        layout: {
          padding: 20,
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [portfolioData, animated, showLegend, theme, isDark]);

  // Utility function to convert hex to RGB
  const hexToRgb = (hex) => {
    if (!hex) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  return (
    <section id="skills" className="section skills-radar-section">
      <h2 className="section-title">Tech Skill Radar</h2>
      <div className="skills-radar-container">
        <canvas ref={canvasRef} className="skills-radar-chart" />
      </div>
    </section>
  );
};

SkillsRadar.propTypes = {
  portfolioData: PropTypes.object.isRequired,
  title: PropTypes.string,
  animated: PropTypes.bool,
  showLegend: PropTypes.bool,
};

export default SkillsRadar;
