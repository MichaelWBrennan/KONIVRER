/**
 * Notification Center Component
 * 
 * This component displays and manages notifications in the UI.
 * It provides a UI for enabling notifications and displays recent notifications.
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, BellOff, Check, X, Settings } from 'lucide-react';

const NotificationCenter = () => {
  const { isSupported, permission, isSubscribed, subscribe, unsubscribe } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Show notification prompt after a delay if user is authenticated
  useEffect(() => {
    if (isAuthenticated && isSupported && permission === 'default' && !showPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isSupported, permission, showPrompt]);

  // Handle subscription
  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowPrompt(false);
    }
  };

  // Handle unsubscription
  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Dismiss notification prompt
  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  // Fetch notifications (mock implementation)
  useEffect(() => {
    if (isAuthenticated) {
      // This would typically fetch from an API
      const mockNotifications = [
        {
          id: 1,
          title: 'Tournament Starting Soon',
          message: 'Your registered tournament starts in 30 minutes',
          type: 'tournament',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          read: false,
          data: { tournamentId: '123' }
        },
        {
          id: 2,
          title: 'New Message',
          message: 'You have a new message from Player123',
          type: 'message',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          read: true,
          data: { messageId: '456' }
        },
        {
          id: 3,
          title: 'Match Found',
          message: 'A match has been found for your deck',
          type: 'match',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
          read: true,
          data: { matchId: '789' }
        }
      ];
      
      setNotifications(mockNotifications);
    }
  }, [isAuthenticated]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // If notifications are not supported, don't render anything
  if (!isSupported) {
    return null;
  }

  return (
    <div className="notification-center">
      {/* Notification Bell */}
      <button 
        className="notification-bell"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        {isSubscribed ? (
          <Bell size={24} />
        ) : (
          <BellOff size={24} />
        )}
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="notification-badge">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button 
                className="notification-action"
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              >
                {isSubscribed ? 'Disable' : 'Enable'}
              </button>
              <button className="notification-action">
                <Settings size={16} />
              </button>
              <button 
                className="notification-close"
                onClick={toggleNotifications}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notification Permission Prompt */}
      {showPrompt && (
        <div className="notification-prompt">
          <div className="notification-prompt-content">
            <h4>Enable Notifications</h4>
            <p>Get notified about tournaments, messages, and matches</p>
            <div className="notification-prompt-actions">
              <button 
                className="notification-prompt-action primary"
                onClick={handleSubscribe}
              >
                <Check size={16} />
                Enable
              </button>
              <button 
                className="notification-prompt-action"
                onClick={dismissPrompt}
              >
                <X size={16} />
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-center {
          position: relative;
        }
        
        .notification-bell {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          color: #fff;
        }
        
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #f44336;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-panel {
          position: absolute;
          top: 40px;
          right: 0;
          width: 320px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          color: #333;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
        }
        
        .notification-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .notification-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .notification-action {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
        }
        
        .notification-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
        }
        
        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }
        
        .notification-item:hover {
          background-color: #f9f9f9;
        }
        
        .notification-item.unread {
          background-color: #f0f7ff;
        }
        
        .notification-content h4 {
          margin: 0 0 4px;
          font-size: 14px;
        }
        
        .notification-content p {
          margin: 0 0 4px;
          font-size: 13px;
          color: #666;
        }
        
        .notification-time {
          font-size: 11px;
          color: #999;
        }
        
        .notification-empty {
          padding: 24px 16px;
          text-align: center;
          color: #999;
        }
        
        .notification-prompt {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 300px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          color: #333;
        }
        
        .notification-prompt-content {
          padding: 16px;
        }
        
        .notification-prompt-content h4 {
          margin: 0 0 8px;
          font-size: 16px;
        }
        
        .notification-prompt-content p {
          margin: 0 0 16px;
          font-size: 14px;
          color: #666;
        }
        
        .notification-prompt-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        
        .notification-prompt-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          cursor: pointer;
          font-size: 14px;
        }
        
        .notification-prompt-action.primary {
          background-color: #1a73e8;
          color: white;
          border-color: #1a73e8;
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;