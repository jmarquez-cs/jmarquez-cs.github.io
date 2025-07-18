import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../hooks/useTheme';
import { useBundleAnalyzer, usePerformanceBudget } from '../../hooks/usePerformanceMonitor';
import { useBundleAnalyzerVisibility } from '../../hooks/useBundleAnalyzerVisibility';
import BundleAnalyzerToggle from './BundleAnalyzerToggle';
import './BundleAnalyzer.css';

// Utility functions moved outside component to prevent re-creation
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getScoreColor = (score) => {
  switch (score) {
    case 'A':
      return '#4caf50';
    case 'B':
      return '#8bc34a';
    case 'C':
      return '#ff9800';
    case 'D':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

const getScoreGrade = (score) => {
  if (score >= 90) return { grade: 'A', color: '#4caf50' };
  if (score >= 80) return { grade: 'B', color: '#8bc34a' };
  if (score >= 70) return { grade: 'C', color: '#ff9800' };
  return { grade: 'D', color: '#f44336' };
};

// Performance Score Component - isolated responsibility
const PerformanceScores = React.memo(({ performanceScore }) => (
  <div className="metric-card performance-scores">
    <h4>🎯 Performance Scores</h4>
    <div className="score-grid">
      <div className="score-item">
        <span className="score-label">Bundle Size</span>
        <span className="score-value" style={{ color: getScoreColor(performanceScore.bundleSize) }}>
          {performanceScore.bundleSize}
        </span>
      </div>
      <div className="score-item">
        <span className="score-label">Compression</span>
        <span
          className="score-value"
          style={{ color: getScoreColor(performanceScore.compression) }}
        >
          {performanceScore.compression}
        </span>
      </div>
      <div className="score-item">
        <span className="score-label">Caching</span>
        <span className="score-value" style={{ color: getScoreColor(performanceScore.caching) }}>
          {performanceScore.caching}
        </span>
      </div>
    </div>
  </div>
));

PerformanceScores.displayName = 'PerformanceScores';
PerformanceScores.propTypes = {
  performanceScore: PropTypes.object.isRequired,
};

// Bundle Summary Component - isolated responsibility
const BundleSummary = React.memo(({ totalSize, compressedSize, compressionRatio, chunksCount }) => (
  <div className="metric-card bundle-summary">
    <h4>📈 Bundle Summary</h4>
    <div className="summary-stats">
      <div className="stat">
        <span className="stat-value">{formatSize(totalSize)}</span>
        <span className="stat-label">Total Size</span>
      </div>
      <div className="stat">
        <span className="stat-value">{formatSize(compressedSize)}</span>
        <span className="stat-label">Compressed</span>
      </div>
      <div className="stat">
        <span className="stat-value">{compressionRatio}%</span>
        <span className="stat-label">Compression</span>
      </div>
      <div className="stat">
        <span className="stat-value">{chunksCount}</span>
        <span className="stat-label">Chunks</span>
      </div>
    </div>
  </div>
));

BundleSummary.displayName = 'BundleSummary';
BundleSummary.propTypes = {
  totalSize: PropTypes.number.isRequired,
  compressedSize: PropTypes.number.isRequired,
  compressionRatio: PropTypes.string.isRequired,
  chunksCount: PropTypes.number.isRequired,
};

// Budget Status Component - isolated responsibility
const BudgetStatus = React.memo(({ budgetStatus }) => (
  <div className="metric-card budget-status">
    <h4>Budget Status</h4>
    <div className={`budget-indicator ${budgetStatus.passed ? 'passed' : 'failed'}`}>
      <span className="budget-icon">{budgetStatus.passed ? '✅' : '❌'}</span>
      <span className="budget-text">
        {budgetStatus.passed
          ? 'All budgets met'
          : `${budgetStatus.warnings?.length || 0} violations`}
      </span>
    </div>
    {!budgetStatus.passed &&
      budgetStatus.warnings?.slice(0, 3).map((warning, index) => (
        <div key={index} className="budget-violation">
          <span className="violation-message">{warning}</span>
        </div>
      ))}
  </div>
));

BudgetStatus.displayName = 'BudgetStatus';
BudgetStatus.propTypes = {
  budgetStatus: PropTypes.object.isRequired,
};

// Chunks Tab Component - isolated responsibility
const ChunksTab = React.memo(({ chunks }) => {
  const sortedChunks = [...chunks].sort((a, b) => (b.size || 0) - (a.size || 0));
  const largestChunks = sortedChunks.slice(0, 10);

  return (
    <div className="chunks-tab">
      <div className="chunks-analysis">
        <h4>🔥 Largest Chunks (Top 10)</h4>
        <div className="chunks-list">
          {largestChunks.map((chunk, index) => (
            <div key={index} className="chunk-item detailed">
              <div className="chunk-info">
                <span className="chunk-name">{chunk.name}</span>
                <span className="chunk-type">{chunk.type || 'js'}</span>
              </div>
              <div className="chunk-metrics">
                <span className="chunk-size">{formatSize(chunk.size || 0)}</span>
                <span className="chunk-compressed">{formatSize(chunk.compressedSize || 0)}</span>
                <span className="chunk-compression">{chunk.compressionRatio}%</span>
                <span className="chunk-load-time">{chunk.loadTime?.toFixed(2) || 0}ms</span>
                {chunk.cached && <span className="cached-indicator">💾</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="all-chunks">
        <h4>📂 All Chunks ({chunks.length})</h4>
        <div className="chunks-container">
          {sortedChunks.map((chunk, index) => (
            <div key={index} className="chunk-item compact">
              <span className="chunk-name">{chunk.name}</span>
              <span className="chunk-size">{formatSize(chunk.size || 0)}</span>
              <span className="chunk-load-time">{chunk.loadTime?.toFixed(2) || 0}ms</span>
              {chunk.cached && <span className="cached-indicator">📦</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ChunksTab.displayName = 'ChunksTab';
ChunksTab.propTypes = {
  chunks: PropTypes.array.isRequired,
};

// Dependencies Tab Component - isolated responsibility
const DependenciesTab = React.memo(({ dependencies, totalSize }) => {
  const sortedDependencies = Object.entries(dependencies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="dependencies-tab">
      <div className="dependencies-analysis">
        <h4>📚 Largest Dependencies</h4>
        {sortedDependencies.length > 0 ? (
          <div className="dependencies-list">
            {sortedDependencies.map(([name, size], index) => (
              <div key={index} className="dependency-item">
                <div className="dependency-info">
                  <span className="dependency-name">{name}</span>
                </div>
                <div className="dependency-metrics">
                  <span className="dependency-size">{formatSize(size)}</span>
                  <span className="dependency-percentage">
                    {((size / totalSize) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-dependencies">No dependency data available</div>
        )}
      </div>
    </div>
  );
});

DependenciesTab.displayName = 'DependenciesTab';
DependenciesTab.propTypes = {
  dependencies: PropTypes.object.isRequired,
  totalSize: PropTypes.number.isRequired,
};

// Recommendations Tab Component - isolated responsibility
const RecommendationsTab = React.memo(({ recommendations }) => (
  <div className="recommendations-tab">
    <div className="recommendations">
      <h4>💡 Optimization Recommendations</h4>
      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-icon">💡</div>
              <div className="recommendation-content">
                <span className="recommendation-text">{rec}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <div className="success-message">
            <span className="success-icon">✅</span>
            <span>All optimization recommendations met!</span>
          </div>
        </div>
      )}
    </div>
  </div>
));

RecommendationsTab.displayName = 'RecommendationsTab';
RecommendationsTab.propTypes = {
  recommendations: PropTypes.array.isRequired,
};

// Main component - now focused on state and layout
const BundleAnalyzerComponent = ({ isVisible = true }) => {
  const { totalSize, compressedSize, chunks, dependencies, cacheEfficiency } = useBundleAnalyzer();
  const budgetStatus = usePerformanceBudget();
  const { theme } = useTheme();
  const { hideBundleAnalyzer, toggleVisibility } = useBundleAnalyzerVisibility();
  const [activeTab, setActiveTab] = useState('overview');

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  // Simple calculations moved to render time - no unnecessary memoization
  const overallCompressionRatio =
    totalSize > 0 ? (((totalSize - compressedSize) / totalSize) * 100).toFixed(1) : 0;

  const performanceScore = {
    bundleSize:
      totalSize < 300000 ? 'A' : totalSize < 500000 ? 'B' : totalSize < 1000000 ? 'C' : 'D',
    compression:
      overallCompressionRatio > 70
        ? 'A'
        : overallCompressionRatio > 50
          ? 'B'
          : overallCompressionRatio > 30
            ? 'C'
            : 'D',
    caching:
      parseFloat(cacheEfficiency) > 80
        ? 'A'
        : parseFloat(cacheEfficiency) > 60
          ? 'B'
          : parseFloat(cacheEfficiency) > 40
            ? 'C'
            : 'D',
  };

  const recommendations = [];
  if (totalSize > 500000) {
    recommendations.push('Consider code splitting for large chunks');
  }
  if (overallCompressionRatio < 50) {
    recommendations.push('Enable gzip/brotli compression');
  }
  if (parseFloat(cacheEfficiency) < 60) {
    recommendations.push('Implement better caching strategies');
  }
  if (chunks.length > 0 && chunks[0]?.size > 200000) {
    recommendations.push('Split large chunks into smaller modules');
  }

  const overallScore = (() => {
    const sizeScore =
      totalSize < 300000 ? 25 : totalSize < 500000 ? 20 : totalSize < 1000000 ? 15 : 10;
    const compressionScore =
      overallCompressionRatio > 70
        ? 25
        : overallCompressionRatio > 50
          ? 20
          : overallCompressionRatio > 30
            ? 15
            : 10;
    const cachingScore =
      parseFloat(cacheEfficiency) > 80
        ? 25
        : parseFloat(cacheEfficiency) > 60
          ? 20
          : parseFloat(cacheEfficiency) > 40
            ? 15
            : 10;
    const chunksScore =
      chunks.length < 10 ? 25 : chunks.length < 20 ? 20 : chunks.length < 30 ? 15 : 10;
    return sizeScore + compressionScore + cachingScore + chunksScore;
  })();

  const { grade, color: gradeColor } = getScoreGrade(overallScore);

  return (
    <>
      <BundleAnalyzerToggle isVisible={isVisible} onToggle={toggleVisibility} />
      {isVisible && (
        <div className={`bundle-analyzer ${theme}`}>
          <div className="bundle-analyzer-header">
            <div className="header-content">
              <h3>📊 Bundle Analyzer</h3>
              <div className="header-controls">
                <div className="bundle-score">
                  <span className="score-label">Bundle Score</span>
                  <span className="score-value" style={{ color: gradeColor }}>
                    {overallScore}/100 ({grade})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bundle-analyzer-tabs">
            {['overview', 'chunks', 'dependencies', 'recommendations'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="bundle-analyzer-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="metrics-grid">
                  <PerformanceScores performanceScore={performanceScore} />
                  <BundleSummary
                    totalSize={totalSize}
                    compressedSize={compressedSize}
                    compressionRatio={overallCompressionRatio}
                    chunksCount={chunks.length}
                  />
                  <BudgetStatus budgetStatus={budgetStatus} />
                </div>
              </div>
            )}

            {activeTab === 'chunks' && <ChunksTab chunks={chunks} />}

            {activeTab === 'dependencies' && (
              <DependenciesTab dependencies={dependencies} totalSize={totalSize} />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsTab recommendations={recommendations} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

BundleAnalyzerComponent.displayName = 'BundleAnalyzer';
BundleAnalyzerComponent.propTypes = {
  isVisible: PropTypes.bool,
};

export const BundleAnalyzer = React.memo(BundleAnalyzerComponent);
