import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import "./Game2048.css";

const BOARD_SIZE = 4;

const ConfettiCanvas = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const canvas = document.getElementById('confetti-canvas-2048');
      const context = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fire = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          size: 1.5, // Adjust size of confetti pieces
          colors: ['#ff0', '#0f0', '#00f', '#f00', '#ff0', '#0ff', '#f0f'], // Multiple colors
        });
      };

      // Fire confetti every 100ms for 2 seconds
      const interval = setInterval(fire, 100);
      setTimeout(() => {
        clearInterval(interval);
        onComplete(); // Call the onComplete function to reset visibility
      }, 2000); // Stop after 2 seconds

      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  return (
    <canvas
      id="confetti-canvas-2048"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through
        zIndex: 999, // Ensure it's above other content
      }}
    />
  );
};

const Notification = ({ message, isVisible, type }) => {
  if (!isVisible) return null;

  const notificationStyles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 25px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    transition: 'opacity 0.5s ease',
    opacity: isVisible ? 1 : 0,
    backgroundColor: type === 'correct' ? '#4CAF50' : type === 'highscore' ? '#FF9800' : '#F44336', // Green for correct, Orange for high score, Red for incorrect
  };

  return <div style={notificationStyles}>{message}</div>;
};

const Game2048 = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)));
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false, type: '' });

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('game2048HighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const getTileColor = (value) => {
    switch (value) {
      case 2: return '#EEE4DA';
      case 4: return '#EDE0C8';
      case 8: return '#F2B179';
      case 16: return '#F59563';
      case 32: return '#F67C5F';
      case 64: return '#F65E3B';
      case 128: return '#EDCF72';
      case 256: return '#EDCC61';
      case 512: return '#EDC850';
      case 1024: return '#EDC53F';
      case 2048: return '#EDC22E';
      default: return '#CDC1B4';
    }
  };

  const getTileTextColor = (value) => {
    return value <= 4 ? '#776E65' : '#F9F6F2';
  };

  const addNewTile = (newBoard) => {
    const emptyTiles = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const initializeGame = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameActive(true);
  };

  const moveLeft = (newBoard) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] !== 0) {
          let currentCol = col;
          while (currentCol > 0 && newBoard[row][currentCol - 1] === 0) {
            newBoard[row][currentCol - 1] = newBoard[row][currentCol];
            newBoard[row][currentCol] = 0;
            currentCol--;
            moved = true;
          }

          if (
            currentCol > 0 &&
            newBoard[row][currentCol - 1] === newBoard[row][currentCol]
          ) {
            newBoard[row][currentCol - 1] *= 2;
            scoreIncrease += newBoard[row][currentCol - 1];
            newBoard[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  };

  const moveRight = (newBoard) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = BOARD_SIZE - 2; col >= 0; col--) {
        if (newBoard[row][col] !== 0) {
          let currentCol = col;
          while (currentCol < BOARD_SIZE - 1 && newBoard[row][currentCol + 1] === 0) {
            newBoard[row][currentCol + 1] = newBoard[row][currentCol];
            newBoard[row][currentCol] = 0;
            currentCol++;
            moved = true;
          }

          if (
            currentCol < BOARD_SIZE - 1 &&
            newBoard[row][currentCol + 1] === newBoard[row][currentCol]
          ) {
            newBoard[row][currentCol + 1] *= 2;
            scoreIncrease += newBoard[row][currentCol + 1];
            newBoard[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  };

  const moveUp = (newBoard) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (newBoard[row][col] !== 0) {
          let currentRow = row;
          while (currentRow > 0 && newBoard[currentRow - 1][col] === 0) {
            newBoard[currentRow - 1][col] = newBoard[currentRow][col];
            newBoard[currentRow][col] = 0;
            currentRow--;
            moved = true;
          }

          if (
            currentRow > 0 &&
            newBoard[currentRow - 1][col] === newBoard[currentRow][col]
          ) {
            newBoard[currentRow - 1][col] *= 2;
            scoreIncrease += newBoard[currentRow - 1][col];
            newBoard[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  };

  const moveDown = (newBoard) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = BOARD_SIZE - 2; row >= 0; row--) {
        if (newBoard[row][col] !== 0) {
          let currentRow = row;
          while (currentRow < BOARD_SIZE - 1 && newBoard[currentRow + 1][col] === 0) {
            newBoard[currentRow + 1][col] = newBoard[currentRow][col];
            newBoard[currentRow][col] = 0;
            currentRow++;
            moved = true;
          }

          if (
            currentRow < BOARD_SIZE - 1 &&
            newBoard[currentRow + 1][col] === newBoard[currentRow][col]
          ) {
            newBoard[currentRow + 1][col] *= 2;
            scoreIncrease += newBoard[currentRow + 1][col];
            newBoard[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  };

  const isGameOver = (newBoard) => {
    // Check for empty cells
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === 0) return false;
      }
    }

    // Check for possible merges
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const value = newBoard[row][col];
        if (
          (row > 0 && newBoard[row - 1][col] === value) ||
          (row < BOARD_SIZE - 1 && newBoard[row + 1][col] === value) ||
          (col > 0 && newBoard[row][col - 1] === value) ||
          (col < BOARD_SIZE - 1 && newBoard[row][col + 1] === value)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleKeyDown = (event) => {
    if (!gameActive) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    let result = { moved: false, scoreIncrease: 0 };

    switch (event.key) {
      case 'ArrowLeft':
        result = moveLeft(newBoard);
        break;
      case 'ArrowRight':
        result = moveRight(newBoard);
        break;
      case 'ArrowUp':
        result = moveUp(newBoard);
        break;
      case 'ArrowDown':
        result = moveDown(newBoard);
        break;
      default:
        return;
    }

    if (result.moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      
      const newScore = score + result.scoreIncrease;
      setScore(newScore);

      // Check if we've beaten the high score
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('game2048HighScore', newScore.toString());
        
        // Show high score notification
        setConfettiVisible(true);
        setNotification({ message: 'New High Score!', isVisible: true, type: 'highscore' });
        
        // Hide the notification after 2 seconds
        setTimeout(() => {
          setNotification({ ...notification, isVisible: false });
        }, 2000);
      } else if (result.scoreIncrease > 0) {
        setConfettiVisible(true); // Show confetti on scoring
        setNotification({ message: `Score Increased by ${result.scoreIncrease}`, isVisible: true, type: 'correct' });
        
        // Hide the notification after 2 seconds
        setTimeout(() => {
          setNotification({ ...notification, isVisible: false });
        }, 2000);
      }

      if (isGameOver(newBoard)) {
        setGameActive(false);
        setNotification({ message: 'Game Over!', isVisible: true, type: 'incorrect' });
        
        // Hide the notification after 3 seconds
        setTimeout(() => {
          setNotification({ ...notification, isVisible: false });
        }, 3000);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameActive, score, highScore]);

  const handleConfettiComplete = () => {
    setConfettiVisible(false); // Reset confetti visibility
  };

  return (
    <div className="game-2048">
      <div className="game-header">
        <button
          onClick={() => gameActive ? setGameActive(false) : initializeGame()}
          className="game-button"
        >
          {gameActive ? 'Stop' : 'Start'} Game
        </button>
        <div className="score-container">
          <div className="score-label">Score</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="score-container high-score">
          <div className="score-label">High Score</div>
          <div className="score-value">{highScore}</div>
        </div>
      </div>
  
      <div className="game-board">
        <div className="grid-container">
          {board.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`grid-cell ${cell !== 0 ? 'tile-new' : ''}`}
                style={{
                  backgroundColor: getTileColor(cell),
                  color: getTileTextColor(cell)
                }}
              >
                {cell !== 0 && cell}
              </div>
            ))
          ))} 
        </div>
  
        {!gameActive && score > 0 && (
          <div className="game-over">
            <div className="game-over-text">Game Over!</div>
            <div className="final-score">Final Score: {score}</div>
            {score === highScore && score > 0 && (
              <div className="new-record">New Record!</div>
            )}
          </div>
        )}
      </div>
  
      <div className="instructions">
        Use arrow keys to move tiles
      </div>

      {/* Notification Pop-up */}
      <Notification message={notification.message} isVisible={notification.isVisible} type={notification.type} />
      
      {/* Confetti Canvas */}
      <ConfettiCanvas isVisible={confettiVisible} onComplete={handleConfettiComplete} />
    </div>
  );
}

export default Game2048;