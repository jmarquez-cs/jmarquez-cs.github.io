// Career locations data for the World Globe component
export const careerLocations = [
  {
    lat: 33.5207,
    lon: -86.8025,
    title: 'SWE at Intermark Group',
    company: 'Intermark Group',
    role: 'Software Engineer',
    period: '2016-07 to 2017-05',
    technologies: ['Javascript', 'SQL', 'ERP Systems', 'SOA', 'Enterprise Integration'],
    city: 'Birmingham, AL',
    metrics: {
      projectValue: '$20M ERP',
      architecture: 'SOA migration',
      teamSize: '3 professionals',
    },
  },
  {
    lat: 33.51364,
    lon: -86.7832,
    title: 'Technical Consultant at PNC',
    company: 'PNC Bank',
    role: 'Technical Consultant',
    period: '2017-05 to 2017-11',
    technologies: [
      'EMV',
      'Payment Processing',
      'Banking Systems',
      'MongoDB',
      'Express.js',
      'Node.js',
    ],
    city: 'Birmingham, AL',
    metrics: {
      teamSize: '4 developers',
      integration: 'Harland Clarke',
      cardTypes: 'EMV enabled',
    },
  },
  {
    lat: 34.11121,
    lon: -84.20606,
    title: 'Lead Software Engineer at BLOCNETS, INC.',
    company: 'BLOCNETS, INC.',
    role: 'Lead Software Engineer',
    period: '2018-03 to 2019-04',
    technologies: [
      'Hyperledger Fabric',
      'Smart Contracts',
      'Intel SGX',
      '3D Printing Security',
      'Cryptography',
    ],
    city: 'Alpharetta, GA',
    metrics: {
      funding: '$1.8M secured',
      printerModels: '67 supported',
      patents: '1 provisional',
    },
  },
  {
    lat: 33.749,
    lon: -84.388,
    title: 'Solutions Architect at You42',
    company: 'You42',
    role: 'Solutions Architect',
    period: '2019-04 to 2021-02',
    technologies: ['AWS', 'Node.js', 'React', 'Go', 'Microservices Architecture'],
    city: 'Atlanta, GA',
    metrics: {
      teamSize: '5 developers',
      deliveryTime: '6 months MVP',
      architecture: 'Microservices',
    },
  },
  {
    lat: 34.7304,
    lon: -86.5861,
    title: 'Fractional CTO at cryptstax',
    company: 'cryptstax',
    role: 'Owner',
    period: '2019-11 to 2025-Present',
    technologies: [
      'Blockchain',
      'Cryptocurrency',
      'Tax Compliance',
      'Distributed Systems',
      'Python',
    ],
    city: 'Huntsville, AL',
    metrics: {
      uptime: '99.9%',
      transactions: '1M+ processed',
      clients: 'Enterprise scale',
    },
  },
  {
    lat: 33.4484,
    lon: -82.1571,
    title: 'Senior Software Engineer at NCR Global',
    company: 'NCR Global',
    role: 'Senior Software Engineer',
    period: '2021-02 to 2021-10',
    technologies: ['Microservices', 'Cloud Architecture', 'DevOps', 'Docker', 'Kubernetes'],
    city: 'Atlanta, GA',
    metrics: {
      solutions: 'Cloud-native',
      sectors: 'Retail & Finance',
      subcontractor: 'Optomi | IT Talent Services',
    },
  },
  {
    lat: 51.5074,
    lon: -0.1278,
    title: 'IPFS Engineer at Privi Protocol',
    company: 'Privi Protocol',
    role: 'Blockchain Consultant',
    period: '3 months',
    technologies: ['Bitcoin', 'IPFS', 'DeFi', 'Payment Systems'],
    city: 'London, UK',
    metrics: {
      sector: 'Web3',
      industry: 'DeFi',
      subcontractor: 'Plexus Resource Solutions',
    },
  },
  {
    lat: 36.1659,
    lon: -86.7844,
    title: 'Chief Technology Officer at Fathom PBC',
    company: 'Fathom PBC',
    role: 'Co-Founder',
    period: '2020-12 to 2025-06',
    technologies: ['Python', 'Aries', 'P2P', 'Docker', 'Node.js'],
    city: 'Nashville, TN',
    metrics: {
      patents: '1+ contributed',
      certification: 'Aries certified',
      whitepapers: '3+ published',
    },
  },
  {
    lat: 38.6609,
    lon: -90.4226,
    title: 'DevSecOps Engineer at Object Computing, Inc.',
    company: 'Object Computing, Inc.',
    role: 'DevSecOps Engineer',
    period: '2022-07 to 2023-05',
    technologies: ['DevOps', 'Security', 'CI/CD', 'Cloud Infrastructure'],
    city: 'St. Louis, MO',
    metrics: {
      grantValue: 'HBAR Foundation',
      infrastructure: 'Terraform IaaC',
      platform: 'GCP OpenSearch',
    },
  },
  {
    lat: 39.742043,
    lon: -104.991531,
    title: 'Techstars Workforce Development Accelerator (2024)',
    company: 'Techstars',
    role: 'Accelerator Participant',
    period: '2024-06 to 2024-09',
    technologies: ['Entrepreneurship', 'Workforce Development', 'Startup'],
    city: 'Denver, CO',
  },
];

