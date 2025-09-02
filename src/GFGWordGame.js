
import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import "./GFGWordGame.css";

const sampleWords = [
    {
        word: "HYDROGEN",
        description: {
            en: "The first element in the periodic table, symbol H, atomic number 1.",
            ta: "ஆவர்த்தன அட்டவணையின் முதல் தனிமம், குறியீடு H, அணு எண் 1."
        }
    },
    {
        word: "OXYGEN",
        description: {
            en: "Essential for respiration, symbol O, atomic number 8.",
            ta: "சுவாசத்திற்கு அவசியமானது, குறியீடு O, அணு எண் 8."
        }
    },
    {
        word: "CARBON",
        description: {
            en: "Found in all living organisms, symbol C, atomic number 6.",
            ta: "அனைத்து உயிரினங்களிலும் காணப்படுகிறது, குறியீடு C, அணு எண் 6."
        }
    },
    {
        word: "SODIUM",
        description: {
            en: "An alkali metal, symbol Na, used in table salt.",
            ta: "ஒரு ஆல்கலி உலோகம், குறியீடு Na, உணவு உப்பில் பயன்படுத்தப்படுகிறது."
        }
    },
    {
        word: "CHLORINE",
        description: {
            en: "A halogen, symbol Cl, used in water purification.",
            ta: "ஒரு ஹேலோஜன், குறியீடு Cl, நீர் சுத்திகரிப்பில் பயன்படுத்தப்படுகிறது."
        }
    },
    {
        word: "IRON",
        description: {
            en: "A transition metal, symbol Fe, important for hemoglobin in blood.",
            ta: "ஒரு இடைநிலை உலோகம், குறியீடு Fe, இரத்தத்தில் உள்ள ஹீமோகுளோபினுக்கு முக்கியம்."
        }
    },
    {
        word: "URANIUM",
        description: {
            en: "A radioactive element, symbol U, used in nuclear reactors.",
            ta: "ஒரு கதிரியக்க தனிமம், குறியீடு U, அணு உலைகளில் பயன்படுத்தப்படுகிறது."
        }
    },
    {
        word: "HELIUM",
        description: {
            en: "A noble gas, symbol He, lighter than air and used in balloons.",
            ta: "ஒரு உன்னத வாயு, குறியீடு He, காற்றை விட இலகுவானது மற்றும் பலூன்களில் பயன்படுத்தப்படுகிறது."
        }
    },
    {
        word: "GOLD",
        description: {
            en: "A precious metal, symbol Au, highly malleable and valuable.",
            ta: "ஒரு விலைமதிப்பற்ற உலோகம், குறியீடு Au, மிகவும் வளையக்கூடிய மற்றும் மதிப்புமிக்க."
        }
    },
    {
        word: "CALCIUM",
        description: {
            en: "An alkaline earth metal, symbol Ca, essential for bones and teeth.",
            ta: "ஒரு ஆல்கலைன் புவி உலோகம், குறியீடு Ca, எலும்புகள் மற்றும் பற்களுக்கு அவசியம்."
        }
    }
];

const translations = {
    en: {
        title: "Chemistry Periodic Table Word Guess Game",
        hint: "Hint:",
        correctGuess: "Great! You have guessed the chemistry word correctly!",
        wrongGuess: "Wrong Guess! Try again!",
        correctWordWas: "Correct word was:",
        gameOver: "Game Over! You made too many wrong guesses.",
        restart: "Restart",
        removeLetter: "Remove Letter",
        hintsRemaining: "Hints Remaining:",
        getHint: "Get Hint",
        guess: "Guess"
    },
    ta: {
        title: "வேதியியல் ஆவர்த்தன அட்டவணை சொல் யூக விளையாட்டு",
        hint: "குறிப்பு:",
        correctGuess: "சிறப்பு! நீங்கள் வேதியியல் சொல்லை சரியாக கண்டுபிடித்துவிட்டீர்கள்!",
        wrongGuess: "தவறான யூகம்! மீண்டும் முயற்சி செய்யுங்கள்!",
        correctWordWas: "சரியான சொல்:",
        gameOver: "விளையாட்டு முடிந்தது! நீங்கள் அதிக தவறான யூகங்களை செய்துவிட்டீர்கள்.",
        restart: "மீண்டும் தொடங்கு",
        removeLetter: "எழுத்தை நீக்கு",
        hintsRemaining: "மீதமுள்ள குறிப்புகள்:",
        getHint: "குறிப்பு பெறு",
        guess: "யூகம்"
    }
};

