import PropTypes from 'prop-types';
import { FaReact, FaServer, FaCloud, FaBrain, FaShieldAlt } from 'react-icons/fa';
import { SiKubernetes } from 'react-icons/si';

// Professional discipline definitions with career progression levels
export const professionalDisciplines = {
  'frontend-development': {
    id: 'frontend-development',
    name: 'Frontend Development',
    description: 'User interface and user experience focused development',
    icon: FaReact,
    color: '#61dafb',
    gradient: 'linear-gradient(135deg, #61dafb 0%, #21d4fd 100%)',
    technologies: [1, 25], // React, JavaScript
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'Frontend Developer',
        years: '0-2 years',
        technologies: [1, 25], // React, JavaScript
        keySkills: ['HTML/CSS', 'JavaScript ES6+', 'React Basics', 'Responsive Design'],
      },
      mid: {
        level: 'mid',
        title: 'Senior Frontend Developer',
        years: '2-5 years',
        technologies: [1, 25], // React, JavaScript + more
        keySkills: ['Advanced React', 'State Management', 'Testing', 'Performance Optimization'],
      },
      senior: {
        level: 'senior',
        title: 'Lead Frontend Engineer',
        years: '5+ years',
        technologies: [1, 25], // React, JavaScript + architecture
        keySkills: ['Architecture Design', 'Team Leadership', 'Framework Design', 'Mentoring'],
      },
    },
    careerPath: [
      { year: 2019, level: 'junior', technologies: [25], projects: ['Basic React apps'] },
      { year: 2021, level: 'mid', technologies: [1, 25], projects: ['Complex SPAs'] },
      { year: 2023, level: 'senior', technologies: [1, 25], projects: ['Enterprise platforms'] },
    ],
  },
  'backend-systems': {
    id: 'backend-systems',
    name: 'Backend Systems',
    description: 'Server-side development and system architecture',
    icon: FaServer,
    color: '#339933',
    gradient: 'linear-gradient(135deg, #339933 0%, #4caf50 100%)',
    technologies: [2, 11, 18, 21], // Node.js, Python, Go, Express.js
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'Backend Developer',
        years: '0-2 years',
        technologies: [2, 11], // Node.js, Python
        keySkills: ['API Development', 'Database Integration', 'Basic Architecture'],
      },
      mid: {
        level: 'mid',
        title: 'Senior Backend Developer',
        years: '2-5 years',
        technologies: [2, 11, 18, 21], // Full stack
        keySkills: ['Microservices', 'Performance Optimization', 'Security', 'Testing'],
      },
      senior: {
        level: 'senior',
        title: 'Principal Backend Engineer',
        years: '5+ years',
        technologies: [2, 11, 18, 21], // Full stack + architecture
        keySkills: ['System Design', 'Scalability', 'Team Leadership', 'Technical Strategy'],
      },
    },
    careerPath: [
      { year: 2018, level: 'junior', technologies: [2], projects: ['Basic APIs'] },
      { year: 2020, level: 'mid', technologies: [2, 11], projects: ['Microservices'] },
      { year: 2022, level: 'senior', technologies: [2, 11, 18], projects: ['Distributed systems'] },
    ],
  },
  'devops-infrastructure': {
    id: 'devops-infrastructure',
    name: 'DevOps & Infrastructure',
    description: 'Deployment, automation, and infrastructure management',
    icon: SiKubernetes,
    color: '#326ce5',
    gradient: 'linear-gradient(135deg, #326ce5 0%, #2196f3 100%)',
    technologies: [4, 5, 6, 7, 26, 33, 34, 35, 36], // Docker, Jenkins, K8s, Terraform, etc.
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'DevOps Engineer',
        years: '0-2 years',
        technologies: [4, 35], // Docker, Git
        keySkills: ['CI/CD Basics', 'Container Orchestration', 'Version Control'],
      },
      mid: {
        level: 'mid',
        title: 'Senior DevOps Engineer',
        years: '2-5 years',
        technologies: [4, 5, 6, 7], // Full DevOps stack
        keySkills: ['Infrastructure as Code', 'Monitoring', 'Security', 'Automation'],
      },
      senior: {
        level: 'senior',
        title: 'Principal DevOps Architect',
        years: '5+ years',
        technologies: [4, 5, 6, 7, 26, 33, 34], // Full stack + leadership
        keySkills: ['Platform Engineering', 'Team Leadership', 'Strategy', 'Cost Optimization'],
      },
    },
    careerPath: [
      { year: 2017, level: 'junior', technologies: [4], projects: ['Basic containerization'] },
      { year: 2019, level: 'mid', technologies: [4, 6, 7], projects: ['K8s clusters'] },
      {
        year: 2021,
        level: 'senior',
        technologies: [4, 5, 6, 7],
        projects: ['Enterprise platforms'],
      },
    ],
  },
  'cloud-platforms': {
    id: 'cloud-platforms',
    name: 'Cloud Platforms',
    description: 'Cloud architecture and platform services',
    icon: FaCloud,
    color: '#ff9900',
    gradient: 'linear-gradient(135deg, #ff9900 0%, #ffc107 100%)',
    technologies: [8, 9], // AWS, GCP
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'Cloud Developer',
        years: '0-2 years',
        technologies: [8], // AWS
        keySkills: ['Basic Cloud Services', 'Deployment', 'Monitoring'],
      },
      mid: {
        level: 'mid',
        title: 'Cloud Solutions Architect',
        years: '2-5 years',
        technologies: [8, 9], // Multi-cloud
        keySkills: ['Architecture Design', 'Cost Optimization', 'Security', 'Automation'],
      },
      senior: {
        level: 'senior',
        title: 'Principal Cloud Architect',
        years: '5+ years',
        technologies: [8, 9], // Multi-cloud + strategy
        keySkills: ['Enterprise Architecture', 'Team Leadership', 'Strategy', 'Innovation'],
      },
    },
    careerPath: [
      { year: 2018, level: 'junior', technologies: [8], projects: ['Basic AWS deployment'] },
      { year: 2020, level: 'mid', technologies: [8, 9], projects: ['Multi-cloud architecture'] },
      { year: 2022, level: 'senior', technologies: [8, 9], projects: ['Enterprise platforms'] },
    ],
  },
  'data-science': {
    id: 'data-science',
    name: 'Data Science & ML',
    description: 'Data analysis, machine learning, and AI development',
    icon: FaBrain,
    color: '#ff6f00',
    gradient: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 100%)',
    technologies: [13, 11], // TensorFlow, Python
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'Data Analyst',
        years: '0-2 years',
        technologies: [11], // Python
        keySkills: ['Data Analysis', 'Statistical Methods', 'Visualization'],
      },
      mid: {
        level: 'mid',
        title: 'Data Scientist',
        years: '2-5 years',
        technologies: [11, 13], // Python + ML
        keySkills: ['Machine Learning', 'Model Development', 'Feature Engineering'],
      },
      senior: {
        level: 'senior',
        title: 'Principal Data Scientist',
        years: '5+ years',
        technologies: [11, 13], // Full ML stack
        keySkills: ['ML Architecture', 'Team Leadership', 'Research', 'Strategy'],
      },
    },
    careerPath: [
      { year: 2020, level: 'junior', technologies: [11], projects: ['Data analysis'] },
      { year: 2022, level: 'mid', technologies: [11, 13], projects: ['ML models'] },
      { year: 2024, level: 'senior', technologies: [11, 13], projects: ['AI platforms'] },
    ],
  },
  'blockchain-security': {
    id: 'blockchain-security',
    name: 'Blockchain & Security',
    description: 'Distributed systems, cryptography, and security',
    icon: FaShieldAlt,
    color: '#f16822',
    gradient: 'linear-gradient(135deg, #f16822 0%, #ff5722 100%)',
    technologies: [12, 14, 15, 16, 19, 30, 31, 32], // Blockchain related
    skillLevels: {
      junior: {
        level: 'junior',
        title: 'Blockchain Developer',
        years: '0-2 years',
        technologies: [14, 30], // Basic blockchain
        keySkills: ['Smart Contracts', 'Cryptocurrency', 'Basic Cryptography'],
      },
      mid: {
        level: 'mid',
        title: 'Senior Blockchain Engineer',
        years: '2-5 years',
        technologies: [12, 14, 15, 30, 31], // Advanced blockchain
        keySkills: ['Protocol Development', 'Security Auditing', 'Architecture'],
      },
      senior: {
        level: 'senior',
        title: 'Blockchain Architect',
        years: '5+ years',
        technologies: [12, 14, 15, 16, 19, 30, 31, 32], // Full stack
        keySkills: ['Protocol Design', 'Team Leadership', 'Research', 'Innovation'],
      },
    },
    careerPath: [
      { year: 2018, level: 'junior', technologies: [14], projects: ['Basic DApps'] },
      { year: 2020, level: 'mid', technologies: [12, 14, 30], projects: ['Enterprise blockchain'] },
      {
        year: 2022,
        level: 'senior',
        technologies: [12, 14, 15, 16],
        projects: ['Protocol development'],
      },
    ],
  },
};

