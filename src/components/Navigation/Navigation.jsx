import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import './Navigation.css';
import { useTheme } from '../../hooks/useTheme';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { HamburgerMenu } from '../HamburgerMenu';
import { SideDrawer } from '../SideDrawer';
import { NavigationDrawer } from '../NavigationDrawer';
import GlitchText from '../GlitchText';

export const Navigation = React.memo(
  ({
    sectionIds = {
      hero: 'hero',
      about: 'about',
      portfolio: ['portfolio', 'projects'],
      skills: ['skills', 'tech', 'technologies'],
    },
    onNavigate = () => {},
  }) => {
    const { theme, toggleTheme } = useTheme();
    const { scrollToSection, findSectionByAlternatives } = useScrollToSection();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Drawer toggle handlers
    const toggleDrawer = useCallback(() => {
      setIsDrawerOpen((prev) => !prev);
    }, []);

    const closeDrawer = useCallback(() => {
      setIsDrawerOpen(false);
    }, []);

    // Clean navigation handler with single responsibility
    const handleNavigation = useCallback(
      (targetSection, alternatives = []) => {
        const sectionId =
          Array.isArray(alternatives) && alternatives.length > 0
            ? findSectionByAlternatives(targetSection, alternatives)
            : targetSection;

        if (sectionId && scrollToSection(sectionId)) {
          onNavigate(sectionId);
          closeDrawer(); // Close drawer after navigation
        }
      },
      [scrollToSection, findSectionByAlternatives, onNavigate, closeDrawer],
    );

    // Stable navigation handlers following method signature consistency
    const handleHomeClick = useCallback(
      () => handleNavigation(sectionIds.hero),
      [handleNavigation, sectionIds.hero],
    );

    const handleAboutClick = useCallback(
      () => handleNavigation(sectionIds.about),
      [handleNavigation, sectionIds.about],
    );

    const handlePortfolioClick = useCallback(
      () => handleNavigation(sectionIds.portfolio[0], sectionIds.portfolio.slice(1)),
      [handleNavigation, sectionIds.portfolio],
    );

    const handleSkillsClick = useCallback(
      () => handleNavigation(sectionIds.skills[0], sectionIds.skills.slice(1)),
      [handleNavigation, sectionIds.skills],
    );

    return (
      <>
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="nav-container">
            <button
              className="nav-brand"
              onClick={handleHomeClick}
              aria-label="Go to home section"
              type="button"
            >
              <GlitchText
                trigger="onMount"
                duration={1000}
                charactersPerFrame={1}
                className="brand-glitch"
              >
                JOHN MARQUEZ
              </GlitchText>
            </button>
            <div className="nav-right">
              <ul className="nav-menu" role="menubar">
                <li role="none">
                  <button
                    className="nav-link"
                    onClick={handleAboutClick}
                    aria-label="Go to about section"
                    role="menuitem"
                    type="button"
                  >
                    <GlitchText
                      trigger="onMount"
                      duration={1000}
                      charactersPerFrame={1}
                      className="brand-glitch"
                    >
                      About
                    </GlitchText>
                  </button>
                </li>
                <li role="none">
                  <button
                    className="nav-link"
                    onClick={handlePortfolioClick}
                    aria-label="Go to portfolio section"
                    role="menuitem"
                    type="button"
                  >
                    <GlitchText
                      trigger="onMount"
                      duration={1000}
                      charactersPerFrame={1}
                      className="brand-glitch"
                    >
                      Portfolio
                    </GlitchText>
                  </button>
                </li>
                <li role="none">
                  <button
                    className="nav-link"
                    onClick={handleSkillsClick}
                    aria-label="Go to tech skills section"
                    role="menuitem"
                    type="button"
                  >
                    <GlitchText
                      trigger="onMount"
                      duration={1000}
                      charactersPerFrame={1}
                      className="brand-glitch"
                    >
                      Tech
                    </GlitchText>
                  </button>
                </li>
              </ul>
              <HamburgerMenu isOpen={isDrawerOpen} onClick={toggleDrawer} />
            </div>
          </div>
        </nav>

        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title="Navigation Menu"
          position="left"
        >
          <NavigationDrawer
            onHomeClick={handleHomeClick}
            onAboutClick={handleAboutClick}
            onPortfolioClick={handlePortfolioClick}
            onSkillsClick={handleSkillsClick}
            onThemeToggle={toggleTheme}
            theme={theme}
          />
        </SideDrawer>
      </>
    );
  },
);

// Clear interface contract following ReactPrinciples.md
Navigation.propTypes = {
  sectionIds: PropTypes.shape({
    hero: PropTypes.string,
    about: PropTypes.string,
    portfolio: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.arrayOf(PropTypes.string),
  }),
  onNavigate: PropTypes.func,
};

Navigation.displayName = 'Navigation';
