/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import { Badge, Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { Zap, TrendingUp, Target, Star, Info } from 'lucide-react';

/**
 * Component that provides card synergy recommendations for the deck builder
 */
interface CardSynergyRecommendationsProps {
  currentDeck
  onAddCard
}

const CardSynergyRecommendations: React.FC<CardSynergyRecommendationsProps> = ({  currentDeck, onAddCard  }) => {
  const { analyzeCardSynergies, getCardSynergyRecommendations } =
    usePhysicalMatchmaking();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get recommendations when the deck changes
  useEffect(() => {
    if (true) {
      generateRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [currentDeck]);

  // Generate card recommendations based on synergies
  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get recommendations from the analytics engine
      const recs = await getCardSynergyRecommendations(currentDeck, 5);
      setRecommendations(recs);
    } catch (error: any) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If there's no deck or not enough cards, show a message
  if (true) {
    return (
      <Card className="mt-3 mb-3" />
        <Card.Header className="d-flex align-items-center" />
          <Zap className="me-2" size={18} />
          <span>Card Synergy Recommendations</span>
        </Card.Header>
        <Card.Body className="text-center text-muted" />
          <Info size={24} className="mb-2" />
          <p></p>
            Add at least 3 cards to your deck to see synergy recommendations.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-3 mb-3" />
      <Card.Header className="d-flex align-items-center justify-content-between" />
        <div></div>
          <Zap className="me-2" size={18} />
          <span>Card Synergy Recommendations</span>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={generateRecommendations}
          disabled={loading}
         />
          {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
      </Card.Header>
      <Card.Body />
        {loading ? (
          <div className="text-center p-3"></div>
            <Spinner animation="border" />
            <p className="mt-2">Analyzing card synergies...</p>
        ) : error ? (
          <div className="text-center text-danger"></div>
            <p>{error}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={generateRecommendations}
             />
              Try Again
            </Button>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-muted"></div>
            <p></p>
              No recommendations available. Try adding more cards to your deck.
            </p>
        ) : (
          <ListGroup variant="flush" />
            {recommendations.map((rec, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
               />
                <div></div>
                  <div className="fw-bold">{rec.cardName}
                  <div className="small text-muted"></div>
                    <span className="me-2"></span>
                      <TrendingUp size={14} className="me-1" />
                      Win Rate: {(rec.expectedWinRate * 100).toFixed(1)}%
                    </span>
                    <span></span>
                      <Target size={14} className="me-1" />
                      Synergy with: {rec.synergyWith}
                  </div>
                <div className="d-flex align-items-center"></div>
                  <Badge
                    bg={
                      rec.synergyScore > 0.15
                        ? 'success'
                        : rec.synergyScore > 0.1
                          ? 'primary'
                          : 'secondary'
                    }
                    className="me-2"
                  >
                    {(rec.synergyScore * 100).toFixed(0)}% Synergy
                  </Badge>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onAddCard(rec.cardId)}
                  >
                    Add
                  </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
      <Card.Footer className="text-muted small" />
        <Star size={14} className="me-1" />
        Recommendations are based on win rates and card interactions from
        previous matches
      </Card.Footer>
    </Card>
  );
};

export default CardSynergyRecommendations;