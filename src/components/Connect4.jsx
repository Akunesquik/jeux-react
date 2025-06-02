import { useState } from 'react';
import styles from './Connect4.module.css';

const ROWS = 6;
const COLUMNS = 7;
const EMPTY_BOARD = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));

export default function Connect4() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('🔴');
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  function handleColumnClick(colIndex) {
    if (winner || draw) return;

    const newBoard = board.map(row => [...row]);

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][colIndex]) {
        newBoard[row][colIndex] = currentPlayer;
        setBoard(newBoard);

        if (checkWinner(newBoard, row, colIndex, currentPlayer)) {
          setWinner(currentPlayer);
        } else if (isDraw(newBoard)) {
          setDraw(true);
        } else {
          setCurrentPlayer(currentPlayer === '🔴' ? '🟡' : '🔴');
        }

        break;
      }
    }
  }

  function isDraw(board) {
    return board.every(row => row.every(cell => cell !== null));
  }

  function resetGame() {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('🔴');
    setWinner(null);
    setDraw(false);
  }

  const status = winner
    ? `Gagnant : ${winner}`
    : draw
    ? "Match nul !"
    : `Tour de : ${currentPlayer}`;

  return (
    <div className={styles.container}>
      <h2>{status}</h2>
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.cell}
              onClick={() => handleColumnClick(colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {(winner || draw) && (
        <button onClick={resetGame} className={styles.reset}>Rejouer</button>
      )}
    </div>
  );
}

function checkWinner(board, row, col, player) {
  function count(dx, dy) {
    let count = 0;
    let r = row + dy;
    let c = col + dx;
    while (
      r >= 0 && r < ROWS &&
      c >= 0 && c < COLUMNS &&
      board[r][c] === player
    ) {
      count++;
      r += dy;
      c += dx;
    }
    return count;
  }

  const directions = [
    [1, 0],  // Horizontal
    [0, 1],  // Vertical
    [1, 1],  // Diagonale /
    [1, -1], // Diagonale \
  ];

  for (let [dx, dy] of directions) {
    const total = 1 + count(dx, dy) + count(-dx, -dy);
    if (total >= 4) return true;
  }

  return false;
}
