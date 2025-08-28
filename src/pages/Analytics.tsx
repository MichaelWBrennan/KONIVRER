import React from 'react';
import { RealTimeAnalytics } from '../analytics/RealTimeAnalytics';

export const Analytics: React.FC     = () => {
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>AI-Powered Analytics</h1>
        <p>Track your performance and get personalized insights</p>
      </div>

      <div className="analytics-dashboard">
        <div className="analytics-content">
          <div className="coming-soon">
            <h2>Analytics Dashboard Coming Soon</h2>
            <p>Advanced performance tracking and AI-powered insights will be available here.</p>
            <div className="feature-list">
              <ul>
                <li>Real-time performance metrics</li>
                <li>Deck performance analysis</li>
                <li>Matchup statistics</li>
                <li>AI-powered recommendations</li>
                <li>Predictive analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <RealTimeAnalytics />
      </div>
    </div>
  );
};