const getRandomWord = () => {
    const randomPlace = Math.floor(Math.random() * sampleWords.length);
    return sampleWords[randomPlace];
};

const GFGWordGame = () => {
    const [language, setLanguage] = useState("en");
    const [wordData, setWordData] = useState(getRandomWord());
    const [msg, setMsg] = useState("");
    const [chosenLetters, setChosenLetters] = useState([]);
    const [hints, setHints] = useState(3);
    const [displayWord, setDisplayWord] = useState(false);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const t = translations[language];

    useEffect(() => {
        if (wrongGuesses >= 3) {
            window.alert(t.gameOver);
            restartGameFunction();
        }
    }, [wrongGuesses, t.gameOver]);

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ta" : "en");
    };

    const letterSelectFunction = (letter) => {
        if (!chosenLetters.includes(letter)) {
            setChosenLetters([...chosenLetters, letter]);
            if (!wordData.word.includes(letter)) {
                setWrongGuesses(wrongGuesses + 1);
            }
        }
    };

    const hintFunction = () => {
        if (hints > 0) {
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
        setChosenLetters(chosenLetters.slice(0, -1));
    };

    const displayLettersFunction = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        return Array.from(letters).map((letter, index) => (
            <button
                key={index}
                onClick={() => letterSelectFunction(letter)}
                disabled={chosenLetters.includes(letter)}
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
            setMsg(t.correctGuess);
            triggerConfetti();
        } else {
            setMsg(t.wrongGuess);
            setDisplayWord(true);
        }
    };

    const triggerConfetti = () => {
        const totalConfetti = 50;
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = totalConfetti * (timeLeft / duration);

            // Create confetti from left and right
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
            }));
        }, 250);
    };

    const restartGameFunction = () => {
        setWordData(getRandomWord());
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsVisible(false);
    };

    const wordContainerStyle = {
        width: `${Math.min(wordData.word.length * 70, 90)}%`,
        maxWidth: '800px'
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    padding: '10px 20px',
                    position: 'relative'
                }}>
                    <button 
                        onClick={toggleLanguage}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                        {language === "en" ? "தமிழ்" : "English"}
                    </button>
                    <button className="close-button" onClick={handleClose} style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#666'
                    }}>&times;</button>
                </div>
                <div className="container">
                    <h1>{t.title}</h1>
                    <div className="word-container" style={wordContainerStyle}>
                        {Array.from(wordData.word).map((letter, index) => (
                            <div
                                key={index}
                                className={`letter ${chosenLetters.includes(letter) ? "visible" : ""}`}
                            >
                                {chosenLetters.includes(letter) ? letter : ""}
                            </div>
                        ))}
                    </div>
                    <p className="word-description">{t.hint} {wordData.description[language]}</p>
                    {msg && (
                        <div 
                            className="message" 
                            style={{
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                backgroundColor: msg === t.correctGuess ? '#d4edda' : '#f8d7da',
                                border: msg === t.correctGuess ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                                color: msg === t.correctGuess ? '#155724' : '#721c24'
                            }}
                        >
                            <p style={{ 
                                margin: '0', 
                                fontWeight: 'bold', 
                                fontSize: '16px' 
                            }}>{msg}</p>
                            {displayWord && (
                                <p style={{ 
                                    margin: '10px 0 0 0', 
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    color: '#dc3545'
                                }}>
                                    {t.correctWordWas} <span style={{ textDecoration: 'underline' }}>{wordData.word}</span>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="button-section">
                        <div className="guess-section">
                            <button onClick={restartGameFunction} className="restart-button">{t.restart}</button>
                            <button onClick={removeCharacterFunction} disabled={!chosenLetters.length} className="remove-button">{t.removeLetter}</button>
                        </div>
                        <div className="letter-selection">{displayLettersFunction()}</div>
                        <div className="hints">
                            {t.hintsRemaining} {hints}{" "}
                            <button onClick={hintFunction} disabled={hints === 0} className="hint-button">{t.getHint}</button>
                        </div>
                        {!msg && (
                            <button onClick={guessFunction} disabled={!chosenLetters.length} className="guess-button">{t.guess}</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GFGWordGame;