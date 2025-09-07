import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import "./GFGWordGame.css";

// Word data organized by difficulty levels
const gameWords = {
    beginner: [
        {
            word: "WATER",
            description: {
                en: "H2O - Essential for all life, made of hydrogen and oxygen.",
                ta: "H2O - அனைத்து உயிர்களுக்கும் அவசியம், ஹைட்ரஜன் மற்றும் ஆக்ஸிஜனால் ஆனது."
            }
        },
        {
            word: "SALT",
            description: {
                en: "Sodium chloride (NaCl) - Common table salt used in cooking.",
                ta: "சோடியம் குளோரைடு (NaCl) - சமையலில் பயன்படும் பொதுவான உப்பு."
            }
        },
        {
            word: "GOLD",
            description: {
                en: "Au - A precious yellow metal that doesn't rust.",
                ta: "Au - துருப்பிடிக்காத விலையுயர்ந்த மஞ்சள் உலோகம்."
            }
        },
        {
            word: "IRON",
            description: {
                en: "Fe - A magnetic metal that can rust when exposed to water.",
                ta: "Fe - நீரில் வெளிப்படும்போது துருப்பிடிக்கக்கூடிய காந்த உலோகம்."
            }
        },
        {
            word: "OXYGEN",
            description: {
                en: "O - The gas we breathe to stay alive.",
                ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு."
            }
        },
        {
            word: "CARBON",
            description: {
                en: "C - Found in all living things, like diamonds and coal.",
                ta: "C - வைரம் மற்றும் நிலக்கரி போல அனைத்து உயிரினங்களிலும் காணப்படும்."
            }
        },
        {
            word: "HELIUM",
            description: {
                en: "He - A light gas that makes balloons float.",
                ta: "He - பலூன்களை மிதக்க வைக்கும் இலகுவான வாயு."
            }
        },
        {
            word: "SILVER",
            description: {
                en: "Ag - A shiny white metal used in jewelry.",
                ta: "Ag - நகைகளில் பயன்படும் பளபளக்கும் வெள்ளை உலோகம்."
            }
        },
        {
            word: "COPPER",
            description: {
                en: "Cu - A reddish-brown metal used in electrical wires.",
                ta: "Cu - மின்சார கம்பிகளில் பயன்படும் சிவப்பு-பழுப்பு உலோகம்."
            }
        },
        {
            word: "NEON",
            description: {
                en: "Ne - A colorful gas used in bright signs.",
                ta: "Ne - பிரகாசமான பலகைகளில் பயன்படும் வண்ணமயமான வாயு."
            }
        }
    ],
    medium: [
        {
            word: "HYDROGEN",
            description: {
                en: "H - The lightest and most abundant element in the universe.",
                ta: "H - பிரபஞ்சத்தில் மிக இலகுவான மற்றும் அதிகமாக உள்ள தனிமம்."
            }
        },
        {
            word: "SODIUM",
            description: {
                en: "Na - An alkali metal that reacts violently with water.",
                ta: "Na - நீருடன் கடுமையாக வினையாற்றும் ஆல்கலி உலோகம்."
            }
        },
        {
            word: "CHLORINE",
            description: {
                en: "Cl - A greenish gas used to purify swimming pool water.",
                ta: "Cl - நீச்சல் குளத்தின் நீரை சுத்திகரிக்க பயன்படும் பச்சை நிற வாயு."
            }
        },
        {
            word: "CALCIUM",
            description: {
                en: "Ca - Important for strong bones and teeth, found in milk.",
                ta: "Ca - வலுவான எலும்புகள் மற்றும் பற்களுக்கு முக்கியம், பாலில் காணப்படும்."
            }
        },
        {
            word: "FLUORINE",
            description: {
                en: "F - The most reactive element, used in toothpaste.",
                ta: "F - மிகவும் வினையாற்றும் தனிமம், பல் பேஸ்ட்டில் பயன்படும்."
            }
        },
        {
            word: "NITROGEN",
            description: {
                en: "N - Makes up 78% of Earth's atmosphere, essential for proteins.",
                ta: "N - பூமியின் வளிமண்டலத்தின் 78% உள்ளது, புரதங்களுக்கு அவசியம்."
            }
        },
        {
            word: "ALUMINUM",
            description: {
                en: "Al - A lightweight metal used in cans and aircraft.",
                ta: "Al - கேன்கள் மற்றும் விமானங்களில் பயன்படும் இலகு உலோகம்."
            }
        },
        {
            word: "SULFUR",
            description: {
                en: "S - A yellow element that smells like rotten eggs.",
                ta: "S - அழுகிய முட்டை போன்ற வாசனை கொண்ட மஞ்சள் தனிமம்."
            }
        },
        {
            word: "PHOSPHORUS",
            description: {
                en: "P - Essential for DNA and bones, glows in the dark.",
                ta: "P - DNA மற்றும் எலும்புகளுக்கு அவசியம், இருட்டில் ஒளிரும்."
            }
        },
        {
            word: "POTASSIUM",
            description: {
                en: "K - Important for muscles and nerves, found in bananas.",
                ta: "K - தசைகள் மற்றும் நரம்புகளுக்கு முக்கியம், வாழைப்பழத்தில் உள்ளது."
            }
        }
    ],
    advanced: [
        {
            word: "URANIUM",
            description: {
                en: "U - A radioactive element used in nuclear power plants.",
                ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்."
            }
        },
        {
            word: "PLUTONIUM",
            description: {
                en: "Pu - A man-made radioactive element used in nuclear weapons.",
                ta: "Pu - அணு ஆயுதங்களில் பயன்படும் மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம்."
            }
        },
        {
            word: "TUNGSTEN",
            description: {
                en: "W - Has the highest melting point, used in light bulb filaments.",
                ta: "W - மிக அதிக உருகு நிலை கொண்டது, மின்விளக்கு இழைகளில் பயன்படும்."
            }
        },
        {
            word: "CHROMIUM",
            description: {
                en: "Cr - Used to make stainless steel and chrome plating.",
                ta: "Cr - துருப்பிடிக்காத எஃகு மற்றும் குரோம் முலாம் செய்ய பயன்படும்."
            }
        },
        {
            word: "VANADIUM",
            description: {
                en: "V - Used to strengthen steel and in rechargeable batteries.",
                ta: "V - எஃகை வலுப்படுத்த மற்றும் மீண்டும் சார்ஜ் செய்யக்கூடிய பேட்டரிகளில் பயன்படும்."
            }
        },
        {
            word: "MOLYBDENUM",
            description: {
                en: "Mo - Used in high-strength steel alloys and electronics.",
                ta: "Mo - அதிக வலிமை எஃகு கலவைகள் மற்றும் மின்னணுவியலில் பயன்படும்."
            }
        },
        {
            word: "RUTHENIUM",
            description: {
                en: "Ru - A rare platinum group metal used in electronics.",
                ta: "Ru - மின்னணுவியலில் பயன்படும் அரிய பிளாட்டினம் குழு உலோகம்."
            }
        },
        {
            word: "RHENIUM",
            description: {
                en: "Re - One of the rarest elements, used in jet engines.",
                ta: "Re - அரிதான தனிமங்களில் ஒன்று, ஜெட் என்ஜின்களில் பயன்படும்."
            }
        },
        {
            word: "BERKELIUM",
            description: {
                en: "Bk - A synthetic radioactive element created in laboratories.",
                ta: "Bk - ஆய்வகங்களில் உருவாக்கப்படும் செயற்கை கதிரியக்க தனிமம்."
            }
        },
        {
            word: "EINSTEINIUM",
            description: {
                en: "Es - Named after Einstein, produced in nuclear reactors.",
                ta: "Es - ஐன்ஸ்டைன் பெயரில் பெயரிடப்பட்டது, அணு உலைகளில் உற்பத்தியாகிறது."
            }
        }
    ]
};

const translations = {
    en: {
        title: "Chemistry Periodic Table Word Guess Game",
        selectLevel: "Select Difficulty Level",
        beginner: "Beginner (Classes 6-8)",
        medium: "Medium (Classes 9-10)", 
        advanced: "Advanced (Classes 11-12)",
        hint: "Hint:",
        correctGuess: "Excellent! You guessed correctly!",
        wrongGuess: "Wrong guess! Try again!",
        timeUp: "Time's up! The correct word was:",
        correctWordWas: "Correct word was:",
        gameOver: "Game Over! You made too many wrong guesses.",
        levelComplete: "Level Complete!",
        congratulations: "Congratulations!",
        yourScore: "Your Score:",
        questionsCorrect: "questions correct out of",
        timeBonus: "Time Bonus:",
        totalScore: "Total Score:",
        restart: "Restart Game",
        nextLevel: "Next Level",
        removeLetter: "Remove Letter",
        hintsRemaining: "Hints:",
        getHint: "Get Hint",
        guess: "Guess",
        next: "Next Question",
        question: "Question",
        of: "of",
        timeLeft: "Time:",
        seconds: "s",
        backToMenu: "Back to Menu"
    },
    ta: {
        title: "வேதியியல் ஆவர்த்தன அட்டவணை சொல் யூக விளையாட்டு",
        selectLevel: "கஷ்டத்தின் அளவை தேர்வு செய்யுங்கள்",
        beginner: "ஆரம்ப நிலை (வகுப்புகள் 6-8)",
        medium: "நடுத்தர நிலை (வகுப்புகள் 9-10)",
        advanced: "மேல்நிலை (வகுப்புகள் 11-12)",
        hint: "குறிப்பு:",
        correctGuess: "சிறப்பு! நீங்கள் சரியாக கண்டுபிடித்துவிட்டீர்கள்!",
        wrongGuess: "தவறான யூகம்! மீண்டும் முயற்சி செய்யுங்கள்!",
        timeUp: "நேரம் முடிந்துவிட்டது! சரியான சொல்:",
        correctWordWas: "சரியான சொல்:",
        gameOver: "விளையாட்டு முடிந்தது! நீங்கள் அதிக தவறான யூகங்களை செய்துவிட்டீர்கள்.",
        levelComplete: "நிலை முடிந்தது!",
        congratulations: "வாழ்த்துக்கள்!",
        yourScore: "உங்கள் மதிப்பெண்:",
        questionsCorrect: "கேள்விகள் சரி",
        timeBonus: "நேர போனஸ்:",
        totalScore: "மொத்த மதிப்பெண்:",
        restart: "மீண்டும் தொடங்கு",
        nextLevel: "அடுத்த நிலை",
        removeLetter: "எழுத்தை நீக்கு",
        hintsRemaining: "குறிப்புகள்:",
        getHint: "குறிப்பு பெறு",
        guess: "யூகம்",
        next: "அடுத்த கேள்வி",
        question: "கேள்வி",
        of: "இல்",
        timeLeft: "நேரம்:",
        seconds: "வி",
        backToMenu: "மெனுவிற்கு திரும்பு"
    }
};

