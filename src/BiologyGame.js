import React, { useState, useEffect, useRef } from 'react';

const BiologyGame = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentLevel, setCurrentLevel] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showGameArea, setShowGameArea] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const [draggedItems, setDraggedItems] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const gameContentRef = useRef(null);
  const timerRef = useRef(null);

  const translations = {
    en: {
      mainTitle: "Human Body Biology Game",
      subtitle: "மனித உடல் உயிரியல் விளையாட்டு",
      selectLevel: "Select Your Learning Level",
      beginnerTitle: "🔬 Beginner (Ages 6-8)",
      beginnerDesc: "Learn about human cells and their parts through fun drag-and-drop activities!",
      mediumTitle: "🫀 Medium (Ages 9-10)",
      mediumDesc: "Explore body systems and match organs with their functions!",
      advancedTitle: "🧠 Advanced (Ages 11-12)",
      advancedDesc: "Master complex human biology concepts and processes!",
      backBtn: "← Back to Levels",
      scoreLabel: "Score:",
      timeLabel: "Time:",
      congratsTitle: "🎉 Congratulations! 🎉",
      congratsMessage: "You've completed all questions successfully!",
      finalScore: "Final Score:",
      tryAgain: "Try Another Level",
      playAgain: "Play Again",
      dragItems: "Drag Items:",
      dropHere: "Drop Here:",
      correct: "Correct! Well done! 🎉",
      incorrect: "Try again! You can do it! 💪",
      excellent: "Excellent work! 🌟",
      keepTrying: "Keep trying! 🎯",
      nextQuestion: "Next Question →",
      correctAnswers: "Correct answers:",
      timeUp: "Time's up! ⏰",
      seconds: "seconds"
    },
    ta: {
      mainTitle: "மனித உடல் உயிரியல் விளையாட்டு",
      subtitle: "Human Body Biology Game",
      selectLevel: "உங்கள் கற்றல் நிலையைத் தேர்ந்தெடுக்கவும்",
      beginnerTitle: "🔬 தொடக்க நிலை (வயது 6-8)",
      beginnerDesc: "மனித செல்கள் மற்றும் அவற்றின் பகுதிகளைப் பற்றி வேடிக்கையான இழுத்து விடும் செயல்பாடுகள் மூலம் அறியுங்கள்!",
      mediumTitle: "🫀 நடுத்தர நிலை (வயது 9-10)",
      mediumDesc: "உடல் அமைப்புகளை ஆராய்ந்து உறுப்புகளை அவற்றின் செயல்பாடுகளுடன் பொருத்துங்கள்!",
      advancedTitle: "🧠 மேம்பட்ட நிலை (வயது 11-12)",
      advancedDesc: "சிக்கலான மனித உயிரியல் கருத்துக்கள் மற்றும் செயல்முறைகளில் தேர்ச்சி பெறுங்கள்!",
      backBtn: "← நிலைகளுக்குத் திரும்பு",
      scoreLabel: "மதிப்பெண்:",
      timeLabel: "நேரம்:",
      congratsTitle: "🎉 வாழ்த்துக்கள்! 🎉",
      congratsMessage: "நீங்கள் எல்லா கேள்விகளையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!",
      finalScore: "இறுதி மதிப்பெண்:",
      tryAgain: "வேறு நிலையை முயற்சிக்கவும்",
      playAgain: "மீண்டும் விளையாடு",
      dragItems: "பொருட்களை இழுக்கவும்:",
      dropHere: "இங்கே விடவும்:",
      correct: "சரி! நன்றாக செய்தீர்கள்! 🎉",
      incorrect: "மீண்டும் முயற்சிக்கவும்! நீங்கள் செய்யலாம்! 💪",
      excellent: "சிறந்த வேலை! 🌟",
      keepTrying: "முயற்சி செய்து கொண்டே இருங்கள்! 🎯",
      nextQuestion: "அடுத்த கேள்வி →",
      correctAnswers: "சரியான பதில்கள்:",
      timeUp: "நேரம் முடிந்தது! ⏰",
      seconds: "வினாடிகள்"
    }
  };

  // Questions data (kept as you provided; add/edit if you want more)
  const questionData = {
    beginner: [
      {
        en: {
          question: "Drag the cell parts to their correct positions in the human cell:",
          items: ["Nucleus", "Cell Membrane", "Cytoplasm", "Mitochondria"],
          targets: ["Controls the cell", "Protects the cell", "Jelly-like substance", "Powerhouse of cell"],
          pairs: [
            ["Nucleus", "Controls the cell"],
            ["Cell Membrane", "Protects the cell"],
            ["Cytoplasm", "Jelly-like substance"],
            ["Mitochondria", "Powerhouse of cell"]
          ]
        },
        ta: {
          question: "செல் பாகங்களை மனித செல்லில் அவற்றின் சரியான இடங்களுக்கு இழுக்கவும்:",
          items: ["கருவம்", "செல் சுவர்", "கலம்", "மைட்டோகாண்ட்ரியா"],
          targets: ["செல்லைக் கட்டுப்படுத்துகிறது", "செல்லைப் பாதுகாக்கிறது", "ஜெல்லி போன்ற பொருள்", "செல்லின் சக்தி மையம்"],
          pairs: [
            ["கருவம்", "செல்லைக் கட்டுப்படுத்துகிறது"],
            ["செல் சுவர்", "செல்லைப் பாதுகாக்கிறது"],
            ["கலம்", "ஜெல்லி போன்ற பொருள்"],
            ["மைட்டோகாண்ட்ரியா", "செல்லின் சக்தி மையம்"]
          ]
        }
      },
      {
        en: {
          question: "Match the blood cell types with their functions:",
          items: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"],
          targets: ["Carry oxygen", "Fight germs", "Help blood clot", "Liquid part of blood"],
          pairs: [
            ["Red Blood Cells", "Carry oxygen"],
            ["White Blood Cells", "Fight germs"],
            ["Platelets", "Help blood clot"],
            ["Plasma", "Liquid part of blood"]
          ]
        },
        ta: {
          question: "இரத்த செல் வகைகளை அவற்றின் செயல்பாடுகளுடன் பொருத்துங்கள்:",
          items: ["சிவப்பு இரத்த அணுக்கள்", "வெள்ளை இரத்த அணுக்கள்", "பிளேட்லெட்டுகள்", "பிளாஸ்மா"],
          targets: ["ஆக்ஸிஜனை எடுத்துச் செல்கிறது", "கிருமிகளை எதிர்த்துப் போராடுகிறது", "இரத்தம் உறைய உதவுகிறது", "இரத்தத்தின் திரவ பகுதி"],
          pairs: [
            ["சிவப்பு இரத்த அணுக்கள்", "ஆக்ஸிஜனை எடுத்துச் செல்கிறது"],
            ["வெள்ளை இரத்த அணுக்கள்", "கிருமிகளை எதிர்த்துப் போராடுகிறது"],
            ["பிளேட்லெட்டுகள்", "இரத்தம் உறைய உதவுகிறது"],
            ["பிளாஸ்மா", "இரத்தத்தின் திரவ பகுதி"]
          ]
        }
      }
    ],
    medium: [
      {
        en: {
          question: "Match the body systems with their main organs:",
          items: ["Heart", "Lungs", "Brain", "Stomach"],
          targets: ["Circulatory System", "Respiratory System", "Nervous System", "Digestive System"],
          pairs: [
            ["Heart", "Circulatory System"],
            ["Lungs", "Respiratory System"],
            ["Brain", "Nervous System"],
            ["Stomach", "Digestive System"]
          ]
        },
        ta: {
          question: "உடல் அமைப்புகளை அவற்றின் முக்கிய உறுப்புகளுடன் பொருத்துங்கள்:",
          items: ["இதயம்", "நுரையீரல்", "மூளை", "வயிறு"],
          targets: ["இரத்த ஓட்ட அமைப்பு", "சுவாச அமைப்பு", "நரம்பு அமைப்பு", "செரிமான அமைப்பு"],
          pairs: [
            ["இதயம்", "இரத்த ஓட்ட அமைப்பு"],
            ["நுரையீரல்", "சுவாச அமைப்பு"],
            ["மூளை", "நரம்பு அமைப்பு"],
            ["வயிறு", "செரிமான அமைப்பு"]
          ]
        }
      },
      {
        en: {
          question: "Match the organs with their primary functions:",
          items: ["Kidneys", "Liver", "Skin", "Bones"],
          targets: ["Filter waste from blood", "Process nutrients", "Protect body", "Support body structure"],
          pairs: [
            ["Kidneys", "Filter waste from blood"],
            ["Liver", "Process nutrients"],
            ["Skin", "Protect body"],
            ["Bones", "Support body structure"]
          ]
        },
        ta: {
          question: "உறுப்புகளை அவற்றின் முதன்மை செயல்பாடுகளுடன் பொருத்துங்கள்:",
          items: ["சிறுநீரகங்கள்", "கல்லீரல்", "தோல்", "எலும்புகள்"],
          targets: ["இரத்தத்தில் இருந்து கழிவுகளை வடிகட்டுகிறது", "ஊட்டச்சத்துக்களை செயலாக்குகிறது", "உடலைப் பாதுகாக்கிறது", "உடல் அமைப்பை ஆதரிக்கிறது"],
          pairs: [
            ["சிறுநீரகங்கள்", "இரத்தத்தில் இருந்து கழிவுகளை வடிகட்டுகிறது"],
            ["கல்லீரல்", "ஊட்டச்சத்துக்களை செயலாக்குகிறது"],
            ["தோல்", "உடலைப் பாதுகாக்கிறது"],
            ["எலும்புகள்", "உடல் அமைப்பை ஆதரிக்கிறது"]
          ]
        }
      }
    ],
    advanced: [
      {
        en: {
          question: "Match the biological processes with their descriptions:",
          items: ["Photosynthesis", "Cellular Respiration", "Protein Synthesis", "DNA Replication"],
          targets: ["Energy production in cells", "Making copies of genetic material", "Creating proteins from DNA", "Converting light to chemical energy"],
          pairs: [
            ["Cellular Respiration", "Energy production in cells"],
            ["DNA Replication", "Making copies of genetic material"],
            ["Protein Synthesis", "Creating proteins from DNA"],
            ["Photosynthesis", "Converting light to chemical energy"]
          ]
        },
        ta: {
          question: "உயிரியல் செயல்முறைகளை அவற்றின் விளக்கங்களுடன் பொருத்துங்கள்:",
          items: ["ஒளிச்சேர்க்கை", "செல் சுவாசம்", "புரத தொகுப்பு", "DNA நகலெடுத்தல்"],
          targets: ["செல்களில் ஆற்றல் உற்பத்தி", "மரபுப் பொருளின் நகல்களை உருவாக்குதல்", "DNA இலிருந்து புரதங்களை உருவாக்குதல்", "ஒளியை வேதியியல் ஆற்றலாக மாற்றுதல்"],
          pairs: [
            ["செல் சுவாசம்", "செல்களில் ஆற்றி உற்பத்தி"],
            ["DNA நகலெடுத்தல்", "மரபுப் பொருளின் நகல்களை உருவாக்குதல்"],
            ["புரத தொகுப்பு", "DNA இலிருந்து புரதங்களை உருவாக்குதல்"],
            ["ஒளிச்சேர்க்கை", "ஒளியை வேதியியல் ஆற்றலாக மாற்றுதல்"]
          ]
        }
      },
      {
        en: {
          question: "Match the hormones with their functions:",
          items: ["Insulin", "Adrenaline", "Growth Hormone", "Thyroid Hormone"],
          targets: ["Regulates blood sugar", "Fight or flight response", "Controls body growth", "Regulates metabolism"],
          pairs: [
            ["Insulin", "Regulates blood sugar"],
            ["Adrenaline", "Fight or flight response"],
            ["Growth Hormone", "Controls body growth"],
            ["Thyroid Hormone", "Regulates metabolism"]
          ]
        },
        ta: {
          question: "ஹார்மோன்களை அவற்றின் செயல்பாடுகளுடன் பொருத்துங்கள்:",
          items: ["இன்சுலின்", "அட்ரினலின்", "வளர்ச்சி ஹார்மோன்", "தைராய்டு ஹார்மோன்"],
          targets: ["இரத்த சர்க்கரையை கட்டுப்படுத்துகிறது", "சண்டை அல்லது ஓட்டம் பதில்", "உடல் வளர்ச்சியைக் கட்டுப்படுத்துகிறது", "வளர்சிதை மாற்றத்தைக் கட்டுப்படுத்துகிறது"],
          pairs: [
            ["இன்சுலின்", "இரத்த சர்க்கரையை கட்டுப்படுத்துகிறது"],
            ["அட்ரினலின்", "சண்டை அல்லது ஓட்டம் பதில்"],
            ["வளர்ச்சி ஹார்மோன்", "உடல் வளர்ச்சியைக் கட்டுப்படுத்துகிறது"],
            ["தைராய்டு ஹார்மோன்", "வளர்சிதை மாற்றத்தைக் கட்டுப்படுத்துகிறது"]
          ]
        }
      }
    ]
  };

  // Shuffle helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Timer logic (per-question timer)
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setFeedback({
        show: true,
        type: 'timeout',
        message: translations[currentLanguage].timeUp
      });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive, currentLanguage]);

  // Confetti creators (simple DOM confetti)
  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      }, 5000);
    }
  };

  const createCorrectAnswerConfetti = () => {
    const colors = ['#00b894', '#00cec9', '#74b9ff'];
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'mini-confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      }, 2000);
    }
  };

  const createQuestionConfetti = () => {
    const colors = ['#ffeaa7', '#fab1a0', '#fd79a8', '#a29bfe'];
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'question-confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 1 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      }, 3000);
    }
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };

  // Start level: set questions, reset indices, shuffle first question items
  const startLevel = (level) => {
    setCurrentLevel(level);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions(questionData[level]);
    setShowGameArea(true);
    setFeedback({ show: false, type: '', message: '' });
    setTimeLeft(60);
    setIsTimerActive(true);

    // Initialize drag state for first question (use selected language)
    // Guard in case data missing
    const firstQ = questionData[level] && questionData[level][0] && questionData[level][0][currentLanguage];
    if (firstQ) {
      setDraggedItems(shuffleArray(firstQ.items));
    } else {
      setDraggedItems([]);
    }
    setDroppedItems({});
    setShowCelebration(false);
  };

  // Load question when index changes or when game area first shown
  const loadQuestion = () => {
    if (!questions || questions.length === 0) return;

    if (currentQuestionIndex >= questions.length) {
      // Completed all questions
      setShowCelebration(true);
      setIsTimerActive(false);
      createConfetti();
      return;
    }

    const questionObj = questions[currentQuestionIndex][currentLanguage];
    if (questionObj) {
      setDraggedItems(shuffleArray(questionObj.items));
      setDroppedItems({});
      setFeedback({ show: false, type: '', message: '' });
      setTimeLeft(30); // per-question timer reset
      setIsTimerActive(true);
    }
  };

  useEffect(() => {
    if (showGameArea && questions.length > 0) {
      loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, showGameArea]);

  // When language changes, update the currently loaded question display
  useEffect(() => {
    if (showGameArea && questions.length > 0 && currentQuestionIndex < questions.length) {
      const questionObj = questions[currentQuestionIndex][currentLanguage];
      if (questionObj) {
        setDraggedItems(shuffleArray(questionObj.items));
        setDroppedItems({});
        setFeedback({ show: false, type: '', message: '' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  // Drag handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Drop handler: places the dragged item onto the target and checks correctness
  const handleDrop = (e, target) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const draggedItem = e.dataTransfer.getData('text/plain');

    // Update dropped items immutably
    const previousItem = droppedItems[target];
    const newDropped = { ...droppedItems, [target]: draggedItem };
    setDroppedItems(newDropped);

    // Update draggable list: remove dragged item, add previous item back if any
    let newDragged = draggedItems.filter(item => item !== draggedItem);
    if (previousItem) newDragged.push(previousItem);
    setDraggedItems(newDragged);

    // Check correctness for mini confetti
    const questionObj = questions[currentQuestionIndex][currentLanguage];
    const isCorrect = questionObj.pairs.some(pair => pair[0] === draggedItem && pair[1] === target);
    if (isCorrect) createCorrectAnswerConfetti();

    // Small delay to let state settle, then evaluate all answers
    setTimeout(() => checkAllAnswers(newDropped), 100);
  };

  // Evaluate all answers for the current question
  const checkAllAnswers = (currentDroppedItems = droppedItems) => {
    if (!questions || questions.length === 0) return;
    const questionObj = questions[currentQuestionIndex][currentLanguage];
    if (!questionObj) return;

    let correctCount = 0;
    let totalAnswered = 0;

    questionObj.targets.forEach(target => {
      const droppedItem = currentDroppedItems[target];
      if (droppedItem) {
        totalAnswered++;
        const isCorrect = questionObj.pairs.some(pair => pair[0] === droppedItem && pair[1] === target);
        if (isCorrect) correctCount++;
      }
    });

    if (totalAnswered === questionObj.items.length) {
      if (correctCount === questionObj.items.length) {
        // All correct
        setScore(prev => prev + 1);
        setIsTimerActive(false);
        createQuestionConfetti();
        setFeedback({ show: true, type: 'success', message: translations[currentLanguage].excellent });
      } else {
        setFeedback({
          show: true,
          type: 'error',
          message: `${translations[currentLanguage].keepTrying} ${translations[currentLanguage].correctAnswers} ${correctCount}/${questionObj.items.length}`
        });
      }
    }
  };

  // Next question button - robustly reset state and advance index
  const nextQuestion = () => {
    // Clear feedback and dropped items for visual reset
    setFeedback({ show: false, type: '', message: '' });
    setDroppedItems({});
    setIsTimerActive(false);

    // If next index would go past last question show celebration
    if (currentQuestionIndex + 1 >= questions.length) {
      setShowCelebration(true);
      setIsTimerActive(false);
      createConfetti();
      return;
    }

    // Advance index using functional update
    setCurrentQuestionIndex(prev => {
      const newIndex = prev + 1;
      // prepare dragged items for new question immediately
      const nextQ = questions[newIndex] && questions[newIndex][currentLanguage];
      if (nextQ) {
        setDraggedItems(shuffleArray(nextQ.items));
        setTimeLeft(30);
        setIsTimerActive(true);
      } else {
        setDraggedItems([]);
      }
      return newIndex;
    });
  };

  // Back to level selection
  const goBack = () => {
    setShowGameArea(false);
    setShowCelebration(false);
    setCurrentLevel('');
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback({ show: false, type: '', message: '' });
    setIsTimerActive(false);
    setTimeLeft(60);
    setDraggedItems([]);
    setDroppedItems({});
  };

  // Restart current level from beginning
  const restartLevel = () => {
    setShowCelebration(false);
    if (currentLevel) startLevel(currentLevel);
  };

  const t = translations[currentLanguage];
  const currentQuestion = showGameArea && questions.length > 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex][currentLanguage]
    : null;

  return (
    <div className="biology-container">
      <div className="biology-header">
        <h1>{t.mainTitle}</h1>
        <p>{t.subtitle}</p>
        <div className="language-toggle">
          <button
            className={'language-btn ' + (currentLanguage === 'en' ? 'active' : '')}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            className={'language-btn ' + (currentLanguage === 'ta' ? 'active' : '')}
            onClick={() => handleLanguageChange('ta')}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {!showGameArea && (
        <div className="level-selection">
          <h2>{t.selectLevel}</h2>

          {/* CENTERED LEVEL CARDS */}
          <div className="level-grid">
            <div className="level-card" onClick={() => startLevel('beginner')}>
              <h3>{t.beginnerTitle}</h3>
              <p>{t.beginnerDesc}</p>
            </div>
            <div className="level-card" onClick={() => startLevel('medium')}>
              <h3>{t.mediumTitle}</h3>
              <p>{t.mediumDesc}</p>
            </div>
            <div className="level-card" onClick={() => startLevel('advanced')}>
              <h3>{t.advancedTitle}</h3>
              <p>{t.advancedDesc}</p>
            </div>
          </div>
        </div>
      )}

      {showGameArea && (
        <div className="game-area">
          <div className="game-header">
            <button className="back-btn" onClick={goBack}>
              {t.backBtn}
            </button>
            <div className="game-stats">
              <div className="score">
                {t.scoreLabel} {score}/{questions.length}
              </div>
              <div className={'timer ' + (timeLeft <= 10 && isTimerActive ? 'timer-warning' : '')}>
                {t.timeLabel} {timeLeft} {t.seconds}
              </div>
            </div>
          </div>

          <div className="question-area">
            <div className="question">
              <div className="question-progress">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <h3>{currentQuestion?.question}</h3>
            </div>

            <div className="drag-area" ref={gameContentRef}>
              <div className="draggables">
                <h4>{t.dragItems}</h4>
                <div className="drag-items">
                  {draggedItems.map((item, index) => (
                    <div
                      key={item + '-' + index}
                      className="drag-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="drop-zones">
                <h4>{t.dropHere}</h4>
                {currentQuestion?.targets.map((target) => {
                  const droppedItem = droppedItems[target];
                  const questionObj = questions[currentQuestionIndex][currentLanguage];
                  const isCorrect = droppedItem && questionObj.pairs.some(pair =>
                    pair[0] === droppedItem && pair[1] === target
                  );
                  const isIncorrect = droppedItem && !isCorrect;

                  return (
                    <div
                      key={target}
                      className={
                        'drop-zone' + (isCorrect ? ' correct' : '') + (isIncorrect ? ' incorrect' : '')
                      }
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, target)}
                    >
                      <span>{target}</span>
                      <span className="dropped-item">
                        {droppedItem || ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {feedback.show && (
              <div className={"feedback " + feedback.type}>
                <div>{feedback.message}</div>
                <button
                  className="celebration-btn"
                  onClick={nextQuestion}
                  style={{ marginTop: '15px' }}
                >
                  {t.nextQuestion}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="celebration">
          <div className="celebration-content">
            <h2>{t.congratsTitle}</h2>
            <p>{t.congratsMessage}</p>
            <p>{t.finalScore} {score}/{questions.length}</p>
            <button className="celebration-btn" onClick={goBack}>
              {t.tryAgain}
            </button>
            <button className="celebration-btn" onClick={restartLevel}>
              {t.playAgain}
            </button>
          </div>
        </div>
      )}

      {/* All CSS kept here as requested */}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 10px; overflow-x: hidden; display:flex; align-items:center; justify-content:center; }
        .biology-container { max-width:1200px; width:100%; min-height:90vh; max-height:95vh; background:white; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.1); overflow:hidden; display:flex; flex-direction:column; }
        .biology-header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color:white; text-align:center; padding:18px; flex-shrink:0; }
        .biology-header h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); margin-bottom:6px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
        .language-toggle { margin-top:10px; }
        .language-btn { background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding:6px 12px; margin:0 4px; border-radius:20px; cursor:pointer; transition:all .25s ease; font-size:12px; }
        .language-btn.active { background:white; color:#ff6b6b; }
        .level-selection { padding:20px; text-align:center; flex:1; display:flex; flex-direction:column; justify-content:center; overflow-y:auto; }
        .level-selection h2 { font-size: clamp(1.5rem, 3.5vw, 2rem); color:#2d3436; margin-bottom:18px; }
        /* centered layout for levels */
        .level-grid { display:flex; gap:18px; justify-content:center; align-items:stretch; flex-wrap:wrap; max-width:920px; margin:0 auto; padding: 0 10px; }
        .level-card { background: linear-gradient(135deg, #74b9ff, #0984e3); color:white; padding:18px; border-radius:15px; cursor:pointer; transition: all 0.25s ease; box-shadow: 0 8px 20px rgba(0,0,0,0.1); width: 280px; display:flex; flex-direction:column; justify-content:center; }
        .level-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }
        .level-card h3 { font-size: clamp(1.1rem, 2.5vw, 1.25rem); margin-bottom:8px; }
        .level-card p { font-size: clamp(0.9rem, 2vw, 1rem); opacity:0.95; line-height:1.3; }
        .game-area { padding:20px; flex:1; display:flex; flex-direction:column; overflow-y:auto; }
        .game-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px; flex-shrink:0; }
        .back-btn { background:#6c5ce7; color:white; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; transition:all .25s ease; font-size:14px; }
        .game-stats { display:flex; gap:15px; align-items:center; flex-wrap:wrap; margin-left:auto; }
        .score { background:#00b894; color:white; padding:10px 20px; border-radius:20px; font-weight:bold; font-size:14px; }
        .timer { background:#74b9ff; color:white; padding:10px 20px; border-radius:20px; font-weight:bold; font-size:14px; position:relative; overflow:hidden; transition:all .25s ease; }
        .timer::before { content:''; position:absolute; top:0; left:0; height:100%; width:100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: translateX(-100%); animation: timerShimmer 2s infinite; }
        .timer-warning { background:#e74c3c !important; animation: timerPulse 1s infinite; }
        @keyframes timerShimmer { 0%{ transform: translateX(-100%);} 100%{ transform: translateX(100%);} }
        @keyframes timerPulse { 0%{ transform: scale(1);} 50%{ transform: scale(1.05);} 100%{ transform: scale(1);} }
        .question-area { background:#f8f9ff; border-radius:15px; padding:20px; margin-bottom:20px; flex:1; overflow-y:auto; }
        .question h3 { color:#2d3436; margin-bottom:18px; font-size: clamp(1.05rem, 2.5vw, 1.2rem); line-height:1.4; }
        .question-progress { background: rgba(116,185,255,0.18); color:#74b9ff; padding:6px 12px; border-radius:15px; font-size:0.8rem; font-weight:600; display:inline-block; margin-bottom:12px; }
        .drag-area { display:grid; grid-template-columns:1fr; gap:20px; margin-top:18px; }
        @media(min-width:768px){ .drag-area { grid-template-columns:1fr 1fr; gap:28px; } }
        .draggables, .drop-zones { background:white; border-radius:12px; padding:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); min-height:200px; }
        .draggables h4, .drop-zones h4 { color:#2d3436; margin-bottom:12px; text-align:center; font-size: clamp(1rem, 2vw, 1.05rem); }
        .drag-items { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
        .drag-item { background: linear-gradient(135deg, #a29bfe, #6c5ce7); color:white; padding:8px 16px; border-radius:20px; cursor:grab; transition:all .25s ease; user-select:none; font-weight:500; font-size: clamp(0.8rem, 1.8vw, 0.9rem); box-shadow: 0 2px 8px rgba(0,0,0,0.15); position:relative; }
        .drag-item:active { cursor:grabbing; }
        .drag-item.dragging { opacity:0.5; transform: rotate(3deg) scale(1.05); }
        .drop-zone { background:#f1f2f6; border:2px dashed #ced6e0; border-radius:10px; padding:12px; margin:8px 0; min-height:50px; display:flex; align-items:center; justify-content:space-between; transition:all .25s ease; position:relative; flex-wrap:wrap; gap:8px; }
        .drop-zone:hover { background:#e9ecef; border-color:#74b9ff; }
        .drop-zone.drag-over { background:#e3f2fd; border-color:#2196f3; transform: scale(1.01); }
        .drop-zone.correct { background:#d1f2eb; border-color:#00b894; border-style:solid; animation: correctPulse 0.6s ease-out; }
        .drop-zone.incorrect { background:#fadbd8; border-color:#e74c3c; border-style:solid; animation: incorrectShake 0.5s ease-out; }
        @keyframes correctPulse { 0%{ transform: scale(1);} 50%{ transform: scale(1.05); box-shadow: 0 0 20px rgba(0,184,148,0.25);} 100%{ transform: scale(1);} }
        @keyframes incorrectShake { 0%,100%{ transform: translateX(0);} 25%{ transform: translateX(-5px);} 75%{ transform: translateX(5px);} }
        .drop-zone span:first-child { flex:1; font-weight:500; color:#2d3436; font-size: clamp(0.82rem, 1.8vw, 0.92rem); min-width:120px; }
        .dropped-item { background: linear-gradient(135deg, #00b894, #00a085); color:white; padding:6px 12px; border-radius:15px; font-weight:500; font-size: clamp(0.78rem, 1.6vw, 0.85rem); text-align:center; white-space:nowrap; }
        .drop-zone.incorrect .dropped-item { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .feedback { margin-top:15px; padding:15px; border-radius:12px; text-align:center; font-weight:600; font-size: clamp(0.9rem, 2vw, 1rem); animation: feedbackSlideIn 0.35s ease-out; }
        @keyframes feedbackSlideIn { from{ opacity:0; transform: translateY(20px);} to{ opacity:1; transform: translateY(0);} }
        .feedback.success { background:#d1f2eb; color:#00b894; border:2px solid #00b894; }
        .feedback.error { background:#fadbd8; color:#e74c3c; border:2px solid #e74c3c; }
        .feedback.timeout { background:#ffeaa7; color:#e17055; border:2px solid #e17055; }
        .next-question-btn { background: linear-gradient(135deg, #00b894, #00a085); color:white; border:none; padding:12px 24px; border-radius:20px; cursor:pointer; font-size:14px; font-weight:600; margin-top:15px; transition:all .25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display:block; margin-left:auto; margin-right:auto; }
        .celebration { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.8); z-index:1000; display:flex; justify-content:center; align-items:center; animation: fadeIn .3s ease-out; padding:20px; }
        .celebration-content { background: white; padding:30px; border-radius:20px; text-align:center; max-width:450px; width:100%; animation: celebrationPop .45s ease-out; max-height:80vh; overflow-y:auto; }
        .celebration h2 { color:#00b894; font-size: clamp(1.8rem, 4vw, 2.1rem); margin-bottom:12px; }
        .celebration p { font-size: clamp(1rem, 2.5vw, 1.05rem); margin-bottom:10px; color:#2d3436; }
        .celebration-btn { background: linear-gradient(135deg, #00b894, #00a085); color:white; border:none; padding:12px 24px; border-radius:20px; cursor:pointer; font-size: clamp(0.9rem, 2vw, 1rem); font-weight:600; margin:8px; transition:all .25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .confetti { position: fixed; width:8px; height:8px; z-index:1001; animation: fall linear infinite; }
        .question-confetti { position: fixed; width:6px; height:6px; z-index:999; animation: questionFall 3s linear forwards; }
        .mini-confetti { position: fixed; width:5px; height:5px; z-index:1001; animation: minifall 2s linear forwards; }
        @keyframes fadeIn { from{ opacity:0; } to{ opacity:1; } }
        @keyframes celebrationPop { 0%{ transform: scale(0.5); opacity:0; } 50%{ transform: scale(1.05);} 100%{ transform: scale(1); opacity:1;} }
        @keyframes fall { 0%{ transform: translateY(-100vh) rotate(0deg); opacity:1; } 100%{ transform: translateY(100vh) rotate(360deg); opacity:0; } }
        @keyframes questionFall { 0%{ transform: translateY(-50px) rotate(0deg); opacity:1; } 100%{ transform: translateY(150px) rotate(180deg); opacity:0; } }
        @keyframes minifall { 0%{ transform: translateY(-20px) rotate(0deg); opacity:1; } 100%{ transform: translateY(50px) rotate(180deg); opacity:0; } }

        /* responsive niceties */
        @media (max-width:768px) {
          .level-grid { gap:12px; padding:0 6px; }
          .level-card { width: 100%; max-width: 480px; }
          .game-header { flex-direction:column; align-items:stretch; text-align:center; gap:8px; }
          .game-stats { justify-content:center; margin-left:0; }
        }
      `}</style>
    </div>
  );
};

export default BiologyGame;
