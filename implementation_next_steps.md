# KONIVRER Implementation Next Steps

Based on the current state of the game and the comprehensive rules documentation created, this document outlines the specific next steps to implement the KONIVRER trading card game rules into the existing codebase.

## Current State Assessment

From the screenshots and repository exploration, we can see that the current implementation includes:

1. **Basic Game Board**: 
   - Player and opponent areas
   - Field zones for cards
   - Hand display
   - Game controls (Draw, End Turn, Show/Hide Log, Concede)
   - Game log
   - Health, turn, and mana tracking

2. **Card Display**:
   - Basic card rendering with mana cost
   - Card back design
   - Clickable cards in hand

3. **Game Flow**:
   - Turn-based gameplay
   - Drawing cards
   - Playing cards from hand to field
   - Turn ending

## Implementation Priorities

### 1. Core Game Zones (High Priority)

The most critical missing elements are the specialized game zones described in the rules:

```javascript
// Update game state structure to include all zones
function updateGameStateStructure() {
  // For each player in the game state
  for (const playerId in gameState.players) {
    // Add Flag zone
    if (!gameState.players[playerId].flagZone) {
      gameState.players[playerId].flagZone = null;
    }
    
    // Add Life Cards zone
    if (!gameState.players[playerId].lifeCards) {
      gameState.players[playerId].lifeCards = [];
    }
    
    // Add Combat Row
    if (!gameState.players[playerId].combatRow) {
      gameState.players[playerId].combatRow = [];
    }
    
    // Add Azoth Row
    if (!gameState.players[playerId].azothRow) {
      gameState.players[playerId].azothRow = [];
    }
    
    // Add Removed from Play zone
    if (!gameState.players[playerId].removedFromPlay) {
      gameState.players[playerId].removedFromPlay = [];
    }
  }
}
```

### 2. Elemental System (High Priority)

The elemental system is fundamental to gameplay:

```jsx
// Update card component to display elemental costs
function CardComponent({ card }) {
  return (
    <div className="card">
      <div className="card-elements">
        {Object.entries(card.elements).map(([element, count]) => (
          <div key={element} className={`element ${element}`}>
            {getElementSymbol(element)} {count}
          </div>
        ))}
      </div>
      
      <div className="card-name">{card.name}</div>
      <div className="card-type">{card.type}</div>
      
      {/* Additional card content */}
    </div>
  );
}

// Helper to get element symbol
function getElementSymbol(element) {
  const symbols = {
    fire: '△',
    water: '▽',
    earth: '⊡',
    air: '△',
    aether: '○',
    nether: '□',
    generic: '⊗'
  };
  
  return symbols[element] || '';
}
```

### 3. Life Cards System (High Priority)

The Life Cards system replaces traditional health points:

```jsx
// Component for Life Cards zone
function LifeCardsZone({ lifeCards, isCurrentPlayer }) {
  return (
    <div className="life-cards-zone">
      <div className="zone-label">LIFE</div>
      <div className="cards-container">
        {lifeCards.map((card, index) => (
          <div key={index} className="life-card">
            {/* Always show card back for Life Cards */}
            <img src="/assets/card-back-new.png" alt="Life Card" />
          </div>
        ))}
      </div>
      <div className="life-count">{lifeCards.length}</div>
    </div>
  );
}
```

### 4. Combat System (Medium Priority)

The Combat Row and combat mechanics:

