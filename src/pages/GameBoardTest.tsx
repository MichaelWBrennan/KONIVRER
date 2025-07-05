import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import GameBoard from '../components/GameBoard';
const GameBoardTest = (): any => {
  return (
    <div className="game-board-test"></div>
      <GameProvider></GameProvider>
        <GameBoard /></GameBoard>
      </GameProvider>
    </div>
  );
};
export default GameBoardTest;