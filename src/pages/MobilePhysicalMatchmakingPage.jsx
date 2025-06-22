import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PhysicalMatchmakingApp from '../components/PhysicalMatchmakingApp';
import MobileAuthNotification from '../components/MobileAuthNotification';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

/**
 * Mobile-friendly Physical Matchmaking Page
 * This page is protected and requires authentication
 */
const MobilePhysicalMatchmakingPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [error, setError] = useState(null);

  // Error boundary effect
  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Error handler for component errors
  const handleError = (error) => {
    console.error('Physical Matchmaking Error:', error);
    setError(error.message || 'An unexpected error occurred');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="mobile-container esoteric-bg">
        <div className="mobile-loading">
          <div className="mobile-spinner esoteric-spinner"></div>
          <p className="esoteric-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth notification
  if (!isAuthenticated) {
    return (
      <div className="mobile-container esoteric-bg">
        <MobileAuthNotification
          title="Physical Matchmaking"
          message="You need to be logged in to access the Physical Matchmaking features."
          redirectPath="/physical-matchmaking"
        />
      </div>
    );
  }

  // If authenticated, show the physical matchmaking app
  return (
    <div className="mobile-container esoteric-bg">
      {/* Error message display */}
      {error && (
        <div className="mobile-error-banner esoteric-error-message">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mobile-btn-close esoteric-btn-close"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="mobile-page-header esoteric-page-header">
        <h1 className="mobile-page-title esoteric-page-title">Physical Matchmaking</h1>
        <p className="mobile-page-subtitle esoteric-text-muted">
          Organize physical matches and tournaments
        </p>
      </div>
      
      <ErrorBoundary onError={handleError}>
        <PhysicalMatchmakingApp />
      </ErrorBoundary>
    </div>
  );
};

export default MobilePhysicalMatchmakingPage;