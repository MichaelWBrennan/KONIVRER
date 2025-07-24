<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

/**
 * A notification component that appears when a user tries to access a protected route
 */
const MobileAuthNotification = ({ onLogin }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  
  const handleLogin = () => {
    setIsVisible(false);
    if (onLogin) {
      onLogin();
    }
  };
  
  const handleClose = () => {
    setIsVisible(false);
    navigate('/');
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="mobile-auth-notification esoteric-card"
        >
          <div className="mobile-auth-notification-content">
            <h3 className="esoteric-text-accent">Authentication Required</h3>
            <p>You need to be logged in to access this feature.</p>
            <div className="mobile-auth-notification-actions">
              <button 
                onClick={handleLogin}
                className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary"
              >
                Login
              </button>
              <button 
                onClick={handleClose}
                className="mobile-btn esoteric-btn"
              >
                Return Home
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileAuthNotification;
=======

import React from 'react';

const MobileAuthNotification = ({ isVisible, message, type = 'info', onClose }) => {
  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${getTypeStyles()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-lg font-bold">{getIcon()}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileAuthNotification;
>>>>>>> af774a41 (Initial commit)
