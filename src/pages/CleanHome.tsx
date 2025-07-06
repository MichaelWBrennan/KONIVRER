import React from 'react';

const CleanHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white flex flex-col">
      {/* Main Content - Empty */}
      <div className="flex-1">
        {/* Empty content area */}
      </div>

      {/* Bottom Menu Bar */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
        <div className="flex justify-around items-center py-4">
          <a href="/cards" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">🃏</div>
            <span className="text-sm font-medium">Cards</span>
          </a>
          
          <a href="/decks" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">📚</div>
            <span className="text-sm font-medium">Decks</span>
          </a>
          
          <a href="/tournaments" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">🏆</div>
            <span className="text-sm font-medium">Tournament</span>
          </a>
          
          <a href="/play" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">⚔️</div>
            <span className="text-sm font-medium">Play</span>
          </a>
          
          <a href="/rules" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">📖</div>
            <span className="text-sm font-medium">Rules</span>
          </a>
          
          <button className="flex flex-col items-center text-gray-300 hover:text-yellow-400 transition-colors">
            <div className="text-xl mb-1">👤</div>
            <span className="text-sm font-medium">Login</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CleanHome;