```jsx
// Component for Combat Row
function CombatRow({ combatCards, isCurrentPlayer }) {
  return (
    <div className={`combat-row ${isCurrentPlayer ? 'your' : 'opponent'}`}>
      <div className="zone-label">COMBAT ROW</div>
      <div className="cards-container">
        {combatCards.length === 0 ? (
          <div className="empty-zone">No cards</div>
        ) : (
          combatCards.map(card => (
            <div key={card.id} className="combat-card">
              <CardComponent card={card} />
              {card.attacking && <div className="status-indicator attacking">Attacking</div>}
              {card.defending && <div className="status-indicator defending">Defending</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### 5. Flag Cards System (Medium Priority)

The Flag zone and Flag card effects:

```jsx
// Component for Flag zone
function FlagZone({ flagCard, isCurrentPlayer }) {
  return (
    <div className="flag-zone">
      <div className="zone-label">FLAG</div>
      {flagCard ? (
        <div className="flag-card">
          <CardComponent card={flagCard} />
        </div>
      ) : (
        <div className="empty-zone">No Flag</div>
      )}
    </div>
  );
}
```

## Implementation Tasks by File

Based on the repository structure, here are specific files that need to be updated:

### 1. Game State Management (`src/contexts/GameContext.js`)

```javascript
// Update initial game state
const initialGameState = {
  currentTurn: 1,
  activePlayer: 'player1',
  phase: 'DRAW',
  players: {
    player1: {
      health: 20,
      flagZone: null,
      lifeCards: [],
      hand: [],
      field: [],
      combatRow: [],
      azothRow: [],
      deck: [],
      discardPile: [],
      removedFromPlay: [],
      azoth: {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        aether: 0,
        nether: 0,
        generic: 0,
        total: 0
      }
    },
    player2: {
      // Same structure as player1
    }
  },
  gameLog: []
};
```

### 2. Game Board Layout (`src/components/GameBoard.js`)

```jsx
// Update game board component
function GameBoard() {
  const { gameState, currentPlayer } = useGameContext();
  const opponentId = currentPlayer === 'player1' ? 'player2' : 'player1';
  
  return (
    <div className="game-board">
      {/* Opponent Area */}
      <div className="opponent-area">
        <PlayerInfo player={gameState.players[opponentId]} isOpponent={true} />
        
        <div className="board-row">
          <FlagZone flagCard={gameState.players[opponentId].flagZone} isCurrentPlayer={false} />
          <div className="center-area">
            <CombatRow combatCards={gameState.players[opponentId].combatRow} isCurrentPlayer={false} />
            <Field cards={gameState.players[opponentId].field} isCurrentPlayer={false} />
          </div>
          <div className="right-column">
            <Deck deckSize={gameState.players[opponentId].deck.length} isCurrentPlayer={false} />
            <RemovedFromPlay cards={gameState.players[opponentId].removedFromPlay} isCurrentPlayer={false} />
          </div>
        </div>
        
        <LifeCardsZone lifeCards={gameState.players[opponentId].lifeCards} isCurrentPlayer={false} />
      </div>
      
      {/* Current Player Area */}
      <div className="player-area">
        <LifeCardsZone lifeCards={gameState.players[currentPlayer].lifeCards} isCurrentPlayer={true} />
        
        <div className="board-row">
          <FlagZone flagCard={gameState.players[currentPlayer].flagZone} isCurrentPlayer={true} />
          <div className="center-area">
            <Field cards={gameState.players[currentPlayer].field} isCurrentPlayer={true} />
            <CombatRow combatCards={gameState.players[currentPlayer].combatRow} isCurrentPlayer={true} />
            <AzothRow azoth={gameState.players[currentPlayer].azoth} />
          </div>
          <div className="right-column">
            <Deck deckSize={gameState.players[currentPlayer].deck.length} isCurrentPlayer={true} />
            <RemovedFromPlay cards={gameState.players[currentPlayer].removedFromPlay} isCurrentPlayer={true} />
          </div>
        </div>
        
        <PlayerInfo player={gameState.players[currentPlayer]} isOpponent={false} />
        <GameControls />
        <Hand cards={gameState.players[currentPlayer].hand} />
      </div>
      
      <GameLog log={gameState.gameLog} />
    </div>
  );
}
```

### 3. Card Component (`src/components/Card.js`)

```jsx
// Update card component to include all card parts
function Card({ card, location = 'hand', onClick }) {
  if (!card) return null;
  
  // For face-down cards (like in Life Cards zone)
  if (location === 'lifeCards' || card.faceDown) {
    return (
      <div className="card face-down" onClick={onClick}>
        <img src="/assets/card-back-new.png" alt="Card Back" />
      </div>
    );
  }
  
  return (
    <div className={`card ${card.type.toLowerCase()} ${location}`} onClick={onClick}>
      {/* Element costs */}
      <div className="card-elements">
        {Object.entries(card.elements || {}).map(([element, count]) => (
          <div key={element} className={`element ${element}`}>
            {getElementSymbol(element)} {count}
          </div>
        ))}
      </div>
      
      {/* Card name */}
      <div className="card-name">{card.name}</div>
      
      {/* Card type */}
      <div className="card-type">{card.type}</div>
      
      {/* Card abilities */}
      {card.abilities && (
        <div className="card-abilities">
          {card.abilities.map((ability, index) => (
            <div key={index} className="ability">{ability.effect}</div>
          ))}
        </div>
      )}
      
      {/* Flavor text */}
      {card.flavorText && (
        <div className="flavor-text">{card.flavorText}</div>
      )}
      
      {/* Set and rarity */}
      <div className="card-set-rarity">
        {card.set && card.rarity && `${card.set}-${getRaritySymbol(card.rarity)}`}
      </div>
      
      {/* Set number */}
      <div className="card-set-number">
        {card.setNumber && `${card.setNumber}`}
      </div>
      
      {/* Strength/Health for Familiars */}
      {card.type === 'Familiar' && (
        <div className="card-stats">
          <span className="strength">{card.strength}</span>
          <span className="separator">/</span>
          <span className="health">{card.health}</span>
        </div>
      )}
    </div>
  );
}

