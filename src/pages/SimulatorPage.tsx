import React from 'react';
import MTGArenaDemo from '../components/MTGArenaDemo';
import '../components/battlefield/Enhanced2_5DTableView.css';

const SimulatorPage: React.FC = () => {
  // Pure MTG Arena simulator - no Inscryption mechanics
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <MTGArenaDemo />
    </div>
  );
};

export default SimulatorPage;
