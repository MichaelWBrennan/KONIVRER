import React, { useState } from 'react';

export const Events: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      name: 'KONIVRER Championship',
      date: '2024-02-15',
      time: '14:00',
      format: 'Standard',
      prizePool: '$5,000',
      participants: '128/128',
      status: 'Full',
      description: 'The premier KONIVRER tournament featuring the best players worldwide.'
    },
    {
      id: 2,
      name: 'Weekly Draft',
      date: '2024-02-12',
      time: '18:00',
      format: 'Draft',
      prizePool: '$500',
      participants: '24/32',
      status: 'Open',
      description: 'Weekly draft tournament open to all skill levels.'
    },
    {
      id: 3,
      name: 'Beginners League',
      date: '2024-02-14',
      time: '16:00',
      format: 'Standard',
      prizePool: 'Packs',
      participants: '45/64',
      status: 'Open',
      description: 'Perfect for new players to learn and compete.'
    }
  ];

  const liveEvents = [
    {
      id: 4,
      name: 'Pro Tour Qualifier',
      round: 'Round 3 of 8',
      timeRemaining: '45 minutes',
      viewers: 1250,
      topPlayers: ['DragonMaster', 'CardShark', 'ElementalForce', 'VoidWalker']
    }
  ];

  const pastEvents = [
    {
      id: 5,
      name: 'Winter Cup 2024',
      date: '2024-01-28',
      winner: 'ShadowCaster',
      participants: 256,
      format: 'Standard',
      prizePool: '$2,500'
    },
    {
      id: 6,
      name: 'New Year Tournament',
      date: '2024-01-01',
      winner: 'FlameKeeper',
      participants: 128,
      format: 'Limited',
      prizePool: '$1,000'
    }
  ];

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>🎪 Events</h1>
        <p>Participate in tournaments and events to test your skills and win prizes!</p>
      </div>

      <div className="events-tabs">
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button 
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live Events
        </button>
        <button 
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>

      {activeTab === 'upcoming' && (
        <div className="events-grid">
          {upcomingEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className={`status-badge ${event.status === 'Open' ? 'open' : 'full'}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="event-details">
                <div className="detail-row">
                  <span>📅 Date:</span>
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="detail-row">
                  <span>🎯 Format:</span>
                  <span>{event.format}</span>
                </div>
                <div className="detail-row">
                  <span>💰 Prize Pool:</span>
                  <span>{event.prizePool}</span>
                </div>
                <div className="detail-row">
                  <span>👥 Participants:</span>
                  <span>{event.participants}</span>
                </div>
              </div>
              
              <p className="event-description">{event.description}</p>
              
              <div className="event-actions">
                {event.status === 'Open' ? (
                  <button className="btn btn-primary">Register</button>
                ) : (
                  <button className="btn btn-disabled" disabled>Full</button>
                )}
                <button className="btn btn-secondary">Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'live' && (
        <div className="events-grid">
          {liveEvents.map(event => (
            <div key={event.id} className="event-card live-event">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className="status-badge live">🔴 LIVE</span>
              </div>
              
              <div className="live-info">
                <div className="detail-row">
                  <span>⏱️ Current Round:</span>
                  <span>{event.round}</span>
                </div>
                <div className="detail-row">
                  <span>⏰ Time Remaining:</span>
                  <span>{event.timeRemaining}</span>
                </div>
                <div className="detail-row">
                  <span>👀 Viewers:</span>
                  <span>{event.viewers.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="top-players">
                <h4>Top Players:</h4>
                <div className="player-list">
                  {event.topPlayers.map((player, index) => (
                    <span key={index} className="player-tag">
                      #{index + 1} {player}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="event-actions">
                <button className="btn btn-primary">Watch Live</button>
                <button className="btn btn-secondary">Bracket</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'past' && (
        <div className="events-grid">
          {pastEvents.map(event => (
            <div key={event.id} className="event-card past-event">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className="status-badge completed">Completed</span>
              </div>
              
              <div className="event-details">
                <div className="detail-row">
                  <span>📅 Date:</span>
                  <span>{event.date}</span>
                </div>
                <div className="detail-row">
                  <span>🏆 Winner:</span>
                  <span className="winner-name">{event.winner}</span>
                </div>
                <div className="detail-row">
                  <span>👥 Participants:</span>
                  <span>{event.participants}</span>
                </div>
                <div className="detail-row">
                  <span>🎯 Format:</span>
                  <span>{event.format}</span>
                </div>
                <div className="detail-row">
                  <span>💰 Prize Pool:</span>
                  <span>{event.prizePool}</span>
                </div>
              </div>
              
              <div className="event-actions">
                <button className="btn btn-secondary">View Results</button>
                <button className="btn btn-secondary">Replay</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};