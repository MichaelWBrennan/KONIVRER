import React, { useState } from 'react';

export interface CompanionPageProps {
  userId?: string;
}

export const CompanionPage: React.FC<CompanionPageProps>: any : any = () => {
  const [activeTab, setActiveTab]: any : any = useState<'events' | 'create' | 'history'>('events');

  // TODO: Implement actual user authentication and role management

  // Mock event data - in real app this would come from API
  const activeEvents: any : any = [
    {
      id: 'event-1',
      name: 'Friday Night KONIVRER',
      status: 'In Progress',
      participants: 24,
      currentRound: 3,
      totalRounds: 5
    },
    {
      id: 'event-2', 
      name: 'Standard Weekly',
      status: 'Registration Closed',
      participants: 16,
      currentRound: 1,
      totalRounds: 4
    }
  ];

  return (
    <div className="companion-page">
      <style>
        {`
          .companion-page {
            padding: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            min-height: 100vh;
            background: var(--primary-bg, #1a1a1a);
            color: var(--text-color, #ffffff);
          }
          
          .companion-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          }
          
          .companion-header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2.5rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          
          .companion-header p {
            margin: 0;
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .tab-navigation {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 2px solid #444;
            background: rgba(255,255,255,0.05);
            border-radius: 8px 8px 0 0;
            overflow: hidden;
          }
          
          .tab-button {
            flex: 1;
            padding: 1rem;
            background: transparent;
            border: none;
            color: var(--text-color, #ffffff);
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
          }
          
          .tab-button:hover {
            background: rgba(255,255,255,0.1);
            transform: translateY(-1px);
          }
          
          .tab-button.active {
            background: rgba(102, 126, 234, 0.2);
            border-bottom-color: #667eea;
            color: #667eea;
          }
          
          .tab-content {
            padding: 1rem 0;
            min-height: 400px;
          }
          
          .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .event-card {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(10px);
          }
          
          .event-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            border-color: #667eea;
          }
          
          .event-card.active {
            border-color: #4CAF50;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
          }
          
          .event-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .event-header h3 {
            margin: 0;
            color: #667eea;
            font-size: 1.3rem;
          }
          
          .status-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-badge.in-progress {
            background: #4CAF50;
            color: white;
          }
          
          .status-badge.registration {
            background: #FF9800;
            color: white;
          }
          
          .event-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            margin: 1rem 0;
          }
          
          .event-details .detail-item {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.8);
          }
          
          .event-details .detail-icon {
            margin-right: 0.5rem;
            font-size: 1rem;
          }
          
          .event-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          
          .btn {
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          
          .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: var(--text-color, #ffffff);
            border: 1px solid rgba(255,255,255,0.3);
          }
          
          .btn-secondary:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-1px);
          }
          
          .companion-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
          }
          
          .feature-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            background: rgba(255,255,255,0.1);
            transform: translateY(-2px);
          }
          
          .feature-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
          }
          
          .feature-card h3 {
            margin: 0 0 0.5rem 0;
            color: #667eea;
          }
          
          .feature-card p {
            margin: 0;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.7);
            line-height: 1.4;
          }

          @media (max-width: 768px) {
            .companion-page {
              padding: 0.5rem;
            }
            
            .companion-header h1 {
              font-size: 2rem;
            }
            
            .tab-navigation {
              flex-direction: column;
            }
            
            .tab-button {
              padding: 0.8rem;
            }
            
            .events-grid {
              grid-template-columns: 1fr;
            }
            
            .companion-features {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="companion-header">
        <h1>⚔️ MTG Companion</h1>
        <p>Tournament management, player pairing, and live event tracking</p>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Active Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create Event
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 Event History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'events' && (
          <div>
            <h2>Active Events</h2>
            <div className="events-grid">
              {activeEvents.map(event => (
                <div key={event.id} className={`event-card ${event.status === 'In Progress' ? 'active' : ''}`}>
                  <div className="event-header">
                    <h3>{event.name}</h3>
                    <span className={`status-badge ${event.status === 'In Progress' ? 'in-progress' : 'registration'}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{event.participants} players</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span>Round {event.currentRound}/{event.totalRounds}</span>
                    </div>
                  </div>
                  
                  <div className="event-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        // This would show the EventManager for the selected event
                        console.log('Managing event:', event.id);
                      }}
                    >
                      Manage Event
                    </button>
                    <button className="btn btn-secondary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TODO: Add actual event management integration */}
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <h2>Create New Event</h2>
            <p>Event creation interface would go here. Features would include:</p>
            <div className="companion-features">
              <div className="feature-card">
                <span className="feature-icon">🏆</span>
                <h3>Tournament Setup</h3>
                <p>Configure format, rounds, entry fee, and prize pool</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">👥</span>
                <p>Player registration and deck list submission</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚖️</span>
                <h3>Judge Tools</h3>
                <p>Rules lookup, penalty tracking, and scenario simulation</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h3>Live Updates</h3>
                <p>Real-time pairings, results, and standings via WebSocket</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2>Event History</h2>
            <p>Past tournament results, statistics, and archived events would be displayed here.</p>
            <div className="companion-features">
              <div className="feature-card">
                <span className="feature-icon">📈</span>
                <h3>Performance Analytics</h3>
                <p>Track player performance across multiple events</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🏅</span>
                <h3>Tournament Results</h3>
                <p>Browse historical tournament outcomes and standings</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📋</span>
                <h3>Event Reports</h3>
                <p>Export detailed reports for tournament organizers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanionPage;