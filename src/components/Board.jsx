import { useState } from 'react';
import styles from './Board.module.css';

const initialBoard = Array(9).fill(null);

export default function Board() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = board.every(cell => cell !== null) && !winner;

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setBoard(initialBoard);
    setXIsNext(true);
  }

  const status = winner
    ? `Gagnant : ${winner}`
    : isDraw
    ? "Match nul !"
    : `Joueur : ${xIsNext ? 'X' : 'O'}`;

  const gameOver = winner || isDraw;

  return (
    <div className={styles.container}>
      <h2 className={styles.status}>{status}</h2>
      <div className={styles.grid}>
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className={styles.cell}>
            {cell}
          </button>
        ))}
      </div>
      {gameOver && (
        <button onClick={resetGame} className={styles.reset}>Rejouer</button>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // lignes
    [0,3,6], [1,4,7], [2,5,8], // colonnes
    [0,4,8], [2,4,6],          // diagonales
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