// Helper to get rarity symbol
function getRaritySymbol(rarity) {
  const symbols = {
    common: '🜠',
    uncommon: '☽',
    rare: '☉'
  };
  
  return symbols[rarity] || '';
}
```

### 4. Game Logic (`src/engine/gameEngine.js`)

```javascript
// Update game initialization to include Life Cards and follow Pre-Game Actions
export function initializeGame(player1Deck, player2Deck) {
  // Create initial game state
  const gameState = createEmptyGameState();
  
  // Set up player 1
  gameState.players.player1.deck = shuffleDeck(player1Deck);
  
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player1LifeCards = gameState.players.player1.deck.splice(0, 4);
  gameState.players.player1.lifeCards = player1LifeCards;
  
  // Set up player 2
  gameState.players.player2.deck = shuffleDeck(player2Deck);
  
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player2LifeCards = gameState.players.player2.deck.splice(0, 4);
  gameState.players.player2.lifeCards = player2LifeCards;
  
  // Set up Flags
  const player1Flag = player1Deck.find(card => card.type === 'Flag');
  const player2Flag = player2Deck.find(card => card.type === 'Flag');
  
  gameState.players.player1.flagZone = player1Flag;
  gameState.players.player2.flagZone = player2Flag;
  
  // Start Phase: Draw 2 cards (only at game start)
  drawCards(gameState, 'player1', 2);
  drawCards(gameState, 'player2', 2);
  
  // Initialize first turn
  gameState.currentTurn = 1;
  gameState.activePlayer = 'player1';
  gameState.phase = 'START';
  
  // Log game start
  gameState.gameLog.push('Game started');
  
  return gameState;
}

// Helper function to draw multiple cards
function drawCards(gameState, playerId, count) {
  for (let i = 0; i < count; i++) {
    gameState = drawCard(gameState, playerId);
  }
  return gameState;
}

