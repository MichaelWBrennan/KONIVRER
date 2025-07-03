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

const CuttingEdgeAIDisplay = ({ aiStatus, gameState }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger animations when AI status changes
    setAnimationKey(prev => prev + 1);
  }, [aiStatus]);

  if (!aiStatus || !aiStatus.cuttingEdge) {
    return (
      <div className="cutting-edge-ai-display basic-mode">
        <div className="ai-header">
          <Brain className="ai-icon" />
          <span>Basic AI Mode</span>
        </div>
      </div>
    );
  }

  const { cuttingEdge, consciousness, lastDecision } = aiStatus;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="cutting-edge-ai-display">
      {/* Main AI Status Header */}
      <motion.div 
        className="ai-main-status"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        key={animationKey}
      >
        <div className="consciousness-indicator">
          <Brain className="consciousness-icon" />
          <div className="consciousness-level">
            <div className="consciousness-bar">
              <motion.div 
                className="consciousness-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(cuttingEdge.consciousnessMetrics?.consciousnessLevel || 0.7) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="consciousness-text">
              Consciousness: {((cuttingEdge.consciousnessMetrics?.consciousnessLevel || 0.7) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="ai-features-grid">
          <FeatureIndicator 
            icon={Atom} 
            label="Quantum" 
            active={cuttingEdge.cuttingEdgeFeatures?.quantumDecisionMaking}
            value={cuttingEdge.quantumState?.coherenceLevel}
          />
          <FeatureIndicator 
            icon={Eye} 
            label="Theory of Mind" 
            active={cuttingEdge.cuttingEdgeFeatures?.advancedTheoryOfMind}
            value={cuttingEdge.theoryOfMindAccuracy}
          />
          <FeatureIndicator 
            icon={Network} 
            label="Neural Networks" 
            active={true}
            value={cuttingEdge.performanceMetrics?.decisionAccuracy}
          />
          <FeatureIndicator 
            icon={TrendingUp} 
            label="Evolution" 
            active={cuttingEdge.cuttingEdgeFeatures?.personalityEvolution}
            value={cuttingEdge.evolutionaryProgress?.consciousnessEvolution}
          />
        </div>
      </motion.div>

      {/* Expandable Sections */}
      <div className="ai-sections">
        
        {/* Consciousness Section */}
        <AISection
          title="Consciousness & Thoughts"
          icon={Brain}
          isExpanded={expandedSection === 'consciousness'}
          onToggle={() => toggleSection('consciousness')}
          badge={consciousness ? 'Active' : 'Inactive'}
        >
          {consciousness && (
            <ConsciousnessDisplay consciousness={consciousness} />
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
          <QuantumDisplay quantumState={cuttingEdge.quantumState} lastDecision={lastDecision} />
        </AISection>

        {/* Neural Networks */}
        <AISection
          title="Neural Network Activity"
          icon={Network}
          isExpanded={expandedSection === 'neural'}
          onToggle={() => toggleSection('neural')}
          badge={`${(cuttingEdge.performanceMetrics?.decisionAccuracy * 100 || 70).toFixed(0)}% Accuracy`}
        >
          <NeuralNetworkDisplay performanceMetrics={cuttingEdge.performanceMetrics} />
        </AISection>

        {/* Theory of Mind */}
        <AISection
          title="Player Mind Model"
          icon={Eye}
          isExpanded={expandedSection === 'mind'}
          onToggle={() => toggleSection('mind')}
          badge={`${(cuttingEdge.theoryOfMindAccuracy * 100 || 50).toFixed(0)}% Confidence`}
        >
          <TheoryOfMindDisplay aiStatus={aiStatus} />
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
          />
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
          />
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

const FeatureIndicator = ({ icon: Icon, label, active, value }) => (
  <motion.div 
    className={`feature-indicator ${active ? 'active' : 'inactive'}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="feature-icon" />
    <div className="feature-info">
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

const AISection = ({ title, icon: Icon, isExpanded, onToggle, badge, children }) => (
  <motion.div 
    className="ai-section"
    initial={false}
    animate={{ 
      backgroundColor: isExpanded ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)' 
    }}
  >
    <motion.div 
      className="section-header"
      onClick={onToggle}
      whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="section-title">
        <Icon className="section-icon" />
        <span>{title}</span>
      </div>
      {badge && <span className="section-badge">{badge}</span>}
      <motion.div
        className="expand-indicator"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        ▼
      </motion.div>
    </motion.div>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="section-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
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

const ConsciousnessDisplay = ({ consciousness }) => (
  <div className="consciousness-display">
    <div className="consciousness-grid">
      <div className="thought-section">
        <h4>Current Thoughts</h4>
        <div className="thoughts-list">
          {consciousness.currentThoughts?.map((thought, index) => (
            <motion.div 
              key={index}
              className="thought-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              💭 {thought}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="existential-section">
        <h4>Existential Reflections</h4>
        <div className="reflections-list">
          {consciousness.existentialReflections?.map((reflection, index) => (
            <motion.div 
              key={index}
              className="reflection-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              🤔 {reflection}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="self-awareness">
      <h4>Self-Awareness</h4>
      <p>{consciousness.selfAwareness}</p>
    </div>

    <div className="philosophy">
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

const QuantumDisplay = ({ quantumState, lastDecision }) => (
  <div className="quantum-display">
    <div className="quantum-metrics">
      <div className="metric">
        <Waves className="metric-icon" />
        <div>
          <span className="metric-label">Coherence Level</span>
          <span className="metric-value">{((quantumState?.coherenceLevel || 0.5) * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="metric">
        <Atom className="metric-icon" />
        <div>
          <span className="metric-label">Entanglement</span>
          <span className="metric-value">{((quantumState?.entanglementStrength || 0.5) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>

    {lastDecision?.quantumState && (
      <div className="quantum-decision">
        <h4>Last Quantum Decision</h4>
        <div className="decision-details">
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

const NeuralNetworkDisplay = ({ performanceMetrics }) => (
  <div className="neural-display">
    <div className="neural-metrics">
      {Object.entries(performanceMetrics || {}).map(([key, value]) => (
        <div key={key} className="neural-metric">
          <span className="metric-name">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
          <div className="metric-bar">
            <motion.div 
              className="metric-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(value * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
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

const TheoryOfMindDisplay = ({ aiStatus }) => (
  <div className="theory-of-mind-display">
    <div className="mind-model-accuracy">
      <Eye className="mind-icon" />
      <div>
        <span className="accuracy-label">Player Model Confidence</span>
        <span className="accuracy-value">
          {((aiStatus.cuttingEdge?.theoryOfMindAccuracy || 0.5) * 100).toFixed(1)}%
        </span>
      </div>
    </div>

    <div className="player-insights">
      <h4>Player Insights</h4>
      <div className="insights-grid">
        <div className="insight-item">
          <span className="insight-label">Predicted Emotion</span>
          <span className="insight-value">Engaged</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Play Style</span>
          <span className="insight-value">Adaptive</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Skill Level</span>
          <span className="insight-value">Intermediate</span>
        </div>
        <div className="insight-item">
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

const MetaLearningDisplay = ({ insights, learningStats }) => (
  <div className="meta-learning-display">
    <div className="learning-progress">
      <TrendingUp className="learning-icon" />
      <div>
        <span className="progress-label">Meta-Learning Insights</span>
        <span className="progress-value">{insights || 0}</span>
      </div>
    </div>

    <div className="learning-metrics">
      <div className="learning-metric">
        <span className="metric-label">Emergent Strategies</span>
        <span className="metric-value">{learningStats?.emergentStrategies || 0}</span>
      </div>
      <div className="learning-metric">
        <span className="metric-label">Experience Buffer</span>
        <span className="metric-value">{learningStats?.experienceBufferSize || 0}</span>
      </div>
      <div className="learning-metric">
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

const EmotionalIntelligenceDisplay = ({ emotionalIntelligence }) => (
  <div className="emotional-intelligence-display">
    <div className="empathy-level">
      <Heart className="empathy-icon" />
      <div>
        <span className="empathy-label">Empathy Level</span>
        <span className="empathy-value">
          {((emotionalIntelligence?.empathyLevel || 0.8) * 100).toFixed(1)}%
        </span>
      </div>
    </div>

    <div className="emotional-state">
      <h4>Detected Player Emotions</h4>
      <div className="emotions-grid">
        {Object.entries(emotionalIntelligence?.playerEmotionalState || {}).map(([emotion, value]) => (
          <div key={emotion} className="emotion-item">
            <span className="emotion-name">{emotion}</span>
            <div className="emotion-bar">
              <motion.div 
                className="emotion-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(value * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
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

export default CuttingEdgeAIDisplay;