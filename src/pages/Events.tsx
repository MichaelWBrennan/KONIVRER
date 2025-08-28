import React, { useState, useEffect } from 'react';
import * as s from './events.css.ts';
import { NotificationService } from '../services/notifications';

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
  registrationDeadline?: string;
}

interface User {
  id: string;
  username: string;
  role: 'player' | 'judge_l1' | 'judge_l2' | 'judge_l3' | 'tournament_organizer' | 'admin';
  isAuthenticated?: boolean;
}

export const Events: React.FC     : any = () => {
  const [activeTab, setActiveTab]      : any = useState<'browse' | 'my-events' | 'create' | 'admin'>('browse');
  const [viewMode, setViewMode]      : any = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [events]      : any = useState<Event[]>([]);
  const [currentUser, setCurrentUser]      : any = useState<User>({
    id: '',
    username: '',
    role: 'player',
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuthenticationStatus();
    loadEvents();
  }, []);

  const checkAuthenticationStatus      : any = () => {
    const token      : any = localStorage.getItem('authToken');
    const userData      : any = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user      : any = JSON.parse(userData);
        setCurrentUser({
          ...user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  };

  const loadEvents      : any = async () => {
    // Load events from API
    try {
      // const response      : any = await fetch('/api/events');
      // const eventsData      : any = await response.json();
      // setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleEventRegister      : any = async (eventId: string) => {
    try {
      // Register for event first
      console.log('Register for event:', eventId);
      
      // After successful registration, request notification permission if not already granted
      const notificationService      : any = NotificationService.getInstance();
      if (Notification.permission === 'default') {
        const granted      : any = await notificationService.requestPermission();
        if (granted) {
          // Send a welcome notification to confirm notifications are working
          notificationService.sendNotification(
            'system',
            'Notifications Enabled',
            'You\'ll receive notifications about tournament updates and round starts.',
            {},
            eventId
          );
        } else {
          console.log('User declined notification permission');
        }
      }
      
      // TODO: Implement actual event registration API call
      // const response      : any = await fetch(`/api/events/${eventId}/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to register for event');
      // }
      
      // Refresh events list to update registration status
      loadEvents();
    } catch (error) {
      console.error('Failed to register for event:', error);
      // Show error notification
      alert('Failed to register for event. Please try again.');
    }
  };

  const handleEventUnregister      : any = (eventId: string) => {
    // Unregister from event  
    console.log('Unregister from event:', eventId);
  };

  const renderEventCard      : any = (event: Event) => (
    <div key={event.id} className={s.eventCard}>
      <div className={s.eventHeader}>
        <h3 className={s.eventName}>{event.name}</h3>
        <div className={s.eventStatus}>{event.status}</div>
      </div>
      <div className={s.eventDetails}>
        <p><strong>Date:</strong> {event.date} at {event.time}</p>
        <p><strong>Format:</strong> {event.format}</p>
        <p><strong>Prize Pool:</strong> {event.prizePool}</p>
        <p><strong>Participants:</strong> {event.participants}</p>
        <p>{event.description}</p>
      </div>
      <div className={s.actions}>
        <button onClick={() => handleEventRegister(event.id)}>
          Register
        </button>
        <button onClick={() => handleEventUnregister(event.id)}>
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Tournament Events</h1>
        <p>Discover and participate in competitive KONIVRER tournaments</p>
      </div>

      <div className={s.nav}>
        <div className={s.navTabs}>
          <button 
            className={activeTab === 'browse' ? 'active' : ''}
            onClick={() => setActiveTab('browse')}
          >
            Browse Events
          </button>
          <button 
            className={activeTab === 'my-events' ? 'active' : ''}
            onClick={() => setActiveTab('my-events')}
          >
            My Events
          </button>
          {currentUser.role === 'tournament_organizer' || currentUser.role === 'admin' ? (
            <button 
              className={activeTab === 'create' ? 'active' : ''}
              onClick={() => setActiveTab('create')}
            >
              Create Event
            </button>
          ) : null}
          {currentUser.role === 'admin' ? (
            <button 
              className={activeTab === 'admin' ? 'active' : ''}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          ) : null}
        </div>

        {activeTab === 'browse' && (
          <div className={s.viewSelector}>
            <button 
              className={viewMode === 'upcoming' ? 'active' : ''}
              onClick={() => setViewMode('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={viewMode === 'live' ? 'active' : ''}
              onClick={() => setViewMode('live')}
            >
              Live
            </button>
            <button 
              className={viewMode === 'past' ? 'active' : ''}
              onClick={() => setViewMode('past')}
            >
              Past Events
            </button>
          </div>
        )}
      </div>

      <div className={s.content}>
        {activeTab === 'browse' && (
          <div className={s.list}>
            {events.length === 0 ? (
              <div className={s.empty}>
                <h3>No Events Available</h3>
                <p>Check back later for upcoming tournaments and events.</p>
              </div>
            ) : (
              events.map(renderEventCard)
            )}
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="my-events">
            <h2>My Registered Events</h2>
            {currentUser.isAuthenticated ? (
              <p>You haven't registered for any events yet.</p>
            ) : (
              <p>Please log in to view your registered events.</p>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-event">
            <h2>Create New Event</h2>
            <p>Event creation functionality coming soon.</p>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="admin-panel">
            <h2>Event Administration</h2>
            <p>Admin features coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};