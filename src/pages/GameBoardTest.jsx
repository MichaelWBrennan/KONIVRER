import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import GameBoard from '../components/GameBoard';

const GameBoardTest = () => {
  return (
    <div className="game-board-test">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </div>
  );
};

export default GameBoardTest;