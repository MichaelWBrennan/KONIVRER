import React from 'react';
import HybridSimulatorDemo from '../components/HybridSimulatorDemo';
import '../components/battlefield/HybridBattlefield.css';

const SimulatorPage: React.FC = () => {
  // Auto-start the hybrid simulator directly
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <HybridSimulatorDemo />
    </div>
  );
};

export default SimulatorPage;
