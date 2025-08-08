import React from 'react';
import { LazyGameContainer } from '../game/components/LazyGameContainer';
import { useDynamicSizing } from '../utils/userAgentSizing';

const SimulatorPage: React.FC = () => {
  const dynamicSizing = useDynamicSizing();

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
        padding: `${dynamicSizing.safeAreaInsets.top}px ${dynamicSizing.safeAreaInsets.right}px ${dynamicSizing.safeAreaInsets.bottom}px ${dynamicSizing.safeAreaInsets.left}px`,
        boxSizing: 'border-box',
        // CSS custom properties for responsive behavior
        '--dynamic-width': dynamicSizing.cssWidth,
        '--dynamic-height': dynamicSizing.cssHeight,
        '--scale-factor': dynamicSizing.scaleFactor.toString(),
      }}
    >
      <LazyGameContainer />
    </div>
  );
};

export default SimulatorPage;
