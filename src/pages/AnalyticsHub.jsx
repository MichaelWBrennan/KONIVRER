import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import MetaAnalysis from '../components/MetaAnalysis';

const AnalyticsHub = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold">Analytics Hub</h1>
            </div>
            <p className="text-secondary text-lg">
              Real-time meta analysis, market data, and competitive insights
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
          className="space-y-6"
        >
          {/* Meta Analysis */}
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-xl font-bold">
                  Meta Analysis & Market Data
                </h2>
                <p className="text-secondary">
                  Real-time competitive landscape insights
                </p>
              </div>
            </div>
            <MetaAnalysis />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsHub;