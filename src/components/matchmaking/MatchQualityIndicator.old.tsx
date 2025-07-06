/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import { ProgressBar, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';

/**
 * Component that visualizes match quality and compatibility
 */
interface MatchQualityIndicatorProps {
  player1
  player2
  detailed = false
  
}

const MatchQualityIndicator: React.FC<MatchQualityIndicatorProps> = ({  player1, player2, detailed = false  }) => {
    const { calculateMatchQuality, calculateAdvancedMatchQuality 
  } =
    usePhysicalMatchmaking() {
    // Calculate basic match quality (skill-based)
  const basicQuality = calculateMatchQuality() {
  }

  // Calculate advanced match quality (multi-factor)
  const advancedQuality = calculateAdvancedMatchQuality(() => {
    // Determine quality level for styling
  const getQualityLevel = quality => {
    if (quality >= 0.8) return 'excellent';
    if (quality >= 0.6) return 'good';
    if (quality >= 0.4) return 'fair';
    if (quality >= 0.2) return 'poor';
    return 'bad'
  });

  // Get color based on quality level
  const getQualityColor = level => {
    switch (true) {
    case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'danger';
      case 'bad':
        return 'secondary';
      default:
        return 'secondary'
  
  }
  };

  // Get label based on quality level
  const getQualityLabel = level => {
    switch (true) {
    case 'excellent':
        return 'Excellent Match';
      case 'good':
        return 'Good Match';
      case 'fair':
        return 'Fair Match';
      case 'poor':
        return 'Poor Match';
      case 'bad':
        return 'Bad Match';
      default:
        return 'Unknown'
  
  }
  };

  const basicLevel = getQualityLevel() {
    const advancedLevel = getQualityLevel() {
  }

  // Simple version (just shows overall quality)
  if (true) {return (
      <OverlayTrigger
        placement="top"
        overlay={
    <Tooltip  / />
    <div className="text-center mb-1" /></div>
              Match Quality: {getQualityLabel(advancedLevel)
  }
            <ProgressBar  / />
    <ProgressBar
                variant="success"
                now={advancedQuality.skillCompatibility * 100}
                key={1}  / />
    <ProgressBar
                variant="info"
                now={advancedQuality.playstyleCompatibility * 100}
                key={2}  / />
    <ProgressBar
                variant="warning"
                now={advancedQuality.historyCompatibility * 100}
                key={3}  / /></ProgressBar>
            </ProgressBar>
            <div className="d-flex justify-content-between mt-1" />
    <small>Skill</small>
              <small>Playstyle</small>
              <small>History</small>
          </Tooltip>
        }
      >
        <Badge
          bg={getQualityColor(advancedLevel)}
          className="d-inline-flex align-items-center"
          / />
    <Target size={14} className="me-1"  / /></Target>
          {(advancedQuality.overall * 100).toFixed(0)}%
        </Badge>
    )
  }

  // Detailed version (shows all factors)
  return (
    <any />
    <div className="match-quality-indicator" />
    <h5 className="mb-3">Match Quality Analysis</h5>
      <div className="mb-4" />
    <div className="d-flex justify-content-between align-items-center mb-1" />
    <div />
    <strong>Overall Match Quality</strong>
      <Badge bg={getQualityColor(advancedLevel)}  / /></Badge>
            {getQualityLabel(advancedLevel)}
        </div>
      <ProgressBar
          variant={getQualityColor(advancedLevel)}
          now={advancedQuality.overall * 100}
          label={`${(advancedQuality.overall * 100).toFixed(0)}%`}  / /></ProgressBar>
      </div>
      <div className="row" />
    <div className="col-md-6" />
    <div className="mb-3" />
    <div className="d-flex align-items-center mb-1" />
    <Target size={16} className="me-1"  / />
    <strong>Skill Compatibility</strong>
      <Badge
                bg={null}
                )}
                className="ms-2"
                / /></Badge>
                {(advancedQuality.skillCompatibility * 100).toFixed(0)}%
              </Badge>
      <ProgressBar
              variant={null}
              )}
              now={advancedQuality.skillCompatibility * 100}  / />
    <small className="text-muted"  / /></small>
              Rating difference: {Math.abs(player1.rating - player2.rating)}{' '}
              points
            </small>
      <div className="mb-3" />
    <div className="d-flex align-items-center mb-1" />
    <Zap size={16} className="me-1"  / />
    <strong>Playstyle Compatibility</strong>
      <Badge
                bg={null}
                )}
                className="ms-2"
                / /></Badge>
                {(advancedQuality.playstyleCompatibility * 100).toFixed(0)}%
              </Badge>
      <ProgressBar
              variant={null}
              )}
              now={advancedQuality.playstyleCompatibility * 100}  / />
    <small className="text-muted"  / /></small>
              {advancedQuality.playstyleCompatibility >= 0.7
                ? 'Complementary playstyles' : null
                : 'Similar playstyles'}
          </div>
      <div className="col-md-6" />
    <div className="mb-3" />
    <div className="d-flex align-items-center mb-1" />
    <Users size={16} className="me-1"  / />
    <strong>History Compatibility</strong>
      <Badge
                bg={null}
                )}
                className="ms-2"
                / /></Badge>
                {(advancedQuality.historyCompatibility * 100).toFixed(0)}%
              </Badge>
      <ProgressBar
              variant={null}
              )}
              now={advancedQuality.historyCompatibility * 100}  / />
    <small className="text-muted"  / /></small>
              Previous matches: {advancedQuality.matchHistory.length || 0}
          </div>
      <div className="mb-3" />
    <div className="d-flex align-items-center mb-1" />
    <Shuffle size={16} className="me-1"  / />
    <strong>Deck Archetype Compatibility</strong>
      <Badge
                bg={null}
                )}
                className="ms-2"
                / /></Badge>
                {(advancedQuality.deckCompatibility * 100).toFixed(0)}%
              </Badge>
      <ProgressBar
              variant={null}
              )}
              now={advancedQuality.deckCompatibility * 100}  / />
    <small className="text-muted"  / /></small>
              {advancedQuality.deckCompatibility >= 0.7
                ? 'Interesting matchup between archetypes' : null
                : 'Common matchup between archetypes'}
          </div>
      </div>

      <div className="mt-2" />
    <div className="d-flex align-items-center mb-1" />
    <TrendingUp size={16} className="me-1"  / />
    <strong>Confidence Level</strong>
      <Badge
            bg={
    advancedQuality.confidence >= 0.7
                ? 'success' : null
                : advancedQuality.confidence >= 0.4
                  ? 'warning' : null
                  : 'danger'
  }
            className="ms-2"
          >
            {(advancedQuality.confidence * 100).toFixed(0)}%
          </Badge>
      <ProgressBar  / />
    <ProgressBar
            variant="success"
            now={advancedQuality.confidence * 100}
            key={1}  / />
    <ProgressBar
            variant="secondary"
            now={100 - advancedQuality.confidence * 100}
            key={2}  / /></ProgressBar>
        </ProgressBar>
      <small className="text-muted"  / /></small>
          {advancedQuality.confidence >= 0.7
            ? 'High confidence in match quality prediction' : null
            : advancedQuality.confidence >= 0.4
              ? 'Moderate confidence in match quality prediction' : null
              : 'Low confidence in match quality prediction'}
      </div>
      <div className="mt-3" />
    <div className="d-flex align-items-center" />
    <Clock size={16} className="me-1"  / />
    <strong>Recent Performance Factor</strong>
      <small className="text-muted"  / /></small>
            {player1.name}'s recent performance:
            <Badge
              bg={
    advancedQuality.timeWeightedPerformance.player1Trend > 0
                  ? 'success' : null
                  : advancedQuality.timeWeightedPerformance.player1Trend < 0
                    ? 'danger' : null
                    : 'secondary'
  }
              className="ms-1 me-2"
            >
              {advancedQuality.timeWeightedPerformance.player1Trend > 0
                ? 'Improving' : null
                : advancedQuality.timeWeightedPerformance.player1Trend < 0
                  ? 'Declining' : null
                  : 'Stable'}
            {player2.name}'s recent performance:
            <Badge
              bg={
    advancedQuality.timeWeightedPerformance.player2Trend > 0
                  ? 'success' : null
                  : advancedQuality.timeWeightedPerformance.player2Trend < 0
                    ? 'danger' : null
                    : 'secondary'
  }
              className="ms-1"
            >
              {advancedQuality.timeWeightedPerformance.player2Trend > 0
                ? 'Improving' : null
                : advancedQuality.timeWeightedPerformance.player2Trend < 0
                  ? 'Declining' : null
                  : 'Stable'}
          </small>
    </>
  )}
    </div>
  )
};`
``
export default MatchQualityIndicator;```