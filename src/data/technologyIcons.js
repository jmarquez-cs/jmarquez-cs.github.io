import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGithub,
  FaLinux,
  FaGitAlt,
  FaPython,
  FaJs,
  FaDatabase,
  FaServer,
  FaCloud,
  FaCogs,
  FaShieldAlt,
} from 'react-icons/fa';
import {
  SiMongodb,
  SiKubernetes,
  SiTerraform,
  SiGooglecloud,
  SiGo,
  SiNginx,
  SiPostgresql,
  SiElasticsearch,
  SiIpfs,
  SiEthereum,
  SiBitcoin,
  SiExpress,
  SiJenkins,
  SiPrometheus,
  SiTypescript,
  SiAmazonwebservices,
} from 'react-icons/si';
import { DiScrum } from 'react-icons/di';
import { BsGear, BsPeople, BsLightbulb, BsGraphUp, BsShield, BsCpu } from 'react-icons/bs';

// Icon mapping based on Professional Disciplines Framework
export const technologyIconMap = {
  // Frontend Development Icons
  1: { icon: FaReact, category: 'frontend', discipline: 'Frontend Development', name: 'React' },
  25: { icon: FaJs, category: 'frontend', discipline: 'Frontend Development', name: 'JavaScript' },

  // Backend Systems Icons
  2: { icon: FaNodeJs, category: 'backend', discipline: 'Backend Systems', name: 'Node.js' },
  11: { icon: FaPython, category: 'backend', discipline: 'Backend Systems', name: 'Python' },
  18: { icon: SiGo, category: 'backend', discipline: 'Backend Systems', name: 'Go' },
  21: { icon: SiExpress, category: 'backend', discipline: 'Backend Systems', name: 'Express' },
  26: { icon: FaLinux, category: 'devops', discipline: 'Backend Systems', name: 'Linux' },

  // Database Systems Icons
  3: { icon: SiMongodb, category: 'database', discipline: 'Backend Systems', name: 'MongoDB' },
  27: {
    icon: SiPostgresql,
    category: 'database',
    discipline: 'Backend Systems',
    name: 'PostgreSQL',
  },
  28: {
    icon: SiElasticsearch,
    category: 'database',
    discipline: 'Backend Systems',
    name: 'Elasticsearch',
  },
  44: { icon: FaDatabase, category: 'database', discipline: 'Backend Systems', name: 'Database' },

  // DevOps/Infrastructure Icons
  4: { icon: FaDocker, category: 'devops', discipline: 'DevOps/Infrastructure', name: 'Docker' },
  5: { icon: SiJenkins, category: 'devops', discipline: 'DevOps/Infrastructure', name: 'Jenkins' },
  6: {
    icon: SiKubernetes,
    category: 'devops',
    discipline: 'DevOps/Infrastructure',
    name: 'Kubernetes',
  },
  7: {
    icon: SiTerraform,
    category: 'infrastructure',
    discipline: 'DevOps/Infrastructure',
    name: 'Terraform',
  },
  29: {
    icon: SiNginx,
    category: 'infrastructure',
    discipline: 'DevOps/Infrastructure',
    name: 'Nginx',
  },
  33: { icon: BsGear, category: 'devops', discipline: 'DevOps/Infrastructure', name: 'DevOps' },
  34: {
    icon: FaLinux,
    category: 'infrastructure',
    discipline: 'DevOps/Infrastructure',
    name: 'Linux',
  },
  35: { icon: FaGitAlt, category: 'devops', discipline: 'DevOps/Infrastructure', name: 'Git' },
  36: { icon: FaGithub, category: 'devops', discipline: 'DevOps/Infrastructure', name: 'GitHub' },

  // Cloud Platforms Icons
  8: {
    icon: SiAmazonwebservices,
    category: 'cloud',
    discipline: 'DevOps/Infrastructure',
    name: 'AWS',
  },
  9: {
    icon: SiGooglecloud,
    category: 'cloud',
    discipline: 'DevOps/Infrastructure',
    name: 'Google Cloud',
  },

  // Monitoring Icons
  10: {
    icon: SiPrometheus,
    category: 'monitoring',
    discipline: 'DevOps/Infrastructure',
    name: 'Prometheus',
  },

  // Blockchain/Security Icons
  12: { icon: SiIpfs, category: 'blockchain', discipline: 'Blockchain/Security', name: 'IPFS' },
  14: {
    icon: SiBitcoin,
    category: 'blockchain',
    discipline: 'Blockchain/Security',
    name: 'Bitcoin',
  },
  16: {
    icon: FaShieldAlt,
    category: 'credentials',
    discipline: 'Blockchain/Security',
    name: 'Security',
  },
  19: {
    icon: SiTypescript,
    category: 'frontend',
    discipline: 'Frontend Development',
    name: 'TypeScript',
  },
  30: {
    icon: BsShield,
    category: 'blockchain',
    discipline: 'Blockchain/Security',
    name: 'Blockchain',
  },
  31: {
    icon: SiEthereum,
    category: 'blockchain',
    discipline: 'Blockchain/Security',
    name: 'Ethereum',
  },
  32: { icon: BsCpu, category: 'blockchain', discipline: 'Blockchain/Security', name: 'Hardware' },

  // Management/Methodology Icons
  37: {
    icon: BsLightbulb,
    category: 'methodology',
    discipline: 'Leadership/Management',
    name: 'Innovation',
  },
  38: {
    icon: DiScrum,
    category: 'methodology',
    discipline: 'Leadership/Management',
    name: 'Scrum',
  },
  39: {
    icon: BsGraphUp,
    category: 'methodology',
    discipline: 'Leadership/Management',
    name: 'Analytics',
  },
  40: {
    icon: BsPeople,
    category: 'management',
    discipline: 'Leadership/Management',
    name: 'Team Management',
  },
  41: {
    icon: BsPeople,
    category: 'management',
    discipline: 'Leadership/Management',
    name: 'Leadership',
  },
  42: {
    icon: BsLightbulb,
    category: 'management',
    discipline: 'Leadership/Management',
    name: 'Strategy',
  },
  43: {
    icon: BsGraphUp,
    category: 'management',
    discipline: 'Leadership/Management',
    name: 'Growth',
  },

  // FinTech Icons
  22: {
    icon: FaShieldAlt,
    category: 'fintech',
    discipline: 'Financial Technology',
    name: 'FinTech Security',
  },
  45: {
    icon: FaShieldAlt,
    category: 'fintech',
    discipline: 'Financial Technology',
    name: 'Financial Security',
  },

  // Architecture Icons
  23: {
    icon: FaServer,
    category: 'architecture',
    discipline: 'System Architecture',
    name: 'System Architecture',
  },
  46: {
    icon: FaCogs,
    category: 'architecture',
    discipline: 'System Architecture',
    name: 'Architecture',
  },

  // Enterprise Icons
  24: {
    icon: FaServer,
    category: 'enterprise',
    discipline: 'Enterprise Systems',
    name: 'Enterprise',
  },

  // Networking/Distributed Icons
  15: {
    icon: FaCloud,
    category: 'distributed',
    discipline: 'Distributed Systems',
    name: 'Cloud Computing',
  },
  17: {
    icon: FaServer,
    category: 'networking',
    discipline: 'Distributed Systems',
    name: 'Networking',
  },

  // Hardware/ML Icons
  13: { icon: BsCpu, category: 'ml', discipline: 'Data Science', name: 'Machine Learning' },
  20: { icon: BsCpu, category: 'hardware', discipline: 'Hardware/IoT', name: 'Hardware' },
};

// Professional Disciplines Mapping
export const professionalDisciplines = {
  'Frontend Development': {
    id: 'frontend-dev',
    name: 'Frontend Development',
    color: '#61dafb',
    icon: FaReact,
    technologies: [1, 25],
    description: 'User interface and experience development',
  },
  'Backend Systems': {
    id: 'backend-systems',
    name: 'Backend Systems',
    color: '#339933',
    icon: FaServer,
    technologies: [2, 11, 18, 21, 26, 3, 27, 28, 44],
    description: 'Server-side development and database management',
  },
  'DevOps/Infrastructure': {
    id: 'devops-infrastructure',
    name: 'DevOps/Infrastructure',
    color: '#2496ed',
    icon: FaDocker,
    technologies: [4, 5, 6, 7, 8, 9, 10, 29, 33, 34, 35, 36],
    description: 'Deployment, scaling, and infrastructure automation',
  },
  'Blockchain/Security': {
    id: 'blockchain-security',
    name: 'Blockchain/Security',
    color: '#f16822',
    icon: BsShield,
    technologies: [12, 14, 16, 19, 30, 31, 32],
    description: 'Distributed ledger and security implementations',
  },
  'Leadership/Management': {
    id: 'leadership-management',
    name: 'Leadership/Management',
    color: '#28a745',
    icon: BsPeople,
    technologies: [37, 38, 39, 40, 41, 42, 43],
    description: 'Team leadership and project management',
  },
  'Financial Technology': {
    id: 'fintech',
    name: 'Financial Technology',
    color: '#1f4e79',
    icon: FaShieldAlt,
    technologies: [22, 45],
    description: 'Financial services and payment systems',
  },
  'System Architecture': {
    id: 'system-architecture',
    name: 'System Architecture',
    color: '#8e44ad',
    icon: FaCogs,
    technologies: [23, 46],
    description: 'Large-scale system design and architecture',
  },
};

