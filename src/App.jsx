import React, { Suspense, useCallback, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { ThemeToggle } from './components/ThemeToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { useConfetti } from './hooks/useConfetti';
import { useGameVisibility } from './contexts/GameVisibilityContext';
import { LazySection } from './components/LazySection';
import { GlobalLoading } from './components/GlobalLoading';
import { useBundleAnalyzerVisibility } from './hooks/useBundleAnalyzerVisibility';
import PerformanceDashboard from './components/PerformanceDashboard';
import PerformanceDashboardToggle from './components/PerformanceDashboard/PerformanceDashboardToggle';
import { usePerformanceDashboardVisibility } from './hooks/usePerformanceDashboardVisibility';
import BundleAnalyzerToggle from './components/BundleAnalyzer/BundleAnalyzerToggle';

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

const BundleAnalyzer = lazy(() =>
  import('./components/BundleAnalyzer').then((module) => ({
    default: module.BundleAnalyzer,
  })),
);

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

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
    triggerConfetti();
  }, [toggleTheme, triggerConfetti]);

  return (
    <div className="App">
      <Navigation />
      <main id="main-content">
        <Hero />
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

        <Contact />

        {/* Mermaid with intersection-based lazy loading*/}
        <ErrorBoundary componentName="Mermaid Diagram">
          <LazySection
            fallback={<GlobalLoading componentName="Mermaid Diagram" />}
            threshold={0.1}
            rootMargin="200px"
          >
            <Mermaid />
          </LazySection>
        </ErrorBoundary>
      </main>

      <ThemeToggle />

      {/* Games modal - only load when needed */}
      <ErrorBoundary componentName="Games Modal">
        <Suspense fallback={<GlobalLoading componentName="Games" />}>
          <Games />
        </Suspense>
      </ErrorBoundary>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 John Marquez. Fractional CTO & Blockchain Expert.</p>
        </div>
      </footer>

      {/* Bundle Analyzer - development only */}
      {process.env.NODE_ENV === 'development' && bundleAnalyzerVisible && (
        <Suspense fallback={<GlobalLoading componentName="Bundle Analyzer" />}>
          <BundleAnalyzer />
        </Suspense>
      )}
      {process.env.NODE_ENV === 'development' && (
        <BundleAnalyzerToggle isVisible={bundleAnalyzerVisible} onToggle={toggleBundleAnalyzer} />
      )}

      {process.env.NODE_ENV === 'development' && (
        <>
          <PerformanceDashboardToggle
            isVisible={isPerformanceDashboardVisible}
            onToggle={() => setPerformanceDashboardVisible(!isPerformanceDashboardVisible)}
          />
          <PerformanceDashboard isVisible={isPerformanceDashboardVisible} componentName="App" />
        </>
      )}
    </div>
  );
};

AppComponent.displayName = 'App';
const App = React.memo(AppComponent);
export default App;
