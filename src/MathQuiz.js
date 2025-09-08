import React, { useState, useEffect, useCallback, useRef } from "react";

// Tamil Translations
const translations = {
  english: {
    title: "Math Quiz Challenge",
    languageButton: "தமிழ்",
    beginner: "Beginner",
    intermediate: "Intermediate", 
    advanced: "Advanced",
    question: "Question",
    retry: "Retry",
    home: "Home",
    results: "Results",
    score: (score, total) => `You scored ${score}/${total}`,
    selectAnswerPrompt: "Drag the correct answer here:",
    sequencePrompt: "Order the steps by dragging and dropping them:",
    checkAnswer: "Check Answer",
    clearSequence: "Clear",
    submit: "Submit",
    answerPrompt: "Type your answer here...",
    correctAnswer: (answer) => `Correct Answer: ${answer}`,
    starPerformerTitle: "⭐ Star Performer!",
    achieverTitle: "🎯 Great Job!",
    needsPracticeTitle: "📚 Keep Practicing!",
    timeUp: "⏰ Time's up!",
    correct: "🎉 Correct! Well done!",
    instructions: "Instructions",
    startQuiz: "Start Quiz",
    nextQuestion: "Next Question"
  },
  tamil: {
    title: "கணித வினாடி வினா சவால்",
    languageButton: "English", 
    beginner: "ஆரம்பநிலை",
    intermediate: "இடைநிலை",
    advanced: "மேம்பட்ட நிலை",
    question: "கேள்வி",
    retry: "மீண்டும் முயற்சி செய்",
    home: "முகப்பு",
    results: "முடிவுகள்",
    score: (score, total) => `நீங்கள் ${score}/${total} மதிப்பெண் பெற்றீர்கள்`,
    selectAnswerPrompt: "சரியான விடையை இங்கே இழுத்து விடுங்கள்:",
    sequencePrompt: "படிநிலைகளை இழுத்து விட்டு வரிசைப்படுத்துங்கள்:",
    checkAnswer: "விடையைச் சரிபார்க்கவும்",
    clearSequence: "அழி",
    submit: "சமர்ப்பிக்கவும்",
    answerPrompt: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...",
    correctAnswer: (answer) => `சரியான விடை: ${answer}`,
    starPerformerTitle: "⭐ சிறந்த சாதனையாளர்!",
    achieverTitle: "🎯 நல்லது!",
    needsPracticeTitle: "📚 தொடர்ந்து பயிற்சி செய்யுங்கள்!",
    timeUp: "⏰ நேரம் முடிந்துவிட்டது!",
    correct: "🎉 சரி! நல்லது!",
    instructions: "வழிமுறைகள்",
    startQuiz: "வினாடி வினா தொடங்கு",
    nextQuestion: "அடுத்த கேள்வி"
  },
};

