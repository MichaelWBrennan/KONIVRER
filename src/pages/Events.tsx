import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { io } from 'socket.io-client';
import EventManager from '../components/events/EventManager';

// Types
interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  format: string;
  status: 'upcoming' | 'live' | 'completed' | 'registration-open' | 'registration-closed';
  prizePool: string;
  participants: string;
  maxParticipants?: number;
  description: string;
  currentRound?: number;
  totalRounds?: number;
  viewers?: number;
  topPlayers?: string[];
  winner?: string;
  qrCode: string; // Unique QR code for event registration
  registrationDeadline?: string;
}

interface User {
  id: string;
  username: string;
  qrCode: string; // Unique QR code for user identification
  role: 'player' | 'judge' | 'organizer' | 'admin';
  isRegistered?: boolean;
}

interface QRScanLog {
  id: string;
  timestamp: string;
  scannerIdentity?: string;
  scannedCodeType: 'event' | 'user';
  scannedCode: string;
  originatingIP: string;
  deviceFingerprint: string;
  eventId?: string;
  userId?: string;
  result: 'success' | 'failed' | 'suspicious';
  reason?: string;
}

interface Notification {
  id: string;
  type: 'qr_revoked' | 'user_banned' | 'event_updated';
  title: string;
  message: string;
  timestamp: string;
  dismissed: boolean;
  eventId?: string;
  userId?: string;
  reason?: string;
  severity: 'low' | 'medium' | 'high';
}

