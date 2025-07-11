import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import { GameVisibilityProvider } from './contexts/GameVisibilityContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameVisibilityProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GameVisibilityProvider>
  </React.StrictMode>,
);
