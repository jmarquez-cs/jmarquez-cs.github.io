import React from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { Mermaid } from './components/Mermaid';
import { Contact } from './components/Contact';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useConfetti } from './hooks/useConfetti';
import { useGameVisibility } from './contexts/GameVisibilityContext';
import { Games } from './components/Games/Games'; // Import Games component (now modal)

function App() {
  const { theme, toggleTheme } = useTheme();
  const { triggerConfetti } = useConfetti();
  const { showGame } = useGameVisibility();

  const handleThemeToggle = () => {
    toggleTheme();
    triggerConfetti();
  };

  return (
    <div className="App">
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <Portfolio />
        <Contact />
        <Mermaid />
      </main>
      <ThemeToggle />
      <Games /> {/* Render Games component (now modal) */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 John Marquez. Fractional CTO & Blockchain Expert.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
