import React from 'react';
import { RealTimeAnalytics } from '../analytics/RealTimeAnalytics';

export const Analytics: React.FC = () => {
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>AI-Powered Analytics</h1>
        <p>Track your performance and get personalized insights</p>
      </div>

      <div className="analytics-dashboard">
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Win Rate</h3>
            <div className="stat-value">73.5%</div>
            <div className="stat-change positive">+5.2% this week</div>
          </div>

          <div className="stat-card">
            <h3>Games Played</h3>
            <div className="stat-value">247</div>
            <div className="stat-change positive">+23 this week</div>
          </div>

          <div className="stat-card">
            <h3>Avg. Game Length</h3>
            <div className="stat-value">12.4 min</div>
            <div className="stat-change negative">+1.2 min</div>
          </div>

          <div className="stat-card">
            <h3>Ranking</h3>
            <div className="stat-value">#1,247</div>
            <div className="stat-change positive">↑156 positions</div>
          </div>
        </div>

        <div className="analytics-content">
          <div className="chart-section">
            <div className="chart-card">
              <h3>Performance Trend</h3>
              <div className="chart-placeholder">
                📈 Win rate over the last 30 days
                <div className="mock-chart">
                  <div className="chart-bars">
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '75%' }}></div>
                    <div className="bar" style={{ height: '65%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '73%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Deck Performance</h3>
              <div className="deck-stats">
                <div className="deck-stat">
                  <div className="deck-name">Aggro Red</div>
                  <div className="deck-winrate">Win Rate: 78%</div>
                  <div className="games-count">156 games</div>
                </div>
                <div className="deck-stat">
                  <div className="deck-name">Control Blue</div>
                  <div className="deck-winrate">Win Rate: 71%</div>
                  <div className="games-count">91 games</div>
                </div>
                <div className="deck-stat">
                  <div className="deck-name">Midrange Green</div>
                  <div className="deck-winrate">Win Rate: 65%</div>
                  <div className="games-count">45 games</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ai-insights">
            <div className="insights-card">
              <h3>🤖 AI Insights</h3>
              <div className="insights-list">
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-content">
                    <h4>Strategic Recommendation</h4>
                    <p>Your aggro decks perform 15% better on turns 4-6. Consider adding more mid-game threats.</p>
                    <div className="insight-confidence">Confidence: 87%</div>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⚡</div>
                  <div className="insight-content">
                    <h4>Play Pattern Analysis</h4>
                    <p>You tend to mulligan too conservatively. Keeping borderline hands could improve your win rate by 3-4%.</p>
                    <div className="insight-confidence">Confidence: 73%</div>
                  </div>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🃏</div>
                  <div className="insight-content">
                    <h4>Deck Optimization</h4>
                    <p>Your control deck's win rate drops significantly against aggro. Consider adding more early game interaction.</p>
                    <div className="insight-confidence">Confidence: 91%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="predictions-card">
              <h3>📊 Predictive Analysis</h3>
              <div className="predictions">
                <div className="prediction-item">
                  <h4>Meta Prediction</h4>
                  <p>Aggro decks are expected to increase by 12% in the next tournament cycle</p>
                  <div className="prediction-timeline">Next 2 weeks</div>
                </div>

                <div className="prediction-item">
                  <h4>Personal Performance</h4>
                  <p>Based on your recent trends, you're likely to achieve a 76% win rate next week</p>
                  <div className="prediction-timeline">Next week</div>
                </div>

                <div className="prediction-item">
                  <h4>Ranking Projection</h4>
                  <p>You're on track to reach top 1000 players within 3 weeks</p>
                  <div className="prediction-timeline">Next 3 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detailed-analytics">
          <div className="matchup-analysis">
            <h3>Matchup Analysis</h3>
            <div className="matchup-grid">
              <div className="matchup-item">
                <div className="matchup-opponent">vs Aggro</div>
                <div className="matchup-record">45-23 (66%)</div>
                <div className="matchup-trend positive">↗ Improving</div>
              </div>
              <div className="matchup-item">
                <div className="matchup-opponent">vs Control</div>
                <div className="matchup-record">34-18 (65%)</div>
                <div className="matchup-trend stable">→ Stable</div>
              </div>
              <div className="matchup-item">
                <div className="matchup-opponent">vs Midrange</div>
                <div className="matchup-record">28-14 (67%)</div>
                <div className="matchup-trend positive">↗ Strong</div>
              </div>
              <div className="matchup-item">
                <div className="matchup-opponent">vs Combo</div>
                <div className="matchup-record">12-8 (60%)</div>
                <div className="matchup-trend negative">↘ Declining</div>
              </div>
            </div>
          </div>

          <div className="learning-recommendations">
            <h3>🎓 Learning Recommendations</h3>
            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="recommendation-priority high">High Priority</div>
                <div className="recommendation-content">
                  <h4>Improve Combo Matchups</h4>
                  <p>Your combo win rate has dropped 8% this month. Study recent pro matches and consider sideboard adjustments.</p>
                  <button className="btn btn-small">View Resources</button>
                </div>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-priority medium">Medium Priority</div>
                <div className="recommendation-content">
                  <h4>Optimize Mana Base</h4>
                  <p>Analysis shows 3% of your losses involve mana issues. Review your land counts and ratios.</p>
                  <button className="btn btn-small">Deck Analysis</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RealTimeAnalytics />
    </div>
  );
};