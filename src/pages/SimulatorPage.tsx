import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyGameContainer } from '../game/components/LazyGameContainer';
import { useDynamicSizing } from '../utils/userAgentSizing';
import HybridSimulatorDemo from '../components/HybridSimulatorDemo';
import '../components/battlefield/HybridBattlefield.css';

type SimulatorMode = 'menu' | 'traditional' | 'hybrid';

const SimulatorPage: React.FC = () => {
  const dynamicSizing = useDynamicSizing();
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('menu');

  const simulatorOptions = [
    {
      id: 'traditional' as const,
      title: 'Traditional Arena',
      description: 'Classic MTG Arena-style 3D battlefield with original game mechanics',
      icon: '🏟️',
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      features: ['3D Card Physics', 'Classic MTG Zones', 'Multiple Themes', 'Advanced Animations']
    },
    {
      id: 'hybrid' as const,
      title: 'Hybrid Battlefields',
      description: 'NEW: Intimate environments combining MTG Arena and Inscryption styles',
      icon: '🏚️',
      gradient: 'linear-gradient(135deg, #d97706, #dc2626)',
      features: ['Environmental Storytelling', 'Interactive Objects', 'Mystery Mechanics', 'Atmospheric Lighting']
    }
  ];

  if (simulatorMode === 'traditional') {
    return (
      <div
        className="play-page-container dynamic-sizing"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding:
            dynamicSizing.containerPadding <= 2
              ? '0px'
              : `${dynamicSizing.safeAreaInsets.top}px ${dynamicSizing.safeAreaInsets.right}px ${dynamicSizing.safeAreaInsets.bottom}px ${dynamicSizing.safeAreaInsets.left}px`,
          boxSizing: 'border-box',
          '--dynamic-width': dynamicSizing.cssWidth,
          '--dynamic-height': dynamicSizing.cssHeight,
          '--scale-factor': dynamicSizing.scaleFactor.toString(),
        }}
      >
        {/* Back button */}
        <motion.button
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 1001,
            backdropFilter: 'blur(8px)'
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSimulatorMode('menu')}
        >
          ← Back to Menu
        </motion.button>
        
        <LazyGameContainer />
      </div>
    );
  }

  if (simulatorMode === 'hybrid') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <HybridSimulatorDemo />
        
        {/* Back button overlay */}
        <motion.button
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 1002,
            backdropFilter: 'blur(8px)'
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSimulatorMode('menu')}
        >
          ← Back to Menu
        </motion.button>
      </div>
    );
  }

  // Menu mode
  return (
    <div
      className="simulator-menu"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, rgba(15, 8, 5, 1) 0%, rgba(0, 0, 0, 1) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '20px'
      }}
    >
      {/* Title */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '50px' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            letterSpacing: '2px'
          }}
          animate={{
            textShadow: [
              '0 0 30px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 165, 0, 0.8)',
              '0 0 30px rgba(255, 215, 0, 0.5)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          KONIVRER SIMULATORS
        </motion.h1>
        <motion.p
          style={{
            fontSize: '1.1rem',
            color: '#bbb',
            maxWidth: '600px',
            margin: '0 auto',
            fontStyle: 'italic'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Choose your preferred battlefield experience
        </motion.p>
      </motion.div>

      {/* Simulator options */}
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {simulatorOptions.map((option, index) => (
          <motion.div
            key={option.id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
              border: '1px solid rgba(255, 215, 0, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSimulatorMode(option.id)}
          >
            {/* Background gradient overlay */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: option.gradient,
                opacity: 0.1,
                borderRadius: '16px'
              }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div style={{ fontSize: '2.5rem' }}>{option.icon}</div>
                <h3 style={{
                  color: '#FFD700',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {option.title}
                  {option.id === 'hybrid' && (
                    <span style={{
                      background: 'linear-gradient(135deg, #ff6b35, #f9ca24)',
                      color: '#000',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginLeft: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      NEW
                    </span>
                  )}
                </h3>
              </div>

              <p style={{
                color: '#ccc',
                fontSize: '1rem',
                lineHeight: '1.5',
                marginBottom: '20px'
              }}>
                {option.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {option.features.map((feature) => (
                  <span
                    key={feature}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Call to action */}
              <motion.div
                style={{
                  background: option.gradient,
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  marginTop: '20px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.9rem'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.id === 'hybrid' ? 'Experience the Hybrid' : 'Enter Arena'}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Back to homepage link */}
      <motion.div
        style={{ marginTop: '40px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.a
          href="/"
          style={{
            color: '#888',
            textDecoration: 'none',
            fontSize: '0.9rem',
            borderBottom: '1px solid transparent',
            transition: 'all 0.3s ease'
          }}
          whileHover={{
            color: '#FFD700',
            borderBottomColor: '#FFD700'
          }}
        >
          ← Back to Homepage
        </motion.a>
      </motion.div>
    </div>
  );
};

export default SimulatorPage;
