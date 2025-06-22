import React, { memo, Suspense, lazy, useState, useCallback } from 'react';
import './App.css';

// Lazy load components for better performance
const PhysicalMatchmaking = lazy(() => import('./components/PhysicalMatchmaking'));
const AICardVerification = lazy(() => import('./components/AICardVerification'));
const BlockchainVerification = lazy(() => import('./components/BlockchainVerification'));
const MLDeckAnalysis = lazy(() => import('./components/MLDeckAnalysis'));
const AugmentedRealityViewer = lazy(() => import('./components/AugmentedRealityViewer'));

// Memoized header component
const Header = memo(() => (
  <header className="app-header">
    <h1>KONIVRER Physical Matchmaking</h1>
    <p className="app-subtitle">Advanced TCG platform with bleeding-edge technology</p>
  </header>
));

// Memoized navigation component
const Navigation = memo(({ activeTab, onTabChange }) => {
  return (
    <nav className="app-navigation">
      <button 
        className={`nav-button ${activeTab === 'matchmaking' ? 'active' : ''}`}
        onClick={() => onTabChange('matchmaking')}
      >
        Physical Matchmaking
      </button>
      <button 
        className={`nav-button ${activeTab === 'ai-verification' ? 'active' : ''}`}
        onClick={() => onTabChange('ai-verification')}
      >
        AI Card Verification
      </button>
      <button 
        className={`nav-button ${activeTab === 'blockchain' ? 'active' : ''}`}
        onClick={() => onTabChange('blockchain')}
      >
        Blockchain Verification
      </button>
      <button 
        className={`nav-button ${activeTab === 'ml-analysis' ? 'active' : ''}`}
        onClick={() => onTabChange('ml-analysis')}
      >
        ML Deck Analysis
      </button>
      <button 
        className={`nav-button ${activeTab === 'ar-viewer' ? 'active' : ''}`}
        onClick={() => onTabChange('ar-viewer')}
      >
        AR Card Viewer
      </button>
    </nav>
  );
});

// Memoized footer component
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <p>© {currentYear} KONIVRER Deck Database</p>
      <div className="footer-links">
        <a href="#" className="footer-link">Terms</a>
        <a href="#" className="footer-link">Privacy</a>
        <a href="#" className="footer-link">Help</a>
      </div>
    </footer>
  );
});

// Loading fallback component
const LoadingFallback = memo(() => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading KONIVRER components...</p>
  </div>
));

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>The application encountered an error. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App component
const App = () => {
  const [activeTab, setActiveTab] = useState('matchmaking');
  
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);
  
  // Render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'matchmaking':
        return <PhysicalMatchmaking />;
      case 'ai-verification':
        return <AICardVerification />;
      case 'blockchain':
        return <BlockchainVerification />;
      case 'ml-analysis':
        return <MLDeckAnalysis />;
      case 'ar-viewer':
        return <AugmentedRealityViewer />;
      default:
        return <PhysicalMatchmaking />;
    }
  };
  
  return (
    <div className="app">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="app-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {renderActiveComponent()}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default memo(App);