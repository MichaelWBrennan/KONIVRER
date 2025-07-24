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
          top: '20px',
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
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-9 7c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07c-.41 1.16-1.52 2-2.83 2z"/>
        </svg>
      </motion.button>
      
      <AccessibilityPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default AccessibilityButton;