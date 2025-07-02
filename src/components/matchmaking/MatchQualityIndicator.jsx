/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import { ProgressBar, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { Target, Zap, Users, Shuffle, TrendingUp, Clock } from 'lucide-react';

/**
 * Component that visualizes match quality and compatibility
 */
const MatchQualityIndicator = ({ player1, player2, detailed = false }) => {
  const { calculateMatchQuality, calculateAdvancedMatchQuality } =
    usePhysicalMatchmaking();

  // Calculate basic match quality (skill-based)
  const basicQuality = calculateMatchQuality(player1.id, player2.id);

  // Calculate advanced match quality (multi-factor)
  const advancedQuality = calculateAdvancedMatchQuality(player1.id, player2.id);

  // Determine quality level for styling
  const getQualityLevel = quality => {
    if (quality >= 0.8) return 'excellent';
    if (quality >= 0.6) return 'good';
    if (quality >= 0.4) return 'fair';
    if (quality >= 0.2) return 'poor';
    return 'bad';
  };

  // Get color based on quality level
  const getQualityColor = level => {
    switch (level) {
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
        return 'secondary';
    }
  };

  // Get label based on quality level
  const getQualityLabel = level => {
    switch (level) {
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
        return 'Unknown';
    }
  };

  const basicLevel = getQualityLevel(basicQuality);
  const advancedLevel = getQualityLevel(advancedQuality.overall);

  // Simple version (just shows overall quality)
  if (!detailed) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <div className="text-center mb-1">
              Match Quality: {getQualityLabel(advancedLevel)}
            </div>
            <ProgressBar>
              <ProgressBar
                variant="success"
                now={advancedQuality.skillCompatibility * 100}
                key={1}
              />
              <ProgressBar
                variant="info"
                now={advancedQuality.playstyleCompatibility * 100}
                key={2}
              />
              <ProgressBar
                variant="warning"
                now={advancedQuality.historyCompatibility * 100}
                key={3}
              />
            </ProgressBar>
            <div className="d-flex justify-content-between mt-1">
              <small>Skill</small>
              <small>Playstyle</small>
              <small>History</small>
            </div>
          </Tooltip>
        }
      >
        <Badge
          bg={getQualityColor(advancedLevel)}
          className="d-inline-flex align-items-center"
        >
          <Target size={14} className="me-1" />
          {(advancedQuality.overall * 100).toFixed(0)}%
        </Badge>
      </OverlayTrigger>
    );
  }

  // Detailed version (shows all factors)
  return (
    <div className="match-quality-indicator">
      <h5 className="mb-3">Match Quality Analysis</h5>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div>
            <strong>Overall Match Quality</strong>
          </div>
          <Badge bg={getQualityColor(advancedLevel)}>
            {getQualityLabel(advancedLevel)}
          </Badge>
        </div>
        <ProgressBar
          variant={getQualityColor(advancedLevel)}
          now={advancedQuality.overall * 100}
          label={`${(advancedQuality.overall * 100).toFixed(0)}%`}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <Target size={16} className="me-1" />
              <strong>Skill Compatibility</strong>
              <Badge
                bg={getQualityColor(
                  getQualityLevel(advancedQuality.skillCompatibility),
                )}
                className="ms-2"
              >
                {(advancedQuality.skillCompatibility * 100).toFixed(0)}%
              </Badge>
            </div>
            <ProgressBar
              variant={getQualityColor(
                getQualityLevel(advancedQuality.skillCompatibility),
              )}
              now={advancedQuality.skillCompatibility * 100}
            />
            <small className="text-muted">
              Rating difference: {Math.abs(player1.rating - player2.rating)}{' '}
              points
            </small>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <Zap size={16} className="me-1" />
              <strong>Playstyle Compatibility</strong>
              <Badge
                bg={getQualityColor(
                  getQualityLevel(advancedQuality.playstyleCompatibility),
                )}
                className="ms-2"
              >
                {(advancedQuality.playstyleCompatibility * 100).toFixed(0)}%
              </Badge>
            </div>
            <ProgressBar
              variant={getQualityColor(
                getQualityLevel(advancedQuality.playstyleCompatibility),
              )}
              now={advancedQuality.playstyleCompatibility * 100}
            />
            <small className="text-muted">
              {advancedQuality.playstyleCompatibility >= 0.7
                ? 'Complementary playstyles'
                : 'Similar playstyles'}
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <Users size={16} className="me-1" />
              <strong>History Compatibility</strong>
              <Badge
                bg={getQualityColor(
                  getQualityLevel(advancedQuality.historyCompatibility),
                )}
                className="ms-2"
              >
                {(advancedQuality.historyCompatibility * 100).toFixed(0)}%
              </Badge>
            </div>
            <ProgressBar
              variant={getQualityColor(
                getQualityLevel(advancedQuality.historyCompatibility),
              )}
              now={advancedQuality.historyCompatibility * 100}
            />
            <small className="text-muted">
              Previous matches: {advancedQuality.matchHistory.length || 0}
            </small>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <Shuffle size={16} className="me-1" />
              <strong>Deck Archetype Compatibility</strong>
              <Badge
                bg={getQualityColor(
                  getQualityLevel(advancedQuality.deckCompatibility),
                )}
                className="ms-2"
              >
                {(advancedQuality.deckCompatibility * 100).toFixed(0)}%
              </Badge>
            </div>
            <ProgressBar
              variant={getQualityColor(
                getQualityLevel(advancedQuality.deckCompatibility),
              )}
              now={advancedQuality.deckCompatibility * 100}
            />
            <small className="text-muted">
              {advancedQuality.deckCompatibility >= 0.7
                ? 'Interesting matchup between archetypes'
                : 'Common matchup between archetypes'}
            </small>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="d-flex align-items-center mb-1">
          <TrendingUp size={16} className="me-1" />
          <strong>Confidence Level</strong>
          <Badge
            bg={
              advancedQuality.confidence >= 0.7
                ? 'success'
                : advancedQuality.confidence >= 0.4
                  ? 'warning'
                  : 'danger'
            }
            className="ms-2"
          >
            {(advancedQuality.confidence * 100).toFixed(0)}%
          </Badge>
        </div>
        <ProgressBar>
          <ProgressBar
            variant="success"
            now={advancedQuality.confidence * 100}
            key={1}
          />
          <ProgressBar
            variant="secondary"
            now={100 - advancedQuality.confidence * 100}
            key={2}
          />
        </ProgressBar>
        <small className="text-muted">
          {advancedQuality.confidence >= 0.7
            ? 'High confidence in match quality prediction'
            : advancedQuality.confidence >= 0.4
              ? 'Moderate confidence in match quality prediction'
              : 'Low confidence in match quality prediction'}
        </small>
      </div>

      {advancedQuality.timeWeightedPerformance && (
        <div className="mt-3">
          <div className="d-flex align-items-center">
            <Clock size={16} className="me-1" />
            <strong>Recent Performance Factor</strong>
          </div>
          <small className="text-muted">
            {player1.name}'s recent performance:
            <Badge
              bg={
                advancedQuality.timeWeightedPerformance.player1Trend > 0
                  ? 'success'
                  : advancedQuality.timeWeightedPerformance.player1Trend < 0
                    ? 'danger'
                    : 'secondary'
              }
              className="ms-1 me-2"
            >
              {advancedQuality.timeWeightedPerformance.player1Trend > 0
                ? 'Improving'
                : advancedQuality.timeWeightedPerformance.player1Trend < 0
                  ? 'Declining'
                  : 'Stable'}
            </Badge>
            {player2.name}'s recent performance:
            <Badge
              bg={
                advancedQuality.timeWeightedPerformance.player2Trend > 0
                  ? 'success'
                  : advancedQuality.timeWeightedPerformance.player2Trend < 0
                    ? 'danger'
                    : 'secondary'
              }
              className="ms-1"
            >
              {advancedQuality.timeWeightedPerformance.player2Trend > 0
                ? 'Improving'
                : advancedQuality.timeWeightedPerformance.player2Trend < 0
                  ? 'Declining'
                  : 'Stable'}
            </Badge>
          </small>
        </div>
      )}
    </div>
  );
};

export default MatchQualityIndicator;
