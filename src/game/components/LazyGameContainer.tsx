import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the heavy GameContainer component
const GameContainer = lazy(() =>
  import('./GameContainer').then(module => ({ default: module.GameContainer })),
);

interface LazyGameContainerProps {
  onClose?: () => void;
  setShowGame?: (show: boolean) => void;
}

// Enhanced loading component with immediate feedback
const GameLoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        zIndex: 10000,
      }}
    >
      {/* Instant visual feedback */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100px',
          height: '100px',
          border: '4px solid rgba(212, 175, 55, 0.3)',
          borderTop: '4px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '32px',
        }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          color: '#d4af37',
          fontSize: '2rem',
          marginBottom: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        🎮 KONIVRER
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.2rem',
          textAlign: 'center',
          maxWidth: '500px',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}
      >
        Initializing mystical realm...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '1rem',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        Loading advanced 3D graphics and game engine
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export const LazyGameContainer: React.FC<LazyGameContainerProps> = props => {
  return (
    <Suspense fallback={<GameLoadingScreen />}>
      <GameContainer {...props} />
    </Suspense>
  );
};

export default LazyGameContainer;
