import React from 'react';
import { LazyGameContainer } from '../game/components/LazyGameContainer';

const SimulatorPage: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        zIndex: 1000,
      }}
    >
      <LazyGameContainer />
    </div>
  );
};

export default SimulatorPage;
