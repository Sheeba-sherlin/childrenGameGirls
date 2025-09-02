import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./App.css";

// Import all game components
import ImageWordIdentification from './ImageWordIdentification';
import TimedImageRecognition from './TimedImageRecognition';
import Game2048 from './Game2048';
import MathQuiz from './MathQuiz';
import GFGWordGame from './GFGWordGame';
import ScienceQuiz from './ScienceQuiz';
import LabExperiment from './LabExperiment';

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
    <GameIcon emoji="⏱️" title="Timed Image Recognition" to="/timedImage" />
    <GameIcon emoji="🎲" title="Play Upto 2048" to="/2048" />
    <GameIcon emoji="➕" title="Math Quiz" to="/mathQuiz" />
    <GameIcon emoji="🔤" title="Word Guess Game" to="/wordGame" />
    <GameIcon emoji="🔬" title="Science Quiz" to="/scienceQuiz" />
    <GameIcon emoji="🧪" title="Lab Experiments" to="/labExperiments" />
  </div>
);

// Home Page
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
        <h1 className="main-title">Interactive Children's Educational Gaming App</h1>
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

function App() {
  return (
    <Router>
      <div className="min-h-screen app-bg">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Game Routes */}
          <Route path="/imageWord" element={<ImageWordIdentification />} />
          <Route path="/timedImage" element={<TimedImageRecognition />} />
          <Route path="/2048" element={<Game2048 />} />
          <Route path="/mathQuiz" element={<MathQuiz />} />
          <Route path="/wordGame" element={<GFGWordGame />} />
          <Route path="/scienceQuiz" element={<ScienceQuiz />} />
          <Route path="/labExperiments" element={<LabExperiment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
