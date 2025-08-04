import React, { useState, useEffect, useRef } from 'react';
import { CopilotSystem, CopilotConfig } from '../Copilot/src_copilot_index';
import { motion, AnimatePresence } from 'framer-motion';

interface CopilotIntegrationProps {
  gameState?: any;
  currentDeck?: any;
  playerProfile?: any;
  onAction?: (action: any) => void;
  config?: CopilotConfig;
}

interface CopilotMessage {
  id: string;
  type: 'info' | 'suggestion' | 'analysis' | 'error';
  content: string;
  timestamp: Date;
  confidence?: number;
}

export const CopilotIntegration: React.FC<CopilotIntegrationProps> = ({
  gameState,
  currentDeck,
  playerProfile,
  onAction,
  config = {},
}) => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [isThinking, setIsThinking] = useState(false);
  const copilotRef = useRef<CopilotSystem | null>(null);

  useEffect(() => {
    // Initialize Copilot system
    const initializeCopilot = async () => {
      try {
        copilotRef.current = new CopilotSystem({
          debugMode: true,
          adaptiveLearning: true,
          aiServicesEnabled: true,
          ...config,
        });

        await copilotRef.current.initialize();

        addMessage({
          type: 'info',
          content:
            '🚀 OpenHands AI-level Copilot initialized and ready to assist!',
          confidence: 1.0,
        });

        setIsActive(true);
      } catch (error) {
        console.error('Failed to initialize Copilot:', error);
        addMessage({
          type: 'error',
          content: '❌ Failed to initialize Copilot system',
          confidence: 0.0,
        });
      }
    };

    initializeCopilot();

    return () => {
      if (copilotRef.current) {
        copilotRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Update Copilot context when game state changes
    if (copilotRef.current && isActive) {
      const context = {
        gameState,
        currentDeck,
        playerProfile,
        timestamp: new Date(),
      };

      copilotRef.current.updateContext(context);

      // Trigger analysis if significant changes
      if (gameState || currentDeck) {
        handleAnalyzeRequest();
      }
    }
  }, [gameState, currentDeck, playerProfile, isActive]);

  const addMessage = (message: Omit<CopilotMessage, 'id' | 'timestamp'>) => {
    const newMessage: CopilotMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...message,
    };

    setMessages(prev => [...prev.slice(-9), newMessage]); // Keep last 10 messages
  };

  const handleOptimizeDeck = async () => {
    if (!copilotRef.current || !currentDeck) return;

    setIsThinking(true);
    try {
      copilotRef.current.addGoal({
        type: 'optimize_deck',
        description: 'Optimize current deck for better performance',
        priority: 9,
        status: 'pending',
        progress: 0,
      });

      await copilotRef.current.executeAction('optimize_deck', {
        deck: currentDeck,
      });

      addMessage({
        type: 'suggestion',
        content:
          '🎯 Deck optimization initiated. Analyzing synergies and performance...',
        confidence: 0.9,
      });

      // Simulate optimization results
      setTimeout(() => {
        addMessage({
          type: 'analysis',
          content:
            '✨ Optimization complete! Found 3 improvement opportunities: Better mana curve, increased synergy, and stronger late-game presence.',
          confidence: 0.85,
        });

        onAction?.({
          type: 'deck_optimized',
          suggestions: [
            'Add more 2-cost creatures for early game',
            'Include more card draw for consistency',
            'Consider stronger win conditions',
          ],
        });
      }, 2000);
    } catch (error) {
      addMessage({
        type: 'error',
        content: '❌ Deck optimization failed. Please try again.',
        confidence: 0.1,
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleAnalyzeRequest = async () => {
    if (!copilotRef.current) return;

    setIsThinking(true);
    try {
      await copilotRef.current.executeAction('analyze_game_state', {
        gameState,
        focus: 'strategic_analysis',
      });

      const phase =
        gameState?.turn <= 3 ? 'early' : gameState?.turn <= 7 ? 'mid' : 'late';
      const analysis = {
        early:
          '🌅 Early game: Focus on board presence and resource development',
        mid: '⚡ Mid game: Optimize positioning and prepare win conditions',
        late: '🎆 Late game: Execute win strategy and maintain advantage',
      };

      addMessage({
        type: 'analysis',
        content: analysis[phase] || '🤔 Analyzing current situation...',
        confidence: 0.8,
      });
    } catch (error) {
      addMessage({
        type: 'error',
        content: '❌ Analysis failed. Please try again.',
        confidence: 0.1,
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleStrategyAdvice = async () => {
    if (!copilotRef.current) return;

    setIsThinking(true);
    try {
      await copilotRef.current.executeAction('provide_strategy_advice', {
        gameState,
        playerLevel: playerProfile?.level || 'intermediate',
      });

      const advice = [
        "🎲 Consider your opponent's possible responses",
        '⚖️ Balance offense and defense appropriately',
        '📈 Plan for the next 2-3 turns ahead',
        '🎯 Focus on your win condition',
      ];

      const randomAdvice = advice[Math.floor(Math.random() * advice.length)];

      addMessage({
        type: 'suggestion',
        content: `💡 Strategic advice: ${randomAdvice}`,
        confidence: 0.75,
      });
    } catch (error) {
      addMessage({
        type: 'error',
        content: '❌ Strategy advice unavailable. Please try again.',
        confidence: 0.1,
      });
    } finally {
      setIsThinking(false);
    }
  };

  const updateMetrics = () => {
    if (copilotRef.current) {
      const newMetrics = copilotRef.current.getPerformanceMetrics();
      setMetrics(newMetrics);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: number = 0.5) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'info':
        return '💡';
      case 'suggestion':
        return '🎯';
      case 'analysis':
        return '🔍';
      case 'error':
        return '❌';
      default:
        return '🤖';
    }
  };

  return (
    <div className="copilot-integration bg-gray-900 border border-purple-500 rounded-lg p-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
          />
          <h3 className="text-lg font-bold text-white">OpenHands AI Copilot</h3>
        </div>
        <div className="text-xs text-gray-400">
          {metrics.actionsExecuted || 0} actions
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container h-48 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded-lg bg-gray-800 border-l-4 ${
                message.type === 'error'
                  ? 'border-red-500'
                  : message.type === 'suggestion'
                    ? 'border-blue-500'
                    : message.type === 'analysis'
                      ? 'border-green-500'
                      : 'border-purple-500'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg">{getMessageIcon(message.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-white">{message.content}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.confidence !== undefined && (
                      <span
                        className={`text-xs ${getConfidenceColor(message.confidence)}`}
                      >
                        {(message.confidence * 100).toFixed(0)}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-gray-800 border-l-4 border-yellow-500"
          >
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              <span className="text-sm text-white">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={handleOptimizeDeck}
          disabled={!isActive || !currentDeck || isThinking}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <span>🎯</span>
          <span>Optimize Deck</span>
        </button>

        <button
          onClick={handleAnalyzeRequest}
          disabled={!isActive || isThinking}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <span>🔍</span>
          <span>Analyze Situation</span>
        </button>

        <button
          onClick={handleStrategyAdvice}
          disabled={!isActive || isThinking}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <span>💡</span>
          <span>Get Strategy Advice</span>
        </button>
      </div>

      {/* Performance Metrics */}
      {metrics.actionsExecuted > 0 && (
        <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
          <div className="grid grid-cols-2 gap-2">
            <div>Actions: {metrics.actionsExecuted}</div>
            <div>Goals: {metrics.goalsCompleted}</div>
            <div>
              Confidence: {(metrics.averageConfidence * 100).toFixed(0)}%
            </div>
            <div>Errors: {metrics.errorRate}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopilotIntegration;
