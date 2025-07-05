/**
 * KONIVRER Deck Database - MTG Arena Style Game Board Component
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu
} from 'lucide-react';

const MTGArenaStyleGameBoard = ({ onExit }) => {
  // Game state
  const [gamePhase, setGamePhase] = useState('main1'); // main1, combat, main2, end
  const [turn, setTurn] = useState(1);
  const [activePlayer, setActivePlayer] = useState('player'); // player, opponent
  const [playerLife, setPlayerLife] = useState(20);
  const [opponentLife, setOpponentLife] = useState(20);
  const [playerMana, setPlayerMana] = useState({ fire: 3, water: 2, earth: 1, air: 2, void: 0 });
  const [opponentMana, setOpponentMana] = useState({ fire: 2, water: 3, earth: 2, air: 1, void: 0 });
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Opponent', message: 'Good luck, have fun!', time: '0:05' },
    { sender: 'You', message: 'You too!', time: '0:10' }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [playerHand, setPlayerHand] = useState([
    { id: 1, name: 'Flame Elemental', cost: { fire: 2 }, type: 'Creature', power: 3, toughness: 2, image: '/api/placeholder/200/280' },
    { id: 2, name: 'Counterspell', cost: { water: 2 }, type: 'Instant', image: '/api/placeholder/200/280' },
    { id: 3, name: 'Stone Wall', cost: { earth: 1, void: 1 }, type: 'Creature', power: 0, toughness: 5, image: '/api/placeholder/200/280' },
    { id: 4, name: 'Lightning Bolt', cost: { air: 1 }, type: 'Instant', image: '/api/placeholder/200/280' },
    { id: 5, name: 'Mystic Tutor', cost: { water: 1, void: 1 }, type: 'Sorcery', image: '/api/placeholder/200/280' }
  ]);
  const [playerBattlefield, setPlayerBattlefield] = useState([
    { id: 101, name: 'Fire Mage', type: 'Creature', power: 2, toughness: 1, tapped: false, image: '/api/placeholder/200/280' },
    { id: 102, name: 'Water Guardian', type: 'Creature', power: 1, toughness: 4, tapped: false, image: '/api/placeholder/200/280' }
  ]);
  const [opponentBattlefield, setOpponentBattlefield] = useState([
    { id: 201, name: 'Earth Golem', type: 'Creature', power: 3, toughness: 3, tapped: true, image: '/api/placeholder/200/280' }
  ]);
  const [opponentHandCount, setOpponentHandCount] = useState(4);
  const [playerDeckCount, setPlayerDeckCount] = useState(45);
  const [opponentDeckCount, setOpponentDeckCount] = useState(42);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const gameboardRef = useRef(null);
  const chatInputRef = useRef(null);
  
  // Timer effect
  useEffect(() => {
    if (activePlayer === 'player' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activePlayer, timeRemaining]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle phase change
  const nextPhase = () => {
    switch (gamePhase) {
      case 'main1':
        setGamePhase('combat');
        break;
      case 'combat':
        setGamePhase('main2');
        break;
      case 'main2':
        setGamePhase('end');
        break;
      case 'end':
        setGamePhase('main1');
        setActivePlayer(activePlayer === 'player' ? 'opponent' : 'player');
        if (activePlayer === 'opponent') {
          setTurn(turn + 1);
        }
        break;
      default:
        setGamePhase('main1');
    }
  };
  
  // Handle card play from hand
  const playCard = (cardId) => {
    const card = playerHand.find(c => c.id === cardId);
    if (card) {
      // Check if it's a creature or other permanent
      if (card.type === 'Creature' || card.type === 'Artifact' || card.type === 'Enchantment') {
        setPlayerBattlefield(prev => [...prev, {...card, tapped: false}]);
      }
      // Remove from hand
      setPlayerHand(prev => prev.filter(c => c.id !== cardId));
    }
  };
  
  // Handle card tap/untap
  const toggleCardTap = (cardId) => {
    setPlayerBattlefield(prev => 
      prev.map(card => 
        card.id === cardId 
          ? {...card, tapped: !card.tapped} 
          : card
      )
    );
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (gameboardRef.current.requestFullscreen) {
        gameboardRef.current.requestFullscreen();
      } else if (gameboardRef.current.webkitRequestFullscreen) {
        gameboardRef.current.webkitRequestFullscreen();
      } else if (gameboardRef.current.msRequestFullscreen) {
        gameboardRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // Handle chat message send
  const sendChatMessage = (e) => {
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
  const changeLife = (player, amount) => {
    if (player === 'player') {
      setPlayerLife(prev => Math.max(0, prev + amount));
    } else {
      setOpponentLife(prev => Math.max(0, prev + amount));
    }
  };
  
  // Zoom controls
  const adjustZoom = (delta) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(1.5, prev + delta)));
  };
  
  return (
    <div 
      ref={gameboardRef}
      className="fixed inset-0 bg-gray-900 text-white z-50 overflow-hidden flex flex-col"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
    >
      {/* Game Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Game Info */}
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm">{formatTime(timeRemaining)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Turn {turn}</span>
            <span className={`text-sm px-2 py-0.5 rounded ${activePlayer === 'player' ? 'bg-blue-600' : 'bg-red-600'}`}>
              {activePlayer === 'player' ? 'Your Turn' : 'Opponent Turn'}
            </span>
            <span className="text-sm px-2 py-0.5 rounded bg-purple-600">
              {gamePhase === 'main1' ? 'Main 1' : 
               gamePhase === 'combat' ? 'Combat' : 
               gamePhase === 'main2' ? 'Main 2' : 'End'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Controls */}
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-1.5 rounded-full ${showChat ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <MessageCircle size={18} />
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-full ${showSettings ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <Settings size={18} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button 
            onClick={onExit}
            className="p-1.5 rounded-full hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </header>
      
      {/* Game Board */}
      <div className="flex-1 relative overflow-hidden">
        {/* Opponent Area */}
        <div className="absolute top-0 left-0 right-0 h-[45%] px-4 py-2">
          <div className="flex justify-between items-start mb-2">
            {/* Opponent Info */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-2">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Opponent</span>
                  <div className="ml-3 flex items-center space-x-1">
                    <button 
                      onClick={() => changeLife('opponent', -1)}
                      className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{opponentLife}</span>
                    <button 
                      onClick={() => changeLife('opponent', 1)}
                      className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span>{opponentMana.fire}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span>{opponentMana.water}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>{opponentMana.earth}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>{opponentMana.air}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    <span>{opponentMana.void}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Opponent Hand */}
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <Hand size={16} className="mr-1 text-gray-400" />
                <span className="text-sm">{opponentHandCount}</span>
              </div>
              <div className="w-12 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="text-sm">{opponentDeckCount}</span>
              </div>
            </div>
          </div>
          
          {/* Opponent Battlefield */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {opponentBattlefield.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-16 h-22 rounded-lg overflow-hidden transition-transform ${card.tapped ? 'rotate-90' : ''}`}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate">
                    {card.name}
                  </div>
                  {card.type === 'Creature' && (
                    <div className="absolute top-0 right-0 bg-black/70 text-xs p-0.5 rounded-bl">
                      {card.power}/{card.toughness}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Center Area - Stack and Effects */}
        <div className="absolute top-[45%] left-0 right-0 h-[10%] flex items-center justify-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <button 
              onClick={nextPhase}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              {gamePhase === 'main1' ? 'To Combat' : 
               gamePhase === 'combat' ? 'To Main 2' : 
               gamePhase === 'main2' ? 'End Turn' : 'Next Turn'}
            </button>
          </div>
        </div>
        
        {/* Player Area */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] px-4 py-2">
          {/* Player Battlefield */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {playerBattlefield.map(card => (
                <div 
                  key={card.id}
                  className={`relative w-16 h-22 rounded-lg overflow-hidden transition-transform cursor-pointer ${card.tapped ? 'rotate-90' : ''} ${selectedCard === card.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => toggleCardTap(card.id)}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-0.5 text-center truncate">
                    {card.name}
                  </div>
                  {card.type === 'Creature' && (
                    <div className="absolute top-0 right-0 bg-black/70 text-xs p-0.5 rounded-bl">
                      {card.power}/{card.toughness}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            {/* Player Info */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">You</span>
                  <div className="ml-3 flex items-center space-x-1">
                    <button 
                      onClick={() => changeLife('player', -1)}
                      className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{playerLife}</span>
                    <button 
                      onClick={() => changeLife('player', 1)}
                      className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span>{playerMana.fire}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span>{playerMana.water}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>{playerMana.earth}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>{playerMana.air}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    <span>{playerMana.void}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Player Hand */}
            <div className="flex items-end">
              <div className="w-12 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center mr-3">
                <span className="text-sm">{playerDeckCount}</span>
              </div>
              <div className="flex -space-x-10 hover:space-x-0 transition-all">
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
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Preview */}
        <AnimatePresence>
          {hoveredCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="w-48 h-64 rounded-lg overflow-hidden">
                <img 
                  src={hoveredCard.image} 
                  alt={hoveredCard.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm rounded-lg p-1 flex flex-col">
          <button 
            onClick={() => adjustZoom(0.1)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Plus size={16} />
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
            <Minus size={16} />
          </button>
        </div>
      </div>
      
      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-12 bottom-0 w-80 bg-gray-800/90 backdrop-blur-sm border-l border-gray-700 flex flex-col"
          >
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Chat</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === 'You' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">{msg.sender}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={sendChatMessage} className="p-3 border-t border-gray-700">
              <div className="flex">
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
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute left-1/2 top-12 transform -translate-x-1/2 w-80 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg"
          >
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sound Effects</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Music</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Auto-Pass Priority</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Show Card Tooltips</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="pt-2 flex justify-center">
                <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-sm">
                  Concede Game
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MTGArenaStyleGameBoard;