// Implement the five game phases
const phaseHandlers = {
  // Start Phase
  START: (gameState) => {
    const activePlayer = gameState.activePlayer;
    
    // Update phase
    gameState.phase = 'START';
    gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Start Phase`);
    
    // Only draw 2 cards at the very beginning of the game (handled in initializeGame)
    // For subsequent turns, no card draw happens in Start Phase
    
    // Allow player to optionally place 1 card as Azoth
    // This is handled through user action, not automatically
    
    return gameState;
  },
  
  // Main Phase
  MAIN: (gameState, action) => {
    // Handle playing cards from hand by resting Azoth
    // Implement Summon, Tribute, Azoth, Spell, and Burst mechanics
    // Draw a card after each card played
    
    return gameState;
  },
  
  // Combat Phase
  COMBAT: (gameState, action) => {
    // Handle attacking with Familiars
    // Handle blocking with Familiars
    // Resolve combat damage
    
    return gameState;
  },
  
  // Post-Combat Main Phase
  POST_COMBAT_MAIN: (gameState, action) => {
    // Allow playing additional cards
    
    return gameState;
  },
  
  // Refresh Phase
  REFRESH: (gameState) => {
    // Refresh all rested Azoth (turn vertical)
    gameState.players[gameState.activePlayer].azothRow.forEach(azoth => {
      azoth.rested = false;
    });
    
    // End turn cleanup
    // Switch active player
    gameState.activePlayer = gameState.activePlayer === 'player1' ? 'player2' : 'player1';
    
    // If it's now player1's turn, increment the turn counter
    if (gameState.activePlayer === 'player1') {
      gameState.currentTurn++;
    }
    
    // Reset phase to START for next player
    gameState.phase = 'START';
    
    return gameState;
  }
};
```

### 5. CSS Styling (`src/styles/gameBoard.css`)

```css
/* Add styling for new game zones */

/* Flag Zone */
.flag-zone {
  width: 120px;
  height: 180px;
  border: 2px dashed #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.zone-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #fff;
}

/* Life Cards Zone */
.life-cards-zone {
  width: 120px;
  height: 180px;
  border: 2px dashed #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.life-count {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-top: 8px;
}

/* Combat Row */
.combat-row {
  width: 100%;
  min-height: 120px;
  border: 2px dashed #f00;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin-bottom: 16px;
}

.combat-row.your {
  border-color: #0f0;
}

.combat-row.opponent {
  border-color: #f00;
}

/* Azoth Row */
.azoth-row {
  width: 100%;
  height: 60px;
  border: 2px dashed #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 8px;
  margin-top: 16px;
}

.azoth-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
}

.element-symbol {
  font-size: 20px;
  margin-bottom: 4px;
}

.element-count {
  font-size: 16px;
  font-weight: bold;
}

/* Removed from Play Zone */
.removed-from-play {
  width: 120px;
  height: 180px;
  border: 2px dashed #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin-top: 16px;
}
```

## Testing Plan

To ensure the implementation works correctly, follow this testing plan:

1. **Zone Rendering Test**:
   - Verify all game zones appear in the correct positions
   - Check that zone labels are visible and clear
   - Confirm empty zones display appropriate messages

2. **Card Display Test**:
   - Verify cards show all required parts (elements, name, type, etc.)
   - Check that elemental symbols display correctly
   - Confirm card stats (strength/health) are visible for Familiars

3. **Life Cards System Test**:
   - Verify 4 Life Cards are set aside at game start
   - Check that damage reveals Life Cards instead of reducing health
   - Confirm game ends when a player has no Life Cards remaining

4. **Combat System Test**:
   - Verify cards move to Combat Row when attacking/defending
   - Check that combat resolution applies damage correctly
   - Confirm elemental advantages affect combat damage

5. **Flag System Test**:
   - Verify Flag card displays in Flag zone
   - Check that Flag bonuses apply to matching elemental cards
   - Confirm Flag abilities trigger at appropriate times

## Conclusion

By implementing these changes, the KONIVRER game will incorporate all the core systems described in the rules documentation. The implementation should be done in phases, starting with the most critical components (game zones, elemental system, Life Cards) before moving on to more complex mechanics (combat system, Flag effects).

This approach ensures that the game remains playable throughout the development process while gradually introducing the full depth and strategic complexity of KONIVRER's unique mechanics.