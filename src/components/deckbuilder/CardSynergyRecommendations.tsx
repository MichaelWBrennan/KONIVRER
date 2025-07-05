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
      <Card className="mt-3 mb-3"></Card>
        <Card.Header className="d-flex align-items-center"></Card>
          <Zap className="me-2" size={18} /></Zap>
          <span>Card Synergy Recommendations</span>
        </Card.Header>
        <Card.Body className="text-center text-muted"></Card>
          <Info size={24} className="mb-2" /></Info>
          <p></p>
            Add at least 3 cards to your deck to see synergy recommendations.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-3 mb-3"></Card>
      <Card.Header className="d-flex align-items-center justify-content-between"></Card>
        <div></div>
          <Zap className="me-2" size={18} /></Zap>
          <span>Card Synergy Recommendations</span>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={generateRecommendations}
          disabled={loading}
        ></Button>
          {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body></Card>
        {loading ? (
          <div className="text-center p-3"></div>
            <Spinner animation="border" /></Spinner>
            <p className="mt-2">Analyzing card synergies...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger"></div>
            <p>{error}</p>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={generateRecommendations}
            ></Button>
              Try Again
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-muted"></div>
            <p></p>
              No recommendations available. Try adding more cards to your deck.
            </p>
          </div>
        ) : (
          <ListGroup variant="flush"></ListGroup>
            {recommendations.map((rec, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              ></ListGroup>
                <div></div>
                  <div className="fw-bold">{rec.cardName}</div>
                  <div className="small text-muted"></div>
                    <span className="me-2"></span>
                      <TrendingUp size={14} className="me-1" /></TrendingUp>
                      Win Rate: {(rec.expectedWinRate * 100).toFixed(1)}%
                    </span>
                    <span></span>
                      <Target size={14} className="me-1" /></Target>
                      Synergy with: {rec.synergyWith}
                    </span>
                  </div>
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
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
      <Card.Footer className="text-muted small"></Card>
        <Star size={14} className="me-1" /></Star>
        Recommendations are based on win rates and card interactions from
        previous matches
      </Card.Footer>
    </Card>
  );
};

export default CardSynergyRecommendations;