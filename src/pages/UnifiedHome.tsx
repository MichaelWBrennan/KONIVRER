import React from 'react';

interface UnifiedHomeProps {
  variant?: 'standard' | 'simple';
}

const UnifiedHome: React.FC<UnifiedHomeProps> = ({ variant = 'standard' }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to KONIVRER
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The ultimate deck database and card game platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Card Database</h3>
              <p className="text-gray-600 mb-4">
                Search through our comprehensive card database
              </p>
              <a 
                href="/cards" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Browse Cards
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Deck Builder</h3>
              <p className="text-gray-600 mb-4">
                Create and manage your custom decks
              </p>
              <a 
                href="/decks" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Build Decks
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Tournaments</h3>
              <p className="text-gray-600 mb-4">
                Join tournaments and compete with others
              </p>
              <a 
                href="/tournaments" 
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                View Tournaments
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedHome;