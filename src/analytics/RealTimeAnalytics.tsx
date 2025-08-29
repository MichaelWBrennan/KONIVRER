import React, { useState, useEffect } from 'react';
import * as s from './realTimeAnalytics.css.ts';

interface AnalyticsData {
  timestamp: Date;
  activeUsers: number;
  gamesInProgress: number;
  serverLoad: number;
  responseTime: number;
}

interface DashboardMetrics {
  realTimeMetrics: {
    activeUsers24h: number;
    totalEvents24h: number;
    eventsPerSecond: number;
  };
  eventBreakdown: Array<{
    eventType: string;
    count: number;
  }>;
  trends: {
    userGrowth: Array<{
      date: string;
      uniqueUsers: number;
    }>;
    eventVolume: Array<{
      date: string;
      eventType: string;
      count: number;
    }>;
  };
  alerts: {
    activeAnomalies: number;
  };
}

export const RealTimeAnalytics: React.FC = () => {
  const [data, setData]= useState<AnalyticsData[]>([]);
  const [isCollecting, setIsCollecting]= useState(true);
  const [dashboardData, setDashboardData]= useState<DashboardMetrics | null>(null);
  const [loading, setLoading]= useState(true);
  const [view, setView]= useState<'realtime' | 'dashboard' | 'anomalies'>('realtime');

  useEffect(() => {
    // Fetch dashboard data from backend
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!isCollecting) return;

    const interval= setInterval(() => {
      const newDataPoint: AnalyticsData= {
        timestamp: new Date(),
        activeUsers: Math.floor(Math.random() * 1000) + 2000,
        gamesInProgress: Math.floor(Math.random() * 200) + 300,
        serverLoad: Math.random() * 100,
        responseTime: Math.random() * 50 + 10
      };

      setData(prev => [...prev.slice(-20), newDataPoint]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isCollecting]);

  const fetchDashboardData= async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call your backend API
      // const response= await fetch('/api/analytics/dashboard');
      // const data= await response.json();
      
      // Simulated dashboard data
      const mockData: DashboardMetrics= {
        realTimeMetrics: {
          activeUsers24h: 2847,
          totalEvents24h: 15632,
          eventsPerSecond: 0.18,
        },
        eventBreakdown: [
          { eventType: 'install', count: 1245 },
          { eventType: 'merge', count: 3891 },
          { eventType: 'billing', count: 234 },
          { eventType: 'onboarding', count: 892 },
        ],
        trends: {
          userGrowth: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            uniqueUsers: Math.floor(Math.random() * 200) + 100,
          })),
          eventVolume: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            eventType: 'total',
            count: Math.floor(Math.random() * 1000) + 500,
          })),
        },
        alerts: {
          activeAnomalies: 2,
        },
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData= data[data.length - 1];

  if (loading && !dashboardData) {
    return (
      <div className="realtime-analytics">
        <div className="analytics-header">
          <h3>📊 Loading Analytics Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="realtime-analytics">
      <div className="analytics-header">
        <h3>📊 Automerge Pro Analytics Platform</h3>
        <div className="analytics-controls">
          <div className="view-tabs">
            <button 
              className={`btn btn-small ${view === 'realtime' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('realtime')}
            >
              Real-time
            </button>
            <button 
              className={`btn btn-small ${view === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`btn btn-small ${view === 'anomalies' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('anomalies')}
            >
              Anomalies {dashboardData?.alerts.activeAnomalies ? `(${dashboardData.alerts.activeAnomalies})` : ''}
            </button>
          </div>
          {view === 'realtime' && (
            <button 
              className={`btn btn-small ${isCollecting ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsCollecting(!isCollecting)}
            >
              {isCollecting ? 'Pause' : 'Resume'} Collection
            </button>
          )}
        </div>
      </div>

      {view === 'realtime' && (
        <div className="realtime-view">
          {currentData && (
            <div className="realtime-stats">
              <div className="realtime-stat">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{currentData.activeUsers.toLocaleString()}</div>
                <div className="stat-indicator positive">●</div>
              </div>

              <div className="realtime-stat">
                <div className="stat-label">Games in Progress</div>
                <div className="stat-value">{currentData.gamesInProgress}</div>
                <div className="stat-indicator positive">●</div>
              </div>

              <div className="realtime-stat">
                <div className="stat-label">Server Load</div>
                <div className="stat-value">{currentData.serverLoad.toFixed(1)}%</div>
                <div className={`stat-indicator ${currentData.serverLoad > 80 ? 'warning' : 'positive'}`}>●</div>
              </div>

              <div className="realtime-stat">
                <div className="stat-label">Response Time</div>
                <div className="stat-value">{currentData.responseTime.toFixed(0)}ms</div>
                <div className={`stat-indicator ${currentData.responseTime > 40 ? 'warning' : 'positive'}`}>●</div>
              </div>
            </div>
          )}

          <div className="realtime-chart">
            <h4>Live Performance Chart</h4>
            <div className="chart-container">
              <div className={s.chartArea}>
                {data.slice(-10).map((point, index) => (
                  <div 
                    key={index}
                    className={s.chartBar}
                    style={{ height: `${(point.activeUsers / 3000) * 100}%`, left: `${(index / 9) * 100}%`, width: '8%' }}
                    title={`${point.activeUsers} users at ${point.timestamp.toLocaleTimeString()}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="system-alerts">
            <div className="alert-item success">
              <span className="alert-icon">✅</span>
              <span>All systems operational</span>
              <span className="alert-time">Now</span>
            </div>
            
            {currentData && currentData.serverLoad > 80 && (
              <div className="alert-item warning">
                <span className="alert-icon">⚠️</span>
                <span>High server load detected</span>
                <span className="alert-time">Now</span>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'dashboard' && dashboardData && (
        <div className="dashboard-view">
          <div className="dashboard-metrics">
            <div className="metric-card">
              <h4>Active Users (24h)</h4>
              <div className="metric-value">{dashboardData.realTimeMetrics.activeUsers24h.toLocaleString()}</div>
              <div className="metric-change positive">+12.5%</div>
            </div>
            
            <div className="metric-card">
              <h4>Total Events (24h)</h4>
              <div className="metric-value">{dashboardData.realTimeMetrics.totalEvents24h.toLocaleString()}</div>
              <div className="metric-change positive">+8.2%</div>
            </div>
            
            <div className="metric-card">
              <h4>Events/Second</h4>
              <div className="metric-value">{dashboardData.realTimeMetrics.eventsPerSecond.toFixed(2)}</div>
              <div className="metric-change neutral">Stable</div>
            </div>
            
            <div className="metric-card">
              <h4>Active Anomalies</h4>
              <div className="metric-value">{dashboardData.alerts.activeAnomalies}</div>
              <div className={`metric-change ${dashboardData.alerts.activeAnomalies > 0 ? 'warning' : 'positive'}`}>
                {dashboardData.alerts.activeAnomalies > 0 ? 'Requires Attention' : 'All Clear'}
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-section">
              <h4>Event Breakdown</h4>
              <div className="event-breakdown">
                {dashboardData.eventBreakdown.map((event, index) => (
                  <div key={event.eventType} className={s.eventItem}>
                    <span className="event-type">{event.eventType}</span>
                    <span className="event-count">{event.count.toLocaleString()}</span>
                    <div 
                      className={s.eventBar} 
                      style={{ width: `${(event.count / Math.max(...dashboardData.eventBreakdown.map(e => e.count))) * 100}%`, backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-section">
              <h4>User Growth Trend (7 days)</h4>
              <div className="trend-chart">
                {dashboardData.trends.userGrowth.map((day) => (
                  <div key={day.date} className={s.trendBar}>
                    <div 
                      className={s.trendBarInner} 
                      style={{ height: `${(day.uniqueUsers / Math.max(...dashboardData.trends.userGrowth.map(d => d.uniqueUsers))) * 100}%` }}
                      title={`${day.date}: ${day.uniqueUsers} users`}
                    />
                    <div className={s.trendLabel}>{day.date.split('-').slice(-1)[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'anomalies' && (
        <div className="anomalies-view">
          <div className="anomaly-header">
            <h4>🚨 Anomaly Detection Center</h4>
            <button className="btn btn-small btn-primary" onClick={fetchDashboardData}>
              Refresh
            </button>
          </div>
          
          {dashboardData?.alerts.activeAnomalies === 0 ? (
            <div className="no-anomalies">
              <div className="success-icon">✅</div>
              <h3>All Systems Normal</h3>
              <p>No anomalies detected in the last 24 hours</p>
            </div>
          ) : (
            <div className="anomalies-list">
              <div className="anomaly-item critical">
                <div className="anomaly-header">
                  <span className="severity critical">CRITICAL</span>
                  <span className="metric">billing_failures</span>
                  <span className="time">5 minutes ago</span>
                </div>
                <div className="anomaly-description">
                  Payment failure rate exceeded normal threshold by 250%
                </div>
                <div className="anomaly-details">
                  <span>Current: 15 failures/hour</span>
                  <span>Expected: 4 failures/hour</span>
                  <span>Deviation: +275%</span>
                </div>
                <div className="anomaly-actions">
                  <button className="btn btn-small btn-primary">Acknowledge</button>
                  <button className="btn btn-small btn-secondary">View Details</button>
                </div>
              </div>

              <div className="anomaly-item medium">
                <div className="anomaly-header">
                  <span className="severity medium">MEDIUM</span>
                  <span className="metric">response_time</span>
                  <span className="time">12 minutes ago</span>
                </div>
                <div className="anomaly-description">
                  Average response time spike detected during peak hours
                </div>
                <div className="anomaly-details">
                  <span>Current: 340ms</span>
                  <span>Expected: 150ms</span>
                  <span>Deviation: +127%</span>
                </div>
                <div className="anomaly-actions">
                  <button className="btn btn-small btn-primary">Acknowledge</button>
                  <button className="btn btn-small btn-secondary">View Details</button>
                </div>
              </div>
            </div>
          )}

          <div className="anomaly-insights">
            <h4>💡 Insights & Recommendations</h4>
            <ul>
              <li>Consider scaling payment processing infrastructure during peak hours</li>
              <li>Implement circuit breaker pattern for billing service resilience</li>
              <li>Monitor user experience impact of response time fluctuations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};