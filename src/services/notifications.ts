import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PushNotification {
  id: string;
  type: 'round_start' | 'registration_accepted' | 'seating_assignment' | 'tournament_update' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  eventId?: string;
}

interface NotificationState {
  // State
  notifications: PushNotification[];
  unreadCount: number;
  isPermissionGranted: boolean;
  isSupported: boolean;
  
  // Actions
  addNotification: (notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => Promise<boolean>;
  initializeNotifications: () => void;
  showBrowserNotification: (notification: PushNotification) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isPermissionGranted: false,
      isSupported: typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator,

      // Actions
      addNotification: (notificationData) => {
        const notification: PushNotification = {
          ...notificationData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100), // Keep max 100 notifications
          unreadCount: state.unreadCount + 1,
        }));

        // Show browser notification if permission granted
        if (get().isPermissionGranted && get().isSupported) {
          get().showBrowserNotification(notification);
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - (state.notifications.find(n => n.id === id && !n.read) ? 1 : 0)),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.unreadCount - (state.notifications.find(n => n.id === id && !n.read) ? 1 : 0),
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      requestPermission: async () => {
        if (!get().isSupported) return false;

        try {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          
          set({ isPermissionGranted: granted });
          return granted;
        } catch (error) {
          console.error('Failed to request notification permission:', error);
          return false;
        }
      },

      initializeNotifications: () => {
        if (!get().isSupported) return;

        // Check current permission status
        const permission = Notification.permission;
        set({ isPermissionGranted: permission === 'granted' });

        // Set up notification click handlers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'notification-click') {
              // Handle notification click - could navigate to relevant page
              console.log('Notification clicked:', event.data);
            }
          });
        }
      },

      // Helper method to show browser notification (not persisted)
      showBrowserNotification: (notification: PushNotification) => {
        if (!get().isSupported || Notification.permission !== 'granted') return;

        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico', // Your app icon
          badge: '/favicon.ico',
          tag: `konivrer-${notification.type}-${notification.eventId || 'general'}`,
          data: {
            notificationId: notification.id,
            type: notification.type,
            eventId: notification.eventId,
            ...notification.data,
          },
          requireInteraction: notification.type === 'round_start' || notification.type === 'seating_assignment',
        });

        browserNotification.onclick = () => {
          window.focus();
          // Mark as read when clicked
          get().markAsRead(notification.id);
          
          // Navigate to relevant page based on notification type
          if (notification.eventId) {
            window.location.hash = `#/events/${notification.eventId}`;
          } else {
            window.location.hash = '#/events';
          }
          
          browserNotification.close();
        };

        // Auto-close after 10 seconds unless requiring interaction
        if (!browserNotification.requireInteraction) {
          setTimeout(() => {
            browserNotification.close();
          }, 10000);
        }
      },
    }),
    {
      name: 'konivrer-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        isPermissionGranted: state.isPermissionGranted,
      }),
    }
  )
);

// Notification service for managing push notifications
export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    const store = useNotificationStore.getState();
    store.initializeNotifications();

    // Request permission on first visit
    if (store.isSupported && Notification.permission === 'default') {
      // Don't automatically request permission, let user trigger it
      console.log('Notification permission not granted. User can enable in settings.');
    }
  }

  public async requestPermission(): Promise<boolean> {
    const store = useNotificationStore.getState();
    return await store.requestPermission();
  }

  public sendNotification(
    type: PushNotification['type'],
    title: string,
    message: string,
    data?: any,
    eventId?: string
  ): void {
    const store = useNotificationStore.getState();
    store.addNotification({
      type,
      title,
      message,
      data,
      eventId,
    });
  }

  // Convenience methods for specific notification types
  public sendRoundStartNotification(eventName: string, round: number, eventId: string): void {
    this.sendNotification(
      'round_start',
      'Round Started',
      `Round ${round} has started for ${eventName}`,
      { round },
      eventId
    );
  }

  public sendRegistrationAcceptedNotification(eventName: string, eventId: string, startTime?: Date): void {
    this.sendNotification(
      'registration_accepted',
      'Registration Accepted',
      `Your registration for ${eventName} has been accepted!`,
      { startTime },
      eventId
    );
  }

  public sendSeatingAssignmentNotification(
    table: number,
    opponentName: string,
    eventId: string,
    round: number
  ): void {
      this.sendNotification(
        'seating_assignment',
        'Seating Assignment',
        `Table ${table}: You're paired against ${opponentName}`,
        { table, opponentName, round },
        eventId
      );
  }

  // Listen to WebSocket events for real-time notifications
  public setupWebSocketNotifications(socket: any): void {
    socket.on('notification.push', (data: any) => {
      this.sendNotification(
        data.type,
        data.title,
        data.message,
        data.data,
        data.eventId
      );
    });

    socket.on('event.round.started', (data: any) => {
      this.sendRoundStartNotification(data.eventName, data.round, data.eventId);
    });

    socket.on('event.registration.accepted', (data: any) => {
      this.sendRegistrationAcceptedNotification(data.eventName, data.eventId, data.startTime);
    });

    socket.on('event.seating.assigned', (data: any) => {
      // This will be called for each player, so check if it's for current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const assignment = data.assignments?.find((a: any) => a.playerId === currentUser.id);
      
      if (assignment) {
        const opponentName = assignment.opponent?.username || 'TBD';
        this.sendSeatingAssignmentNotification(
          assignment.table,
          opponentName,
          data.eventId,
          data.round
        );
      }
    });
  }
}