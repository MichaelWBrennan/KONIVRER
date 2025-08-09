import React, { useState } from 'react';

export interface GameState {
  players: string[];
  currentPlayer: number;
  phase: string;
  turn: number;
  winner?: string;
}

export interface SimulationResult {
  winner: string;
  turns: number;
  winProbability: number;
}

export interface PhysicalGameSimulatorProps {
  onSimulationComplete?: (result: SimulationResult) => void;
}

export const PhysicalGameSimulator: React.FC<PhysicalGameSimulatorProps> = ({
  onSimulationComplete
}) => {
  const [gameState] = useState<GameState>({
    players: ['Player 1', 'Player 2'],
    currentPlayer: 0,
    phase: 'Setup',
    turn: 1
  });

  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Mock simulation function
  const runSimulation = async () => {
    setIsRunning(true);
    
    // Simulate game logic
    setTimeout(() => {
      const result: SimulationResult = {
        winner: gameState.players[Math.floor(Math.random() * 2)],
        turns: Math.floor(Math.random() * 20) + 5,
        winProbability: Math.random()
      };
      
      setSimulationResults(prev => [...prev, result]);
      onSimulationComplete?.(result);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="physical-game-simulator">
      <style>
        {`
          .physical-game-simulator {
            padding: 1rem;
            background: #f0f0f0;
            border-radius: 8px;
            margin: 1rem 0;
          }
          .game-state {
            background: white;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          .simulation-controls {
            margin: 1rem 0;
          }
          .simulation-results {
            margin-top: 1rem;
          }
          .result-item {
            background: white;
            padding: 0.5rem;
            margin: 0.25rem 0;
            border-radius: 4px;
            border-left: 4px solid #007bff;
          }
        `}
      </style>

      <h3>Physical Game Simulator</h3>
      <p>Simulate card game matches with detailed physics and rule modeling.</p>

      <div className="game-state">
        <h4>Current Game State</h4>
        <p>Players: {gameState.players.join(' vs ')}</p>
        <p>Current Player: {gameState.players[gameState.currentPlayer]}</p>
        <p>Phase: {gameState.phase}</p>
        <p>Turn: {gameState.turn}</p>
        {gameState.winner && <p><strong>Winner: {gameState.winner}</strong></p>}
      </div>

      <div className="simulation-controls">
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="btn-primary"
        >
          {isRunning ? 'Running Simulation...' : 'Run Simulation'}
        </button>
        
        <button 
          onClick={() => setSimulationResults([])}
          className="btn-secondary"
          style={{ marginLeft: '1rem' }}
        >
          Clear Results
        </button>
      </div>

      {simulationResults.length > 0 && (
        <div className="simulation-results">
          <h4>Simulation Results</h4>
          {simulationResults.map((result, index) => (
            <div key={index} className="result-item">
              <strong>Game {index + 1}:</strong> {result.winner} won in {result.turns} turns
              (Win probability: {(result.winProbability * 100).toFixed(1)}%)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhysicalGameSimulator;