/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';

/**
 * NotificationTestPage component
 * 
 * This page allows testing of push notifications for tournaments and messages.
 */
const NotificationTestPage: React.FC = () => {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    requestPermission, 
    subscribe,
    unsubscribe,
    showNotification
  } = useNotifications();
  
  const { isAuthenticated, user } = useAuth();
  
  const [notificationType, setNotificationType] = useState('general');
  const [notificationTitle, setNotificationTitle] = useState('KONIVRER Notification');
  const [notificationBody, setNotificationBody] = useState('This is a test notification');
  const [requireInteraction, setRequireInteraction] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  
  // Update subscription status when component mounts
  useEffect(() => {
    updateSubscriptionStatus();
  }, [isSupported, permission, isSubscribed]);
  
  // Update subscription status
  const updateSubscriptionStatus = () => {
    if (!isSupported) {
      setSubscriptionStatus('Push notifications are not supported in this browser');
      return;
    }
    
    if (permission === 'denied') {
      setSubscriptionStatus('Push notifications are blocked. Please enable them in your browser settings.');
      return;
    }
    
    if (permission === 'default') {
      setSubscriptionStatus('Push notification permission has not been requested yet');
      return;
    }
    
    if (isSubscribed) {
      setSubscriptionStatus('You are subscribed to push notifications');
      return;
    }
    
    setSubscriptionStatus('You are not subscribed to push notifications');
  };
  
  // Handle subscribe button click
  const handleSubscribe = async () => {
    try {
      if (permission !== 'granted') {
        const permissionResult = await requestPermission();
        if (permissionResult !== 'granted') {
          setNotificationStatus('Permission denied');
          updateSubscriptionStatus();
          return;
        }
      }
      
      const result = await subscribe();
      setNotificationStatus(result ? 'Subscribed successfully' : 'Failed to subscribe');
      updateSubscriptionStatus();
    } catch (error) {
      setNotificationStatus(`Error: ${error.message}`);
    }
  };
  
  // Handle unsubscribe button click
  const handleUnsubscribe = async () => {
    try {
      const result = await unsubscribe();
      setNotificationStatus(result ? 'Unsubscribed successfully' : 'Failed to unsubscribe');
      updateSubscriptionStatus();
    } catch (error) {
      setNotificationStatus(`Error: ${error.message}`);
    }
  };
  
  // Handle send notification button click
  const handleSendNotification = async () => {
    try {
      // Create notification options based on type
      const options: any = {
        body: notificationBody,
        requireInteraction,
        tag: notificationType,
        data: {
          url: '/',
          type: notificationType
        }
      };
      
      // Add specific options based on notification type
      if (notificationType === 'tournament') {
        options.data.tournamentId = 'test-tournament-123';
        options.data.url = '/tournaments/test-tournament-123/live';
        options.actions = [
          {
            action: 'view-tournament',
            title: 'View Tournament'
          },
          {
            action: 'close',
            title: 'Close'
          }
        ];
      } else if (notificationType === 'message') {
        options.data.senderId = 'test-user-123';
        options.data.url = '/messages/test-user-123';
        options.actions = [
          {
            action: 'view-message',
            title: 'Read Message'
          },
          {
            action: 'close',
            title: 'Close'
          }
        ];
      } else if (notificationType === 'match') {
        options.data.matchId = 'test-match-123';
        options.data.url = '/game/pvp/test-match-123';
        options.actions = [
          {
            action: 'join-match',
            title: 'Join Match'
          },
          {
            action: 'close',
            title: 'Close'
          }
        ];
      }
      
      // Show the notification
      const result = await showNotification(notificationTitle, options);
      
      setNotificationStatus(result ? 'Notification sent successfully' : 'Failed to send notification');
    } catch (error) {
      setNotificationStatus(`Error: ${error.message}`);
    }
  };
  
  // Handle send test notification button click
  const handleSendTestNotification = async () => {
    try {
      const result = await notificationService.sendTestNotification();
      setNotificationStatus(result ? 'Test notification sent successfully' : 'Failed to send test notification');
    } catch (error) {
      setNotificationStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="notification-test-page">
      <div className="container">
        <h1>Push Notification Test</h1>
        
        <div className="notification-status">
          <h2>Status</h2>
          <div className="status-item">
            <strong>Supported:</strong> {isSupported ? 'Yes' : 'No'}
          </div>
          <div className="status-item">
            <strong>Permission:</strong> {permission}
          </div>
          <div className="status-item">
            <strong>Subscribed:</strong> {isSubscribed ? 'Yes' : 'No'}
          </div>
          <div className="status-item">
            <strong>Status:</strong> {subscriptionStatus}
          </div>
          {notificationStatus && (
            <div className="status-item notification-result">
              <strong>Result:</strong> {notificationStatus}
            </div>
          )}
        </div>
        
        <div className="subscription-controls">
          <h2>Subscription</h2>
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleSubscribe}
              disabled={!isSupported || isSubscribed}
            >
              Subscribe
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleUnsubscribe}
              disabled={!isSupported || !isSubscribed}
            >
              Unsubscribe
            </button>
          </div>
        </div>
        
        <div className="notification-form">
          <h2>Send Notification</h2>
          
          <div className="form-group">
            <label htmlFor="notification-type">Notification Type</label>
            <select 
              id="notification-type" 
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <option value="general">General</option>
              <option value="tournament">Tournament</option>
              <option value="message">Message</option>
              <option value="match">Match</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notification-title">Title</label>
            <input 
              type="text" 
              id="notification-title" 
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notification-body">Body</label>
            <textarea 
              id="notification-body" 
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
            />
          </div>
          
          <div className="form-group checkbox">
            <input 
              type="checkbox" 
              id="require-interaction" 
              checked={requireInteraction}
              onChange={(e) => setRequireInteraction(e.target.checked)}
            />
            <label htmlFor="require-interaction">Require Interaction</label>
          </div>
          
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleSendNotification}
              disabled={!isSupported || permission !== 'granted'}
            >
              Send Notification
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleSendTestNotification}
              disabled={!isSupported || permission !== 'granted'}
            >
              Send Test Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;