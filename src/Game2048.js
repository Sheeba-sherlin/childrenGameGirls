import React, { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 4;

const Game2048 = () => {
  const [board, setBoard] = useState(() => Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)));
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Add visual feedback for button clicks
  const [buttonPressed, setButtonPressed] = useState('');

  const getTileColor = (value) => {
    const colors = {
      0: '#CDC1B4',
      2: '#EEE4DA',
      4: '#EDE0C8',
      8: '#F2B179',
      16: '#F59563',
      32: '#F67C5F',
      64: '#F65E3B',
      128: '#EDCF72',
      256: '#EDCC61',
      512: '#EDC850',
      1024: '#EDC53F',
      2048: '#EDC22E'
    };
    return colors[value] || '#3C3A32';
  };

  const getTileTextColor = (value) => {
    return value <= 4 ? '#776E65' : '#F9F6F2';
  };

  const addNewTile = useCallback((newBoard) => {
    const emptyTiles = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const { row, col } = emptyTiles[randomIndex];
      newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    return newBoard;
  }, []);

  const showMessage = useCallback((message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  }, []);

  const initializeGame = useCallback(() => {
    console.log('Initializing game...');
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameActive(true);
    setGameWon(false);
    showMessage('Game Started! 🎮');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  }, [addNewTile, showMessage]);

  const moveLeft = useCallback((boardCopy) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      // Move tiles left
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (boardCopy[row][col] !== 0) {
          let currentCol = col;
          while (currentCol > 0 && boardCopy[row][currentCol - 1] === 0) {
            boardCopy[row][currentCol - 1] = boardCopy[row][currentCol];
            boardCopy[row][currentCol] = 0;
            currentCol--;
            moved = true;
          }
          
          // Merge tiles
          if (currentCol > 0 && boardCopy[row][currentCol - 1] === boardCopy[row][currentCol]) {
            boardCopy[row][currentCol - 1] *= 2;
            scoreIncrease += boardCopy[row][currentCol - 1];
            boardCopy[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  }, []);

  const moveRight = useCallback((boardCopy) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = BOARD_SIZE - 2; col >= 0; col--) {
        if (boardCopy[row][col] !== 0) {
          let currentCol = col;
          while (currentCol < BOARD_SIZE - 1 && boardCopy[row][currentCol + 1] === 0) {
            boardCopy[row][currentCol + 1] = boardCopy[row][currentCol];
            boardCopy[row][currentCol] = 0;
            currentCol++;
            moved = true;
          }
          
          if (currentCol < BOARD_SIZE - 1 && boardCopy[row][currentCol + 1] === boardCopy[row][currentCol]) {
            boardCopy[row][currentCol + 1] *= 2;
            scoreIncrease += boardCopy[row][currentCol + 1];
            boardCopy[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  }, []);

  const moveUp = useCallback((boardCopy) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (boardCopy[row][col] !== 0) {
          let currentRow = row;
          while (currentRow > 0 && boardCopy[currentRow - 1][col] === 0) {
            boardCopy[currentRow - 1][col] = boardCopy[currentRow][col];
            boardCopy[currentRow][col] = 0;
            currentRow--;
            moved = true;
          }
          
          if (currentRow > 0 && boardCopy[currentRow - 1][col] === boardCopy[currentRow][col]) {
            boardCopy[currentRow - 1][col] *= 2;
            scoreIncrease += boardCopy[currentRow - 1][col];
            boardCopy[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  }, []);

  const moveDown = useCallback((boardCopy) => {
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = BOARD_SIZE - 2; row >= 0; row--) {
        if (boardCopy[row][col] !== 0) {
          let currentRow = row;
          while (currentRow < BOARD_SIZE - 1 && boardCopy[currentRow + 1][col] === 0) {
            boardCopy[currentRow + 1][col] = boardCopy[currentRow][col];
            boardCopy[currentRow][col] = 0;
            currentRow++;
            moved = true;
          }
          
          if (currentRow < BOARD_SIZE - 1 && boardCopy[currentRow + 1][col] === boardCopy[currentRow][col]) {
            boardCopy[currentRow + 1][col] *= 2;
            scoreIncrease += boardCopy[currentRow + 1][col];
            boardCopy[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }

    return { moved, scoreIncrease };
  }, []);

  const isGameOver = useCallback((boardCopy) => {
    // Check for empty cells
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (boardCopy[row][col] === 0) return false;
      }
    }

    // Check for possible merges
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const value = boardCopy[row][col];
        if (
          (row > 0 && boardCopy[row - 1][col] === value) ||
          (row < BOARD_SIZE - 1 && boardCopy[row + 1][col] === value) ||
          (col > 0 && boardCopy[row][col - 1] === value) ||
          (col < BOARD_SIZE - 1 && boardCopy[row][col + 1] === value)
        ) {
          return false;
        }
      }
    }

    return true;
  }, []);

  const checkForWin = useCallback((boardCopy) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (boardCopy[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const makeMove = useCallback((direction) => {
    if (!gameActive) {
      console.log('Game not active, move ignored');
      return;
    }

    console.log('Making move:', direction);
    setButtonPressed(direction);
    setTimeout(() => setButtonPressed(''), 200);

    const boardCopy = board.map(row => [...row]);
    let result = { moved: false, scoreIncrease: 0 };

    switch (direction) {
      case 'left':
        result = moveLeft(boardCopy);
        break;
      case 'right':
        result = moveRight(boardCopy);
        break;
      case 'up':
        result = moveUp(boardCopy);
        break;
      case 'down':
        result = moveDown(boardCopy);
        break;
      default:
        return;
    }

    if (result.moved) {
      addNewTile(boardCopy);
      setBoard(boardCopy);
      
      const newScore = score + result.scoreIncrease;
      setScore(newScore);

      // Check for win
      if (!gameWon && checkForWin(boardCopy)) {
        setGameWon(true);
        showMessage('🎉 You Won! You reached 2048!');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Check for new high score
      if (newScore > highScore) {
        setHighScore(newScore);
        showMessage(`🏆 New High Score: ${newScore}!`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      } else if (result.scoreIncrease > 0) {
        showMessage(`+${result.scoreIncrease} points! 🎯`);
      }

      // Check for game over
      if (isGameOver(boardCopy)) {
        setGameActive(false);
        showMessage('💀 Game Over! Try again?');
      }
    } else {
      showMessage('❌ Invalid move!');
    }
  }, [gameActive, board, score, highScore, gameWon, moveLeft, moveRight, moveUp, moveDown, addNewTile, checkForWin, isGameOver, showMessage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          makeMove('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          makeMove('right');
          break;
        case 'ArrowUp':
          event.preventDefault();
          makeMove('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          makeMove('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [makeMove]);

  const resetGame = useCallback(() => {
    console.log('Resetting game...');
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)));
    setScore(0);
    setGameActive(false);
    setGameWon(false);
    showMessage('🔄 Game Reset');
  }, [showMessage]);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {Array.from({length: 50}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Game Container */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Title */}
        <h1 style={{ 
          textAlign: 'center', 
          color: '#776E65', 
          margin: '0 0 30px 0',
          fontSize: '48px',
          fontWeight: 'bold'
        }}>
          2048 Game
        </h1>
        
        {/* Header with controls and scores */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <button
            onClick={() => {
              console.log('Start/Reset button clicked, gameActive:', gameActive);
              gameActive ? resetGame() : initializeGame();
            }}
            style={{
              padding: '15px 30px',
              backgroundColor: gameActive ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              transform: 'scale(1)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {gameActive ? '🔄 Reset Game' : '🎮 Start Game'}
          </button>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{
              backgroundColor: '#bbada0',
              padding: '10px 15px',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '80px'
            }}>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>SCORE</div>
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{score}</div>
            </div>
            <div style={{
              backgroundColor: '#bbada0',
              padding: '10px 15px',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '80px'
            }}>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>BEST</div>
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{highScore}</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div style={{
          backgroundColor: '#bbada0',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {board.flat().map((cell, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: getTileColor(cell),
                    color: getTileTextColor(cell),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: cell > 999 ? '20px' : cell > 99 ? '24px' : '32px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                    transform: cell !== 0 ? 'scale(1)' : 'scale(0.9)',
                    opacity: cell !== 0 ? 1 : 0.3
                  }}
                >
                  {cell !== 0 && cell}
                </div>
              );
            })}
          </div>

          {/* Game Over Overlay */}
          {!gameActive && score > 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#776E65', marginBottom: '10px' }}>
                Game Over! 💀
              </div>
              <div style={{ fontSize: '20px', color: '#776E65', marginBottom: '10px' }}>
                Final Score: {score}
              </div>
              {score === highScore && score > 0 && (
                <div style={{ fontSize: '18px', color: '#f59563', fontWeight: 'bold' }}>
                  🏆 New Record! 🏆
                </div>
              )}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxWidth: '240px',
          margin: '0 auto 20px auto'
        }}>
          <div></div>
          <button
            onClick={() => makeMove('up')}
            disabled={!gameActive}
            style={{
              padding: '15px',
              backgroundColor: gameActive ? (buttonPressed === 'up' ? '#6d5e54' : '#8f7a66') : '#cdc1b4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: gameActive ? 'pointer' : 'not-allowed',
              fontSize: '24px',
              transition: 'all 0.1s ease',
              transform: buttonPressed === 'up' ? 'scale(0.9)' : 'scale(1)'
            }}
          >
            ↑
          </button>
          <div></div>
          
          <button
            onClick={() => makeMove('left')}
            disabled={!gameActive}
            style={{
              padding: '15px',
              backgroundColor: gameActive ? (buttonPressed === 'left' ? '#6d5e54' : '#8f7a66') : '#cdc1b4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: gameActive ? 'pointer' : 'not-allowed',
              fontSize: '24px',
              transition: 'all 0.1s ease',
              transform: buttonPressed === 'left' ? 'scale(0.9)' : 'scale(1)'
            }}
          >
            ←
          </button>
          <div></div>
          <button
            onClick={() => makeMove('right')}
            disabled={!gameActive}
            style={{
              padding: '15px',
              backgroundColor: gameActive ? (buttonPressed === 'right' ? '#6d5e54' : '#8f7a66') : '#cdc1b4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: gameActive ? 'pointer' : 'not-allowed',
              fontSize: '24px',
              transition: 'all 0.1s ease',
              transform: buttonPressed === 'right' ? 'scale(0.9)' : 'scale(1)'
            }}
          >
            →
          </button>
          
          <div></div>
          <button
            onClick={() => makeMove('down')}
            disabled={!gameActive}
            style={{
              padding: '15px',
              backgroundColor: gameActive ? (buttonPressed === 'down' ? '#6d5e54' : '#8f7a66') : '#cdc1b4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: gameActive ? 'pointer' : 'not-allowed',
              fontSize: '24px',
              transition: 'all 0.1s ease',
              transform: buttonPressed === 'down' ? 'scale(0.9)' : 'scale(1)'
            }}
          >
            ↓
          </button>
          <div></div>
        </div>

        {/* Instructions */}
        <div style={{ 
          textAlign: 'center', 
          color: '#776E65', 
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          <div style={{ marginBottom: '5px' }}>🎯 <strong>Use arrow keys or buttons to move tiles</strong></div>
          <div>🎮 <strong>Combine tiles with the same number to reach 2048!</strong></div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1001,
          fontSize: '16px',
          fontWeight: 'bold',
          animation: 'slideIn 0.3s ease'
        }}>
          {notificationMessage}
        </div>
      )}

      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Game2048;