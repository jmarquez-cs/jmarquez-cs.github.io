import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../hooks/useTheme';
import './mermaid.css';

// Preload mermaid chunks when component becomes visible
const preloadMermaidChunks = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Preload core mermaid chunk
      import('mermaid').catch(() => {});
    });
  }
};

// Enhanced lazy loading with intelligent chunking
const loadMermaid = async () => {
  try {
    const mermaidModule = await import('mermaid');
    return mermaidModule.default;
  } catch (error) {
    console.error('Failed to load Mermaid:', error);
    throw error;
  }
};

// Enhanced loading component with skeleton
const MermaidLoading = () => (
  <div className="mermaid-loading">
    <div className="mermaid-loading-container">
      <div className="mermaid-loading-spinner"></div>
      <div className="mermaid-loading-skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-diagram">
          <div className="skeleton-node"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-node"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-node"></div>
        </div>
      </div>
      <p>Loading diagram renderer...</p>
    </div>
  </div>
);

// Interactive Mermaid Editor Component
const MermaidComponent = () => {
  const { theme } = useTheme();
  const [syntax, setSyntax] = useState(`graph TD
    A[Business Needs<br>Stakeholder Goals] -->|Identify Requirements| B{Fractional CTO}
    B -->|Strategic Planning| C[Technical Strategy<br>Architecture Design]
    B -->|Team Leadership| D[Development Teams<br>Agile Execution]
    B -->|Infrastructure Oversight| E[Cloud & DevOps<br>Deployment]
    C -->|Define Tech Stack| F[Technologies<br>e.g., GCP, Terraform, Docker]
    D -->|CI/CD Pipelines| G[Development<br>Code & Test]
    E -->|Scalability & Security| H[Production<br>Deployment]
    F --> G
    G --> H
    H -->|Deliver Solutions| I[Business Outcomes<br>Client Success]`);
  const [diagram, setDiagram] = useState('');
  const [mermaid, setMermaid] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress] = useState(0);
  const rightRef = useRef(null);
  const intersectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagramDimensions, setDiagramDimensions] = useState({ width: 0, height: 0 });
  const isDark = theme === 'dark';
  // Intersection Observer for intelligent preloading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            preloadMermaidChunks();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' },
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Resize Observer for responsive diagram sizing
  useEffect(() => {
    if (!rightRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDiagramDimensions({ width, height });
      }
    });

    resizeObserver.observe(rightRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Handle diagram resizing
  useEffect(() => {
    if (!rightRef.current || !diagram) return;

    const svgElement = rightRef.current.querySelector('svg');
    if (svgElement && diagramDimensions.width > 0) {
      // Make SVG responsive to container size
      svgElement.style.maxWidth = '100%';
      svgElement.style.height = 'auto';
      svgElement.style.width = 'auto';
    }
  }, [diagram, diagramDimensions]);

  // Stable mermaid configuration to prevent infinite re-renders
  const mermaidConfig = useMemo(() => {
    const config = {
      theme: 'base',
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: '16px',
      textColor: isDark ? '#fafafa' : '#0a0d1a',
      themeVariables: {
        // Core theme variables
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: '16px',
        textColor: isDark ? '#fafafa' : '#0a0d1a',
        darkMode: isDark,
        background: isDark ? '#0c0f1d' : '#f7f7f7',

        // Primary colors
        primaryColor: isDark ? '#1a1d2e' : '#eafcfa',
        primaryTextColor: isDark ? '#fafafa' : '#0c0f1d',
        primaryBorderColor: isDark ? '#37c5b3' : '#97f0e5',

        // Secondary colors
        secondaryColor: isDark ? '#613dff' : '#f6ce9e',
        secondaryTextColor: isDark ? '#fafafa' : '#0c0f1d',
        secondaryBorderColor: isDark ? '#97f0e5' : '#f97946',

        // Tertiary colors
        tertiaryColor: isDark ? '#f946ac' : '#8cf28a',
        tertiaryTextColor: isDark ? '#fafafa' : '#0c0f1d',
        tertiaryBorderColor: isDark ? '#f759b7' : '#6bcc69',

        // Line and edge colors
        lineColor: isDark ? '#f7f7f7' : '#37c5b3',
        arrowheadColor: isDark ? '#f7f7f7' : '#37c5b3',
        edgeColor: isDark ? '#f7f7f7' : '#37c5b3',
        defaultLinkColor: isDark ? '#f7f7f7' : '#37c5b3',

        // Cluster colors
        clusterBkg: isDark ? '#252842' : '#e9ccff',
        clusterBorder: isDark ? '#a56ff1' : '#c584f6',

        // Note colors
        noteBkgColor: '#f9d546',
        noteTextColor: '#0c0f1d',
        noteBorderColor: '#f97946',

        // Error colors
        errorBkgColor: isDark ? '#b91c1c' : '#f87171',
        errorTextColor: isDark ? '#f87171' : '#b91c1c',

        // Node colors
        nodeBorder: isDark ? '#37c5b3' : '#97f0e5',
        nodeTextColor: isDark ? '#fafafa' : '#0c0f1d',
        edgeLabelBackground: isDark ? '#1a1d2e' : '#eafcfa',
        // Title color
        titleColor: isDark ? '#fafafa' : '#0a0d1a',

        // Sequence diagram colors
        actorBkg: isDark ? '#0c0f1d' : '#f7f7f7',
        actorBorder: isDark ? '#37c5b3' : '#97f0e5',
        actorTextColor: isDark ? '#fafafa' : '#0c0f1d',
        actorLineColor: isDark ? '#f7f7f7' : '#37c5b3',
        signalColor: isDark ? '#f7f7f7' : '#37c5b3',
        signalTextColor: isDark ? '#fafafa' : '#0c0f1d',
        labelBoxBkgColor: isDark ? '#1a1d2e' : '#eafcfa',
        labelBoxBorderColor: isDark ? '#37c5b3' : '#97f0e5',
        labelTextColor: isDark ? '#fafafa' : '#0c0f1d',
        loopTextColor: isDark ? '#fafafa' : '#0c0f1d',
        activationBorderColor: isDark ? '#97f0e5' : '#37c5b3',
        activationBkgColor: isDark ? '#252842' : '#f0fffe',
        sequenceNumberColor: isDark ? '#fafafa' : '#0c0f1d',

        // Gantt diagram colors
        section0: isDark ? '#1a1d2e' : '#eafcfa',
        section1: isDark ? '#613dff' : '#f6ce9e',
        section2: isDark ? '#f946ac' : '#8cf28a',
        section3: isDark ? '#37c5b3' : '#fce4a6',

        // Git diagram colors
        git0: isDark ? '#1a1d2e' : '#eafcfa',
        git1: isDark ? '#613dff' : '#f6ce9e',
        git2: isDark ? '#f946ac' : '#8cf28a',
        git3: isDark ? '#37c5b3' : '#fce4a6',
        git4: isDark ? '#f759b7' : '#f0c5d8',
        git5: isDark ? '#97f0e5' : '#d4b5f7',
        git6: isDark ? '#f97946' : '#b8e6d3',
        git7: isDark ? '#6bcc69' : '#ffd5a6',

        // Additional customizations
        pieTitleTextSize: '20px',
        pieTitleTextColor: isDark ? '#fafafa' : '#0a0d1a',
        pieOuterStrokeWidth: '2px',
        pieStrokeColor: isDark ? '#37c5b3' : '#0a0d1a',
        pieOpacity: '0.9',

        // Journey diagram colors
        fillType0: isDark ? '#1a1d2e' : '#eafcfa',
        fillType1: isDark ? '#613dff' : '#f6ce9e',
        fillType2: isDark ? '#f946ac' : '#8cf28a',
        fillType3: isDark ? '#37c5b3' : '#fce4a6',
        fillType4: isDark ? '#f759b7' : '#f0c5d8',
        fillType5: isDark ? '#97f0e5' : '#d4b5f7',
        fillType6: isDark ? '#f97946' : '#b8e6d3',
        fillType7: isDark ? '#6bcc69' : '#ffd5a6',
      },
    };
    return config;
  }, [isDark]);

  // Load mermaid library with progress tracking - ONLY ONCE
  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        setIsLoading(true);

        if (!mermaid) {
          const mermaidLib = await loadMermaid();
          setMermaid(mermaidLib);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load Mermaid library:', error);
        setError(error);
        setIsLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize once - no dependencies to prevent infinite loops
    if (!mermaid && !isLoading) {
      initializeMermaid();
    }
  }, [mermaid, isLoading]); // Include dependencies as per React principles

  // Render diagram when syntax or theme changes
  useEffect(() => {
    if (!mermaid || !isLoaded || !syntax) return;

    const renderDiagram = async () => {
      try {
        // Clear previous diagram
        if (rightRef.current) {
          rightRef.current.innerHTML = '';
        }

        // Re-initialize with current config for theme changes
        mermaid.initialize(mermaidConfig);

        const { svg } = await mermaid.render('mermaid-graph', syntax);
        setDiagram(svg);
        setError(null);
      } catch (error) {
        setDiagram(`<p>Error rendering diagram: ${error.message}</p>`);
        setError(error);
      }
    };

    renderDiagram();
  }, [syntax, theme, isLoaded, mermaid, mermaidConfig]);

  const downloadSVG = () => {
    if (!diagram) return;
    const blob = new Blob([diagram], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svgElement = rightRef.current?.querySelector('svg');
    if (!svgElement) return;

    try {
      const canvas = document.createElement('canvas');
      const bbox = svgElement.getBBox();
      canvas.width = bbox.width * 2; // Higher resolution
      canvas.height = bbox.height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(2, 2);

      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'diagram.png';
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error('Error generating PNG:', error);
    }
  };

  // Use the already defined getMermaidConfig function consistently

  return (
    <section className="section" ref={intersectionRef}>
      <div className="container">
        <h2 className="section-title">Mermaid.js</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            Error: {error.message}
          </div>
        )}

        {!isLoaded && !error && <MermaidLoading />}

        {loadingProgress > 0 && loadingProgress < 100 && (
          <div className="loading-progress">
            <div className="progress-bar" style={{ width: `${loadingProgress}%` }}></div>
            <span className="progress-text">{loadingProgress}% loaded</span>
          </div>
        )}

        {isLoaded && (
          <div className="mermaid-container">
            <div className="mermaid-editor-diagram-wrapper">
              <div className="mermaid-editor">
                <textarea
                  value={syntax}
                  onChange={(e) => setSyntax(e.target.value)}
                  placeholder="Enter your Mermaid syntax here..."
                />
              </div>
              <div
                className="mermaid-diagram"
                ref={rightRef}
                dangerouslySetInnerHTML={{ __html: diagram }}
              />
            </div>
            <div className="mermaid-buttons">
              <button className="btn btn-primary" onClick={downloadSVG}>
                Download SVG
              </button>
              <button className="btn btn-secondary" onClick={downloadPNG}>
                Download PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

MermaidComponent.propTypes = {
  diagramDefinition: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export const Mermaid = React.memo(MermaidComponent);
