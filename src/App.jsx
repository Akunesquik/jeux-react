import { useState } from 'react';
import Morpion from './components/Morpion';
import Connect4 from './components/Connect4';
import SnakeGame from './components/SnakeGame';
import MemoryGame from './components/Memory';
import Demineur from './components/Demineur';
import Simon from './components/Simon';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('morpion');

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>🎮 Jeux React</h1>

      <div className="tabs">
        <button
          className={activeTab === 'morpion' ? 'active' : ''}
          onClick={() => setActiveTab('morpion')}
        >
          Morpion
        </button>
        <button
          className={activeTab === 'connect4' ? 'active' : ''}
          onClick={() => setActiveTab('connect4')}
        >
          Puissance 4
        </button>
        <button
          className={activeTab === 'snake' ? 'active' : ''}
          onClick={() => setActiveTab('snake')}
        >
          Snake
        </button>
        <button
          className={activeTab === 'memory' ? 'active' : ''}
          onClick={() => setActiveTab('memory')}
        >
          Memory
        </button>
        <button
          className={activeTab === 'demineur' ? 'active' : ''}
          onClick={() => setActiveTab('demineur')}
        >
          Démineur
        </button>
        <button
          className={activeTab === 'simon' ? 'active' : ''}
          onClick={() => setActiveTab('simon')}
        >
          Simon
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'morpion' && <Morpion />}
        {activeTab === 'connect4' && <Connect4 />}
        {activeTab === 'snake' && <SnakeGame />}
        {activeTab === 'memory' && <MemoryGame />}
        {activeTab === 'demineur' && <Demineur />}
        {activeTab === 'simon' && <Simon />}
      </div>
    </div>
  );
}

export default App;
