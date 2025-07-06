/**
 * AI Assistant Component
 * 
 * Provides AI-powered deck building assistance and suggestions.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Send,
  Loader,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: string;
  rarity: string;
  element?: string;
}

interface Suggestion {
  id: string;
  type: 'add' | 'remove' | 'replace';
  card: Card;
  reason: string;
  confidence: number;
  category: 'synergy' | 'curve' | 'meta' | 'balance';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  currentDeck?: Card[];
  onSuggestion?: (suggestion: Suggestion) => void;
  onClose?: () => void;
}

/**
 * AI Assistant Component
 */
const AIAssistant: React.FC<AIAssistantProps> = ({ 
  currentDeck = [], 
  onSuggestion,
  onClose 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI deck building assistant. I can help you optimize your deck, suggest cards, and answer questions about strategy.',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Analyze deck when it changes
  useEffect(() => {
    if (currentDeck.length > 0) {
      analyzeDeck();
    }
  }, [currentDeck]);

  const analyzeDeck = async (): Promise<void> => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'add',
        card: {
          id: 'lightning-bolt',
          name: 'Lightning Bolt',
          cost: 1,
          type: 'Spell',
          rarity: 'Common',
          element: 'Lightning',
        },
        reason: 'Your deck lacks low-cost removal. Lightning Bolt provides efficient early game control.',
        confidence: 85,
        category: 'balance',
      },
      {
        id: '2',
        type: 'add',
        card: {
          id: 'card-draw-engine',
          name: 'Mystic Scholar',
          cost: 3,
          type: 'Creature',
          rarity: 'Uncommon',
        },
        reason: 'Adding card draw will help maintain hand advantage in longer games.',
        confidence: 78,
        category: 'synergy',
      },
      {
        id: '3',
        type: 'replace',
        card: {
          id: 'efficient-creature',
          name: 'Storm Elemental',
          cost: 4,
          type: 'Creature',
          rarity: 'Rare',
          element: 'Air',
        },
        reason: 'This creature has better stats and synergy with your elemental theme.',
        confidence: 72,
        category: 'meta',
      },
    ];

    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!chatInput.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: generateAIResponse(chatInput),
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiResponse]);
    setIsSending(false);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      'That\'s a great question! Based on your current deck composition, I\'d recommend focusing on your mana curve.',
      'I see you\'re interested in that strategy. It could work well with your current elemental synergies.',
      'For that type of deck, you might want to consider adding more card draw or removal options.',
      'That\'s an interesting approach! Have you considered the meta implications of that choice?',
      'Based on current tournament data, that strategy has about a 65% win rate in similar deck archetypes.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleApplySuggestion = (suggestion: Suggestion): void => {
    if (onSuggestion) {
      onSuggestion(suggestion);
    }
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Great choice! I've suggested adding ${suggestion.card.name} to your deck.`,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, confirmationMessage]);
  };

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case 'synergy': return <Zap className="w-4 h-4" />;
      case 'curve': return <TrendingUp className="w-4 h-4" />;
      case 'meta': return <Target className="w-4 h-4" />;
      case 'balance': return <CheckCircle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (category: string): string => {
    switch (category) {
      case 'synergy': return 'text-purple-600 bg-purple-100';
      case 'curve': return 'text-blue-600 bg-blue-100';
      case 'meta': return 'text-green-600 bg-green-100';
      case 'balance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Deck Building Helper</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'suggestions' && (
          <div className="h-full flex flex-col">
            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="p-4 bg-blue-50 border-b">
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 animate-spin text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Analyzing Deck</p>
                    <p className="text-xs text-blue-700">Generating personalized suggestions...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {suggestions.length === 0 && !isAnalyzing && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No suggestions yet</p>
                  <p className="text-sm text-gray-500">Add cards to your deck to get AI recommendations</p>
                </div>
              )}

              <AnimatePresence>
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getSuggestionColor(suggestion.category)}`}>
                          {getSuggestionIcon(suggestion.category)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.card.name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {suggestion.type} • {suggestion.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {suggestion.confidence}%
                        </div>
                        <div className="text-xs text-gray-500">confidence</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{suggestion.card.cost} mana</span>
                        <span>•</span>
                        <span>{suggestion.card.type}</span>
                        <span>•</span>
                        <span>{suggestion.card.rarity}</span>
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        <span>Apply</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about your deck..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isSending}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Deck Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{currentDeck.length}</div>
                    <div className="text-sm text-gray-600">Total Cards</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {currentDeck.reduce((sum, card) => sum + card.cost, 0) / Math.max(currentDeck.length, 1)}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Cost</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Good mana curve</p>
                      <p className="text-xs text-green-700">Your deck has a balanced cost distribution</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Consider more removal</p>
                      <p className="text-xs text-yellow-700">Adding 2-3 removal spells could improve control</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Synergy potential</p>
                      <p className="text-xs text-blue-700">Your elemental theme has room for optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIAssistant;