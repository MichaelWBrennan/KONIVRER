/**
 * KONIVRER Deck Database - Play Game Page
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MTGArenaStyleGameBoard from '../components/game/MTGArenaStyleGameBoard';
import { 
  Play, 
  Users, 
  Award, 
  Clock, 
  Shield, 
  Sword, 
  Zap, 
  ArrowLeft 
} from 'lucide-react';

const PlayGame = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [selectedDeck, setSelectedDeck] = useState(null);
  
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
  
  // Start a game
  const startGame = () => {
    setGameStarted(true);
  };
  
  // Exit the game
  const exitGame = () => {
    setGameStarted(false);
  };
  
  // Get color indicator for deck
  const getColorIndicator = (colors) => {
    const colorMap = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      earth: 'bg-green-500',
      air: 'bg-yellow-500',
      void: 'bg-purple-500'
    };
    
    return colors.map(color => (
      <div key={color} className={`w-3 h-3 rounded-full ${colorMap[color]}`}></div>
    ));
  };
  
  if (gameStarted) {
    return <MTGArenaStyleGameBoard onExit={exitGame} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-700 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">Play KONIVRER</h1>
        </div>
        
        {/* Game Formats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {formats.map(format => {
              const IconComponent = format.icon;
              return (
                <div 
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedFormat === format.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="mr-2 text-blue-400" size={20} />
                    <h3 className="font-medium">{format.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{format.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Deck Selection (only for constructed formats) */}
        {selectedFormat !== 'draft' && selectedFormat !== 'sealed' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Deck</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {playerDecks.map(deck => (
                <div 
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck.id)}
                  className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDeck === deck.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{deck.name}</h3>
                    <div className="flex space-x-1">
                      {getColorIndicator(deck.colors)}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Win Rate: {deck.winRate}</span>
                    <span>Last Played: {deck.lastPlayed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Game Options */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Game Options</h2>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Match Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Best of</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                      <option value="1">1 (Single Game)</option>
                      <option value="3">3 (First to 2)</option>
                      <option value="5">5 (First to 3)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Limit</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                      <option value="25">25 minutes</option>
                      <option value="40">40 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="0">No Limit</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Starting Life</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                      <option value="20">20 (Standard)</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Opponent</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opponent Type</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                      <option value="ai">AI Opponent</option>
                      <option value="player">Random Player</option>
                      <option value="friend">Friend</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Difficulty</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Start Game Button */}
        <div className="flex justify-center">
          <button
            onClick={startGame}
            disabled={selectedFormat !== 'draft' && selectedFormat !== 'sealed' && !selectedDeck}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-lg font-medium transition-colors ${
              (selectedFormat === 'draft' || selectedFormat === 'sealed' || selectedDeck) 
                ? 'bg-blue-600 hover:bg-blue-500' 
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            <Play size={24} />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayGame;