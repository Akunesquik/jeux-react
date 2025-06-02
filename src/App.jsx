import { useState } from 'react';
import Morpion from './components/Morpion';
import Connect4 from './components/Connect4';
import './App.css'; // Pour les styles des onglets

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
      </div>

      <div className="tab-content">
        {activeTab === 'morpion' && <Morpion />}
        {activeTab === 'connect4' && <Connect4 />}
      </div>
    </div>
  );
}

export default App;
