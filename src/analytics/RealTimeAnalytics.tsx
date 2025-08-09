import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  timestamp: Date;
  activeUsers: number;
  gamesInProgress: number;
  serverLoad: number;
  responseTime: number;
}

export const RealTimeAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [isCollecting, setIsCollecting] = useState(true);

  useEffect(() => {
    if (!isCollecting) return;

    const interval = setInterval(() => {
      const newDataPoint: AnalyticsData = {
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

  const currentData = data[data.length - 1];

  return (
    <div className="realtime-analytics">
      <div className="analytics-header">
        <h3>🔴 Real-Time System Analytics</h3>
        <div className="analytics-controls">
          <button 
            className={`btn btn-small ${isCollecting ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setIsCollecting(!isCollecting)}
          >
            {isCollecting ? 'Pause' : 'Resume'} Collection
          </button>
        </div>
      </div>

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
          <div className="chart-area">
            {data.slice(-10).map((point, index) => (
              <div 
                key={index}
                className="chart-bar"
                style={{ 
                  height: `${(point.activeUsers / 3000) * 100}%`,
                  left: `${(index / 9) * 100}%`,
                  width: '8%'
                }}
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
  );
};