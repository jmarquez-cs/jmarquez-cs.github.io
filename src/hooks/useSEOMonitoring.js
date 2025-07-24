import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SEO_METRICS, auditSEO } from '../utils/seoUtils.js';

export const useSEOMonitoring = () => {
  const [seoMetrics, setSeoMetrics] = useState(SEO_METRICS);
  const [auditResults, setAuditResults] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Core Web Vitals monitoring
  const monitorCoreWebVitals = useCallback(() => {
    if ('web-vital' in window) {
      import('web-vitals')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS((metric) => {
            setSeoMetrics((prev) => ({
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                CLS: { ...prev.coreWebVitals.CLS, current: metric.value },
              },
            }));
          });

          getFID((metric) => {
            setSeoMetrics((prev) => ({
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                FID: { ...prev.coreWebVitals.FID, current: metric.value },
              },
            }));
          });

          getLCP((metric) => {
            setSeoMetrics((prev) => ({
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                LCP: { ...prev.coreWebVitals.LCP, current: metric.value },
              },
            }));
          });
        })
        .catch(() => {
          console.log('Web vitals library not available');
        });
    }
  }, []);

  // SEO audit function
  const runSEOAudit = useCallback(() => {
    const results = auditSEO();
    setAuditResults(results);

    // Update technical SEO metrics
    setSeoMetrics((prev) => ({
      ...prev,
      technicalSEO: {
        ...prev.technicalSEO,
        metaTagsOptimized: results.scores.metaTags >= 75,
        structuredDataValid: results.scores.structuredData >= 75,
        canonicalUrlsSet: document.querySelector('link[rel="canonical"]') !== null,
        robotsTxtValid: true, // Assuming robots.txt exists
        sitemapValid: true, // Assuming sitemap exists
      },
    }));

    return results;
  }, []);

  // Search Console API simulation (would connect to real API in production)
  const updateSearchMetrics = useCallback(() => {
    // Simulated search metrics - in production, this would connect to Google Search Console API
    setSeoMetrics((prev) => ({
      ...prev,
      searchVisibility: {
        indexedPages: 4, // Based on sitemap.xml
        organicKeywords: Math.floor(Math.random() * 50) + 10,
        searchImpressions: Math.floor(Math.random() * 1000) + 100,
        averagePosition: Math.random() * 50 + 10,
      },
    }));
  }, []);

  // Memoized callbacks with proper dependency arrays
  const stableStartMonitoring = useCallback(() => {
    if (!isMonitoring) {
      setIsMonitoring(true);
      monitorCoreWebVitals();
      runSEOAudit();
      updateSearchMetrics();

      // Set up periodic monitoring
      const interval = setInterval(() => {
        runSEOAudit();
        updateSearchMetrics();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring, monitorCoreWebVitals, runSEOAudit, updateSearchMetrics]);

  const stableStopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Start monitoring with proper callback dependency
  const startMonitoring = stableStartMonitoring;
  const stopMonitoring = stableStopMonitoring;

  useEffect(() => {
    // Start monitoring on mount
    const cleanup = stableStartMonitoring();
    return cleanup;
  }, [stableStartMonitoring]);

  const memoizedSeoMetrics = useMemo(() => seoMetrics, [seoMetrics]);
  const memoizedAuditResults = useMemo(() => auditResults, [auditResults]);

  return {
    seoMetrics: memoizedSeoMetrics,
    auditResults: memoizedAuditResults,
    isMonitoring,
    runSEOAudit,
    startMonitoring: stableStartMonitoring,
    stopMonitoring: stableStopMonitoring,
  };
};
