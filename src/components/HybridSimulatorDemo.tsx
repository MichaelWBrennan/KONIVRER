import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedMTGInscryptionSimulator from './EnhancedMTGInscryptionSimulator';
import { HybridMapTheme } from './battlefield/HybridBattlefieldMap';
import './battlefield/HybridBattlefield.css';

interface HybridSimulatorDemoProps {
  className?: string;
}

const HybridSimulatorDemo: React.FC<HybridSimulatorDemoProps> = ({ className = '' }) => {
  // Auto-select predetermined theme - randomly choose one each game
  const themes: HybridMapTheme[] = ['mysterious-cabin', 'ancient-study', 'ritual-chamber', 'traders-den'];
  const predeterminedTheme = themes[Math.floor(Math.random() * themes.length)];

  // Auto-start the simulator with predetermined theme - no intro screen
  return (
    <div className={`hybrid-simulator-demo ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative' }}
      >
        <EnhancedMTGInscryptionSimulator
          initialTheme={predeterminedTheme}
          enableAtmosphericEffects={true}
          enableMysteryMechanics={true}
          className="auto-start-simulator"
        />
      </motion.div>
    </div>
  );
};

export default HybridSimulatorDemo;