import React, { useState, useEffect } from 'react';
import { 
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Spinner,
  Alert,
  Modal,
  Form,
  Tab,
  Tabs,
  ProgressBar,
} from 'react-bootstrap';
import { 
  Trophy,
  Eye,
  Play,
  Pause,
  Settings,
  Download,
  Bell,
} from 'lucide-react';
import { io } from 'socket.io-client';

interface Event {
  id: string;
  name: string;
  format: string;
  status: string;
  currentRound: number;
  totalRounds: number;
  registeredPlayers: number;
  settings: {
    maxPlayers: number;
    timeControl?: number;
  };
}

interface Pairing {
  id: string;
  roundNumber: number;
  tableNumber: number;
  playerA: { id: string; username: string };
  playerB?: { id: string; username: string };
  isBye: boolean;
  isPublished: boolean;
  quality?: {
    quality: number;
    balanceCategory: string;
    winProbabilities: number[];
  };
}

interface Match {
  id: string;
  round: number;
  status: string;
  playerAResult?: string;
  playerBResult?: string;
  reportedBy?: string;
  confirmedByJudge?: string;
}

interface Standing {
  position: number;
  playerId: string;
  playerName: string;
  matchPoints: number;
  record: string;
  hasDropped: boolean;
}

interface EventManagerProps {
  eventId: string;
  currentUserId: string;
  isOrganizer: boolean;
  isJudge: boolean;
}

