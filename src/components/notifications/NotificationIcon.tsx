/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useMessaging } from '../../contexts/MessagingContext';

interface NotificationIconProps {
  onClick?: () => void;
}

/**
 * NotificationIcon component
 * 
 * Displays a notification bell icon with a badge for unread notifications.
 */
const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick }) => {
  const { isSupported, permission, isSubscribed } = useNotifications();
  const { unreadCount } = useMessaging();
  
  const [showDot, setShowDot] = useState(false);
  
  // Show dot if notifications are supported but not subscribed
  useEffect(() => {
    setShowDot(isSupported && permission !== 'denied' && !isSubscribed);
  }, [isSupported, permission, isSubscribed]);
  
  return (
    <div className="notification-icon-wrapper" onClick={onClick}></div>
      <div className="notification-icon"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></p>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></p>
        </svg>
        
        {/* Show dot if notifications are supported but not subscribed */}
        {showDot && (
          <div className="notification-dot"></div>
        )}
        {/* Show badge with count if there are unread messages */}
        {unreadCount > 0 && (
          <div className="notification-badge"></div>
            {unreadCount > 99 ? '99+' : unreadCount}
        )}
      </div>
  );
};

export default NotificationIcon;