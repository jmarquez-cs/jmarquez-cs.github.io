import React from 'react';
import PropTypes from 'prop-types';
import { useSEOMonitoring } from '../../hooks/useSEOMonitoring.js';
import './SEODashboard.css';

export const SEODashboard = ({ isVisible = false }) => {
  const { seoMetrics, auditResults, isMonitoring } = useSEOMonitoring();

  if (!isVisible) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const formatMetric = (value, type) => {
    if (type === 'time') return `${Math.round(value)}ms`;
    if (type === 'score') return Math.round(value);
    if (type === 'position') return `#${Math.round(value)}`;
    return value;
  };

  return (
    <div className="seo-dashboard">
      <div className="seo-dashboard-header">
        <h3>SEO Performance Monitor</h3>
        <div className={`seo-status ${isMonitoring ? 'monitoring' : 'stopped'}`}>
          {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}
        </div>
      </div>

      <div className="seo-metrics-grid">
        {/* Core Web Vitals */}
        <div className="seo-metric-card">
          <h4>Core Web Vitals</h4>
          <div className="metric-items">
            <div className="metric-item">
              <span className="metric-label">LCP:</span>
              <span
                className="metric-value"
                style={{
                  color:
                    seoMetrics.coreWebVitals.LCP.current <= seoMetrics.coreWebVitals.LCP.target
                      ? '#10B981'
                      : '#EF4444',
                }}
              >
                {seoMetrics.coreWebVitals.LCP.current
                  ? formatMetric(seoMetrics.coreWebVitals.LCP.current, 'time')
                  : 'Measuring...'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">FID:</span>
              <span
                className="metric-value"
                style={{
                  color:
                    seoMetrics.coreWebVitals.FID.current <= seoMetrics.coreWebVitals.FID.target
                      ? '#10B981'
                      : '#EF4444',
                }}
              >
                {seoMetrics.coreWebVitals.FID.current
                  ? formatMetric(seoMetrics.coreWebVitals.FID.current, 'time')
                  : 'Measuring...'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">CLS:</span>
              <span
                className="metric-value"
                style={{
                  color:
                    seoMetrics.coreWebVitals.CLS.current <= seoMetrics.coreWebVitals.CLS.target
                      ? '#10B981'
                      : '#EF4444',
                }}
              >
                {seoMetrics.coreWebVitals.CLS.current
                  ? seoMetrics.coreWebVitals.CLS.current.toFixed(3)
                  : 'Measuring...'}
              </span>
            </div>
          </div>
        </div>

        {/* Search Visibility */}
        <div className="seo-metric-card">
          <h4>Search Visibility</h4>
          <div className="metric-items">
            <div className="metric-item">
              <span className="metric-label">Indexed Pages:</span>
              <span className="metric-value">{seoMetrics.searchVisibility.indexedPages}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Keywords:</span>
              <span className="metric-value">{seoMetrics.searchVisibility.organicKeywords}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Impressions:</span>
              <span className="metric-value">
                {seoMetrics.searchVisibility.searchImpressions.toLocaleString()}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Position:</span>
              <span className="metric-value">
                {formatMetric(seoMetrics.searchVisibility.averagePosition, 'position')}
              </span>
            </div>
          </div>
        </div>

        {/* Technical SEO */}
        <div className="seo-metric-card">
          <h4>Technical SEO</h4>
          <div className="metric-items">
            <div className="metric-item">
              <span className="metric-label">Meta Tags:</span>
              <span
                className={`metric-status ${seoMetrics.technicalSEO.metaTagsOptimized ? 'good' : 'needs-work'}`}
              >
                {seoMetrics.technicalSEO.metaTagsOptimized ? '✅' : '❌'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Structured Data:</span>
              <span
                className={`metric-status ${seoMetrics.technicalSEO.structuredDataValid ? 'good' : 'needs-work'}`}
              >
                {seoMetrics.technicalSEO.structuredDataValid ? '✅' : '❌'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Canonical URLs:</span>
              <span
                className={`metric-status ${seoMetrics.technicalSEO.canonicalUrlsSet ? 'good' : 'needs-work'}`}
              >
                {seoMetrics.technicalSEO.canonicalUrlsSet ? '✅' : '❌'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Sitemap:</span>
              <span
                className={`metric-status ${seoMetrics.technicalSEO.sitemapValid ? 'good' : 'needs-work'}`}
              >
                {seoMetrics.technicalSEO.sitemapValid ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>

        {/* SEO Audit Results */}
        {auditResults && (
          <div className="seo-metric-card">
            <h4>SEO Audit Score</h4>
            <div
              className="audit-score"
              style={{ color: getScoreColor(auditResults.overallScore) }}
            >
              {auditResults.overallScore}/100
            </div>
            {auditResults.issues.length > 0 && (
              <div className="audit-issues">
                <strong>Issues:</strong>
                <ul>
                  {auditResults.issues.slice(0, 3).map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SEODashboard.propTypes = {
  isVisible: PropTypes.bool,
};

SEODashboard.displayName = 'SEODashboard';
