import { useEffect, useState } from 'react';
import styles from './SnakeGame.module.css';

const gridSize = 10;
const initialSnake = [{ x: 4, y: 4 }];
const initialApple = { x: 7, y: 7 };
const initialSpeed = 300; // ms

export default function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);


  const resetGame = () => {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(initialSpeed);
  };

  const handleStart = () => {
    

    setShowPopup(false);
    localStorage.setItem('snakePopupShown', 'true');
    resetGame();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // bloque scroll

        switch (e.key) {
          case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
          case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
          case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
          case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (isGameOver || showPopup) return; // Ne pas bouger si popup ou game over

    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        // Collision murs ou corps
        if (
          newHead.x < 0 || newHead.x >= gridSize ||
          newHead.y < 0 || newHead.y >= gridSize ||
          prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Mange pomme
        if (newHead.x === apple.x && newHead.y === apple.y) {
          let newApple;
          do {
            newApple = {
              x: Math.floor(Math.random() * gridSize),
              y: Math.floor(Math.random() * gridSize),
            };
          } while (newSnake.some(seg => seg.x === newApple.x && seg.y === newApple.y));

          setApple(newApple);
          setScore((s) => s + Math.floor(1000 / speed));

          setSpeed((currentSpeed) => Math.max(50, currentSpeed - 10));
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, apple, isGameOver, speed, showPopup]);

  return (
    <div className={styles.container}>
      <h2>Score : {score}</h2>

      {showPopup && (
        <div className={styles.popup}>
          <p>Utilise les flèches du clavier pour jouer au Snake.</p>
          <button onClick={handleStart} className={styles.goButton}>GO</button>
        </div>
      )}

      <div
        className={styles.grid}
        style={{
          filter: showPopup ? 'blur(3px)' : 'none',
          pointerEvents: showPopup ? 'none' : 'auto',
          opacity: showPopup ? 0.7 : 1,
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isApple = apple.x === x && apple.y === y;
          const snakeIndex = snake.findIndex(seg => seg.x === x && seg.y === y);
          const isHead = snakeIndex === 0;

          return (
            <div
              key={i}
              className={`${styles.cell}
                ${snakeIndex >= 0 ? styles.snake : ''}
                ${isHead ? styles.snakeHead : ''}
                ${isApple ? styles.apple : ''}
              `}
            />
          );
        })}
      </div>

      {isGameOver && (
        <>
          <div className={styles.gameOver}>💀 Game Over 💀</div>
          <button onClick={resetGame} className={styles.restartButton}>Rejouer</button>
        </>
      )}
    </div>
  );
}
