import React, { useState, useEffect } from "react";

/** ─────────── Language Dictionaries ─────────── **/
const LANGS = { en: "English", ta: "தமிழ்" };

const DICT = {
  en: {
    appTitle: "Math Challenge Arena",
    chooseJourney: "Choose your mathematical journey:",
    levels: {
      basic: "Level 1: Basic Arithmetic",
      bodmas: "Level 2: BODMAS/Order of Operations",
      algebra: "Level 3: Algebraic Equations",
    },
    highScoresTitle: "High Scores:",
    hs_basic: "🧮 Arithmetic",
    hs_bodmas: "🧠 BODMAS",
    hs_algebra: "📐 Algebra",
    levelLabel: "Level",
    levelNames: {
      basic: "Basic Arithmetic",
      bodmas: "BODMAS/Order of Operations",
      algebra: "Algebraic Equations",
    },
    questionLabel: "Question:",
    yourAnswerPH: "Your Answer",
    submit: "Submit Answer",
    changeLevel: "Change Level",
    score: "Score",
    highScore: "High Score",
    streak: "Streak",
    streakFire: "🔥",
    notifications: {
      correct: "Correct! +10 Points",
      incorrect: "Wrong! -5 Points",
      highscore: "New High Score!",
      reset: "Game Reset!",
    },
    congratsTitle: "Congratulations! 🎉",
    continuePlaying: "Continue Playing!",
    appreciation: {
      basic: "Great job! You've mastered basic arithmetic! 🌟",
      bodmas: "Excellent! You're conquering the order of operations! 🚀",
      algebra: "Outstanding! You're solving like a true mathematician! 🎯",
    },
    findX: "find x",
    langLabel: "Language",
    operatorHintLabel: "",
  },
  ta: {
    appTitle: "கணித சவால் அரங்கம்",
    chooseJourney: "உங்கள் கணிதப் பயணத்தைத் தேர்வு செய்யவும்:",
    levels: {
      basic: "நிலை 1: அடிப்படை கணிதம்",
      bodmas: "நிலை 2: BODMAS / செயல்முறைக் கட்டமைப்பு",
      algebra: "நிலை 3: அல்ஜீப்ரா சமன்பாடுகள்",
    },
    highScoresTitle: "அதிகபட்ச மதிப்பெண்கள்:",
    hs_basic: "🧮 அடிப்படை",
    hs_bodmas: "🧠 BODMAS",
    hs_algebra: "📐 அல்ஜீப்ரா",
    levelLabel: "நிலை",
    levelNames: {
      basic: "அடிப்படை கணிதம்",
      bodmas: "BODMAS / செயல்முறைக் கட்டமைப்பு",
      algebra: "அல்ஜீப்ரா சமன்பாடுகள்",
    },
    questionLabel: "கேள்வி:",
    yourAnswerPH: "உங்கள் பதில்",
    submit: "பதில் சமர்ப்பிக்க",
    changeLevel: "நிலையை மாற்று",
    score: "மதிப்பெண்",
    highScore: "அதிகபட்ச மதிப்பெண்",
    streak: "தொடர் சரி",
    streakFire: "🔥",
    notifications: {
      correct: "சரி! +10 மதிப்பெண்கள்",
      incorrect: "தவறு! -5 மதிப்பெண்கள்",
      highscore: "புதிய சாதனை!",
      reset: "விளையாட்டு மீட்டமைக்கப்பட்டது!",
    },
    congratsTitle: "வாழ்த்துகள்! 🎉",
    continuePlaying: "விளையாட்டைத் தொடருங்கள்!",
    appreciation: {
      basic: "அருமை! அடிப்படை கணிதத்தில் நிபுணர்! 🌟",
      bodmas: "சூப்பர்! செயல்முறை வரிசையை வெற்றிகரமாக கற்றீர்கள்! 🚀",
      algebra: "அற்புதம்! உண்மையான கணிதவியலாளரைப் போல தீர்க்கிறீர்கள்! 🎯",
    },
    findX: "x-ஐ காண்க",
    langLabel: "மொழி",
    operatorHintLabel: "செயல்குறி குறிப்பு:",
  },
};

