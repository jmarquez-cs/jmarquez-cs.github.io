import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import { GameVisibilityProvider } from './contexts/GameVisibilityContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameVisibilityProvider>
      <App />
    </GameVisibilityProvider>
  </React.StrictMode>,
);
