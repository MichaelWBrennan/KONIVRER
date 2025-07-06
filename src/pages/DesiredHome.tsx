import React from 'react';
import { Link } from 'react-router-dom';

const DesiredHome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#000000' }}>
      {/* Main Content - Minimal */}
      <div className="flex flex-col items-center w-full px-4 py-8">
        {/* Star Decoration */}
        <div className="text-yellow-400 text-2xl mb-6">✦</div>
        
        {/* Main Title */}
        <h1 className="text-4xl font-light text-center mb-8 tracking-wide text-white">
          Trading Card Game
        </h1>
        
        {/* Star Decoration */}
        <div className="text-yellow-400 text-xl mb-8">✦</div>
        
        {/* Demo Button */}
        <Link 
          to="/game/demo" 
          className="px-12 py-3 rounded-full text-xl font-semibold mb-12 text-center"
          style={{ 
            background: 'linear-gradient(135deg, #4a6cd1 0%, #3b5998 100%)',
            color: '#f0d87f',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          Play KONIVRER Demo
        </Link>
      </div>
    </div>
  );
};

export default DesiredHome;