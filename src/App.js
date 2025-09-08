import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";

// Import all game components
import Game2048 from './Game2048';
import MathQuiz from './MathQuiz';
import GFGWordGame from './GFGWordGame';
import ScienceQuiz from './ScienceQuiz';
import LabExperiment from './LabExperiment';
import GeographyMappping from './GeographyMapping';
import BiologyGame from './BiologyGame';

// Back Button Component - Only shows in games
const BackButton = () => {
  const location = useLocation();
  
  // Only show on game pages (not on home page)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Link to="/" className="back-btn">
      ← Back to Menu
    </Link>
  );
};

// Game Icon Component
const GameIcon = ({ emoji, title, to }) => (
  <Link to={to} className="game-icon-container">
    <div className="game-icon">
      <span role="img" aria-label={title}>
        {emoji}
      </span>
      <h3>{title}</h3>
    </div>
  </Link>
);

// Game Selection Component
const GameSelection = () => (
  <div className="games-grid">
    <GameIcon emoji="🎲" title="Play Upto 2048" to="/2048" />
    <GameIcon emoji="➕" title="Math Quiz" to="/mathQuiz" />
    <GameIcon emoji="🔤" title="Word Guess Game" to="/wordGame" />
    <GameIcon emoji="🔬" title="Science Quiz" to="/scienceQuiz" />
    <GameIcon emoji="🧪" title="Lab Experiments" to="/labExperiments" />
    <GameIcon emoji="🗺" title="Geography Mapping" to="/GeographyMapping" />
    <GameIcon emoji="🫀" title="Biology Game" to="/BiologyGame" />
  </div>
);

// Home Page Component
const Home = () => {
  const quotes = [
    "Science is not only compatible with spirituality; it is a profound source of spirituality. - Carl Sagan",
    "The important thing is not to stop questioning. Curiosity has its own reason for existing. - Albert Einstein",
    "Somewhere, something incredible is waiting to be known. - Carl Sagan",
    "The more I learn, the more I realize how much I don't know. - Albert Einstein",
    "In science, there are no shortcuts to truth. - Karl Popper",
    "The greatest scientists are artists as well. - Albert Einstein",
    "Everything is theoretically impossible until it is done. - Robert A. Heinlein",
    "We are made of star-stuff. - Carl Sagan"
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="main-container">
      <header className="header-section">
        <h2 className="main-title">MixMasti</h2>
        <p className="game-selection-prompt">Select a game to begin playing!</p>
      </header>
      
      <div className="games-section">
        <GameSelection />
      </div>
      
      <footer className="footer-section">
        <p className="quote-text">"{randomQuote}"</p>
      </footer>
    </div>
  );
};

// Game Wrapper Component for fullscreen games
const GameWrapper = ({ children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="game-fullscreen-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen app-bg">
        {/* Back Button - Shows only on game pages */}
        <BackButton />
        
        {/* Main Routes */}
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Game Routes */}
          <Route 
            path="/2048" 
            element={
              <GameWrapper>
                <Game2048 />
              </GameWrapper>
            } 
          />
          <Route 
            path="/mathQuiz" 
            element={
              <GameWrapper>
                <MathQuiz />
              </GameWrapper>
            } 
          />
          <Route 
            path="/wordGame" 
            element={
              <GameWrapper>
                <GFGWordGame />
              </GameWrapper>
            } 
          />
          <Route 
            path="/scienceQuiz" 
            element={
              <GameWrapper>
                <ScienceQuiz />
              </GameWrapper>
            } 
          />
          <Route 
            path="/labExperiments" 
            element={
              <GameWrapper>
                <LabExperiment />
              </GameWrapper>
            } 
          />
          <Route 
            path="/GeographyMapping" 
            element={
              <GameWrapper>
                <GeographyMappping />
              </GameWrapper>
            } 
          />
          <Route 
            path="/BiologyGame" 
            element={
              <GameWrapper>
                <BiologyGame />
              </GameWrapper>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;