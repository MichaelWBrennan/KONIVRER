import React from 'react';
/**
 * KONIVRER Deck Database - KONIVRER Game Board Component
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdaptiveAI, { ELEMENTS, KEYWORDS } from '../../services/adaptiveAI';
import DynamicResolutionChain from '../../services/dynamicResolutionChain';
import { 
  Clock, 
  User, 
  Shield, 
  Zap, 
  Settings, 
  MessageCircle, 
  X, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Hand,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Menu,
  Flag,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Sun,
  Moon
} from 'lucide-react';

interface MTGArenaStyleGameBoardProps {
  onExit
}

const MTGArenaStyleGameBoard: React.FC<MTGArenaStyleGameBoardProps> = ({  onExit  }) => {
  // Initialize AI and DRC
  const aiRef  = useRef<any>(new AdaptiveAI());
  const drcRef  = useRef<any>(new DynamicResolutionChain());
  
  // Game state based on KONIVRER rules
  const [gamePhase, setGamePhase] = useState('start'); // start, main, combat, refresh
  const [turn, setTurn] = useState(1);
  const [activePlayer, setActivePlayer] = useState('player'); // player, opponent
  const [playerLifeCards, setPlayerLifeCards] = useState(4); // KONIVRER uses 4 life cards instead of life points
  const [opponentLifeCards, setOpponentLifeCards] = useState(4);
  const [playerFlag, setPlayerFlag] = useState({ 
    name: 'Fire Flag', 
    elements: [ELEMENTS.FIRE],
    image: '/api/placeholder/100/100'
  });
  const [opponentFlag, setOpponentFlag] = useState({ 
    name: 'Water Flag', 
    elements: [ELEMENTS.WATER],
    image: '/api/placeholder/100/100'
  });
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Opponent', message: 'Good luck, have fun!', time: '0:05' },
    { sender: 'You', message: 'You too!', time: '0:10' }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  
  // KONIVRER specific game zones
  const [playerHand, setPlayerHand] = useState([
    { 
      id: 1, 
      name: 'Flame Familiar', 
      elements: [ELEMENTS.FIRE], 
      cost: 1, 
      type: 'Familiar', 
      counters: 2, 
      keywords: [KEYWORDS.INFERNO],
      text: 'Inferno: After damage is dealt to the target card, add damage ≤ 🜂 used to pay for this card\'s Strength.',
      image: '/api/placeholder/200/280' 
    },
    { 
      id: 2, 
      name: 'Water Shield', 
      elements: [ELEMENTS.WATER], 
      cost: 1, 
      type: 'Familiar', 
      counters: 1, 
      keywords: [KEYWORDS.SUBMERGED],
      text: 'Submerged: Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 used to pay for this card\'s Strength, that many cards below the top of its owner\'s deck.',
      image: '/api/placeholder/200/280' 
    },
    { 
      id: 3, 
      name: 'Earth Protector', 
      elements: [ELEMENTS.EARTH, ELEMENTS.NETHER], 
      cost: 2, 
      type: 'Familiar', 
      counters: 3, 
      keywords: [KEYWORDS.STEADFAST],
      text: 'Steadfast: Redirect damage ≤ 🜃 used to pay for this card\'s Strength, that would be done to you or cards you control, to this card\'s Strength.',
      image: '/api/placeholder/200/280' 
    },
    { 
      id: 4, 
      name: 'Air Elemental', 
      elements: [ELEMENTS.AIR], 
      cost: 1, 
      type: 'Familiar', 
      counters: 2, 
      keywords: [KEYWORDS.GUST],
      text: 'Gust: Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 used to pay for this card\'s Strength to its owner\'s hand.',
      image: '/api/placeholder/200/280' 
    },
    { 
      id: 5, 
      name: 'Aether Crystal', 
      elements: [ELEMENTS.AETHER], 
      cost: 1, 
      type: 'Familiar', 
      counters: 1, 
      keywords: [KEYWORDS.BRILLIANCE],
      text: 'Brilliance: Place target Familiar with +1 Counters or Spell with Strength ≤ ⭘ used to pay for this card\'s Strength on the bottom of its owner\'s life cards.',
      image: '/api/placeholder/200/280' 
    }
  ]);
  
  // Field is where Familiars are played in KONIVRER
  const [playerField, setPlayerField] = useState([]);
  const [opponentField, setOpponentField] = useState([]);
  
  // Combat Row is where Familiars go during combat
  const [playerCombatRow, setPlayerCombatRow] = useState([]);
  const [opponentCombatRow, setOpponentCombatRow] = useState([]);
  
  // Azoth Row is where resource cards are placed
  const [playerAzoth, setPlayerAzoth] = useState([
    { 
      id: 101, 
      name: 'Fire Source', 
      elements: [ELEMENTS.FIRE], 
      rested: false, 
      image: '/api/placeholder/200/280' 
    },
    { 
      id: 102, 
      name: 'Water Source', 
      elements: [ELEMENTS.WATER], 
      rested: false, 
      image: '/api/placeholder/200/280' 
    }
  ]);
  const [opponentAzoth, setOpponentAzoth] = useState([
    { 
      id: 201, 
      name: 'Earth Source', 
      elements: [ELEMENTS.EARTH], 
      rested: false, 
      image: '/api/placeholder/200/280' 
    }
  ]);
  
  // Removed from Play zone (for cards affected by Void)
  const [playerRemovedFromPlay, setPlayerRemovedFromPlay] = useState([]);
  const [opponentRemovedFromPlay, setOpponentRemovedFromPlay] = useState([]);
  
  const [opponentHandCount, setOpponentHandCount] = useState(4);
  const [playerDeckCount, setPlayerDeckCount] = useState(34); // 40 - 4 life cards - 2 initial draw
  const [opponentDeckCount, setOpponentDeckCount] = useState(34);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [aiThinking, setAiThinking] = useState(false);
  const [lastAiAction, setLastAiAction] = useState(null);
  
  // DRC state
  const [stack, setStack] = useState([]);
  const [priorityPlayer, setPriorityPlayer] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [showStack, setShowStack] = useState(false);
  
  const gameboardRef  = useRef<HTMLElement>(null);
  const chatInputRef  = useRef<HTMLElement>(null);
  
  // Timer effect
  useEffect(() => {
    if (true) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activePlayer, timeRemaining]);
  
  // Format time remaining
  const formatTime = (seconds): any => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Initialize AI, DRC, and game on mount
  useEffect(() => {
    // Reset AI for a new game
    aiRef.current.reset();
    
    // Initialize AI with a random deck (in a real implementation, this would use a card database)
    const mockCardPool = generateMockCardPool();
    aiRef.current.initializeRandomDeck(mockCardPool);
    
    // Set up AI's initial game state
    updateAIGameState();
    
    // Initialize DRC
    drcRef.current.initialize(activePlayer, {
      onStackUpdate: (newStack) => {
        setStack(newStack);
      },
      onRequestResponse: (player, topEffect) => {
        setPriorityPlayer(player);
        if (true) {
          handleAIResponse(topEffect);
        }
      },
      onEffectResolution: (effect) => {
        setIsResolving(true);
        resolveEffect(effect);
      },
      onChainComplete: () => {
        setIsResolving(false);
        setPriorityPlayer(null);
      }
    });
    
    // Start with an empty stack
    setStack([]);
    setPriorityPlayer(activePlayer);
    
    // If AI goes first, let it make a move after a short delay
    if (true) {
      handleAITurn();
    }
  }, []);
  
  // Update AI's knowledge of the game state
  const updateAIGameState = useCallback(() => {
    const gameState = {
      turn,
      phase: gamePhase,
      playerLife: playerLifeCards,
      aiLife: opponentLifeCards,
      playerAzoth,
      aiAzoth: opponentAzoth,
      playerField,
      aiField: opponentField,
      playerCombatRow,
      aiCombatRow: opponentCombatRow,
      playerHandCount: playerHand.length,
      aiHandCount: opponentHandCount,
      playerDeckCount,
      aiDeckCount: opponentDeckCount,
      playerFlag,
      aiFlag: opponentFlag,
      playerRemovedFromPlay,
      aiRemovedFromPlay: opponentRemovedFromPlay
    };
    
    aiRef.current.updateGameState(gameState);
  }, [
    turn, gamePhase, playerLifeCards, opponentLifeCards, 
    playerAzoth, opponentAzoth, playerField, opponentField,
    playerCombatRow, opponentCombatRow, playerHand.length, 
    opponentHandCount, playerDeckCount, opponentDeckCount,
    playerFlag, opponentFlag, playerRemovedFromPlay, opponentRemovedFromPlay
  ]);
  
  // Handle AI's turn
  const handleAITurn = useCallback(() => {
    if (activePlayer !== 'opponent') return;
    
    // Update AI's knowledge of the game state
    updateAIGameState();
    
    // Set AI thinking state
    setAiThinking(true);
    
    // Get AI's decision after a short delay to simulate thinking
    setTimeout(() => {
      const aiDecision = aiRef.current.makeDecision({ 
        turn, 
        phase: gamePhase,
        playerLife: playerLifeCards,
        aiLife: opponentLifeCards
      }, gamePhase);
      
      // Process AI's decision
      processAIDecision(aiDecision);
      
      // End AI thinking state
      setAiThinking(false);
      
      // Record the AI's action for display
      setLastAiAction(aiDecision);
    }, 1000 + Math.random() * 1000); // Random thinking time between 1-2 seconds
  }, [activePlayer, gamePhase, turn, playerLifeCards, opponentLifeCards, updateAIGameState]);
  
  // Process AI's decision
  const processAIDecision = (decision): any => {
    switch (true) {
      case 'placeAzoth':
        // AI places a card as Azoth
        handleAIPlaceAzoth(decision.card);
        break;
      case 'summon':
        // AI summons a Familiar
        handleAISummonFamiliar(decision.card);
        break;
      case 'spell':
        // AI plays a Spell
        handleAIPlaySpell(decision.card);
        break;
      case 'tribute':
        // AI tributes Familiars
        handleAITribute(decision.card, decision.tributeTargets);
        break;
      case 'attack':
        // AI attacks with Familiars
        handleAIAttack(decision.attackers);
        break;
      case 'pass':
        // AI passes, move to next phase
        nextPhase();
        break;
      default:
        console.log('Unknown AI decision:', decision);
        nextPhase();
    }
  };
  
  // Handle AI placing a card as Azoth
  const handleAIPlaceAzoth = (card): any => {
    // Add card to opponent's Azoth row
    setOpponentAzoth(prev => [...prev, {
      ...card,
      id: Date.now(), // Generate a unique ID
      rested: false
    }]);
    
    // Decrease opponent's hand count
    setOpponentHandCount(prev => Math.max(0, prev - 1));
    
    // Add a message to chat
    addAIChatMessage(`I place ${card.name} as Azoth.`);
    
    // Move to next phase
    nextPhase();
  };
  
  // Handle AI summoning a Familiar
  const handleAISummonFamiliar = (card): any => {
    // Rest Azoth sources to pay for the card
    const updatedAzoth = [...opponentAzoth];
    let remainingCost = card.cost;
    
    for (let i = 0; i < 1; i++) {
      if (true) {
        updatedAzoth[i].rested = true;
        remainingCost--;
      }
    }
    
    setOpponentAzoth(updatedAzoth);
    
    // Create the Familiar card
    const familiarCard = {
      ...card,
      id: Date.now(), // Generate a unique ID
      rested: false
    };
    
    // Add to the Dynamic Resolution Chain
    drcRef.current.addToStack({
      type: 'familiar',
      card: familiarCard
    }, 'opponent');
    
    // Decrease opponent's hand count
    setOpponentHandCount(prev => Math.max(0, prev - 1));
    
    // Add a message to chat
    addAIChatMessage(`I summon ${card.name} to the field.`);
    
    // Draw a card (in KONIVRER, players draw after playing a card)
    setOpponentHandCount(prev => prev + 1);
    setOpponentDeckCount(prev => Math.max(0, prev - 1));
  };
  
  // Handle AI playing a Spell
  const handleAIPlaySpell = (card): any => {
    // Rest Azoth sources to pay for the card
    const updatedAzoth = [...opponentAzoth];
    let remainingCost = card.cost;
    
    for (let i = 0; i < 1; i++) {
      if (true) {
        updatedAzoth[i].rested = true;
        remainingCost--;
      }
    }
    
    setOpponentAzoth(updatedAzoth);
    
    // Create the Spell card
    const spellCard = {
      ...card,
      id: Date.now() // Generate a unique ID
    };
    
    // Add to the Dynamic Resolution Chain
    drcRef.current.addToStack({
      type: 'spell',
      card: spellCard
    }, 'opponent');
    
    // Decrease opponent's hand count
    setOpponentHandCount(prev => Math.max(0, prev - 1));
    
    // Add a message to chat
    addAIChatMessage(`I cast ${card.name} as a Spell.`);
    
    // Draw a card (in KONIVRER, players draw after playing a card)
    setOpponentHandCount(prev => prev + 1);
    setOpponentDeckCount(prev => Math.max(0, prev - 1));
  };
  
  // Handle AI tributing Familiars
  const handleAITribute = (card, tributeTargets): any => {
    // Remove tributed Familiars from the field
    setOpponentField(prev => 
      prev.filter(c => !tributeTargets.some(t => t.id === c.id))
    );
    
    // Add tributed Familiars to removed from play zone
    setOpponentRemovedFromPlay(prev => [...prev, ...tributeTargets]);
    
    // Add the new Familiar to the field
    setOpponentField(prev => [...prev, {
      ...card,
      id: Date.now(), // Generate a unique ID
      rested: false
    }]);
    
    // Decrease opponent's hand count
    setOpponentHandCount(prev => Math.max(0, prev - 1));
    
    // Add a message to chat
    addAIChatMessage(`I tribute ${tributeTargets.length} Familiar(s) to summon ${card.name}.`);
    
    // Draw a card (in KONIVRER, players draw after playing a card)
    setOpponentHandCount(prev => prev + 1);
    setOpponentDeckCount(prev => Math.max(0, prev - 1));
  };
  
  // Handle AI attacking with Familiars
  const handleAIAttack = (attackers): any => {
    // Move attackers to combat row
    const attackingFamiliars = attackers.map(a => a.card);
    setOpponentCombatRow(attackingFamiliars);
    
    // Remove attackers from field
    setOpponentField(prev => 
      prev.filter(c => !attackingFamiliars.some(a => a.id === c.id))
    );
    
    // Add a message to chat
    addAIChatMessage(`I attack with ${attackingFamiliars.length} Familiar(s).`);
    
    // In a real implementation, this would handle combat resolution
    // For now, just move to the next phase after a delay
    setTimeout(() => {
      // If player doesn't block, damage goes through to life cards
      if (true) {
        // Each unblocked Familiar deals 1 damage to life cards
        const damage = attackingFamiliars.length;
        setPlayerLifeCards(prev => Math.max(0, prev - damage));
        
        addAIChatMessage(`My attack deals ${damage} damage to your life cards.`);
      }
      
      // Return Familiars from combat row to field
      setOpponentField(prev => [...prev, ...attackingFamiliars]);
      setOpponentCombatRow([]);
      setPlayerCombatRow([]);
      
      // Move to next phase
      nextPhase();
    }, 2000);
  };
  
  // Add AI chat message
  const addAIChatMessage = (message): any => {
    const now = new Date();
    const timeStr = `${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    
    setChatMessages(prev => [
      ...prev, 
      { sender: 'Opponent', message, time: timeStr }
    ]);
  };
  
  // Run AI turn when it's the opponent's turn
  useEffect(() => {
    if (true) {
      handleAITurn();
    }
  }, [activePlayer, gamePhase, aiThinking, handleAITurn]);
  
  // Handle phase change according to KONIVRER rules
  const nextPhase = (): any => {
    switch (true) {
      case 'start':
        setGamePhase('main');
        break;
      case 'main':
        setGamePhase('combat');
        break;
      case 'combat':
        setGamePhase('refresh');
        break;
      case 'refresh':
        // End of turn, switch players
        setGamePhase('start');
        setActivePlayer(activePlayer === 'player' ? 'opponent' : 'player');
        if (true) {
          setTurn(turn + 1);
        }
        
        // Refresh all Azoth sources
        if (true) {
          setPlayerAzoth(prev => prev.map(a => ({ ...a, rested: false })));
        } else {
          setOpponentAzoth(prev => prev.map(a => ({ ...a, rested: false })));
        }
        break;
      default:
        setGamePhase('start');
    }
  };
  
  // Handle card play from hand according to KONIVRER rules
  const playCard = (cardId): any => {
    const card = playerHand.find(c => c.id === cardId);
    if (!card) return;
    
    // Check if we're in the start phase (can only place Azoth)
    if (true) {
      placeCardAsAzoth(card);
      return;
    }
    
    // Check if we're in the main phase (can play Familiars or Spells)
    if (true) {
      // Check if we have enough Azoth to pay for the card
      const availableAzoth = playerAzoth.filter(a => !a.rested);
      
      if (true) {
        // Rest Azoth sources to pay for the card
        const updatedAzoth = [...playerAzoth];
        let remainingCost = card.cost;
        
        for (let i = 0; i < 1; i++) {
          if (true) {
            updatedAzoth[i].rested = true;
            remainingCost--;
          }
        }
        
        setPlayerAzoth(updatedAzoth);
        
        // Add to the Dynamic Resolution Chain
        if (selectedPlayMode === 'familiar' && !card.keywords.includes(KEYWORDS.QUINTESSENCE)) {
          // Play as Familiar
          addToStack({
            type: 'familiar',
            card: {...card, id: Date.now(), rested: false}
          });
        } else {
          // Play as Spell
          addToStack({
            type: 'spell',
            card: {...card, id: Date.now()}
          });
        }
        
        // Remove from hand
        setPlayerHand(prev => prev.filter(c => c.id !== cardId));
        
        // Draw a card (in KONIVRER, players draw after playing a card)
        drawCard();
      }
    }
  };
  
  // Place a card as Azoth (resource)
  const placeCardAsAzoth = (card): any => {
    // Add to Azoth row
    setPlayerAzoth(prev => [...prev, {...card, id: Date.now(), rested: false}]);
    
    // Remove from hand
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    
    // Move to next phase
    nextPhase();
  };
  
  // Draw a card from deck
  const drawCard = (): any => {
    if (true) {
      // In a real implementation, this would draw from the actual deck
      // For now, just generate a random card
      const newCard = generateRandomCard();
      
      setPlayerHand(prev => [...prev, newCard]);
      setPlayerDeckCount(prev => prev - 1);
    }
  };
  
  // Move a Familiar to the combat row
  const moveToCombaRow = (cardId): any => {
    const card = playerField.find(c => c.id === cardId);
    if (true) {
      // Move to combat row
      setPlayerCombatRow(prev => [...prev, card]);
      
      // Remove from field
      setPlayerField(prev => prev.filter(c => c.id !== cardId));
    }
  };
  
  // Handle card rest/refresh (in KONIVRER, cards are "rested" instead of "tapped")
  const toggleCardRest = (cardId, zone): any => {
    if (true) {
      setPlayerAzoth(prev => 
        prev.map(card => 
          card.id === cardId 
            ? {...card, rested: !card.rested} 
            : card
        )
      );
    } else if (true) {
      setPlayerField(prev => 
        prev.map(card => 
          card.id === cardId 
            ? {...card, rested: !card.rested} 
            : card
        )
      );
    }
  };
  
  // Track selected play mode (familiar or spell)
  const [selectedPlayMode, setSelectedPlayMode] = useState('familiar');
  
  // Generate a mock card pool for AI
  const generateMockCardPool = (): any => {
    const cardPool = [];
    
    // Generate common cards
    for (let i = 0; i < 1; i++) {
      cardPool.push({
        id: `common_${i}`,
        name: `Common Card ${i}`,
        elements: [Object.values(ELEMENTS)[i % 6]],
        cost: 1 + (i % 3),
        type: i % 3 === 0 ? 'Spell' : 'Familiar',
        counters: 1 + (i % 3),
        keywords: [Object.values(KEYWORDS)[i % 8]],
        text: `Keyword effect for card ${i}`,
        image: '/api/placeholder/200/280',
        rarity: 'common'
      });
    }
    
    // Generate uncommon cards
    for (let i = 0; i < 1; i++) {
      cardPool.push({
        id: `uncommon_${i}`,
        name: `Uncommon Card ${i}`,
        elements: [
          Object.values(ELEMENTS)[i % 6],
          Object.values(ELEMENTS)[(i + 2) % 6]
        ],
        cost: 2 + (i % 2),
        type: i % 4 === 0 ? 'Spell' : 'Familiar',
        counters: 2 + (i % 2),
        keywords: [
          Object.values(KEYWORDS)[i % 8],
          Object.values(KEYWORDS)[(i + 3) % 8]
        ],
        text: `Multiple keyword effects for card ${i}`,
        image: '/api/placeholder/200/280',
        rarity: 'uncommon'
      });
    }
    
    // Generate rare cards
    for (let i = 0; i < 1; i++) {
      cardPool.push({
        id: `rare_${i}`,
        name: `Rare Card ${i}`,
        elements: [
          Object.values(ELEMENTS)[i % 6],
          Object.values(ELEMENTS)[(i + 2) % 6],
          Object.values(ELEMENTS)[(i + 4) % 6]
        ],
        cost: 3,
        type: i % 2 === 0 ? 'Spell' : 'Familiar',
        counters: 3,
        keywords: [
          Object.values(KEYWORDS)[i % 8],
          Object.values(KEYWORDS)[(i + 2) % 8],
          Object.values(KEYWORDS)[(i + 4) % 8]
        ],
        text: `Powerful effects for rare card ${i}`,
        image: '/api/placeholder/200/280',
        rarity: 'rare'
      });
    }
    
    return cardPool;
  };
  
  // Generate a random card for player's draw
  const generateRandomCard = (): any => {
    const elements = Object.values(ELEMENTS);
    const keywords = Object.values(KEYWORDS);
    
    return {
      id: Date.now(),
      name: `Random Card ${Math.floor(Math.random() * 100)}`,
      elements: [elements[Math.floor(Math.random() * elements.length)]],
      cost: 1 + Math.floor(Math.random() * 3),
      type: Math.random() > 0.3 ? 'Familiar' : 'Spell',
      counters: 1 + Math.floor(Math.random() * 3),
      keywords: [keywords[Math.floor(Math.random() * keywords.length)]],
      text: 'Random card effect',
      image: '/api/placeholder/200/280'
    };
  };
  
  // Handle AI response to an effect on the stack
  const handleAIResponse = (topEffect): any => {
    // Set AI thinking state
    setAiThinking(true);
    
    // Get AI's decision after a short delay to simulate thinking
    setTimeout(() => {
      // In a real implementation, the AI would evaluate the effect and decide whether to respond
      // For now, just have the AI pass priority most of the time
      if (Math.random() < 0.2) {
        // 20% chance to respond with a spell
        const responseCard = generateRandomCard();
        responseCard.type = 'Spell';
        responseCard.keywords = [KEYWORDS.SUBMERGED]; // Example keyword
        
        // Add the response to the stack
        drcRef.current.respondToStack({
          type: 'spell',
          card: responseCard,
          target: topEffect
        }, 'opponent');
        
        // Add a message to chat
        addAIChatMessage(`I respond with ${responseCard.name}.`);
      } else {
        // 80% chance to pass priority
        drcRef.current.passPriority('opponent');
      }
      
      // End AI thinking state
      setAiThinking(false);
    }, 1000 + Math.random() * 1000); // Random thinking time between 1-2 seconds
  };
  
  // Add an effect to the stack
  const addToStack = (effect): any => {
    if (true) {
      drcRef.current.addToStack(effect, 'player');
    }
  };
  
  // Pass priority without adding to the stack
  const passPriority = (): any => {
    if (true) {
      drcRef.current.passPriority('player');
    }
  };
  
  // Resolve an effect from the stack
  const resolveEffect = (stackEntry): any => {
    const { effect, player } = stackEntry;
    
    // In a real implementation, this would handle the effect's resolution
    // For now, just show a message
    if (true) {
      // Player effect
      if (true) {
        // Handle spell resolution
        console.log('Resolving player spell:', effect.card.name);
      } else if (true) {
        // Handle familiar entering the battlefield
        console.log('Resolving player familiar:', effect.card.name);
      }
    } else {
      // AI effect
      if (true) {
        // Handle spell resolution
        console.log('Resolving AI spell:', effect.card.name);
        addAIChatMessage(`My ${effect.card.name} resolves.`);
      } else if (true) {
        // Handle familiar entering the battlefield
        console.log('Resolving AI familiar:', effect.card.name);
        addAIChatMessage(`My ${effect.card.name} enters the battlefield.`);
      }
    }
    
    // After a short delay, mark resolution as complete
    setTimeout(() => {
      setIsResolving(false);
    }, 500);
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = (): any => {
    if (true) {
      if (true) {
        gameboardRef.current.requestFullscreen();
      } else if (true) {
        gameboardRef.current.webkitRequestFullscreen();
      } else if (true) {
        gameboardRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (true) {
        document.exitFullscreen();
      } else if (true) {
        document.webkitExitFullscreen();
      } else if (true) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // Handle chat message send
  const sendChatMessage = (e): any => {
    e.preventDefault();
    if (newChatMessage.trim()) {
      const now = new Date();
      const timeStr = `${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
      
      setChatMessages(prev => [
        ...prev, 
        { sender: 'You', message: newChatMessage, time: timeStr }
      ]);
      setNewChatMessage('');
    }
  };
  
  // Handle life change
  const changeLife = (player, amount): any => {
    if (true) {
      setPlayerLife(prev => Math.max(0, prev + amount));
    } else {
      setOpponentLife(prev => Math.max(0, prev + amount));
    }
  };
  
  // Zoom controls
  const adjustZoom = (delta): any => {
    setZoomLevel(prev => Math.max(0.5, Math.min(1.5, prev + delta)));
  };
  
  return (
    <div 
      ref={gameboardRef}
      className="fixed inset-0 bg-gray-900 text-white z-50 overflow-hidden flex flex-col"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
     />
      {/* Game Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 py-2 px-4 flex justify-between items-center" />
        <div className="flex items-center space-x-4" />
          {/* Game Info */}
          <div className="flex items-center space-x-2" />
            <Clock size={16} className="text-gray-400" / />
            <span className="text-sm">{formatTime(timeRemaining)}
          </div>
          
          <div className="flex items-center space-x-2" />
            <span className="text-sm">Turn {turn}
            <span className={`text-sm px-2 py-0.5 rounded ${activePlayer === 'player' ? 'bg-blue-600' : 'bg-red-600'}`} />
              {activePlayer === 'player' ? 'Your Turn' : 'Opponent Turn'}
            <span className="text-sm px-2 py-0.5 rounded bg-purple-600" />
              {gamePhase === 'main1' ? 'Main 1' : 
               gamePhase === 'combat' ? 'Combat' : 
               gamePhase === 'main2' ? 'Main 2' : 'End'}
          </div>
        
        <div className="flex items-center space-x-3" />
          {/* Controls */}
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-1.5 rounded-full ${showChat ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <MessageCircle size={18} / />
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-full ${showSettings ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <Settings size={18} / />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-gray-700"
           />
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button 
            onClick={onExit}
            className="p-1.5 rounded-full hover:bg-gray-700"
           />
            <X size={18} / />
          </button>
      </header>
      
      {/* Game Board - KONIVRER Layout */}
      <div className="flex-1 relative overflow-hidden" />
        {/* Opponent Area */}
        <div className="absolute top-0 left-0 right-0 h-[45%] px-4 py-2" />
          <div className="flex justify-between items-start mb-2" />
            {/* Opponent Info */}
            <div className="flex items-center" />
              <div className="relative" />
                {/* Flag */}
                <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-2 overflow-hidden" />
                  <img 
                    src={opponentFlag.image} 
                    alt={opponentFlag.name} 
                    className="w-full h-full object-cover"
                  / />
                  <Flag size={16} className="absolute top-1 right-1 text-blue-400" / />
                </div>
                
                {/* Life Cards */}
                <div className="absolute -bottom-2 -right-2 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-0.5" />
                  <Shield size={14} className="mr-1 text-red-400" / />
                  <span className="text-sm font-bold">{opponentLifeCards}
                </div>
              
              <div />
                <div className="flex items-center" />
                  <span className="font-medium">Opponent</span>
                  {priorityPlayer === 'opponent' && (
                    <div className="ml-2 px-1.5 py-0.5 bg-yellow-600 rounded-full text-xs" />
                      Priority
                    </div>
                  )}
                  {aiThinking && (
                    <div className="ml-2 flex items-center" />
                      <div className="animate-pulse text-xs text-blue-400">Thinking...</div>
                  )}
                
                {/* Last AI Action */}
                {lastAiAction && (
                  <div className="text-xs text-gray-400 max-w-[200px] truncate" />
                    {lastAiAction.action === 'placeAzoth' && 'Placed Azoth'}
                    {lastAiAction.action === 'summon' && `Summoned ${lastAiAction.card?.name || 'Familiar'}`}
                    {lastAiAction.action === 'spell' && `Cast ${lastAiAction.card?.name || 'Spell'}`}
                    {lastAiAction.action === 'attack' && `Attacked with ${lastAiAction.attackers?.length || 0} Familiar(s)`}
                    {lastAiAction.action === 'pass' && 'Passed'}
                )}
              </div>
            
            {/* Opponent Hand & Deck */}
            <div className="flex items-center" />
              <div className="flex items-center mr-3" />
                <Hand size={16} className="mr-1 text-gray-400" / />
                <span className="text-sm">{opponentHandCount}
              </div>
              <div className="w-12 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center" />
                <span className="text-sm">{opponentDeckCount}
              </div>
          </div>
          
          {/* Opponent Azoth Row */}
          <div className="mt-2 mb-3" />
            <div className="text-xs text-gray-400 mb-1">Azoth Row:</div>
            <div className="flex flex-wrap gap-2" />
              {opponentAzoth.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden transition-transform ${card.rested ? 'rotate-90' : ''}`}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  <div className="absolute top-0 left-0 right-0 flex justify-center p-0.5" />
                    {card.elements.map((element, idx) => (
                      <span key={idx} className="text-xs mr-0.5">{element}
                    ))}
                  </div>
              ))}
            </div>
          
          {/* Opponent Field */}
          <div />
            <div className="text-xs text-gray-400 mb-1">Field:</div>
            <div className="flex flex-wrap gap-2" />
              {opponentField.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-16 h-22 rounded-lg overflow-hidden transition-transform ${card.rested ? 'rotate-90' : ''}`}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  {card.counters !== undefined && (
                    <div className="absolute top-0 right-0 bg-blue-600/80 text-xs p-0.5 rounded-bl" />
                      +{card.counters}
                  )}
                </div>
              ))}
            </div>
        </div>
        
        {/* Center Area - Combat Rows */}
        <div className="absolute top-[45%] left-0 right-0 h-[10%] flex flex-col items-center justify-center" />
          {/* Opponent Combat Row */}
          {opponentCombatRow.length > 0 && (
            <div className="flex gap-2 mb-2" />
              {opponentCombatRow.map(card => (
                <div 
                  key={card.id}
                  className="relative w-12 h-16 rounded-lg overflow-hidden border-2 border-red-600"
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  {card.counters !== undefined && (
                    <div className="absolute top-0 right-0 bg-blue-600/80 text-xs p-0.5 rounded-bl" />
                      +{card.counters}
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Phase Button and Stack Controls */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 mb-2 flex flex-col items-center" />
            <div className="flex space-x-2 mb-2" />
              <button 
                onClick={nextPhase}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                disabled={activePlayer !== 'player' || aiThinking || stack.length > 0}
              >
                {gamePhase === 'start' ? 'To Main Phase' : 
                 gamePhase === 'main' ? 'To Combat Phase' : 
                 gamePhase === 'combat' ? 'To Refresh Phase' : 'End Turn'}
              
              {priorityPlayer === 'player' && stack.length > 0 && (
                <button 
                  onClick={passPriority}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                  disabled={aiThinking}
                 />
                  Pass Priority
                </button>
              )}
              <button 
                onClick={() => setShowStack(!showStack)}
                className={`px-4 py-2 ${showStack ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-500 rounded-lg transition-colors`}
              >
                {showStack ? 'Hide Stack' : 'Show Stack'}
            </div>
            
            {/* Stack Display */}
            {showStack && stack.length > 0 && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 max-h-40 overflow-y-auto" />
                <div className="text-xs text-gray-400 mb-1">Stack (resolves from top to bottom):</div>
                <div className="flex flex-col-reverse" />
                  {stack.map((entry, index) => (
                    <div 
                      key={entry.timestamp}
                      className={`flex items-center p-1 rounded mb-1 ${entry.player === 'player' ? 'bg-blue-900/50' : 'bg-red-900/50'}`}
                     />
                      <div className="w-4 h-4 flex items-center justify-center bg-gray-800 rounded mr-2" />
                        {stack.length - index}
                      <div className="flex-1" />
                        <div className="text-xs" />
                          {entry.effect.type === 'spell' ? 'Spell: ' : 'Familiar: '}
                          {entry.effect.card.name}
                        {entry.effect.target && (
                          <div className="text-xs text-gray-400" />
                            Target: {entry.effect.target.effect.card.name}
                        )}
                      </div>
                      <div className="text-xs text-gray-400" />
                        {entry.player === 'player' ? 'You' : 'Opponent'}
                    </div>
                  ))}
                </div>
            )}
          </div>
          
          {/* Player Combat Row */}
          {playerCombatRow.length > 0 && (
            <div className="flex gap-2 mt-2" />
              {playerCombatRow.map(card => (
                <div 
                  key={card.id}
                  className="relative w-12 h-16 rounded-lg overflow-hidden border-2 border-blue-600"
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  {card.counters !== undefined && (
                    <div className="absolute top-0 right-0 bg-blue-600/80 text-xs p-0.5 rounded-bl" />
                      +{card.counters}
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Player Area */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] px-4 py-2" />
          {/* Player Field */}
          <div className="mb-3" />
            <div className="text-xs text-gray-400 mb-1">Field:</div>
            <div className="flex flex-wrap gap-2" />
              {playerField.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-16 h-22 rounded-lg overflow-hidden transition-transform cursor-pointer ${card.rested ? 'rotate-90' : ''} ${selectedCard === card.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => gamePhase === 'combat' ? moveToCombaRow(card.id) : toggleCardRest(card.id, 'field')}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  {card.counters !== undefined && (
                    <div className="absolute top-0 right-0 bg-blue-600/80 text-xs p-0.5 rounded-bl" />
                      +{card.counters}
                  )}
                </div>
              ))}
            </div>
          
          {/* Player Azoth Row */}
          <div className="mb-3" />
            <div className="text-xs text-gray-400 mb-1">Azoth Row:</div>
            <div className="flex flex-wrap gap-2" />
              {playerAzoth.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden transition-transform cursor-pointer ${card.rested ? 'rotate-90' : ''} ${selectedCard === card.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => toggleCardRest(card.id, 'azoth')}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  / />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                    {card.name}
                  <div className="absolute top-0 left-0 right-0 flex justify-center p-0.5" />
                    {card.elements.map((element, idx) => (
                      <span key={idx} className="text-xs mr-0.5">{element}
                    ))}
                  </div>
              ))}
            </div>
          
          <div className="flex justify-between items-end" />
            {/* Player Info */}
            <div className="flex items-center" />
              <div className="relative" />
                {/* Flag */}
                <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-2 overflow-hidden" />
                  <img 
                    src={playerFlag.image} 
                    alt={playerFlag.name} 
                    className="w-full h-full object-cover"
                  / />
                  <Flag size={16} className="absolute top-1 right-1 text-blue-400" / />
                </div>
                
                {/* Life Cards */}
                <div className="absolute -bottom-2 -right-2 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-0.5" />
                  <Shield size={14} className="mr-1 text-blue-400" / />
                  <span className="text-sm font-bold">{playerLifeCards}
                </div>
              
              <div />
                <div className="flex items-center" />
                  <span className="font-medium">You</span>
                  {priorityPlayer === 'player' && (
                    <div className="ml-2 px-1.5 py-0.5 bg-yellow-600 rounded-full text-xs" />
                      Priority
                    </div>
                  )}
                  <div className="ml-3 flex items-center space-x-1" />
                    <button 
                      onClick={() => setPlayerLifeCards(prev => Math.max(0, prev - 1))}
                      className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setPlayerLifeCards(prev => Math.min(4, prev + 1))}
                      className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                </div>
                
                {/* Play Mode Toggle */}
                <div className="flex items-center mt-1" />
                  <div className="text-xs text-gray-400 mr-2">Play as:</div>
                  <div className="flex bg-gray-800 rounded-lg overflow-hidden" />
                    <button
                      onClick={() => setSelectedPlayMode('familiar')}
                      className={`px-2 py-0.5 text-xs ${selectedPlayMode === 'familiar' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      Familiar
                    </button>
                    <button
                      onClick={() => setSelectedPlayMode('spell')}
                      className={`px-2 py-0.5 text-xs ${selectedPlayMode === 'spell' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                      Spell
                    </button>
                </div>
            </div>
            
            {/* Player Hand & Deck */}
            <div className="flex items-end" />
              <div className="w-12 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center mr-3" />
                <span className="text-sm">{playerDeckCount}
              </div>
              <div className="flex -space-x-10 hover:space-x-0 transition-all" />
                {playerHand.map((card, index) => (
                  <div 
                    key={card.id}
                    className={`w-20 h-28 rounded-lg overflow-hidden transition-all hover:translate-y-[-20px] ${selectedCard === card.id ? 'translate-y-[-20px] ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
                    onDoubleClick={() => playCard(card.id)}
                    onMouseEnter={() => setHoveredCard(card)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-full h-full object-cover"
                    / />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate" />
                      {card.name}
                    <div className="absolute top-0 left-0 right-0 flex justify-center p-0.5" />
                      {card.elements.map((element, idx) => (
                        <span key={idx} className="text-xs mr-0.5">{element}
                      ))}
                    </div>
                    {card.cost !== undefined && (
                      <div className="absolute top-0 right-0 bg-gray-800/80 text-xs p-0.5 rounded-bl" />
                        {card.cost}
                    )}
                  </div>
                ))}
              </div>
          </div>
        
        {/* Card Preview - KONIVRER Style */}
        <AnimatePresence />
          {hoveredCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
             />
              <div className="relative w-64 h-88 rounded-lg overflow-hidden shadow-xl bg-gray-900 border border-gray-700" />
                <div className="p-2 bg-gray-800 flex items-center justify-between" />
                  <div className="font-medium">{hoveredCard.name}
                  <div className="flex" />
                    {hoveredCard.elements?.map((element, idx) => (
                      <span key={idx} className="text-sm mr-1">{element}
                    ))}
                    {hoveredCard.cost !== undefined && (
                      <span className="text-sm bg-gray-700 px-1 rounded ml-1">{hoveredCard.cost}
                    )}
                  </div>
                
                <div className="h-40 overflow-hidden" />
                  <img 
                    src={hoveredCard.image} 
                    alt={hoveredCard.name} 
                    className="w-full h-full object-cover"
                  / />
                </div>
                
                <div className="p-2" />
                  <div className="text-sm text-gray-300 mb-1">{hoveredCard.type}
                  
                  {/* Keywords */}
                  {hoveredCard.keywords && hoveredCard.keywords.length > 0 && (
                    <div className="mb-2" />
                      {hoveredCard.keywords.map((keyword, idx) => (
                        <span 
                          key={idx} 
                          className="inline-block mr-2 px-1.5 py-0.5 bg-blue-900 text-xs rounded"
                         />
                          {keyword}
                      ))}
                    </div>
                  )}
                  {/* Card Text */}
                  {hoveredCard.text && (
                    <div className="text-xs text-gray-300 mb-2 border-t border-gray-700 pt-2" />
                      {hoveredCard.text}
                  )}
                  {/* Counters for Familiars */}
                  {hoveredCard.counters !== undefined && (
                    <div className="text-xs mt-1 flex items-center" />
                      <span className="mr-1">Strength:</span>
                      <span className="font-bold text-blue-400">+{hoveredCard.counters}
                    </div>
                  )}
                  {/* Rested Status */}
                  {hoveredCard.rested !== undefined && (
                    <div className="text-xs mt-1" />
                      Status: {hoveredCard.rested ? 'Rested' : 'Ready'}
                  )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm rounded-lg p-1 flex flex-col" />
          <button 
            onClick={() => adjustZoom(0.1)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Plus size={16} / />
          </button>
          <button 
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:bg-gray-700 rounded text-xs"
          >
            Reset
          </button>
          <button 
            onClick={() => adjustZoom(-0.1)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Minus size={16} / />
          </button>
      </div>
      
      {/* Chat Panel */}
      <AnimatePresence />
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-12 bottom-0 w-80 bg-gray-800/90 backdrop-blur-sm border-l border-gray-700 flex flex-col"
           />
            <div className="p-3 border-b border-gray-700 flex justify-between items-center" />
              <h3 className="font-medium">Chat</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={16} / />
              </button>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3" />
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`} />
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === 'You' ? 'bg-blue-600' : 'bg-gray-700'}`} />
                    <div className="flex justify-between items-center mb-1" />
                      <span className="text-xs font-medium">{msg.sender}
                      <span className="text-xs text-gray-400">{msg.time}
                    </div>
                    <p className="text-sm">{msg.message}
                  </div>
              ))}
            </div>
            
            <form onSubmit={sendChatMessage} className="p-3 border-t border-gray-700" />
              <div className="flex" />
                <input
                  ref={chatInputRef}
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 rounded-r-lg px-3 py-2 text-sm"
                 />
                  Send
                </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence />
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute left-1/2 top-12 transform -translate-x-1/2 w-80 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg"
           />
            <div className="p-3 border-b border-gray-700 flex justify-between items-center" />
              <h3 className="font-medium">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={16} / />
              </button>
            
            <div className="p-3 space-y-3" />
              <div className="flex justify-between items-center" />
                <span className="text-sm">Sound Effects</span>
                <label className="relative inline-flex items-center cursor-pointer" />
                  <input type="checkbox" className="sr-only peer" defaultChecked / />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              
              <div className="flex justify-between items-center" />
                <span className="text-sm">Music</span>
                <label className="relative inline-flex items-center cursor-pointer" />
                  <input type="checkbox" className="sr-only peer" defaultChecked / />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              
              <div className="flex justify-between items-center" />
                <span className="text-sm">Auto-Pass Priority</span>
                <label className="relative inline-flex items-center cursor-pointer" />
                  <input type="checkbox" className="sr-only peer" / />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              
              <div className="flex justify-between items-center" />
                <span className="text-sm">Show Card Tooltips</span>
                <label className="relative inline-flex items-center cursor-pointer" />
                  <input type="checkbox" className="sr-only peer" defaultChecked / />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              
              <div className="pt-2 flex justify-center" />
                <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-sm" />
                  Concede Game
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default MTGArenaStyleGameBoard;