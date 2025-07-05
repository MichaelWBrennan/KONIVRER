/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useMessaging } from '../contexts/MessagingContext';

/**
 * PushNotificationManager component
 * 
 * This component manages push notification permissions and subscriptions.
 * It also displays a notification banner when needed.
 */
const PushNotificationManager: React.FC = () => {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    requestPermission, 
    subscribe 
  } = useNotifications();
  
  const { isAuthenticated, user } = useAuth();
  const { unreadCount } = useMessaging();
  
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Check if we should show the notification permission banner
  useEffect(() => {
    // Only show banner if:
    // 1. Notifications are supported
    // 2. User is authenticated
    // 3. Permission is not granted
    // 4. User hasn't dismissed the banner
    // 5. Not already subscribed
    if (
      isSupported && 
      isAuthenticated && 
      permission !== 'granted' && 
      !bannerDismissed &&
      !isSubscribed
    ) {
      // Check if we've shown the banner before
      const hasShownBanner = localStorage.getItem('notification_banner_shown');
      
      // If we haven't shown it before, or it's been more than 7 days
      if (!hasShownBanner) {
        setShowBanner(true);
        localStorage.setItem('notification_banner_shown', Date.now().toString());
      } else {
        const lastShown = parseInt(hasShownBanner, 10);
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - lastShown > sevenDaysInMs) {
          setShowBanner(true);
          localStorage.setItem('notification_banner_shown', Date.now().toString());
        }
      }
    }
  }, [isSupported, isAuthenticated, permission, bannerDismissed, isSubscribed]);
  
  // Subscribe to push notifications when permission is granted
  useEffect(() => {
    const subscribeToNotifications = async () => {
      if (isSupported && permission === 'granted' && !isSubscribed && isAuthenticated) {
        await subscribe();
      }
    };
    
    subscribeToNotifications();
  }, [isSupported, permission, isSubscribed, isAuthenticated, subscribe]);
  
  // Handle enable notifications button click
  const handleEnableNotifications = async () => {
    const result = await requestPermission();
    
    if (result === 'granted') {
      await subscribe();
    }
    
    setShowBanner(false);
  };
  
  // Handle dismiss banner button click
  const handleDismissBanner = () => {
    setShowBanner(false);
    setBannerDismissed(true);
    localStorage.setItem('notification_banner_dismissed', 'true');
  };
  
  // Don't render anything if banner is not shown
  if (!showBanner) {
    return null;
  }
  
  return (
    <div className="notification-banner">
      <div className="notification-banner-content">
        <div className="notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div className="notification-message">
          <h4>Enable Notifications</h4>
          <p>Get notified about tournaments, messages, and game updates in real-time.</p>
        </div>
        <div className="notification-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleEnableNotifications}
          >
            Enable
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleDismissBanner}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationManager;