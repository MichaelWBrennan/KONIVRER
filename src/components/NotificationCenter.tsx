import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '../services/notifications';

const NotificationCenter: React.FC    : any = () => {
  const {
    notifications,
    unreadCount,
    isPermissionGranted,
    isSupported,
    markAsRead,
    markAllAsRead,
    markEventAsRead,
    removeNotification,
    requestPermission,
    getNotificationsByEvent,
    getUnreadCountByEvent,
  } = useNotificationStore();

  const [isOpen, setIsOpen]     : any = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt]     : any = useState(false);
  const [selectedEventFilter, setSelectedEventFilter]     : any = useState<string | null>(null);

  useEffect(() => {
    // Don't automatically show permission prompt - only show on event registration
    // This ensures we only ask for notification permission when there's clear context
  }, [isSupported, isPermissionGranted, notifications.length]);

  const handleRequestPermission     : any = async () => {
    const granted     : any = await requestPermission();
    localStorage.setItem('notification-permission-prompted', 'true');
    setShowPermissionPrompt(false);
    
    if (granted) {
      // Show success message
      console.log('Notifications enabled successfully!');
    }
  };

  const dismissPermissionPrompt     : any = () => {
    localStorage.setItem('notification-permission-prompted', 'true');
    setShowPermissionPrompt(false);
  };

  const formatTimestamp     : any = (timestamp: Date) => {
    const now     : any = new Date();
    const diff     : any = now.getTime() - new Date(timestamp).getTime();
    const minutes     : any = Math.floor(diff / 60000);
    const hours     : any = Math.floor(diff / 3600000);
    const days     : any = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getNotificationIcon     : any = (type: string) => {
    switch (type) {
      case 'round_start':
        return '🔥';
      case 'registration_accepted':
        return '✅';
      case 'seating_assignment':
        return '🪑';
      case 'tournament_update':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getEventBadge     : any = (eventId?: string, eventData?: any) => {
    if (!eventId) return null;
    
    const eventName     : any = eventData?.eventName || 'Event';
    const format     : any = eventData?.eventFormat;
    
    return (
      <div style={{
        display: 'inline-block',
        backgroundColor: '#667eea',
        color: 'white',
        fontSize: '0.7rem',
        padding: '0.2rem 0.4rem',
        borderRadius: '4px',
        marginTop: '0.25rem',
        fontWeight: 'bold',
      }}>
        {format ? `${eventName} (${format})` : eventName}
      </div>
    );
  };

  // Group notifications by event for filtering
  const eventGroups     : any = notifications.reduce((acc, notification) => {
    const eventId     : any = notification.eventId || 'general';
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(notification);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const filteredNotifications     : any = selectedEventFilter 
    ? getNotificationsByEvent(selectedEventFilter)
    : notifications;

  if (!isSupported) return null;

  return (
    <>
      {/* Permission Prompt Modal */}
      {showPermissionPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            margin: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              Enable Push Notifications
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#666', lineHeight: 1.5 }}>
              Get notified when rounds start, registration is accepted, and seating assignments are made.
              Stay updated on your tournament progress!
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={dismissPermissionPrompt}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={handleRequestPermission}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666',
            padding: '0.5rem',
          }}
          title="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.25rem',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              width: '1.2rem',
              height: '1.2rem',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '350px',
            maxHeight: '400px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f8f9fa',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Object.keys(eventGroups).length > 1 ? '0.5rem' : 0,
              }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      if (selectedEventFilter) {
                        markEventAsRead(selectedEventFilter);
                      } else {
                        markAllAsRead();
                      }
                      setIsOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Mark {selectedEventFilter ? 'event' : 'all'} read
                  </button>
                )}
              </div>
              
              {/* Event Filter Tabs */}
              {Object.keys(eventGroups).length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '0.25rem',
                  flexWrap: 'wrap',
                }}>
                  <button
                    onClick={() => setSelectedEventFilter(null)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #ddd',
                      backgroundColor: selectedEventFilter === null ? '#667eea' : '#fff',
                      color: selectedEventFilter === null ? '#fff' : '#666',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  >
                    All ({unreadCount})
                  </button>
                  {Object.entries(eventGroups).map(([eventId, notifications]) => {
                    const eventUnread     : any = getUnreadCountByEvent(eventId === 'general' ? undefined : eventId);
                    const eventName     : any = eventId === 'general' ? 'General' : 
                      notifications[0]?.data?.eventName || `Event ${eventId.slice(0, 8)}`;
                    
                    return (
                      <button
                        key={eventId}
                        onClick={() => setSelectedEventFilter(eventId === 'general' ? null : eventId)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #ddd',
                          backgroundColor: selectedEventFilter === (eventId === 'general' ? null : eventId) ? '#667eea' : '#fff',
                          color: selectedEventFilter === (eventId === 'general' ? null : eventId) ? '#fff' : '#666',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        {eventName} ({eventUnread})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification List */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {filteredNotifications.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#666',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔕</div>
                  <p>{selectedEventFilter ? 'No notifications for this event' : 'No notifications yet'}</p>
                  {!isPermissionGranted && !selectedEventFilter && (
                    <button
                      onClick={handleRequestPermission}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        backgroundColor: '#667eea',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Enable Notifications
                    </button>
                  )}
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: notification.read ? '#fff' : '#f8f9ff',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      // Navigate to event if available
                      if (notification.eventId) {
                        window.location.hash = `#/events/${notification.eventId}`;
                        setIsOpen(false);
                      }
                    }}
                  >
                    {!notification.read && (
                      <div style={{
                        position: 'absolute',
                        left: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                      }} />
                    )}
                    
                    <div style={{ 
                      paddingLeft: notification.read ? '1rem' : '1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.25rem',
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <strong style={{
                            fontSize: '0.9rem',
                            color: '#333',
                          }}>
                            {notification.title}
                          </strong>
                        </div>
                        <p style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '0.8rem',
                          color: '#666',
                          lineHeight: 1.4,
                        }}>
                          {notification.message}
                        </p>
                        
                        {/* Event Badge */}
                        {notification.eventId && !selectedEventFilter && 
                          getEventBadge(notification.eventId, notification.data)
                        }
                        
                        {/* Additional Event Details */}
                        {notification.data && (
                          <div style={{ marginTop: '0.5rem' }}>
                            {notification.data.table && (
                              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                📍 Table {notification.data.table}
                                {notification.data.opponentName && ` vs ${notification.data.opponentName}`}
                              </div>
                            )}
                            {notification.data.round && (
                              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                🎯 Round {notification.data.round}
                              </div>
                            )}
                            {notification.data.venue?.location && (
                              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                📍 {notification.data.venue.location}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#999',
                          marginTop: '0.5rem',
                        }}>
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#999',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '0.25rem',
                          marginLeft: '0.5rem',
                        }}
                        title="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: '0.5rem 1rem',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
              }}>
                <button
                  onClick={() => {
                    // Could navigate to full notifications page
                    setIsOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default NotificationCenter;