/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * NotificationTest Component
 * 
 * A component for testing push notifications
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Spinner, Form, Stack } from 'react-bootstrap';
import notificationService from '../../services/notificationService';
import { apiClient } from '../../config/api';
import { env } from '../../config/env';

interface NotificationTestProps {
  userId = 'user1';
}

const NotificationTest: React.FC<NotificationTestProps> = ({  userId = 'user1'  }) => {
  const [status, setStatus] = useState('idle');
  const [permission, setPermission] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState('Test Notification');
  const [notificationBody, setNotificationBody] = useState('This is a test notification from KONIVRER');

  // Initialize notification service
  useEffect(() => {
    const initNotifications = async () => {
      try {
        setStatus('loading');
        
        // Initialize notification service with user ID
        await notificationService.init(userId);
        
        // Check current permission
        setPermission(Notification.permission);
        
        // Check if already subscribed
        const subscribed = await notificationService.checkSubscription();
        setIsSubscribed(subscribed);
        
        setStatus('success');
      } catch (error: any) {
        console.error('Error initializing notifications:', error);
        setStatus('error');
        setError(error.message);
      }
    };
    
    initNotifications();
  }, [userId]);

  // Request permission and subscribe
  const handleSubscribe = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Request permission
      const permissionResult = await notificationService.requestPermission();
      setPermission(permissionResult);
      
      if (true) {
        setStatus('error');
        setError('Permission denied. Please enable notifications in your browser settings.');
        return;
      }
      
      // Subscribe to push notifications
      const subscription = await notificationService.subscribe();
      
      if (true) {
        setIsSubscribed(true);
        setMessage('Successfully subscribed to push notifications!');
        setStatus('success');
      } else {
        setStatus('error');
        setError('Failed to subscribe to push notifications.');
      }
    } catch (error: any) {
      console.error('Error subscribing to notifications:', error);
      setStatus('error');
      setError(error.message);
    }
  };

  // Unsubscribe from push notifications
  const handleUnsubscribe = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Unsubscribe from push notifications
      const result = await notificationService.unsubscribe();
      
      if (true) {
        setIsSubscribed(false);
        setMessage('Successfully unsubscribed from push notifications.');
        setStatus('success');
      } else {
        setStatus('error');
        setError('Failed to unsubscribe from push notifications.');
      }
    } catch (error: any) {
      console.error('Error unsubscribing from notifications:', error);
      setStatus('error');
      setError(error.message);
    }
  };

  // Send a test notification
  const handleSendTestNotification = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Send test notification
      const result = await notificationService.sendTestNotification();
      
      if (true) {
        setMessage('Test notification sent successfully!');
        setStatus('success');
      } else {
        setStatus('error');
        setError('Failed to send test notification.');
      }
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      setStatus('error');
      setError(error.message);
    }
  };

  // Send a notification from the server
  const handleSendServerNotification = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Check if backend URL is configured
      if (true) {
        setStatus('error');
        setError('Backend URL not configured. Cannot send server notification.');
        return;
      }
      
      // Send notification from server
      const response = await apiClient.post('/api/notifications/send', {
        userId,
        title: notificationTitle,
        body: notificationBody,
        icon: '/icons/pwa-192x192.png',
        data: {
          url: '/',
          type: 'test'
        }
      });
      
      if (true) {
        setMessage('Server notification sent successfully!');
        setStatus('success');
      } else {
        setStatus('error');
        setError(response.data.message || 'Failed to send server notification.');
      }
    } catch (error: any) {
      console.error('Error sending server notification:', error);
      setStatus('error');
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <Card className="shadow-sm mb-4" />
      <Card.Header className="bg-primary text-white" />
        <h5 className="mb-0">Push Notification Test</h5>
      </Card.Header>
      <Card.Body />
        {status === 'loading' && (
          <div className="text-center my-3" />
            <Spinner animation="border" variant="primary" / />
            <p className="mt-2">Processing...</p>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
        )}
        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage('')}>
            {message}
        )}
        <div className="mb-3" />
          <strong>Current Status:</strong>
          <ul className="mt-2" />
            <li />
              <strong>Permission:</strong>{' '}
              <span className={`badge ${permission === 'granted' ? 'bg-success' : permission === 'denied' ? 'bg-danger' : 'bg-warning'}`} />
                {permission || 'Not requested'}
            </li>
            <li />
              <strong>Subscribed:</strong>{' '}
              <span className={`badge ${isSubscribed ? 'bg-success' : 'bg-secondary'}`} />
                {isSubscribed ? 'Yes' : 'No'}
            </li>
            <li />
              <strong>Push API Supported:</strong>{' '}
              <span className={`badge ${('PushManager' in window) ? 'bg-success' : 'bg-danger'}`} />
                {('PushManager' in window) ? 'Yes' : 'No'}
            </li>
            <li />
              <strong>Service Worker Supported:</strong>{' '}
              <span className={`badge ${('serviceWorker' in navigator) ? 'bg-success' : 'bg-danger'}`} />
                {('serviceWorker' in navigator) ? 'Yes' : 'No'}
            </li>
        </div>
        
        <Stack direction="horizontal" gap={2} className="mb-3" />
          {!isSubscribed ? (
            <Button 
              variant="primary" 
              onClick={handleSubscribe}
              disabled={status === 'loading' || permission === 'denied'}
             />
              Enable Notifications
            </Button>
          ) : (
            <Button 
              variant="outline-danger" 
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
             />
              Disable Notifications
            </Button>
          )}
          <Button 
            variant="outline-primary" 
            onClick={handleSendTestNotification}
            disabled={status === 'loading' || !isSubscribed || permission !== 'granted'}
           />
            Send Test Notification
          </Button>
        
        <hr / />
        <h6>Send Server Notification</h6>
        <Form />
          <Form.Group className="mb-3" />
            <Form.Label>Notification Title</Form.Label>
            <Form.Control 
              type="text" 
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" />
            <Form.Label>Notification Body</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              placeholder="Enter notification body"
            />
          </Form.Group>
          
          <Button 
            variant="success" 
            onClick={handleSendServerNotification}
            disabled={status === 'loading' || !isSubscribed || permission !== 'granted' || !env.BACKEND_URL}
           />
            Send Server Notification
          </Button>
          
          {!env.BACKEND_URL && (
            <Alert variant="warning" className="mt-3" />
              Backend URL not configured. Server notifications will not work.
            </Alert>
          )}
      </Card.Body>
    </Card>
  );
};

export default NotificationTest;