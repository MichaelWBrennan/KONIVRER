import React from 'react';

const SimpleHome: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-yellow-400">KONIVRER</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-white hover:text-yellow-400 transition-colors">
                Home
              </a>
              <a href="/cards" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Cards
              </a>
              <a href="/decks" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Decks
              </a>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-medium transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            KONIVRER Deck Database
          </h1>
          <p className="text-xl text-gray-300">
            Your ultimate destination for deck building and strategy
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Card Explorer</h3>
            <p className="text-gray-300 mb-4">
              Browse and search through our extensive card database
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              Explore Cards
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Deck Builder</h3>
            <p className="text-gray-300 mb-4">
              Create and optimize your perfect deck combinations
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
              Build Decks
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">Play Online</h3>
            <p className="text-gray-300 mb-4">
              Challenge players from around the world
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
              Start Playing
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Rules Center</h3>
            <p className="text-gray-300 mb-4">
              Learn the game rules and mechanics
            </p>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors">
              View Rules
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-red-400">Tournaments</h3>
            <p className="text-gray-300 mb-4">
              Join competitive tournaments and events
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
              Join Tournament
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Matchmaking</h3>
            <p className="text-gray-300 mb-4">
              Find opponents for quick matches
            </p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors">
              Find Match
            </button>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-400">
          <p>&copy; 2024 KONIVRER Deck Database. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default SimpleHome;