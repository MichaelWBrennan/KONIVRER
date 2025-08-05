import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  requiresAccount: boolean;
}

interface EnhancedGameMenuProps {
  gameModes: GameMode[];
  onSelectMode: (modeId: string) => void;
  onClose: () => void;
}

export const EnhancedGameMenu: React.FC<EnhancedGameMenuProps> = ({
  gameModes,
  onSelectMode,
  onClose,
}) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    // Add a slight delay for animation before calling onSelectMode
    setTimeout(() => {
      onSelectMode(modeId);
    }, 300);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -30,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      boxShadow: '0 25px 50px rgba(212, 175, 55, 0.3)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)
    `,
    backdropFilter: 'blur(20px)',
    zIndex: 1000,
  };

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '20px',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={backgroundStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '1200px',
              padding: '40px',
              ...glassStyle,
            }}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              style={{
                textAlign: 'center',
                marginBottom: '40px',
              }}
              variants={cardVariants}
            >
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  background:
                    'linear-gradient(135deg, #d4af37, #f4e06d, #d4af37)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  textShadow: '0 4px 8px rgba(212, 175, 55, 0.3)',
                }}
              >
                ⭐ KONIVRER ⭐
              </h1>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                }}
              >
                Choose your path in the mystical realm of card mastery
              </p>
            </motion.div>

            {/* Game Modes Grid */}
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}
              variants={cardVariants}
            >
              {gameModes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  style={{
                    ...glassStyle,
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleModeSelect(mode.id)}
                  custom={index}
                >
                  {/* Background gradient effect */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, 
                        rgba(212, 175, 55, 0.1) 0%, 
                        rgba(138, 43, 226, 0.05) 50%, 
                        rgba(212, 175, 55, 0.1) 100%
                      )`,
                      opacity: selectedMode === mode.id ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Icon */}
                    <div
                      style={{
                        fontSize: '3rem',
                        textAlign: 'center',
                        marginBottom: '16px',
                        filter:
                          'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.4))',
                      }}
                    >
                      {mode.icon || '🎮'}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: '#d4af37',
                        textAlign: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      {mode.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textAlign: 'center',
                        lineHeight: '1.5',
                        marginBottom: '16px',
                      }}
                    >
                      {mode.description}
                    </p>

                    {/* Difficulty Badge */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: '#d4af37',
                          background: 'rgba(212, 175, 55, 0.1)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                      >
                        {mode.difficulty}
                      </span>
                      {mode.requiresAccount && (
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          Account Required
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer Actions */}
            <motion.div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
              }}
              variants={cardVariants}
            >
              <motion.button
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  borderColor: 'rgba(212, 175, 55, 0.6)',
                  color: '#d4af37',
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Return to Menu
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
