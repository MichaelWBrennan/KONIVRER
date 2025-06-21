import { useState, useEffect } from 'react';
import RulesCenter from '../components/RulesCenter';
import ErrorBoundary from '../components/ErrorBoundary';

const Rules = () => {
  const [hasRulesData, setHasRulesData] = useState(false);

  useEffect(() => {
    // Check if rules data exists
    const checkRulesData = async () => {
      try {
        const rulesData = await import('../data/rules.json');
        console.log('Rules data loaded successfully:', rulesData);
        setHasRulesData(true);
      } catch (error) {
        console.error('Failed to load rules data:', error);
        setHasRulesData(false);
      }
    };

    checkRulesData();
  }, []);

  return (
    <ErrorBoundary>
      {hasRulesData ? (
        <RulesCenter />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Rules Data Not Available
            </h2>
            <p className="text-gray-300 mb-6">
              We're having trouble loading the rules data. Please try again
              later.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default Rules;
