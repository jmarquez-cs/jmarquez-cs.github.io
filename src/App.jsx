import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ColorPalette } from './components/ColorPalette';
import { Footer } from './components/Footer';
import { ThemeToggle } from './components/ThemeToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
// WaveBackground imported via lazy loading below
import { useTheme } from './hooks/useTheme';
import { useConfetti } from './hooks/useConfetti';
import { useGameVisibility } from './contexts/GameVisibilityContext';
import { LazySection } from './components/LazySection';
import { GlobalLoading } from './components/GlobalLoading';
import { useBundleAnalyzerVisibility } from './hooks/useBundleAnalyzerVisibility';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import PerformanceDashboardToggle from './components/PerformanceDashboard/PerformanceDashboardToggle';
import { usePerformanceDashboardVisibility } from './hooks/usePerformanceDashboardVisibility';
import BundleAnalyzerToggle from './components/BundleAnalyzer/BundleAnalyzerToggle';
import SkillsRadar from './components/SkillsRadar';
import { SEODashboard } from './components/SEODashboard';
import SEODashboardToggle from './components/SEODashboard/SEODashboardToggle';
import { useSEO } from './hooks/useSEO';
import FloatingButton from './components/FloatingButton';
import { useState } from 'react';
import { BundleAnalyzer } from './components/BundleAnalyzer';

// Strategic lazy loading with resource hints
const Portfolio = lazy(() =>
  import('./components/Portfolio').then((module) => {
    // Preload related chunks
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('./hooks/usePortfolio').catch(() => {});
      });
    }
    return { default: module.Portfolio };
  }),
);

const Mermaid = lazy(() =>
  import('./components/Mermaid').then((module) => {
    // Preload mermaid core when component loads
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('mermaid').catch(() => {});
      });
    }
    return { default: module.Mermaid };
  }),
);

const Games = lazy(() =>
  import('./components/Games').then((module) => {
    // Preload kaplay when Games component loads
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('kaplay').catch(() => {});
      });
    }
    return { default: module.Games };
  }),
);

// Removed duplicate BundleAnalyzerComponent - using direct import below

// Lazy load WaveBackground with enhanced error boundary
const WaveBackground = lazy(() =>
  import('./components/WaveBackground').then((module) => ({
    default: module.WaveBackground,
  })),
);

// Pure CSS WaveBackground - no JavaScript positioning
const WaveBackgroundContainer = () => {
  return (
    <ErrorBoundary componentName="WaveBackground" isolateErrors={true}>
      <Suspense fallback={null}>
        <WaveBackground />
      </Suspense>
    </ErrorBoundary>
  );
};

// Enhanced loading component with skeleton

GlobalLoading.propTypes = {
  componentName: PropTypes.string,
};

GlobalLoading.defaultProps = {
  componentName: 'Component',
};

// Intersection Observer component for lazy loading optimization

LazySection.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node.isRequired,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
};

LazySection.defaultProps = {
  threshold: 0.1,
  rootMargin: '50px',
};

const AppComponent = () => {
  const { theme, toggleTheme } = useTheme();
  const { triggerConfetti } = useConfetti();
  const { showGame } = useGameVisibility();
  const { isVisible: bundleAnalyzerVisible, toggleVisibility: toggleBundleAnalyzer } =
    useBundleAnalyzerVisibility();
  const { isVisible: isPerformanceDashboardVisible, setIsVisible: setPerformanceDashboardVisible } =
    usePerformanceDashboardVisibility();

  // SEO Integration
  const [currentSection, setCurrentSection] = useState('home');
  const [seoDashboardVisible, setSeoDashboardVisible] = useState(false);
  const { updateSEO } = useSEO(currentSection);

  // Preload critical resources on idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload critical components when browser is idle
        import('./components/Portfolio').catch(() => {});
        import('./hooks/usePortfolio').catch(() => {});
      });
    }
  }, []);

  // SEO section tracking with intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && sectionId !== currentSection) {
            setCurrentSection(sectionId);
            updateSEO(sectionId);
          }
        }
      });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('#about, #portfolio, #skills');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [currentSection, updateSEO]);

  // Portfolio data matching SkillsRadar interface contract
  const portfolioData = useMemo(
    () => ({
      projects: {
        byId: {
          1: {
            technologies: [
              { name: 'JavaScript', years: 8 },
              { name: 'React', years: 5 },
              { name: 'Node.js', years: 6 },
              { name: 'TypeScript', years: 4 },
              { name: 'Python', years: 7 },
              { name: 'AWS', years: 5 },
              { name: 'Docker', years: 4 },
              { name: 'PostgreSQL', years: 6 },
            ],
          },
        },
      },
    }),
    [],
  );

  // Memoized WaveBackground container for performance
  const memoizedWaveBackground = useMemo(
    () => <WaveBackgroundContainer />,
    [], // No dependencies - WaveBackgroundContainer handles its own state
  );

  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <ErrorBoundary componentName="Hero">
          <LazySection fallback={<GlobalLoading componentName="Hero" />}>
            <Hero />
          </LazySection>
        </ErrorBoundary>
        <About />

        {/* Portfolio with intersection-based lazy loading */}
        <ErrorBoundary componentName="Portfolio">
          <LazySection
            fallback={<GlobalLoading componentName="Portfolio" />}
            threshold={0.2}
            rootMargin="100px"
          >
            <Portfolio />
          </LazySection>
        </ErrorBoundary>

        <ErrorBoundary componentName="SkillsRadar">
          <LazySection
            fallback={<GlobalLoading componentName="Skills Radar" />}
            threshold={0.2}
            rootMargin="100px"
          >
            <SkillsRadar portfolioData={portfolioData} animated={true} showLegend={true} />
          </LazySection>
        </ErrorBoundary>

        <ErrorBoundary componentName="ColorPalette">
          <LazySection fallback={<GlobalLoading componentName="Color Palette" />}>
            <section id="palette" className="section">
              <div className="container">
                <h2 className="section-title">COLOR PALETTE</h2>
                <ColorPalette />
              </div>
            </section>
          </LazySection>
        </ErrorBoundary>

        <ErrorBoundary componentName="Mermaid">
          <LazySection
            fallback={<GlobalLoading componentName="Mermaid Diagrams" />}
            threshold={0.2}
            rootMargin="100px"
          >
            <Suspense fallback={<GlobalLoading componentName="Mermaid" />}>
              <Mermaid />
            </Suspense>
          </LazySection>
        </ErrorBoundary>
      </main>

      <ThemeToggle />
      <Footer />

      {/* Games modal - only load when needed */}
      <ErrorBoundary componentName="Games Modal">
        <Suspense fallback={<GlobalLoading componentName="Games" />}>
          <Games />
        </Suspense>
      </ErrorBoundary>

      {/* Developer Tools - controlled by DeveloperModeContext */}
      {bundleAnalyzerVisible && (
        <ErrorBoundary componentName="BundleAnalyzer">
          <Suspense fallback={<GlobalLoading componentName="Bundle Analyzer" />}>
            <BundleAnalyzer isVisible={bundleAnalyzerVisible} />
          </Suspense>
        </ErrorBoundary>
      )}
      <BundleAnalyzerToggle isVisible={bundleAnalyzerVisible} onToggle={toggleBundleAnalyzer} />

      {isPerformanceDashboardVisible && (
        <ErrorBoundary componentName="PerformanceDashboard">
          <PerformanceDashboard isVisible={isPerformanceDashboardVisible} componentName="App" />
        </ErrorBoundary>
      )}
      <PerformanceDashboardToggle
        isVisible={isPerformanceDashboardVisible}
        onToggle={() => setPerformanceDashboardVisible(!isPerformanceDashboardVisible)}
      />

      <SEODashboardToggle
        isVisible={seoDashboardVisible}
        onToggle={() => setSeoDashboardVisible(!seoDashboardVisible)}
      />
      <SEODashboard isVisible={seoDashboardVisible} />
    </div>
  );
};

AppComponent.displayName = 'App';
const App = React.memo(AppComponent);
export default App;
