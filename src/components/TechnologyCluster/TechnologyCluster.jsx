import PropTypes from 'prop-types';
import TechnologyIcon from '../TechnologyIcon';
import { portfolioSelectors } from '../../data/portfolioData';
import './TechnologyCluster.css';

const TechnologyCluster = ({
  projectId,
  portfolioData,
  maxVisible = 6,
  sizeVariant = 'sm',
  animated = true,
  showOverflow = true,
}) => {
  const technologies = portfolioSelectors.getProjectTechnologies(portfolioData, projectId);

  const visibleTechnologies = technologies.slice(0, maxVisible);
  const overflowCount = technologies.length - maxVisible;

  return (
    <div className={`technology-cluster ${animated ? 'animated' : ''}`}>
      <div className="technology-cluster-icons">
        {visibleTechnologies.map((tech, index) => (
          <div
            key={tech.id}
            className="cluster-icon-wrapper"
            style={{
              zIndex: visibleTechnologies.length - index,
              animationDelay: animated ? `${index * 0.1}s` : '0s',
            }}
          >
            <TechnologyIcon
              technologyId={tech.id}
              technology={tech}
              sizeVariant={sizeVariant}
              expertiseLevel="advanced"
              animated={animated}
              showTooltip={true}
            />
          </div>
        ))}
      </div>

      {showOverflow && overflowCount > 0 && (
        <div className="overflow-indicator">
          <span className="overflow-count">+{overflowCount}</span>
        </div>
      )}
    </div>
  );
};

TechnologyCluster.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  portfolioData: PropTypes.object.isRequired,
  maxVisible: PropTypes.number,
  sizeVariant: PropTypes.oneOf(['sm', 'md', 'lg']),
  animated: PropTypes.bool,
  showOverflow: PropTypes.bool,
};

export default TechnologyCluster;
