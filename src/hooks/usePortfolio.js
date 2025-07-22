import { useMemo, useCallback, useState, useEffect } from 'react';
import { portfolioSchema, portfolioSelectors } from '../data/portfolioData';
import { professionalDisciplines, disciplineUtils } from '../data/professionalDisciplines';
import { useLocalStorage } from './useLocalStorage';

export const usePortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced user preferences with localStorage
  const [portfolioPreferences, setPortfolioPreferences] = useLocalStorage(
    'portfolioPreferences',
    {
      viewMode: 'grid', // 'grid' | 'list'
      sortBy: 'featured', // 'featured' | 'date' | 'title' | 'category'
      sortOrder: 'desc', // 'asc' | 'desc'
      showDescriptions: true,
      itemsPerPage: 12,
      lastViewedProject: null,
      favoriteProjects: [],
      disciplineView: false, // Show discipline-based view
      selectedDisciplines: [], // Filter by specific disciplines
    },
    {
      validator: (value) =>
        typeof value === 'object' &&
        ['grid', 'list'].includes(value.viewMode) &&
        ['featured', 'date', 'title', 'category'].includes(value.sortBy) &&
        ['asc', 'desc'].includes(value.sortOrder) &&
        typeof value.showDescriptions === 'boolean' &&
        Number.isInteger(value.itemsPerPage) &&
        value.itemsPerPage > 0 &&
        Array.isArray(value.favoriteProjects) &&
        typeof value.disciplineView === 'boolean' &&
        Array.isArray(value.selectedDisciplines),
    },
  );

  const [currentPage, setCurrentPage] = useState(1);

  const allProjects = useMemo(() => portfolioSelectors.getAllProjects(portfolioSchema), []);

  const featuredProjects = useMemo(
    () => portfolioSelectors.getFeaturedProjects(portfolioSchema),
    [],
  );

  // Enhanced filtering and sorting
  const processedProjects = useMemo(() => {
    let projects =
      selectedCategory === 'all'
        ? allProjects
        : portfolioSelectors.getProjectsByCategory(portfolioSchema, selectedCategory);

    // Apply discipline filter
    if (selectedDiscipline !== 'all') {
      projects = disciplineUtils.getProjectsByDiscipline(selectedDiscipline, portfolioSchema);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      projects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some((tech) =>
            portfolioSchema.technologies.byId[tech]?.name.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Apply sorting
    projects = [...projects].sort((a, b) => {
      let comparison = 0;

      switch (portfolioPreferences.sortBy) {
        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          break;
        case 'date':
          comparison = new Date(b.date || 0) - new Date(a.date || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          const aCat = portfolioSchema.categories.byId[a.category]?.name || '';
          const bCat = portfolioSchema.categories.byId[b.category]?.name || '';
          comparison = aCat.localeCompare(bCat);
          break;
        default:
          comparison = 0;
      }

      return portfolioPreferences.sortOrder === 'desc' ? -comparison : comparison;
    });

    return projects;
  }, [
    allProjects,
    selectedCategory,
    selectedDiscipline,
    searchTerm,
    portfolioPreferences.sortBy,
    portfolioPreferences.sortOrder,
  ]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * portfolioPreferences.itemsPerPage;
    const endIndex = startIndex + portfolioPreferences.itemsPerPage;
    return processedProjects.slice(startIndex, endIndex);
  }, [processedProjects, currentPage, portfolioPreferences.itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(processedProjects.length / portfolioPreferences.itemsPerPage),
    [processedProjects.length, portfolioPreferences.itemsPerPage],
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedDiscipline,
    searchTerm,
    portfolioPreferences.sortBy,
    portfolioPreferences.sortOrder,
  ]);

  const getProjectTechnologies = useCallback(
    (projectId) => portfolioSelectors.getProjectTechnologies(portfolioSchema, projectId),
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

  const disciplines = useMemo(() => disciplineUtils.getAllDisciplines(), []);

  // Enhanced actions
  const toggleFavorite = useCallback(
    (projectId) => {
      setPortfolioPreferences((prev) => ({
        ...prev,
        favoriteProjects: prev.favoriteProjects.includes(projectId)
          ? prev.favoriteProjects.filter((id) => id !== projectId)
          : [...prev.favoriteProjects, projectId],
      }));
    },
    [setPortfolioPreferences],
  );

  const setViewMode = useCallback(
    (mode) => {
      setPortfolioPreferences((prev) => ({ ...prev, viewMode: mode }));
    },
    [setPortfolioPreferences],
  );

  const setSorting = useCallback(
    (sortBy, sortOrder = 'desc') => {
      setPortfolioPreferences((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    [setPortfolioPreferences],
  );

  const setLastViewedProject = useCallback(
    (projectId) => {
      setPortfolioPreferences((prev) => ({ ...prev, lastViewedProject: projectId }));
    },
    [setPortfolioPreferences],
  );

  return {
    // Data
    allProjects,
    featuredProjects,
    filteredProjects: processedProjects,
    paginatedProjects,
    categories,
    technologies,
    disciplines,

    // State
    selectedCategory,
    selectedDiscipline,
    searchTerm,
    currentPage,
    totalPages,
    portfolioPreferences,

    // Enhanced state queries
    hasResults: processedProjects.length > 0,
    totalResults: processedProjects.length,
    isFiltered: selectedCategory !== 'all' || selectedDiscipline !== 'all' || searchTerm !== '',
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,

    // Actions
    setSelectedCategory,
    setSelectedDiscipline,
    setSearchTerm,
    setCurrentPage,
    getProjectTechnologies,
    toggleFavorite,
    setViewMode,
    setSorting,
    setLastViewedProject,

    // Preference actions
    updatePreferences: setPortfolioPreferences,
    resetPreferences: () => setPortfolioPreferences({}),

    // Selectors
    getProjectsByCategory: useCallback(
      (category) => portfolioSelectors.getProjectsByCategory(portfolioSchema, category),
      [],
    ),
    getTechnologiesByCategory: useCallback(
      (category) => portfolioSelectors.getTechnologiesByCategory(portfolioSchema, category),
      [],
    ),
    getFavoriteProjects: useCallback(
      () =>
        allProjects.filter((project) => portfolioPreferences.favoriteProjects.includes(project.id)),
      [allProjects, portfolioPreferences.favoriteProjects],
    ),
    isFavorite: useCallback(
      (projectId) => portfolioPreferences.favoriteProjects.includes(projectId),
      [portfolioPreferences.favoriteProjects],
    ),

    // Discipline selectors
    getDisciplineById: useCallback(
      (disciplineId) => disciplineUtils.getDisciplineById(disciplineId),
      [],
    ),
    getDisciplineTechnologies: useCallback(
      (disciplineId) => disciplineUtils.getDisciplineTechnologies(disciplineId, portfolioSchema),
      [],
    ),
    getDisciplineProficiency: useCallback(
      (disciplineId) =>
        disciplineUtils.calculateDisciplineProficiency(disciplineId, portfolioSchema),
      [],
    ),
    getProjectsByDiscipline: useCallback(
      (disciplineId) => disciplineUtils.getProjectsByDiscipline(disciplineId, portfolioSchema),
      [],
    ),
  };
};
