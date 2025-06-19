import { useState, useEffect } from 'react';
import styles from './Simon.module.css';

const colors = ['green', 'red', 'yellow', 'blue'];

export default function SimonGame() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState('');
  const [message, setMessage] = useState('Clique sur "Start" pour commencer');

  useEffect(() => {
    if (userSequence.length === sequence.length && sequence.length > 0) {
      if (userSequence.join() === sequence.join()) {
        setTimeout(() => {
          nextRound();
        }, 1000);
      } else {
        setMessage('❌ Mauvaise séquence ! Réessaie.');
        setIsPlaying(false);
      }
    }
  }, [userSequence]);

  const playSequence = async (seq) => {
    setIsPlaying(true);
    setUserSequence([]);
    for (const color of seq) {
      setActiveColor(color);
      await new Promise(res => setTimeout(res, 600));
      setActiveColor('');
      await new Promise(res => setTimeout(res, 200));
    }
    setIsPlaying(false);
    setMessage('À toi de jouer !');
  };

  const nextRound = () => {
    const nextColor = colors[Math.floor(Math.random() * 4)];
    const nextSequence = [...sequence, nextColor];
    setSequence(nextSequence);
    setMessage(`Tour ${nextSequence.length}`);
    setTimeout(() => playSequence(nextSequence), 800);
  };

  const handleColorClick = async (color) => {
  if (!isPlaying) {
    // allumer visuellement le bouton cliqué
    setActiveColor(color);
    await new Promise(res => setTimeout(res, 300));
    setActiveColor('');

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);
  }
};

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setMessage('Prépare-toi...');
    setTimeout(() => nextRound(), 1000);
  };

  return (
    <div className={styles.container}>
      <h2>Simon Game</h2>
      <div className={styles.board}>
        {colors.map((color) => (
          <div
            key={color}
            className={`${styles.color} ${styles[color]} ${activeColor === color ? styles.active : ''}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      <p className={styles.message}>{message}</p>
      <button className={styles.button} onClick={startGame}>Start</button>
    </div>
  );
}
