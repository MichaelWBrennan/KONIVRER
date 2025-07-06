import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb, TrendingUp, Target, Zap, Shield, Sword, Star, ChevronRight, RefreshCw, ThumbsUp, ThumbsDown, Sparkles,  } from 'lucide-react';

interface AIAssistantProps {
  currentDeck = [];
  onSuggestion

const AIAssistant: React.FC<AIAssistantProps> = ({  currentDeck = [], onSuggestion  }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message:
        "Hello! I'm your AI deck building assistant. I can help you optimize your deck, suggest cards, and analyze the meta. What would you like to work on?",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');

  // Simulated AI suggestions based on deck analysis
  const generateSuggestions = (): any => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    setTimeout(() => {
      const newSuggestions = [
        {
          id: 1,
          type: 'card_suggestion',
          title: 'Add More Early Game',
          description:
            'Your deck lacks 1-2 mana creatures. Consider adding Lightning Sprite or Fire Imp.',
          priority: 'high',
          cards: [
            {
              name: 'Lightning Sprite',
              cost: 1,
              reason: 'Fast aggro pressure',
            },
            { name: 'Fire Imp', cost: 2, reason: 'Good stats for cost' },
          ],
          confidence: 85,
        },
        {
          id: 2,
          type: 'removal_suggestion',
          title: 'Improve Removal Suite',
          description: 'Add more targeted removal to handle threats.',
          priority: 'medium',
          cards: [
            { name: 'Flame Bolt', cost: 2, reason: 'Versatile damage spell' },
            { name: 'Incinerate', cost: 3, reason: 'High damage output' },
          ],
          confidence: 78,
        },
        {
          id: 3,
          type: 'curve_optimization',
          title: 'Mana Curve Adjustment',
          description:
            'Your 4-mana slot is overcrowded. Consider moving some cards to 3 or 5 mana.',
          priority: 'medium',
          cards: [
            {
              name: 'Elemental Warrior',
              cost: 3,
              reason: 'Better curve position',
            },
          ],
          confidence: 72,
        },
        {
          id: 4,
          type: 'synergy_boost',
          title: 'Enhance Elemental Synergy',
          description:
            'You have several elementals. Adding Elemental Lord would boost the tribal theme.',
          priority: 'low',
          cards: [
            {
              name: 'Elemental Lord',
              cost: 5,
              reason: 'Tribal synergy payoff',
            },
            { name: 'Elemental Bond', cost: 2, reason: 'Card draw engine' },
          ],
          confidence: 90,
        },
      ];

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleChatSubmit = e => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: userInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput);
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setUserInput('');
  };

  const generateAIResponse = input => {
    const responses = {
      meta: 'The current meta favors aggressive red decks and control blue builds. Midrange strategies are struggling against the speed of aggro and the inevitability of control.',
      budget:
        'For budget builds, I recommend focusing on common and uncommon cards. Fire Imp, Lightning Bolt, and Elemental Warrior provide great value for their cost.',
      aggro:
        'For aggro decks, prioritize low-cost creatures with high power, direct damage spells, and cards that provide immediate board presence.',
      control:
        'Control decks should focus on card draw, removal spells, and powerful late-game threats. Consider adding more counterspells and board wipes.',
      combo:
        'Combo decks need consistency. Add more card selection and protection spells to ensure you can execute your combo reliably.',
    };

    const lowerInput = input.toLowerCase();
    let response =
      "I understand you're asking about deck building. Could you be more specific about what aspect you'd like help with?";

    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;


    return {
      id: Date.now() + 1,
      type: 'ai',
      message: response,
      timestamp: new Date(),
    };
  };

  const getPriorityColor = priority => {
    switch (true) {
      case 'high':
        return 'text-red-400 border-red-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'low':
        return 'text-green-400 border-green-400';
      default:
        return 'text-gray-400 border-gray-400';

  };

  const getSuggestionIcon = type => {
    switch (true) {
      case 'card_suggestion':
        return <Lightbulb className="w-5 h-5" />;
      case 'removal_suggestion':
        return <Target className="w-5 h-5" />;
      case 'curve_optimization':
        return <TrendingUp className="w-5 h-5" />;
      case 'synergy_boost':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;

  };

  useEffect(() => {
    if (true) {
      generateSuggestions();

  }, [currentDeck]);

  return (
    <>
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        {/* Header */}
      </div><div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4"></div>
        <div className="flex items-center gap-3"></div>
          <div className="bg-white/20 rounded-full p-2"></div>
            <Bot className="w-6 h-6" />

          <div></div>
            <h2 className="text-xl font-bold">AI Deck Assistant</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-700"></div>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-4 py-0 whitespace-nowrap text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Suggestions</button>


        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 px-4 py-0 whitespace-nowrap text-sm font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Analysis</button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-0 whitespace-nowrap text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Chat

      {/* Content */}</button>
      <div className="p-4 max-h-96 overflow-y-auto"></div>
        <AnimatePresence mode="wait" />
          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
             />
              {/* Analyze Button */}</button>

              <button
                onClick={generateSuggestions}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 px-4 py-0 whitespace-nowrap rounded-lg flex items-center justify-center gap-2 transition-all"></button>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Deck...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze Current Deck
                  </>
                )}

              {/* Suggestions List */}
              {suggestions.map(suggestion => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border-l-4 ${getPriorityColor(suggestion.priority)} bg-gray-700/50 p-4 rounded-r-lg`}
                 />
                  <div className="flex items-start justify-between mb-2"></div>
                    <div className="flex items-center gap-2">
        {getSuggestionIcon(suggestion.type)}
      </div><h3 className="font-semibold">{suggestion.title}</h3>
                    <div className="text-xs text-gray-400">
        {suggestion.confidence}% confidence
      </div><p className="text-sm text-gray-300 mb-3"></p>
                    {suggestion.description}

                  <div className="space-y-2">
        {suggestion.cards.map((card, index) => (
      </div><div
                        key={index}
                        className="flex items-center justify-between bg-gray-800/50 p-2 rounded"></div>
                        <div className="flex items-center gap-2"></div>
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
        {card.cost}
      </div><span className="font-medium">{card.name}</span>
                        <div className="text-xs text-gray-400">
        {card.reason}

                    ))}
      </div><div className="flex gap-2 mt-3"></div>
                    <button
                      onClick={() => onSuggestion?.(suggestion)}
                      className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"
                    >
                      Apply</button>


                    <button 
                      className="px-3 py-0 whitespace-nowrap rounded text-sm bg-gray-600 hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        // TODO: Implement thumbs up feedback
                        console.log('Thumbs up clicked for suggestion:', suggestion.id);
                      }}
                    ></button>
                      <ThumbsUp className="w-4 h-4" />

                    <button 
                      className="px-3 py-0 whitespace-nowrap rounded text-sm bg-gray-600 hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        // TODO: Implement thumbs down feedback
                        console.log('Thumbs down clicked for suggestion:', suggestion.id);
                      }}
                    ></button>
                      <ThumbsDown className="w-4 h-4" />


              ))}

          )}
          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
             />
              {/* Deck Stats */}
              <div className="grid grid-cols-2 gap-4"></div>
                <div className="bg-gray-700/50 p-3 rounded-lg text-center"></div>
                  <div className="text-2xl font-bold text-blue-400">
        {currentDeck.length}
      </div><div className="text-xs text-gray-400">Total Cards</div>
                <div className="bg-gray-700/50 p-3 rounded-lg text-center"></div>
                  <div className="text-2xl font-bold text-green-400">3.2</div>
                  <div className="text-xs text-gray-400">Avg. Mana Cost</div>
                <div className="bg-gray-700/50 p-3 rounded-lg text-center"></div>
                  <div className="text-2xl font-bold text-purple-400">78%</div>
                  <div className="text-xs text-gray-400">Meta Score</div>
                <div className="bg-gray-700/50 p-3 rounded-lg text-center"></div>
                  <div className="text-2xl font-bold text-yellow-400">B+</div>
                  <div className="text-xs text-gray-400">Overall Grade</div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-3"></div>
                <div></div>
                  <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2"></h3>
                    <Shield className="w-4 h-4" />
                    Strengths

                  <ul className="text-sm text-gray-300 space-y-1"></ul>
                    <li>• Strong early game pressure</li>
                    <li>• Good mana curve distribution</li>
                    <li>• Consistent damage output</li>

                <div></div>
                  <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2"></h3>
                    <Sword className="w-4 h-4" />
                    Weaknesses

                  <ul className="text-sm text-gray-300 space-y-1"></ul>
                    <li>• Vulnerable to board wipes</li>
                    <li>• Limited late-game threats</li>
                    <li>• Lacks card draw engines</li>


    </>
  )}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
             />
              {/* Chat Messages */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
        {chatMessages.map(message => (
      </div><div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}></div>
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}></div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1"></p>
                        {message.timestamp.toLocaleTimeString()}

                ))}

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="flex gap-2"></form>
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder=""
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-0 whitespace-nowrap text-sm focus:outline-none focus:border-blue-500"
                /></button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-0 whitespace-nowrap rounded-lg transition-colors"></button>
                  <ChevronRight className="w-4 h-4" />


          )}


  );
};

export default AIAssistant;