// Enhanced Question Bank
const questionBank = {
  beginner: [
    { q: "What is 45 ÷ 9?", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "45 ÷ 9 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "LCM of 12 and 18", correct: "36", options: ["24", "36", "48", "12"], language: { tamil: "12 மற்றும் 18-இன் மீ.சி.ம" }, type: "dragAndDrop" },
    { q: "HCF of 36 and 54", correct: "18", options: ["6", "9", "18", "27"], language: { tamil: "36 மற்றும் 54-இன் மீ.பொ.வ" }, type: "dragAndDrop" },
    { q: "Solve: 15 + (8 × 2)", correct: "31", options: ["31", "23", "39", "20"], language: { tamil: "தீர்க்கவும்: 15 + (8 × 2)" }, type: "dragAndDrop" },
    { q: "Area of a square with side 5 cm", correct: "25", options: ["10", "20", "25", "30"], language: { tamil: "5 செ.மீ பக்கமுள்ள சதுரத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "What is the value of 3²?", correct: "9", language: { tamil: "3²-இன் மதிப்பு என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the square root of 64?", correct: "8", language: { tamil: "64-இன் வர்க்கமூலம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is 7 × 8?", correct: "56", options: ["48", "56", "54", "64"], language: { tamil: "7 × 8 என்றால் என்ன?" }, type: "dragAndDrop" }
  ],
  intermediate: [
    { q: "Find median of 5, 7, 9, 11, 13", correct: "9", options: ["7", "9", "11", "8"], language: { tamil: "5, 7, 9, 11, 13-இன் இடைநிலை என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: 2x + 3 = 11", correct: "4", options: ["2", "3", "4", "5"], language: { tamil: "தீர்க்கவும்: 2x + 3 = 11" }, type: "dragAndDrop" },
    { q: "What is 20% of 150?", correct: "30", options: ["15", "30", "50", "100"], language: { tamil: "150-இன் 20% என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "What is the next prime number after 13?", correct: "17", language: { tamil: "13-க்குப் பிறகு வரும் அடுத்த பகா எண் என்ன?" }, type: "fillInTheBlank" },
    { q: "If a circle has a circumference of 8π, what is its radius?", correct: "4", language: { tamil: "ஒரு வட்டத்தின் சுற்றளவு 8π என்றால், அதன் ஆரம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the slope of the line y = 3x + 2?", correct: "3", options: ["2", "3", "5", "1"], language: { tamil: "y = 3x + 2 கோட்டின் சாய்வு என்ன?" }, type: "dragAndDrop" }
  ],
  advanced: [
    { q: "Derivative of x²", correct: "2x", options: ["2x", "x²", "2", "x"], language: { tamil: "x²-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "∫ x dx (definite integral from 0 to 1)", correct: "0.5", options: ["0.25", "0.5", "1", "2"], language: { tamil: "∫ x dx (0 முதல் 1 வரை வரையறுக்கப்பட்ட தொகையீடு)" }, type: "dragAndDrop" },
    { q: "sin²θ + cos²θ = ?", correct: "1", options: ["0", "1", "2", "θ"], language: { tamil: "sin²θ + cos²θ = ?" }, type: "dragAndDrop" },
    {
      q: "Order the steps to solve the equation 2x + 4 = 10.",
      correct: ["Subtract 4 from both sides", "Simplify to get 2x = 6", "Divide both sides by 2", "The answer is x = 3"],
      options: ["The answer is x = 3", "Subtract 4 from both sides", "Divide both sides by 2", "Simplify to get 2x = 6"],
      language: { tamil: "சமன்பாடு 2x + 4 = 10-ஐ தீர்க்கும் படிநிலைகளை வரிசைப்படுத்துங்கள்." },
      type: "sequencing"
    },
    { q: "What is the derivative of sin(x)?", correct: "cos(x)", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], language: { tamil: "sin(x)-இன் வகைக்கெழு என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: log₂(8)", correct: "3", language: { tamil: "தீர்க்கவும்: log₂(8)" }, type: "fillInTheBlank" }
  ],
};

// Utility function to shuffle arrays
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Canvas Confetti Component
const CanvasConfetti = ({ isActive, onComplete }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const confettiPieces = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create confetti pieces
    confettiPieces.current = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const shapes = ['square', 'circle', 'triangle'];

    for (let i = 0; i < 150; i++) {
      confettiPieces.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        gravity: 0.3,
        life: 100
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.current = confettiPieces.current.filter(piece => {
        // Update physics
        piece.vy += piece.gravity;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        piece.life--;

        // Bounce off walls
        if (piece.x < 0 || piece.x > canvas.width) {
          piece.vx *= -0.8;
          piece.x = Math.max(0, Math.min(canvas.width, piece.x));
        }

        // Remove if off screen or life expired
        if (piece.y > canvas.height + 50 || piece.life <= 0) {
          return false;
        }

        // Draw the piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = Math.max(0, piece.life / 100);

        switch (piece.shape) {
          case 'square':
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -piece.size / 2);
            ctx.lineTo(-piece.size / 2, piece.size / 2);
            ctx.lineTo(piece.size / 2, piece.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.restore();

        return true;
      });

      if (confettiPieces.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete && onComplete();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  );
};

// Enhanced Motivational Quotes
const motivationalQuotes = [
  "Don't worry, every mistake is a learning opportunity!",
  "You've got this! Keep trying!",
  "The only way to fail is to give up. You're doing great!",
  "Success is not final, failure is not fatal: it is the courage to continue that counts!",
  "Practice makes perfect! You're getting better!",
  "Every expert was once a beginner. Keep going!"
];

const tamilMotivationalQuotes = [
  "கவலைப்பட வேண்டாம்! ஒவ்வொரு தவறும் கற்றலின் வாய்ப்பு!",
  "தொடர்ந்து முயற்சி செய்யுங்கள்! நீங்கள் நன்றாக செய்கிறீர்கள்!",
  "கணிதம் ஒரு புதிர் போல - பயிற்சி செய்தால் தீர்வு கிடைக்கும்!",
  "நீங்கள் அருமையாக செய்கிறீர்கள்! ஒவ்வொரு அடியாக!",
  "பயிற்சியே வெற்றிக்கு வழி! நீங்கள் மேம்பட்டு வருகிறீர்கள்!",
  "ஒவ்வொரு நிபுணரும் ஒரு காலத்தில் ஆரம்பநிலையாளராக இருந்தார்கள்!"
];

// Enhanced Feedback component
const QuizFeedback = ({ message, type, correctAnswer, language, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isCorrect = type === 'correct';

  useEffect(() => {
    if (isCorrect) {
      setShowConfetti(true);
    }
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isCorrect, onClose]);

  return (
    <>
      <CanvasConfetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 999,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: isCorrect ? '#10b981' : '#ef4444',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `4px solid ${isCorrect ? '#059669' : '#dc2626'}`,
          backdropFilter: 'blur(10px)',
          maxWidth: '90%',
          textAlign: 'center',
          animation: 'bounceIn 0.6s ease-out',
          pointerEvents: 'auto'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            color: 'white',
            marginBottom: '1rem',
            animation: isCorrect ? 'pulse 1s infinite' : 'none'
          }}>
            {isCorrect ? '✅' : '❌'}
          </div>
          <p style={{ 
            fontWeight: 'bold', 
            fontSize: '1.25rem', 
            color: 'white',
            marginBottom: correctAnswer ? '1rem' : '0'
          }}>
            {message}
          </p>
          {correctAnswer && (
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem'
            }}>
              {language === 'english' ? `Correct Answer: ${correctAnswer}` : `சரியான விடை: ${correctAnswer}`}
            </p>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language, setLanguage] = useState("english");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [droppedAnswer, setDroppedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const t = translations[language];

  // Enhanced next question handler
  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setAnswerSubmitted(false);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setIsTestActive(false);
      setCurrentScreen("results");
    }
  }, [currentQuestionIndex, shuffledQuestions.length]);

  // Handle feedback close - this was the missing function
  const handleFeedbackClose = useCallback(() => {
    setTimeout(() => {
      handleNextQuestion();
    }, 500);
  }, [handleNextQuestion]);

  // Timer effect
  useEffect(() => {
    if (!isTestActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isTestActive && !answerSubmitted) {
        setFeedback({ 
          message: language === 'english' ? "Time's up!" : "நேரம் முடிந்துவிட்டது!", 
          type: 'incorrect' 
        });
        setTimeout(() => handleNextQuestion(), 2500);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isTestActive, answerSubmitted, handleNextQuestion, language]);

  // Reset question state
  useEffect(() => {
    if (currentScreen === 'test' && shuffledQuestions.length > 0) {
      const currentQ = shuffledQuestions[currentQuestionIndex];
      setAnswerSubmitted(false);
      
      if (currentQ.type === 'dragAndDrop') {
        setShuffledOptions(shuffleArray(currentQ.options));
        setDroppedAnswer(null);
      } else if (currentQ.type === 'sequencing') {
        setAvailableOptions(shuffleArray(currentQ.options));
        setSelectedSequence([]);
      } else if (currentQ.type === 'fillInTheBlank') {
        setInputAnswer("");
      }
    }
  }, [currentQuestionIndex, currentScreen, shuffledQuestions]);

  // Start test function
  const startTest = (level) => {
    setSelectedLevel(level);
    setCurrentScreen("test");
    const levelQuestions = questionBank[level];
    const questionsToUse = Math.min(8, levelQuestions.length);
    setShuffledQuestions(shuffleArray(levelQuestions).slice(0, questionsToUse));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setIsTestActive(true);
    setFeedback(null);
    setSelectedSequence([]);
    setDroppedAnswer(null);
    setInputAnswer("");
    setAnswerSubmitted(false);
  };

  // Answer checking
  const handleCheckAnswer = () => {
    if (answerSubmitted) return;
    
    const currentQ = shuffledQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQ.type === 'dragAndDrop') {
      if (!droppedAnswer) return;
      isCorrect = droppedAnswer.toString().toLowerCase() === currentQ.correct.toString().toLowerCase();
    } else if (currentQ.type === 'sequencing') {
      if (selectedSequence.length === 0) return;
      isCorrect = JSON.stringify(selectedSequence) === JSON.stringify(currentQ.correct);
    } else if (currentQ.type === 'fillInTheBlank') {
      if (!inputAnswer.trim()) return;
      isCorrect = inputAnswer.trim().toLowerCase() === currentQ.correct.toString().toLowerCase();
    }

    setAnswerSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ message: language === 'english' ? "Correct! Well done!" : "சரி! நல்லது!", type: 'correct' });
    } else {
      const quotes = language === 'english' ? motivationalQuotes : tamilMotivationalQuotes;
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      setFeedback({ message: quote, type: 'incorrect', correctAnswer: currentQ.correct });
    }
  };

  // Drag and drop handlers
  const onDragStart = (e, data) => {
    e.dataTransfer.setData("text/plain", data);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDropSingle = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setDroppedAnswer(data);
  };

  const onDropSequence = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setSelectedSequence(prev => {
      if (!prev.includes(data)) {
        return [...prev, data];
      }
      return prev;
    });
    setAvailableOptions(prev => prev.filter(opt => opt !== data));
  };

  const removeFromSequence = (index) => {
    const removedItem = selectedSequence[index];
    setSelectedSequence(prev => prev.filter((_, i) => i !== index));
    setAvailableOptions(prev => [...prev, removedItem]);
  };

  // Mobile-optimized styles
  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    overflow: 'hidden'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  };

  // Home Screen
  const renderHome = () => (
    <div style={{
      ...containerStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        ...cardStyle,
        padding: '2rem 1.5rem',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          {t.title}
        </h1>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          {language === 'english' 
            ? "Challenge yourself with interactive math problems!"
            : "ஊடாடும் கணிதச் சிக்கல்களுடன் உங்களை சவால் செய்யுங்கள்!"
          }
        </p>
        
        <button 
          onClick={() => setLanguage(language === "english" ? "tamil" : "english")}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '2rem',
            marginBottom: '2rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
        >
          🌐 {t.languageButton}
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { level: "beginner", color: '#10b981', emoji: '🟢', desc: 'Basic arithmetic' },
            { level: "intermediate", color: '#f59e0b', emoji: '🟡', desc: 'Algebra & statistics' },
            { level: "advanced", color: '#ef4444', emoji: '🔴', desc: 'Calculus & advanced' }
          ].map(({ level, color, emoji, desc }) => (
            <button 
              key={level}
              onClick={() => startTest(level)} 
              style={{
                width: '100%',
                padding: '1rem',
                background:` ${color}dd`,
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {emoji} {t[level]}
              <div style={{ fontSize: '0.75rem', opacity: '0.9', marginTop: '0.25rem' }}>
                {language === 'english' ? desc : 
                  level === 'beginner' ? 'அடிப்படை கணிதம்' :
                  level === 'intermediate' ? 'இயற்கணிதம்' : 'கலன்'
                }
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Test Screen
  const renderTest = () => {
    if (shuffledQuestions.length === 0) return null;
    
    const q = shuffledQuestions[currentQuestionIndex];
    const questionText = (language === "tamil" && q.language?.tamil) ? q.language.tamil : q.q;
    const backgrounds = {
      beginner: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      intermediate: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      advanced: 'linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)'
    };

    return (
      <div style={{
        ...containerStyle,
        background: backgrounds[selectedLevel],
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.5rem'
        }}>
          <button 
            onClick={() => {
              setIsTestActive(false);
              setCurrentScreen("home");
            }}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}
          >
            ←
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: timeLeft <= 10 ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '1.5rem',
            animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none'
          }}>
            ⏰ {timeLeft}s
          </div>
          
          <button 
            onClick={() => setLanguage(language === "english" ? "tamil" : "english")}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            🌐
          </button>
        </div>

        {/* Question Card */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            ...cardStyle,
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              opacity: '0.9'
            }}>
              {t.question} {currentQuestionIndex + 1}/{shuffledQuestions.length}
            </div>
            
            <h2 style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: '1.3'
            }}>
              {questionText}
            </h2>
            
            {q.type === 'dragAndDrop' && (
              <div>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1rem'
                }}>
                  {t.selectAnswerPrompt}
                </p>
                
                <div
                  onDragOver={onDragOver}
                  onDrop={onDropSingle}
                  style={{
                    height: '3rem',
                    border: '2px dashed rgba(255, 255, 255, 0.5)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    minHeight: '60px'
                  }}
                >
                  {droppedAnswer ? (
                    <div style={{
                      background: 'white',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600'
                    }}>
                      {droppedAnswer}
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      {language === 'english' ? 'Drop answer here' : 'விடையை இங்கே விடவும்'}
                    </span>
                  )}
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '0.75rem' 
                }}>
                  {shuffledOptions.map((opt, i) => (
                    <div
                      key={i}
                      draggable={!answerSubmitted}
                      onDragStart={(e) => onDragStart(e, opt)}
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: answerSubmitted ? 'not-allowed' : 'grab',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        opacity: answerSubmitted ? '0.6' : '1',
                        textAlign: 'center'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {q.type === 'sequencing' && (
              <div>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1rem'
                }}>
                  {t.sequencePrompt}
                </p>
                
                <div
                  onDragOver={onDragOver}
                  onDrop={onDropSequence}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  {selectedSequence.length > 0 ? (
                    selectedSequence.map((step, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span><strong>{index + 1}.</strong> {step}</span>
                        {!answerSubmitted && (
                          <button
                            onClick={() => removeFromSequence(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      padding: '2rem 0'
                    }}>
                      {language === 'english' ? 'Drop steps here in order' : 'படிநிலைகளை வரிசையாக இங்கே விடவும்'}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {availableOptions.map((opt, i) => (
                    <div
                      key={i}
                      draggable={!answerSubmitted}
                      onDragStart={(e) => onDragStart(e, opt)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: answerSubmitted ? 'not-allowed' : 'grab',
                        fontSize: '0.8rem',
                        opacity: answerSubmitted ? '0.6' : '1'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    if (!answerSubmitted) {
                      setSelectedSequence([]);
                      setAvailableOptions(shuffleArray(q.options));
                    }
                  }}
                  disabled={answerSubmitted}
                  style={{
                    padding: '0.5rem 1rem',
                    background: answerSubmitted ? 'rgba(107, 114, 128, 0.5)' : 'rgba(107, 114, 128, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: answerSubmitted ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🔄 {t.clearSequence}
                </button>
              </div>
            )}

            {q.type === 'fillInTheBlank' && (
              <div>
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  disabled={answerSubmitted}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    outline: 'none'
                  }}
                  placeholder={language === 'english' ? 'Type your answer...' : 'உங்கள் பதிலை தட்டச்சு செய்யவும்...'}
                />
              </div>
            )}
            
            <button 
              onClick={handleCheckAnswer}
              disabled={answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) 
                  ? 'rgba(107, 114, 128, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) 
                  ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                opacity: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) ? '0.6' : '1'
              }}
            >
              ✓ {t.checkAnswer}
            </button>
          </div>
        </div>
        
        {feedback && (
          <QuizFeedback 
            message={feedback.message} 
            type={feedback.type} 
            correctAnswer={feedback.correctAnswer} 
            language={language}
            onClose={handleFeedbackClose}
          />
        )}
      </div>
    );
  };

  // Results Screen
  const renderResults = () => {
    const totalQuestions = shuffledQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isHighScore = score >= totalQuestions * 0.8;
    const isMediumScore = score >= totalQuestions * 0.6;

    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c2d12 50%, #be185d 100%)',
        padding: '1rem'
      }}>
        <div style={{
          ...cardStyle,
          padding: '2rem 1.5rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>
            {isHighScore ? '🏆' : isMediumScore ? '🎖' : '📚'}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            {isHighScore ? t.starPerformerTitle : isMediumScore ? t.achieverTitle : t.needsPracticeTitle}
          </h1>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              {score}/{totalQuestions}
            </div>
            <div style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1rem'
            }}>
              {percentage}%
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                borderRadius: '4px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            {language === 'english' 
              ? (isHighScore ? "Outstanding performance! You're a math superstar!" :
                 isMediumScore ? "Great work! You're making excellent progress!" :
                 "Keep practicing! Every expert was once a beginner!")
              : (isHighScore ? "அருமையான செயல்திறன்! நீங்கள் ஒரு கணித சூப்பர் ஸ்டார்!" :
                 isMediumScore ? "நல்லது! நீங்கள் சிறப்பான முன்னேற்றம் அடைந்து வருகிறீர்கள்!" :
                 "தொடர்ந்து பயிற்சி செய்யுங்கள்! ஒவ்வொரு நிபுணரும் ஒரு காலத்தில் ஆரம்பநிலையாளராக இருந்தார்கள்!")
            }
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => startTest(selectedLevel)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6dd',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              🔄 {t.retry}
            </button>
            <button 
              onClick={() => setCurrentScreen("home")}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#10b981dd',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {currentScreen === "home" && renderHome()}
      {currentScreen === "test" && renderTest()}
      {currentScreen === "results" && renderResults()}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}