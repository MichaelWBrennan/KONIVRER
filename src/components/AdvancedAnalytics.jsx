import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { Card, Tabs, Tab, Table, Button, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const AdvancedAnalytics = () => {
  const {
    players,
    matches,
    analyzeCardSynergies,
    identifyDecisionPoints,
    analyzePerformanceVariance,
    predictMetagameCycles,
    detectPlayerWeaknesses,
    getCardSynergyRecommendations,
    getPlayerImprovementRecommendations,
    getMetaPrediction
  } = usePhysicalMatchmaking();
  
  const [activeTab, setActiveTab] = useState('synergy');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Analysis results
  const [cardSynergies, setCardSynergies] = useState([]);
  const [decisionPoints, setDecisionPoints] = useState([]);
  const [performanceVariance, setPerformanceVariance] = useState([]);
  const [metagameCycles, setMetagameCycles] = useState([]);
  const [playerWeaknesses, setPlayerWeaknesses] = useState(null);
  const [synergyRecommendations, setSynergyRecommendations] = useState([]);
  const [improvementRecommendations, setImprovementRecommendations] = useState([]);
  const [metaPrediction, setMetaPrediction] = useState([]);
  
  // Mock data for testing
  const mockDecks = [
    {
      id: 'deck1',
      name: 'Aggro Red',
      cards: Array.from({ length: 40 }, (_, i) => ({ id: `card_${i + 1}`, name: `Card ${i + 1}` }))
    },
    {
      id: 'deck2',
      name: 'Control Blue',
      cards: Array.from({ length: 40 }, (_, i) => ({ id: `card_${i + 41}`, name: `Card ${i + 41}` }))
    }
  ];
  
  const mockMetaSnapshots = [
    {
      date: new Date(2025, 0, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 25 },
        { name: 'Control Blue', percentage: 20 },
        { name: 'Midrange Green', percentage: 15 },
        { name: 'Combo Yellow', percentage: 10 },
        { name: 'Tempo Purple', percentage: 8 }
      ]
    },
    {
      date: new Date(2025, 1, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 20 },
        { name: 'Control Blue', percentage: 25 },
        { name: 'Midrange Green', percentage: 18 },
        { name: 'Combo Yellow', percentage: 12 },
        { name: 'Tempo Purple', percentage: 10 }
      ]
    },
    {
      date: new Date(2025, 2, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 15 },
        { name: 'Control Blue', percentage: 22 },
        { name: 'Midrange Green', percentage: 20 },
        { name: 'Combo Yellow', percentage: 18 },
        { name: 'Tempo Purple', percentage: 12 }
      ]
    },
    {
      date: new Date(2025, 3, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 18 },
        { name: 'Control Blue', percentage: 18 },
        { name: 'Midrange Green', percentage: 22 },
        { name: 'Combo Yellow', percentage: 15 },
        { name: 'Tempo Purple', percentage: 15 }
      ]
    },
    {
      date: new Date(2025, 4, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 22 },
        { name: 'Control Blue', percentage: 15 },
        { name: 'Midrange Green', percentage: 18 },
        { name: 'Combo Yellow', percentage: 12 },
        { name: 'Tempo Purple', percentage: 18 }
      ]
    },
    {
      date: new Date(2025, 5, 1),
      archetypes: [
        { name: 'Aggro Red', percentage: 25 },
        { name: 'Control Blue', percentage: 12 },
        { name: 'Midrange Green', percentage: 15 },
        { name: 'Combo Yellow', percentage: 10 },
        { name: 'Tempo Purple', percentage: 20 }
      ]
    }
  ];
  
  // Run analyses
  const runCardSynergyAnalysis = () => {
    setLoading(true);
    setError('');
    try {
      // Use mock decks for now
      const results = analyzeCardSynergies(mockDecks);
      setCardSynergies(results);
    } catch (err) {
      setError(`Error analyzing card synergies: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runDecisionPointAnalysis = () => {
    setLoading(true);
    setError('');
    try {
      const results = identifyDecisionPoints();
      setDecisionPoints(results);
    } catch (err) {
      setError(`Error identifying decision points: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runPerformanceVarianceAnalysis = () => {
    setLoading(true);
    setError('');
    try {
      const results = analyzePerformanceVariance();
      setPerformanceVariance(results);
    } catch (err) {
      setError(`Error analyzing performance variance: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runMetagameCyclePrediction = () => {
    setLoading(true);
    setError('');
    try {
      // Use mock meta snapshots for now
      const results = predictMetagameCycles(mockMetaSnapshots);
      setMetagameCycles(results);
      
      // Also get meta prediction
      const prediction = getMetaPrediction(30); // 30 days in future
      setMetaPrediction(prediction);
    } catch (err) {
      setError(`Error predicting metagame cycles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runPlayerWeaknessDetection = () => {
    if (!selectedPlayer) {
      setError('Please select a player first');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const results = detectPlayerWeaknesses(selectedPlayer);
      setPlayerWeaknesses(results);
      
      // Also get improvement recommendations
      const recommendations = getPlayerImprovementRecommendations(selectedPlayer);
      setImprovementRecommendations(recommendations);
    } catch (err) {
      setError(`Error detecting player weaknesses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runDeckRecommendations = () => {
    if (!selectedDeck) {
      setError('Please select a deck first');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const results = getCardSynergyRecommendations(selectedDeck, 10);
      setSynergyRecommendations(results);
    } catch (err) {
      setError(`Error getting synergy recommendations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Render card synergy analysis
  const renderCardSynergyAnalysis = () => {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <h4>Card Synergy Analysis</h4>
          <Button onClick={runCardSynergyAnalysis} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Run Analysis'}
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {cardSynergies.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Card 1</th>
                <th>Card 2</th>
                <th>Synergy Score</th>
                <th>Win Rate</th>
                <th>Confidence</th>
                <th>Sample Size</th>
              </tr>
            </thead>
            <tbody>
              {cardSynergies.slice(0, 10).map((synergy, index) => (
                <tr key={index}>
                  <td>{synergy.card1}</td>
                  <td>{synergy.card2}</td>
                  <td>
                    <Badge bg={synergy.synergyScore > 0.1 ? 'success' : 'primary'}>
                      {(synergy.synergyScore * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>{(synergy.pairWinRate * 100).toFixed(1)}%</td>
                  <td>
                    <ProgressBar 
                      now={synergy.confidence * 100} 
                      label={`${(synergy.confidence * 100).toFixed(0)}%`}
                      variant={synergy.confidence > 0.8 ? 'success' : 'info'}
                    />
                  </td>
                  <td>{synergy.sampleSize}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">Run the analysis to see card synergies</Alert>
        )}
        
        <h5 className="mt-4">Deck Recommendations</h5>
        <div className="mb-3">
          <select 
            className="form-select" 
            value={selectedDeck?.id || ''} 
            onChange={(e) => {
              const deckId = e.target.value;
              setSelectedDeck(mockDecks.find(d => d.id === deckId) || null);
            }}
          >
            <option value="">Select a deck</option>
            {mockDecks.map(deck => (
              <option key={deck.id} value={deck.id}>{deck.name}</option>
            ))}
          </select>
          <Button 
            className="mt-2" 
            onClick={runDeckRecommendations} 
            disabled={!selectedDeck || loading}
          >
            Get Recommendations
          </Button>
        </div>
        
        {synergyRecommendations.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Recommended Card</th>
                <th>Synergy With</th>
                <th>Synergy Score</th>
                <th>Expected Win Rate</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {synergyRecommendations.map((rec, index) => (
                <tr key={index}>
                  <td>{rec.cardId}</td>
                  <td>{rec.synergyWith}</td>
                  <td>
                    <Badge bg={rec.synergyScore > 0.1 ? 'success' : 'primary'}>
                      {(rec.synergyScore * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>{(rec.expectedWinRate * 100).toFixed(1)}%</td>
                  <td>
                    <ProgressBar 
                      now={rec.confidence * 100} 
                      label={`${(rec.confidence * 100).toFixed(0)}%`}
                      variant={rec.confidence > 0.8 ? 'success' : 'info'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          selectedDeck && <Alert variant="info">Select a deck and run the analysis to see recommendations</Alert>
        )}
      </div>
    );
  };
  
  // Render decision point analysis
  const renderDecisionPointAnalysis = () => {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <h4>Decision Point Analysis</h4>
          <Button onClick={runDecisionPointAnalysis} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Run Analysis'}
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {decisionPoints.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Turn</th>
                <th>Action</th>
                <th>Win Rate</th>
                <th>Baseline Win Rate</th>
                <th>Difference</th>
                <th>Significance</th>
                <th>Sample Size</th>
              </tr>
            </thead>
            <tbody>
              {decisionPoints.slice(0, 10).map((point, index) => (
                <tr key={index}>
                  <td>{point.turn}</td>
                  <td>{point.action}</td>
                  <td>
                    <Badge bg={point.isPositive ? 'success' : 'danger'}>
                      {(point.winRate * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>{(point.baselineWinRate * 100).toFixed(1)}%</td>
                  <td>
                    <Badge bg={point.isPositive ? 'success' : 'danger'}>
                      {point.isPositive ? '+' : '-'}{(point.winRateDifference * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>
                    <ProgressBar 
                      now={Math.min(100, point.significance * 20)} 
                      variant={point.isPositive ? 'success' : 'danger'}
                    />
                  </td>
                  <td>{point.sampleSize}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">Run the analysis to see critical decision points</Alert>
        )}
        
        {decisionPoints.length > 0 && (
          <div className="mt-4">
            <h5>Decision Impact by Turn</h5>
            <div style={{ height: '300px' }}>
              <Bar
                data={{
                  labels: Array.from(new Set(decisionPoints.map(p => p.turn))).sort((a, b) => a - b),
                  datasets: [
                    {
                      label: 'Decision Impact',
                      data: Array.from(new Set(decisionPoints.map(p => p.turn)))
                        .sort((a, b) => a - b)
                        .map(turn => {
                          const turnPoints = decisionPoints.filter(p => p.turn === turn);
                          return Math.max(...turnPoints.map(p => p.significance));
                        }),
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Decision Impact'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Turn'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render performance variance analysis
  const renderPerformanceVarianceAnalysis = () => {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <h4>Performance Variance Analysis</h4>
          <Button onClick={runPerformanceVarianceAnalysis} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Run Analysis'}
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {performanceVariance.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Win Rate</th>
                  <th>Consistency Rating</th>
                  <th>Variability Rating</th>
                  <th>Match Count</th>
                </tr>
              </thead>
              <tbody>
                {performanceVariance.map((player, index) => (
                  <tr key={index}>
                    <td>{player.playerName}</td>
                    <td>{(player.overallWinRate * 100).toFixed(1)}%</td>
                    <td>
                      <ProgressBar 
                        now={player.consistencyRating * 100} 
                        label={`${(player.consistencyRating * 100).toFixed(0)}%`}
                        variant={player.consistencyRating > 0.7 ? 'success' : 'info'}
                      />
                    </td>
                    <td>
                      <Badge bg={player.variabilityRating < 0.1 ? 'success' : 
                                 player.variabilityRating < 0.2 ? 'warning' : 'danger'}>
                        {(player.variabilityRating * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td>{player.matchCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {performanceVariance.length > 0 && (
              <div className="mt-4">
                <h5>Performance Consistency Comparison</h5>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={{
                      labels: performanceVariance.map(p => p.playerName),
                      datasets: [
                        {
                          label: 'Consistency Rating',
                          data: performanceVariance.map(p => p.consistencyRating * 100),
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                        },
                        {
                          label: 'Win Rate',
                          data: performanceVariance.map(p => p.overallWinRate * 100),
                          backgroundColor: 'rgba(153, 102, 255, 0.5)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Percentage'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <Alert variant="info">Run the analysis to see performance variance data</Alert>
        )}
      </div>
    );
  };
  
  // Render metagame cycle prediction
  const renderMetagameCyclePrediction = () => {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <h4>Metagame Cycle Prediction</h4>
          <Button onClick={runMetagameCyclePrediction} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Run Analysis'}
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {metagameCycles.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Archetype</th>
                  <th>Avg Cycle Length</th>
                  <th>Confidence</th>
                  <th>Next Peak</th>
                  <th>Next Trough</th>
                </tr>
              </thead>
              <tbody>
                {metagameCycles.map((cycle, index) => (
                  <tr key={index}>
                    <td>{cycle.archetype}</td>
                    <td>{cycle.avgCycleLength.toFixed(1)} days</td>
                    <td>
                      <ProgressBar 
                        now={cycle.confidence * 100} 
                        label={`${(cycle.confidence * 100).toFixed(0)}%`}
                        variant={cycle.confidence > 0.7 ? 'success' : 'info'}
                      />
                    </td>
                    <td>
                      {cycle.nextPeak ? 
                        `${cycle.nextPeak.date.toLocaleDateString()} (${(cycle.nextPeak.value * 100).toFixed(1)}%)` : 
                        'N/A'}
                    </td>
                    <td>
                      {cycle.nextTrough ? 
                        `${cycle.nextTrough.date.toLocaleDateString()} (${(cycle.nextTrough.value * 100).toFixed(1)}%)` : 
                        'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <h5 className="mt-4">Meta Prediction (Next 30 Days)</h5>
            {metaPrediction.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Archetype</th>
                      <th>Current %</th>
                      <th>Predicted %</th>
                      <th>Change</th>
                      <th>Trend</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metaPrediction.map((pred, index) => (
                      <tr key={index}>
                        <td>{pred.archetype}</td>
                        <td>{pred.currentPercentage.toFixed(1)}%</td>
                        <td>{pred.predictedPercentage.toFixed(1)}%</td>
                        <td>
                          <Badge bg={pred.percentageChange > 0 ? 'success' : 
                                     pred.percentageChange < 0 ? 'danger' : 'secondary'}>
                            {pred.percentageChange > 0 ? '+' : ''}{pred.percentageChange.toFixed(1)}%
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={pred.trend === 'rising' ? 'success' : 
                                     pred.trend === 'falling' ? 'danger' : 'secondary'}>
                            {pred.trend}
                          </Badge>
                        </td>
                        <td>
                          <ProgressBar 
                            now={pred.confidence * 100} 
                            label={`${(pred.confidence * 100).toFixed(0)}%`}
                            variant={pred.confidence > 0.7 ? 'success' : 'info'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                <div className="mt-4" style={{ height: '300px' }}>
                  <Line
                    data={{
                      labels: ['Current', 'Predicted (30 days)'],
                      datasets: metaPrediction.slice(0, 5).map((pred, index) => ({
                        label: pred.archetype,
                        data: [pred.currentPercentage, pred.predictedPercentage],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)'
                        ][index % 5],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)'
                        ][index % 5],
                        tension: 0.1
                      }))
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Meta Percentage'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <Alert variant="info">No meta prediction available</Alert>
            )}
          </>
        ) : (
          <Alert variant="info">Run the analysis to see metagame cycle predictions</Alert>
        )}
      </div>
    );
  };
  
  // Render player weakness detection
  const renderPlayerWeaknessDetection = () => {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <h4>Player Weakness Detection</h4>
          <div>
            <select 
              className="form-select d-inline-block me-2" 
              style={{ width: 'auto' }}
              value={selectedPlayer} 
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">Select a player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
            <Button onClick={runPlayerWeaknessDetection} disabled={!selectedPlayer || loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Run Analysis'}
            </Button>
          </div>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {playerWeaknesses ? (
          <>
            <div className="mb-4">
              <h5>Player Overview</h5>
              <div className="d-flex">
                <div className="me-4">
                  <strong>Player:</strong> {playerWeaknesses.playerName}
                </div>
                <div className="me-4">
                  <strong>Overall Win Rate:</strong> {(playerWeaknesses.overallWinRate * 100).toFixed(1)}%
                </div>
                <div>
                  <strong>Match Count:</strong> {playerWeaknesses.matchCount}
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <h5>Matchup Weaknesses</h5>
                {playerWeaknesses.weaknesses.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Archetype</th>
                        <th>Win Rate</th>
                        <th>Difference</th>
                        <th>Matches</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerWeaknesses.weaknesses.map((weakness, index) => (
                        <tr key={index}>
                          <td>{weakness.archetype}</td>
                          <td>
                            <Badge bg="danger">
                              {(weakness.winRate * 100).toFixed(1)}%
                            </Badge>
                          </td>
                          <td>
                            {(weakness.winRateDifference * 100).toFixed(1)}%
                          </td>
                          <td>{weakness.matches}</td>
                          <td>
                            <ProgressBar 
                              now={Math.min(100, weakness.severity * 20)} 
                              variant="danger"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="success">No significant matchup weaknesses detected</Alert>
                )}
              </div>
              
              <div className="col-md-6">
                <h5>Matchup Strengths</h5>
                {playerWeaknesses.strengths.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Archetype</th>
                        <th>Win Rate</th>
                        <th>Difference</th>
                        <th>Matches</th>
                        <th>Magnitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerWeaknesses.strengths.map((strength, index) => (
                        <tr key={index}>
                          <td>{strength.archetype}</td>
                          <td>
                            <Badge bg="success">
                              {(strength.winRate * 100).toFixed(1)}%
                            </Badge>
                          </td>
                          <td>
                            +{(strength.winRateDifference * 100).toFixed(1)}%
                          </td>
                          <td>{strength.matches}</td>
                          <td>
                            <ProgressBar 
                              now={Math.min(100, strength.magnitude * 20)} 
                              variant="success"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">No significant matchup strengths detected</Alert>
                )}
              </div>
            </div>
            
            <h5 className="mt-4">Play Pattern Weaknesses</h5>
            {playerWeaknesses.playPatternWeaknesses && playerWeaknesses.playPatternWeaknesses.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Turn</th>
                    <th>Action Type</th>
                    <th>Target</th>
                    <th>Win Rate</th>
                    <th>Matches</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {playerWeaknesses.playPatternWeaknesses.map((pattern, index) => (
                    <tr key={index}>
                      <td>{pattern.turn}</td>
                      <td>{pattern.actionType}</td>
                      <td>{pattern.target}</td>
                      <td>
                        <Badge bg="danger">
                          {(pattern.winRate * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td>{pattern.matches}</td>
                      <td>
                        <ProgressBar 
                          now={Math.min(100, pattern.severity * 20)} 
                          variant="danger"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="success">No significant play pattern weaknesses detected</Alert>
            )}
            
            <h5 className="mt-4">Improvement Recommendations</h5>
            {improvementRecommendations && improvementRecommendations.length > 0 ? (
              <div className="list-group">
                {improvementRecommendations.map((rec, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">
                        <Badge bg={rec.type === 'matchup' ? 'primary' : 
                                   rec.type === 'playPattern' ? 'warning' : 'info'}>
                          {rec.type}
                        </Badge>
                        {' '}
                        {rec.type === 'matchup' ? rec.archetype : 
                         rec.type === 'playPattern' ? rec.action : 
                         'Consistency'}
                      </h6>
                      <small>
                        Priority: 
                        <Badge bg={rec.priority > 3 ? 'danger' : 
                                 rec.priority > 2 ? 'warning' : 'info'} className="ms-1">
                          {rec.priority.toFixed(1)}
                        </Badge>
                      </small>
                    </div>
                    <p className="mb-1">{rec.recommendation}</p>
                    {rec.type === 'matchup' && (
                      <small>Current win rate: {(rec.winRate * 100).toFixed(1)}%</small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="info">No specific improvement recommendations available</Alert>
            )}
            
            {playerWeaknesses.weaknesses.length > 0 && playerWeaknesses.strengths.length > 0 && (
              <div className="mt-4" style={{ height: '400px' }}>
                <h5>Matchup Profile</h5>
                <Radar
                  data={{
                    labels: [
                      ...playerWeaknesses.weaknesses.map(w => w.archetype),
                      ...playerWeaknesses.strengths.map(s => s.archetype)
                    ].slice(0, 8),
                    datasets: [
                      {
                        label: 'Win Rate',
                        data: [
                          ...playerWeaknesses.weaknesses.map(w => w.winRate * 100),
                          ...playerWeaknesses.strengths.map(s => s.winRate * 100)
                        ].slice(0, 8),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                      },
                      {
                        label: 'Average Win Rate',
                        data: Array(Math.min(8, playerWeaknesses.weaknesses.length + playerWeaknesses.strengths.length))
                          .fill(playerWeaknesses.overallWinRate * 100),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <Alert variant="info">Select a player and run the analysis to see weakness detection results</Alert>
        )}
      </div>
    );
  };
  
  return (
    <Card className="mt-4">
      <Card.Header>
        <h3>Advanced Analytics</h3>
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="synergy" title="Card Synergy">
            {renderCardSynergyAnalysis()}
          </Tab>
          <Tab eventKey="decisions" title="Decision Points">
            {renderDecisionPointAnalysis()}
          </Tab>
          <Tab eventKey="variance" title="Performance Variance">
            {renderPerformanceVarianceAnalysis()}
          </Tab>
          <Tab eventKey="meta" title="Metagame Prediction">
            {renderMetagameCyclePrediction()}
          </Tab>
          <Tab eventKey="weaknesses" title="Player Weaknesses">
            {renderPlayerWeaknessDetection()}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AdvancedAnalytics;