const GFGWordGame = () => {
    const [language, setLanguage] = useState("en");
    const [currentLevel, setCurrentLevel] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [wordData, setWordData] = useState(null);
    const [msg, setMsg] = useState("");
    const [chosenLetters, setChosenLetters] = useState([]);
    const [hints, setHints] = useState(3);
    const [displayWord, setDisplayWord] = useState(false);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [levelComplete, setLevelComplete] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const t = translations[language];

    // Timer configuration based on level
    const getTimerDuration = (level) => {
        switch(level) {
            case 'beginner': return 50;
            case 'medium': return 40;
            case 'advanced': return 30;
            default: return 50;
        }
    };

    // Timer effect
    useEffect(() => {
        let interval;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            handleTimeUp();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    // Game over effect
    useEffect(() => {
        if (wrongGuesses >= 3) {
            setTimerActive(false);
            setMsg(t.gameOver);
            setTimeout(() => {
                restartGameFunction();
            }, 3000);
        }
    }, [wrongGuesses, t.gameOver]);

    const handleTimeUp = () => {
        setTimerActive(false);
        setMsg(t.timeUp);
        setDisplayWord(true);
        triggerSadConfetti();
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ta" : "en");
    };

    const selectLevel = (level) => {
        setCurrentLevel(level);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(true);
        startQuestion(level, 0);
    };

    const startQuestion = (level, questionIndex) => {
        const levelWords = gameWords[level];
        if (questionIndex >= levelWords.length) {
            completeLevelFunction();
            return;
        }

        setWordData(levelWords[questionIndex]);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(getTimerDuration(level));
        setTimerActive(true);
    };

    const letterSelectFunction = (letter) => {
        if (!chosenLetters.includes(letter) && timerActive) {
            setChosenLetters([...chosenLetters, letter]);
            if (!wordData.word.includes(letter)) {
                setWrongGuesses(wrongGuesses + 1);
            }
        }
    };

    const hintFunction = () => {
        if (hints > 0 && timerActive) {
            const hiddenLetterIndex = wordData.word
                .split("")
                .findIndex((letter) => !chosenLetters.includes(letter));
            
            if (hiddenLetterIndex !== -1) {
                setChosenLetters([...chosenLetters, wordData.word[hiddenLetterIndex]]);
                setHints(hints - 1);
            }
        }
    };

    const removeCharacterFunction = () => {
        if (timerActive) {
            setChosenLetters(chosenLetters.slice(0, -1));
        }
    };

    const displayLettersFunction = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        return Array.from(letters).map((letter, index) => (
            <button
                key={index}
                onClick={() => letterSelectFunction(letter)}
                disabled={chosenLetters.includes(letter) || !timerActive}
                className={`letter-button ${chosenLetters.includes(letter) ? "selected" : ""}`}
            >
                {letter}
            </button>
        ));
    };

    const checkWordGuessedFunction = () => {
        return wordData.word.split("").every((letter) => chosenLetters.includes(letter));
    };

    const guessFunction = () => {
        if (checkWordGuessedFunction()) {
            setTimerActive(false);
            setMsg(t.correctGuess);
            const timeBonus = Math.max(0, timeLeft * 2);
            const questionScore = 100 + timeBonus;
            setScore(score + questionScore);
            setCorrectAnswers(correctAnswers + 1);
            triggerSuccessConfetti();
            setTimeout(() => {
                nextQuestion();
            }, 3000);
        } else {
            setMsg(t.wrongGuess);
            setDisplayWord(true);
            triggerSadConfetti();
            setTimeout(() => {
                nextQuestion();
            }, 3000);
        }
    };

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        startQuestion(currentLevel, nextIndex);
    };

    const completeLevelFunction = () => {
        setTimerActive(false);
        setLevelComplete(true);
        setGameStarted(false);
        triggerLevelCompleteConfetti();
    };

    const backToMenuFunction = () => {
        setCurrentLevel(null);
        setCurrentQuestionIndex(0);
        setWordData(null);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(0);
        setTimerActive(false);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(false);
    };

    const triggerSuccessConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 0,
            particleCount: 100
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107']
            }));
        }, 250);
    };

    const triggerSadConfetti = () => {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#FF5722', '#F44336', '#E91E63'],
            shapes: ['circle'],
            gravity: 1.2,
            drift: 0
        });
    };

    const triggerLevelCompleteConfetti = () => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            confetti({
                particleCount: 100,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98']
            });
        }, 200);
    };

    const restartGameFunction = () => {
        setCurrentLevel(null);
        setCurrentQuestionIndex(0);
        setWordData(null);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(0);
        setTimerActive(false);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(false);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    // Level Selection Screen
    if (!gameStarted && !levelComplete) {
        return (
            <div className="game-fullscreen">
                <div className="game-container">
                    <div className="header">
                        <button onClick={toggleLanguage} className="language-toggle">
                            {language === "en" ? "தமிழ்" : "English"}
                        </button>
                        <button className="close-button" onClick={handleClose}>&times;</button>
                    </div>
                    
                    <div className="content">
                        <h1>{t.title}</h1>
                        <div className="level-selection">
                            <h2>{t.selectLevel}</h2>
                            <div className="level-buttons">
                                <button className="level-button beginner" onClick={() => selectLevel('beginner')}>
                                    {t.beginner}
                                    <div className="level-details">
                                        ⏱ 50{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                                <button className="level-button medium" onClick={() => selectLevel('medium')}>
                                    {t.medium}
                                    <div className="level-details">
                                        ⏱ 40{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                                <button className="level-button advanced" onClick={() => selectLevel('advanced')}>
                                    {t.advanced}
                                    <div className="level-details">
                                        ⏱ 30{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Level Complete Screen
    if (levelComplete) {
        const finalScore = score;
        const percentage = (correctAnswers / 10) * 100;
        
        return (
            <div className="game-fullscreen">
                <div className="game-container">
                    <div className="header">
                        <button onClick={toggleLanguage} className="language-toggle">
                            {language === "en" ? "தமிழ்" : "English"}
                        </button>
                        <button className="close-button" onClick={handleClose}>&times;</button>
                    </div>
                    
                    <div className="content">
                        <div className="level-complete">
                            <h2>{t.levelComplete}</h2>
                            <h1>{t.congratulations}</h1>
                            <div className="score-display">
                                <p>{t.yourScore}</p>
                                <p className="final-score">
                                    🏆 {finalScore} {language === 'en' ? 'points' : 'புள்ளிகள்'}
                                </p>
                                <p>{correctAnswers} {t.questionsCorrect} 10</p>
                                <p>📊 {percentage.toFixed(1)}%</p>
                            </div>
                            <div className="completion-buttons">
                                <button onClick={backToMenuFunction} className="back-to-menu-button">
                                    <span className="back-icon">🏠</span>
                                    {t.backToMenu}
                                </button>
                                <button onClick={restartGameFunction} className="restart-button">
                                    {t.restart}
                                </button>
                                {currentLevel !== 'advanced' && (
                                    <button onClick={() => {
                                        const nextLevel = currentLevel === 'beginner' ? 'medium' : 'advanced';
                                        selectLevel(nextLevel);
                                    }} className="next-button">
                                        {t.nextLevel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Game Screen
    const progressPercentage = ((currentQuestionIndex + 1) / 10) * 100;

    return (
        <div className="game-fullscreen">
            <div className="game-container">
                <div className="header">
                    <button onClick={toggleLanguage} className="language-toggle">
                        {language === "en" ? "தமிழ்" : "English"}
                    </button>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                
                <div className="content">
                    <h1>{t.title}</h1>
                    
                    <div className="game-status">
                        <div className="level-info">
                            {currentLevel === 'beginner' && t.beginner}
                            {currentLevel === 'medium' && t.medium}
                            {currentLevel === 'advanced' && t.advanced}
                        </div>
                        <div className="question-counter">
                            {t.question} {currentQuestionIndex + 1} {t.of} 10
                        </div>
                        <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                            {t.timeLeft} {timeLeft}{t.seconds}
                        </div>
                    </div>

                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="score-display-game">
                        {t.yourScore} {score} | ✅ {correctAnswers}/10
                    </div>

                    <div className="word-container">
                        {Array.from(wordData.word).map((letter, index) => (
                            <div key={index} className={`letter ${chosenLetters.includes(letter) ? "visible" : ""}`}>
                                {chosenLetters.includes(letter) ? letter : ""}
                            </div>
                        ))}
                    </div>
                    
                    <p className="word-description">{t.hint} {wordData.description[language]}</p>
                    
                    {msg && (
                        <div className={`message ${msg === t.correctGuess ? 'success' : 'error'}`}>
                            <p>{msg}</p>
                            {displayWord && (
                                <p className="correct-word">
                                    {t.correctWordWas} <span>{wordData.word}</span>
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="game-actions">
                        <div className="control-buttons">
                            <button onClick={backToMenuFunction} className="back-to-menu-button">
                                <span className="back-icon">🏠</span>
                                {t.backToMenu}
                            </button>
                            <button onClick={restartGameFunction} className="restart-button">{t.restart}</button>
                            <button onClick={removeCharacterFunction} disabled={!chosenLetters.length || !timerActive} className="remove-button">
                                {t.removeLetter}
                            </button>
                        </div>
                        
                        <div className="letter-selection">
                            {displayLettersFunction()}
                        </div>
                        
                        <div className="hints-section">
                            <span>{t.hintsRemaining} {hints}</span>
                            <button onClick={hintFunction} disabled={hints === 0 || !timerActive} className="hint-button">
                                {t.getHint}
                            </button>
                        </div>
                        
                        {!msg && (
                            <button onClick={guessFunction} disabled={!chosenLetters.length || !timerActive} className="guess-button">
                                {t.guess}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GFGWordGame;