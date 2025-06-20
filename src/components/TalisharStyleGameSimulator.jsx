import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize,
  Users,
  Clock,
  Target,
  Shield,
  Zap,
  Heart,
  Eye,
  EyeOff,
  SkipForward,
  MessageSquare,
  FileText,
  Volume2,
  VolumeX,
} from 'lucide-react';

const TalisharStyleGameSimulator = () => {
  // Game state
  const [gameState, setGameState] = useState({
    gameId: '838349',
    turn: 4,
    phase: 'main',
    currentPlayer: 'Dagg',
    players: {
      Dagg: {
        name: 'Dagg',
        life: 12,
        actionPoints: 1,
        hand: [],
        deck: { count: 26, cards: [] },
        field: [],
        graveyard: [],
        banish: [],
        arsenal: [],
        equipment: [],
        resources: [],
        effects: [],
      },
      ipMoo: {
        name: 'ipMoo',
        life: 0,
        actionPoints: 0,
        hand: [],
        deck: { count: 26, cards: [] },
        field: [],
        graveyard: [],
        banish: [],
        arsenal: [],
        equipment: [],
        resources: [],
        effects: [],
      },
    },
    stack: [],
    gameLog: [],
    waitingFor: 'Waiting for other player to choose a card to pitch',
    timer: '0:01',
    settings: {
      alwaysHoldPriority: false,
      alwaysPassPriority: false,
      showArena: true,
      autoPass: {
        attackReactions: false,
        defenseReactions: false,
        skipAttacks: false,
      },
    },
  });

  const [selectedCard, setSelectedCard] = useState(null);
  const [targetMode, setTargetMode] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [gameLogFilter, setGameLogFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  // Mock cards data
  const mockCards = [
    {
      id: 'smash_up_red',
      name: 'Smash Up',
      type: 'Attack Action',
      cost: 2,
      power: 4,
      defense: 3,
      image: 'https://images.talishar.net/public/cardsquares/english/smash_up_red.webp',
      text: 'When Smash Up hits, the defending hero discards a card.',
    },
    {
      id: 'critical_strike_red',
      name: 'Critical Strike',
      type: 'Attack Reaction',
      cost: 1,
      power: 3,
      defense: 2,
      image: 'https://images.talishar.net/public/cardsquares/english/critical_strike_red.webp',
      text: 'Target attack gains +1 power.',
    },
    {
      id: 'command_and_conquer',
      name: 'Command and Conquer',
      type: 'Defense Reaction',
      cost: 1,
      power: 0,
      defense: 3,
      image: 'https://images.talishar.net/public/cardsquares/english/command_and_conquer.webp',
      text: 'Prevent the next 2 damage that would be dealt to you.',
    },
    {
      id: 'anka_drag_under',
      name: 'Anka, Drag Under',
      type: 'Hero',
      cost: 0,
      power: 0,
      defense: 0,
      image: 'https://images.talishar.net/public/cardsquares/english/anka_drag_under_yellow.webp',
      text: 'Once per Turn Action: Target attack action card in your graveyard gains go again.',
    },
  ];

  // Initialize game with mock data
  useEffect(() => {
    const initialGameState = { ...gameState };
    
    // Set up Dagg's cards
    initialGameState.players.Dagg.hand = [
      { ...mockCards[0], id: 'smash_up_1', zone: 'hand' },
    ];
    initialGameState.players.Dagg.field = [
      { ...mockCards[3], id: 'anka_1', zone: 'field', counters: 3 },
    ];
    initialGameState.players.Dagg.equipment = [
      { id: 'crown_1', name: 'Crown of Dominion', image: 'https://images.talishar.net/public/cardsquares/english/crown_of_dominion.webp' },
    ];

    // Set up ipMoo's cards
    initialGameState.players.ipMoo.equipment = [
      { id: 'snapdragon_1', name: 'Snapdragon Scalers', image: 'https://images.talishar.net/public/cardsquares/english/snapdragon_scalers.webp' },
    ];
    initialGameState.players.ipMoo.resources = [
      { id: 'gold_1', name: 'Gold', image: 'https://images.talishar.net/public/cardsquares/english/gold.webp', count: 2 },
      { id: 'goldkiss_1', name: 'Goldkiss Rum', image: 'https://images.talishar.net/public/cardsquares/english/goldkiss_rum.webp' },
    ];

    // Game log
    initialGameState.gameLog = [
      { type: 'action', text: 'ipMoo deck was shuffled', icon: '🔄' },
      { type: 'play', text: 'ipMoo played Anka, Drag Under' },
      { type: 'pitch', text: 'ipMoo pitched Sawbones, Dock Hand' },
      { type: 'ability', text: 'Resolving play ability of Anka, Drag Under.' },
      { type: 'activate', text: 'ipMoo activated Dead Threads' },
      { type: 'ability', text: 'Resolving activated ability of Dead Threads.' },
      { type: 'activate', text: 'ipMoo activated Anka, Drag Under' },
      { type: 'choice', text: 'Attack was chosen.' },
      { type: 'target', text: '🎯 Scurv, Stowaway was chosen as the target.', icon: '🎯' },
      { type: 'ability', text: 'Resolving activated ability of Anka, Drag Under.' },
      { type: 'block', text: 'Dagg blocked with Command and Conquer' },
      { type: 'block', text: 'Dagg blocked with Critical Strike' },
      { type: 'pass', text: 'Dagg passed' },
      { type: 'pass', text: 'ipMoo passed' },
      { type: 'pass', text: 'Dagg passed' },
      { type: 'damage', text: 'Dagg took 0 damage from' },
      { type: 'combat', text: 'Combat resolved with no hit' },
      { type: 'chain', text: 'The chain link was closed.' },
      { type: 'pass', text: 'ipMoo passed' },
      { type: 'pass', text: 'ipMoo passed' },
      { type: 'combat', text: 'The combat chain was closed.' },
      { type: 'pass', text: 'ipMoo passed' },
      { type: 'turn', text: 'ipMoo passed priority. Attempting to end turn.' },
      { type: 'turn', text: "Dagg's turn 4 has begun." },
      { type: 'activate', text: 'Dagg activated Scurv, Stowaway' },
      { type: 'ability', text: 'Resolving activated ability of Scurv, Stowaway.' },
      { type: 'play', text: 'Dagg played Smash Up' },
      { type: 'target', text: '🎯 Anka, Drag Under was chosen as the target.' },
    ];

    setGameState(initialGameState);
  }, []);

  // Card component
  const GameCard = ({ card, zone, onClick, className = '', showCount = false }) => {
    const isCardBack = !card.name || zone === 'deck';
    
    return (
      <motion.div
        className={`relative cursor-pointer ${className}`}
        onClick={() => onClick && onClick(card)}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={isCardBack ? 'https://images.talishar.net/public/cardsquares/english/CardBack.webp' : card.image}
          alt={card.name || 'Card Back'}
          className="w-full h-full object-cover rounded border border-gray-600"
          onMouseEnter={() => !isCardBack && setShowCardDetail(card)}
          onMouseLeave={() => setShowCardDetail(null)}
        />
        {showCount && card.count && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {card.count}
          </div>
        )}
        {card.counters && card.counters > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {card.counters}
          </div>
        )}
        {card.targeted && (
          <div className="absolute inset-0 border-2 border-red-500 rounded bg-red-500 bg-opacity-20">
            <div className="absolute top-1 left-1 text-red-500 text-xs font-bold">Targeted</div>
          </div>
        )}
      </motion.div>
    );
  };

  // Player area component
  const PlayerArea = ({ player, isOpponent = false }) => {
    const playerData = gameState.players[player];
    
    return (
      <div className={`flex ${isOpponent ? 'flex-col' : 'flex-col-reverse'} gap-2`}>
        {/* Player name and life */}
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
          <span className="font-bold text-white">{playerData.name}</span>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-white font-bold">{playerData.life}</span>
          </div>
        </div>

        {/* Equipment */}
        <div className="flex gap-1">
          {playerData.equipment.map((equipment, index) => (
            <div key={equipment.id} className="w-12 h-16">
              <GameCard card={equipment} zone="equipment" />
            </div>
          ))}
        </div>

        {/* Field */}
        <div className="flex gap-1 min-h-16">
          {playerData.field.map((card, index) => (
            <div key={card.id} className="w-12 h-16">
              <GameCard card={card} zone="field" />
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="flex gap-1">
          {playerData.resources.map((resource, index) => (
            <div key={resource.id} className="w-12 h-16">
              <GameCard card={resource} zone="resources" showCount={true} />
            </div>
          ))}
        </div>

        {/* Hand (only for current player) */}
        {!isOpponent && (
          <div className="flex gap-1">
            {playerData.hand.map((card, index) => (
              <div key={card.id} className="w-12 h-16">
                <GameCard 
                  card={card} 
                  zone="hand" 
                  onClick={(card) => setSelectedCard(card)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Deck */}
        <div className="flex gap-1">
          <div className="w-12 h-16">
            <GameCard 
              card={{ count: playerData.deck.count }} 
              zone="deck" 
              showCount={true}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top UI Bar */}
      <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
            <RotateCcw className="w-4 h-4" />
            Undo
          </button>
          <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
            <Settings className="w-4 h-4" />
            Settings Menu
          </button>
          <button 
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setFullscreen(!fullscreen)}
          >
            <Maximize className="w-4 h-4" />
            Fullscreen
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
            Always Hold Priority
          </button>
          <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
            Always Pass Priority
          </button>
          <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
            Show Arena
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex">
        {/* Game Board */}
        <div className="flex-1 p-4 relative">
          {/* Opponent Area */}
          <div className="mb-8">
            <PlayerArea player="ipMoo" isOpponent={true} />
          </div>

          {/* Center Area - Combat/Stack */}
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gray-800 rounded-lg p-4 min-w-64">
              <div className="text-center">
                <div className="text-lg font-bold mb-2">{gameState.currentPlayer}'s Turn</div>
                <div className="text-sm text-gray-400">Turn #{gameState.turn}</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>{gameState.timer}</span>
                </div>
              </div>
              
              {/* Current action/card */}
              {selectedCard && (
                <div className="mt-4">
                  <div className="w-24 h-32 mx-auto">
                    <GameCard card={selectedCard} />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
                  Pass Attack Reactions
                </button>
                <button className="w-full px-3 py-2 bg-green-600 rounded hover:bg-green-700">
                  Pass Defense Reactions
                </button>
                <button className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700">
                  Skip Attacks
                </button>
              </div>
            </div>
          </div>

          {/* Current Player Area */}
          <div>
            <PlayerArea player="Dagg" isOpponent={false} />
          </div>

          {/* Waiting indicator */}
          <div className="absolute bottom-4 left-4 bg-yellow-600 text-black px-4 py-2 rounded">
            {gameState.waitingFor}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Active Layers */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Active Layers
            </h3>
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="font-medium">Anka, Drag Under</span>
              </div>
              <p className="text-sm text-gray-300">
                Priority settings can be adjusted in the menu
              </p>
            </div>
          </div>

          {/* Game Log */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2 mb-2">
                <button 
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'All' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('All')}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'Chat' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('Chat')}
                >
                  Chat
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'Log' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('Log')}
                >
                  Log
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {gameState.gameLog.map((entry, index) => (
                <div key={index} className="text-sm">
                  {entry.icon && <span className="mr-2">{entry.icon}</span>}
                  {entry.text.includes('ipMoo') && (
                    <span className="text-blue-400 font-medium">ipMoo</span>
                  )}
                  {entry.text.includes('Dagg') && (
                    <span className="text-red-400 font-medium">Dagg</span>
                  )}
                  <span className="text-gray-300">
                    {entry.text.replace(/ipMoo|Dagg/g, '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Detail Popup */}
      <AnimatePresence>
        {showCardDetail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-96 z-50 pointer-events-none"
          >
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-2xl max-w-xs">
              <img
                src={showCardDetail.image}
                alt={showCardDetail.name}
                className="w-full rounded mb-2"
              />
              <h3 className="font-bold text-white mb-1">{showCardDetail.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{showCardDetail.type}</p>
              {showCardDetail.text && (
                <p className="text-xs text-gray-400">{showCardDetail.text}</p>
              )}
              {showCardDetail.power !== undefined && (
                <div className="flex gap-4 mt-2 text-sm">
                  <span>Power: {showCardDetail.power}</span>
                  <span>Defense: {showCardDetail.defense}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TalisharStyleGameSimulator;