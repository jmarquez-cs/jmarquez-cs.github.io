import React from 'react';
import PropTypes from 'prop-types';
import {
  getTechnologyIcon,
  getTechnologyDiscipline,
  technologyIconMap,
  iconSizes,
} from '../../data/technologyIcons';
import './TechnologyIcon.css';

const TechnologyIcon = ({
  technologyId,
  technology,
  size = 24,
  sizeVariant = 'md', // xs, sm, md, lg, xl, 2xl
  showTooltip = true,
  showDiscipline = false,
  expertiseLevel = 'intermediate',
  animated = true,
  glowing = false,
}) => {
  const iconData = technologyIconMap[technologyId];
  const discipline = getTechnologyDiscipline(technologyId);

  if (!iconData) {
    return (
      <div
        className={`technology-icon fallback ${expertiseLevel}`}
        style={{ width: size, height: size }}
        title={technology?.name || 'Technology'}
      >
        {technology?.name?.charAt(0) || '?'}
      </div>
    );
  }

  const IconComponent = iconData.icon;
  const finalSize = sizeVariant !== 'md' ? iconSizes[sizeVariant] || iconSizes.md : size;

  const wrapperClasses = [
    'technology-icon-wrapper',
    expertiseLevel,
    animated && 'animated',
    glowing && 'glowing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <div
        className={`technology-icon ${iconData.category} size-${sizeVariant}`}
        data-tech-id={technologyId}
        title={showTooltip ? iconData.name || technology?.name || 'Technology' : undefined}
      >
        <IconComponent size={finalSize} />
      </div>
      {showDiscipline && <span className="discipline-label">{discipline}</span>}
    </div>
  );
};

TechnologyIcon.propTypes = {
  technologyId: PropTypes.string,
  technology: PropTypes.shape({
    name: PropTypes.string,
    discipline: PropTypes.string,
  }),
  size: PropTypes.number,
  sizeVariant: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  showTooltip: PropTypes.bool,
  showDiscipline: PropTypes.bool,
  expertiseLevel: PropTypes.oneOf(['beginner', 'intermediate', 'advanced', 'expert']),
  animated: PropTypes.bool,
  glowing: PropTypes.bool,
};

export default TechnologyIcon;
