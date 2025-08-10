import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '../services/notifications';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isPermissionGranted,
    isSupported,
    markAsRead,
    markAllAsRead,
    removeNotification,
    requestPermission,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    // Show permission prompt if notifications are supported but not granted
    if (isSupported && !isPermissionGranted && notifications.length === 0) {
      const hasPromptedBefore = localStorage.getItem('notification-permission-prompted');
      if (!hasPromptedBefore) {
        setShowPermissionPrompt(true);
      }
    }
  }, [isSupported, isPermissionGranted, notifications.length]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    localStorage.setItem('notification-permission-prompted', 'true');
    setShowPermissionPrompt(false);
    
    if (granted) {
      // Show success message
      console.log('Notifications enabled successfully!');
    }
  };

  const dismissPermissionPrompt = () => {
    localStorage.setItem('notification-permission-prompted', 'true');
    setShowPermissionPrompt(false);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
            }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h4>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
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
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#666',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔕</div>
                  <p>No notifications yet</p>
                  {!isPermissionGranted && (
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
                notifications.map((notification) => (
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
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#999',
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