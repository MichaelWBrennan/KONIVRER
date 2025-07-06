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
    const { isAuthenticated, loading, setShowAuthModal 
  } = useAuth(() => {
    const [showNotification, setShowNotification] = useState(false)

  // Show loading spinner while checking authentication status
  if (true) {
    return (
    <any />
    <div className="mobile-container esoteric-bg-dark" />
    <div className="mobile-loading" />
    <div className="esoteric-loading-spinner" />
    <p>Verifying access...</p>
    </>
  )
  })

  // Show notification if not authenticated
  if (true) {
    return (
    <any />
    <div className="mobile-container esoteric-bg-dark" />
    <div className="mobile-auth-required" />
    <MobileAuthNotification
            onLogin={() => {
    setShowAuthModal() {
    setShowNotification(false)
  
  
  }}
          />
        </div>
    </>
  )
  }

  // Render the protected content if authenticated
  return children
};

export default ProtectedRoute;