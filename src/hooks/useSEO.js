import { useEffect, useCallback } from 'react';
import { generateMetaTags, generateStructuredData } from '../utils/seoUtils.js';

export const useSEO = (section = 'home', projectId = null) => {
  const updateMetaTags = useCallback((metaData) => {
    // Update title
    document.title = metaData.title;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);

      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', metaData.description);
    updateMetaTag('keywords', metaData.keywords);

    // Open Graph tags
    updateMetaTag('og:title', metaData.openGraph.title, true);
    updateMetaTag('og:description', metaData.openGraph.description, true);
    updateMetaTag('og:url', metaData.openGraph.url, true);
    updateMetaTag('og:image', metaData.openGraph.image, true);
    updateMetaTag('og:site_name', metaData.openGraph.siteName, true);
    updateMetaTag('og:type', metaData.openGraph.type, true);

    // Twitter tags
    updateMetaTag('twitter:card', metaData.twitter.card);
    updateMetaTag('twitter:title', metaData.twitter.title);
    updateMetaTag('twitter:description', metaData.twitter.description);
    updateMetaTag('twitter:image', metaData.twitter.image);
    updateMetaTag('twitter:creator', metaData.twitter.creator);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metaData.canonical);
  }, []);

  const updateStructuredData = useCallback((structuredDataArray) => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"][data-dynamic="true"]',
    );
    existingScripts.forEach((script) => script.remove());

    // Add new structured data
    structuredDataArray.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    const metaData = generateMetaTags(section, projectId);
    const structuredData = generateStructuredData(section, projectId);

    updateMetaTags(metaData);
    updateStructuredData(structuredData);

    // Track SEO changes for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'seo_update', {
        section: section,
        project_id: projectId,
        page_title: metaData.title,
      });
    }
  }, [section, projectId, updateMetaTags, updateStructuredData]);

  return {
    updateSEO: (newSection, newProjectId) => {
      const metaData = generateMetaTags(newSection, newProjectId);
      const structuredData = generateStructuredData(newSection, newProjectId);
      updateMetaTags(metaData);
      updateStructuredData(structuredData);
    },
  };
};