const EventManager: React.FC<EventManagerProps>  : any : any : any = ({ 
  eventId, 
  currentUserId, 
  isOrganizer, 
  isJudge 
}) => {
  const [event, setEvent]  : any : any : any = useState<Event | null>(null);
  const [pairings, setPairings]  : any : any : any = useState<Pairing[]>([]);
  const [matches, setMatches]  : any : any : any = useState<Match[]>([]);
  const [standings, setStandings]  : any : any : any = useState<Standing[]>([]);
  const [loading, setLoading]  : any : any : any = useState(true);
  const [error, setError]  : any : any : any = useState<string | null>(null);
  const [activeTab, setActiveTab]  : any : any : any = useState('overview');
  
  // Modal states
  const [showGeneratePairings, setShowGeneratePairings]  : any : any : any = useState(false);
  const [showMatchResult, setShowMatchResult]  : any : any : any = useState(false);
  const [generatingPairings, setGeneratingPairings]  : any : any : any = useState(false);

  useEffect(() => {
    fetchEventData();
    
    // Initialize WebSocket connection
    const wsSocket  : any : any : any = io('/events', {
      auth: {
        token: localStorage.getItem('authToken'),
      },
    });

    wsSocket.on('connect', () => {
      console.log('Connected to event updates');
      wsSocket.emit('subscribeToEvent', { eventId });
    });

    wsSocket.on('pairingsPublished', (data) => {
      if (data.eventId === eventId) {
        fetchPairings();
        showNotification('New pairings published!', 'success');
      }
    });

    wsSocket.on('matchResult', (data) => {
      if (data.eventId === eventId) {
        fetchMatches();
        fetchStandings();
        showNotification('Match result reported', 'info');
      }
    });

    wsSocket.on('roundCompleted', (data) => {
      if (data.eventId === eventId) {
        fetchEventData();
        showNotification(`Round ${data.round} completed!`, 'success');
      }
    });

    wsSocket.on('eventCompleted', (data) => {
      if (data.eventId === eventId) {
        fetchEventData();
        showNotification('Event completed!', 'success');
      }
    });

    return () => {
      wsSocket.disconnect();
    };
  }, [eventId]);

  const fetchEventData  : any : any : any = async () => {
    try {
      const response  : any : any : any = await fetch(`/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch event');
      
      const eventData  : any : any : any = await response.json();
      setEvent(eventData);
      
      // Fetch related data
      await Promise.all([
        fetchPairings(),
        fetchMatches(),
        fetchStandings(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPairings  : any : any : any = async () => {
    try {
      const response  : any : any : any = await fetch(`/api/events/${eventId}/pairings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.ok) {
        const data  : any : any : any = await response.json();
        setPairings(data);
      }
    } catch (err) {
      console.error('Failed to fetch pairings:', err);
    }
  };

  const fetchMatches  : any : any : any = async () => {
    try {
      const response  : any : any : any = await fetch(`/api/events/${eventId}/matches`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.ok) {
        const data  : any : any : any = await response.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  };

  const fetchStandings  : any : any : any = async () => {
    try {
      const response  : any : any : any = await fetch(`/api/events/${eventId}/standings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.ok) {
        const data  : any : any : any = await response.json();
        setStandings(data);
      }
    } catch (err) {
      console.error('Failed to fetch standings:', err);
    }
  };

  const generatePairings  : any : any : any = async () => {
    try {
      setGeneratingPairings(true);
      
      const response  : any : any : any = await fetch(`/api/events/${eventId}/pairings/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          playerIds: [], // Will be populated by the service
          format: event?.format || 'Standard',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate pairings');

      const result  : any : any : any = await response.json();
      showNotification(
        `Generated ${result.pairings.length} pairings with ${result.overallQuality.toFixed(2)} average quality`,
        'success'
      );
      
      setShowGeneratePairings(false);
      fetchPairings();
    } catch (err) {
      showNotification('Failed to generate pairings: ' + (err as Error).message, 'error');
    } finally {
      setGeneratingPairings(false);
    }
  };

  const publishPairings  : any : any : any = async (round: number) => {
    try {
      const response  : any : any : any = await fetch(`/api/events/${eventId}/pairings/publish?round=${round}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to publish pairings');
      
      showNotification('Pairings published successfully!', 'success');
      fetchPairings();
    } catch (err) {
      showNotification('Failed to publish pairings: ' + (err as Error).message, 'error');
    }
  };

  const showNotification  : any : any : any = (message: string, type: 'success' | 'error' | 'info') => {
    // Implementation would depend on your notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getCurrentRoundPairings  : any : any : any = () => {
    return pairings.filter(p => p.roundNumber === event?.currentRound);
  };

  const getCurrentRoundMatches  : any : any : any = () => {
    return matches.filter(m => m.round === event?.currentRound);
  };

  const getMatchProgress  : any : any : any = () => {
    const currentMatches  : any : any : any = getCurrentRoundMatches();
    if (currentMatches.length === 0) return 0;
    
    const completed  : any : any : any = currentMatches.filter(m => m.status === 'completed').length;
    return (completed / currentMatches.length) * 100;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <div className="mt-2">Loading event...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="px-2 py-3">
      {/* Event Header */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h2 className="h4 mb-1">{event?.name}</h2>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="primary">{event?.status}</Badge>
                <small className="text-muted">
                  Round {event?.currentRound} of {event?.totalRounds}
                </small>
              </div>
            </div>
            
            {(isOrganizer || isJudge) && (
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <Settings size={16} />
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Bell size={16} />
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <Row className="g-2 mb-3">
            <Col xs={6} sm={3}>
              <Card className="text-center border-0 bg-light">
                <Card.Body className="py-2">
                  <div className="h6 mb-0">{event?.registeredPlayers}</div>
                  <small className="text-muted">Players</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center border-0 bg-light">
                <Card.Body className="py-2">
                  <div className="h6 mb-0">{getCurrentRoundPairings().length}</div>
                  <small className="text-muted">Pairings</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center border-0 bg-light">
                <Card.Body className="py-2">
                  <div className="h6 mb-0">{getCurrentRoundMatches().filter(m => m.status === 'completed').length}</div>
                  <small className="text-muted">Completed</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="text-center border-0 bg-light">
                <Card.Body className="py-2">
                  <div className="h6 mb-0">{Math.round(getMatchProgress())}%</div>
                  <small className="text-muted">Progress</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Round Progress */}
          {event?.status === 'In Progress' && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Round {event.currentRound} Progress</small>
                <small className="text-muted">{Math.round(getMatchProgress())}%</small>
              </div>
              <ProgressBar now={getMatchProgress()} />
            </div>
          )}
        </Col>
      </Row>

      {/* Action Buttons for Organizers */}
      {(isOrganizer || isJudge) && (
        <Row className="mb-3">
          <Col>
            <div className="d-flex gap-2 flex-wrap">
              {event?.status === 'Registration Closed' && (
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => setShowGeneratePairings(true)}
                >
                  <Play size={16} className="me-1" />
                  Start Event
                </Button>
              )}
              
              {event?.status === 'In Progress' && getMatchProgress() < 100 && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowGeneratePairings(true)}
                >
                  <Trophy size={16} className="me-1" />
                  Generate Pairings
                </Button>
              )}

              {getCurrentRoundPairings().length > 0 && !getCurrentRoundPairings()[0]?.isPublished && (
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => publishPairings(event?.currentRound || 1)}
                >
                  <Eye size={16} className="me-1" />
                  Publish Pairings
                </Button>
              )}

              {event?.status === 'In Progress' && (
                <Button variant="outline-secondary" size="sm">
                  <Pause size={16} className="me-1" />
                  Pause
                </Button>
              )}

              <Button variant="outline-secondary" size="sm">
                <Download size={16} className="me-1" />
                Export
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Tabbed Content */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'overview')}
        className="mb-3"
        fill
      >
        <Tab eventKey="pairings" title="Pairings">
          <PairingsTab 
            pairings={getCurrentRoundPairings()}
            currentUserId={currentUserId}
            isOrganizer={isOrganizer}
            isJudge={isJudge}
            onReportResult={(_matchId: string) => {
              setShowMatchResult(true);
            }}
          />
        </Tab>

        <Tab eventKey="standings" title="Standings">
          <StandingsTab standings={standings} />
        </Tab>

        <Tab eventKey="matches" title="Matches">
          <MatchesTab 
            matches={getCurrentRoundMatches()}
            isJudge={isJudge}
          />
        </Tab>

        {(isOrganizer || isJudge) && (
          <Tab eventKey="admin" title="Admin">
            <AdminTab />
          </Tab>
        )}
      </Tabs>

      {/* Generate Pairings Modal */}
      <Modal show={showGeneratePairings} onHide={() => setShowGeneratePairings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Pairings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Generate pairings for round {(event?.currentRound || 0) + 1}?</p>
          <p className="text-muted small">
            The system will use Bayesian matchmaking to create optimal pairings based on 
            player skill ratings and previous matchups.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGeneratePairings(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={generatePairings}
            disabled={generatingPairings}
          >
            {generatingPairings ? (
              <>
                <Spinner size="sm" className="me-1" />
                Generating...
              </>
            ) : (
              'Generate Pairings'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Match Result Modal */}
      <Modal show={showMatchResult} onHide={() => setShowMatchResult(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Match Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MatchResultForm 
            onSubmit={() => {
              setShowMatchResult(false);
              fetchMatches();
              fetchStandings();
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

// Placeholder components - would need full implementations
const PairingsTab: React.FC<any>  : any : any : any = ({ pairings, onReportResult }) => (
  <div>
    <ListGroup>
      {pairings.map((pairing: Pairing) => (
        <ListGroup.Item key={pairing.id} className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Table {pairing.tableNumber}</strong>
            <div>
              {pairing.playerA.username} 
              {pairing.playerB ? ` vs ${pairing.playerB.username}` : ' (Bye)'}
            </div>
            {pairing.quality && (
              <small className="text-muted">
                Quality: {(pairing.quality.quality * 100).toFixed(1)}% 
                ({pairing.quality.balanceCategory})
              </small>
            )}
          </div>
          <Button size="sm" onClick={() => onReportResult(pairing.id)}>
            Report Result
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

const StandingsTab: React.FC<any>  : any : any : any = ({ standings }) => (
  <div>
    <ListGroup>
      {standings.map((standing: Standing) => (
        <ListGroup.Item key={standing.playerId} className="d-flex justify-content-between">
          <div>
            <strong>#{standing.position}</strong> {standing.playerName}
            {standing.hasDropped && <Badge bg="secondary" className="ms-2">Dropped</Badge>}
          </div>
          <div className="text-end">
            <div>{standing.matchPoints} pts</div>
            <small className="text-muted">{standing.record}</small>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

const MatchesTab: React.FC<any>  : any : any : any = ({ matches }) => (
  <div>
    <ListGroup>
      {matches.map((match: Match) => (
        <ListGroup.Item key={match.id}>
          <div className="d-flex justify-content-between align-items-center">
            <div>Match {match.id.slice(0, 8)}</div>
            <Badge bg={match.status === 'completed' ? 'success' : 'primary'}>
              {match.status}
            </Badge>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

const AdminTab: React.FC<any>  : any : any : any = () => (
  <div>
    <Card>
      <Card.Body>
        <h6>Event Administration</h6>
        <p>Administrative controls and event management tools.</p>
      </Card.Body>
    </Card>
  </div>
);

const MatchResultForm: React.FC<any>  : any : any : any = ({ onSubmit }) => {
  const [result, setResult]  : any : any : any = useState('win');
  
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Result</Form.Label>
        <Form.Select value={result} onChange={(e) => setResult(e.target.value)}>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="draw">Draw</option>
        </Form.Select>
      </Form.Group>
      <div className="d-grid">
        <Button variant="primary" onClick={onSubmit}>
          Submit Result
        </Button>
      </div>
    </Form>
  );
};

export default EventManager;