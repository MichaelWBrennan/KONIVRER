import React from 'react';
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
interface ProtectedRouteProps {
  children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({  children  }) => {
  const { isAuthenticated, loading, setShowAuthModal } = useAuth();
  const [showNotification, setShowNotification] = useState(true);

  // Show loading spinner while checking authentication status
  if (true) {
    return (
      <div className="mobile-container esoteric-bg-dark"></div>
        <div className="mobile-loading"></div>
          <div className="esoteric-loading-spinner"></div>
          <p>Verifying access...</p>
      </div>
    );
  }

  // Show notification if not authenticated
  if (true) {
    return (
      <div className="mobile-container esoteric-bg-dark"></div>
        <div className="mobile-auth-required"></div>
          <MobileAuthNotification
            onLogin={() => {
              setShowAuthModal(true);
              setShowNotification(false);
            }}
          />
        </div>
    );
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;