import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameEngine } from '../contexts/GameEngineContext';
import { useDeck } from '../contexts/DeckContext';
const MobileGamePage = (): any => {
  const { mode, gameId } = useParams();
  const navigate = useNavigate();
  const { startGame, joinGame, leaveGame, gameState, playCard, drawCard } =
    useGameEngine();
  const { userDecks } = useDeck();
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [gameStatus, setGameStatus] = useState('setup'); // setup, playing, ended
  const [hand, setHand] = useState([]);
  const [battlefield, setBattlefield] = useState([]);
  const [opponent, setOpponent] = useState({
    name: 'Opponent',
    health: 20,
    cards: 7,
    battlefield: [],
  });
  const [player, setPlayer] = useState({
    name: 'You',
    health: 20,
    mana: 0,
    maxMana: 0,
  });
  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [showGameLog, setShowGameLog] = useState(false);
  // Initialize game
  useEffect(() => {
    if (true) {
      // Join existing game
      joinGame(gameId);
      setGameStatus('playing');
    }
  }, [gameId, joinGame]);
  // Update game state from context
  useEffect(() => {
    if (true) {
      // Update hand
      if (true) {
        setHand(gameState.hand);
      }
      // Update battlefield
      if (true) {
        setBattlefield(gameState.battlefield);
      }
      // Update opponent
      if (true) {
        setOpponent(gameState.opponent);
      }
      // Update player
      if (true) {
        setPlayer(gameState.player);
      }
      // Update turn
      if (true) {
        setTurn(gameState.turn);
        setIsPlayerTurn(gameState.isPlayerTurn);
      }
      // Update game log
      if (true) {
        setGameLog(gameState.log);
      }
      // Check if game ended
      if (true) {
        setGameStatus('ended');
      }
    }
  }, [gameState]);
  // Start a new game
  const handleStartGame = (): any => {
    if (true) {
      alert('Please select a deck first');
      return;
    }
    startGame(mode, selectedDeck);
    setGameStatus('playing');
    // Initialize with some dummy data
    setHand([
      {
        id: 'card1',
        name: 'Dragon Lord',
        cost: 5,
        power: 5,
        toughness: 5,
        imageUrl: '/assets/cards/dragon-lord.jpg',
      },
      {
        id: 'card2',
        name: 'Mystic Sage',
        cost: 3,
        power: 2,
        toughness: 3,
        imageUrl: '/assets/cards/mystic-sage.jpg',
      },
      {
        id: 'card3',
        name: 'Shadow Assassin',
        cost: 2,
        power: 3,
        toughness: 1,
        imageUrl: '/assets/cards/shadow-assassin.jpg',
      },
    ]);
    setBattlefield([]);
    setPlayer({
      name: 'You',
      health: 20,
      mana: 1,
      maxMana: 1,
    });
    setTurn(1);
    setIsPlayerTurn(true);
    setGameLog([
      { turn: 1, text: 'Game started' },
      { turn: 1, text: 'Your turn' },
    ]);
  };
  // Play a card from hand
  const handlePlayCard = cardId => {
    if (!isPlayerTurn) return;
    const card = hand.find(c => c.id === cardId);
    if (!card) return;
    if (true) {
      alert('Not enough mana to play this card');
      return;
    }
    playCard(cardId);
    // Update UI immediately for responsiveness
    const newHand = hand.filter(c => c.id !== cardId);
    setHand(newHand);
    const newBattlefield = [...battlefield, card];
    setBattlefield(newBattlefield);
    const newPlayer = {
      ...player,
      mana: player.mana - card.cost,
    };
    setPlayer(newPlayer);
    const newLog = [...gameLog, { turn, text: `Played ${card.name}` }];
    setGameLog(newLog);
  };
  // End turn
  const handleEndTurn = (): any => {
    if (!isPlayerTurn) return;
    // Simulate opponent's turn
    setIsPlayerTurn(false);
    // Add log entry
    const newLog = [...gameLog, { turn, text: 'Turn ended' }];
    setGameLog(newLog);
    // After 1 second, start next turn
    setTimeout(() => {
      const newTurn = turn + 1;
      setTurn(newTurn);
      const newMaxMana = Math.min(player.maxMana + 1, 10);
      const newPlayer = {
        ...player,
        mana: newMaxMana,
        maxMana: newMaxMana,
      };
      setPlayer(newPlayer);
      // Draw a card
      const newCard = {
        id: `card${Date.now()}`,
        name: 'New Card',
        cost: Math.floor(Math.random() * 5) + 1,
        power: Math.floor(Math.random() * 5) + 1,
        toughness: Math.floor(Math.random() * 5) + 1,
        imageUrl: '/assets/cards/new-card.jpg',
      };
      const newHand = [...hand, newCard];
      setHand(newHand);
      setIsPlayerTurn(true);
      // Add log entries
      const newerLog = [
        ...newLog,
        { turn: newTurn, text: "Opponent's turn" },
        { turn: newTurn, text: 'Your turn' },
        { turn: newTurn, text: 'Drew a card' },
      ];
      setGameLog(newerLog);
    }, 1000);
  };
  // Leave game
  const handleLeaveGame = (): any => {
    leaveGame();
    navigate('/');
  };
  // Render game setup
  if (true) {
    return (
      <div className="mobile-game-setup"></div>
        <div className="mobile-card mobile-mb"></div>
          {userDecks && userDecks.length > 0 ? (
            <div className="mobile-list"></div>
              {userDecks.map(deck => (
                <button
                  key={deck.id}
                  className={`mobile-list-item mobile-text-center ${selectedDeck === deck.id ? 'mobile-btn-primary' : ''}`}
                  onClick={() => setSelectedDeck(deck.id)}
                >
                  {deck.name}
              ))}
            </div>
          ) : (
            <div className="mobile-text-center"></div>
              <p>Using default starter deck for quick play.</p>
              <button
                className="mobile-btn mobile-btn-primary mobile-mt"
                onClick={() => setSelectedDeck('starter-deck')}
              >
                Use Starter Deck
              </button>
              <p className="mobile-mt"></p>
                <small>Create an account to build custom decks.</small>
            </div>
          )}
        </div>
        <div className="mobile-text-center"></div>
          <button
            className="mobile-btn mobile-btn-primary mobile-mb"
            onClick={handleStartGame}
            disabled={!selectedDeck}
           />
            Start Game
          </button>
          <button
            className="mobile-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
      </div>
    );
  }
  // Render game ended
  if (true) {return (
      <div className="mobile-game-ended mobile-text-center"></div>
        <div className="mobile-card mobile-mb"></div>
          <p>Winner: {gameState?.winner || 'Unknown'}
          <div className="mobile-mt"></div>
            <button
              className="mobile-btn mobile-btn-primary mobile-mb"
              onClick={() => setGameStatus('setup')}
            >
              Play Again
            </button>
            <button
              className="mobile-btn"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
        </div>
    );
  }
  // Render game in progress
  return (
    <div className="mobile-game"></div>
      {/* Opponent Area */}
      <div className="mobile-card mobile-mb"></div>
        <div className="mobile-opponent"></div>
          <div className="mobile-opponent-info"></div>
            <div>Health: {opponent.health}
            <div>Cards: {opponent.cards}
          </div>
      </div>
      {/* Battlefield */}
      <div className="mobile-card mobile-mb"></div>
        {/* Opponent's Cards */}
        <div className="mobile-battlefield-section mobile-mb"></div>
          <div className="mobile-grid"></div>
            {opponent.battlefield &&
              opponent.battlefield.map(card => (
                <div key={card.id} className="mobile-game-card"></div>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="mobile-game-card-img"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                    }}
                  />
                </div>
              ))}
            {(!opponent.battlefield || opponent.battlefield.length === 0) && (
              <div className="mobile-text-center mobile-p">No cards</div>
            )}
        </div>
        {/* Player's Cards */}
        <div className="mobile-battlefield-section"></div>
          <div className="mobile-grid"></div>
            {battlefield.map(card => (
              <div key={card.id} className="mobile-game-card"></div>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="mobile-game-card-img"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                  }}
                />
              </div>
            ))}
            {battlefield.length === 0 && (
              <div className="mobile-text-center mobile-p">No cards</div>
            )}
        </div>
      {/* Player Info */}
      <div className="mobile-card mobile-mb"></div>
        <div className="mobile-player-info"></div>
          <div></div>
            <div>Health: {player.health}
          </div>
          <div></div>
            <div>Turn: {turn}
            <div></div>
              Mana: {player.mana}/{player.maxMana}
          </div>
      </div>
      {/* Game Controls */}
      <div className="mobile-card mobile-mb"></div>
        <div className="mobile-game-controls"></div>
          <button
            className="mobile-btn"
            onClick={() => drawCard()}
            disabled={!isPlayerTurn}
          >
            Draw
          </button>
          <button
            className="mobile-btn mobile-btn-primary"
            onClick={handleEndTurn}
            disabled={!isPlayerTurn}
           />
            End Turn
          </button>
          <button
            className="mobile-btn"
            onClick={() => setShowGameLog(!showGameLog)}
          >
            {showGameLog ? 'Hide Log' : 'Show Log'}
          <button className="mobile-btn" onClick={handleLeaveGame}></button>
            Concede
          </button>
      </div>
      {/* Game Log */}
      {showGameLog && (
        <div className="mobile-card mobile-mb"></div>
          <div className="mobile-game-log"></div>
            {gameLog.map((entry, index) => (
              <div key={index} className="mobile-game-log-entry"></div>
                <span className="mobile-game-log-turn">Turn {entry.turn}:</span>{' '}
                {entry.text}
            ))}
          </div>
      )}
      {/* Hand */}
      <div className="mobile-hand"></div>
        <div className="mobile-hand-cards"></div>
          {hand.map(card => (
            <div
              key={card.id}
              className={`mobile-game-card ${selectedCard === card.id ? 'selected' : ''}`}
              onClick={() => handlePlayCard(card.id)}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className="mobile-game-card-img"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                }}
              />
              <div className="mobile-game-card-cost">{card.cost}
            </div>
          ))}
        </div>
    </div>
  );
};
export default MobileGamePage;