import React from 'react';
import { motion } from 'framer-motion';
import PureMTGArenaSimulator from './PureMTGArenaSimulator';

interface MTGArenaDemoProps {
  className?: string;
}

const MTGArenaDemo: React.FC<MTGArenaDemoProps> = ({ className = '' }) => {
  return (
    <div className={`mtg-arena-demo ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative' }}
      >
        <PureMTGArenaSimulator className="pure-arena-simulator" />
      </motion.div>
    </div>
  );
};

export default MTGArenaDemo;