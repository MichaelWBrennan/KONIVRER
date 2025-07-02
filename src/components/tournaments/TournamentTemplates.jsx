/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import { Card, Row, Col, Button, Badge, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  Trophy, 
  Users, 
  Clock, 
  Calendar, 
  Shuffle, 
  Layers, 
  Target, 
  BarChart3,
  Zap,
  Star,
  Award,
  Shield,
  Sparkles
} from 'lucide-react';

/**
 * Component for selecting and customizing tournament templates
 */
const TournamentTemplates = ({ onSelectTemplate }) => {
  const { 
    tournaments,
    predictMetagameCycles
  } = usePhysicalMatchmaking();
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customizedTemplate, setCustomizedTemplate] = useState(null);
  const [participantCount, setParticipantCount] = useState(8);
  const [timeConstraint, setTimeConstraint] = useState(180); // minutes
  const [metaBalance, setMetaBalance] = useState(false);
  const [parallelBrackets, setParallelBrackets] = useState(false);
  const [tieredEntry, setTieredEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metaPrediction, setMetaPrediction] = useState(null);
  
  // Template definitions
  const templates = [
    {
      id: 'swiss',
      name: 'Dynamic Swiss',
      description: 'Modified Swiss pairings that maximize interesting matchups and minimize repeat pairings',
      icon: <Shuffle size={24} />,
      minParticipants: 4,
      maxParticipants: 256,
      timePerRound: 50, // minutes
      features: ['dynamic-pairings', 'interesting-matchups', 'tiebreakers'],
      recommendedFor: ['local-tournaments', 'competitive-events', 'large-player-pools']
    },
    {
      id: 'adaptive',
      name: 'Adaptive Structure',
      description: 'Tournament that automatically adjusts format based on participant count and time constraints',
      icon: <Layers size={24} />,
      minParticipants: 4,
      maxParticipants: 128,
      timePerRound: 45, // minutes
      features: ['format-adaptation', 'time-optimization', 'flexible-rounds'],
      recommendedFor: ['unknown-attendance', 'time-limited-venues', 'casual-events']
    },
    {
      id: 'meta-balanced',
      name: 'Meta-Balancing',
      description: 'Tournament structure that rewards playing underrepresented archetypes to encourage diversity',
      icon: <Target size={24} />,
      minParticipants: 8,
      maxParticipants: 64,
      timePerRound: 50, // minutes
      features: ['archetype-rewards', 'meta-diversity', 'balanced-matchups'],
      recommendedFor: ['stale-metagames', 'competitive-innovation', 'showcase-events']
    },
    {
      id: 'tiered',
      name: 'Tiered Entry',
      description: 'Qualification paths that allow players of all skill levels to find appropriate competition',
      icon: <Layers size={24} />,
      minParticipants: 16,
      maxParticipants: 128,
      timePerRound: 50, // minutes
      features: ['skill-based-tiers', 'qualification-paths', 'balanced-competition'],
      recommendedFor: ['mixed-skill-events', 'championship-series', 'inclusive-tournaments']
    },
    {
      id: 'parallel',
      name: 'Parallel Brackets',
      description: 'Run main and consolation brackets simultaneously with automated management',
      icon: <Layers size={24} />,
      minParticipants: 8,
      maxParticipants: 64,
      timePerRound: 50, // minutes
      features: ['main-bracket', 'consolation-bracket', 'continuous-play'],
      recommendedFor: ['elimination-events', 'player-retention', 'spectator-friendly']
    }
  ];
  
  // When a template is selected, set up the customized version
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setCustomizedTemplate({
          ...template,
          participantCount: Math.max(template.minParticipants, Math.min(participantCount, template.maxParticipants)),
          timeConstraint,
          metaBalance,
          parallelBrackets,
          tieredEntry
        });
      }
    }
  }, [selectedTemplate, participantCount, timeConstraint, metaBalance, parallelBrackets, tieredEntry]);
  
  // Get meta prediction for meta-balanced tournaments
  const getMetaPrediction = async () => {
    setLoading(true);
    try {
      // Mock meta prediction data
      const mockPrediction = [
        { archetype: 'Aggro Red', currentPercentage: 25, predictedPercentage: 22, percentageChange: -3, trend: 'falling', confidence: 0.8 },
        { archetype: 'Control Blue', currentPercentage: 20, predictedPercentage: 18, percentageChange: -2, trend: 'falling', confidence: 0.7 },
        { archetype: 'Midrange Green', currentPercentage: 15, predictedPercentage: 20, percentageChange: 5, trend: 'rising', confidence: 0.85 },
        { archetype: 'Combo Yellow', currentPercentage: 10, predictedPercentage: 15, percentageChange: 5, trend: 'rising', confidence: 0.75 },
        { archetype: 'Tempo Purple', currentPercentage: 8, predictedPercentage: 12, percentageChange: 4, trend: 'rising', confidence: 0.65 }
      ];
      
      setMetaPrediction(mockPrediction);
    } catch (error) {
      console.error('Error getting meta prediction:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // When meta balance is enabled, get the prediction
  useEffect(() => {
    if (metaBalance && !metaPrediction) {
      getMetaPrediction();
    }
  }, [metaBalance]);
  
  // Calculate recommended rounds based on participant count
  const calculateRecommendedRounds = (count) => {
    if (count <= 8) return 3;
    if (count <= 16) return 4;
    if (count <= 32) return 5;
    if (count <= 64) return 6;
    if (count <= 128) return 7;
    return 8;
  };
  
  // Calculate estimated duration
  const calculateEstimatedDuration = (template, count) => {
    if (!template) return 0;
    
    const rounds = calculateRecommendedRounds(count);
    return rounds * template.timePerRound;
  };
  
  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };
  
  // Handle template confirmation
  const handleConfirmTemplate = () => {
    if (customizedTemplate) {
      onSelectTemplate(customizedTemplate);
    }
  };
  
  // Render template cards
  const renderTemplateCards = () => {
    return templates.map(template => (
      <Col key={template.id} md={6} lg={4} className="mb-4">
        <Card 
          className={`h-100 ${selectedTemplate === template.id ? 'border-primary' : ''}`}
          onClick={() => handleSelectTemplate(template.id)}
          style={{ cursor: 'pointer' }}
        >
          <Card.Header className="d-flex align-items-center">
            <div className="me-2">
              {template.icon}
            </div>
            <div>
              <h5 className="mb-0">{template.name}</h5>
            </div>
          </Card.Header>
          <Card.Body>
            <p>{template.description}</p>
            
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Features:</small>
              {template.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  bg="primary" 
                  className="me-1 mb-1"
                >
                  {feature}
                </Badge>
              ))}
            </div>
            
            <div>
              <small className="text-muted d-block mb-1">Recommended for:</small>
              {template.recommendedFor.map((rec, index) => (
                <Badge 
                  key={index} 
                  bg="secondary" 
                  className="me-1 mb-1"
                >
                  {rec}
                </Badge>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              <Users size={14} className="me-1" />
              {template.minParticipants}-{template.maxParticipants} participants
            </small>
            <small className="text-muted ms-3">
              <Clock size={14} className="me-1" />
              ~{template.timePerRound} min/round
            </small>
          </Card.Footer>
        </Card>
      </Col>
    ));
  };
  
  // Render template customization
  const renderTemplateCustomization = () => {
    if (!selectedTemplate || !customizedTemplate) return null;
    
    const template = templates.find(t => t.id === selectedTemplate);
    const estimatedDuration = calculateEstimatedDuration(template, participantCount);
    const recommendedRounds = calculateRecommendedRounds(participantCount);
    
    return (
      <Card className="mt-4">
        <Card.Header>
          <h4>Customize Tournament Template</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Participants</Form.Label>
                <Form.Control
                  type="number"
                  min={template.minParticipants}
                  max={template.maxParticipants}
                  value={participantCount}
                  onChange={(e) => setParticipantCount(parseInt(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Min: {template.minParticipants}, Max: {template.maxParticipants}
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Time Constraint (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  min={60}
                  max={480}
                  step={30}
                  value={timeConstraint}
                  onChange={(e) => setTimeConstraint(parseInt(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Total available time for the tournament
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="meta-balance-switch"
                  label="Enable Meta-Balancing Incentives"
                  checked={metaBalance}
                  onChange={(e) => setMetaBalance(e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Reward players using underrepresented archetypes
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="parallel-brackets-switch"
                  label="Enable Parallel Brackets"
                  checked={parallelBrackets}
                  onChange={(e) => setParallelBrackets(e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Run consolation brackets alongside the main event
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="tiered-entry-switch"
                  label="Enable Tiered Entry System"
                  checked={tieredEntry}
                  onChange={(e) => setTieredEntry(e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Create qualification paths for players of different skill levels
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Tournament Summary</Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Template:</strong> {template.name}
                  </div>
                  <div className="mb-3">
                    <strong>Participants:</strong> {participantCount}
                  </div>
                  <div className="mb-3">
                    <strong>Recommended Rounds:</strong> {recommendedRounds}
                  </div>
                  <div className="mb-3">
                    <strong>Estimated Duration:</strong> {estimatedDuration} minutes
                    {estimatedDuration > timeConstraint && (
                      <Alert variant="warning" className="mt-2">
                        <small>
                          Warning: Estimated duration exceeds time constraint.
                          Consider reducing rounds or increasing time constraint.
                        </small>
                      </Alert>
                    )}
                  </div>
                  <div>
                    <strong>Enabled Features:</strong>
                    <div className="mt-1">
                      {template.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          bg="primary" 
                          className="me-1 mb-1"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {metaBalance && (
                        <Badge bg="success" className="me-1 mb-1">meta-balancing</Badge>
                      )}
                      {parallelBrackets && (
                        <Badge bg="success" className="me-1 mb-1">parallel-brackets</Badge>
                      )}
                      {tieredEntry && (
                        <Badge bg="success" className="me-1 mb-1">tiered-entry</Badge>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              {metaBalance && metaPrediction && (
                <Card className="mb-3">
                  <Card.Header>Meta-Balancing Incentives</Card.Header>
                  <Card.Body>
                    <p className="small">
                      Based on meta analysis, the following archetypes will receive incentives:
                    </p>
                    <ul className="list-unstyled">
                      {metaPrediction
                        .filter(p => p.currentPercentage < 15)
                        .map((archetype, index) => (
                          <li key={index} className="mb-2">
                            <Badge bg="success" className="me-2">+20% points</Badge>
                            {archetype.archetype} ({archetype.currentPercentage}% of meta)
                          </li>
                        ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button 
            variant="secondary" 
            className="me-2"
            onClick={() => setSelectedTemplate(null)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleConfirmTemplate}
          >
            Confirm Template
          </Button>
        </Card.Footer>
      </Card>
    );
  };
  
  return (
    <div>
      <h3 className="mb-4">
        <Trophy className="me-2" />
        Tournament Templates
      </h3>
      
      {!selectedTemplate ? (
        <>
          <p className="text-muted mb-4">
            Select a tournament template to get started. Each template offers different features
            and is optimized for specific tournament goals.
          </p>
          
          <Row>
            {renderTemplateCards()}
          </Row>
        </>
      ) : (
        renderTemplateCustomization()
      )}
    </div>
  );
};

export default TournamentTemplates;