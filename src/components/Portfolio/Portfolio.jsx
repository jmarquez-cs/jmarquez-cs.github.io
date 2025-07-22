import React, { useTransition, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useConfetti } from '../../hooks/useConfetti';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { usePortfolio } from '../../hooks/usePortfolio';
import './Portfolio.css';

const PortfolioComponent = () => {
  usePerformanceMonitor('Portfolio');
  const { triggerConfetti } = useConfetti();
  const [isPending, startTransition] = useTransition();

  const {
    filteredProjects,
    getProjectTechnologies,
    selectedCategory,
    setSelectedCategory,
    selectedDiscipline,
    setSelectedDiscipline,
    categories,
    disciplines,
  } = usePortfolio();

  const handleProjectClick = useCallback(
    async (project, event) => {
      const projectCard = event.currentTarget;

      // Optimistic feedback - immediate visual response
      projectCard.style.transform = 'translateY(-4px)';
      projectCard.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      projectCard.style.transition = 'all 0.2s ease';

      try {
        // Trigger confetti effect
        await triggerConfetti(projectCard);

        // Track project interaction (could be analytics call)
        console.log(`Clicked on project: ${project.title}`);

        // Simulate successful interaction (e.g., navigation, modal open)
        setTimeout(() => {
          projectCard.style.transform = '';
          projectCard.style.boxShadow = '';
        }, 300);
      } catch (error) {
        // Rollback on error
        console.error('Project interaction failed:', error);
        projectCard.style.transform = '';
        projectCard.style.boxShadow = '';
        projectCard.style.borderColor = '#ff6b6b';

        setTimeout(() => {
          projectCard.style.borderColor = '';
        }, 1000);
      }
    },
    [triggerConfetti],
  );

  const handleCategoryFilter = useCallback(
    (category) => {
      startTransition(() => {
        setSelectedCategory(category);
        setSelectedDiscipline('all'); // Reset discipline when changing category
      });
    },
    [setSelectedCategory, setSelectedDiscipline, startTransition],
  );

  const handleDisciplineFilter = useCallback(
    (discipline) => {
      startTransition(() => {
        setSelectedDiscipline(discipline);
        setSelectedCategory('all'); // Reset category when changing discipline
      });
    },
    [setSelectedDiscipline, setSelectedCategory, startTransition],
  );

  return (
    <section id="portfolio" className="section section-alt">
      <div className="container">
        <h2 className="section-title">PORTFOLIO</h2>

        {/* Filter Tabs */}
        <div className="portfolio-filter-tabs">
          <div className="filter-tab-group">
            <h3>Filter by Category</h3>
            <div className="portfolio-filters">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('all')}
              >
                All Projects
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.id)}
                  style={{ '--category-color': category.color }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-tab-group">
            <h3>Filter by Discipline</h3>
            <div className="portfolio-filters">
              <button
                className={`filter-btn ${selectedDiscipline === 'all' ? 'active' : ''}`}
                onClick={() => handleDisciplineFilter('all')}
              >
                All Disciplines
              </button>
              {disciplines.map((discipline) => (
                <button
                  key={discipline.id}
                  className={`filter-btn discipline-filter ${selectedDiscipline === discipline.id ? 'active' : ''}`}
                  onClick={() => handleDisciplineFilter(discipline.id)}
                  style={{ '--discipline-color': discipline.color }}
                >
                  {discipline.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((project) => {
            const technologies = getProjectTechnologies(project.id);

            return (
              <div
                key={project.id}
                className={`project-card ${project.gradient} ${isPending ? 'transitioning' : ''}`}
                onClick={(event) => handleProjectClick(project, event)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProjectClick(project, e);
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label={`View ${project.title} project details`}
              >
                <div className="project-image">
                  <span>{project.title}</span>
                </div>
                <div className="project-content">
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {technologies.map((tech) => (
                      <span key={tech.id} className="tag" style={{ '--tech-color': tech.color }}>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  {project.metrics && (
                    <div className="project-metrics">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="metric">
                          <span className="metric-label">{key}:</span>
                          <span className="metric-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const Portfolio = React.memo(PortfolioComponent);
