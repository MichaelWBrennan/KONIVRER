import React, { memo, Suspense, lazy } from 'react';
import './App.css';

// Lazy load the PhysicalMatchmaking component for better performance
const PhysicalMatchmaking = lazy(() => import('./components/PhysicalMatchmaking'));

// Memoized header component
const Header = memo(() => (
  <header className="app-header">
    <h1>KONIVRER Physical Matchmaking</h1>
    <p className="app-subtitle">Generate QR codes for physical matches and tournaments</p>
  </header>
));

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
    <p>Loading KONIVRER Physical Matchmaking...</p>
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
  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <PhysicalMatchmaking />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default memo(App);