// Expertise Level Mapping
export const expertiseLevels = {
  beginner: { level: 1, color: '#6c757d', label: 'Learning' },
  intermediate: { level: 2, color: '#ffc107', label: 'Proficient' },
  advanced: { level: 3, color: '#28a745', label: 'Advanced' },
  expert: { level: 4, color: '#007bff', label: 'Expert' },
};

// Icon size variants
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
};

// Helper function for devicon rendering (removed JSX to fix .js file)
const createDevIcon = (IconComponent, size = '1em') => {
  return IconComponent ? { component: IconComponent, style: { fontSize: size } } : null;
};

// Icon creation helper (removed JSX to fix .js file)
const createLazyIcon = (IconComponent, size, props = {}) => {
  if (!IconComponent) return null;
  return { component: IconComponent, size, ...props };
};

// Helper component for lazy-loaded devicons
const LazyIconComponent = React.memo(({ iconName, size = '1em' }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    // Dynamically import the specific devicon
    import('react-icons/di')
      .then((module) => {
        const Icon = module[iconName];
        if (Icon) {
          setIconComponent(() => Icon);
        }
      })
      .catch(() => {
        // Fallback if icon not found
        console.warn(`Icon ${iconName} not found`);
      });
  }, [iconName]);

  if (!IconComponent) {
    return { type: 'placeholder', size };
  }

  return { type: 'component', component: IconComponent, ref: null, ...{} };
});

// Add display name and prop types for ESLint compliance
LazyIconComponent.displayName = 'LazyIconComponent';
LazyIconComponent.propTypes = {
  iconName: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const LazyIcon = LazyIconComponent;

// Get icon for technology with size variants
export const getTechnologyIcon = (technologyId, sizeVariant = 'md', customSize = null) => {
  const iconData = technologyIconMap[technologyId];
  if (!iconData) return null;

  const size = customSize || iconSizes[sizeVariant] || iconSizes.md;
  const IconComponent = iconData.icon;

  // Return the actual React component, not LazyIcon
  if (!IconComponent) {
    return React.createElement('div', { style: { width: size, height: size } });
  }

  return React.createElement(IconComponent, { style: { fontSize: size } });
};

// Get professional discipline for technology
export const getTechnologyDiscipline = (technologyId) => {
  const iconData = technologyIconMap[technologyId];
  return iconData?.discipline || 'General Technology';
};

// Get technologies by professional discipline
export const getTechnologiesByDiscipline = (disciplineName) => {
  const discipline = professionalDisciplines[disciplineName];
  return discipline?.technologies || [];
};
