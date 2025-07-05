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
const MobileGamePage = () => {
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
    if (gameId) {
      // Join existing game
      joinGame(gameId);
      setGameStatus('playing');
    }
  }, [gameId, joinGame]);
  // Update game state from context
  useEffect(() => {
    if (gameState) {
      // Update hand
      if (gameState.hand) {
        setHand(gameState.hand);
      }
      // Update battlefield
      if (gameState.battlefield) {
        setBattlefield(gameState.battlefield);
      }
      // Update opponent
      if (gameState.opponent) {
        setOpponent(gameState.opponent);
      }
      // Update player
      if (gameState.player) {
        setPlayer(gameState.player);
      }
      // Update turn
      if (gameState.turn) {
        setTurn(gameState.turn);
        setIsPlayerTurn(gameState.isPlayerTurn);
      }
      // Update game log
      if (gameState.log) {
        setGameLog(gameState.log);
      }
      // Check if game ended
      if (gameState.status === 'ended') {
        setGameStatus('ended');
      }
    }
  }, [gameState]);
  // Start a new game
  const handleStartGame = () => {
    if (!selectedDeck) {
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
    if (card.cost > player.mana) {
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
  const handleEndTurn = () => {
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
  const handleLeaveGame = () => {
    leaveGame();
    navigate('/');
  };
  // Render game setup
  if (gameStatus === 'setup') {
    return (
      <div className="mobile-game-setup">
        <div className="mobile-card mobile-mb">
          {userDecks && userDecks.length > 0 ? (
            <div className="mobile-list">
              {userDecks.map(deck => (
                <button
                  key={deck.id}
                  className={`mobile-list-item mobile-text-center ${selectedDeck === deck.id ? 'mobile-btn-primary' : ''}`}
                  onClick={() => setSelectedDeck(deck.id)}
                >
                  {deck.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="mobile-text-center">
              <p>Using default starter deck for quick play.</p>
              <button
                className="mobile-btn mobile-btn-primary mobile-mt"
                onClick={() => setSelectedDeck('starter-deck')}
              >
                Use Starter Deck
              </button>
              <p className="mobile-mt">
                <small>Create an account to build custom decks.</small>
              </p>
            </div>
          )}
        </div>
        <div className="mobile-text-center">
          <button
            className="mobile-btn mobile-btn-primary mobile-mb"
            onClick={handleStartGame}
            disabled={!selectedDeck}
          >
            Start Game
          </button>
          <button
            className="mobile-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  // Render game ended
  if (gameStatus === 'ended') {
    return (
      <div className="mobile-game-ended mobile-text-center">
        <div className="mobile-card mobile-mb">
          <p>Winner: {gameState?.winner || 'Unknown'}</p>
          <div className="mobile-mt">
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
        </div>
      </div>
    );
  }
  // Render game in progress
  return (
    <div className="mobile-game">
      {/* Opponent Area */}
      <div className="mobile-card mobile-mb">
        <div className="mobile-opponent">
          <div className="mobile-opponent-info">
            <div>Health: {opponent.health}</div>
            <div>Cards: {opponent.cards}</div>
          </div>
        </div>
      </div>
      {/* Battlefield */}
      <div className="mobile-card mobile-mb">
        {/* Opponent's Cards */}
        <div className="mobile-battlefield-section mobile-mb">
          <div className="mobile-grid">
            {opponent.battlefield &&
              opponent.battlefield.map(card => (
                <div key={card.id} className="mobile-game-card">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="mobile-game-card-img"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                    }}
                  />
                </div>
              ))}
            {(!opponent.battlefield || opponent.battlefield.length === 0) && (
              <div className="mobile-text-center mobile-p">No cards</div>
            )}
          </div>
        </div>
        {/* Player's Cards */}
        <div className="mobile-battlefield-section">
          <div className="mobile-grid">
            {battlefield.map(card => (
              <div key={card.id} className="mobile-game-card">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="mobile-game-card-img"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                  }}
                />
              </div>
            ))}
            {battlefield.length === 0 && (
              <div className="mobile-text-center mobile-p">No cards</div>
            )}
          </div>
        </div>
      </div>
      {/* Player Info */}
      <div className="mobile-card mobile-mb">
        <div className="mobile-player-info">
          <div>
            <div>Health: {player.health}</div>
          </div>
          <div>
            <div>Turn: {turn}</div>
            <div>
              Mana: {player.mana}/{player.maxMana}
            </div>
          </div>
        </div>
      </div>
      {/* Game Controls */}
      <div className="mobile-card mobile-mb">
        <div className="mobile-game-controls">
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
          >
            End Turn
          </button>
          <button
            className="mobile-btn"
            onClick={() => setShowGameLog(!showGameLog)}
          >
            {showGameLog ? 'Hide Log' : 'Show Log'}
          </button>
          <button className="mobile-btn" onClick={handleLeaveGame}>
            Concede
          </button>
        </div>
      </div>
      {/* Game Log */}
      {showGameLog && (
        <div className="mobile-card mobile-mb">
          <div className="mobile-game-log">
            {gameLog.map((entry, index) => (
              <div key={index} className="mobile-game-log-entry">
                <span className="mobile-game-log-turn">Turn {entry.turn}:</span>{' '}
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Hand */}
      <div className="mobile-hand">
        <div className="mobile-hand-cards">
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
                  e.target.src =
                    'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                }}
              />
              <div className="mobile-game-card-cost">{card.cost}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MobileGamePage;
