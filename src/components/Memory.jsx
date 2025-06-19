import { useEffect, useState } from 'react';
import styles from './Memory.module.css';

const cards = ['🐶', '🐱', '🐭', '🐹', '🦊', '🐻', '🐼', '🐸'];
const shuffledCards = [...cards, ...cards]
  .sort(() => Math.random() - 0.5)
  .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));

export default function MemoryGame() {
  const [deck, setDeck] = useState(shuffledCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setDisabled(true);
      const [first, second] = flippedCards;
      if (deck[first].emoji === deck[second].emoji) {
        const newDeck = deck.map((card, index) =>
          index === first || index === second ? { ...card, matched: true } : card
        );
        setDeck(newDeck);
        setMatchedCount((m) => m + 1);
        setFlippedCards([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          const newDeck = deck.map((card, index) =>
            index === first || index === second ? { ...card, flipped: false } : card
          );
          setDeck(newDeck);
          setFlippedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handleFlip = (index) => {
    if (disabled || deck[index].flipped || deck[index].matched) return;

    const newDeck = deck.map((card, i) =>
      i === index ? { ...card, flipped: true } : card
    );
    setDeck(newDeck);
    setFlippedCards((prev) => [...prev, index]);
  };

  const handleRestart = () => {
    const reshuffled = [...cards, ...cards]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    setDeck(reshuffled);
    setFlippedCards([]);
    setMatchedCount(0);
    setDisabled(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {deck.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.flipped || card.matched ? styles.flipped : ''}`}
            onClick={() => handleFlip(index)}
          >
            <div className={styles.inner}>
              <div className={styles.front}>❓</div>
              <div className={styles.back}>{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {matchedCount === cards.length && (
        <div className={styles.victory}>
          🎉 Bravo ! Tu as gagné !
          <button onClick={handleRestart}>Rejouer</button>
        </div>
      )}
    </div>
  );
}
