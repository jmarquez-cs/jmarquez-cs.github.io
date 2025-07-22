import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import TechnologyIcon from '../TechnologyIcon';
import { disciplineUtils, disciplinePropTypes } from '../../data/professionalDisciplines';
import { portfolioSchema } from '../../data/portfolioData';
import './DisciplineCategory.css';

const DisciplineCategory = ({
  discipline,
  showProgression = false,
  interactive = true,
  size = 'md',
  onDisciplineClick = null,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('mid');

  // Calculate proficiency and get related data
  const proficiency = useMemo(
    () => disciplineUtils.calculateDisciplineProficiency(discipline.id, portfolioSchema),
    [discipline.id],
  );

  const disciplineTechnologies = useMemo(
    () => disciplineUtils.getDisciplineTechnologies(discipline.id, portfolioSchema),
    [discipline.id],
  );

  const relatedProjects = useMemo(
    () => disciplineUtils.getProjectsByDiscipline(discipline.id, portfolioSchema),
    [discipline.id],
  );

  const currentSkillLevel = discipline.skillLevels[selectedSkillLevel];
  const careerProgression = disciplineUtils.getCareerProgression(discipline.id);

  const handleDisciplineClick = () => {
    if (interactive) {
      setIsExpanded(!isExpanded);
    }
    if (onDisciplineClick) {
      onDisciplineClick(discipline);
    }
  };

  const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 80) return 'expert';
    if (proficiency >= 60) return 'advanced';
    if (proficiency >= 40) return 'intermediate';
    return 'beginner';
  };

  const proficiencyLevel = getProficiencyLevel(proficiency);

  return (
    <div
      className={`discipline-category ${size} ${proficiencyLevel} ${isExpanded ? 'expanded' : ''} ${className}`}
      style={{
        '--discipline-color': discipline.color,
        '--discipline-gradient': discipline.gradient,
      }}
    >
      {/* Header */}
      <div
        className="discipline-header"
        onClick={handleDisciplineClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDisciplineClick();
          }
        }}
        tabIndex={interactive ? 0 : -1}
        role={interactive ? 'button' : 'presentation'}
        aria-expanded={isExpanded}
        aria-label={`${discipline.name} discipline category`}
      >
        <div className="discipline-icon-container">
          <discipline.icon className="discipline-main-icon" />
          <div className="proficiency-indicator">
            <div className="proficiency-fill" style={{ width: `${proficiency}%` }} />
          </div>
        </div>

        <div className="discipline-info">
          <h3 className="discipline-name">{discipline.name}</h3>
          <p className="discipline-description">{discipline.description}</p>
          <div className="discipline-stats">
            <span className="proficiency-badge">{proficiency}% Proficiency</span>
            <span className="project-count">{relatedProjects.length} Projects</span>
            <span className="tech-count">{disciplineTechnologies.length} Technologies</span>
          </div>
        </div>

        {interactive && (
          <div className="expansion-indicator">
            <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
        )}
      </div>

      {/* Technology Icons Preview */}
      <div className="technology-preview">
        {disciplineTechnologies.slice(0, 6).map((tech, index) => (
          <div key={tech.id} className="preview-icon" style={{ animationDelay: `${index * 0.1}s` }}>
            <TechnologyIcon
              technologyId={tech.id}
              size="sm"
              showLabel={false}
              expertise={proficiencyLevel}
            />
          </div>
        ))}
        {disciplineTechnologies.length > 6 && (
          <div className="more-technologies">+{disciplineTechnologies.length - 6}</div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="discipline-expanded-content">
          {/* Skill Level Selector */}
          <div className="skill-level-selector">
            <h4>Career Progression</h4>
            <div className="skill-level-tabs">
              {Object.keys(discipline.skillLevels).map((level) => (
                <button
                  key={level}
                  className={`skill-tab ${selectedSkillLevel === level ? 'active' : ''}`}
                  onClick={() => setSelectedSkillLevel(level)}
                >
                  {discipline.skillLevels[level].title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Skill Level Details */}
          <div className="skill-level-details">
            <div className="skill-level-header">
              <h5>{currentSkillLevel.title}</h5>
              <span className="experience-years">{currentSkillLevel.years}</span>
            </div>
            <div className="key-skills">
              <h6>Key Skills:</h6>
              <div className="skills-list">
                {currentSkillLevel.keySkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* All Technologies */}
          <div className="all-technologies">
            <h4>Technologies</h4>
            <div className="technology-grid">
              {disciplineTechnologies.map((tech) => (
                <TechnologyIcon
                  key={tech.id}
                  technologyId={tech.id}
                  size="md"
                  showLabel={true}
                  expertise={proficiencyLevel}
                  animated={true}
                />
              ))}
            </div>
          </div>

          {/* Career Progression Visualization */}
          {showProgression && careerProgression.length > 0 && (
            <div className="career-progression">
              <h4>Career Evolution</h4>
              <div className="progression-timeline">
                {careerProgression.map((milestone, index) => (
                  <div key={index} className="timeline-milestone">
                    <div className="milestone-year">{milestone.year}</div>
                    <div className="milestone-content">
                      <div className="milestone-level">{milestone.level}</div>
                      <div className="milestone-technologies">
                        {milestone.technologies.map((techId) => {
                          const tech = portfolioSchema.technologies.byId[techId];
                          return tech ? (
                            <TechnologyIcon
                              key={techId}
                              technologyId={techId}
                              size="xs"
                              showLabel={false}
                            />
                          ) : null;
                        })}
                      </div>
                      <div className="milestone-projects">
                        {milestone.projects.map((project, idx) => (
                          <span key={idx} className="project-badge">
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="related-projects">
              <h4>Related Projects</h4>
              <div className="projects-list">
                {relatedProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="project-card-mini">
                    <h6>{project.title}</h6>
                    <p>{project.description.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

DisciplineCategory.propTypes = {
  discipline: disciplinePropTypes.discipline.isRequired,
  showProgression: PropTypes.bool,
  interactive: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onDisciplineClick: PropTypes.func,
  className: PropTypes.string,
};

export default DisciplineCategory;