// Utility functions for discipline management
export const disciplineUtils = {
  // Get all disciplines
  getAllDisciplines: () => Object.values(professionalDisciplines),

  // Get discipline by ID
  getDisciplineById: (id) => professionalDisciplines[id],

  // Get technologies for a discipline
  getDisciplineTechnologies: (disciplineId, portfolioData) => {
    const discipline = professionalDisciplines[disciplineId];
    if (!discipline) return [];

    return discipline.technologies
      .map((techId) => portfolioData.technologies.byId[techId])
      .filter(Boolean);
  },

  // Get current skill level based on years of experience
  getCurrentSkillLevel: (disciplineId, yearsOfExperience) => {
    const discipline = professionalDisciplines[disciplineId];
    if (!discipline) return null;

    if (yearsOfExperience < 2) return discipline.skillLevels.junior;
    if (yearsOfExperience < 5) return discipline.skillLevels.mid;
    return discipline.skillLevels.senior;
  },

  // Calculate discipline proficiency based on project usage
  calculateDisciplineProficiency: (disciplineId, portfolioData) => {
    const discipline = professionalDisciplines[disciplineId];
    if (!discipline) return 0;

    const allProjects = Object.values(portfolioData.projects.byId);
    const disciplineProjects = allProjects.filter((project) =>
      project.technologies.some((techId) => discipline.technologies.includes(techId)),
    );

    const totalTechnologies = discipline.technologies.length;
    const usedTechnologies = new Set();

    disciplineProjects.forEach((project) => {
      project.technologies.forEach((techId) => {
        if (discipline.technologies.includes(techId)) {
          usedTechnologies.add(techId);
        }
      });
    });

    const technologyCoverage = usedTechnologies.size / totalTechnologies;
    const projectFrequency = disciplineProjects.length / allProjects.length;

    return Math.min(100, Math.round((technologyCoverage * 60 + projectFrequency * 40) * 100));
  },

  // Get career progression for visualization
  getCareerProgression: (disciplineId) => {
    const discipline = professionalDisciplines[disciplineId];
    return discipline?.careerPath || [];
  },

  // Filter projects by discipline
  getProjectsByDiscipline: (disciplineId, portfolioData) => {
    const discipline = professionalDisciplines[disciplineId];
    if (!discipline) return [];

    const allProjects = Object.values(portfolioData.projects.byId);
    return allProjects.filter((project) =>
      project.technologies.some((techId) => discipline.technologies.includes(techId)),
    );
  },
};

// PropTypes for components
export const disciplinePropTypes = {
  discipline: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.number).isRequired,
    skillLevels: PropTypes.object.isRequired,
    careerPath: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  skillLevel: PropTypes.shape({
    level: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    years: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.number).isRequired,
    keySkills: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
