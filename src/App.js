import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";

// Import all game components
import ImageWordIdentification from './ImageWordIdentification';
import TimedImageRecognition from './TimedImageRecognition';
import Game2048 from './Game2048';
import MathQuiz from './MathQuiz';
import GFGWordGame from './GFGWordGame';
import ScienceQuiz from './ScienceQuiz';
import LabExperiment from './LabExperiment';
import GeographyMappping from './GeographyMapping';
import BiologyGame from './BiologyGame';

// Universal Header Component
const UniversalHeader = () => {
  const location = useLocation();
  
  // Get game title based on current path
  const getGameTitle = () => {
    switch (location.pathname) {
      case '/imageWord':
        return 'Image Word Identification';
      case '/timedImage':
        return 'Timed Image Recognition';
      case '/2048':
        return 'Play Upto 2048';
      case '/mathQuiz':
        return 'Math Quiz';
      case '/wordGame':
        return 'Word Guess Game';
      case '/scienceQuiz':
        return 'Science Quiz';
      case '/labExperiments':
        return 'Lab Experiments';
      case '/GeographyMapping':
        return 'Geography Mapping';
      case '/BiologyGame':
        return 'Biology Game';
      case '/':
      default:
        return '';
    }
  };

  return (
    <header className="universal-header">
      <div className="header-content">
        <h1 className="expo-title">Science Park Expo Thiruvallur</h1>
        <h2 className="game-title">{getGameTitle()}</h2>
        {location.pathname !== '/' && (
          <Link to="/" className="back-to-menu">
            🏠 Back to Menu
          </Link>
        )}
      </div>
    </header>
  );
};

// Universal Footer Component
const UniversalFooter = () => {
  return (
    <footer className="universal-footer">
      <div className="footer-content">
        <p className="college-credit">Designed and Developed by RMK College</p>
      </div>
    </footer>
  );
};

// Game Icon Component
const GameIcon = ({ emoji, title, to }) => (
  <Link to={to} className="game-icon-container">
    <div
      className={`game-icon flex flex-col items-center justify-center cursor-pointer 
      hover:shadow-xl transition-all duration-300 bg-white`}
    >
      <span className="text-5xl mb-4" role="img" aria-label={title}>
        {emoji}
      </span>
      <h3 className="text-center font-medium">{title}</h3>
    </div>
  </Link>
);

// Game Selection Component
const GameSelection = () => (
  <div className="games-grid">
    <GameIcon emoji="🎮" title="Image Word Identification" to="/imageWord" />
    <GameIcon emoji="⏱" title="Timed Image Recognition" to="/timedImage" />
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

// Game Wrapper Component for consistent styling
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
        {/* Universal Header - Always visible */}
        <UniversalHeader />
        
        {/* Main Routes */}
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Game Routes - Each wrapped in GameWrapper for fullscreen experience */}
          <Route 
            path="/imageWord" 
            element={
              <GameWrapper>
                <ImageWordIdentification />
              </GameWrapper>
            } 
          />
          <Route 
            path="/timedImage" 
            element={
              <GameWrapper>
                <TimedImageRecognition />
              </GameWrapper>
            } 
          />
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
        
        {/* Universal Footer - Always visible */}
        <UniversalFooter />
      </div>
    </Router>
  );
}

export default App;