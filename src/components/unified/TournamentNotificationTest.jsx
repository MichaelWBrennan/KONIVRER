/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * TournamentNotificationTest Component
 * 
 * A component for testing tournament push notifications
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Spinner, Form, Stack, Table, Badge } from 'react-bootstrap';
import notificationService from '../../services/notificationService';
import { apiClient } from '../../config/api';
import { env } from '../../config/env';

const TournamentNotificationTest = ({ userId = 'user1' }) => {
  const [status, setStatus] = useState('idle');
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [activeRound, setActiveRound] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize notification service and fetch tournaments
  useEffect(() => {
    const init = async () => {
      try {
        setStatus('loading');
        
        // Initialize notification service with user ID
        await notificationService.init(userId);
        
        // Check if already subscribed
        const subscribed = await notificationService.checkSubscription();
        setIsSubscribed(subscribed);
        
        // Fetch tournaments
        await fetchTournaments();
        
        setStatus('success');
      } catch (error) {
        console.error('Error initializing:', error);
        setStatus('error');
        setError(error.message);
      }
    };
    
    init();
  }, [userId]);

  // Fetch tournaments from API
  const fetchTournaments = async () => {
    try {
      setStatus('loading');
      
      const response = await apiClient.get('/api/tournaments');
      
      if (response.data.success) {
        setTournaments(response.data.tournaments);
        
        // If there's an active tournament, select it
        const activeTournament = response.data.tournaments.find(t => t.status === 'active');
        if (activeTournament) {
          setSelectedTournament(activeTournament);
          
          // Find active round
          const activeRound = activeTournament.rounds.find(r => r.status === 'active');
          setActiveRound(activeRound);
        }
      } else {
        setError('Failed to fetch tournaments');
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setStatus('error');
      setError(error.response?.data?.message || error.message);
    }
  };

  // Handle tournament selection
  const handleTournamentSelect = (event) => {
    const tournamentId = event.target.value;
    
    if (!tournamentId) {
      setSelectedTournament(null);
      setActiveRound(null);
      return;
    }
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    setSelectedTournament(tournament);
    
    // Find active round
    const activeRound = tournament.rounds.find(r => r.status === 'active');
    setActiveRound(activeRound);
  };

  // Start a new round
  const handleStartRound = async () => {
    if (!selectedTournament) return;
    
    try {
      setStatus('loading');
      setError(null);
      
      // Create matches for the new round
      // For simplicity, we'll pair players based on standings
      const standings = [...selectedTournament.standings].sort((a, b) => b.points - a.points);
      const players = standings.map(s => s.playerId);
      
      // If odd number of players, add a bye
      if (players.length % 2 !== 0) {
        players.push('bye');
      }
      
      // Create matches
      const matches = [];
      for (let i = 0; i < players.length; i += 2) {
        matches.push({
          player1: players[i],
          player2: players[i + 1]
        });
      }
      
      // Start new round
      const response = await apiClient.post(`/api/tournaments/${selectedTournament.id}/rounds`, {
        matches
      });
      
      if (response.data.success) {
        setMessage(`Round ${response.data.roundNumber} started successfully`);
        
        // Refresh tournaments
        await fetchTournaments();
      } else {
        setError(response.data.message);
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error starting round:', error);
      setStatus('error');
      setError(error.response?.data?.message || error.message);
    }
  };

  // Submit match result
  const handleSubmitResult = async (matchId, winner, result) => {
    if (!selectedTournament || !activeRound) return;
    
    try {
      setStatus('loading');
      setError(null);
      
      const response = await apiClient.post(`/api/tournaments/${selectedTournament.id}/matches/${matchId}/result`, {
        winner,
        result
      });
      
      if (response.data.success) {
        setMessage(`Match result submitted successfully`);
        
        // Refresh tournaments
        await fetchTournaments();
      } else {
        setError(response.data.message);
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error submitting result:', error);
      setStatus('error');
      setError(error.response?.data?.message || error.message);
    }
  };

  // Trigger overtime for a match
  const handleTriggerOvertime = async (matchId) => {
    if (!selectedTournament || !activeRound) return;
    
    try {
      setStatus('loading');
      setError(null);
      
      const response = await apiClient.post(`/api/tournaments/${selectedTournament.id}/matches/${matchId}/overtime`, {
        additionalTime: 300 // 5 minutes
      });
      
      if (response.data.success) {
        setMessage(`Overtime triggered successfully`);
        
        // Refresh tournaments
        await fetchTournaments();
      } else {
        setError(response.data.message);
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error triggering overtime:', error);
      setStatus('error');
      setError(error.response?.data?.message || error.message);
    }
  };

  // Request permission and subscribe
  const handleSubscribe = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Request permission
      const permissionResult = await notificationService.requestPermission();
      
      if (permissionResult !== 'granted') {
        setStatus('error');
        setError('Permission denied. Please enable notifications in your browser settings.');
        return;
      }
      
      // Subscribe to push notifications
      const subscription = await notificationService.subscribe();
      
      if (subscription) {
        setIsSubscribed(true);
        setMessage('Successfully subscribed to push notifications!');
        setStatus('success');
      } else {
        setStatus('error');
        setError('Failed to subscribe to push notifications.');
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setStatus('error');
      setError(error.message);
    }
  };

  // Render match result buttons
  const renderResultButtons = (match) => {
    if (match.completed) {
      return (
        <Badge bg="success">
          {match.result}
        </Badge>
      );
    }
    
    return (
      <Stack direction="horizontal" gap={1}>
        <Button 
          size="sm" 
          variant="outline-success"
          onClick={() => handleSubmitResult(match.id, match.player1, '1-0')}
        >
          1-0
        </Button>
        <Button 
          size="sm" 
          variant="outline-warning"
          onClick={() => handleSubmitResult(match.id, null, '0-0')}
        >
          0-0
        </Button>
        <Button 
          size="sm" 
          variant="outline-danger"
          onClick={() => handleSubmitResult(match.id, match.player2, '0-1')}
        >
          0-1
        </Button>
      </Stack>
    );
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Tournament Notification Test</h5>
      </Card.Header>
      <Card.Body>
        {status === 'loading' && (
          <div className="text-center my-3">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Processing...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        
        {!isSubscribed && (
          <Alert variant="warning">
            <Alert.Heading>Enable Notifications</Alert.Heading>
            <p>
              You need to enable notifications to receive tournament updates.
            </p>
            <Button 
              variant="primary" 
              onClick={handleSubscribe}
              disabled={status === 'loading'}
            >
              Enable Notifications
            </Button>
          </Alert>
        )}
        
        <Form.Group className="mb-3">
          <Form.Label>Select Tournament</Form.Label>
          <Form.Select 
            value={selectedTournament?.id || ''}
            onChange={handleTournamentSelect}
            disabled={status === 'loading'}
          >
            <option value="">Select a tournament</option>
            {tournaments.map(tournament => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name} ({tournament.status})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        
        {selectedTournament && (
          <>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Tournament Details</h6>
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {selectedTournament.name}</p>
                <p><strong>Format:</strong> {selectedTournament.format}</p>
                <p><strong>Status:</strong> {selectedTournament.status}</p>
                <p><strong>Players:</strong> {selectedTournament.players.length}</p>
                <p><strong>Rounds:</strong> {selectedTournament.rounds.length}</p>
                
                {selectedTournament.status === 'active' && !activeRound && (
                  <Button 
                    variant="primary" 
                    onClick={handleStartRound}
                    disabled={status === 'loading'}
                  >
                    Start New Round
                  </Button>
                )}
              </Card.Body>
            </Card>
            
            {activeRound && (
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Active Round: Round {activeRound.roundNumber}</h6>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Table</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Result</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRound.matches.map(match => (
                        <tr key={match.id}>
                          <td>{match.table}</td>
                          <td>{match.player1}</td>
                          <td>{match.player2}</td>
                          <td>{renderResultButtons(match)}</td>
                          <td>
                            {!match.completed && (
                              <Button 
                                size="sm" 
                                variant="warning"
                                onClick={() => handleTriggerOvertime(match.id)}
                                disabled={status === 'loading'}
                              >
                                Trigger Overtime
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
            
            <Card>
              <Card.Header>
                <h6 className="mb-0">Standings</h6>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Wins</th>
                      <th>Losses</th>
                      <th>Draws</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTournament.standings
                      .sort((a, b) => b.points - a.points)
                      .map(standing => (
                        <tr key={standing.playerId}>
                          <td>{standing.playerId}</td>
                          <td>{standing.wins}</td>
                          <td>{standing.losses}</td>
                          <td>{standing.draws}</td>
                          <td>{standing.points}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TournamentNotificationTest;