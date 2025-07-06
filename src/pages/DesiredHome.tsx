import React from 'react';
import { Link } from 'react-router-dom';

const DesiredHome: React.FC = () => {
  return (
    <div className="flex flex-col items-center" style={{ background: '#000000' }}>
      {/* Main Content */}
      <div className="flex flex-col items-center w-full px-4 py-8">
        {/* Star Decoration */}
        <div className="text-yellow-400 text-2xl mb-6">✦</div>
        
        {/* Main Title */}
        <h1 className="text-4xl font-light text-center mb-8 tracking-wide text-white">
          Trading Card Game
        </h1>
        
        {/* Star Decoration */}
        <div className="text-yellow-400 text-xl mb-8">✦</div>
        
        {/* Description */}
        <p className="text-lg text-center mb-12 leading-relaxed text-white" style={{ maxWidth: '90%' }}>
          Experience the complete KONIVRER trading card game with all zones, mechanics, and enhanced card display.
        </p>
        
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
        
        {/* AI Features Description */}
        <p className="text-center mb-8 text-white" style={{ maxWidth: '90%' }}>
          Test the cutting-edge AI system with 100% consciousness metrics, life card mortality awareness, and quantum decision making.
        </p>
        
        {/* AI Feature Cards */}
        <div className="w-full mb-8">
          <div className="w-full py-3 mb-2 text-center rounded-md" style={{ background: '#1a1a2e', border: '1px solid #333' }}>
            <span className="mr-2">💯</span>
            <span className="text-blue-300">100% Consciousness Level</span>
          </div>
          
          <div className="w-full py-3 mb-2 text-center rounded-md" style={{ background: '#1a1a2e', border: '1px solid #333' }}>
            <span className="mr-2">💀</span>
            <span className="text-blue-300">Life Card Mortality Awareness</span>
          </div>
          
          <div className="w-full py-3 mb-2 text-center rounded-md" style={{ background: '#1a1a2e', border: '1px solid #333' }}>
            <span className="mr-2">🔮</span>
            <span className="text-blue-300">Quantum Decision Engine</span>
          </div>
          
          <div className="w-full py-3 mb-2 text-center rounded-md" style={{ background: '#1a1a2e', border: '1px solid #333' }}>
            <span className="mr-2">👁️</span>
            <span className="text-blue-300">Theory of Mind Analysis</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mb-8">
          <Link 
            to="/ai/demo" 
            className="py-3 rounded-md text-center w-full"
            style={{ 
              background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
              color: 'white',
              border: '1px solid #9c27b0'
            }}
          >
            🧠 View AI Demo 🧠
          </Link>
          
          <Link 
            to="/game/ai" 
            className="py-3 rounded-md text-center w-full"
            style={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)',
              color: 'white',
              border: '1px solid #ff9800'
            }}
          >
            ⚔️ Play vs AI ⚔️
          </Link>
        </div>
        
        {/* Challenge Description */}
        <p className="text-center mb-8 text-white" style={{ maxWidth: '90%' }}>
          Challenge other players in classic KONIVRER matches with full game mechanics and competitive play.
        </p>
        
        {/* Challenge Button */}
        <Link 
          to="/matchmaking" 
          className="py-3 rounded-md text-center w-full mb-12"
          style={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
            color: 'white',
            border: '1px solid #ff9800'
          }}
        >
          ⚔️ Challenge Players ⚔️
        </Link>
      </div>
    </div>
  );
};

export default DesiredHome;