export const Events: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'create' | 'admin' | 'scan-history'>('browse');
  const [viewMode, setViewMode] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-123',
    username: 'TestPlayer',
    qrCode: generateSecureQRCode('user', 'user-123'),
    role: 'player'
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scanLogs, setScanLogs] = useState<QRScanLog[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [userStandings, setUserStandings] = useState<{[eventId: string]: any}>({});

  // Sample data initialization
  useEffect(() => {
    initializeSampleData();
    setupWebSocketConnection();
  }, []);

  // WebSocket connection for real-time notifications
  const setupWebSocketConnection = () => {
    const socket = io('/events', {
      auth: { token: localStorage.getItem('authToken') }
    });

    socket.on('qr_code_revoked', (data: any) => {
      addNotification({
        type: 'qr_revoked',
        title: 'QR Code Revoked',
        message: `QR code for ${data.type} has been revoked due to: ${data.reason}`,
        severity: 'high',
        eventId: data.eventId,
        userId: data.userId,
        reason: data.reason
      });
    });

    socket.on('user_action_required', (data: any) => {
      addNotification({
        type: 'user_banned',
        title: 'User Action Required',
        message: `Suspicious activity detected for user ${data.username}`,
        severity: 'medium',
        userId: data.userId
      });
    });

    return () => socket.disconnect();
  };

  function generateSecureQRCode(type: 'event' | 'user', id: string): string {
    // In real implementation, this would be cryptographically secure
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 15);
    return `konivrer://${type}/${id}/${timestamp}/${random}`;
  }

  function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'dismissed'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      dismissed: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }

  const initializeSampleData = () => {
    const sampleEvents: Event[] = [
      {
        id: 'event-1',
        name: 'KONIVRER Championship 2024',
        date: '2024-02-15',
        time: '14:00',
        format: 'Standard',
        status: 'upcoming',
        prizePool: '$5,000',
        participants: '45/128',
        maxParticipants: 128,
        description: 'The premier KONIVRER tournament featuring the best players worldwide.',
        totalRounds: 8,
        qrCode: generateSecureQRCode('event', 'event-1'),
        registrationDeadline: '2024-02-14'
      },
      {
        id: 'event-2',
        name: 'Friday Night KONIVRER',
        date: '2024-02-12',
        time: '18:00',
        format: 'Draft',
        status: 'live',
        prizePool: '$500',
        participants: '24/32',
        maxParticipants: 32,
        description: 'Weekly draft tournament open to all skill levels.',
        currentRound: 3,
        totalRounds: 5,
        viewers: 247,
        topPlayers: ['DragonMaster', 'CardShark', 'ElementalForce'],
        qrCode: generateSecureQRCode('event', 'event-2')
      },
      {
        id: 'event-3',
        name: 'Winter Cup 2024',
        date: '2024-01-28',
        time: '10:00',
        format: 'Standard',
        status: 'completed',
        prizePool: '$2,500',
        participants: '256/256',
        maxParticipants: 256,
        description: 'Completed winter championship tournament.',
        winner: 'ShadowCaster',
        qrCode: generateSecureQRCode('event', 'event-3')
      }
    ];

    setEvents(sampleEvents);
    
    // Sample registered events
    setRegisteredEvents(['event-2']);
    
    // Sample standings for registered events
    setUserStandings({
      'event-2': {
        position: 5,
        record: '2-1',
        points: 6,
        roundByRound: [
          { round: 1, opponent: 'CardShark', result: 'W', score: '2-1' },
          { round: 2, opponent: 'ElementalForce', result: 'L', score: '1-2' },
          { round: 3, opponent: 'NewPlayer99', result: 'W', score: '2-0' }
        ]
      }
    });
  };

  const registerForEvent = async (eventId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegisteredEvents(prev => [...prev, eventId]);
      
      // Update event participant count
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const [current, max] = event.participants.split('/').map(Number);
          return {
            ...event,
            participants: `${current + 1}/${max}`
          };
        }
        return event;
      }));
      
      addNotification({
        type: 'event_updated',
        title: 'Registration Successful',
        message: `Successfully registered for ${events.find(e => e.id === eventId)?.name}`,
        severity: 'low'
      });
    } catch (error) {
      addNotification({
        type: 'event_updated',
        title: 'Registration Failed',
        message: 'Failed to register for event. Please try again.',
        severity: 'medium'
      });
    }
  };

  const handleQRScan = async (qrData: string) => {
    try {
      // Parse QR code
      const qrPattern = /konivrer:\/\/(event|user)\/([^\/]+)\/([^\/]+)\/([^\/]+)/;
      const match = qrData.match(qrPattern);
      
      if (!match) {
        throw new Error('Invalid QR code format');
      }
      
      const [, type, id] = match;
      
      // Log the scan
      const scanLog: QRScanLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        scannerIdentity: currentUser.username,
        scannedCodeType: type as 'event' | 'user',
        scannedCode: qrData,
        originatingIP: '192.168.1.1', // Would be actual IP
        deviceFingerprint: 'browser-fingerprint-123',
        eventId: type === 'event' ? id : undefined,
        userId: type === 'user' ? id : undefined,
        result: 'success'
      };
      
      setScanLogs(prev => [scanLog, ...prev]);
      
      if (type === 'event') {
        // Register for event via QR scan
        await registerForEvent(id);
        setScanResult(`Successfully registered for event: ${events.find(e => e.id === id)?.name}`);
      } else {
        setScanResult(`Scanned user: ${id}`);
      }
      
    } catch (error) {
      const errorLog: QRScanLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        scannerIdentity: currentUser.username,
        scannedCodeType: 'event', // Default
        scannedCode: qrData,
        originatingIP: '192.168.1.1',
        deviceFingerprint: 'browser-fingerprint-123',
        result: 'failed',
        reason: (error as Error).message
      };
      
      setScanLogs(prev => [errorLog, ...prev]);
      setScanResult(`Failed to process QR code: ${(error as Error).message}`);
    }
  };

  const revokeQRCode = async (type: 'event' | 'user', id: string, reason: string) => {
    try {
      // Simulate API call to revoke QR code
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (type === 'event') {
        setEvents(prev => prev.map(event => 
          event.id === id 
            ? { ...event, qrCode: generateSecureQRCode('event', id) }
            : event
        ));
      } else {
        setCurrentUser(prev => ({
          ...prev,
          qrCode: generateSecureQRCode('user', prev.id)
        }));
      }
      
      addNotification({
        type: 'qr_revoked',
        title: 'QR Code Revoked',
        message: `New QR code generated for ${type}: ${id}`,
        severity: 'low',
        reason
      });
    } catch (error) {
      console.error('Failed to revoke QR code:', error);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, dismissed: true } : n
    ));
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'user_banned',
        title: 'User Banned',
        message: `User ${userId} has been banned: ${reason}`,
        severity: 'high'
      });
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    switch (viewMode) {
      case 'upcoming':
        return ['upcoming', 'registration-open'].includes(event.status);
      case 'live':
        return event.status === 'live';
      case 'past':
        return event.status === 'completed';
      default:
        return true;
    }
  });

  const isTO = ['organizer', 'admin'].includes(currentUser.role);

  return (
    <div className="events-container">
      <style>
        {`
          .events-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .events-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
          }
          
          .tab-nav {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e0e0e0;
            overflow-x: auto;
          }
          
          .tab-button {
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s ease;
          }
          
          .tab-button:hover {
            background: rgba(102, 126, 234, 0.1);
          }
          
          .tab-button.active {
            border-bottom-color: #667eea;
            color: #667eea;
            font-weight: 500;
          }
          
          .view-toggle {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
          
          .toggle-btn {
            padding: 0.5rem 1rem;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
          }
          
          .toggle-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
          }
          
          .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .event-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
          }
          
          .event-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          }
          
          .event-card.registered {
            border-left: 4px solid #4CAF50;
          }
          
          .event-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }
          
          .event-name {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            color: #333;
          }
          
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: uppercase;
          }
          
          .status-badge.upcoming { background: #FFF3CD; color: #856404; }
          .status-badge.live { background: #D4EDDA; color: #155724; }
          .status-badge.completed { background: #D1ECF1; color: #0C5460; }
          
          .event-details {
            margin: 1rem 0;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
          }
          
          .detail-label {
            color: #666;
          }
          
          .detail-value {
            font-weight: 500;
          }
          
          .event-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          
          .btn {
            padding: 0.5rem 1rem;
            border: 1px solid;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .btn-primary {
            background: #667eea;
            color: white;
            border-color: #667eea;
          }
          
          .btn-primary:hover {
            background: #5a6fd8;
          }
          
          .btn-success {
            background: #4CAF50;
            color: white;
            border-color: #4CAF50;
          }
          
          .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border-color: #ddd;
          }
          
          .btn-danger {
            background: #dc3545;
            color: white;
            border-color: #dc3545;
          }
          
          .qr-section {
            text-align: center;
            margin: 1rem 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .notifications-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
          }
          
          .notification-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
          }
          
          .notification-item.high { border-left: 4px solid #dc3545; }
          .notification-item.medium { border-left: 4px solid #ffc107; }
          .notification-item.low { border-left: 4px solid #28a745; }
          
          .notification-close {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #999;
          }
          
          .standings-section {
            margin-top: 1.5rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .round-by-round {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .round-result {
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
          }
          
          .round-result.win { border-left: 3px solid #4CAF50; }
          .round-result.loss { border-left: 3px solid #f44336; }
          
          .admin-section {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .scan-logs {
            max-height: 400px;
            overflow-y: auto;
          }
          
          .scan-log-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
          }
          
          .scan-log-item.suspicious {
            border-left: 3px solid #ffc107;
          }
          
          .scan-log-item.failed {
            border-left: 3px solid #dc3545;
          }
          
          @media (max-width: 768px) {
            .events-container {
              padding: 0.5rem;
            }
            
            .tab-nav {
              flex-wrap: wrap;
            }
            
            .events-grid {
              grid-template-columns: 1fr;
            }
            
            .notifications-panel {
              position: fixed;
              top: 0;
              right: 0;
              left: 0;
              width: auto;
              max-height: 50vh;
            }
            
            .round-by-round {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="events-header">
        <h1>🎪 Events</h1>
        <p>Participate in tournaments, manage events, and compete with players worldwide</p>
      </div>

      {/* Notifications */}
      {notifications.filter(n => !n.dismissed).length > 0 && (
        <div className="notifications-panel">
          {notifications.filter(n => !n.dismissed).slice(0, 5).map(notification => (
            <div key={notification.id} className={`notification-item ${notification.severity}`}>
              <button 
                className="notification-close"
                onClick={() => dismissNotification(notification.id)}
              >
                ✕
              </button>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                {notification.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {notification.message}
              </p>
              {notification.reason && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
                  Reason: {notification.reason}
                </p>
              )}
              {(notification.type === 'user_banned' || notification.type === 'qr_revoked') && isTO && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  {notification.userId && (
                    <button 
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => banUser(notification.userId!, 'Suspicious activity')}
                    >
                      Ban User
                    </button>
                  )}
                  {notification.type === 'qr_revoked' && (
                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => revokeQRCode(
                        notification.eventId ? 'event' : 'user',
                        notification.eventId || notification.userId!,
                        'Manual revocation'
                      )}
                    >
                      Regenerate QR
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button 
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'my-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-events')}
        >
          My Events
        </button>
        {isTO && (
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Event
          </button>
        )}
        {isTO && (
          <button 
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Panel
          </button>
        )}
        {isTO && (
          <button 
            className={`tab-button ${activeTab === 'scan-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan-history')}
          >
            Scan History
          </button>
        )}
      </div>

      {/* Browse Events Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
              onClick={() => setViewMode('upcoming')}
            >
              📅 Upcoming
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'live' ? 'active' : ''}`}
              onClick={() => setViewMode('live')}
            >
              🔴 Live
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'past' ? 'active' : ''}`}
              onClick={() => setViewMode('past')}
            >
              📊 Past
            </button>
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-card ${registeredEvents.includes(event.id) ? 'registered' : ''}`}
              >
                <div className="event-header">
                  <div>
                    <h3 className="event-name">{event.name}</h3>
                  </div>
                  <span className={`status-badge ${event.status}`}>
                    {event.status === 'live' ? '🔴 LIVE' : 
                     event.status === 'upcoming' ? 'Upcoming' : 
                     event.status === 'completed' ? 'Completed' : event.status}
                  </span>
                </div>

                <div className="event-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date & Time:</span>
                    <span className="detail-value">{event.date} at {event.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎯 Format:</span>
                    <span className="detail-value">{event.format}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Prize Pool:</span>
                    <span className="detail-value">{event.prizePool}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👥 Players:</span>
                    <span className="detail-value">{event.participants}</span>
                  </div>
                  {event.status === 'live' && event.currentRound && (
                    <div className="detail-row">
                      <span className="detail-label">🎯 Round:</span>
                      <span className="detail-value">{event.currentRound}/{event.totalRounds}</span>
                    </div>
                  )}
                  {event.winner && (
                    <div className="detail-row">
                      <span className="detail-label">🏆 Winner:</span>
                      <span className="detail-value">{event.winner}</span>
                    </div>
                  )}
                </div>

                <p style={{ margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>
                  {event.description}
                </p>

                {/* QR Code for Event Registration */}
                {event.status === 'upcoming' && (
                  <div className="qr-section">
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>
                      📱 Scan to Register
                    </p>
                    <QRCode 
                      value={event.qrCode} 
                      size={100}
                      style={{ background: 'white', padding: '8px' }}
                    />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                      Quick registration via QR
                    </p>
                  </div>
                )}

                <div className="event-actions">
                  {event.status === 'upcoming' && !registeredEvents.includes(event.id) && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => registerForEvent(event.id)}
                    >
                      Register
                    </button>
                  )}
                  {registeredEvents.includes(event.id) && (
                    <span className="btn btn-success">
                      ✓ Registered
                    </span>
                  )}
                  {event.status === 'live' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSelectedEvent(event)}
                    >
                      📺 Watch Live
                    </button>
                  )}
                  <button className="btn btn-secondary">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Events Tab */}
      {activeTab === 'my-events' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>My Events & Standings</h2>
          
          {/* User QR Code */}
          <div className="qr-section" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>👤 My Player QR Code</h3>
            <QRCode 
              value={currentUser.qrCode} 
              size={150}
              style={{ background: 'white', padding: '12px' }}
            />
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              TOs can scan this for on-site registration
            </p>
            <button 
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => revokeQRCode('user', currentUser.id, 'Manual regeneration')}
            >
              🔄 Regenerate QR Code
            </button>
          </div>

          {/* Registered Events */}
          {registeredEvents.length > 0 ? (
            <div className="events-grid">
              {events.filter(event => registeredEvents.includes(event.id)).map(event => (
                <div key={event.id} className="event-card registered">
                  <div className="event-header">
                    <h3 className="event-name">{event.name}</h3>
                    <span className={`status-badge ${event.status}`}>
                      {event.status === 'live' ? '🔴 LIVE' : event.status}
                    </span>
                  </div>

                  {/* Current Standings */}
                  {userStandings[event.id] && (
                    <div className="standings-section">
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>📊 My Current Standing</h4>
                      <div className="detail-row">
                        <span>Position:</span>
                        <span>#{userStandings[event.id].position}</span>
                      </div>
                      <div className="detail-row">
                        <span>Record:</span>
                        <span>{userStandings[event.id].record}</span>
                      </div>
                      <div className="detail-row">
                        <span>Points:</span>
                        <span>{userStandings[event.id].points}</span>
                      </div>

                      {/* Round-by-Round Results */}
                      {userStandings[event.id].roundByRound && (
                        <div>
                          <h5 style={{ margin: '1rem 0 0.5rem 0' }}>Round-by-Round Results</h5>
                          <div className="round-by-round">
                            {userStandings[event.id].roundByRound.map((round: any, index: number) => (
                              <div key={index} className={`round-result ${round.result.toLowerCase()}`}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                  Round {round.round}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                  vs {round.opponent}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: round.result === 'W' ? '#4CAF50' : '#f44336' }}>
                                  {round.result === 'W' ? 'Win' : 'Loss'} ({round.score})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="event-actions" style={{ marginTop: '1rem' }}>
                    {event.status === 'live' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSelectedEvent(event)}
                      >
                        📱 Manage Event
                      </button>
                    )}
                    <button className="btn btn-secondary">
                      View Full Bracket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>You haven't registered for any events yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('browse')}
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      )}

      {/* TO Admin Panel */}
      {activeTab === 'admin' && isTO && (
        <div className="admin-section">
          <h2>🔧 Tournament Organizer Admin Panel</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Quick Actions */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="btn btn-primary">Create New Event</button>
                <button className="btn btn-secondary">Export Player Data</button>
                <button className="btn btn-secondary">Generate Reports</button>
                <button 
                  className="btn btn-danger"
                  onClick={() => revokeQRCode('event', 'event-1', 'Security concern')}
                >
                  Revoke Event QR Codes
                </button>
              </div>
            </div>

            {/* Security Monitoring */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>🔒 Security Monitoring</h3>
              <div className="detail-row">
                <span>Total QR Scans Today:</span>
                <span>{scanLogs.length}</span>
              </div>
              <div className="detail-row">
                <span>Failed Scans:</span>
                <span style={{ color: '#dc3545' }}>
                  {scanLogs.filter(log => log.result === 'failed').length}
                </span>
              </div>
              <div className="detail-row">
                <span>Suspicious Activity:</span>
                <span style={{ color: '#ffc107' }}>
                  {scanLogs.filter(log => log.result === 'suspicious').length}
                </span>
              </div>
              <button 
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
                onClick={() => setActiveTab('scan-history')}
              >
                View Full History
              </button>
            </div>

            {/* Active Notifications */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>🔔 Active Alerts</h3>
              {notifications.filter(n => !n.dismissed && n.severity !== 'low').length > 0 ? (
                notifications.filter(n => !n.dismissed && n.severity !== 'low').slice(0, 3).map(notification => (
                  <div key={notification.id} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{notification.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                      {notification.message}
                    </div>
                    <button 
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => dismissNotification(notification.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No active alerts</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scan History Tab */}
      {activeTab === 'scan-history' && isTO && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>📊 QR Code Scan History</h2>
          
          <div className="scan-logs">
            {scanLogs.length > 0 ? (
              scanLogs.map(log => (
                <div 
                  key={log.id} 
                  className={`scan-log-item ${log.result === 'suspicious' ? 'suspicious' : ''} ${log.result === 'failed' ? 'failed' : ''}`}
                >
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {log.scannedCodeType.toUpperCase()} scan by {log.scannerIdentity || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>
                      IP: {log.originatingIP} | Result: {log.result}
                      {log.reason && ` | ${log.reason}`}
                    </div>
                  </div>
                  <div>
                    {log.result === 'failed' || log.result === 'suspicious' ? (
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => banUser(log.userId || 'unknown', 'Suspicious QR activity')}
                      >
                        Ban User
                      </button>
                    ) : (
                      <span style={{ color: '#4CAF50', fontSize: '0.9rem' }}>✓</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No scan history available
              </p>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <button 
          className="btn btn-primary"
          style={{ borderRadius: '50%', width: '60px', height: '60px', fontSize: '1.5rem' }}
          onClick={() => setIsScanning(!isScanning)}
        >
          📱
        </button>
      </div>

      {/* Simple QR Scanner Modal */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📱 QR Code Scanner</h3>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Paste or enter a QR code to process:
            </p>
            <input
              type="text"
              placeholder="konivrer://event/event-1/..."
              value={scanResult}
              onChange={(e) => setScanResult(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handleQRScan(scanResult)}
              >
                Process QR Code
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setIsScanning(false);
                  setScanResult('');
                }}
              >
                Cancel
              </button>
            </div>
            {scanResult && scanResult !== scanResult && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{scanResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Manager Integration */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1002,
          overflow: 'auto',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 1003
              }}
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <EventManager
              eventId={selectedEvent.id}
              currentUserId={currentUser.id}
              isOrganizer={isTO}
              isJudge={currentUser.role === 'judge' || isTO}
            />
          </div>
        </div>
      )}
    </div>
  );
};