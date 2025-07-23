import { useMemo } from 'react';
import { portfolioSchema, portfolioSelectors } from '../data/portfolioData';

export const usePortfolio = () => {
  const allProjects = useMemo(() => portfolioSelectors.getAllProjects(portfolioSchema), []);

  const getProjectTechnologies = useMemo(
    () => (projectId) => portfolioSelectors.getProjectTechnologies(portfolioSchema, projectId),
    [],
  );

  const categories = useMemo(
    () => portfolioSchema.categories.allIds.map((id) => portfolioSchema.categories.byId[id]),
    [],
  );

  const technologies = useMemo(
    () => portfolioSchema.technologies.allIds.map((id) => portfolioSchema.technologies.byId[id]),
    [],
  );

  return {
    // Core data
    allProjects,
    categories,
    technologies,

    // Core methods
    getProjectTechnologies,

    // Selectors
    getProjectsByCategory: (category) =>
      portfolioSelectors.getProjectsByCategory(portfolioSchema, category),
    getTechnologiesByCategory: (category) =>
      portfolioSelectors.getTechnologiesByCategory(portfolioSchema, category),
  };
};