// Default configuration for the World Globe
export const defaultGlobeConfig = {
  radius: 7,
  rotationSpeed: 0.001,
  tiltAngle: 23.5,
  theme: 'white',
  enableRotation: false,
  enableZoom: true,
  enablePan: false,
  enableScrollRotation: false,
  geoDataUrls: {
    countries:
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
    borders:
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
  },
  colors: {
    white: {
      land: 0xffffff,
      border: 0x000000,
      dot: 0x000000,
      background: 0xf4f4f4,
    },
    black: {
      land: 0x000000,
      border: 0xffffff,
      dot: 0xffffff,
      background: 0x1a1a1a,
    },
  },
  markerConfig: {
    size: 0.05,
    sizeAttenuation: true,
  },
};

// Alternative theme configurations
export const themePresets = {
  ocean: {
    white: {
      land: 0x4a90e2,
      border: 0x2171b5,
      dot: 0xff6b35,
      background: 0xe6f3ff,
    },
    black: {
      land: 0x1a365d,
      border: 0x4a90e2,
      dot: 0xff6b35,
      background: 0x0a1a2a,
    },
  },
  forest: {
    white: {
      land: 0x27ae60,
      border: 0x1e8449,
      dot: 0xe74c3c,
      background: 0xf0fff0,
    },
    black: {
      land: 0x0d4f3c,
      border: 0x27ae60,
      dot: 0xe74c3c,
      background: 0x0a1a0a,
    },
  },
  sunset: {
    white: {
      land: 0xff6b35,
      border: 0xd84315,
      dot: 0x4a148c,
      background: 0xfff8e1,
    },
    black: {
      land: 0x8d2f00,
      border: 0xff6b35,
      dot: 0x9c27b0,
      background: 0x1a0a00,
    },
  },
};

// Utility functions for data manipulation
export const locationUtils = {
  filterByTechnology: (locations, technology) =>
    locations.filter((loc) =>
      loc.technologies?.some((tech) => tech.toLowerCase().includes(technology.toLowerCase())),
    ),

  filterByPeriod: (locations, startYear, endYear) =>
    locations.filter((loc) => {
      const period = loc.period;
      if (!period) return false;

      const yearMatch = period.match(/(\d{4})/g);
      if (!yearMatch) return false;

      const locStartYear = parseInt(yearMatch[0]);
      return locStartYear >= startYear && locStartYear <= endYear;
    }),

  groupByCompany: (locations) =>
    locations.reduce((acc, loc) => {
      const company = loc.company || 'Unknown';
      if (!acc[company]) acc[company] = [];
      acc[company].push(loc);
      return acc;
    }, {}),

  sortByDate: (locations, ascending = false) =>
    [...locations].sort((a, b) => {
      const getYear = (period) => {
        const match = period?.match(/(\d{4})/);
        return match ? parseInt(match[1]) : 0;
      };

      const yearA = getYear(a.period);
      const yearB = getYear(b.period);

      return ascending ? yearA - yearB : yearB - yearA;
    }),
};