const TA_OPERATOR_HINTS = {
  "+": "கூட்டல்",
  "-": "கழித்தல்",
  "×": "பெருக்கல்",
  "÷": "வகுக்கவும்",
};

function detectOperatorSymbol(str) {
  if (!str) return null;
  const ops = ["×", "÷", "+", "-"];
  for (const s of ops) if (str.includes(s)) return s;
  return null;
}

/** ─────────── Main Component ─────────── **/
export default function MathQuiz() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState({});
  const [difficulty, setDifficulty] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBigConfetti, setShowBigConfetti] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [lang, setLang] = useState(() => {
    return "en";
  });

  useEffect(() => {
    const savedHighScore = {"basic": 0, "bodmas": 0, "algebra": 0};
    setHighScore(savedHighScore);
  }, []);

  const generateBasicQuestion = () => {
    const operations = ["+", "-", "*", "/"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, newQuestion;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        newQuestion = `${num1} + ${num2}`;
        setCorrectAnswer(num1 + num2);
        break;
      case "-":
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        newQuestion = `${num1} - ${num2}`;
        setCorrectAnswer(num1 - num2);
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        newQuestion = `${num1} × ${num2}`;
        setCorrectAnswer(num1 * num2);
        break;
      case "/":
        num2 = Math.floor(Math.random() * 10) + 2;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
        newQuestion = `${num1} ÷ ${num2}`;
        setCorrectAnswer(num1 / num2);
        break;
      default:
        break;
    }
    setQuestion(newQuestion);
  };

  const generateBODMASQuestion = () => {
    const operations = [
      () => {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const question = `${a} + ${b} × ${c}`;
        return { question, answer: a + (b * c) };
      },
      () => {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 8) + 1;
        const question = `${a} - ${b} × ${c}`;
        return { question, answer: a - (b * c) };
      },
      () => {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 3) + 2;
        const c = Math.floor(Math.random() * 6) + 1;
        const question = `(${a} + ${b}) × ${c}`;
        return { question, answer: (a + b) * c };
      },
      () => {
        const a = Math.floor(Math.random() * 8) + 12;
        const b = Math.floor(Math.random() * 4) + 2;
        const c = Math.floor(Math.random() * 5) + 1;
        const question = `${a} ÷ ${b} + ${c}`;
        return { question, answer: Math.floor(a / b) + c };
      }
    ];
    
    const selectedOp = operations[Math.floor(Math.random() * operations.length)]();
    setQuestion(selectedOp.question);
    setCorrectAnswer(selectedOp.answer);
  };

  const generateAlgebraQuestion = () => {
    const equations = [
      () => {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 15) + 5;
        const x = Math.floor(Math.random() * 10) + 1;
        const result = a * x + b;
        const question = `${a}x + ${b} = ${result}, ${DICT[lang].findX}`;
        return { question, answer: x };
      },
      () => {
        const a = Math.floor(Math.random() * 6) + 3;
        const b = Math.floor(Math.random() * 12) + 4;
        const x = Math.floor(Math.random() * 8) + 2;
        const result = a * x - b;
        const question = `${a}x - ${b} = ${result}, ${DICT[lang].findX}`;
        return { question, answer: x };
      },
      () => {
        const x = Math.floor(Math.random() * 12) + 3;
        const divisor = Math.floor(Math.random() * 4) + 2;
        const result = Math.floor(x / divisor);
        const question = `x ÷ ${divisor} = ${result}, ${DICT[lang].findX}`;
        return { question, answer: x };
      }
    ];
    
    const selectedEq = equations[Math.floor(Math.random() * equations.length)]();
    setQuestion(selectedEq.question);
    setCorrectAnswer(selectedEq.answer);
  };

  const generateQuestion = (level) => {
    switch (level) {
      case "basic":
        generateBasicQuestion();
        break;
      case "bodmas":
        generateBODMASQuestion();
        break;
      case "algebra":
        generateAlgebraQuestion();
        break;
      default:
        generateBasicQuestion();
        break;
    }
  };

  const startGame = (level) => {
    setDifficulty(level);
    setScore(0);
    setConsecutiveCorrect(0);
    setGameStarted(true);
    generateQuestion(level);
  };

  const handleSubmit = () => {
    const isCorrect = parseFloat(answer) === correctAnswer;
    const newScore = isCorrect ? score + 10 : score - 5;
    setScore(newScore);
    
    if (isCorrect) {
      setConsecutiveCorrect(consecutiveCorrect + 1);
      setShowConfetti(true);
      setPulseEffect(true);
      
      // Big confetti for streak milestones
      if ((consecutiveCorrect + 1) % 5 === 0) {
        setShowBigConfetti(true);
        setTimeout(() => setShowBigConfetti(false), 6000);
      }
      
      setTimeout(() => {
        setShowConfetti(false);
        setPulseEffect(false);
      }, 4000);
    } else {
      setConsecutiveCorrect(0);
    }
    
    const message = isCorrect ? DICT[lang].notifications.correct : DICT[lang].notifications.incorrect;
    setNotification(message);
    setShowNotification(true);
    
    if (newScore > (highScore[difficulty] || 0)) {
      const newHighScore = { ...highScore, [difficulty]: newScore };
      setHighScore(newHighScore);
      setTimeout(() => {
        setNotification(DICT[lang].notifications.highscore);
        setShowNotification(true);
      }, 1500);
    }
    
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    
    setAnswer("");
    generateQuestion(difficulty);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  /** ─────────── UI ─────────── **/
  return (
    <div style={{ 
      fontFamily: "'Poppins', 'Arial', sans-serif", 
      textAlign: "center", 
      padding: "20px", 
      maxWidth: "700px", 
      margin: "0 auto",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      color: "white"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.6); }
        }
        
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          animation: confetti-fall 4s ease-out infinite;
        }
        
        .big-confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10000;
          overflow: hidden;
        }
        
        .big-confetti-piece {
          position: absolute;
          animation: big-confetti-fall 6s ease-out infinite;
        }
        
        /* Confetti shapes */
        .confetti-piece.square, .big-confetti-piece.square {
          width: 10px;
          height: 10px;
        }
        
        .big-confetti-piece.square {
          width: 20px;
          height: 20px;
        }
        
        .confetti-piece.rectangle, .big-confetti-piece.rectangle {
          width: 15px;
          height: 8px;
        }
        
        .big-confetti-piece.rectangle {
          width: 25px;
          height: 15px;
        }
        
        .confetti-piece.circle, .big-confetti-piece.circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .big-confetti-piece.circle {
          width: 22px;
          height: 22px;
        }
        
        .confetti-piece.triangle, .big-confetti-piece.triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 12px solid;
        }
        
        .big-confetti-piece.triangle {
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 24px solid;
        }
        
        .confetti-piece.star, .big-confetti-piece.star {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 6px solid;
          position: relative;
        }
        
        .confetti-piece.star::before, .big-confetti-piece.star::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 3px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 6px solid;
        }
        
        .big-confetti-piece.star {
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 12px solid;
        }
        
        .big-confetti-piece.star::before {
          left: -15px;
          top: 6px;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 12px solid;
        }
        
        /* Vibrant colors */
        .confetti-piece.color-1, .big-confetti-piece.color-1 { 
          background: linear-gradient(45deg, #FF6B6B, #FF8E85); 
          border-bottom-color: #FF6B6B; 
        }
        .confetti-piece.color-1::before, .big-confetti-piece.color-1::before { 
          border-top-color: #FF6B6B; 
        }
        
        .confetti-piece.color-2, .big-confetti-piece.color-2 { 
          background: linear-gradient(45deg, #4ECDC4, #7FDBDA); 
          border-bottom-color: #4ECDC4; 
        }
        .confetti-piece.color-2::before, .big-confetti-piece.color-2::before { 
          border-top-color: #4ECDC4; 
        }
        
        .confetti-piece.color-3, .big-confetti-piece.color-3 { 
          background: linear-gradient(45deg, #45B7D1, #74D4EC); 
          border-bottom-color: #45B7D1; 
        }
        .confetti-piece.color-3::before, .big-confetti-piece.color-3::before { 
          border-top-color: #45B7D1; 
        }
        
        .confetti-piece.color-4, .big-confetti-piece.color-4 { 
          background: linear-gradient(45deg, #96CEB4, #B8DCC8); 
          border-bottom-color: #96CEB4; 
        }
        .confetti-piece.color-4::before, .big-confetti-piece.color-4::before { 
          border-top-color: #96CEB4; 
        }
        
        .confetti-piece.color-5, .big-confetti-piece.color-5 { 
          background: linear-gradient(45deg, #FECA57, #FED67A); 
          border-bottom-color: #FECA57; 
        }
        .confetti-piece.color-5::before, .big-confetti-piece.color-5::before { 
          border-top-color: #FECA57; 
        }
        
        .confetti-piece.color-6, .big-confetti-piece.color-6 { 
          background: linear-gradient(45deg, #FF9FF3, #FFB8F7); 
          border-bottom-color: #FF9FF3; 
        }
        .confetti-piece.color-6::before, .big-confetti-piece.color-6::before { 
          border-top-color: #FF9FF3; 
        }
        
        .confetti-piece.color-7, .big-confetti-piece.color-7 { 
          background: linear-gradient(45deg, #54A0FF, #7FB3FF); 
          border-bottom-color: #54A0FF; 
        }
        .confetti-piece.color-7::before, .big-confetti-piece.color-7::before { 
          border-top-color: #54A0FF; 
        }
        
        .confetti-piece.color-8, .big-confetti-piece.color-8 { 
          background: linear-gradient(45deg, #5F27CD, #8C52FF); 
          border-bottom-color: #5F27CD; 
        }
        .confetti-piece.color-8::before, .big-confetti-piece.color-8::before { 
          border-top-color: #5F27CD; 
        }
        
        /* More random positioning for normal confetti */
        ${Array.from({length: 80}, (_, i) => {
          const shapes = ['square', 'rectangle', 'circle', 'triangle', 'star'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomLeft = Math.floor(Math.random() * 100);
          const randomDelay = Math.random() * 2;
          const randomDuration = 3 + Math.random() * 2;
          
          return `.confetti-piece:nth-child(${i + 1}) { 
            left: ${randomLeft}%; 
            animation-delay: ${randomDelay}s; 
            animation-duration: ${randomDuration}s; 
          }`;
        }).join('\n')}
        
        /* Big confetti positioning */
        ${Array.from({length: 30}, (_, i) => {
          const shapes = ['square', 'rectangle', 'circle', 'triangle', 'star'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomLeft = Math.floor(Math.random() * 100);
          const randomDelay = Math.random() * 2;
          const randomDuration = 4 + Math.random() * 3;
          
          return `.big-confetti-piece:nth-child(${i + 1}) { 
            left: ${randomLeft}%; 
            animation-delay: ${randomDelay}s; 
            animation-duration: ${randomDuration}s; 
          }`;
        }).join('\n')}
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            opacity: 1;
          }
          10% {
            transform: translateY(-85vh) rotateX(90deg) rotateY(180deg) rotateZ(90deg);
            opacity: 1;
          }
          20% {
            transform: translateY(-70vh) rotateX(180deg) rotateY(360deg) rotateZ(180deg);
            opacity: 1;
          }
          30% {
            transform: translateY(-55vh) rotateX(270deg) rotateY(540deg) rotateZ(270deg);
            opacity: 1;
          }
          40% {
            transform: translateY(-40vh) rotateX(360deg) rotateY(720deg) rotateZ(360deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-25vh) rotateX(450deg) rotateY(900deg) rotateZ(450deg);
            opacity: 1;
          }
          60% {
            transform: translateY(-10vh) rotateX(540deg) rotateY(1080deg) rotateZ(540deg);
            opacity: 1;
          }
          70% {
            transform: translateY(5vh) rotateX(630deg) rotateY(1260deg) rotateZ(630deg);
            opacity: 0.8;
          }
          80% {
            transform: translateY(20vh) rotateX(720deg) rotateY(1440deg) rotateZ(720deg);
            opacity: 0.6;
          }
          90% {
            transform: translateY(35vh) rotateX(810deg) rotateY(1620deg) rotateZ(810deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(100vh) rotateX(900deg) rotateY(1800deg) rotateZ(900deg);
            opacity: 0;
          }
        }
        
        @keyframes big-confetti-fall {
          0% {
            transform: translateY(-100vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.5);
            opacity: 1;
          }
          15% {
            transform: translateY(-75vh) rotateX(180deg) rotateY(270deg) rotateZ(180deg) scale(1.3);
            opacity: 1;
          }
          30% {
            transform: translateY(-50vh) rotateX(360deg) rotateY(540deg) rotateZ(360deg) scale(1.1);
            opacity: 1;
          }
          45% {
            transform: translateY(-25vh) rotateX(540deg) rotateY(810deg) rotateZ(540deg) scale(0.9);
            opacity: 1;
          }
          60% {
            transform: translateY(0vh) rotateX(720deg) rotateY(1080deg) rotateZ(720deg) scale(0.7);
            opacity: 0.9;
          }
          75% {
            transform: translateY(25vh) rotateX(900deg) rotateY(1350deg) rotateZ(900deg) scale(0.5);
            opacity: 0.7;
          }
          90% {
            transform: translateY(50vh) rotateX(1080deg) rotateY(1620deg) rotateZ(1080deg) scale(0.3);
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh) rotateX(1260deg) rotateY(1890deg) rotateZ(1260deg) scale(0.1);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        
        .pulse-animation {
          animation: pulse 0.6s ease-in-out;
        }
        
        .floating-element {
          animation: float 3s ease-in-out infinite;
        }
        
        .glowing-button {
          animation: glow 2s ease-in-out infinite;
        }
        
        .rainbow-border {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: rainbow 4s ease infinite;
        }
      `}</style>
      
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "25px",
        padding: "30px",
        margin: "20px 0",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        <h1 style={{ 
          fontSize: "3.5rem", 
          marginBottom: "10px",
          background: "linear-gradient(45deg, #FFD700, #FFA500, #FF6347, #FF1493)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
          textShadow: "0 5px 15px rgba(0,0,0,0.3)"
        }} className="floating-element">
          {DICT[lang].appTitle}
        </h1>

        {/* Language toggle */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ 
            marginRight: "15px", 
            fontSize: "1.2rem", 
            fontWeight: "600"
          }}>
            {DICT[lang].langLabel}:
          </label>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "15px",
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
            }}
          >
            {Object.entries(LANGS).map(([code, label]) => (
              <option key={code} value={code} style={{ background: "#764ba2", color: "white" }}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {!gameStarted ? (
          <div>
            <p style={{ 
              fontSize: "1.3rem", 
              marginBottom: "30px", 
              fontWeight: "500",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
              {DICT[lang].chooseJourney}
            </p>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "20px" 
            }}>
              <button 
                onClick={() => startGame("basic")} 
                className="floating-element glowing-button"
                style={{ 
                  width: "280px", 
                  padding: "18px", 
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 10px 25px rgba(255, 154, 158, 0.4)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-5px) scale(1.05)";
                  e.target.style.boxShadow = "0 15px 35px rgba(255, 154, 158, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 10px 25px rgba(255, 154, 158, 0.4)";
                }}
              >
                🧮 {DICT[lang].levels.basic}
              </button>
              <button 
                onClick={() => startGame("bodmas")} 
                className="floating-element glowing-button"
                style={{ 
                  width: "280px", 
                  padding: "18px", 
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 10px 25px rgba(168, 237, 234, 0.4)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-5px) scale(1.05)";
                  e.target.style.boxShadow = "0 15px 35px rgba(168, 237, 234, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 10px 25px rgba(168, 237, 234, 0.4)";
                }}
              >
                🧠 {DICT[lang].levels.bodmas}
              </button>
              <button 
                onClick={() => startGame("algebra")} 
                className="floating-element glowing-button"
                style={{ 
                  width: "280px", 
                  padding: "18px", 
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 10px 25px rgba(252, 182, 159, 0.4)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-5px) scale(1.05)";
                  e.target.style.boxShadow = "0 15px 35px rgba(252, 182, 159, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 10px 25px rgba(252, 182, 159, 0.4)";
                }}
              >
                📐 {DICT[lang].levels.algebra}
              </button>
            </div>

            <div style={{
              marginTop: "40px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(5px)",
              borderRadius: "20px",
              padding: "25px",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                marginBottom: "20px",
                color: "#FFD700",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                {DICT[lang].highScoresTitle}
              </h3>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-around", 
                flexWrap: "wrap", 
                gap: "15px" 
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  color: "#2c3e50",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  fontWeight: "600",
                  minWidth: "150px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                }}>
                  {DICT[lang].hs_basic}: {highScore.basic || 0}
                </div>
                <div style={{
                  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  color: "#2c3e50",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  fontWeight: "600",
                  minWidth: "150px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                }}>
                  {DICT[lang].hs_bodmas}: {highScore.bodmas || 0}
                </div>
                <div style={{
                  background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  color: "#2c3e50",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  fontWeight: "600",
                  minWidth: "150px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                }}>
                  {DICT[lang].hs_algebra}: {highScore.algebra || 0}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ 
              fontSize: "1.8rem", 
              marginBottom: "20px",
              color: "#FFD700",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
              {DICT[lang].levelLabel}: {DICT[lang].levelNames[difficulty]}
            </h2>
            
            {/* Regular Confetti Animation */}
            {showConfetti && (
              <div className="confetti">
                {[...Array(80)].map((_, i) => {
                  const shapes = ['square', 'rectangle', 'circle', 'triangle', 'star'];
                  const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8'];
                  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  
                  return (
                    <div 
                      key={i} 
                      className={`confetti-piece ${randomShape} ${randomColor}`}
                    ></div>
                  );
                })}
              </div>
            )}

            {/* Big Confetti for Streaks */}
            {showBigConfetti && (
              <div className="big-confetti">
                {[...Array(30)].map((_, i) => {
                  const shapes = ['square', 'rectangle', 'circle', 'triangle', 'star'];
                  const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8'];
                  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  
                  return (
                    <div 
                      key={i} 
                      className={`big-confetti-piece ${randomShape} ${randomColor}`}
                    ></div>
                  );
                })}
              </div>
            )}
            
            {/* Notification Popup */}
            {showNotification && (
              <div style={{
                position: "fixed",
                top: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                background: notification.includes("Correct") || notification.includes("சரி") ? 
                  "linear-gradient(135deg, #00C851, #007E33)" : 
                  notification.includes("High Score") || notification.includes("சாதனை") ? 
                  "linear-gradient(135deg, #ffbb33, #ff8800)" : 
                  "linear-gradient(135deg, #ff4444, #cc0000)",
                color: "white",
                padding: "18px 30px",
                borderRadius: "25px",
                fontSize: "20px",
                fontWeight: "bold",
                zIndex: 1000,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                animation: "slideDown 0.5s ease-out",
                border: "2px solid rgba(255,255,255,0.3)"
              }}>
                {notification}
              </div>
            )}
            
            {/* Question Box */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "25px",
              padding: "30px",
              margin: "30px auto",
              maxWidth: "500px",
              fontSize: "28px",
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 15px 40px rgba(102, 126, 234, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)"
            }}
            className={pulseEffect ? "pulse-animation" : ""}
            >
              <div style={{ marginBottom: "15px", fontSize: "18px", opacity: "0.9" }}>
                {DICT[lang].questionLabel}
              </div>
              <div style={{ 
                fontSize: "32px", 
                fontFamily: "'Courier New', monospace",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "15px",
                borderRadius: "15px",
                letterSpacing: "2px"
              }}>
                {question}
              </div>
            </div>

            {/* Operator hint for Tamil */}
            {lang === "ta" && detectOperatorSymbol(question) && (
              <div style={{ 
                color: "#FFD700", 
                fontSize: "16px", 
                margin: "15px 0",
                background: "rgba(255, 215, 0, 0.1)",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 215, 0, 0.3)"
              }}>
                {DICT[lang].operatorHintLabel}{" "}
                <strong>{TA_OPERATOR_HINTS[detectOperatorSymbol(question)]}</strong>
              </div>
            )}

            {/* Answer Input Box */}
            <div style={{ margin: "30px 0" }}>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={DICT[lang].yourAnswerPH}
                style={{ 
                  padding: "20px", 
                  fontSize: "22px", 
                  textAlign: "center",
                  width: "250px",
                  borderRadius: "20px",
                  border: "none",
                  outline: "none",
                  background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  boxShadow: "0 8px 25px rgba(252, 182, 159, 0.4)",
                  color: "#2c3e50",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)";
                  e.target.style.boxShadow = "0 10px 30px rgba(168, 237, 234, 0.6)";
                  e.target.style.transform = "scale(1.05)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
                  e.target.style.boxShadow = "0 8px 25px rgba(252, 182, 159, 0.4)";
                  e.target.style.transform = "scale(1)";
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ 
              marginTop: "25px", 
              display: "flex", 
              justifyContent: "center", 
              gap: "20px", 
              flexWrap: "wrap" 
            }}>
              <button 
                onClick={handleSubmit} 
                className="rainbow-border"
                style={{ 
                  padding: "15px 30px", 
                  fontSize: "18px",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  minWidth: "160px"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px) scale(1.05)";
                  e.target.style.boxShadow = "0 10px 30px rgba(238, 119, 82, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 5px 15px rgba(238, 119, 82, 0.4)";
                }}
              >
                ✨ {DICT[lang].submit}
              </button>
              <button 
                onClick={() => setGameStarted(false)} 
                style={{ 
                  padding: "15px 30px",
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(255, 118, 117, 0.4)",
                  transition: "all 0.3s ease",
                  fontWeight: "bold",
                  minWidth: "160px"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px) scale(1.05)";
                  e.target.style.boxShadow = "0 10px 30px rgba(255, 118, 117, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 8px 25px rgba(255, 118, 117, 0.4)";
                }}
              >
                🔄 {DICT[lang].changeLevel}
              </button>
            </div>

            {/* Score Display */}
            <div style={{
              marginTop: "30px",
              padding: "25px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-around", 
                flexWrap: "wrap", 
                gap: "15px",
                fontSize: "18px",
                fontWeight: "600"
              }}>
                <div style={{ 
                  textAlign: "center",
                  background: "linear-gradient(135deg, #00C851, #007E33)",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  minWidth: "120px",
                  boxShadow: "0 5px 15px rgba(0, 200, 81, 0.3)"
                }}>
                  <div style={{ fontSize: "14px", opacity: "0.9" }}>{DICT[lang].score}</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>{score}</div>
                </div>
                <div style={{ 
                  textAlign: "center",
                  background: "linear-gradient(135deg, #ffbb33, #ff8800)",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  minWidth: "120px",
                  boxShadow: "0 5px 15px rgba(255, 187, 51, 0.3)"
                }}>
                  <div style={{ fontSize: "14px", opacity: "0.9" }}>{DICT[lang].highScore}</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>{highScore[difficulty] || 0}</div>
                </div>
                <div style={{ 
                  textAlign: "center",
                  background: "linear-gradient(135deg, #ff4444, #cc0000)",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  minWidth: "120px",
                  boxShadow: "0 5px 15px rgba(255, 68, 68, 0.3)"
                }}>
                  <div style={{ fontSize: "14px", opacity: "0.9" }}>{DICT[lang].streak}</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {consecutiveCorrect} {consecutiveCorrect > 0 && DICT[lang].streakFire}
                  </div>
                </div>
              </div>
              
              {/* Streak milestone celebration */}
              {consecutiveCorrect > 0 && consecutiveCorrect % 5 === 0 && (
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  borderRadius: "15px",
                  color: "#2c3e50",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(255, 215, 0, 0.4)"
                }}>
                  🎉 Amazing! {consecutiveCorrect} in a row! You're on fire! 🔥
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}