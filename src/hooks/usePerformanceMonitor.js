import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    loadTime: 0,
    interactionTime: 0,
    fps: 0,
    userInteractions: 0,
    networkRequests: 0,
    cacheHitRate: 0,
    errorCount: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  });

  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const observer = useRef(null);
  const startTime = useRef(Date.now());
  const frameRef = useRef(0);
  const fpsCounter = useRef({ frames: 0, lastTime: Date.now() });
  const interactionStartTime = useRef(null);
  const networkCache = useRef(new Map());

  // Helper functions - defined before useEffect that depends on them
  const calculateCacheHitRate = useCallback(() => {
    const cacheEntries = Array.from(networkCache.current.values());
    if (cacheEntries.length === 0) return 0;
    const hits = cacheEntries.filter(Boolean).length;
    return Math.round((hits / cacheEntries.length) * 100);
  }, []);

  const addAlert = useCallback((type, message, data = null) => {
    const alert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
      type,
      message,
      data,
      timestamp: Date.now(),
    };

    setAlerts((prev) => {
      const newAlerts = [alert, ...prev];
      return newAlerts.slice(0, 10); // Keep last 10 alerts
    });
  }, []);

  // Enhanced Performance Observer for comprehensive metrics
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      observer.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          // Track resource loading with cache analysis
          if (entry.entryType === 'resource') {
            const isCacheHit = entry.transferSize === 0 && entry.decodedBodySize > 0;
            networkCache.current.set(entry.name, isCacheHit);

            if (entry.name.includes('chunk') || entry.name.includes('.js')) {
              setMetrics((prev) => ({
                ...prev,
                bundleSize: prev.bundleSize + (entry.transferSize || 0),
                networkRequests: prev.networkRequests + 1,
                cacheHitRate: calculateCacheHitRate(),
              }));
            }
          }

          // Enhanced paint metrics
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              setMetrics((prev) => ({
                ...prev,
                renderTime: entry.startTime,
              }));
            }
          }

          // Core Web Vitals tracking
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics((prev) => ({
              ...prev,
              largestContentfulPaint: entry.startTime,
            }));
          }

          if (entry.entryType === 'first-input') {
            setMetrics((prev) => ({
              ...prev,
              firstInputDelay: entry.processingStart - entry.startTime,
            }));
          }

          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            setMetrics((prev) => ({
              ...prev,
              cumulativeLayoutShift: prev.cumulativeLayoutShift + entry.value,
            }));
          }

          // Enhanced navigation metrics
          if (entry.entryType === 'navigation') {
            setMetrics((prev) => ({
              ...prev,
              loadTime: entry.loadEventEnd - entry.loadEventStart,
            }));
          }

          // User interaction tracking
          if (entry.entryType === 'event') {
            setMetrics((prev) => ({
              ...prev,
              interactionTime: entry.processingEnd - entry.processingStart,
              userInteractions: prev.userInteractions + 1,
            }));
          }
        });
      });

      // Enhanced observation types
      observer.current.observe({
        entryTypes: [
          'resource',
          'paint',
          'navigation',
          'event',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
        ],
      });
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [calculateCacheHitRate]);

  // FPS monitoring
  useEffect(() => {
    const measureFPS = () => {
      fpsCounter.current.frames++;
      const now = Date.now();
      const delta = now - fpsCounter.current.lastTime;

      if (delta >= 1000) {
        const fps = Math.round((fpsCounter.current.frames * 1000) / delta);
        setMetrics((prev) => ({ ...prev, fps }));
        fpsCounter.current.frames = 0;
        fpsCounter.current.lastTime = now;
      }

      frameRef.current = requestAnimationFrame(measureFPS);
    };

    frameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Memory usage tracking with enhanced monitoring
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memoryInfo = performance.memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memoryInfo.usedJSHeapSize,
        }));

        // Memory pressure alerts
        const memoryPressure = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        if (memoryPressure > 0.8) {
          addAlert('warning', 'High memory usage detected', {
            usage: Math.round(memoryPressure * 100),
            component: componentName,
          });
        }
      }
    };

    const interval = setInterval(updateMemoryUsage, 2000);
    updateMemoryUsage();

    return () => clearInterval(interval);
  }, [componentName, addAlert]);

  // Performance history tracking
  useEffect(() => {
    const historyInterval = setInterval(() => {
      const snapshot = {
        timestamp: Date.now(),
        component: componentName,
        metrics: { ...metrics },
        alerts: alerts.length,
      };

      setPerformanceHistory((prev) => {
        const newHistory = [...prev, snapshot];
        return newHistory.slice(-50); // Keep last 50 snapshots
      });
    }, 5000);

    return () => clearInterval(historyInterval);
  }, [metrics, alerts.length, componentName]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getMetrics = useCallback(() => metrics, [metrics]);

  const checkPerformanceBudgets = useCallback(
    (eventType, data) => {
      const budgets = {
        renderTime: 100, // 100ms
        memoryUsage: 50 * 1024 * 1024, // 50MB
        fps: 30,
        firstInputDelay: 100,
        largestContentfulPaint: 2500,
        cumulativeLayoutShift: 0.1,
      };

      // Get current metrics snapshot to avoid dependency on metrics state
      const currentMetrics = getMetrics();

      Object.entries(budgets).forEach(([metric, budget]) => {
        if (currentMetrics[metric] > budget) {
          addAlert('error', `Performance budget exceeded: ${metric}`, {
            current: currentMetrics[metric],
            budget,
            component: componentName,
            eventType,
          });
        }
      });
    },
    [componentName, addAlert, getMetrics],
  );

  // Use a ref to store throttle state to prevent function recreation
  const throttleStateRef = useRef({});

  const record = useCallback(
    (eventType, data = {}) => {
      const timestamp = Date.now();

      // More aggressive throttling - only log every 30 seconds for the same component/eventType
      const logKey = `${componentName}-${eventType}`;
      const lastLogTime = throttleStateRef.current[logKey] || 0;
      const now = Date.now();

      if (process.env.NODE_ENV === 'development' && now - lastLogTime > 30000) {
        throttleStateRef.current[logKey] = now;

        console.log(`[Performance] ${componentName} - ${eventType}:`, {
          timestamp,
          eventType,
          component: componentName,
          ...data,
        });

        // Performance budget checking (only when logging)
        checkPerformanceBudgets(eventType, data);
      }
    },
    [componentName, checkPerformanceBudgets],
  );

  // Interaction tracking
  const trackInteraction = useCallback(
    (interactionType, element) => {
      interactionStartTime.current = Date.now();

      return () => {
        if (interactionStartTime.current) {
          const duration = Date.now() - interactionStartTime.current;
          record('interaction', {
            type: interactionType,
            element,
            duration,
          });
        }
      };
    },
    [record],
  );

  // Create fully stable return object using refs to prevent re-renders
  const stableReturnRef = useRef({});

  // Update the stable return object without creating new references
  stableReturnRef.current = {
    ...metrics,
    performanceHistory,
    alerts,
    record,
    trackInteraction,
    clearAlerts,
    addAlert,
    getMetrics,
  };

  // Return the same object reference every time
  return stableReturnRef.current;
};

