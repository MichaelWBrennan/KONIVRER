import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AccessibilityPanel from './AccessibilityPanel';

const AccessibilityButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={() => setIsPanelOpen(true)}
        aria-label="Open accessibility settings"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color, #d4af37)',
          color: '#000',
          border: 'none',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span role="img" aria-hidden="true">♿</span>
      </motion.button>
      
      <AccessibilityPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default AccessibilityButton;