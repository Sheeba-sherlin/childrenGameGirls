import React, { useState, useRef, useEffect } from 'react';
import './GeographyGame.css';
import TamilNaduMap from './assets/TamilNaduMap.png';
import IndiaMap from './assets/IndiaMap.png';
import IndianRiverMap from './assets/IndianRiverMap.png';
import WorldMap from './assets/WorldMap.png';

// Updated coordinates based on the map screenshots
const tamilNaduPoints = [
  { name: "Chennai", tamil: "சென்னை", top: "22%", left: "63%" },
  { name: "Coimbatore", tamil: "கோயம்புத்தூர்", top: "52%", left: "39%" },
  { name: "Madurai", tamil: "மதுரை", top: "57%", left: "47%" },
  { name: "Salem", tamil: "சேலம்", top: "37%", left: "41%" },
  { name: "Trichy", tamil: "திருச்சி", top: "43%", left: "50%" },
  { name: "Vellore", tamil: "வேலூர்", top: "30%", left: "55%" },
  { name: "Tanjore", tamil: "தஞ்சாவூர்", top: "48%", left: "59%" },
  { name: "Kanyakumari", tamil: "கன்னியாகுமரி", top: "80%", left: "42%" }
];

const indiaPoints = [
  { name: "New Delhi", tamil: "புது டெல்லி", top: "32%", left: "42.5%" },     // Capital, north-central position
  { name: "Maharashtra", tamil: "மஹாராஷ்ட்ரா", top: "61%", left: "36%" },    // Western state, moved inward
  { name: "TamilNadu", tamil: "தமிழ்நாடு", top: "83%", left: "44%" },           // Southeast coast, moved inward
  { name: "WestBengal", tamil: "மேற்கு வங்காளம்", top: "48%", left: "60%" }, // Eastern state, moved inward
  { name: "Karnataka", tamil: "கர்நாடகா", top: "72%", left: "39%" },        // South-central, moved inward
  { name: "Telgana", tamil: "தெலங்கானா", top: "72%", left: "45%" },        // South-central, moved inward
  { name: "Rajastan", tamil: "ராஜஸ்தான்", top: "39%", left: "37%" },        // Northwestern state, moved inward
  { name: "Goa", tamil: "கோவா", top: "72%", left: "36%" }                  // Small state on west coast, moved inward
];

const riverPoints = [
  { name: "Ganga",      tamil: "கங்கை",        top: "35.5%", left: "49%" },   // North-central, flowing from Himalayas
  { name: "Yamuna",     tamil: "யமுனை",        top: "40%", left: "48.5%" },   // Northwest, tributary of Ganga
  { name: "Brahmaputra",tamil: "பிரம்மபுத்திரா", top: "33%", left: "55%" },   // Northeast, flowing through Assam
  { name: "Narmada",    tamil: "நர்மதா",       top: "47.5%", left: "45%" },   // Central India, flowing westward
  { name: "Godavari",   tamil: "கோதாவரி",      top: "55%", left: "47%" },   // Central Deccan, flowing southeast
  { name: "Krishna",    tamil: "கிருஷ்ணா",      top: "58%", left: "47%" },   // South-central, flowing east
  { name: "Kaveri",     tamil: "காவேரி",       top: "68%", left: "45%" }    // Southern river, through Karnataka-Tamil Nadu
];

const worldPoints = [
  { name: "India", tamil: "இந்தியா", top: "48%", left: "66%" },
  { name: "USA", tamil: "அமெரிக்கா", top: "40%", left: "20%" },
  { name: "Australia", tamil: "ஆஸ்திரேலியா", top: "80%", left: "82%" },
  { name: "China", tamil: "சீனா", top: "42%", left: "70%" },
  { name: "Brazil", tamil: "பிரேசில்", top: "70%", left: "32%" },
  { name: "South Africa", tamil: "தென்னாப்பிரிக்கா", top: "79%", left: "50%" },
  { name: "Egypt", tamil: "எகிப்து", top: "48%", left: "48%" }
];

