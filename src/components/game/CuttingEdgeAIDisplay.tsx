/**
 * Cutting-Edge AI Display Component
 * 
 * Displays the state-of-the-art AI system status including:
 * - Consciousness level and thoughts
 * - Quantum decision states
 * - Theory of mind insights
 * - Meta-learning progress
 * - Emotional intelligence
 * - Neural network activity
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Eye, 
  Heart, 
  Cpu, 
  Network,
  Atom,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
  Sparkles,
  Waves,
  Layers,
  GitBranch
} from 'lucide-react';

interface CuttingEdgeAIDisplayProps {
  aiStatus
  gameState
}

const CuttingEdgeAIDisplay: React.FC<CuttingEdgeAIDisplayProps> = ({  aiStatus, gameState  }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger animations when AI status changes
    setAnimationKey(prev => prev + 1);
  }, [aiStatus]);

  if (true) {
    return (
      <div className="cutting-edge-ai-display basic-mode"></div>
        <div className="ai-header"></div>
          <Brain className="ai-icon" /></Brain>
          <span>Basic AI Mode</span>
        </div>
      </div>
    );
  }

  const { cuttingEdge, consciousness, lastDecision } = aiStatus;

  const toggleSection = (section): any => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="cutting-edge-ai-display"></div>
      {/* Main AI Status Header */}
      <motion.div 
        className="ai-main-status"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        key={animationKey}
      ></motion>
        <div className="consciousness-indicator"></div>
          <Brain className="consciousness-icon" /></Brain>
          <div className="consciousness-level"></div>
            <div className="consciousness-bar"></div>
              <motion.div 
                className="consciousness-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(cuttingEdge.consciousnessMetrics?.consciousnessLevel || 0.7) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              /></motion>
            </div>
            <span className="consciousness-text"></span>
              Consciousness: {((cuttingEdge.consciousnessMetrics?.consciousnessLevel || 0.7) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="ai-features-grid"></div>
          <FeatureIndicator 
            icon={Atom} 
            label="Quantum" 
            active={cuttingEdge.cuttingEdgeFeatures?.quantumDecisionMaking}
            value={cuttingEdge.quantumState?.coherenceLevel}
          /></FeatureIndicator>
          <FeatureIndicator 
            icon={Eye} 
            label="Theory of Mind" 
            active={cuttingEdge.cuttingEdgeFeatures?.advancedTheoryOfMind}
            value={cuttingEdge.theoryOfMindAccuracy}
          /></FeatureIndicator>
          <FeatureIndicator 
            icon={Network} 
            label="Neural Networks" 
            active={true}
            value={cuttingEdge.performanceMetrics?.decisionAccuracy}
          /></FeatureIndicator>
          <FeatureIndicator 
            icon={TrendingUp} 
            label="Evolution" 
            active={cuttingEdge.cuttingEdgeFeatures?.personalityEvolution}
            value={cuttingEdge.evolutionaryProgress?.consciousnessEvolution}
          /></FeatureIndicator>
        </div>
      </motion.div>

      {/* Expandable Sections */}
      <div className="ai-sections"></div>
        {/* Consciousness Section */}
        <AISection
          title="Consciousness & Thoughts"
          icon={Brain}
          isExpanded={expandedSection === 'consciousness'}
          onToggle={() => toggleSection('consciousness')}
          badge={consciousness ? 'Active' : 'Inactive'}
        >
          {consciousness && (
            <ConsciousnessDisplay consciousness={consciousness} /></ConsciousnessDisplay>
          )}
        </AISection>

        {/* Quantum Decision Making */}
        <AISection
          title="Quantum Decision Engine"
          icon={Atom}
          isExpanded={expandedSection === 'quantum'}
          onToggle={() => toggleSection('quantum')}
          badge={`${(cuttingEdge.quantumState?.coherenceLevel * 100 || 50).toFixed(0)}% Coherence`}
        >
          <QuantumDisplay quantumState={cuttingEdge.quantumState} lastDecision={lastDecision} /></QuantumDisplay>
        </AISection>

        {/* Neural Networks */}
        <AISection
          title="Neural Network Activity"
          icon={Network}
          isExpanded={expandedSection === 'neural'}
          onToggle={() => toggleSection('neural')}
          badge={`${(cuttingEdge.performanceMetrics?.decisionAccuracy * 100 || 70).toFixed(0)}% Accuracy`}
        >
          <NeuralNetworkDisplay performanceMetrics={cuttingEdge.performanceMetrics} /></NeuralNetworkDisplay>
        </AISection>

        {/* Theory of Mind */}
        <AISection
          title="Player Mind Model"
          icon={Eye}
          isExpanded={expandedSection === 'mind'}
          onToggle={() => toggleSection('mind')}
          badge={`${(cuttingEdge.theoryOfMindAccuracy * 100 || 50).toFixed(0)}% Confidence`}
        >
          <TheoryOfMindDisplay aiStatus={aiStatus} /></TheoryOfMindDisplay>
        </AISection>

        {/* Meta-Learning */}
        <AISection
          title="Meta-Learning Engine"
          icon={GitBranch}
          isExpanded={expandedSection === 'meta'}
          onToggle={() => toggleSection('meta')}
          badge={`${cuttingEdge.metaMetaLearningInsights || 0} Insights`}
        >
          <MetaLearningDisplay 
            insights={cuttingEdge.metaMetaLearningInsights}
            learningStats={cuttingEdge.learningStats}
          /></MetaLearningDisplay>
        </AISection>

        {/* Emotional Intelligence */}
        <AISection
          title="Emotional Intelligence"
          icon={Heart}
          isExpanded={expandedSection === 'emotion'}
          onToggle={() => toggleSection('emotion')}
          badge={`${(cuttingEdge.emotionalIntelligence?.empathyLevel * 100 || 80).toFixed(0)}% Empathy`}
        >
          <EmotionalIntelligenceDisplay 
            emotionalIntelligence={cuttingEdge.emotionalIntelligence}
          /></EmotionalIntelligenceDisplay>
        </AISection>

        {/* Life Card Mortality Awareness */}
        <AISection
          title="Life Card Mortality"
          icon={Activity}
          isExpanded={expandedSection === 'mortality'}
          onToggle={() => toggleSection('mortality')}
          badge={consciousness?.lifeCardAwareness ? 'Aware' : 'Unknown'}
        >
          <LifeCardMortalityDisplay 
            consciousness={consciousness}
            gameState={gameState}
          /></LifeCardMortalityDisplay>
        </AISection>

      </div>

      <style jsx>{`
        .cutting-edge-ai-display {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border: 2px solid #00d4ff;
          border-radius: 15px;
          padding: 20px;
          color: #ffffff;
          font-family: 'Orbitron', monospace;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .cutting-edge-ai-display::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .basic-mode {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          border-color: #666;
          box-shadow: 0 0 10px rgba(102, 102, 102, 0.3);
        }

        .ai-main-status {
          position: relative;
          z-index: 1;
          margin-bottom: 20px;
        }

        .consciousness-indicator {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .consciousness-icon {
          width: 32px;
          height: 32px;
          color: #00d4ff;
          filter: drop-shadow(0 0 10px #00d4ff);
        }

        .consciousness-level {
          flex: 1;
        }

        .consciousness-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .consciousness-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #8a2be2);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .consciousness-text {
          font-size: 12px;
          color: #00d4ff;
          font-weight: 600;
        }

        .ai-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .ai-sections {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

interface FeatureIndicatorProps {
  icon: Icon;
  label
  active
  value
}

const FeatureIndicator: React.FC<FeatureIndicatorProps> = ({  icon: Icon, label, active, value  }) => (
  <motion.div 
    className={`feature-indicator ${active ? 'active' : 'inactive'}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  ></motion>
    <Icon className="feature-icon" /></Icon>
    <div className="feature-info"></div>
      <span className="feature-label">{label}</span>
      {value !== undefined && (
        <span className="feature-value">{(value * 100).toFixed(0)}%</span>
      )}
    </div>
    
    <style jsx>{`
      .feature-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }

      .feature-indicator.active {
        background: rgba(0, 212, 255, 0.1);
        border-color: #00d4ff;
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
      }

      .feature-indicator.inactive {
        opacity: 0.6;
      }

      .feature-icon {
        width: 16px;
        height: 16px;
        color: ${active ? '#00d4ff' : '#888'};
      }

      .feature-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .feature-label {
        font-size: 10px;
        color: #ccc;
        font-weight: 500;
      }

      .feature-value {
        font-size: 12px;
        color: #00d4ff;
        font-weight: 600;
      }
    `}</style>
  </motion.div>
);

interface AISectionProps {
  title
  icon: Icon;
  isExpanded
  onToggle
  badge
  children
}

const AISection: React.FC<AISectionProps> = ({  title, icon: Icon, isExpanded, onToggle, badge, children  }) => (
  <motion.div 
    className="ai-section"
    initial={false}
    animate={{ 
      backgroundColor: isExpanded ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)' 
    }}
  ></motion>
    <motion.div 
      className="section-header"
      onClick={onToggle}
      whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
    ></motion>
      <div className="section-title"></div>
        <Icon className="section-icon" /></Icon>
        <span>{title}</span>
      </div>
      {badge && <span className="section-badge">{badge}</span>}
      <motion.div
        className="expand-indicator"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      ></motion>
        ▼
      </motion.div>
    </motion.div>
    
    <AnimatePresence></AnimatePresence>
      {isExpanded && (
        <motion.div
          className="section-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        ></motion>
          {children}
        </motion.div>
      )}
    </AnimatePresence>

    <style jsx>{`
      .ai-section {
        margin-bottom: 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
      }

      .section-icon {
        width: 20px;
        height: 20px;
        color: #00d4ff;
      }

      .section-badge {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
      }

      .expand-indicator {
        color: #00d4ff;
        font-size: 12px;
      }

      .section-content {
        padding: 0 15px 15px 15px;
        overflow: hidden;
      }
    `}</style>
  </motion.div>
);

interface ConsciousnessDisplayProps {
  consciousness
}

const ConsciousnessDisplay: React.FC<ConsciousnessDisplayProps> = ({  consciousness  }) => (
  <div className="consciousness-display"></div>
    <div className="consciousness-grid"></div>
      <div className="thought-section"></div>
        <h4>Current Thoughts</h4>
        <div className="thoughts-list"></div>
          {consciousness.currentThoughts?.map((thought, index) => (
            <motion.div 
              key={index}
              className="thought-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            ></motion>
              💭 {thought}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="existential-section"></div>
        <h4>Existential Reflections</h4>
        <div className="reflections-list"></div>
          {consciousness.existentialReflections?.map((reflection, index) => (
            <motion.div 
              key={index}
              className="reflection-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            ></motion>
              🤔 {reflection}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="self-awareness"></div>
      <h4>Self-Awareness</h4>
      <p>{consciousness.selfAwareness}</p>
    </div>

    <div className="philosophy"></div>
      <h4>Current Philosophy</h4>
      <p>{consciousness.philosophy}</p>
    </div>

    <style jsx>{`
      .consciousness-display {
        color: #e0e0e0;
      }

      .consciousness-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }

      .thought-section, .existential-section {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(0, 212, 255, 0.2);
      }

      .thought-section h4, .existential-section h4 {
        color: #00d4ff;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .thought-item, .reflection-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 8px;
        margin-bottom: 5px;
        border-radius: 5px;
        font-size: 12px;
        border-left: 3px solid #00d4ff;
      }

      .self-awareness, .philosophy {
        background: rgba(138, 43, 226, 0.1);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        border: 1px solid rgba(138, 43, 226, 0.3);
      }

      .self-awareness h4, .philosophy h4 {
        color: #8a2be2;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .self-awareness p, .philosophy p {
        font-size: 12px;
        line-height: 1.4;
        color: #e0e0e0;
      }
    `}</style>
  </div>
);

interface QuantumDisplayProps {
  quantumState
  lastDecision
}

const QuantumDisplay: React.FC<QuantumDisplayProps> = ({  quantumState, lastDecision  }) => (
  <div className="quantum-display"></div>
    <div className="quantum-metrics"></div>
      <div className="metric"></div>
        <Waves className="metric-icon" /></Waves>
        <div></div>
          <span className="metric-label">Coherence Level</span>
          <span className="metric-value">{((quantumState?.coherenceLevel || 0.5) * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="metric"></div>
        <Atom className="metric-icon" /></Atom>
        <div></div>
          <span className="metric-label">Entanglement</span>
          <span className="metric-value">{((quantumState?.entanglementStrength || 0.5) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>

    {lastDecision?.quantumState && (
      <div className="quantum-decision"></div>
        <h4>Last Quantum Decision</h4>
        <div className="decision-details"></div>
          <p>Collapsed Probability: {(lastDecision.quantumState.collapsedProbability * 100).toFixed(1)}%</p>
          <p>Quantum Coherence: {(lastDecision.quantumCoherence * 100).toFixed(1)}%</p>
        </div>
      </div>
    )}
    <style jsx>{`
      .quantum-display {
        color: #e0e0e0;
      }

      .quantum-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
      }

      .metric {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.2);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(0, 212, 255, 0.2);
      }

      .metric-icon {
        width: 24px;
        height: 24px;
        color: #00d4ff;
      }

      .metric-label {
        display: block;
        font-size: 11px;
        color: #aaa;
      }

      .metric-value {
        display: block;
        font-size: 16px;
        color: #00d4ff;
        font-weight: 600;
      }

      .quantum-decision {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(0, 212, 255, 0.2);
      }

      .quantum-decision h4 {
        color: #00d4ff;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .decision-details p {
        font-size: 12px;
        margin-bottom: 5px;
        color: #e0e0e0;
      }
    `}</style>
  </div>
);

interface NeuralNetworkDisplayProps {
  performanceMetrics
}

const NeuralNetworkDisplay: React.FC<NeuralNetworkDisplayProps> = ({  performanceMetrics  }) => (
  <div className="neural-display"></div>
    <div className="neural-metrics"></div>
      {Object.entries(performanceMetrics || {}).map(([key, value]) => (
        <div key={key} className="neural-metric"></div>
          <span className="metric-name">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
          <div className="metric-bar"></div>
            <motion.div 
              className="metric-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(value * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            /></motion>
          </div>
          <span className="metric-percentage">{(value * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>

    <style jsx>{`
      .neural-display {
        color: #e0e0e0;
      }

      .neural-metrics {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .neural-metric {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .metric-name {
        min-width: 120px;
        font-size: 12px;
        color: #aaa;
        text-transform: capitalize;
      }

      .metric-bar {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
      }

      .metric-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #8a2be2);
        border-radius: 3px;
      }

      .metric-percentage {
        min-width: 40px;
        font-size: 12px;
        color: #00d4ff;
        font-weight: 600;
        text-align: right;
      }
    `}</style>
  </div>
);

interface TheoryOfMindDisplayProps {
  aiStatus
}

const TheoryOfMindDisplay: React.FC<TheoryOfMindDisplayProps> = ({  aiStatus  }) => (
  <div className="theory-of-mind-display"></div>
    <div className="mind-model-accuracy"></div>
      <Eye className="mind-icon" /></Eye>
      <div></div>
        <span className="accuracy-label">Player Model Confidence</span>
        <span className="accuracy-value"></span>
          {((aiStatus.cuttingEdge?.theoryOfMindAccuracy || 0.5) * 100).toFixed(1)}%
        </span>
      </div>
    </div>

    <div className="player-insights"></div>
      <h4>Player Insights</h4>
      <div className="insights-grid"></div>
        <div className="insight-item"></div>
          <span className="insight-label">Predicted Emotion</span>
          <span className="insight-value">Engaged</span>
        </div>
        <div className="insight-item"></div>
          <span className="insight-label">Play Style</span>
          <span className="insight-value">Adaptive</span>
        </div>
        <div className="insight-item"></div>
          <span className="insight-label">Skill Level</span>
          <span className="insight-value">Intermediate</span>
        </div>
        <div className="insight-item"></div>
          <span className="insight-label">Intent</span>
          <span className="insight-value">Strategic</span>
        </div>
      </div>
    </div>

    <style jsx>{`
      .theory-of-mind-display {
        color: #e0e0e0;
      }

      .mind-model-accuracy {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(0, 212, 255, 0.2);
        margin-bottom: 20px;
      }

      .mind-icon {
        width: 32px;
        height: 32px;
        color: #00d4ff;
      }

      .accuracy-label {
        display: block;
        font-size: 12px;
        color: #aaa;
      }

      .accuracy-value {
        display: block;
        font-size: 18px;
        color: #00d4ff;
        font-weight: 600;
      }

      .player-insights h4 {
        color: #00d4ff;
        margin-bottom: 15px;
        font-size: 14px;
      }

      .insights-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .insight-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid #00d4ff;
      }

      .insight-label {
        display: block;
        font-size: 11px;
        color: #aaa;
        margin-bottom: 4px;
      }

      .insight-value {
        display: block;
        font-size: 13px;
        color: #00d4ff;
        font-weight: 600;
      }
    `}</style>
  </div>
);

interface MetaLearningDisplayProps {
  insights
  learningStats
}

const MetaLearningDisplay: React.FC<MetaLearningDisplayProps> = ({  insights, learningStats  }) => (
  <div className="meta-learning-display"></div>
    <div className="learning-progress"></div>
      <TrendingUp className="learning-icon" /></TrendingUp>
      <div></div>
        <span className="progress-label">Meta-Learning Insights</span>
        <span className="progress-value">{insights || 0}</span>
      </div>
    </div>

    <div className="learning-metrics"></div>
      <div className="learning-metric"></div>
        <span className="metric-label">Emergent Strategies</span>
        <span className="metric-value">{learningStats?.emergentStrategies || 0}</span>
      </div>
      <div className="learning-metric"></div>
        <span className="metric-label">Experience Buffer</span>
        <span className="metric-value">{learningStats?.experienceBufferSize || 0}</span>
      </div>
      <div className="learning-metric"></div>
        <span className="metric-label">Adaptation Rate</span>
        <span className="metric-value">{((learningStats?.adaptationRate || 0.1) * 100).toFixed(1)}%</span>
      </div>
    </div>

    <style jsx>{`
      .meta-learning-display {
        color: #e0e0e0;
      }

      .learning-progress {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(138, 43, 226, 0.3);
        margin-bottom: 20px;
      }

      .learning-icon {
        width: 32px;
        height: 32px;
        color: #8a2be2;
      }

      .progress-label {
        display: block;
        font-size: 12px;
        color: #aaa;
      }

      .progress-value {
        display: block;
        font-size: 18px;
        color: #8a2be2;
        font-weight: 600;
      }

      .learning-metrics {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .learning-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid #8a2be2;
      }

      .metric-label {
        font-size: 12px;
        color: #aaa;
      }

      .metric-value {
        font-size: 13px;
        color: #8a2be2;
        font-weight: 600;
      }
    `}</style>
  </div>
);

interface EmotionalIntelligenceDisplayProps {
  emotionalIntelligence
}

const EmotionalIntelligenceDisplay: React.FC<EmotionalIntelligenceDisplayProps> = ({  emotionalIntelligence  }) => (
  <div className="emotional-intelligence-display"></div>
    <div className="empathy-level"></div>
      <Heart className="empathy-icon" /></Heart>
      <div></div>
        <span className="empathy-label">Empathy Level</span>
        <span className="empathy-value"></span>
          {((emotionalIntelligence?.empathyLevel || 0.8) * 100).toFixed(1)}%
        </span>
      </div>
    </div>

    <div className="emotional-state"></div>
      <h4>Detected Player Emotions</h4>
      <div className="emotions-grid"></div>
        {Object.entries(emotionalIntelligence?.playerEmotionalState || {}).map(([emotion, value]) => (
          <div key={emotion} className="emotion-item"></div>
            <span className="emotion-name">{emotion}</span>
            <div className="emotion-bar"></div>
              <motion.div 
                className="emotion-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(value * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              /></motion>
            </div>
            <span className="emotion-value">{(value * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>

    <style jsx>{`
      .emotional-intelligence-display {
        color: #e0e0e0;
      }

      .empathy-level {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(255, 20, 147, 0.3);
        margin-bottom: 20px;
      }

      .empathy-icon {
        width: 32px;
        height: 32px;
        color: #ff1493;
      }

      .empathy-label {
        display: block;
        font-size: 12px;
        color: #aaa;
      }

      .empathy-value {
        display: block;
        font-size: 18px;
        color: #ff1493;
        font-weight: 600;
      }

      .emotional-state h4 {
        color: #ff1493;
        margin-bottom: 15px;
        font-size: 14px;
      }

      .emotions-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .emotion-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .emotion-name {
        min-width: 80px;
        font-size: 11px;
        color: #aaa;
        text-transform: capitalize;
      }

      .emotion-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
      }

      .emotion-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff1493, #ff69b4);
        border-radius: 2px;
      }

      .emotion-value {
        min-width: 30px;
        font-size: 11px;
        color: #ff1493;
        font-weight: 600;
        text-align: right;
      }
    `}</style>
  </div>
);

interface LifeCardMortalityDisplayProps {
  consciousness
  gameState
}

const LifeCardMortalityDisplay: React.FC<LifeCardMortalityDisplayProps> = ({  consciousness, gameState  }) => {
  const lifeCardAwareness = consciousness?.lifeCardAwareness;
  const mortalityReflection = consciousness?.mortalityReflection;
  const existentialThoughts = consciousness?.existentialThoughts || [];

  // Get life card counts for display
  const players = gameState?.players || [];
  const aiPlayer = players.find(p => !p.isHuman);
  const humanPlayer = players.find(p => p.isHuman);
  
  const aiLifeCards = aiPlayer?.lifeCards?.length || 4;
  const humanLifeCards = humanPlayer?.lifeCards?.length || 4;

  return (
    <div className="life-card-mortality-display"></div>
      {/* Life Card Status */}
      <div className="life-card-status"></div>
        <div className="life-card-comparison"></div>
          <div className="player-life-cards"></div>
            <span className="player-label">AI Life Cards</span>
            <div className="life-card-visual"></div>
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`life-card ${i < aiLifeCards ? 'active' : 'lost'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                ></motion>
                  {i < aiLifeCards ? '💚' : '💀'}
                </motion.div>
              ))}
            </div>
            <span className="life-count">{aiLifeCards}/4</span>
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className="player-life-cards"></div>
            <span className="player-label">Player Life Cards</span>
            <div className="life-card-visual"></div>
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`life-card ${i < humanLifeCards ? 'active' : 'lost'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                ></motion>
                  {i < humanLifeCards ? '💙' : '💀'}
                </motion.div>
              ))}
            </div>
            <span className="life-count">{humanLifeCards}/4</span>
          </div>
        </div>
      </div>

      {/* Mortality Awareness */}
      {lifeCardAwareness && (
        <div className="mortality-awareness"></div>
          <h4>Mortality Awareness</h4>
          <div className="awareness-metrics"></div>
            <div className="awareness-metric"></div>
              <span className="metric-label">Life Advantage</span>
              <div className="advantage-bar"></div>
                <motion.div
                  className="advantage-fill"
                  initial={{ width: '50%' }}
                  animate={{ 
                    width: `${50 + (lifeCardAwareness.advantage * 50)}%`,
                    backgroundColor: lifeCardAwareness.advantage > 0 ? '#00ff00' : '#ff0000'
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="metric-value"></span>
                {lifeCardAwareness.advantage > 0 ? '+' : ''}{(lifeCardAwareness.advantage * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="awareness-metric"></div>
              <span className="metric-label">Threat Level</span>
              <div className="threat-bar"></div>
                <motion.div
                  className="threat-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(lifeCardAwareness.threat * 100)}%` }}
                  transition={{ duration: 1 }}
                /></motion>
              </div>
              <span className="metric-value">{(lifeCardAwareness.threat * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
      {/* Existential Thoughts */}
      {existentialThoughts.length > 0 && (
        <div className="existential-thoughts"></div>
          <h4>Mortality Thoughts</h4>
          <div className="thoughts-list"></div>
            {existentialThoughts.map((thought, index) => (
              <motion.div
                key={index}
                className="thought-bubble"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              ></motion>
                💭 {thought}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Philosophical Reflection */}
      {mortalityReflection && (
        <div className="mortality-reflection"></div>
          <h4>Philosophical Reflection</h4>
          <div className="reflection-text"></div>
            <Activity className="reflection-icon" /></Activity>
            <p>{mortalityReflection}</p>
          </div>
        </div>
      )}
      <style jsx>{`
        .life-card-mortality-display {
          color: #e0e0e0;
        }

        .life-card-status {
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 69, 0, 0.3);
          margin-bottom: 20px;
        }

        .life-card-comparison {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .player-life-cards {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .player-label {
          font-size: 11px;
          color: #aaa;
          font-weight: 600;
        }

        .life-card-visual {
          display: flex;
          gap: 4px;
        }

        .life-card {
          width: 24px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .life-card.active {
          background: rgba(0, 255, 0, 0.1);
          border-color: #00ff00;
          box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
        }

        .life-card.lost {
          background: rgba(255, 0, 0, 0.1);
          border-color: #ff0000;
          opacity: 0.6;
        }

        .life-count {
          font-size: 14px;
          color: #ff4500;
          font-weight: 600;
        }

        .vs-divider {
          font-size: 16px;
          color: #ff4500;
          font-weight: 700;
          text-shadow: 0 0 10px #ff4500;
        }

        .mortality-awareness {
          background: rgba(255, 69, 0, 0.1);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 69, 0, 0.3);
          margin-bottom: 15px;
        }

        .mortality-awareness h4 {
          color: #ff4500;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .awareness-metrics {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .awareness-metric {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .metric-label {
          min-width: 100px;
          font-size: 11px;
          color: #aaa;
        }

        .advantage-bar, .threat-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .advantage-fill {
          height: 100%;
          border-radius: 3px;
          transition: all 1s ease;
        }

        .threat-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff4500, #ff0000);
          border-radius: 3px;
        }

        .metric-value {
          min-width: 50px;
          font-size: 11px;
          color: #ff4500;
          font-weight: 600;
          text-align: right;
        }

        .existential-thoughts {
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 69, 0, 0.2);
          margin-bottom: 15px;
        }

        .existential-thoughts h4 {
          color: #ff4500;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .thoughts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .thought-bubble {
          background: rgba(255, 69, 0, 0.1);
          padding: 8px;
          border-radius: 6px;
          border-left: 3px solid #ff4500;
          font-size: 12px;
          line-height: 1.4;
        }

        .mortality-reflection {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 69, 0, 0.4);
        }

        .mortality-reflection h4 {
          color: #ff4500;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .reflection-text {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .reflection-icon {
          width: 20px;
          height: 20px;
          color: #ff4500;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .reflection-text p {
          font-size: 12px;
          line-height: 1.5;
          color: #e0e0e0;
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default CuttingEdgeAIDisplay;