// Enhanced Bundle Analyzer Hook with real-time monitoring
export const useBundleAnalyzer = () => {
  const [bundleStats, setBundleStats] = useState({
    totalSize: 0,
    compressedSize: 0,
    chunks: [],
    dependencies: {},
    loadingTimes: {},
    cacheEfficiency: 0,
    compressionRatios: {},
    performanceScore: null,
  });

  const [realTimeStats, setRealTimeStats] = useState({
    activeConnections: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    latency: 0,
  });

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const jsEntries = entries.filter(
          (entry) => entry.name.endsWith('.js') || entry.name.includes('chunk'),
        );

        const stats = jsEntries.reduce(
          (acc, entry) => {
            const size = entry.transferSize || 0;
            const compressedSize = entry.encodedBodySize || 0;
            const loadTime = entry.duration || 0;
            const fileName = entry.name.split('/').pop();

            acc.totalSize += size;
            acc.compressedSize += compressedSize;
            acc.loadingTimes[fileName] = loadTime;

            // Enhanced chunk analysis
            const chunk = {
              name: fileName,
              fullPath: entry.name,
              size: size,
              compressedSize: compressedSize,
              loadTime: loadTime,
              compressionRatio: size > 0 ? (((size - compressedSize) / size) * 100).toFixed(1) : 0,
              cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
              priority: entry.name.includes('main') ? 'high' : 'normal',
              type: getChunkType(fileName),
            };

            acc.chunks.push(chunk);
            acc.compressionRatios[fileName] = chunk.compressionRatio;

            // Enhanced dependency analysis
            if (entry.name.includes('node_modules') || entry.name.includes('vendor')) {
              const libName = fileName.split('.')[0];
              acc.dependencies[libName] = (acc.dependencies[libName] || 0) + size;
            }

            return acc;
          },
          {
            totalSize: 0,
            compressedSize: 0,
            chunks: [],
            dependencies: {},
            loadingTimes: {},
            compressionRatios: {},
          },
        );

        // Calculate performance metrics
        const cachedChunks = stats.chunks.filter((chunk) => chunk.cached).length;
        stats.cacheEfficiency =
          stats.chunks.length > 0 ? ((cachedChunks / stats.chunks.length) * 100).toFixed(1) : 0;

        // Calculate performance score
        stats.performanceScore = calculatePerformanceScore(stats);

        setBundleStats((prev) => ({ ...prev, ...stats }));
      });

      observer.observe({ entryTypes: ['resource'] });
      return () => observer.disconnect();
    }
  }, []);

  // Real-time network monitoring
  useEffect(() => {
    const updateNetworkStats = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setRealTimeStats({
          activeConnections: performance.getEntriesByType('resource').length,
          downloadSpeed: connection.downlink || 0,
          uploadSpeed: connection.uplink || 0,
          latency: connection.rtt || 0,
        });
      }
    };

    const interval = setInterval(updateNetworkStats, 3000);
    updateNetworkStats();

    return () => clearInterval(interval);
  }, []);

  const getChunkType = (fileName) => {
    if (fileName.includes('vendor') || fileName.includes('node_modules')) return 'vendor';
    if (fileName.includes('chunk')) return 'async';
    if (fileName.includes('main') || fileName.includes('index')) return 'main';
    return 'other';
  };

  const calculatePerformanceScore = (stats) => {
    const scores = {
      size: stats.totalSize < 500000 ? 100 : Math.max(0, 100 - (stats.totalSize - 500000) / 10000),
      compression: parseFloat(stats.cacheEfficiency),
      caching: parseFloat(stats.cacheEfficiency),
    };

    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 3;
    return {
      overall: Math.round(overallScore),
      breakdown: scores,
      grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D',
    };
  };

  return { ...bundleStats, realTimeStats };
};

