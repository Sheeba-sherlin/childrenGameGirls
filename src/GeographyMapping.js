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
  { name: "New Delhi", tamil: "புது டெல்லி", top: "32%", left: "42.5%" },
  { name: "Maharashtra", tamil: "மஹாராஷ்ட்ரா", top: "61%", left: "36%" },
  { name: "TamilNadu", tamil: "தமிழ்நாடு", top: "83%", left: "44%" },
  { name: "WestBengal", tamil: "மேற்கு வங்காளம்", top: "48%", left: "60%" },
  { name: "Karnataka", tamil: "கர்நாடகா", top: "72%", left: "39%" },
  { name: "Telgana", tamil: "தெலங்கானா", top: "72%", left: "45%" },
  { name: "Rajastan", tamil: "ராஜஸ்தான்", top: "39%", left: "37%" },
  { name: "Goa", tamil: "கோவா", top: "72%", left: "36%" }
];

const riverPoints = [
  { name: "Ganga", tamil: "கங்கை", top: "35.5%", left: "49%" },
  { name: "Yamuna", tamil: "யமுனை", top: "40%", left: "48.5%" },
  { name: "Brahmaputra", tamil: "பிரம்மபுத்திரா", top: "33%", left: "55%" },
  { name: "Narmada", tamil: "நர்மதா", top: "47.5%", left: "45%" },
  { name: "Godavari", tamil: "கோதாவரி", top: "55%", left: "47%" },
  { name: "Krishna", tamil: "கிருஷ்ணா", top: "58%", left: "47%" },
  { name: "Kaveri", tamil: "காவேரி", top: "68%", left: "45%" }
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
  const [notification, setNotification] = useState(null);
  
  // New states for student report and feedback
  const [studentName, setStudentName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState({
    difficulty: '',
    enjoyment: '',
    comments: '',
    rating: 0
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const notificationRef = useRef(null);

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
      question: "Question",
      // New text entries for report and feedback
      studentName: "Student Name",
      enterName: "Enter your name to continue",
      participationReport: "Participation Report",
      viewReport: "View Report",
      feedback: "Feedback",
      giveFeedback: "Give Feedback",
      difficulty: "How difficult was this level?",
      enjoyment: "How much did you enjoy this activity?",
      additionalComments: "Additional Comments",
      rating: "Overall Rating",
      submitFeedback: "Submit Feedback",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      veryEasy: "Very Easy",
      veryHard: "Very Hard",
      loved: "Loved it!",
      liked: "Liked it",
      okay: "It was okay",
      disliked: "Didn't like it",
      hated: "Hated it",
      correctAnswers: "Correct Answers",
      totalTime: "Total Time",
      avgTimePerQuestion: "Avg Time per Question",
      accuracy: "Accuracy",
      performance: "Performance",
      excellent: "Excellent!",
      good: "Good job!",
      needsImprovement: "Needs improvement",
      thankYou: "Thank you for your feedback!"
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
      question: "கேள்வி",
      // New text entries for report and feedback in Tamil
      studentName: "மாணவர் பெயர்",
      enterName: "தொடர உங்கள் பெயரை உள்ளிடவும்",
      participationReport: "பங்கேற்பு அறிக்கை",
      viewReport: "அறிக்கையைப் பார்க்கவும்",
      feedback: "கருத்துக்கள்",
      giveFeedback: "கருத்துக்களைத் தரவும்",
      difficulty: "இந்த நிலை எவ்வளவு கடினமாக இருந்தது?",
      enjoyment: "இந்த செயல்பாட்டை நீங்கள் எவ்வளவு ரசித்தீர்கள்?",
      additionalComments: "கூடுதல் கருத்துக்கள்",
      rating: "ஒட்டுமொத்த மதிப்பீடு",
      submitFeedback: "கருத்துக்களைச் சமர்ப்பிக்கவும்",
      easy: "எளிது",
      medium: "நடுத்தரம்",
      hard: "கடினம்",
      veryEasy: "மிக எளிது",
      veryHard: "மிகக் கடினம்",
      loved: "மிகவும் பிடித்தது!",
      liked: "பிடித்தது",
      okay: "சரியானது",
      disliked: "பிடிக்கவில்லை",
      hated: "மிகவும் பிடிக்கவில்லை",
      correctAnswers: "சரியான பதில்கள்",
      totalTime: "மொத்த நேரம்",
      avgTimePerQuestion: "ஒரு கேள்விக்கு சராசரி நேரம்",
      accuracy: "துல்லியம்",
      performance: "செயல்திறன்",
      excellent: "சிறப்பானது!",
      good: "நல்லது!",
      needsImprovement: "முன்னேற்றம் தேவை",
      thankYou: "உங்கள் கருத்துக்களுக்கு நன்றி!"
    }
  };

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    
    if (notificationRef.current) {
      clearTimeout(notificationRef.current);
    }
    
    notificationRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
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

  // Cleanup notification timeout
  useEffect(() => {
    return () => {
      if (notificationRef.current) {
        clearTimeout(notificationRef.current);
      }
    };
  }, []);

  const startGame = (mapType) => {
    if (!studentName.trim()) {
      showNotification(texts[language].enterName, 'warning');
      return;
    }
    
    setCurrentMap(mapType);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    setNotification(null);
    setShowReport(false);
    setShowFeedbackForm(false);
    setFeedback({
      difficulty: '',
      enjoyment: '',
      comments: '',
      rating: 0
    });
  };

  const handleTimeUp = () => {
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    setGameResults(prev => [...prev, {
      question: currentPoint.name,
      correct: false,
      timeTaken: 30
    }]);
    showNotification("⏰ Time's up! Moving to next question.", 'warning');
    setTimeout(() => {
      nextQuestion();
    }, 2000);
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
    const isCorrect = distance < 10;

    const timeTaken = 30 - timeLeft;

    if (isCorrect) {
      setScore(prev => prev + Math.max(100 - timeTaken * 2, 20));
      setShowConfetti(true);
      showNotification(texts[language].correct + ' 🎉', 'success');
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: true,
        position: correctPosition
      }]);
    } else {
      showNotification(texts[language].incorrect + ' 🎯', 'error');
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
      setNotification(null);
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
    setNotification(null);
    setShowReport(false);
    setShowFeedbackForm(false);
  };

  const backToLevels = () => {
    setGameState('menu');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    setShowConfetti(false);
    setNotification(null);
    setShowReport(false);
    setShowFeedbackForm(false);
  };

  // New function to handle feedback submission
  const handleFeedbackSubmit = () => {
    if (!feedback.difficulty || !feedback.enjoyment || feedback.rating === 0) {
      showNotification('Please complete all required fields', 'warning');
      return;
    }
    
    console.log('Feedback submitted:', {
      studentName,
      mapType: currentMap,
      score,
      feedback,
      gameResults
    });
    
    showNotification(texts[language].thankYou, 'success');
    setShowFeedbackForm(false);
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
      showNotification(texts[language].correct + ' 🎉', 'success');
      setPlacedMarkers(prev => [...prev, {
        ...currentPoint,
        placed: true,
        position: correctPosition
      }]);
    } else {
      showNotification(texts[language].incorrect + ' 🎯', 'error');
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
          <div style={{ position: 'relative', width: '100%' }}>
            <button
              onClick={() => window.history.back()}
              className="back-home-button"
              style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                background: 'rgba(255,255,255,0.9)',
                color: '#2d3748',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                zIndex: 1000
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ← Back to Home
            </button>
            <button
              onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
              className="language-toggle-menu"
              style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                background: 'rgba(255,255,255,0.9)',
                color: '#2d3748',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                zIndex: 1000
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {texts[language].language}
            </button>
          </div>
          
          <h1 className="main-title">{texts[language].title}</h1>
          <p className="main-subtitle">{texts[language].subtitle}</p>
          
          {/* Student Name Input */}
          <div style={{
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            <label style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {texts[language].studentName}
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={texts[language].enterName}
              style={{
                padding: '12px 20px',
                fontSize: '16px',
                borderRadius: '25px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.9)',
                minWidth: '300px',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #4facfe';
                e.target.style.boxShadow = '0 0 10px rgba(79, 172, 254, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255,255,255,0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
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

  // Game Complete Screen - Updated with report and feedback
  if (gameState === 'completed') {
    const correctAnswers = gameResults.filter(r => r.correct).length;
    const totalQuestions = gameResults.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTime = gameResults.reduce((sum, result) => sum + result.timeTaken, 0);
    const avgTime = Math.round(totalTime / totalQuestions);

    let performanceLevel = '';
    let performanceEmoji = '';
    if (percentage >= 80) {
      performanceLevel = texts[language].excellent;
      performanceEmoji = '🌟';
    } else if (percentage >= 60) {
      performanceLevel = texts[language].good;
      performanceEmoji = '👍';
    } else {
      performanceLevel = texts[language].needsImprovement;
      performanceEmoji = '📚';
    }

    // Student Report Component
    const StudentReport = () => (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '30px',
        margin: '20px 0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#2d3748',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: '2px solid #4facfe',
          paddingBottom: '10px'
        }}>
          📊 {texts[language].participationReport}
        </h2>
        
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <strong style={{ fontSize: '1.2rem', color: '#4facfe' }}>
            {texts[language].studentName}: {studentName}
          </strong>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].correctAnswers}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{correctAnswers}/{totalQuestions}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].accuracy}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{percentage}%</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].totalTime}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTime}s</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].avgTimePerQuestion}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{avgTime}s</div>
          </div>
        </div>

        <div style={{
          background: percentage >= 80 ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
                     percentage >= 60 ? 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)' :
                     'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{performanceEmoji}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            {texts[language].performance}: {performanceLevel}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Question Details:</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {gameResults.map((result, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                margin: '5px 0',
                borderRadius: '8px',
                background: result.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: result.correct ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {result.correct ? '✅' : '❌'} {result.question}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                  {result.timeTaken}s
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowReport(false)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Close Report
        </button>
      </div>
    );

    // Feedback Form Component
    const FeedbackForm = () => (
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: '25px',
        padding: '40px',
        margin: '0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        maxHeight: '80vh',
        overflowY: 'auto',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255,255,255,0.3)'
      }}>
        <h2 style={{
          fontSize: '2.2rem',
          color: '#2d3748',
          marginBottom: '25px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          💭 {texts[language].feedback}
        </h2>

        <div style={{ 
          marginBottom: '25px', 
          textAlign: 'center',
          padding: '15px',
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
          borderRadius: '15px',
          border: '2px solid rgba(79, 172, 254, 0.2)'
        }}>
          <strong style={{ fontSize: '1.3rem', color: '#4facfe' }}>
            {texts[language].studentName}: {studentName}
          </strong>
        </div>

        {/* Difficulty Rating */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '15px', 
            fontWeight: 'bold', 
            color: '#2d3748',
            fontSize: '1.1rem'
          }}>
            {texts[language].difficulty}
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { value: 'very-easy', label: texts[language].veryEasy, color: '#4CAF50' },
              { value: 'easy', label: texts[language].easy, color: '#8BC34A' },
              { value: 'medium', label: texts[language].medium, color: '#FF9800' },
              { value: 'hard', label: texts[language].hard, color: '#FF5722' },
              { value: 'very-hard', label: texts[language].veryHard, color: '#f44336' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFeedback(prev => ({ ...prev, difficulty: option.value }))}
                style={{
                  padding: '12px 20px',
                  borderRadius: '25px',
                  border: `2px solid ${option.color}`,
                  background: feedback.difficulty === option.value ? option.color : 'transparent',
                  color: feedback.difficulty === option.value ? 'white' : option.color,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  transform: feedback.difficulty === option.value ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: feedback.difficulty === option.value ? `0 5px 15px ${option.color}40` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (feedback.difficulty !== option.value) {
                    e.target.style.background = `${option.color}20`;
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (feedback.difficulty !== option.value) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enjoyment Rating */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '15px', 
            fontWeight: 'bold', 
            color: '#2d3748',
            fontSize: '1.1rem'
          }}>
            {texts[language].enjoyment}
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { value: 'loved', label: texts[language].loved, color: '#E91E63', emoji: '😍' },
              { value: 'liked', label: texts[language].liked, color: '#FF9800', emoji: '😊' },
              { value: 'okay', label: texts[language].okay, color: '#9C27B0', emoji: '😐' },
              { value: 'disliked', label: texts[language].disliked, color: '#FF5722', emoji: '😕' },
              { value: 'hated', label: texts[language].hated, color: '#f44336', emoji: '😢' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFeedback(prev => ({ ...prev, enjoyment: option.value }))}
                style={{
                  padding: '12px 20px',
                  borderRadius: '25px',
                  border: `2px solid ${option.color}`,
                  background: feedback.enjoyment === option.value ? option.color : 'transparent',
                  color: feedback.enjoyment === option.value ? 'white' : option.color,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  transform: feedback.enjoyment === option.value ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: feedback.enjoyment === option.value ? `0 5px 15px ${option.color}40` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (feedback.enjoyment !== option.value) {
                    e.target.style.background = `${option.color}20`;
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (feedback.enjoyment !== option.value) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <span>{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '15px', 
            fontWeight: 'bold', 
            color: '#2d3748',
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            {texts[language].rating} <span style={{ color: '#f44336' }}>*</span>
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            justifyContent: 'center',
            background: 'rgba(255,215,0,0.1)',
            padding: '20px',
            borderRadius: '20px',
            border: '2px solid rgba(255,215,0,0.3)'
          }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2.5rem',
                  cursor: 'pointer',
                  color: star <= feedback.rating ? '#FFD700' : '#ddd',
                  transition: 'all 0.2s ease',
                  transform: star <= feedback.rating ? 'scale(1.1)' : 'scale(1)',
                  filter: star <= feedback.rating ? 'drop-shadow(0 0 8px #FFD700)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.filter = 'drop-shadow(0 0 10px #FFD700)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = star <= feedback.rating ? 'scale(1.1)' : 'scale(1)';
                  e.target.style.filter = star <= feedback.rating ? 'drop-shadow(0 0 8px #FFD700)' : 'none';
                }}
              >
                ⭐
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            {feedback.rating === 0 && 'Click a star to rate'}
            {feedback.rating === 1 && 'Poor'}
            {feedback.rating === 2 && 'Fair'}
            {feedback.rating === 3 && 'Good'}
            {feedback.rating === 4 && 'Very Good'}
            {feedback.rating === 5 && 'Excellent'}
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '15px', 
            fontWeight: 'bold', 
            color: '#2d3748',
            fontSize: '1.1rem'
          }}>
            {texts[language].additionalComments}
          </label>
          <textarea
            value={feedback.comments}
            onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Share your thoughts..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '15px',
              borderRadius: '15px',
              border: '2px solid rgba(0,0,0,0.1)',
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'Arial, sans-serif',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4facfe';
              e.target.style.boxShadow = '0 0 10px rgba(79, 172, 254, 0.3)';
              e.target.style.background = 'rgba(255,255,255,0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0,0,0,0.1)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255,255,255,0.8)';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={handleFeedbackSubmit}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
            }}
          >
            {texts[language].submitFeedback}
          </button>
          <button
            onClick={() => setShowFeedbackForm(false)}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #757575 0%, #9E9E9E 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(117, 117, 117, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 35px rgba(117, 117, 117, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(117, 117, 117, 0.3)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );

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
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center'
        }}>
          {!showReport && !showFeedbackForm && (
            <>
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
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setShowReport(true)}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 20px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📊 {texts[language].viewReport}
                </button>
                
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 20px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  💭 {texts[language].giveFeedback}
                </button>
              </div>

              <div className="game-action-buttons" style={{
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
            </>
          )}

          {showReport && <StudentReport />}
          {showFeedbackForm && <FeedbackForm />}
        </div>
      </div>
    );
  }

  // Playing Screen
  const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
  const currentMarker = placedMarkers.find(m => m.name === currentPoint.name);

  return (
    <div className="game-container playing-screen">
      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: notification.type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
                     notification.type === 'error' ? 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)' :
                     'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          fontSize: '16px',
          fontWeight: 'bold',
          animation: 'slideInDown 0.5s ease-out',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {notification.message}
        </div>
      )}

      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 999
          }}
        />
      )}

      <div className="game-wrapper">
        {/* Header */}
        <div className="game-header" style={{
          position: 'relative',
          zIndex: 100,
          background: 'rgba(255,255,255,0.98)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(15px)'
        }}>
          <div className="header-info" style={{
            textAlign: 'center',
            flexGrow: 1
          }}>
            <h2 className="map-name" style={{
              fontSize: '1.8rem',
              color: '#2d3748',
              margin: 0,
              fontWeight: 'bold'
            }}>
              {mapConfigs[currentMap].name[language]}
            </h2>
            <div className="question-info" style={{
              fontSize: '1rem',
              color: '#666',
              marginTop: '5px'
            }}>
              {texts[language].question} {currentQuestionIndex + 1}/{mapConfigs[currentMap].points.length}
            </div>
          </div>

          <button
            onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
            className="language-toggle"
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              color: '#2d3748',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {texts[language].language}
          </button>
        </div>

        {/* Game Content */}
        <div className="game-content" style={{
          flex: 1,
          display: 'flex',
          gap: '0',
          padding: '0',
          minHeight: 0
        }}>
          {/* Sidebar */}
          <div className="sidebar" style={{
            width: '320px',
            background: 'rgba(139, 116, 237, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
            minHeight: '100%'
          }}>
            {/* Back Button */}
            <button
              onClick={backToLevels}
              className="back-button-sidebar"
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
            >
              ← {texts[language].backToLevels}
            </button>

            {/* Score */}
            <div className="stat-card score-card" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 className="stat-title" style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{texts[language].score}</h3>
              <div className="stat-value score-value" style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                color: '#FFD700'
              }}>{score}</div>
            </div>

            {/* Timer */}
            <div className="stat-card timer-card" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 className="stat-title" style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{texts[language].timeLeft}</h3>
              <div className="stat-value timer-value" style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                color: timeLeft <= 10 ? '#FF6B6B' : '#FF9800'
              }}>{timeLeft}s</div>
              <div className="timer-bar" style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                marginTop: '15px',
                overflow: 'hidden'
              }}>
                <div 
                  className="timer-progress"
                  style={{
                    width: `${(timeLeft / 30) * 100}%`,
                    height: '100%',
                    background: timeLeft <= 10 ? 'linear-gradient(90deg, #FF6B6B, #FF4757)' : 'linear-gradient(90deg, #4CAF50, #FFC107, #FF9800)',
                    transition: 'width 1s linear',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            {/* Draggable Item */}
            <div className="drag-container" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 className="drag-title" style={{
                fontSize: '0.95rem',
                color: 'white',
                margin: '0 0 15px 0',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>{texts[language].dragToMap}</h3>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, currentPoint)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, currentPoint)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="drag-item"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  color: 'white',
                  padding: '15px 20px',
                  borderRadius: '25px',
                  textAlign: 'center',
                  cursor: 'grab',
                  userSelect: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
              >
                📍 {language === 'english' ? currentPoint.name : currentPoint.tamil}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="map-area" style={{
            flex: 1,
            minHeight: 0,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div className="map-wrapper" style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '4/3',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <div
                className="map-container"
                style={{
                  background: mapConfigs[currentMap].bgImage || mapConfigs[currentMap].bgColor,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Map Pattern Overlay */}
                <div className="map-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.1)',
                  pointerEvents: 'none'
                }}></div>
                
                {/* Map Label */}
                <div className="map-label" style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  {mapConfigs[currentMap].name[language]}
                </div>
                
                {/* Player placed markers */}
                {placedMarkers.map((marker, index) => (
                  <div key={index}>
                    {/* User's placement */}
                    <div
                      className={`marker ${marker.placed ? 'marker-correct' : 'marker-incorrect'}`}
                      style={{ 
                        position: 'absolute',
                        top: marker.position.top, 
                        left: marker.position.left,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 20,
                        transition: 'all 0.3s ease',
                        background: marker.placed ? '#4CAF50' : '#f44336',
                        boxShadow: marker.placed ? '0 0 0 3px rgba(76, 175, 80, 0.3)' : '0 0 0 3px rgba(244, 67, 54, 0.3)',
                        animation: marker.placed ? 'pulse 2s infinite' : 'none'
                      }}
                    >
                      <div className="marker-tooltip" style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                        zIndex: 30
                      }}>
                        {language === 'english' ? marker.name : marker.tamil}
                      </div>
                    </div>
                    
                    {/* Show correct position if wrong */}
                    {!marker.placed && marker.correctPosition && (
                      <div
                        className="marker marker-correct-hint"
                        style={{ 
                          position: 'absolute',
                          top: marker.correctPosition.top, 
                          left: marker.correctPosition.left,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          zIndex: 20,
                          transition: 'all 0.3s ease',
                          background: '#2196F3',
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.3)'
                        }}
                      >
                        <div className="marker-tooltip correct-tooltip" style={{
                          position: 'absolute',
                          bottom: '30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(33, 150, 243, 0.9)',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none',
                          zIndex: 30
                        }}>
                          ✓ Correct
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Drop zone indicator */}
                <div className="drop-indicator" style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  opacity: 0.7
                }}>
                  Drop zone: Drag here to place
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CSS Animations - Added directly to component */}
        <style jsx>{`
          @keyframes slideInDown {
            from {
              transform: translate(-50%, -100%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
          
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

          /* Game Container Styles */
          .game-container {
            min-height: 100vh;
            font-family: 'Arial', sans-serif;
            position: relative;
          }

          .menu-screen {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .playing-screen {
            background: linear-gradient(135deg, #FF6B9D 0%, #C44CE6 50%, #667eea 100%);
            min-height: 100vh;
          }

          .menu-content {
            max-width: 1200px;
            width: 100%;
            text-align: center;
          }

          .main-title {
            font-size: 3.5rem;
            color: white;
            margin-bottom: 10px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .main-subtitle {
            font-size: 1.3rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 50px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }

          .map-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }

          .map-card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
          }

          .map-title {
            font-size: 1.5rem;
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: bold;
          }

          .map-preview {
            margin: 20px 0;
          }

          .map-icon {
            font-size: 4rem;
          }

          .start-button {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease;
            width: 100%;
          }

          .game-wrapper {
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          @media (max-width: 768px) {
            .game-content {
              flex-direction: column !important;
              gap: 10px !important;
            }
            
            .sidebar {
              width: 100% !important;
              padding: 15px !important;
              background: rgba(139, 116, 237, 0.95) !important;
            }
            
            .back-button-sidebar {
              display: none !important;
            }
            
            .map-area {
              padding: 10px !important;
            }
            
            .map-wrapper {
              padding: 15px !important;
            }
            
            .main-title {
              font-size: 2.5rem !important;
            }
            
            .map-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }

            .game-header {
              padding: 10px 15px !important;
            }

            .map-name {
              font-size: 1.4rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GeographyGame;