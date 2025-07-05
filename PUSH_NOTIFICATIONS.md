# Push Notifications for KONIVRER Deck Database

This document provides information on how to use the push notification system in the KONIVRER Deck Database application.

## Overview

The push notification system allows users to receive notifications for:
- Tournament updates (start, end, pairings, etc.)
- Messages from other users
- Match invitations
- System announcements

## Technical Implementation

The push notification system uses the following technologies:
- Web Push API
- Service Workers
- VAPID (Voluntary Application Server Identification)
- IndexedDB for offline storage

## Setup Instructions

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate VAPID keys (only needed once):
   ```bash
   npx web-push generate-vapid-keys
   ```

4. Update the `.env` file with your VAPID keys:
   ```
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Client Setup

The client is already configured to use the push notification system. No additional setup is required.

## Testing Push Notifications

1. Start the server and client:
   ```bash
   # In one terminal
   ./start-server.sh
   
   # In another terminal
   ./start-client.sh
   ```

2. Navigate to the notification test page:
   ```
   http://localhost:12000/notification-test
   ```

3. Click "Enable Notifications" to subscribe to push notifications.

4. Test sending notifications:
   - Click "Send Test Notification" to send a client-side notification
   - Fill in the form and click "Send Server Notification" to send a notification from the server

## API Endpoints

### Subscribe to Push Notifications

```
POST /api/notifications/subscribe
```

Request body:
```json
{
  "userId": "user123",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "base64-encoded-key",
      "auth": "base64-encoded-auth"
    }
  }
}
```

### Unsubscribe from Push Notifications

```
POST /api/notifications/unsubscribe
```

Request body:
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/..."
  }
}
```

### Send Notification to a User

```
POST /api/notifications/send
```

Request body:
```json
{
  "userId": "user123",
  "title": "New Tournament",
  "body": "A new tournament has been created!",
  "icon": "/icons/pwa-192x192.png",
  "data": {
    "url": "/tournaments/123",
    "tournamentId": "123",
    "type": "tournament"
  }
}
```

### Broadcast Notification to All Users

```
POST /api/notifications/broadcast
```

Request body:
```json
{
  "title": "System Maintenance",
  "body": "The system will be down for maintenance on Saturday.",
  "icon": "/icons/pwa-192x192.png",
  "data": {
    "url": "/announcements/456",
    "type": "announcement"
  }
}
```

## Client-Side Usage

### Initialize Notification Service

```javascript
import notificationService from '../services/notificationService';

// Initialize with user ID
await notificationService.init('user123');
```

### Subscribe to Push Notifications

```javascript
// Request permission and subscribe
const permission = await notificationService.requestPermission();
if (permission === 'granted') {
  const subscription = await notificationService.subscribe();
  console.log('Subscribed to push notifications:', subscription);
}
```

### Unsubscribe from Push Notifications

```javascript
await notificationService.unsubscribe();
```

### Show a Local Notification

```javascript
await notificationService.showNotification('Hello', {
  body: 'This is a local notification',
  icon: '/icons/pwa-192x192.png',
  badge: '/icons/pwa-192x192.png',
  tag: 'test',
  data: {
    url: '/'
  }
});
```

## Troubleshooting

### Notifications Not Working

1. Check if push notifications are supported in your browser:
   ```javascript
   if ('PushManager' in window && 'serviceWorker' in navigator) {
     console.log('Push notifications are supported');
   } else {
     console.log('Push notifications are not supported');
   }
   ```

2. Check if the service worker is registered:
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Service worker registrations:', registrations);
   });
   ```

3. Check if the subscription is valid:
   ```javascript
   navigator.serviceWorker.ready.then(registration => {
     return registration.pushManager.getSubscription();
   }).then(subscription => {
     console.log('Push subscription:', subscription);
   });
   ```

4. Check browser console for errors.

### Server-Side Issues

1. Check if the VAPID keys are correctly configured.
2. Check if the subscription is correctly stored on the server.
3. Check server logs for errors.

## Browser Support

Push notifications are supported in the following browsers:
- Chrome (desktop and Android)
- Firefox (desktop and Android)
- Edge (desktop)
- Opera (desktop and Android)
- Safari (macOS and iOS 16.4+)

## Resources

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [web-push library](https://github.com/web-push-libs/web-push)