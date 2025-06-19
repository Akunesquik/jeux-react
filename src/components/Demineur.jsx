import { useState, useEffect } from 'react';
import styles from './Demineur.module.css';

const rows = 8;
const cols = 8;
const minesCount = 10;

function createBoard() {
  const board = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => ({
      x,
      y,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!board[y][x].mine) {
      board[y][x].mine = true;
      placedMines++;
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x].mine) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && board[ny][nx].mine) {
            count++;
          }
        }
      }
      board[y][x].adjacent = count;
    }
  }

  return board;
}

export default function Demineur() {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const reveal = (x, y) => {
    if (gameOver || gameWon) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[y][x];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.mine) {
      setGameOver(true);
    } else if (cell.adjacent === 0) {
      revealEmptyCells(newBoard, x, y);
    }

    setBoard(newBoard);
  };

  const revealEmptyCells = (board, x, y) => {
    const stack = [{ x, y }];
    const visited = new Set();

    while (stack.length > 0) {
      const { x, y } = stack.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = board[y][x];
      if (cell.flagged) continue;
      cell.revealed = true;

      if (cell.adjacent === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !board[ny][nx].revealed) {
              stack.push({ x: nx, y: ny });
            }
          }
        }
      }
    }
  };

  const toggleFlag = (e, x, y) => {
    e.preventDefault();
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[y][x];

    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
      setBoard(newBoard);
    }
  };

  const reset = () => {
    setBoard(createBoard());
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    const totalCells = rows * cols;
    const revealedCount = board.flat().filter(cell => cell.revealed).length;
    const totalSafe = totalCells - minesCount;

    if (revealedCount === totalSafe && !gameOver) {
      setGameWon(true);
    }
  }, [board, gameOver]);

  return (
    <div className={styles.container}>
      <h2>Démineur</h2>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.cell}
                ${cell.revealed ? styles.revealed : ''}
                ${cell.mine && gameOver ? styles.mine : ''}
              `}
              onClick={() => reveal(x, y)}
              onContextMenu={(e) => toggleFlag(e, x, y)}
            >
              {cell.revealed && !cell.mine && cell.adjacent > 0 ? cell.adjacent : ''}
              {!cell.revealed && cell.flagged && '🚩'}
              {cell.revealed && cell.mine && '💣'}
            </div>
          ))
        )}
      </div>

      {gameOver && <div className={styles.status}>💥 Perdu !</div>}
      {gameWon && <div className={styles.status}>🎉 Gagné !</div>}
      {(gameOver || gameWon) && (
        <button className={styles.button} onClick={reset}>Rejouer</button>
      )}
    </div>
  );
}
