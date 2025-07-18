// Normalized data structure for portfolio projects
export const portfolioSchema = {
  projects: {
    byId: {
      1: {
        id: 1,
        title: 'Cryptstax Enterprise Platform',
        description:
          'Distributed systems architecture for cryptocurrency tax compliance and portfolio management, serving enterprise clients with automated transaction processing.',
        technologies: [1, 2, 3, 4, 11, 14], // Reference to technology IDs
        gradient: 'gradient-mint',
        links: {
          github: 'https://github.com/jmarquez-cs',
          live: 'https://cryptstax.com',
        },
        metrics: {
          uptime: '99.9%',
          transactions: '1M+ processed',
          clients: 'Enterprise scale',
        },
        category: 'blockchain',
        featured: true,
        createdAt: '2019-11-01',
      },
      2: {
        id: 2,
        title: 'Hyperledger Fabric IPFS Bridge',
        description:
          'Engineered Bitcoin bridge system for Privi Protocol with IPFS data storage, TLS termination, and P2P networking for verifiable credentials.',
        technologies: [12, 15, 4, 7, 11], // Reference to technology IDs
        gradient: 'gradient-grape',
        links: {
          github: 'https://github.com/jmarquez-cs',
          live: 'https://privi.io',
        },
        metrics: {
          securityScore: 'A+ rated',
          networkNodes: '500+ active',
          dataIntegrity: '100%',
        },
        category: 'blockchain',
        featured: true,
        createdAt: '2021-06-01',
      },
      3: {
        id: 3,
        title: 'Hedera Hashgraph Cloud Infrastructure',
        description:
          'Terraform-based Google Cloud Platform infrastructure for Tolam Earth, supporting distributed ledger operations with auto-scaling capabilities.',
        technologies: [8, 9, 7, 4, 6], // Reference to technology IDs
        gradient: 'gradient-lime',
        links: {
          github: 'https://github.com/jmarquez-cs',
          live: 'https://tolamearth.com',
        },
        metrics: {
          costReduction: '$40/month ops',
          scalability: 'Auto-scaling',
          reliability: '99.95%',
        },
        category: 'infrastructure',
        featured: true,
        createdAt: '2022-07-01',
      },
      4: {
        id: 4,
        title: 'Fathom Verifiable Credentials Platform',
        description:
          'Interim CTO role delivering P2P networking protocols for verifiable credentials, patent contributions, and Hyperledger Aries certified development.',
        technologies: [11, 16, 17, 4, 2], // Reference to technology IDs
        gradient: 'gradient-guava',
        links: {
          github: 'https://github.com/jmarquez-cs',
          live: 'https://fathompbc.com',
        },
        metrics: {
          patents: '1+ contributed',
          certification: 'Aries certified',
          whitepapers: '3+ published',
        },
        category: 'security',
        featured: true,
        createdAt: '2021-10-01',
      },
      5: {
        id: 5,
        title: 'You42 Microservices Architecture',
        description:
          'Led team migration from legacy monolith to service mesh architecture using Go, React.js, AWS services. Delivered MVP in 6 months for startup scale.',
        technologies: [18, 1, 2, 8, 4], // Reference to technology IDs
        gradient: 'gradient-sunset',
        links: {
          github: 'https://github.com/jmarquez-cs',
        },
        metrics: {
          teamSize: '5 developers',
          deliveryTime: '6 months MVP',
          architecture: 'Microservices',
        },
        category: 'devops',
        featured: true,
        createdAt: '2019-04-01',
      },
      6: {
        id: 6,
        title: 'Blocnets 3D Printing Security Platform',
        description:
          'Cryptographic 3D printing solution for 67+ printer models using Hyperledger Fabric and Intel SGX. Secured $1.8M seed funding with provisional patent.',
        technologies: [12, 19, 20, 4, 11], // Reference to technology IDs
        gradient: 'gradient-ocean',
        links: {
          github: 'https://github.com/jmarquez-cs',
        },
        metrics: {
          funding: '$1.8M secured',
          printerModels: '67 supported',
          patents: '1 provisional',
        },
        category: 'blockchain',
        featured: true,
        createdAt: '2018-03-01',
      },
      7: {
        id: 7,
        title: 'PNC Bank Instant Issuance Integration',
        description:
          'Led 4-developer team on MongoDB/Express.js/Node.js integration enabling financial institutions to print EMV chip-enabled debit cards instantly.',
        technologies: [2, 21, 3, 22], // Reference to technology IDs
        gradient: 'gradient-forest',
        links: {
          github: 'https://github.com/jmarquez-cs',
        },
        metrics: {
          teamSize: '4 developers',
          integration: 'Harland Clarke',
          cardTypes: 'EMV enabled',
        },
        category: 'fintech',
        featured: false,
        createdAt: '2017-05-01',
      },
      8: {
        id: 8,
        title: 'JM Family ERP Service Architecture',
        description:
          'Refactored monolithic ERP applications into Service-Oriented Architecture for $20M integration project, improving scalability and maintainability.',
        technologies: [23, 24, 2, 25], // Reference to technology IDs
        gradient: 'gradient-cosmic',
        links: {
          github: 'https://github.com/jmarquez-cs',
        },
        metrics: {
          projectValue: '$20M ERP',
          architecture: 'SOA migration',
          teamSize: '3 professionals',
        },
        category: 'enterprise',
        featured: false,
        createdAt: '2016-08-01',
      },
    },
    allIds: [1, 2, 3, 4, 5, 6, 7, 8],
    byCategory: {
      blockchain: [1, 2, 6],
      infrastructure: [3],
      security: [4],
      devops: [5],
      fintech: [7],
      enterprise: [8],
    },
    featured: [1, 2, 3, 4, 5, 6],
  },
  technologies: {
    byId: {
      1: { id: 1, name: 'React', category: 'frontend', color: '#61dafb' },
      2: { id: 2, name: 'Node.js', category: 'backend', color: '#339933' },
      3: { id: 3, name: 'MongoDB', category: 'database', color: '#47a248' },
      4: { id: 4, name: 'Docker', category: 'devops', color: '#2496ed' },
      5: { id: 5, name: 'Jenkins', category: 'devops', color: '#d33833' },
      6: { id: 6, name: 'Kubernetes', category: 'devops', color: '#326ce5' },
      7: { id: 7, name: 'Terraform', category: 'infrastructure', color: '#623ce4' },
      8: { id: 8, name: 'AWS', category: 'cloud', color: '#ff9900' },
      9: { id: 9, name: 'GCP', category: 'cloud', color: '#4285f4' },
      10: { id: 10, name: 'Prometheus', category: 'monitoring', color: '#e6522c' },
      11: { id: 11, name: 'Python', category: 'backend', color: '#3776ab' },
      12: { id: 12, name: 'Hyperledger', category: 'blockchain', color: '#363636' },
      13: { id: 13, name: 'TensorFlow', category: 'ml', color: '#ff6f00' },
      14: { id: 14, name: 'Blockchain', category: 'blockchain', color: '#f16822' },
      15: { id: 15, name: 'IPFS', category: 'distributed', color: '#65c2cb' },
      16: { id: 16, name: 'Aries', category: 'credentials', color: '#4a90e2' },
      17: { id: 17, name: 'P2P', category: 'networking', color: '#7b68ee' },
      18: { id: 18, name: 'Go', category: 'backend', color: '#00add8' },
      19: { id: 19, name: 'Intel SGX', category: 'security', color: '#0071c5' },
      20: { id: 20, name: '3D Printing', category: 'hardware', color: '#ff6b35' },
      21: { id: 21, name: 'Express.js', category: 'backend', color: '#000000' },
      22: { id: 22, name: 'EMV', category: 'fintech', color: '#1f4e79' },
      23: { id: 23, name: 'SOA', category: 'architecture', color: '#8e44ad' },
      24: { id: 24, name: 'ERP', category: 'enterprise', color: '#2c3e50' },
      25: { id: 25, name: 'JavaScript', category: 'frontend', color: '#f7df1e' },
    },
    allIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    ],
    byCategory: {
      frontend: [1, 25],
      backend: [2, 11, 18, 21],
      database: [3],
      devops: [4, 5, 6],
      infrastructure: [7],
      cloud: [8, 9],
      monitoring: [10],
      blockchain: [12, 14],
      ml: [13],
      distributed: [15],
      credentials: [16],
      networking: [17],
      security: [19],
      hardware: [20],
      fintech: [22],
      architecture: [23],
      enterprise: [24],
    },
  },
  categories: {
    byId: {
      blockchain: { id: 'blockchain', name: 'Blockchain', color: '#f946ac' },
      infrastructure: { id: 'infrastructure', name: 'Infrastructure', color: '#37c5b3' },
      security: { id: 'security', name: 'Security', color: '#f97946' },
      devops: { id: 'devops', name: 'DevOps', color: '#613dff' },
      fintech: { id: 'fintech', name: 'FinTech', color: '#1f4e79' },
      enterprise: { id: 'enterprise', name: 'Enterprise', color: '#2c3e50' },
    },
    allIds: ['blockchain', 'infrastructure', 'security', 'devops', 'fintech', 'enterprise'],
  },
};

// Selector functions for accessing normalized data
export const portfolioSelectors = {
  getAllProjects: (data) => data.projects.allIds.map((id) => data.projects.byId[id]),
  getFeaturedProjects: (data) => data.projects.featured.map((id) => data.projects.byId[id]),
  getProjectsByCategory: (data, category) =>
    data.projects.byCategory[category]?.map((id) => data.projects.byId[id]) || [],
  getProjectTechnologies: (data, projectId) => {
    const project = data.projects.byId[projectId];
    return project?.technologies.map((techId) => data.technologies.byId[techId]) || [];
  },
  getTechnologiesByCategory: (data, category) =>
    data.technologies.byCategory[category]?.map((id) => data.technologies.byId[id]) || [],
};
