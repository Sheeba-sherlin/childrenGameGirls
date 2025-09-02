import React, { useState, useEffect } from 'react';
import './TimedImageRecognition.css';

const ConfettiCanvas = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const createConfetti = () => {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        const confettiElements = [];
        
        for (let i = 0; i < 80; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti-piece';
          confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 12 + 6}px;
            height: ${Math.random() * 12 + 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            animation-delay: ${Math.random() * 1.5}s;
            z-index: 9999;
            pointer-events: none;
            transform: rotate(${Math.random() * 360}deg);
          `;
          
          document.body.appendChild(confetti);
          confettiElements.push(confetti);
        }
        
        setTimeout(() => {
          confettiElements.forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        }, 5000);
      };
      
      createConfetti();
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return null;
};

const AppreciationModal = ({ isVisible, onClose, correctCount, level, language, translations }) => {
  if (!isVisible) return null;

  const encouragementQuotes = {
    beginner: {
      english: [
        "🎉 Amazing! You're mastering nutrition basics like a pro!",
        "🌟 Fantastic! Your knowledge of vitamins and minerals is growing strong!",
        "🚀 Incredible! You're becoming a nutrition champion!",
        "💎 Outstanding! Keep feeding your brain with knowledge!",
        "🏆 Brilliant! You're on the path to nutrition mastery!"
      ],
      tamil: [
        "🎉 அற்புதம்! நீங்கள் ஊட்டச்சத்து அடிப்படைகளை வல்லுநர் போல கற்றுக்கொண்டிருக்கிறீர்கள்!",
        "🌟 அருமை! வைட்டமின்கள் மற்றும் தாதுக்களில் உங்கள் அறிவு வலுவாக வளர்ந்து வருகிறது!",
        "🚀 நம்பமுடியாதது! நீங்கள் ஊட்டச்சத்து வீரராக மாறி வருகிறீர்கள்!",
        "💎 சிறப்பானது! உங்கள் மூளையை அறிவால் தொடர்ந்து வளர்க்குங்கள்!",
        "🏆 புத்திசாலித்தனம்! நீங்கள் ஊட்டச்சத்து நிபுணத்துவத்தின் பாதையில் உள்ளீர்கள்!"
      ]
    },
    medium: {
      english: [
        "🎉 Excellent! You're an acid identification expert!",
        "🌟 Superb! Your food chemistry knowledge is impressive!",
        "🚀 Amazing! You understand the science behind flavors!",
        "💎 Outstanding! Your biochemistry skills are sharp!",
        "🏆 Incredible! You're a true food science champion!"
      ],
      tamil: [
        "🎉 சிறப்பு! நீங்கள் அமில அடையாள வல்லுநர்!",
        "🌟 மகத்தான! உங்கள் உணவு வேதியியல் அறிவு கைவந்தது!",
        "🚀 அற்புதம்! சுவைகளுக்குப் பின்னால் உள்ள அறிவியலை நீங்கள் புரிந்துகொள்கிறீர்கள்!",
        "💎 சிறப்பானது! உங்கள் உயிர்வேதியியல் திறன்கள் கூர்மையானவை!",
        "🏆 நம்பமுடியாதது! நீங்கள் உண்மையான உணவு அறிவியல் வீரர்!"
      ]
    },
    hard: {
      english: [
        "🎉 Phenomenal! Your botanical knowledge is extraordinary!",
        "🌟 Remarkable! You're mastering scientific classification!",
        "🚀 Exceptional! Your plant taxonomy skills are incredible!",
        "💎 Outstanding! You're thinking like a true scientist!",
        "🏆 Brilliant! Your expertise in plant science is impressive!"
      ],
      tamil: [
        "🎉 அசாதாரணம்! உங்கள் தாவரவியல் அறிவு அசாதாரணமானது!",
        "🌟 குறிப்பிடத்தக்கது! நீங்கள் அறிவியல் வகைப்பாட்டில் நிபுணத்துவம் பெற்று வருகிறீர்கள்!",
        "🚀 விதிவிலக்கானது! உங்கள் தாவர வகைப்பாட்டு திறன்கள் நம்பமுடியாதவை!",
        "💎 சிறப்பானது! நீங்கள் உண்மையான விஞ்ஞானி போல சிந்திக்கிறீர்கள்!",
        "🏆 புத்திசாலித்தனம்! தாவர அறிவியலில் உங்கள் நிபுணத்துவம் கைவந்தது!"
      ]
    }
  };

  const levelMessages = encouragementQuotes[level]?.[language] || encouragementQuotes.beginner.english;

  return (
    <div className="appreciation-modal-overlay">
      <div className="appreciation-modal-content">
        <div className="appreciation-header">
          <h2 className="appreciation-title">🎊 {translations.congratulations} 🎊</h2>
        </div>
        <div className="appreciation-body">
          <p className="appreciation-message">
            {levelMessages[Math.floor(Math.random() * levelMessages.length)]}
          </p>
          <p className="appreciation-stats">
            {translations.streakMessage.replace('{count}', correctCount)}
          </p>
          <div className="perfect-streak-badge">
            <span className="streak-icon">🏅</span>
            <span className="streak-text">{translations.perfectStreak}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="continue-button"
        >
          <span>{translations.continuePlaying}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

const TimedImageRecognition = () => {
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      // Header and Controls
      highScore: "High Score",
      chooseDifficulty: "Choose Your Challenge Level:",
      stopGame: "Stop Game",
      score: "Score:",
      questions: "Questions:",
      submitAnswer: "Submit Answer",
      pleaseSelect: "Please select an answer!",
      
      // Difficulty Levels
      nutritionBasics: "Nutrition Basics",
      nutritionDesc: "Vitamins & Minerals",
      foodChemistry: "Food Chemistry",
      chemistryDesc: "Organic Acids",
      plantScience: "Plant Science",
      scienceDesc: "Scientific Names",
      
      // Time indicators
      timeIndicator: "⏱",
      
      // Modal messages
      congratulations: "Congratulations!",
      streakMessage: "You've answered {count} questions correctly in a row!",
      perfectStreak: "Perfect Streak!",
      continuePlaying: "Continue Playing",
      
      // Question counter
      questionOf: "Question {current} of {total}",
      
      // Language toggle
      switchToTamil: "தமிழ்",
      switchToEnglish: "English"
    },
    tamil: {
      // Header and Controls
      highScore: "உயர்ந்த மதிப்பெண்",
      chooseDifficulty: "உங்கள் சவால் நிலையைத் தேர்வு செய்யுங்கள்:",
      stopGame: "விளையாட்டை நிறுத்து",
      score: "மதிப்பெண்:",
      questions: "கேள்விகள்:",
      submitAnswer: "விடையை சமர்பிக்கவும்",
      pleaseSelect: "தயவுசெய்து ஒரு பதிலைத் தேர்ந்தெடுக்கவும்!",
      
      // Difficulty Levels
      nutritionBasics: "ஊட்டச்சத்து அடிப்படைகள்",
      nutritionDesc: "வைட்டமின்கள் & தாதுக்கள்",
      foodChemistry: "உணவு வேதியியல்",
      chemistryDesc: "இயற்கை அமிலங்கள்",
      plantScience: "தாவர அறிவியல்",
      scienceDesc: "அறிவியல் பெயர்கள்",
      
      // Time indicators
      timeIndicator: "⏱",
      
      // Modal messages
      congratulations: "வாழ்த்துகள்!",
      streakMessage: "நீங்கள் {count} கேள்விகளுக்கு தொடர்ந்து சரியாக பதிலளித்துள்ளீர்கள்!",
      perfectStreak: "சரியான தொடர்!",
      continuePlaying: "தொடர்ந்து விளையாடுங்கள்",
      
      // Question counter
      questionOf: "கேள்வி {current} / {total}",
      
      // Language toggle
      switchToTamil: "தமிழ்",
      switchToEnglish: "English"
    }
  };

  const gameData = {
    beginner: [
      {
        src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&h=300&fit=crop",
        correct: {
          english: "Vitamin C",
          tamil: "வைட்டமின் சி"
        },
        options: {
          english: ["Vitamin C", "Vitamin D", "Protein", "Carbohydrates"],
          tamil: ["வைட்டமின் சி", "வைட்டமின் டி", "புரதம்", "கார்போஹைட்ரேட்"]
        },
        question: {
          english: "What nutrient is primarily found in oranges?",
          tamil: "ஆரஞ்சு பழத்தில் முக்கியமாக எந்த ஊட்டச்சத்து உள்ளது?"
        }
      },
      {
        src: "data:image/jpeg;base64,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",
        correct: {
          english: "Carbohydrates",
          tamil: "கார்போஹைட்ரேட்"
        },
        options: {
          english: ["Vitamin C", "Carbohydrates", "Protein", "Fat"],
          tamil: ["வைட்டமின் சி", "கார்போஹைட்ரேட்", "புரதம்", "கொழுப்பு"]
        },
        question: {
          english: "What is the main nutrient in bananas?",
          tamil: "வாழைப்பழத்தில் முக்கிய ஊட்டச்சத்து என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop",
        correct: {
          english: "Protein",
          tamil: "புரதம்"
        },
        options: {
          english: ["Protein", "Vitamin A", "Iron", "Calcium"],
          tamil: ["புரதம்", "வைட்டமின் ஏ", "இரும்பு", "கால்சியம்"]
        },
        question: {
          english: "What nutrient are eggs rich in?",
          tamil: "முட்டையில் எந்த ஊட்டச்சத்து அதிகம் உள்ளது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
        correct: {
          english: "Calcium",
          tamil: "கால்சியம்"
        },
        options: {
          english: ["Calcium", "Vitamin C", "Protein", "Iron"],
          tamil: ["கால்சியம்", "வைட்டமின் சி", "புரதம்", "இரும்பு"]
        },
        question: {
          english: "What mineral is abundant in milk?",
          tamil: "பாலில் எந்த தாது அதிகமாக உள்ளது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
        correct: {
          english: "Iron",
          tamil: "இரும்பு"
        },
        options: {
          english: ["Iron", "Vitamin D", "Calcium", "Fat"],
          tamil: ["இரும்பு", "வைட்டமின் டி", "கால்சியம்", "கொழுப்பு"]
        },
        question: {
          english: "What mineral is apple  particularly rich in?",
          tamil: "கீரையில் எந்த தாது குறிப்பாக அதிகம் உள்ளது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
        correct: {
          english: "Healthy Fats",
          tamil: "ஆரோக்கியமான கொழுப்பு"
        },
        options: {
          english: ["Healthy Fats", "Vitamin C", "Protein", "Calcium"],
          tamil: ["ஆரோக்கியமான கொழுப்பு", "வைட்டமின் சி", "புரதம்", "கால்சியம்"]
        },
        question: {
          english: "What type of nutrient is avocado famous for?",
          tamil: "அவகேடோ எந்த வகை ஊட்டச்சத்துக்கு பிரபலமானது?"
        }
      }
    ],
    medium: [
      {
        src: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=300&h=300&fit=crop",
        correct: {
          english: "Citric Acid",
          tamil: "சிட்ரிக் அமிலம்"
        },
        options: {
          english: ["Citric Acid", "Acetic Acid", "Lactic Acid", "Malic Acid"],
          tamil: ["சிட்ரிக் அமிலம்", "அசிட்டிக் அமிலம்", "லாக்டிக் அமிலம்", "மாலிக் அமிலம்"]
        },
        question: {
          english: "Which organic acid gives lemons their sour taste?",
          tamil: "எலுமிச்சைக்கு புளிப்பு சுவையை கொடுக்கும் இயற்கை அமிலம் எது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
        correct: {
          english: "Oxalic Acid",
          tamil: "ஆக்சாலிக் அமிலம்"
        },
        options: {
          english: ["Oxalic Acid", "Citric Acid", "Acetic Acid", "Tartaric Acid"],
          tamil: ["ஆக்சாலிக் அமிலம்", "சிட்ரிக் அமிலம்", "அசிட்டிக் அமிலம்", "டார்டாரிக் அமிலம்"]
        },
        question: {
          english: "Which acid is found in spinach that can bind minerals?",
          tamil: "கீரையில் உள்ள தாதுக்களுடன் பிணைக்கக்கூடிய அமிலம் எது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
        correct: {
          english: "Malic Acid",
          tamil: "மாலிக் அமிலம்"
        },
        options: {
          english: ["Malic Acid", "Citric Acid", "Lactic Acid", "Acetic Acid"],
          tamil: ["மாலிக் அமிலம்", "சிட்ரிக் அமிலம்", "லாக்டிக் அமிலம்", "அசிட்டிக் அமிலம்"]
        },
        question: {
          english: "Which acid gives green apples their tart flavor?",
          tamil: "பச்சை ஆப்பிளுக்கு புளிப்பு சுவையை கொடுக்கும் அமிலம் எது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&h=300&fit=crop",
        correct: {
          english: "Tartaric Acid",
          tamil: "டார்டாரிக் அமிலம்"
        },
        options: {
          english: ["Tartaric Acid", "Citric Acid", "Malic Acid", "Lactic Acid"],
          tamil: ["டார்டாரிக் அமிலம்", "சிட்ரிக் அமிலம்", "மாலிக் அமிலம்", "லாக்டிக் அமிலம்"]
        },
        question: {
          english: "Which acid is naturally found in grapes?",
          tamil: "திராட்சையில் இயற்கையாக காணப்படும் அமிலம் எது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
        correct: {
          english: "Oleic Acid",
          tamil: "ஒலீக் அமிலம்"
        },
        options: {
          english: ["Oleic Acid", "Citric Acid", "Acetic Acid", "Lactic Acid"],
          tamil: ["ஒலீக் அமிலம்", "சிட்ரிக் அமிலம்", "அசிட்டிக் அமிலம்", "லாக்டிக் அமிலம்"]
        },
        question: {
          english: "Which fatty acid is predominant in avocados?",
          tamil: "அவகேடோவில் முக்கியமான கொழுப்பு அமிலம் எது?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
        correct: {
          english: "Acetic Acid",
          tamil: "அசிட்டிக் அமிலம்"
        },
        options: {
          english: ["Acetic Acid", "Citric Acid", "Lactic Acid", "Malic Acid"],
          tamil: ["அசிட்டிக் அமிலம்", "சிட்ரிக் அமிலம்", "லாக்டிக் அமிலம்", "மாலிக் அமிலம்"]
        },
        question: {
          english: "Which acid is the main component of vinegar?",
          tamil: "வினிகரின் முக்கிய கூறான அமிலம் எது?"
        }
      }
    ],
    hard: [
      {
        src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&h=300&fit=crop",
        correct: {
          english: "Citrus sinensis",
          tamil: "சிட்ரஸ் சினென்சிஸ்"
        },
        options: {
          english: ["Citrus sinensis", "Citrus limon", "Citrus paradisi", "Citrus aurantium"],
          tamil: ["சிட்ரஸ் சினென்சிஸ்", "சிட்ரஸ் லைமன்", "சிட்ரஸ் பாரடிசி", "சிட்ரஸ் அவுரன்டியம்"]
        },
        question: {
          english: "What is the scientific name of sweet orange?",
          tamil: "இனிப்பு ஆரஞ்சின் அறிவியல் பெயர் என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
        correct: {
          english: "Musa acuminata",
          tamil: "மியூசா அக்யுமினாடா"
        },
        options: {
          english: ["Musa acuminata", "Musa paradisiaca", "Musa sapientum", "Musa cavendishii"],
          tamil: ["மியூசா அக்யுமினாடா", "மியூசா பாரடிசியாகா", "மியூசா சேபியன்டம்", "மியூசா கேவென்டிஷி"]
        },
        question: {
          english: "What is the scientific name of banana?",
          tamil: "வாழைப்பழத்தின் அறிவியல் பெயர் என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
        correct: {
          english: "Spinacia oleracea",
          tamil: "ஸ்பினாசியா ஒலேராசியா"
        },
        options: {
          english: ["Spinacia oleracea", "Beta vulgaris", "Lactuca sativa", "Brassica oleracea"],
          tamil: ["ஸ்பினாசியா ஒலேராசியா", "பீட்டா வல்காரிஸ்", "லாக்டுகா சட்டிவா", "பிராசிகா ஒலேராசியா"]
        },
        question: {
          english: "What is the scientific name of spinach?",
          tamil: "கீரையின் அறிவியல் பெயர் என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
        correct: {
          english: "Persea americana",
          tamil: "பெர்சியா அமெரிகானா"
        },
        options: {
          english: ["Persea americana", "Olea europaea", "Prunus dulcis", "Juglans regia"],
          tamil: ["பெர்சியா அமெரிகானா", "ஒலியா யூரோபியா", "ப்ரூனஸ் டல்சிஸ்", "ஜுக்லான்ஸ் ரேஜியா"]
        },
        question: {
          english: "What is the scientific name of avocado?",
          tamil: "அவகேடோவின் அறிவியல் பெயர் என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&h=300&fit=crop",
        correct: {
          english: "Vitis vinifera",
          tamil: "விடிஸ் வினிஃபெரா"
        },
        options: {
          english: ["Vitis vinifera", "Vitis labrusca", "Vaccinium myrtillus", "Rubus idaeus"],
          tamil: ["விடிஸ் வினிஃபெரா", "விடிஸ் லேப்ருஸ்கா", "வாக்சினியம் மிர்டில்லஸ்", "ரூபஸ் இடேயஸ்"]
        },
        question: {
          english: "What is the scientific name of wine grape?",
          tamil: "ஒயின் திராட்சையின் அறிவியல் பெயர் என்ன?"
        }
      },
      {
        src: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=300&h=300&fit=crop",
        correct: {
          english: "Citrus limon",
          tamil: "சிட்ரஸ் லைமன்"
        },
        options: {
          english: ["Citrus limon", "Citrus sinensis", "Citrus paradisi", "Citrus aurantifolia"],
          tamil: ["சிட்ரஸ் லைமன்", "சிட்ரஸ் சினென்சிஸ்", "சிட்ரஸ் பாரடிசி", "சிட்ரஸ் அவுரன்டிஃபோலியா"]
        },
        question: {
          english: "What is the scientific name of lemon?",
          tamil: "எலுமிச்சையின் அறிவியல் பெயர் என்ன?"
        }
      }
    ]
  };

  const [difficulty, setDifficulty] = useState('beginner');
  const [gameActive, setGameActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [showAppreciation, setShowAppreciation] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [highScores, setHighScores] = useState({
    beginner: 0,
    medium: 0,
    hard: 0
  });

  const timeLimit = difficulty === 'beginner' ? 45 : difficulty === 'medium' ? 35 : 25;
  const currentQuestions = gameData[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const t = translations[language];

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, timeLimit]);

  useEffect(() => {
    if (score > highScores[difficulty]) {
      setHighScores(prev => ({
        ...prev,
        [difficulty]: score
      }));
    }
  }, [score, difficulty, highScores]);

  const handleTimeUp = () => {
    const penalty = difficulty === 'beginner' ? 5 : difficulty === 'medium' ? 8 : 12;
    setScore(prev => Math.max(0, prev - penalty));
    setConsecutiveCorrect(0);
    nextQuestion();
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      alert(t.pleaseSelect);
      return;
    }

    setQuestionsAnswered(prev => prev + 1);

    if (selectedAnswer === currentQuestion.correct[language]) {
      const points = difficulty === 'beginner' ? 15 : difficulty === 'medium' ? 20 : 25;
      const timeBonus = Math.floor(timeLeft / 5);
      const totalPoints = points + timeBonus;
      
      setScore(prev => prev + totalPoints);
      setConsecutiveCorrect(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          setShowAppreciation(true);
          return 0;
        }
        return newCount;
      });
      setConfettiVisible(true);
    } else {
      const penalty = difficulty === 'beginner' ? 5 : difficulty === 'medium' ? 8 : 12;
      setScore(prev => Math.max(0, prev - penalty));
      setConsecutiveCorrect(0);
    }

    nextQuestion();
  };

  const nextQuestion = () => {
    setSelectedAnswer('');
    setCurrentQuestionIndex(prev => (prev + 1) % currentQuestions.length);
    setTimeLeft(timeLimit);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(timeLimit);
    setSelectedAnswer('');
    setConsecutiveCorrect(0);
    setQuestionsAnswered(0);
  };

  const stopGame = () => {
    setGameActive(false);
    setTimeLeft(timeLimit);
    setSelectedAnswer('');
    setQuestionsAnswered(0);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(newDifficulty === 'beginner' ? 45 : newDifficulty === 'medium' ? 35 : 25);
    setConsecutiveCorrect(0);
    setQuestionsAnswered(0);
    setTimeout(() => {
      startGame();
    }, 500);
  };

  const getLevelInfo = () => {
    const levelInfo = {
      beginner: {
        title: `🥗 ${t.nutritionBasics}`,
        description: t.nutritionDesc,
        icon: "🌱",
        color: "level-beginner"
      },
      medium: {
        title: `🧪 ${t.foodChemistry}`, 
        description: t.chemistryDesc,
        icon: "⚗",
        color: "level-medium"
      },
      hard: {
        title: `🔬 ${t.plantScience}`,
        description: t.scienceDesc, 
        icon: "🌿",
        color: "level-hard"
      }
    };
    return levelInfo[difficulty];
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'tamil' : 'english');
    setSelectedAnswer(''); // Reset selected answer when switching languages
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="timed-image-recognition">
      {/* Header */}
      <div className="game-header">
        <div className="high-score-display">
          🏆 {t.highScore} ({difficulty}): <span className="high-score-value">{highScores[difficulty]}</span>
        </div>
        <button 
          onClick={toggleLanguage}
          className="language-toggle-button"
          title={language === 'english' ? 'Switch to Tamil' : 'Switch to English'}
        >
          {language === 'english' ? t.switchToTamil : t.switchToEnglish}
        </button>
      </div>

      {/* Difficulty Selector */}
      {!gameActive && (
        <div className="difficulty-selector">
          <h2 className="difficulty-title">
            {t.chooseDifficulty}
          </h2>
          <div className="difficulty-grid">
            {Object.keys(gameData).map((level) => {
              const info = {
                beginner: { 
                  title: `🥗 ${t.nutritionBasics}`, 
                  desc: t.nutritionDesc, 
                  time: "45s", 
                  icon: "🌱" 
                },
                medium: { 
                  title: `🧪 ${t.foodChemistry}`, 
                  desc: t.chemistryDesc, 
                  time: "35s", 
                  icon: "⚗" 
                },
                hard: { 
                  title: `🔬 ${t.plantScience}`, 
                  desc: t.scienceDesc, 
                  time: "25s", 
                  icon: "🌿" 
                }
              }[level];
              
              const isActive = difficulty === level;
              
              return (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`difficulty-button ${isActive ? 'difficulty-active' : 'difficulty-inactive'}`}
                >
                  <div className="difficulty-icon">{info.icon}</div>
                  <div className="difficulty-content">
                    <h3 className="difficulty-button-title">{info.title}</h3>
                    <p className="difficulty-description">{info.desc}</p>
                    <span className="difficulty-time">
                      {t.timeIndicator} {info.time}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Area */}
      {gameActive && (
        <div className="game-area">
          {/* Timer */}
          <div className="timer-container">
            <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : 'timer-normal'}`}>
              <span className="timer-text">
                {t.timeIndicator} {timeLeft}s
              </span>
            </div>
          </div>

          {/* Question Section */}
          <div className="question-section">
            {/* Question Header */}
            <div className="question-header">
              <div className={`level-badge ${levelInfo.color}`}>
                {levelInfo.icon} {levelInfo.title}
              </div>
              <div className="question-counter">
                {t.questionOf.replace('{current}', currentQuestionIndex + 1).replace('{total}', currentQuestions.length)}
              </div>
            </div>
            
            {/* Image */}
            <div className="image-container">
              <img
                src={currentQuestion.src}
                alt="Food item to identify"
                className="question-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
                }}
              />
            </div>

            {/* Question Content */}
            <div className="question-content">
              <h3 className="question-text">
                {currentQuestion.question[language]}
              </h3>

              {/* Options */}
              <div className="options-grid">
                {currentQuestion.options[language].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    className={`option-button ${selectedAnswer === option ? 'option-selected' : 'option-unselected'}`}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className={`submit-button ${selectedAnswer ? 'submit-enabled' : 'submit-disabled'}`}
            >
              <span>{t.submitAnswer}</span>
              <span className="submit-icon">✓</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Controls */}
      {gameActive && (
        <div className="game-controls">
          <button
            onClick={stopGame}
            className="stop-button"
          >
            ⏹ {t.stopGame}
          </button>
          <div className="score-display">
            <span className="score-label">{t.score}</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="questions-display">
            <span className="questions-label">{t.questions}</span>
            <span className="questions-value">{questionsAnswered}</span>
          </div>
        </div>
      )}

      <ConfettiCanvas
        isVisible={confettiVisible}
        onComplete={() => setConfettiVisible(false)}
      />
      
      <AppreciationModal
        isVisible={showAppreciation}
        onClose={() => setShowAppreciation(false)}
        correctCount={3}
        level={difficulty}
        language={language}
        translations={t}
      />
    </div>
  );
};

export default TimedImageRecognition;