const GeographyGame = () => {
  const [currentMap, setCurrentMap] = useState('india');
  const [language, setLanguage] = useState('english');
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [placedMarkers, setPlacedMarkers] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameResults, setGameResults] = useState([]);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Map configurations with imported images
  const mapConfigs = {
    tamilnadu: {
      name: { english: "Tamil Nadu Map", tamil: "தமிழ்நாடு வரைபடம்" },
      points: tamilNaduPoints,
      bgImage: `url(${TamilNaduMap})`,
      bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
    },
    india: {
      name: { english: "India Map", tamil: "இந்தியா வரைபடம்" },
      points: indiaPoints,
      bgImage: `url(${IndiaMap})`,
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    rivers: {
      name: { english: "Indian Rivers Map", tamil: "இந்திய நதிகள் வரைபடம்" },
      points: riverPoints,
      bgImage: `url(${IndianRiverMap})`,
      bgColor: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
    },
    world: {
      name: { english: "World Map", tamil: "உலக வரைபடம்" },
      points: worldPoints,
      bgImage: `url(${WorldMap})`,
      bgColor: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    }
  };

  const texts = {
    english: {
      title: "Geography Explorer",
      subtitle: "Learn by Dragging and Dropping!",
      selectMap: "Choose a Map",
      startGame: "Start Game",
      score: "Score",
      timeLeft: "Time Left",
      dragToMap: "Drag to the correct location on the map",
      correct: "Correct! Well done!",
      incorrect: "Try again! Look at the hint.",
      gameOver: "Game Complete!",
      finalScore: "Final Score",
      playAgain: "Play Again",
      backToMenu: "Back to Menu",
      backToLevels: "Back to Levels",
      language: "தமிழ்",
      seconds: "seconds",
      question: "Question"
    },
    tamil: {
      title: "புவியியல் ஆய்வாளர்",
      subtitle: "இழுத்து விட்டு கற்றுக்கொள்ளுங்கள்!",
      selectMap: "வரைபடம் தேர்ந்தெடுக்கவும்",
      startGame: "விளையாட்டைத் தொடங்கு",
      score: "மதிப்பெண்",
      timeLeft: "மீதமுள்ள நேரம்",
      dragToMap: "வரைபடத்தில் சரியான இடத்தில் இழுக்கவும்",
      correct: "சரியானது! நன்று!",
      incorrect: "மீண்டும் முயற்சிக்கவும்! குறிப்பைப் பாருங்கள்.",
      gameOver: "விளையாட்டு முடிந்தது!",
      finalScore: "இறுதி மதிப்பெண்",
      playAgain: "மீண்டும் விளையாடு",
      backToMenu: "பிரதான மெனு",
      backToLevels: "நிலைகளுக்கு திரும்பு",
      language: "English",
      seconds: "விநாடிகள்",
      question: "கேள்வி"
    }
  };

  // Canvas confetti animation
  const createConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#fd79a8'];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;

        if (particle.life <= 0 || particle.y > canvas.height + 50) {
          particles.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setShowConfetti(false);
      }
    };

    animate();
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  // Start confetti when needed
  useEffect(() => {
    if (showConfetti) {
      createConfetti();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showConfetti]);

  const startGame = (mapType) => {
    setCurrentMap(mapType);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
  };

  const handleTimeUp = () => {
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    setGameResults(prev => [...prev, {
      question: currentPoint.name,
      correct: false,
      timeTaken: 30
    }]);
    nextQuestion();
  };

  const handleDragStart = (e, point) => {
    setDraggedItem(point);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const calculateDistance = (pos1, pos2) => {
    const x1 = parseFloat(pos1.left);
    const y1 = parseFloat(pos1.top);
    const x2 = parseFloat(pos2.left);
    const y2 = parseFloat(pos2.top);
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    const dropPosition = { left: `${x}%`, top: `${y}%` };
    const correctPosition = { left: currentPoint.left, top: currentPoint.top };

    const distance = calculateDistance(dropPosition, correctPosition);
    const isCorrect = distance < 10; // Increased tolerance to 10% for better user experience

    const timeTaken = 30 - timeLeft;

    if (isCorrect) {
      setScore(prev => prev + Math.max(100 - timeTaken * 2, 20));
      setShowConfetti(true);
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: true,
        position: correctPosition
      }]);
    } else {
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: false,
        position: dropPosition,
        correctPosition: correctPosition
      }]);
    }

    setGameResults(prev => [...prev, {
      question: currentPoint.name,
      correct: isCorrect,
      timeTaken: timeTaken
    }]);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mapConfigs[currentMap].points.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
      setPlacedMarkers([]);
    } else {
      setGameState('completed');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentMap('india');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    setShowConfetti(false);
  };

  const backToLevels = () => {
    setGameState('menu');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    setShowConfetti(false);
  };

  // Touch handling for mobile
  const handleTouchStart = (e, point) => {
    setDraggedItem(point);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!draggedItem) return;
    
    const mapElement = document.querySelector('.map-container');
    if (!mapElement) return;

    const rect = mapElement.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    const dropPosition = { left: `${x}%`, top: `${y}%` };
    const correctPosition = { left: currentPoint.left, top: currentPoint.top };

    const distance = calculateDistance(dropPosition, correctPosition);
    const isCorrect = distance < 10;

    const timeTaken = 30 - timeLeft;

    if (isCorrect) {
      setScore(prev => prev + Math.max(100 - timeTaken * 2, 20));
      setShowConfetti(true);
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: true,
        position: correctPosition
      }]);
    } else {
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: false,
        position: dropPosition,
        correctPosition: correctPosition
      }]);
    }

    setGameResults(prev => [...prev, {
      question: currentPoint.name,
      correct: isCorrect,
      timeTaken: timeTaken
    }]);

    setDraggedItem(null);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="game-container menu-screen">
        <div className="menu-content">
          <button
            onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
            className="language-toggle"
          >
            {texts[language].language}
          </button>
          
          <h1 className="main-title">{texts[language].title}</h1>
          <p className="main-subtitle">{texts[language].subtitle}</p>
          
          <div className="map-grid">
            {Object.entries(mapConfigs).map(([key, config]) => (
              <div
                key={key}
                onClick={() => startGame(key)}
                className="map-card"
              >
                <h3 className="map-title">
                  {config.name[language]}
                </h3>
                <div className="map-preview">
                  <span className="map-icon">🗺️</span>
                </div>
                <button className="start-button">
                  {texts[language].startGame}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Game Complete Screen - improved layout and navigation
  if (gameState === 'completed') {
    const correctAnswers = gameResults.filter(r => r.correct).length;
    const totalQuestions = gameResults.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="game-container complete-screen" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="complete-content" style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 className="complete-title" style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 20px 0',
            fontWeight: 'bold'
          }}>{texts[language].gameOver}</h1>
          <div className="trophy-icon" style={{
            fontSize: '5rem',
            margin: '20px 0'
          }}>🏆</div>
          <div className="final-score" style={{
            fontSize: '2rem',
            color: '#2d3748',
            fontWeight: 'bold',
            margin: '20px 0'
          }}>{texts[language].finalScore}: {score}</div>
          <div className="score-details" style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '40px'
          }}>
            {correctAnswers}/{totalQuestions} ({percentage}%)
          </div>
          
          <div className="complete-buttons" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => startGame(currentMap)}
              className="play-again-button"
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '200px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {texts[language].playAgain}
            </button>
            <button
              onClick={backToLevels}
              className="back-levels-button"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '180px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {texts[language].backToLevels}
            </button>
            <button
              onClick={resetGame}
              className="menu-button"
              style={{
                background: 'linear-gradient(135deg, #fd79a8 0%, #fdcbf1 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '160px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {texts[language].backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
  const currentMarker = placedMarkers.find(m => m.name === currentPoint.name);

  return (
    <div className="game-container playing-screen">
      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
        />
      )}

      <div className="game-wrapper">
        {/* Header */}
        <div className="game-header">
          <button
            onClick={backToLevels}
            className="back-button"
          >
            ← {texts[language].backToLevels}
          </button>
          
          <div className="header-info">
            <h2 className="map-name">
              {mapConfigs[currentMap].name[language]}
            </h2>
            <div className="question-info">
              {texts[language].question} {currentQuestionIndex + 1}/{mapConfigs[currentMap].points.length}
            </div>
          </div>

          <button
            onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
            className="language-toggle"
          >
            {texts[language].language}
          </button>
        </div>

        {/* Game Content */}
        <div className="game-content">
          {/* Sidebar */}
          <div className="sidebar">
            {/* Stats */}
            <div className="stats-container">
              {/* Score */}
              <div className="stat-card score-card">
                <h3 className="stat-title">{texts[language].score}</h3>
                <div className="stat-value score-value">{score}</div>
              </div>

              {/* Timer */}
              <div className="stat-card timer-card">
                <h3 className="stat-title">{texts[language].timeLeft}</h3>
                <div className="stat-value timer-value">{timeLeft}s</div>
                <div className="timer-bar">
                  <div 
                    className="timer-progress"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Draggable Item */}
            <div className="drag-container">
              <h3 className="drag-title">{texts[language].dragToMap}</h3>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, currentPoint)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, currentPoint)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="drag-item"
              >
                📍 {language === 'english' ? currentPoint.name : currentPoint.tamil}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="map-area">
            <div className="map-wrapper">
              <div
                className="map-container"
                style={{
                  background: mapConfigs[currentMap].bgImage || mapConfigs[currentMap].bgColor,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                  minHeight: '500px',
                  position: 'relative'
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Map Pattern Overlay */}
                <div className="map-overlay"></div>
                
                {/* Map Label */}
                <div className="map-label">
                  {mapConfigs[currentMap].name[language]}
                </div>
                
                {/* Player placed markers */}
                {placedMarkers.map((marker, index) => (
                  <div key={index}>
                    {/* User's placement */}
                    <div
                      className={`marker ${marker.placed ? 'marker-correct' : 'marker-incorrect'}`}
                      style={{ 
                        top: marker.position.top, 
                        left: marker.position.left
                      }}
                    >
                      <div className="marker-tooltip">
                        {language === 'english' ? marker.name : marker.tamil}
                      </div>
                    </div>
                    
                    {/* Show correct position if wrong */}
                    {!marker.placed && marker.correctPosition && (
                      <div
                        className="marker marker-correct-hint"
                        style={{ 
                          top: marker.correctPosition.top, 
                          left: marker.correctPosition.left
                        }}
                      >
                        <div className="marker-tooltip correct-tooltip">
                          ✓ Correct
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Drop zone indicator */}
                <div className="drop-indicator">
                  Drop zone: Drag here to place
                </div>
              </div>
              
              {/* Feedback */}
              {currentMarker && (
                <div className={`feedback ${currentMarker.placed ? 'feedback-correct' : 'feedback-incorrect'}`}>
                  {currentMarker.placed ? texts[language].correct : texts[language].incorrect}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* CSS Animations - Added directly to component */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
          }
          
          .marker:hover .marker-tooltip {
            opacity: 1 !important;
          }
          
          .drag-item:active {
            transform: scale(0.95) !important;
          }
          
          .map-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default GeographyGame;