// Enhanced Performance Budget Monitor
export const usePerformanceBudget = () => {
  const [budgetStatus, setBudgetStatus] = useState({
    budgets: {
      totalBundleSize: 500000, // 500KB
      chunkSize: 200000, // 200KB
      renderTime: 100, // 100ms
      memoryUsage: 50 * 1024 * 1024, // 50MB
      fps: 30,
      firstInputDelay: 100,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1,
    },
    violations: [],
    warnings: [],
    passed: true,
    score: 100,
  });

  const { totalSize, chunks, performanceScore } = useBundleAnalyzer();

  useEffect(() => {
    const violations = [];
    const warnings = [];
    let passed = true;
    let score = 100;

    // Bundle size checks
    if (totalSize > budgetStatus.budgets.totalBundleSize) {
      violations.push({
        type: 'bundle_size',
        message: `Total bundle size (${(totalSize / 1024).toFixed(1)}KB) exceeds budget (${(budgetStatus.budgets.totalBundleSize / 1024).toFixed(1)}KB)`,
        severity: 'error',
        current: totalSize,
        budget: budgetStatus.budgets.totalBundleSize,
      });
      passed = false;
      score -= 20;
    }

    // Chunk size checks
    const largestChunk = chunks.reduce((max, chunk) => (chunk.size > max.size ? chunk : max), {
      size: 0,
    });
    if (largestChunk.size > budgetStatus.budgets.chunkSize) {
      violations.push({
        type: 'chunk_size',
        message: `Largest chunk (${(largestChunk.size / 1024).toFixed(1)}KB) exceeds budget (${(budgetStatus.budgets.chunkSize / 1024).toFixed(1)}KB)`,
        severity: 'error',
        current: largestChunk.size,
        budget: budgetStatus.budgets.chunkSize,
        chunk: largestChunk.name || 'unknown',
      });
      passed = false;
      score -= 15;
    }

    // Performance score integration
    if (performanceScore && performanceScore.overall < 70) {
      warnings.push({
        type: 'performance_score',
        message: `Overall performance score (${performanceScore.overall}) is below threshold`,
        severity: 'warning',
        current: performanceScore.overall,
        budget: 70,
      });
      score -= 10;
    }

    setBudgetStatus((prev) => ({
      ...prev,
      violations,
      warnings,
      passed,
      score: Math.max(0, score),
    }));
  }, [totalSize, chunks, performanceScore, budgetStatus.budgets]);

  const updateBudget = useCallback((key, value) => {
    setBudgetStatus((prev) => ({
      ...prev,
      budgets: {
        ...prev.budgets,
        [key]: value,
      },
    }));
  }, []);

  return { ...budgetStatus, updateBudget };
};
