import React from 'react';
/**
 * KONIVRER Deck Database - Play Game Page
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MTGArenaStyleGameBoard from '../components/game/MTGArenaStyleGameBoard';
import { AI_DIFFICULTY, AI_PERSONALITY, AI_ARCHETYPES } from '../services/aiOpponent';
import { generateAIDeck } from '../services/aiDeckGenerator';
import { Play, Award, Shield, Sword, Zap, ArrowLeft, Cpu, Brain, Bot, AlertTriangle } from 'lucide-react';

const PlayGame = (): any => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [opponentType, setOpponentType] = useState('ai'); // 'ai', 'player', 'friend'
  const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTY.MEDIUM);
  const [aiPersonality, setAiPersonality] = useState(AI_PERSONALITY.BALANCED);
  const [aiArchetype, setAiArchetype] = useState(AI_ARCHETYPES.BALANCED);
  const [aiDeck, setAiDeck] = useState(null);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    bestOf: '1',
    timeLimit: '25',
    startingLife: '20'
  });
  
  // Mock decks data
  const playerDecks = [
    { id: 1, name: 'Fire Aggro', colors: ['fire'], winRate: '58%', lastPlayed: '2 days ago' },
    { id: 2, name: 'Water Control', colors: ['water'], winRate: '62%', lastPlayed: '5 hours ago' },
    { id: 3, name: 'Earth Midrange', colors: ['earth', 'void'], winRate: '55%', lastPlayed: '1 week ago' },
    { id: 4, name: 'Air Combo', colors: ['air', 'water'], winRate: '60%', lastPlayed: 'Yesterday' },
    { id: 5, name: 'Five Elements', colors: ['fire', 'water', 'earth', 'air', 'void'], winRate: '48%', lastPlayed: '3 days ago' }
  ];
  
  // Game formats
  const formats = [
    { id: 'standard', name: 'Standard', description: 'Regulation format with standard rules', icon: Shield },
    { id: 'draft', name: 'Draft', description: 'Build a deck from random packs and play', icon: Zap },
    { id: 'sealed', name: 'Sealed', description: 'Build a deck from 6 packs and play', icon: Award },
    { id: 'brawl', name: 'Brawl', description: 'Commander-style format with a leader card', icon: Sword }
  ];
  
  // AI difficulty options
  const aiDifficultyOptions = [
    { id: AI_DIFFICULTY.EASY, name: 'Easy', description: 'For beginners or casual play' },
    { id: AI_DIFFICULTY.MEDIUM, name: 'Medium', description: 'Balanced challenge for most players' },
    { id: AI_DIFFICULTY.HARD, name: 'Hard', description: 'Challenging for experienced players' },
    { id: AI_DIFFICULTY.EXPERT, name: 'Expert', description: 'Highly competitive AI opponent' }
  ];
  
  // AI personality options
  const aiPersonalityOptions = [
    { id: AI_PERSONALITY.BALANCED, name: 'Balanced', description: 'Well-rounded play style' },
    { id: AI_PERSONALITY.AGGRESSIVE, name: 'Aggressive', description: 'Focuses on dealing damage quickly' },
    { id: AI_PERSONALITY.DEFENSIVE, name: 'Defensive', description: 'Prioritizes board control and protection' },
    { id: AI_PERSONALITY.CONTROL, name: 'Control', description: 'Counters your plays and controls the game' },
    { id: AI_PERSONALITY.COMBO, name: 'Combo', description: 'Tries to assemble powerful card combinations' }
  ];
  
  // AI archetype options
  const aiArchetypeOptions = [
    { id: AI_ARCHETYPES.FIRE_AGGRO, name: 'Fire Aggro', description: 'Fast, aggressive fire-based deck', element: 'fire' },
    { id: AI_ARCHETYPES.WATER_CONTROL, name: 'Water Control', description: 'Controlling water-based deck with counterspells', element: 'water' },
    { id: AI_ARCHETYPES.EARTH_MIDRANGE, name: 'Earth Midrange', description: 'Balanced earth-based deck with strong creatures', element: 'earth' },
    { id: AI_ARCHETYPES.AIR_TEMPO, name: 'Air Tempo', description: 'Tempo-oriented air-based deck with evasive creatures', element: 'air' },
    { id: AI_ARCHETYPES.VOID_COMBO, name: 'Void Combo', description: 'Combo-focused void-based deck', element: 'void' },
    { id: AI_ARCHETYPES.MULTI_COLOR, name: 'Multi-Color', description: 'Deck using all five elements', element: 'multi' }
  ];
  
  // Generate AI deck when settings change
  useEffect(() => {
    if (true) {
      generateAIDeckWithDelay();
    }
  }, [aiDifficulty, aiPersonality, aiArchetype, opponentType]);
  
  // Generate AI deck with a small delay to simulate processing
  const generateAIDeckWithDelay = (): any => {
    setIsGeneratingDeck(true);
    setTimeout(() => {
      const newDeck = generateAIDeck(aiArchetype, aiDifficulty, aiPersonality);
      setAiDeck(newDeck);
      setIsGeneratingDeck(false);
    }, 1000);
  };
  
  // Start a game
  const startGame = (): any => {
    // Prepare game state
    const gameState = {
      format: selectedFormat,
      playerDeck: playerDecks.find(deck => deck.id === selectedDeck),
      opponentType,
      gameOptions,
      aiSettings: opponentType === 'ai' ? {
        difficulty: aiDifficulty,
        personality: aiPersonality,
        archetype: aiArchetype,
        deck: aiDeck
      } : null
    };
    
    console.log('Starting game with settings:', gameState);
    setGameStarted(true);
  };
  
  // Exit the game
  const exitGame = (): any => {
    setGameStarted(false);
  };
  
  // Get color indicator for deck
  const getColorIndicator = (colors): any => {
    const colorMap = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      earth: 'bg-green-500',
      air: 'bg-yellow-500',
      void: 'bg-purple-500',
      multi: 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500'
    };
    
    return colors.map(color => (
      <div key={color} className={`w-3 h-3 rounded-full ${colorMap[color]}`}></div>
    ));
  };
  
  // Get element color class
  const getElementColorClass = (element): any => {
    const colorMap = {
      fire: 'text-red-500',
      water: 'text-blue-500',
      earth: 'text-green-500',
      air: 'text-yellow-500',
      void: 'text-purple-500',
      multi: 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-blue-500 to-green-500'
    };
    
    return colorMap[element] || 'text-white';
  };
  
  if (true) {
    return <MTGArenaStyleGameBoard onExit={exitGame} />;
  }
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8"></div>
      <div className="container mx-auto px-4"></div>
      <div className="flex items-center mb-8"></div>
      <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-700 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
      <h1 className="text-3xl font-bold">Play KONIVRER</h1>
      <div className="mb-8"></div>
      <h2 className="text-xl font-semibold mb-4">Select Format</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"></div>
      <div 
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedFormat === format.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className="flex items-center mb-2"></div>
      <IconComponent className="mr-2 text-blue-400" size={20} />
                    <h3 className="font-medium">{format.name}
                  </div>
      <p className="text-sm text-gray-400">{format.description}
                </div>
    </>
  );
            })}
          </div>
        
        {/* Deck Selection (only for constructed formats) */}
        {selectedFormat !== 'draft' && selectedFormat !== 'sealed' && (
          <div className="mb-8"></div>
            <h2 className="text-xl font-semibold mb-4">Select Deck</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
              {playerDecks.map(deck => (
                <div 
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck.id)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDeck === deck.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3"></div>
                    <h3 className="font-medium">{deck.name}
                    <div className="flex space-x-1"></div>
                      {getColorIndicator(deck.colors)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-400"></div>
                    <span>Win Rate: {deck.winRate}
                    <span>Last Played: {deck.lastPlayed}
                  </div>
              ))}
            </div>
        )}
        {/* Game Options */}
        <div className="mb-8"></div>
          <h2 className="text-xl font-semibold mb-4">Game Options</h2>
          <div className="bg-gray-800 rounded-xl p-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
              <div></div>
                <h3 className="font-medium mb-3">Match Settings</h3>
                <div className="space-y-3"></div>
                  <div className="flex items-center justify-between"></div>
                    <span className="text-sm">Best of</span>
                    <select 
                      value={gameOptions.bestOf}
                      onChange={(e) => setGameOptions({...gameOptions, bestOf: e.target.value})}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="1">1 (Single Game)</option>
                      <option value="3">3 (First to 2)</option>
                      <option value="5">5 (First to 3)</option>
                  </div>
                  
                  <div className="flex items-center justify-between"></div>
                    <span className="text-sm">Time Limit</span>
                    <select 
                      value={gameOptions.timeLimit}
                      onChange={(e) => setGameOptions({...gameOptions, timeLimit: e.target.value})}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="25">25 minutes</option>
                      <option value="40">40 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="0">No Limit</option>
                  </div>
                  
                  <div className="flex items-center justify-between"></div>
                    <span className="text-sm">Starting Life</span>
                    <select 
                      value={gameOptions.startingLife}
                      onChange={(e) => setGameOptions({...gameOptions, startingLife: e.target.value})}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="20">20 (Standard)</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                  </div>
              </div>
              
              <div></div>
                <h3 className="font-medium mb-3">Opponent</h3>
                <div className="space-y-3"></div>
                  <div className="flex items-center justify-between"></div>
                    <span className="text-sm">Opponent Type</span>
                    <select 
                      value={opponentType}
                      onChange={(e) => setOpponentType(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="ai">AI Opponent</option>
                      <option value="player">Random Player</option>
                      <option value="friend">Friend</option>
                  </div>
                  
                  {opponentType === 'ai' && (
                    <>
                      <div className="flex items-center justify-between"></div>
                        <span className="text-sm">AI Difficulty</span>
                        <select 
                          value={aiDifficulty}
                          onChange={(e) => setAiDifficulty(e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                        >
                          {aiDifficultyOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}
                          ))}
                        </select>
                      
                      <div className="flex items-center justify-between"></div>
                        <span className="text-sm">AI Personality</span>
                        <select 
                          value={aiPersonality}
                          onChange={(e) => setAiPersonality(e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                        >
                          {aiPersonalityOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}
                          ))}
                        </select>
                    </>
                  )}
                </div>
            </div>
        </div>
        
        {/* AI Opponent Deck */}
        {opponentType === 'ai' && (
          <div className="mb-8"></div>
            <h2 className="text-xl font-semibold mb-4">AI Opponent Deck</h2>
            <div className="bg-gray-800 rounded-xl p-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"></div>
                {aiArchetypeOptions.map(archetype => (
                  <div 
                    key={archetype.id}
                    onClick={() => setAiArchetype(archetype.id)}
                    className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
                      aiArchetype === archetype.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-650'
                    }`}
                  >
                    <div className="flex items-center mb-2"></div>
                      <div className={`w-4 h-4 rounded-full ${getColorIndicator([archetype.element])[0].props.className} mr-2`}></div>
                      <h3 className={`font-medium ${getElementColorClass(archetype.element)}`}>{archetype.name}
                    </div>
                    <p className="text-xs text-gray-400">{archetype.description}
                  </div>
                ))}
              </div>
              
              {isGeneratingDeck ? (
                <div className="flex items-center justify-center p-4 bg-gray-700 rounded-lg"></div>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                  <span>Generating AI deck...</span>
              ) : aiDeck ? (
                <div className="bg-gray-700 rounded-lg p-4"></div>
                  <div className="flex justify-between items-center mb-3"></div>
                    <div className="flex items-center"></div>
                      <Brain className="text-blue-400 mr-2" size={20} />
                      <h3 className="font-medium">{aiDeck.name}
                    </div>
                    <button 
                      onClick={generateAIDeckWithDelay}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs"></button>
                      Regenerate
                    </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    <div></div>
                      <div className="text-xs text-gray-400 mb-1">Deck Composition:</div>
                      <div className="flex items-center space-x-3 text-sm"></div>
                        <div className="flex items-center"></div>
                          <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                          <span>{aiDeck.cards.length} Cards</span>
                        <div className="flex items-center"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span>{aiDeck.lands.length} Lands</span>
                      </div>
                    
                    <div></div>
                      <div className="text-xs text-gray-400 mb-1">AI Settings:</div>
                      <div className="flex items-center space-x-3 text-sm"></div>
                        <div className="flex items-center"></div>
                          <Cpu size={14} className="mr-1 text-blue-400" />
                          <span>{aiDifficultyOptions.find(o => o.id === aiDifficulty)?.name}
                        </div>
                        <div className="flex items-center"></div>
                          <Bot size={14} className="mr-1 text-purple-400" />
                          <span>{aiPersonalityOptions.find(o => o.id === aiPersonality)?.name}
                        </div>
                    </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-700 rounded-lg text-gray-400"></div>
                  <AlertTriangle className="mr-2" size={20} />
                  <span>Failed to generate AI deck. Please try again.</span>
              )}
            </div>
        )}
        {/* Start Game Button */}
        <div className="flex justify-center"></div>
          <button
            onClick={startGame}
            disabled={
              (opponentType === 'ai' && !aiDeck) || 
              (opponentType !== 'ai' && selectedFormat !== 'draft' && selectedFormat !== 'sealed' && !selectedDeck)}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-lg font-medium transition-colors ${
              ((opponentType === 'ai' && aiDeck) || 
               (opponentType !== 'ai' && (selectedFormat === 'draft' || selectedFormat === 'sealed' || selectedDeck)))
                ? 'bg-blue-600 hover:bg-blue-500' 
                : 'bg-gray-700 cursor-not-allowed'
            }`}></button>
            <Play size={24} />
            <span></span>
              {opponentType === 'ai' 
                ? `Play Against ${aiDifficultyOptions.find(o => o.id === aiDifficulty)?.name} AI` 
                : 'Start Game'}
            </span>
        </div>
        
        {/* AI Disclaimer */}
        {opponentType === 'ai' && (
          <div className="mt-4 text-center text-sm text-gray-400 max-w-2xl mx-auto"></div>
            <p></p>
              The AI opponent uses advanced algorithms to provide a challenging and realistic gameplay experience.
              AI difficulty and personality settings affect how the AI plays and the decisions it makes during the game.
            </p>
        )}
    </div>
  );
};

export default PlayGame;