import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  usePerformanceMonitor,
  useBundleAnalyzer,
  usePerformanceBudget,
} from '../../hooks/usePerformanceMonitor';
import { useTheme } from '../../hooks/useTheme';
import './PerformanceDashboard.css';

const PerformanceDashboardComponent = ({ componentName = 'Dashboard', isVisible = true }) => {
  const { theme } = useTheme();
  const performanceData = usePerformanceMonitor(componentName);
  const bundleData = useBundleAnalyzer();
  const budgetData = usePerformanceBudget();
  const [activeTab, setActiveTab] = useState('overview');
  const [alertFilter, setAlertFilter] = useState('all');

  // Performance monitoring - must be declared before early return
  const hasRecordedMount = useRef(false);
  useEffect(() => {
    if (isVisible && !hasRecordedMount.current) {
      // Access record function directly to avoid dependency issues
      performanceData.record('dashboard-mount', { component: 'PerformanceDashboard' });
      hasRecordedMount.current = true;
    }
  }, [isVisible, performanceData]); // Include performanceData as per ESLint rule

  // Remove development environment check - now controlled by DeveloperModeContext

  const formatBytes = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatMs = useCallback((ms) => {
    return `${ms.toFixed(1)}ms`;
  }, []);

  const getStatusColor = useCallback((value, thresholds) => {
    if (value <= thresholds.good) return 'var(--success-color)';
    if (value <= thresholds.warning) return 'var(--warning-color)';
    return 'var(--error-color)';
  }, []);

  const getPerformanceGrade = useCallback((score) => {
    if (score >= 90) return { grade: 'A', color: 'var(--success-color)' };
    if (score >= 80) return { grade: 'B', color: 'var(--warning-light-color)' };
    if (score >= 70) return { grade: 'C', color: 'var(--warning-color)' };
    return { grade: 'D', color: 'var(--error-color)' };
  }, []);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'all') return performanceData.alerts;
    return performanceData.alerts.filter((alert) => alert.type === alertFilter);
  }, [performanceData.alerts, alertFilter]);

  const coreWebVitalsData = useMemo(
    () => [
      {
        name: 'Largest Contentful Paint',
        value: performanceData.largestContentfulPaint,
        threshold: { good: 2500, warning: 4000 },
        format: formatMs,
      },
      {
        name: 'First Input Delay',
        value: performanceData.firstInputDelay,
        threshold: { good: 100, warning: 300 },
        format: formatMs,
      },
      {
        name: 'Cumulative Layout Shift',
        value: performanceData.cumulativeLayoutShift,
        threshold: { good: 0.1, warning: 0.25 },
        format: (val) => val.toFixed(3),
      },
    ],
    [performanceData, formatMs],
  );

  const performanceMetrics = useMemo(
    () => [
      {
        name: 'Memory Usage',
        value: performanceData.memoryUsage,
        threshold: { good: 30 * 1024 * 1024, warning: 50 * 1024 * 1024 },
        format: formatBytes,
      },
      {
        name: 'FPS',
        value: performanceData.fps,
        threshold: { good: 55, warning: 30 },
        format: (val) => `${val} fps`,
        inverted: true,
      },
      {
        name: 'Render Time',
        value: performanceData.renderTime,
        threshold: { good: 100, warning: 300 },
        format: formatMs,
      },
      {
        name: 'Interactions',
        value: performanceData.userInteractions,
        threshold: { good: Infinity, warning: Infinity },
        format: (val) => `${val} total`,
      },
    ],
    [performanceData, formatBytes, formatMs],
  );

  if (!isVisible) {
    return null;
  }

  const overallScore = budgetData.score;
  const { grade, color: gradeColor } = getPerformanceGrade(overallScore);

  return (
    <div className={`performance-dashboard ${theme}`}>
      <div className="dashboard-header">
        <h3>🚀 Performance Dashboard</h3>
        <div className="dashboard-score">
          <span className="score-label">Overall Score</span>
          <span className="score-value" style={{ color: gradeColor }}>
            {overallScore}/100 ({grade})
          </span>
        </div>
      </div>

      <div className="dashboard-tabs">
        {['overview', 'metrics', 'bundles', 'alerts'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="metrics-grid">
              <div className="metric-card core-vitals">
                <h4>Core Web Vitals</h4>
                {coreWebVitalsData.map((metric) => (
                  <div key={metric.name} className="metric-row">
                    <span className="metric-name">{metric.name}</span>
                    <span
                      className="metric-value"
                      style={{ color: getStatusColor(metric.value, metric.threshold) }}
                    >
                      {metric.format(metric.value)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="metric-card performance-summary">
                <h4>Performance Summary</h4>
                <div className="summary-stats">
                  <div className="stat">
                    <span className="stat-value">{formatBytes(bundleData.totalSize)}</span>
                    <span className="stat-label">Bundle Size</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{performanceData.fps}</span>
                    <span className="stat-label">FPS</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{budgetData.violations.length}</span>
                    <span className="stat-label">Violations</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{bundleData.cacheEfficiency}%</span>
                    <span className="stat-label">Cache Hit</span>
                  </div>
                </div>
              </div>

              <div className="metric-card budget-status">
                <h4>Budget Status</h4>
                <div className={`budget-indicator ${budgetData.passed ? 'passed' : 'failed'}`}>
                  <span className="budget-icon">{budgetData.passed ? '✅' : '❌'}</span>
                  <span className="budget-text">
                    {budgetData.passed
                      ? 'All budgets met'
                      : `${budgetData.violations.length} violations`}
                  </span>
                </div>
                {budgetData.violations.slice(0, 3).map((violation, index) => (
                  <div key={`violation-${violation.type}-${index}`} className="budget-violation">
                    <span className="violation-type">
                      {String(violation.type).replace('_', ' ')}
                    </span>
                    <span className="violation-message">{String(violation.message)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="metrics-tab">
            <div className="metrics-detailed">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="detailed-metric">
                  <div className="metric-header">
                    <span className="metric-title">{metric.name}</span>
                    <span
                      className="metric-current"
                      style={{
                        color: getStatusColor(
                          metric.value,
                          metric.inverted
                            ? { good: metric.threshold.warning, warning: metric.threshold.good }
                            : metric.threshold,
                        ),
                      }}
                    >
                      {metric.format(metric.value)}
                    </span>
                  </div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${Math.min(100, (metric.value / (metric.threshold.warning || metric.value)) * 100)}%`,
                        backgroundColor: getStatusColor(
                          metric.value,
                          metric.inverted
                            ? { good: metric.threshold.warning, warning: metric.threshold.good }
                            : metric.threshold,
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="performance-history">
              <h4>Performance History</h4>
              <div className="history-chart">
                {performanceData.performanceHistory.slice(-10).map((snapshot, index) => (
                  <div key={`history-${snapshot.timestamp}-${index}`} className="history-point">
                    <div
                      className="history-bar"
                      style={{
                        height: `${Math.min(100, (snapshot.metrics.fps / 60) * 100)}%`,
                        backgroundColor: getStatusColor(snapshot.metrics.fps, {
                          good: 55,
                          warning: 30,
                        }),
                      }}
                    />
                    <span className="history-label">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bundles' && (
          <div className="bundles-tab">
            <div className="bundle-overview">
              <div className="bundle-stats">
                <div className="bundle-stat">
                  <span className="stat-value">{formatBytes(bundleData.totalSize)}</span>
                  <span className="stat-label">Total Size</span>
                </div>
                <div className="bundle-stat">
                  <span className="stat-value">{bundleData.chunks.length}</span>
                  <span className="stat-label">Chunks</span>
                </div>
                <div className="bundle-stat">
                  <span className="stat-value">
                    {bundleData.realTimeStats.downloadSpeed.toFixed(1)} Mbps
                  </span>
                  <span className="stat-label">Download Speed</span>
                </div>
                <div className="bundle-stat">
                  <span className="stat-value">{bundleData.realTimeStats.latency}ms</span>
                  <span className="stat-label">Latency</span>
                </div>
              </div>
            </div>

            <div className="chunks-list">
              <h4>Chunk Analysis</h4>
              {bundleData.chunks
                .sort((a, b) => b.size - a.size)
                .slice(0, 10)
                .map((chunk, index) => (
                  <div key={chunk.name} className="chunk-item">
                    <div className="chunk-info">
                      <span className="chunk-name">{chunk.name}</span>
                      <span className={`chunk-type ${chunk.type}`}>{chunk.type}</span>
                    </div>
                    <div className="chunk-metrics">
                      <span className="chunk-size">{formatBytes(chunk.size)}</span>
                      <span className="chunk-compression">
                        {chunk.compressionRatio}% compressed
                      </span>
                      <span className={`chunk-cache ${chunk.cached ? 'cached' : 'not-cached'}`}>
                        {chunk.cached ? '💾' : '🌐'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <div className="alerts-header">
              <h4>Performance Alerts</h4>
              <div className="alert-filters">
                {['all', 'error', 'warning'].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-button ${alertFilter === filter ? 'active' : ''}`}
                    onClick={() => setAlertFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
                <button className="clear-alerts" onClick={performanceData.clearAlerts}>
                  Clear All
                </button>
              </div>
            </div>

            <div className="alerts-list">
              {filteredAlerts.length === 0 ? (
                <div className="no-alerts">No alerts to display</div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-header">
                      <span className="alert-type">{alert.type.toUpperCase()}</span>
                      <span className="alert-time">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    {alert.data && (
                      <div className="alert-data">
                        <pre>{JSON.stringify(alert.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PerformanceDashboardComponent.propTypes = {
  componentName: PropTypes.string,
  isVisible: PropTypes.bool,
};

export const PerformanceDashboard = React.memo(PerformanceDashboardComponent);
PerformanceDashboard.displayName = 'PerformanceDashboard';
