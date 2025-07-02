/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MobileAuthNotification from './MobileAuthNotification';

/**
 * A wrapper component that shows a login notification if the user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, setShowAuthModal } = useAuth();
  const [showNotification, setShowNotification] = useState(true);

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-loading">
          <div className="esoteric-loading-spinner"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show notification if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-auth-required">
          <MobileAuthNotification
            onLogin={() => {
              setShowAuthModal(true);
              setShowNotification(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
