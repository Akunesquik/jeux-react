import Board from './components/Board';
import Connect4 from './components/Connect4';

function App() {
  return (
    <div>
      <div>
        <h1 style={{ textAlign: 'center' }}>Morpion React</h1>
        <Board />
      </div>
      <div>
        <h1 style={{ textAlign: 'center' }}>Puissance 4</h1>
        <Connect4 />
      </div>
    </div>
  );
}


export default App;
