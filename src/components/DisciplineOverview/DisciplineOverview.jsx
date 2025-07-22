import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import DisciplineCategory from '../DisciplineCategory';
import { usePortfolio } from '../../hooks/usePortfolio';
import { disciplineUtils } from '../../data/professionalDisciplines';
import './DisciplineOverview.css';

const DisciplineOverview = ({
  showProgression = true,
  interactive = true,
  layout = 'grid', // 'grid' | 'list' | 'timeline'
  className = '',
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [sortBy, setSortBy] = useState('proficiency'); // 'proficiency' | 'projects' | 'name'

  const { disciplines, portfolioPreferences } = usePortfolio();

  // Calculate discipline metrics and sort
  const disciplinesWithMetrics = useMemo(() => {
    return disciplines
      .map((discipline) => ({
        ...discipline,
        proficiency: disciplineUtils.calculateDisciplineProficiency(discipline.id, portfolioSchema),
        projectCount: disciplineUtils.getProjectsByDiscipline(discipline.id, portfolioSchema)
          .length,
        techCount: disciplineUtils.getDisciplineTechnologies(discipline.id, portfolioSchema).length,
      }))
      .sort((a, b) => {
        switch (sortBy) {
          case 'proficiency':
            return b.proficiency - a.proficiency;
          case 'projects':
            return b.projectCount - a.projectCount;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [disciplines, sortBy]);

  // Overall portfolio metrics
  const overallMetrics = useMemo(() => {
    const totalProficiency = disciplinesWithMetrics.reduce((sum, d) => sum + d.proficiency, 0);
    const avgProficiency = Math.round(totalProficiency / disciplinesWithMetrics.length);
    const totalProjects = disciplinesWithMetrics.reduce((sum, d) => sum + d.projectCount, 0);
    const totalTechnologies = new Set(
      disciplinesWithMetrics.flatMap((d) =>
        disciplineUtils.getDisciplineTechnologies(d.id, portfolioSchema).map((t) => t.id),
      ),
    ).size;

    return {
      avgProficiency,
      totalProjects,
      totalTechnologies,
      strongestDiscipline: disciplinesWithMetrics[0],
      mostProjectsDiscipline: disciplinesWithMetrics.sort(
        (a, b) => b.projectCount - a.projectCount,
      )[0],
    };
  }, [disciplinesWithMetrics]);

  const handleDisciplineClick = (discipline) => {
    if (interactive) {
      setSelectedDiscipline(selectedDiscipline?.id === discipline.id ? null : discipline);
    }
  };

  return (
    <div className={`discipline-overview ${layout} ${className}`}>
      {/* Overview Header */}
      <div className="discipline-overview-header">
        <div className="overview-title">
          <h2>Professional Disciplines</h2>
          <p>Technology expertise across career specializations</p>
        </div>

        {/* Overall Metrics */}
        <div className="overall-metrics">
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.avgProficiency}%</div>
            <div className="metric-label">Avg Proficiency</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.totalProjects}</div>
            <div className="metric-label">Total Projects</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{overallMetrics.totalTechnologies}</div>
            <div className="metric-label">Technologies</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{disciplinesWithMetrics.length}</div>
            <div className="metric-label">Disciplines</div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <label htmlFor="discipline-sort">Sort by:</label>
          <select id="discipline-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="proficiency">Proficiency</option>
            <option value="projects">Project Count</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Discipline Grid/List */}
      <div className={`disciplines-container ${layout}`}>
        {disciplinesWithMetrics.map((discipline) => (
          <DisciplineCategory
            key={discipline.id}
            discipline={discipline}
            showProgression={showProgression}
            interactive={interactive}
            size={layout === 'grid' ? 'md' : 'lg'}
            onDisciplineClick={handleDisciplineClick}
            className={selectedDiscipline?.id === discipline.id ? 'selected' : ''}
          />
        ))}
      </div>

      {/* Detailed View for Selected Discipline */}
      {selectedDiscipline && (
        <div className="selected-discipline-detail">
          <div className="detail-header">
            <h3>{selectedDiscipline.name} - Detailed Analysis</h3>
            <button
              onClick={() => setSelectedDiscipline(null)}
              className="close-detail"
              aria-label="Close detailed view"
            >
              ×
            </button>
          </div>

          <div className="detail-content">
            {/* Enhanced discipline analysis could go here */}
            <div className="discipline-insights">
              <div className="insight-card">
                <h4>Proficiency Analysis</h4>
                <p>
                  Your {selectedDiscipline.proficiency}% proficiency in {selectedDiscipline.name}
                  places you in the{' '}
                  {selectedDiscipline.proficiency >= 80
                    ? 'expert'
                    : selectedDiscipline.proficiency >= 60
                      ? 'advanced'
                      : selectedDiscipline.proficiency >= 40
                        ? 'intermediate'
                        : 'beginner'}{' '}
                  tier.
                </p>
              </div>

              <div className="insight-card">
                <h4>Growth Opportunities</h4>
                <p>
                  Consider expanding your expertise in emerging technologies within this discipline
                  to reach the next proficiency level.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Insights */}
      <div className="professional-insights">
        <h3>Professional Development Insights</h3>
        <div className="insights-grid">
          <div className="insight-card highlight">
            <h4>Strongest Discipline</h4>
            <div className="insight-content">
              <overallMetrics.strongestDiscipline.icon className="insight-icon" />
              <div>
                <span className="insight-value">{overallMetrics.strongestDiscipline.name}</span>
                <span className="insight-detail">
                  {overallMetrics.strongestDiscipline.proficiency}% proficiency
                </span>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h4>Most Active</h4>
            <div className="insight-content">
              <overallMetrics.mostProjectsDiscipline.icon className="insight-icon" />
              <div>
                <span className="insight-value">{overallMetrics.mostProjectsDiscipline.name}</span>
                <span className="insight-detail">
                  {overallMetrics.mostProjectsDiscipline.projectCount} projects
                </span>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h4>Technology Breadth</h4>
            <div className="insight-content">
              <span className="insight-value">{overallMetrics.totalTechnologies} Technologies</span>
              <span className="insight-detail">
                Across {disciplinesWithMetrics.length} disciplines
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DisciplineOverview.propTypes = {
  showProgression: PropTypes.bool,
  interactive: PropTypes.bool,
  layout: PropTypes.oneOf(['grid', 'list', 'timeline']),
  className: PropTypes.string,
};

export default DisciplineOverview;
