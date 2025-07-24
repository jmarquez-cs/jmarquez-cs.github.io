import { portfolioData } from '../data/portfolioData.js';

// SEO Configuration Constants - Updated to match index.html
export const SEO_CONFIG = {
  siteName: 'John Marquez Portfolio',
  baseUrl: 'https://jmarquez-cs.github.io',
  defaultTitle: 'John Marquez - Fractional CTO | Blockchain & DevSecOps Portfolio',
  defaultDescription:
    'Fractional CTO specializing in blockchain systems, DevSecOps, and distributed architectures. Experience with React, Node.js, AWS, and enterprise-scale applications.',
  defaultKeywords:
    'software engineer, blockchain developer, DevSecOps, React developer, Node.js, Typescript, Hyperledger Indy, Sui, Hedera, AWS, portfolio, full-stack developer, distributed systems',
  author: 'John Marquez',
  twitterHandle: '@DorsalTrades',
  linkedinProfile: 'https://linkedin.com/in/jmarquez-cs',
  githubProfile: 'https://github.com/jmarquez-cs',
};

// Dynamic Meta Tag Generator - Updated sections
export const generateMetaTags = (section = 'home', projectId = null) => {
  const config = SEO_CONFIG;
  let title, description, keywords, canonical;

  switch (section) {
    case 'about':
      title = `About ${config.author} - Fractional CTO Profile`;
      description =
        "Learn about John Marquez's professional background, technical expertise in blockchain development, DevSecOps practices, and career journey as a Fractional CTO.";
      keywords = `${config.defaultKeywords}, about, professional background, career, experience, fractional CTO`;
      canonical = `${config.baseUrl}/#about`;
      break;

    case 'portfolio':
      if (projectId && portfolioData.projects.byId[projectId]) {
        const project = portfolioData.projects.byId[projectId];
        title = `${project.title} - Project by ${config.author}`;
        description = project.description;
        keywords = `${project.technologies.join(', ')}, project, ${config.defaultKeywords}`;
        canonical = `${config.baseUrl}/#portfolio`;
      } else {
        title = `Portfolio - ${config.author}'s Blockchain & DevSecOps Projects`;
        description =
          "Explore John Marquez's portfolio of blockchain, DevSecOps, and distributed systems projects showcasing technical expertise and innovation in enterprise solutions.";
        keywords = `portfolio, projects, blockchain projects, DevSecOps projects, Hyperledger Indy, Sui, Hedera, ${config.defaultKeywords}`;
        canonical = `${config.baseUrl}/#portfolio`;
      }
      break;

    case 'skills':
      title = `Tech Skills Radar - ${config.author}'s Technology Expertise`;
      description =
        "Interactive technology radar showcasing John Marquez's expertise across blockchain development, DevSecOps, cloud infrastructure, and full-stack development technologies.";
      keywords = `skills radar, technology expertise, blockchain skills, DevSecOps skills, technical proficiency, ${config.defaultKeywords}`;
      canonical = `${config.baseUrl}/#skills`;
      break;

    default:
      title = config.defaultTitle;
      description = config.defaultDescription;
      keywords = config.defaultKeywords;
      canonical = config.baseUrl;
  }

  return {
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title: title,
      description: description,
      url: canonical,
      image: `${config.baseUrl}/portfolio-preview.jpg`,
      siteName: config.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      image: `${config.baseUrl}/portfolio-preview.jpg`,
      creator: config.twitterHandle,
    },
  };
};

// Enhanced Schema.org Generator - Updated to match index.html
export const generateStructuredData = (section = 'home', projectId = null) => {
  const config = SEO_CONFIG;
  const basePersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.author,
    jobTitle: 'Fractional CTO',
    description: config.defaultDescription,
    url: config.baseUrl,
    sameAs: [config.githubProfile, config.linkedinProfile, 'https://x.com/DorsalTrades'],
    knowsAbout: [
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'TypeScript',
      'AWS',
      'Docker',
      'Blockchain',
      'DevSecOps',
      'Distributed Systems',
      'Hyperledger Fabric',
      'Hyperledger Indy',
      'Sui',
      'Hedera',
      'PostgreSQL',
      'MongoDB',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Techstars',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Fractional CTO',
      occupationLocation: {
        '@type': 'Country',
        name: 'United States',
      },
      skills: 'Blockchain Development, DevSecOps, Full-Stack Development, Distributed Systems',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.baseUrl,
    founder: {
      '@type': 'Person',
      name: config.author,
    },
    sameAs: [config.githubProfile, config.linkedinProfile, 'https://x.com/DorsalTrades'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.baseUrl,
    author: {
      '@type': 'Person',
      name: config.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.baseUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Section-specific schema additions
  if (section === 'portfolio' && projectId && portfolioData.projects.byId[projectId]) {
    const project = portfolioData.projects.byId[projectId];
    const projectSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      creator: {
        '@type': 'Person',
        name: config.author,
      },
      dateCreated: project.date,
      keywords: project.technologies.join(', '),
      url: `${config.baseUrl}/#portfolio`,
    };

    return [basePersonSchema, organizationSchema, websiteSchema, projectSchema];
  }

  return [basePersonSchema, organizationSchema, websiteSchema];
};

// SEO Performance Metrics
export const SEO_METRICS = {
  coreWebVitals: {
    LCP: { target: 2500, current: null },
    FID: { target: 100, current: null },
    CLS: { target: 0.1, current: null },
  },
  searchVisibility: {
    indexedPages: 0,
    organicKeywords: 0,
    searchImpressions: 0,
    averagePosition: 0,
  },
  technicalSEO: {
    metaTagsOptimized: false,
    structuredDataValid: false,
    canonicalUrlsSet: false,
    robotsTxtValid: false,
    sitemapValid: false,
  },
};

// SEO Audit Function
export const auditSEO = () => {
  const audit = {
    timestamp: new Date().toISOString(),
    scores: {
      metaTags: 0,
      structuredData: 0,
      performance: 0,
      accessibility: 0,
    },
    issues: [],
    recommendations: [],
  };

  // Check meta tags
  const titleTag = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');
  const canonicalLink = document.querySelector('link[rel="canonical"]');

  if (!titleTag || titleTag.textContent.length < 30) {
    audit.issues.push('Title tag missing or too short');
    audit.recommendations.push('Add descriptive title tag (30-60 characters)');
  } else {
    audit.scores.metaTags += 25;
  }

  if (!metaDescription || metaDescription.getAttribute('content').length < 120) {
    audit.issues.push('Meta description missing or too short');
    audit.recommendations.push('Add meta description (120-160 characters)');
  } else {
    audit.scores.metaTags += 25;
  }

  if (!canonicalLink) {
    audit.issues.push('Canonical URL missing');
    audit.recommendations.push('Add canonical link tag');
  } else {
    audit.scores.metaTags += 25;
  }

  // Check structured data
  const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredDataScripts.length === 0) {
    audit.issues.push('No structured data found');
    audit.recommendations.push('Add Schema.org structured data');
  } else {
    audit.scores.structuredData = 100;
  }

  // Calculate overall score
  const overallScore = Math.round(
    (audit.scores.metaTags +
      audit.scores.structuredData +
      audit.scores.performance +
      audit.scores.accessibility) /
      4,
  );

  return { ...audit, overallScore };
};
