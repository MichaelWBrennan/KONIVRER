import { motion } from 'framer-motion';
import { Users, Trophy, Bot } from 'lucide-react';
import BattlePass from './BattlePass';
import AIAssistant from '../components/AIAssistant';

const CommunityTools = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-pink-500" />
              <h1 className="text-4xl font-bold">Community & Tools</h1>
            </div>
            <p className="text-secondary text-lg">
              Battle pass progression, AI assistance, and community features
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Battle Pass */}
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <h2 className="text-xl font-bold">Battle Pass</h2>
                <p className="text-secondary">
                  Season 3: Elemental Convergence
                </p>
              </div>
            </div>
            <BattlePass />
          </div>

          {/* AI Assistant */}
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold">AI Assistant</h2>
                <p className="text-secondary">
                  Smart deck analysis and suggestions
                </p>
              </div>
            </div>
            <AIAssistant />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityTools;
