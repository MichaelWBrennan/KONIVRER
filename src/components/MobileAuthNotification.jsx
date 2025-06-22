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