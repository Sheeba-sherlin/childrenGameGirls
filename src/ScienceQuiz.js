import React, { useState } from "react";
import "./ScienceQuiz.css";

// Simple confetti component
const ConfettiPiece = ({ delay, duration }) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomLeft = Math.random() * 100;
  const randomAnimationDelay = Math.random() * 2;
  
  return (
    <div
      className="confetti-piece"
      style={{
        '--color': randomColor,
        '--left': `${randomLeft}%`,
        '--delay': `${delay + randomAnimationDelay}s`,
        '--duration': `${duration}s`
      }}
    />
  );
};

const Confetti = ({ pieceCount = 150, duration = 3 }) => {
  return (
    <div className="confetti-container">
      {[...Array(pieceCount)].map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.01} duration={duration} />
      ))}
    </div>
  );
};

// Bilingual Questions
const questionsData = {
  beginner: {
    en: [
      { question: "What is H2O commonly known as?", options: ["Hydrogen", "Water", "Salt", "Oxygen"], answer: "Water" },
      { question: "The Earth revolves around?", options: ["Moon", "Sun", "Mars", "Jupiter"], answer: "Sun" },
      { question: "How many legs does a spider have?", options: ["6", "8", "10", "4"], answer: "8" },
      { question: "What color is the sun?", options: ["Blue", "Yellow", "Red", "Green"], answer: "Yellow" },
      { question: "How many days are there in a week?", options: ["5", "6", "7", "8"], answer: "7" },
    ],
    ta: [
      { question: "H2O பொதுவாக எதை அழைக்கப்படுகிறது?", options: ["ஹைட்ரஜன்", "நீர்", "உப்பு", "ஆக்சிஜன்"], answer: "நீர்" },
      { question: "பூமி எதற்காக சுழல்கிறது?", options: ["சந்திரன்", "சூரியன்", "செவ்வாய்", "சனிகிரகன்"], answer: "சூரியன்" },
      { question: "ஒரு வணிகி எவ்வளவு கால்கள் கொண்டது?", options: ["6", "8", "10", "4"], answer: "8" },
      { question: "சூரியன் எந்த நிறம்?", options: ["நீலம்", "மஞ்சள்", "சிவப்பு", "பச்சை"], answer: "மஞ்சள்" },
      { question: "ஒரு வாரத்தில் எத்தனை நாட்கள் இருக்கிறது?", options: ["5", "6", "7", "8"], answer: "7" },
    ]
  },
  medium: {
    en: [
      { question: "Which gas is most abundant in the Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Nitrogen" },
      { question: "What is the chemical symbol for Sodium?", options: ["S", "Na", "So", "Sd"], answer: "Na" },
      { question: "Which planet is called the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
      { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], answer: "300,000 km/s" },
      { question: "Which organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], answer: "Pancreas" },
    ],
    ta: [
      { question: "பூமியின் வளிமண்டலத்தில் அதிகமாக காணப்படும் வாயு எது?", options: ["ஆக்சிஜன்", "கார்பன் டைஆக்சைடு", "நைட்ரஜன்", "ஹீலியம்"], answer: "நைட்ரஜன்" },
      { question: "சோடியம் என்ற ரசாயன சின்னம் எது?", options: ["S", "Na", "So", "Sd"], answer: "Na" },
      { question: "சிவப்பு கோளம் என்று எந்த கோள் அழைக்கப்படுகிறது?", options: ["செவ்வாய்", "வீனஸ்", "செவ்வாய்", "சனிகிரகம்"], answer: "செவ்வாய்" },
      { question: "விளக்கத்தின் வேகம் என்ன?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], answer: "300,000 km/s" },
      { question: "எந்த உறுப்பு இன்சுலின் உற்பத்தி செய்கிறது?", options: ["கல்லீரல்", "கிட்னி", "பேங்கிரியாஸ்", "இதயம்"], answer: "பேங்கிரியாஸ்" },
    ]
  },
  hard: {
    en: [
      { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"], answer: "Mitochondria" },
      { question: "What is the chemical formula of glucose?", options: ["C6H12O6", "H2O", "NaCl", "CO2"], answer: "C6H12O6" },
      { question: "What type of energy is stored in a stretched rubber band?", options: ["Kinetic", "Potential", "Thermal", "Electrical"], answer: "Potential" },
      { question: "What is the pH of pure water?", options: ["6", "7", "8", "9"], answer: "7" },
      { question: "Which scientist proposed the theory of relativity?", options: ["Newton", "Darwin", "Einstein", "Galileo"], answer: "Einstein" },
    ],
    ta: [
      { question: "செல் எது சக்தி உற்பத்தி செய்கிறது?", options: ["நியூக்லியஸ்", "மைட்டோகாண்ட்ரியா", "குளோரோபிளாஸ்ட்", "ரிபோசோம்"], answer: "மைட்டோகாண்ட்ரியா" },
      { question: "குளுகோஸ் என்ற ரசாயன சூத்திரம்?", options: ["C6H12O6", "H2O", "NaCl", "CO2"], answer: "C6H12O6" },
      { question: "ஒரு நீட்டிக்கப்பட்ட ரப்பர் பந்தில் எந்த வகை சக்தி சேமிக்கப்படுகிறது?", options: ["கைனெட்டிக்", "பொட்டென்ஷியல்", "வெப்ப", "மின்சாரம்"], answer: "பொட்டென்ஷியல்" },
      { question: "சுத்தமான நீரின் pH என்ன?", options: ["6", "7", "8", "9"], answer: "7" },
      { question: "சம்பந்தத்தியைக் கணித்தவர் யார்?", options: ["நியூட்டன்", "டார்வின்", "ஐன்ஸ்டீன்", "கலிலியோ"], answer: "ஐன்ஸ்டீன்" },
    ]
  },
};

export default function ScienceQuiz() {
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [appreciation, setAppreciation] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [language, setLanguage] = useState("en"); // Default English

  const startQuiz = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setQuestions(questionsData[selectedDifficulty][language]);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setAppreciation("");
    setSelectedAnswer("");
    setShowResult(false);
  };

  const handleAnswer = (option) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedAnswer(option);

    setTimeout(() => {
      const isCorrect = option === questions[currentQuestion].answer;

      if (isCorrect) {
        setScore(score + 1);
        setStreak(streak + 1);
        setShowConfetti(true);

        if (streak + 1 === 3) setAppreciation(language === "en" ? "🎉 Amazing! 3 in a row! You're on fire! 🎉" : "🎉 அருமை! 3 தொடர்ச்சியாக சரி! 🔥 🎉");
        else if (streak + 1 === 2) setAppreciation(language === "en" ? "🔥 Great job! One more for a streak! 🔥" : "🔥 சிறந்தது! தொடர்ச்சிக்கு இன்னொன்று! 🔥");
        else setAppreciation(language === "en" ? "✅ Correct! Well done! ✅" : "✅ சரியானது! நன்றாகச் செய்தீர்கள்! ✅");

        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        if (streak >= 3) setAppreciation(language === "en" ? "❌ Oops! Streak broken, but keep going! ❌" : "❌ ஓஹ்! தொடர்ச்சி முறிந்தது, ஆனால் தொடருங்கள்! ❌");
        else setAppreciation(language === "en" ? "❌ Not quite right. Try the next one! ❌" : "❌ சரியானதல்ல. அடுத்ததைக் முயற்சி செய்யுங்கள்! ❌");
        setStreak(0);
      }

      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer("");
          setAppreciation("");
          setIsAnswering(false);
        } else {
          setShowResult(true);
          setIsAnswering(false);
        }
      }, 2000);
    }, 500);
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setAppreciation("");
    setSelectedAnswer("");
    setShowResult(false);
    setIsAnswering(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return language === "en" ? "🏆 Excellent! You're a science star!" : "🏆 அருமை! நீங்கள் அறிவியல் நட்சத்திரம்!";
    if (percentage >= 60) return language === "en" ? "👍 Good job! Keep learning!" : "👍 நல்ல வேலை! கற்றலினை தொடருங்கள்!";
    if (percentage >= 40) return language === "en" ? "📚 Not bad! Practice makes perfect!" : "📚 மோசமில்லை! பயிற்சி முழுமையாக்கும்!";
    return language === "en" ? "💪 Keep trying! You'll get better!" : "💪 தொடருங்கள்! நீங்கள் மேம்படுவீர்கள்!";
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
    if (difficulty) setQuestions(questionsData[difficulty][lang]);
  };

  return (
    <div className="quiz-container">
      {showConfetti && <Confetti pieceCount={200} duration={3} />}
      <div className="quiz-content">

        {/* Language Selector */}
        <div className="language-selector">
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => switchLanguage("en")}
          >English</button>
          <button
            className={language === "ta" ? "active" : ""}
            onClick={() => switchLanguage("ta")}
          >தமிழ்</button>
        </div>

        {!difficulty && (
          <div className="difficulty-selector">
            <h2 className="difficulty-heading">{language === "en" ? "Choose Your Challenge Level:" : "உங்கள் சவால் நிலையை தேர்ந்தெடுக்கவும்:"}</h2>
            <button className="difficulty-btn beginner-btn" onClick={() => startQuiz('beginner')}>
              🟢 {language === "en" ? "Beginner" : "ஆரம்ப நிலை"}
            </button>
            <button className="difficulty-btn medium-btn" onClick={() => startQuiz('medium')}>
              🟡 {language === "en" ? "Medium" : "மிதமான"}
            </button>
            <button className="difficulty-btn hard-btn" onClick={() => startQuiz('hard')}>
              🔴 {language === "en" ? "Hard" : "கடினம்"}
            </button>
          </div>
        )}

        {difficulty && !showResult && questions.length > 0 && (
          <>
            <div className="question-card">
              <div className="question-number">
                {language === "en" ? "Question" : "கேள்வி"} {currentQuestion + 1} {language === "en" ? "of" : "மொத்தம்"} {questions.length}
              </div>
              <h3 className="question-text">{questions[currentQuestion]?.question}</h3>
              <div className="options-grid">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${
                      selectedAnswer === option
                        ? option === questions[currentQuestion].answer
                          ? 'selected-correct'
                          : 'selected-wrong'
                        : ''
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswering}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {appreciation && <div className="appreciation">{appreciation}</div>}

            <div className="score-display">
              {language === "en" ? "Score" : "மதிப்பெண்"}: {score}/{questions.length} | {language === "en" ? "Streak" : "தொடர்"}: {streak}
            </div>
          </>
        )}

        {showResult && (
          <div className="result-card">
            <h2>🎉 {language === "en" ? "Quiz Complete!" : "வினாடி வினா முடிந்தது!"} 🎉</h2>
            <div className="result-score">{score}/{questions.length}</div>
            <div className="result-message">{getScoreMessage()}</div>
            <button className="reset-btn" onClick={resetQuiz}>
              🔄 {language === "en" ? "Try Again" : "மீண்டும் முயற்சி செய்"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
