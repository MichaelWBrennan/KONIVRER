import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Notification Component
 * 
 * A unified notification component that combines functionality from:
 * - NotificationCenter
 * - NotificationIcon
 * - TournamentNotifications
 * - PushNotificationManager
 * 
 * Features:
 * - Notification center with different categories
 * - Real-time notifications
 * - Push notification support
 * - Tournament notifications
 * - Friend requests and messages
 * - System announcements
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';

// Import contexts
import { useNotification } from '../contexts/NotificationContext';

// Import icons
import { Bell, BellRing, X, Check, ChevronRight, Settings, Trash, RefreshCw, AlertCircle, Info, MessageSquare, UserPlus, Trophy, Star, Shield, Gift, Filter, Loader } from 'lucide-react';

// Types
type NotificationType = 'system' | 'tournament' | 'friend' | 'message' | 'achievement' | 'reward';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
type NotificationStatus = 'unread' | 'read' | 'archived' | 'deleted';

interface Notification {
  id: string;
  type: NotificationType;,
  title: string;
  message: string;
  timestamp: Date;
  priority: NotificationPriority;
  status: NotificationStatus;
  actionUrl?: string;
  actionLabel?: string;
  image?: string;
  data?: any
  
}

interface NotificationSettings {
  enablePush: boolean;
  enableSound: boolean;
  enableBadge: boolean;
  mutedTypes: NotificationType[
    ;
  mutedSources: string[
  ];
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string
  
}

interface UnifiedNotificationProps {
  variant?: 'standard' | 'mobile' | 'minimal' | 'tournament';
  onNotificationClick?: (notification: Notification) => void;
  onSettingsChange?: (settings: NotificationSettings) => void;
  className?: string
  
}

const UnifiedNotification: React.FC<UnifiedNotificationProps> = ({
    variant = 'standard',
  onNotificationClick,
  onSettingsChange,
  className = ''
  }) => {
    // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Navigation
  const navigate = useNavigate() {
    // Auth context
  const { user 
  } = useAuth() {
    // Notification context
  const notificationContext = useNotification? .();
  
  // Refs
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // State
  const [notifications, setNotifications] = useState<Notification[
    >([
  ]);
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [settings, setSettings] = useState<NotificationSettings>({ : null
    enablePush: true,
    enableSound: true,
    enableBadge: true,
    mutedTypes: [
    ,
    mutedSources: [
  ],
    doNotDisturb: false
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'default'>('default');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  
  // Initialize notification sound
  useEffect(() => {
    notificationSoundRef.current = new Audio() {
    return () => {
    if (notificationSoundRef.current) {
  
  }
        notificationSoundRef.current.pause() {
    notificationSoundRef.current = null
  }
    }
  }, [
    );
  
  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
    setPermissionStatus(Notification.permission)
  
  }
  }, [
  ]);
  
  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
    if (!user) return;
      
      setIsLoading() {
  }
      setError() {
    try {
  }
        // Use context if available
        if (notificationContext? .getNotifications) {
    const userNotifications = await notificationContext.getNotifications() {
    setNotifications(userNotifications)
  
  } else {
    // Mock data : null
          const mockNotifications: Notification[
    = [
    {
    id: '1',
              type: 'system',
              title: 'Welcome to KONIVRER',
              message: 'Thank you for joining KONIVRER. Explore the game and have fun!',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              priority: 'medium',
              status: 'unread'
  
  },
            {
    id: '2',
              type: 'tournament',
              title: 'Tournament Registration Open',
              message: 'Registration for the KONIVRER Championship Series is now open. Register before spots fill up!',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              priority: 'high',
              status: 'unread',
              actionUrl: '/tournaments/1',
              actionLabel: 'Register Now'
  },
            {
    id: '3',
              type: 'friend',
              title: 'New Friend Request',
              message: 'Player123 sent you a friend request',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              priority: 'medium',
              status: 'read',
              data: {
    userId: 'user123',
                username: 'Player123'
  
  }
            },
            {
    id: '4',
              type: 'message',
              title: 'New Message',
              message: 'Player456: Hey, want to play a match? ', : null
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              priority: 'medium',
              status: 'read',
              actionUrl: '/messages/user456',
              data: {
    userId: 'user456',
                username: 'Player456',
                messageId: 'msg123'
  
  }
            },
            {
    id: '5',
              type: 'achievement',
              title: 'Achievement Unlocked',
              message: 'You\'ve unlocked the "First Victory" achievement!',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              priority: 'low',
              status: 'read',
              image: '/assets/achievements/first-victory.png'
  }
  
  ];
          
          setNotifications(mockNotifications)
        }
      } catch (err) {
    console.error() {
    setError('Failed to load notifications')
  
  } finally {
    setIsLoading(false)
  }
    };
    
    loadNotifications() {
    // Set up polling or real-time updates
    const intervalId = setInterval() {
  } // Poll every minute
    
    return () => {
    clearInterval(intervalId)
  }
  }, [user, notificationContext]);
  
  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
    if (!user) return;
      
      try {
  }
        // Use context if available
        if (notificationContext? .getSettings) {
    const userSettings = await notificationContext.getSettings() {
    setSettings(userSettings)
  
  } else {
    // Use default settings
          // In a real app, these would be loaded from user preferences
  }
      } catch (err) { : null
        console.error('Error loading notification settings:', err)
      }
    };
    
    loadSettings()
  }, [user, notificationContext]);
  
  // Handle new notifications
  useEffect(() => {
    // This would be connected to a real-time system like WebSockets in a real app
    const handleNewNotification = (notification: Notification) => {
    // Add to notifications list
      setNotifications(() => {
    // Play sound if enabled
      if (settings.enableSound && notificationSoundRef.current) {
    notificationSoundRef.current.play().catch(err => console.error('Error playing notification sound:', err))
  
  })
      
      // Show browser notification if enabled
      if (settings.enablePush && permissionStatus === 'granted') {
    try {
  }
          new Notification(notification.title, {
    body: notification.message,
            icon: '/favicon.ico'
  })
        } catch (err) {
    console.error('Error showing browser notification:', err)
  }
      }
    };
    
    // Set up event listener
    if (notificationContext? .subscribe) {
    const unsubscribe = notificationContext.subscribe() {
    return unsubscribe
  
  }
    
    // Mock real-time notifications for demo
    const timeoutId = setTimeout(() => { : null
      const mockNotification: Notification = {
    id: `new-${Date.now()`
  }`,
        type: 'system',
        title: 'New Feature Available',
        message: 'Check out the new deck builder features!',
        timestamp: new Date(),
        priority: 'medium',
        status: 'unread',
        actionUrl: '/decks/builder'
      };
      
      handleNewNotification(mockNotification)
    }, 30000); // After 30 seconds
    
    return () => {
    clearTimeout(timeoutId)
  }
  }, [settings, permissionStatus, notificationContext]);
  
  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') {
    return notifications
  
  }
    
    return notifications.filter(notification => notification.type === activeFilter);
  }, [notifications, activeFilter]);
  
  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(notification => notification.status === 'unread').length;
  }, [notifications]);
  
  // Request notification permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
    setError() {
    return
  
  }
    
    try {
    const permission = await Notification.requestPermission() {
  }
      setPermissionStatus() {
    if (permission === 'granted') {
  }
        setSettings(prev => ({
    ...prev,
          enablePush: true
  }));
        
        // Update settings
        if (onSettingsChange) {
    onSettingsChange({
    ...settings,
            enablePush: true
  
  })
        }
      }
    } catch (err) {
    console.error() {
    setError('Failed to request notification permission')
  
  }
  };
  
  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'read' 
  } 
          : notification
      )
    );
    
    // Update in context/backend
    if (notificationContext? .markAsRead) {
    notificationContext.markAsRead(notificationId)
  }
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.status === 'unread'  : null
          ? { ...notification, status: 'read' 
  } 
          : notification
      )
    );
    
    // Update in context/backend
    if (notificationContext? .markAllAsRead) {
    notificationContext.markAllAsRead()
  }
  };
  
  // Delete notification : null
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId);
    );
    
    // Update in context/backend
    if (notificationContext? .deleteNotification) {
    notificationContext.deleteNotification(notificationId)
  
  }
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
    setNotifications(() => {
    // Update in context/backend
      if (notificationContext?.clearAllNotifications) {
    notificationContext.clearAllNotifications()
  
  })
    }
  };
  
  // Update settings : null
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = {
    ...settings,
      ...newSettings
  
  };
    
    setSettings(() => {
    // Update in context/backend
    if (onSettingsChange) {
    onSettingsChange(updatedSettings)
  })
  };
  
  // Toggle notification type mute
  const toggleNotificationType = (type: NotificationType) => {,
    const mutedTypes = [...settings.mutedTypes];
    const index = mutedTypes.indexOf(() => {
    if (index === -1) {
    mutedTypes.push(type)
  }) else {
    mutedTypes.splice(index, 1)
  }
    
    updateSettings({ mutedTypes })
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead() {
    // Close notification panel
    setShowNotifications(() => {
    // Navigate if action URL is provided
    if (notification.actionUrl) {
    navigate(notification.actionUrl)
  
  })
    
    // Call callback if provided
    if (onNotificationClick) {
    onNotificationClick(notification)
  }
  };
  
  // Render notification icon
  const renderNotificationIcon = () => {
    return (
      <div className="notification-icon-container" />
    <button 
          className="notification-icon-button"
          onClick={() => setShowNotifications(!showNotifications)
  }
          aria-label="Notifications"
        >
          {unreadCount > 0 ? (
            <any /></any> : null
              <BellRing size={actualVariant === 'minimal' ? 16 : 20}  / />
    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            </>
          ) : (
            <Bell size={actualVariant === 'minimal' ? 16 : 20}  / /></Bell>
          )}
        </button>
      </div>
    )
  };
  
  // Render notification item
  const renderNotificationItem = (notification: Notification) => {
    return (`
      <div `
        key={notification.id`
  }```
        className={`notification-item ${notification.status} ${notification.priority}`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="notification-icon" /></div>
          {notification.type === 'system' && <Info size={20}  />}
          {notification.type === 'tournament' && <Trophy size={20}  />}
          {notification.type === 'friend' && <UserPlus size={20}  />}
          {notification.type === 'message' && <MessageSquare size={20}  />}
          {notification.type === 'achievement' && <Star size={20}  />}
          {notification.type === 'reward' && <Gift size={20}  />}
        </div>
        
        <div className="notification-content" />
    <div className="notification-header" />
    <h4 className="notification-title">{notification.title}</h4>
            <span className="notification-time" /></span>
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          
          <p className="notification-message">{notification.message}</p>
          
          {notification.actionLabel && (
            <div className="notification-action" />
    <button className="action-button" /></button>
                {notification.actionLabel}
                <ChevronRight size={16}  / /></ChevronRight>
              </button>
            </div>
          )}
        </div>
        
        <div className="notification-actions" /></div>
          {notification.status === 'unread' && (
            <button 
              className="mark-read-button"
              onClick={(e) => {
    e.stopPropagation() {
    markAsRead(notification.id)
  
  }}
              aria-label="Mark as read"
            >
              <Check size={16}  / /></Check>
            </button>
          )}
          
          <button 
            className="delete-button"
            onClick={(e) => {
    e.stopPropagation() {
    deleteNotification(notification.id)
  
  }}
            aria-label="Delete notification"
          >
            <X size={16}  / /></X>
          </button>
        </div>
      </div>
    )
  };
  
  // Render notification panel
  const renderNotificationPanel = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 
  }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="notification-panel"
       />
    <div className="notification-panel-header" />
    <h3>Notifications</h3>
          
          <div className="panel-actions" /></div>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-button"
                onClick={markAllAsRead}
               />
    <Check size={16}  / />
    <span>Mark all as read</span>
              </button>
            )}
            
            <button 
              className="settings-button"
              onClick={() => {
    setShowSettings() {
    setShowNotifications(false)
  
  }}
            >
              <Settings size={16}  / /></Settings>
            </button>
            
            <button 
              className="close-button"
              onClick={() => setShowNotifications(false)}
            >
              <X size={16}  / /></X>
            </button>
          </div>
        </div>
        `
        <div className="notification-filters" /></div>``
          <button ```
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'system' ? 'active' : ''}`}
            onClick={() => setActiveFilter('system')}
          >
            <Info size={16}  / />
    <span>System</span>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'tournament' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tournament')}
          >
            <Trophy size={16}  / />
    <span>Tournaments</span>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'friend' ? 'active' : ''}`}
            onClick={() => setActiveFilter('friend')}
          >
            <UserPlus size={16}  / />
    <span>Friends</span>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'message' ? 'active' : ''}`}
            onClick={() => setActiveFilter('message')}
          >
            <MessageSquare size={16}  / />
    <span>Messages</span>
          </button>
        </div>
        
        <div className="notification-list" /></div>
          {isLoading ? (
            <div className="loading-container" />
    <Loader size={24} className="spinner"  / />
    <p>Loading notifications...</p>
            </div> : null
          ) : error ? (
            <div className="error-container" />
    <AlertCircle size={24}  / />
    <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => {
    setError() {
    setIsLoading(() => {
    // Reload notifications
                  setTimeout(() => {
    setIsLoading(false)
  
  }), 1000)
                }}
              >
                <RefreshCw size={16}  / />
    <span>Retry</span>
              </button>
            </div> : null
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-container" />
    <Bell size={24}  / />
    <p>No notifications</p>
            </div> : null
          ) : (
            filteredNotifications.map(notification => renderNotificationItem(notification))
          )}
        </div>
        
        {filteredNotifications.length > 0 && (
          <div className="notification-panel-footer" />
    <button 
              className="clear-all-button"
              onClick={clearAllNotifications}
             />
    <Trash size={16}  / />
    <span>Clear All</span>
            </button>
          </div>
        )}
      </motion.div>
    )
  };
  
  // Render settings panel
  const renderSettingsPanel = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 
  }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="settings-panel"
       />
    <div className="settings-panel-header" />
    <h3>Notification Settings</h3>
          
          <button 
            className="close-button"
            onClick={() => setShowSettings(false)}
          >
            <X size={16}  / /></X>
          </button>
        </div>
        
        <div className="settings-content" />
    <div className="settings-section" />
    <h4>General Settings</h4>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Bell size={16}  / />
    <span>Push Notifications</span>
              </div>
              
              <div className="setting-control" /></div>
                {permissionStatus === 'granted' ? (
                  <label className="toggle-switch" />
    <input
                      type="checkbox"
                      checked={settings.enablePush} : null
                      onChange={(e) => updateSettings({ enablePush: e.target.checked })}
                    />
                    <span className="toggle-slider" /></span>
                  </label>
                ) : (
                  <button 
                    className="permission-button"
                    onClick={requestPermission}
                   /></button>
                    Enable
                  </button>
                )}
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <BellRing size={16}  / />
    <span>Notification Sounds</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={settings.enableSound}
                    onChange={(e) => updateSettings({ enableSound: e.target.checked })}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Shield size={16}  / />
    <span>Do Not Disturb</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={settings.doNotDisturb}
                    onChange={(e) => updateSettings({ doNotDisturb: e.target.checked })}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            {settings.doNotDisturb && (
              <div className="dnd-times" />
    <div className="time-input" />
    <label>From</label>
                  <input
                    type="time"
                    value={settings.doNotDisturbStart || '22:00'}
                    onChange={(e) => updateSettings({ doNotDisturbStart: e.target.value })}
                  />
                </div>
                
                <div className="time-input" />
    <label>To</label>
                  <input
                    type="time"
                    value={settings.doNotDisturbEnd || '08:00'}
                    onChange={(e) => updateSettings({ doNotDisturbEnd: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="settings-section" />
    <h4>Notification Types</h4>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Info size={16}  / />
    <span>System Notifications</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('system')}
                    onChange={() => toggleNotificationType('system')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Trophy size={16}  / />
    <span>Tournament Notifications</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('tournament')}
                    onChange={() => toggleNotificationType('tournament')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <UserPlus size={16}  / />
    <span>Friend Requests</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('friend')}
                    onChange={() => toggleNotificationType('friend')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <MessageSquare size={16}  / />
    <span>Messages</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('message')}
                    onChange={() => toggleNotificationType('message')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Star size={16}  / />
    <span>Achievements</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('achievement')}
                    onChange={() => toggleNotificationType('achievement')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item" />
    <div className="setting-label" />
    <Gift size={16}  / />
    <span>Rewards</span>
              </div>
              
              <div className="setting-control" />
    <label className="toggle-switch" />
    <input
                    type="checkbox"
                    checked={!settings.mutedTypes.includes('reward')}
                    onChange={() => toggleNotificationType('reward')}
                  />
                  <span className="toggle-slider" /></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  };
  
  // Render tournament notifications
  const renderTournamentNotifications = () => {
    const tournamentNotifications = notifications.filter() {
    return (
      <div className="tournament-notifications" />
    <div className="tournament-notifications-header" />
    <h3>Tournament Notifications</h3>
          
          {tournamentNotifications.length > 0 && (
            <button 
              className="mark-all-read-button"
              onClick={() => {
    tournamentNotifications.forEach(notification => {
  
  }
                  if (notification.status === 'unread') {
    markAsRead(notification.id)
  }
                })
              }}
            >
              <Check size={16}  / />
    <span>Mark all as read</span>
            </button>
          )}
        </div>
        
        <div className="tournament-notification-list" /></div>
          {tournamentNotifications.length === 0 ? (
            <div className="empty-container" />
    <Trophy size={24}  / />
    <p>No tournament notifications</p>
            </div> : null
          ) : (
            tournamentNotifications.map(notification => renderNotificationItem(notification))
          )}
        </div>
      </div>
    );
  };
  
  // Render mobile notifications
  const renderMobileNotifications = () => {
    return (
      <div className="mobile-notifications" />
    <div className="mobile-notifications-header" />
    <h3>Notifications</h3>
          
          <div className="mobile-header-actions" /></div>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-button"
                onClick={markAllAsRead
  }
               />
    <Check size={20}  / /></Check>
              </button>
            )}
            
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={20}  / /></Settings>
            </button>
          </div>
        </div>
        `
        <div className="mobile-notification-filters" /></div>``
          <button ```
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'system' ? 'active' : ''}`}
            onClick={() => setActiveFilter('system')}
          >
            <Info size={16}  / /></Info>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'tournament' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tournament')}
          >
            <Trophy size={16}  / /></Trophy>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'friend' ? 'active' : ''}`}
            onClick={() => setActiveFilter('friend')}
          >
            <UserPlus size={16}  / /></UserPlus>
          </button>`
          ``
          <button ```
            className={`filter-button ${activeFilter === 'message' ? 'active' : ''}`}
            onClick={() => setActiveFilter('message')}
          >
            <MessageSquare size={16}  / /></MessageSquare>
          </button>
        </div>
        
        <AnimatePresence /></AnimatePresence>
          {showSettings ? (
            renderSettingsPanel() : null
          ) : (
            <div className="mobile-notification-list" /></div>
              {isLoading ? (
                <div className="loading-container" />
    <Loader size={24} className="spinner"  / />
    <p>Loading notifications...</p>
                </div> : null
              ) : error ? (
                <div className="error-container" />
    <AlertCircle size={24}  / />
    <p>{error}</p>
                  <button 
                    className="retry-button"
                    onClick={() => {
    setError() {
    setIsLoading(() => {
    // Reload notifications
                      setTimeout(() => {
    setIsLoading(false)
  
  }), 1000)
                    }}
                  >
                    <RefreshCw size={16}  / />
    <span>Retry</span>
                  </button>
                </div> : null
              ) : filteredNotifications.length === 0 ? (
                <div className="empty-container" />
    <Bell size={24}  / />
    <p>No notifications</p>
                </div> : null
              ) : (
                filteredNotifications.map(notification => renderNotificationItem(notification))
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date() {
    const diff = now.getTime() - timestamp.getTime(() => {
    // Less than a minute
    if (diff < 60 * 1000) {
    return 'Just now'
  
  })
    
    // Less than an hour`
    if (diff < 60 * 60 * 1000) {``
      const minutes = Math.floor(diff / (60 * 1000));```
      return `${minutes}m ago`
    }
    
    // Less than a day`
    if (diff < 24 * 60 * 60 * 1000) {``
      const hours = Math.floor(diff / (60 * 60 * 1000));```
      return `${hours}h ago`
    }
    
    // Less than a week`
    if (diff < 7 * 24 * 60 * 60 * 1000) {``
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));```
      return `${days}d ago`
    }
    
    // Format as date
    return timestamp.toLocaleDateString()
  };
  
  // Render based on variant
  switch (actualVariant) {`
    case 'mobile':``
      return (```
        <div className={`unified-notification mobile-variant ${className`
  }`} /></div>
          {renderMobileNotifications()}
        </div>
      );
      `
    case 'minimal':``
      return (```
        <div className={`unified-notification minimal-variant ${className}`} /></div>
          {renderNotificationIcon()}
          
          <AnimatePresence /></AnimatePresence>
            {showNotifications && renderNotificationPanel()}
          </AnimatePresence>
        </div>
      );
      `
    case 'tournament':``
      return (```
        <div className={`unified-notification tournament-variant ${className}`} /></div>
          {renderTournamentNotifications()}
        </div>
      );
      `
    default:``
      return (```
        <div className={`unified-notification standard-variant ${className}`} /></div>
          {renderNotificationIcon()}
          
          <AnimatePresence /></AnimatePresence>
            {showNotifications && renderNotificationPanel()}
            {showSettings && renderSettingsPanel()}
          </AnimatePresence>
        </div>
      )
  }
};`
``
export default UnifiedNotification;```