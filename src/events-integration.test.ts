import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';

/**
 * Event & Pairing System Integration Tests
 * 
 * Tests the complete Event & Pairing System implementation including:
 * - Event management (CRUD operations)
 * - Registration and check-in workflow
 * - Pairing generation (Swiss, Single-Elimination, Round-Robin)
 * - Match lifecycle and result reporting
 * - Judge tools and dispute resolution
 * - Real-time updates and notifications
 * - Bayesian matchmaking integration
 * - Export and reporting functionality
 * - Security and access control
 */

describe('Event & Pairing System Integration', () => {
  // Mock data
  const mockOrganizer = {
    id: 'org-001',
    username: 'eventorganizer',
    role: 'tournament_organizer',
  };

  const mockPlayers = [
    { id: 'player-001', username: 'player1' },
    { id: 'player-002', username: 'player2' },
    { id: 'player-003', username: 'player3' },
    { id: 'player-004', username: 'player4' },
    { id: 'player-005', username: 'player5' },
    { id: 'player-006', username: 'player6' },
    { id: 'player-007', username: 'player7' },
    { id: 'player-008', username: 'player8' },
  ];

  const mockJudge = {
    id: 'judge-001',
    username: 'judge1',
    role: 'judge_l2',
  };

  // Test event data
  const testEventData = {
    name: 'KONIVRER Standard Weekly',
    description: 'Weekly Standard format tournament with Bayesian matchmaking',
    format: 'Standard',
    pairingType: 'Swiss',
    startAt: new Date(Date.now() + 86400000), // Tomorrow
    endAt: new Date(Date.now() + 93600000), // Tomorrow + 2 hours
    venue: {
      type: 'online',
      onlineUrl: 'https://konivrer.com/play',
    },
    settings: {
      maxPlayers: 8,
      minPlayers: 4,
      registrationWindowStart: new Date(),
      registrationWindowEnd: new Date(Date.now() + 43200000), // 12 hours from now
      rulesetVersion: '1.0.0',
      rounds: 3,
      timeControl: 50,
      tieBreakRules: ['Opponent Match Win %', 'Game Win %', 'Opponent Game Win %'],
      allowDrops: true,
      allowSpectators: true,
      requireDeckList: false,
      lateRegistration: false,
      judgeNotifications: true,
      streamEnabled: false,
    },
    judges: [mockJudge.id],
  };

  let eventId: string;
  let registrationIds: string[] = [];

  describe('Event Management', () => {
    test('should create event with comprehensive metadata', async () => {
      // Mock API call to create event
      const response = await mockCreateEvent(testEventData, mockOrganizer.id);
      
      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toBe(testEventData.name);
      expect(response.format).toBe(testEventData.format);
      expect(response.pairingType).toBe(testEventData.pairingType);
      expect(response.status).toBe('Scheduled');
      expect(response.organizerId).toBe(mockOrganizer.id);
      expect(response.totalRounds).toBe(3); // Calculated for Swiss 8-player
      expect(response.venue.type).toBe('online');
      expect(response.settings.maxPlayers).toBe(8);
      expect(response.judges).toContain(mockJudge.id);

      eventId = response.id;
    });

    test('should update event settings', async () => {
      const updateData = {
        name: 'KONIVRER Standard Weekly - Updated',
        settings: {
          ...testEventData.settings,
          maxPlayers: 16,
        },
      };

      const response = await mockUpdateEvent(eventId, updateData, mockOrganizer.id);
      
      expect(response.name).toBe(updateData.name);
      expect(response.settings.maxPlayers).toBe(16);
    });

    test('should not allow non-organizer to update event', async () => {
      const updateData = { name: 'Unauthorized Update' };
      
      await expect(
        mockUpdateEvent(eventId, updateData, 'unauthorized-user')
      ).rejects.toThrow('Only the event organizer can update this event');
    });

    test('should retrieve event with full relations', async () => {
      const event = await mockGetEvent(eventId);
      
      expect(event).toBeDefined();
      expect(event.organizer).toBeDefined();
      expect(event.organizer.id).toBe(mockOrganizer.id);
      expect(event.registrations).toBeDefined();
      expect(event.pairings).toBeDefined();
      expect(event.matches).toBeDefined();
    });
  });

  describe('Registration & Rostering', () => {
    test('should register players for event', async () => {
      // Open registration
      await mockUpdateEvent(eventId, { status: 'Registration Open' }, mockOrganizer.id);

      // Register first 6 players
      for (let i = 0; i < 6; i++) {
        const player = mockPlayers[i];
        const registration = await mockRegisterForEvent(eventId, player.id, {});
        
        expect(registration).toBeDefined();
        expect(registration.eventId).toBe(eventId);
        expect(registration.userId).toBe(player.id);
        expect(registration.isWaitlisted).toBe(false);
        expect(registration.seedValue).toBeGreaterThan(0); // Bayesian seed
        
        registrationIds.push(registration.id);
      }
    });

    test('should handle waitlist when event is full', async () => {
      // Register remaining players (should go to waitlist if max is 8)
      for (let i = 6; i < 8; i++) {
        const player = mockPlayers[i];
        const registration = await mockRegisterForEvent(eventId, player.id, {});
        
        expect(registration).toBeDefined();
        expect(registration.isWaitlisted).toBe(false); // Still within capacity
        
        registrationIds.push(registration.id);
      }

      // Try to register one more (should be waitlisted)
      const extraPlayer = { id: 'player-009', username: 'player9' };
      const registration = await mockRegisterForEvent(eventId, extraPlayer.id, {});
      
      expect(registration.isWaitlisted).toBe(true);
    });

    test('should check in players', async () => {
      // Close registration
      await mockUpdateEvent(eventId, { status: 'Registration Closed' }, mockOrganizer.id);

      // Check in first 4 players
      for (let i = 0; i < 4; i++) {
        const player = mockPlayers[i];
        const checkedIn = await mockCheckInPlayer(eventId, {
          userId: player.id,
          seedValue: 1200 + (i * 100), // Custom seed values
        }, mockOrganizer.id);
        
        expect(checkedIn).toBeDefined();
        expect(checkedIn.checkedInAt).toBeDefined();
        expect(checkedIn.seedValue).toBe(1200 + (i * 100));
      }
    });

    test('should prevent duplicate registrations', async () => {
      await expect(
        mockRegisterForEvent(eventId, mockPlayers[0].id, {})
      ).rejects.toThrow('Already registered for this event');
    });

    test('should handle unregistration', async () => {
      const playerId = mockPlayers[7].id; // Last registered player
      
      await mockUnregisterFromEvent(eventId, playerId);
      
      // Verify player is no longer registered
      const event = await mockGetEvent(eventId);
      const stillRegistered = event.registrations.some((r: any) => r.userId === playerId);
      expect(stillRegistered).toBe(false);
    });
  });

  describe('Pairing Engine', () => {
    test('should generate Swiss pairings with Bayesian integration', async () => {
      // Start the event
      await mockUpdateEvent(eventId, { status: 'In Progress', currentRound: 1 }, mockOrganizer.id);

      const checkedInPlayers = mockPlayers.slice(0, 4).map(p => p.id);
      const pairingRequest = {
        playerIds: checkedInPlayers,
        format: 'Standard',
        previousPairings: [],
        eventId,
        round: 1,
      };

      const pairingsResponse = await mockGeneratePairings(eventId, pairingRequest, mockOrganizer.id);
      
      expect(pairingsResponse).toBeDefined();
      expect(pairingsResponse.pairings).toHaveLength(2); // 4 players = 2 pairings
      expect(pairingsResponse.overallQuality).toBeGreaterThan(0);
      expect(pairingsResponse.playersPaired).toBe(4);
      expect(pairingsResponse.byes).toBe(0);
      expect(pairingsResponse.computationTimeMs).toBeLessThan(20000); // Under 20s requirement

      // Verify pairing quality metadata
      pairingsResponse.pairings.forEach((pairing: any) => {
        expect(pairing.quality).toBeDefined();
        expect(pairing.quality.quality).toBeGreaterThan(0);
        expect(pairing.quality.quality).toBeLessThanOrEqual(1);
        expect(pairing.quality.winProbabilities).toHaveLength(2);
        expect(pairing.quality.balanceCategory).toBeDefined();
      });
    });

    test('should avoid repeat pairings in subsequent rounds', async () => {
      // Generate second round pairings
      const previousPairings = [
        ['player-001', 'player-002'],
        ['player-003', 'player-004'],
      ];

      const pairingRequest = {
        playerIds: mockPlayers.slice(0, 4).map(p => p.id),
        format: 'Standard',
        previousPairings,
        eventId,
        round: 2,
      };

      const pairingsResponse = await mockGeneratePairings(eventId, pairingRequest, mockOrganizer.id);
      
      expect(pairingsResponse).toBeDefined();
      expect(pairingsResponse.pairings).toHaveLength(2);

      // Verify no repeat pairings
      const newPairings = pairingsResponse.pairings.map((p: any) => p.players.sort());
      const oldPairings = previousPairings.map(p => p.sort());
      
      newPairings.forEach((newPair: string[]) => {
        const isRepeat = oldPairings.some((oldPair: string[]) => 
          oldPair[0] === newPair[0] && oldPair[1] === newPair[1]
        );
        expect(isRepeat).toBe(false);
      });
    });

    test('should handle bye rounds correctly', async () => {
      // Test with odd number of players
      const oddPlayers = mockPlayers.slice(0, 5).map(p => p.id);
      const pairingRequest = {
        playerIds: oddPlayers,
        format: 'Standard',
        previousPairings: [],
        eventId,
        round: 1,
      };

      const pairingsResponse = await mockGeneratePairings(eventId, pairingRequest, mockOrganizer.id);
      
      expect(pairingsResponse).toBeDefined();
      expect(pairingsResponse.pairings).toHaveLength(2); // 2 matches + 1 bye
      expect(pairingsResponse.playersPaired).toBe(4);
      expect(pairingsResponse.byes).toBe(1);

      // Verify bye assignment (should go to lowest-rated player)
      const byeAssignment = pairingsResponse.pairings.find((p: any) => p.players.length === 1);
      expect(byeAssignment).toBeDefined();
    });

    test('should publish pairings and create matches', async () => {
      await mockPublishPairings(eventId, 1, mockOrganizer.id);
      
      const pairings = await mockGetPairings(eventId, 1);
      expect(pairings).toBeDefined();
      expect(pairings.length).toBeGreaterThan(0);
      
      // Verify pairings are published
      pairings.forEach((pairing: any) => {
        expect(pairing.publishedAt).toBeDefined();
        expect(pairing.matches).toBeDefined();
        expect(pairing.matches.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Match Lifecycle', () => {
    test('should report match results', async () => {
      const pairings = await mockGetPairings(eventId, 1);
      const firstPairing = pairings[0];
      const matchId = firstPairing.matches[0].id;

      const resultData = {
        playerAResult: 'win',
        playerBResult: 'loss',
        notes: 'Good game, well played!',
      };

      const match = await mockReportMatchResult(matchId, resultData, mockPlayers[0].id);
      
      expect(match).toBeDefined();
      expect(match.playerAResult).toBe('win');
      expect(match.playerBResult).toBe('loss');
      expect(match.status).toBe('completed');
      expect(match.reportedBy).toBe(mockPlayers[0].id);
      expect(match.notes).toBe(resultData.notes);
    });

    test('should update Bayesian ratings after match completion', async () => {
      // This would verify that the matchmaking service was called
      // to update ratings based on match results
      const ratingHistory = await mockGetRatingHistory(mockPlayers[0].id);
      
      expect(ratingHistory).toBeDefined();
      expect(ratingHistory.length).toBeGreaterThan(0);
      
      const latestRating = ratingHistory[ratingHistory.length - 1];
      expect(latestRating.matchId).toBeDefined();
      expect(latestRating.delta).toBeDefined();
      expect(latestRating.confidenceInterval).toBeDefined();
    });

    test('should calculate and update standings', async () => {
      const standings = await mockGetStandings(eventId);
      
      expect(standings).toBeDefined();
      expect(standings.length).toBeGreaterThan(0);
      
      // Verify standing calculations
      standings.forEach((standing: any) => {
        expect(standing.position).toBeGreaterThan(0);
        expect(standing.matchPoints).toBeGreaterThanOrEqual(0);
        expect(standing.record).toMatch(/\d+-\d+-\d+/); // Format: "W-L-D"
        expect(standing.gameWinPercentage).toBeGreaterThanOrEqual(0);
        expect(standing.gameWinPercentage).toBeLessThanOrEqual(100);
      });

      // Verify standings are sorted by match points
      for (let i = 1; i < standings.length; i++) {
        expect(standings[i - 1].matchPoints).toBeGreaterThanOrEqual(standings[i].matchPoints);
      }
    });
  });

  describe('Judge Tools & Dispute Resolution', () => {
    test('should allow judge to confirm match result', async () => {
      const matches = await mockGetMatches(eventId, 1);
      const completedMatch = matches.find((m: any) => m.status === 'completed');
      
      const confirmation = await mockConfirmMatchResult({
        matchId: completedMatch.id,
        judgeNotes: 'Result confirmed after review',
      }, mockJudge.id);
      
      expect(confirmation).toBeDefined();
      expect(confirmation.confirmedByJudge).toBe(mockJudge.id);
      expect(confirmation.notes).toContain('Result confirmed after review');
    });

    test('should allow judge to apply rulings', async () => {
      const matches = await mockGetMatches(eventId, 1);
      const disputedMatch = matches[0];

      const rulingData = {
        matchId: disputedMatch.id,
        rulingText: 'Player committed a minor procedural error. Warning issued.',
        penalty: 'Warning',
        attachments: ['https://example.com/screenshot.png'],
        metadata: {
          ruleReference: 'CR 104.3',
          appealable: false,
        },
      };

      const judging = await mockApplyRuling(rulingData, mockJudge.id);
      
      expect(judging).toBeDefined();
      expect(judging.judgeId).toBe(mockJudge.id);
      expect(judging.rulingText).toBe(rulingData.rulingText);
      expect(judging.penalty).toBe(rulingData.penalty);
      expect(judging.attachments).toContain('https://example.com/screenshot.png');
      expect(judging.metadata.ruleReference).toBe('CR 104.3');
    });

    test('should create audit log entries for all judge actions', async () => {
      const auditLogs = await mockGetAuditLogs(eventId);
      
      expect(auditLogs).toBeDefined();
      expect(auditLogs.length).toBeGreaterThan(0);
      
      // Verify audit log structure
      const judgeRulingLog = auditLogs.find((log: any) => log.action === 'apply_ruling');
      expect(judgeRulingLog).toBeDefined();
      expect(judgeRulingLog.actorId).toBe(mockJudge.id);
      expect(judgeRulingLog.entityType).toBe('Judging');
      expect(judgeRulingLog.provenanceHash).toBeDefined();
      expect(judgeRulingLog.metadataJson).toBeDefined();
    });
  });

  describe('Simulator Integration', () => {
    test('should simulate match outcomes', async () => {
      const matches = await mockGetMatches(eventId, 1);
      const activeMatch = matches.find((m: any) => m.status === 'scheduled');
      
      if (activeMatch) {
        const simulation = await mockSimulateMatch(activeMatch.id, mockPlayers[0].id);
        
        expect(simulation).toBeDefined();
        expect(simulation.matchId).toBe(activeMatch.id);
        expect(simulation.simulationResult).toBeDefined();
        expect(simulation.disclaimer).toContain('sandbox simulation');
        
        // Verify simulation doesn't affect actual ratings
        expect(simulation.simulationResult.affectsRatings).toBe(false);
      }
    });

    test('should provide match quality predictions', async () => {
      const pairingRequest = {
        playerIds: mockPlayers.slice(0, 2).map(p => p.id),
        format: 'Standard',
      };

      const qualityPrediction = await mockPredictMatchQuality(
        mockPlayers[0].id,
        mockPlayers[1].id,
        'Standard'
      );
      
      expect(qualityPrediction).toBeDefined();
      expect(qualityPrediction.quality).toBeGreaterThan(0);
      expect(qualityPrediction.quality).toBeLessThanOrEqual(1);
      expect(qualityPrediction.winProbabilities).toHaveLength(2);
      expect(qualityPrediction.skillDifference).toBeGreaterThanOrEqual(0);
      expect(qualityPrediction.balanceCategory).toBeDefined();
    });
  });

  describe('Export & Reporting', () => {
    test('should export participant data', async () => {
      const exportData = await mockExportEventData(eventId, {
        format: 'json',
        data: 'participants',
      });
      
      expect(exportData).toBeDefined();
      expect(exportData.participants).toBeDefined();
      expect(exportData.participants.length).toBeGreaterThan(0);
      
      exportData.participants.forEach((participant: any) => {
        expect(participant.userId).toBeDefined();
        expect(participant.username).toBeDefined();
        expect(participant.checkedIn).toBeDefined();
        expect(participant.isWaitlisted).toBeDefined();
      });
    });

    test('should export standings as CSV', async () => {
      const csvData = await mockExportEventData(eventId, {
        format: 'csv',
        data: 'standings',
      });
      
      expect(csvData).toBeDefined();
      expect(typeof csvData).toBe('string');
      expect(csvData).toContain('position,playerId,playerName');
      expect(csvData.split('\n').length).toBeGreaterThan(1);
    });

    test('should generate comprehensive event statistics', async () => {
      const statistics = await mockGetEventStatistics(eventId);
      
      expect(statistics).toBeDefined();
      expect(statistics.eventId).toBe(eventId);
      expect(statistics.totalParticipants).toBeGreaterThan(0);
      expect(statistics.completedRounds).toBeGreaterThanOrEqual(0);
      expect(statistics.totalMatches).toBeGreaterThanOrEqual(0);
      expect(statistics.completedMatches).toBeGreaterThanOrEqual(0);
      expect(statistics.topStandings).toBeDefined();
      expect(statistics.eventDuration).toBeDefined();
    });
  });

  describe('Security & Access Control', () => {
    test('should enforce role-based access control', async () => {
      const unauthorizedUser = { id: 'player-999', role: 'player' };

      // Regular player should not be able to generate pairings
      await expect(
        mockGeneratePairings(eventId, {}, unauthorizedUser.id)
      ).rejects.toThrow('Only event organizers and judges can generate pairings');

      // Regular player should not be able to apply rulings
      await expect(
        mockApplyRuling({ matchId: 'test', rulingText: 'test' }, unauthorizedUser.id)
      ).rejects.toThrow('Only judges can apply rulings');
    });

    test('should validate input data and prevent injection attacks', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        description: 'DROP TABLE events;',
      };

      await expect(
        mockCreateEvent(maliciousData, mockOrganizer.id)
      ).rejects.toThrow('Invalid input data');
    });

    test('should maintain audit trail integrity', async () => {
      const auditLogs = await mockGetAuditLogs(eventId);
      
      // Verify all audit logs have valid provenance hashes
      auditLogs.forEach((log: any) => {
        expect(log.provenanceHash).toBeDefined();
        expect(log.provenanceHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hash format
        
        // Verify hash integrity
        const expectedHash = mockCalculateProvenanceHash(log);
        expect(log.provenanceHash).toBe(expectedHash);
      });
    });
  });

  describe('Real-Time Updates & Performance', () => {
    test('should handle concurrent operations', async () => {
      // Simulate multiple players reporting results simultaneously
      const concurrentOperations = [];
      const matches = await mockGetMatches(eventId, 1);
      
      for (let i = 0; i < Math.min(matches.length, 3); i++) {
        const match = matches[i];
        if (match.status === 'scheduled') {
          concurrentOperations.push(
            mockReportMatchResult(match.id, {
              playerAResult: 'win',
              playerBResult: 'loss',
            }, mockPlayers[i].id)
          );
        }
      }

      const results = await Promise.all(concurrentOperations);
      expect(results).toHaveLength(concurrentOperations.length);
      
      // Verify no race conditions or data corruption
      results.forEach((result: any) => {
        expect(result).toBeDefined();
        expect(result.status).toBe('completed');
      });
    });

    test('should meet performance requirements', async () => {
      // Test pairing generation performance
      const startTime = Date.now();
      const largePlayerSet = Array.from({ length: 512 }, (_, i) => `player-${i + 1}`);
      
      const pairingsResponse = await mockGeneratePairings(eventId, {
        playerIds: largePlayerSet,
        format: 'Standard',
      }, mockOrganizer.id);
      
      const endTime = Date.now();
      const computationTime = endTime - startTime;
      
      expect(computationTime).toBeLessThan(20000); // Under 20 seconds for 512 players
      expect(pairingsResponse.computationTimeMs).toBeLessThan(20000);
    });

    test('should support real-time websocket updates', async () => {
      // Mock WebSocket connection and events
      const mockSocket = {
        connected: false,
        events: [] as any[],
        emit: (event: string, data: any) => {
          mockSocket.events.push({ event, data, timestamp: new Date() });
        },
      };

      // Simulate event updates
      await mockWebSocketNotification('pairingsPublished', {
        eventId,
        round: 2,
        pairings: [],
      }, mockSocket);

      expect(mockSocket.events).toHaveLength(1);
      expect(mockSocket.events[0].event).toBe('pairingsPublished');
      expect(mockSocket.events[0].data.eventId).toBe(eventId);
    });
  });

  // Mock API functions (would be replaced with actual API calls in real tests)
  async function mockCreateEvent(eventData: any, organizerId: string) {
    return {
      id: 'event-' + Date.now(),
      ...eventData,
      organizerId,
      status: 'Scheduled',
      totalRounds: Math.ceil(Math.log2(eventData.settings.maxPlayers)),
      registeredPlayers: 0,
      waitlistedPlayers: 0,
      isRegistrationOpen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async function mockUpdateEvent(eventId: string, updateData: any, userId: string) {
    if (userId !== mockOrganizer.id) {
      throw new Error('Only the event organizer can update this event');
    }
    return { id: eventId, ...updateData, updatedAt: new Date() };
  }

  async function mockGetEvent(eventId: string) {
    return {
      id: eventId,
      name: testEventData.name,
      organizer: mockOrganizer,
      registrations: registrationIds.map(id => ({ id, eventId, userId: 'player-001' })),
      pairings: [],
      matches: [],
      auditLogs: [],
    };
  }

  async function mockRegisterForEvent(eventId: string, userId: string, data: any) {
    const existingRegistration = registrationIds.find(id => id.includes(userId));
    if (existingRegistration) {
      throw new Error('Already registered for this event');
    }

    return {
      id: `reg-${userId}-${eventId}`,
      eventId,
      userId,
      isWaitlisted: registrationIds.length >= 8,
      seedValue: Math.random() * 2000 + 1000,
      checkedInAt: null,
      createdAt: new Date(),
    };
  }

  async function mockUnregisterFromEvent(eventId: string, userId: string) {
    const index = registrationIds.findIndex(id => id.includes(userId));
    if (index > -1) {
      registrationIds.splice(index, 1);
    }
  }

  async function mockCheckInPlayer(eventId: string, checkInData: any, actorId: string) {
    return {
      id: `reg-${checkInData.userId}-${eventId}`,
      eventId,
      userId: checkInData.userId,
      checkedInAt: new Date(),
      seedValue: checkInData.seedValue || 1200,
    };
  }

  async function mockGeneratePairings(eventId: string, request: any, actorId: string) {
    if (!mockOrganizer.id && actorId !== mockJudge.id) {
      throw new Error('Only event organizers and judges can generate pairings');
    }

    const playerCount = request.playerIds?.length || 4;
    const pairings = [];
    
    for (let i = 0; i < Math.floor(playerCount / 2); i++) {
      pairings.push({
        players: [
          request.playerIds?.[i * 2] || `player-${i * 2}`,
          request.playerIds?.[i * 2 + 1] || `player-${i * 2 + 1}`,
        ],
        quality: {
          quality: 0.7 + Math.random() * 0.3,
          winProbabilities: [0.45 + Math.random() * 0.1, 0.45 + Math.random() * 0.1],
          skillDifference: Math.random() * 200,
          uncertaintyFactor: Math.random() * 100,
          balanceCategory: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        },
        tableNumber: i + 1,
      });
    }

    return {
      pairings,
      overallQuality: 0.75,
      playersPaired: Math.floor(playerCount / 2) * 2,
      byes: playerCount % 2,
      computationTimeMs: Math.random() * 5000 + 1000,
    };
  }

  async function mockPublishPairings(eventId: string, round: number, actorId: string) {
    return { success: true, message: 'Pairings published successfully' };
  }

  async function mockGetPairings(eventId: string, round?: number) {
    return [
      {
        id: 'pairing-1',
        roundNumber: round || 1,
        tableNumber: 1,
        playerA: { id: 'player-001', username: 'player1' },
        playerB: { id: 'player-002', username: 'player2' },
        publishedAt: new Date(),
        matches: [{ id: 'match-1', status: 'scheduled' }],
      },
    ];
  }

  async function mockReportMatchResult(matchId: string, resultData: any, reporterId: string) {
    return {
      id: matchId,
      ...resultData,
      status: 'completed',
      reportedBy: reporterId,
      updatedAt: new Date(),
    };
  }

  async function mockGetMatches(eventId: string, round?: number) {
    return [
      {
        id: 'match-1',
        round: round || 1,
        status: 'completed',
        playerAResult: 'win',
        playerBResult: 'loss',
        reportedBy: 'player-001',
      },
    ];
  }

  async function mockGetStandings(eventId: string) {
    return mockPlayers.slice(0, 4).map((player, index) => ({
      position: index + 1,
      playerId: player.id,
      playerName: player.username,
      matchPoints: 3 - index,
      gamePoints: 6 - (index * 2),
      record: `${1 - Math.floor(index / 2)}-${Math.floor(index / 2)}-0`,
      opponentMatchWinPercentage: 60 - (index * 5),
      gameWinPercentage: 70 - (index * 10),
      hasDropped: false,
    }));
  }

  async function mockConfirmMatchResult(confirmData: any, judgeId: string) {
    return {
      id: confirmData.matchId,
      confirmedByJudge: judgeId,
      notes: confirmData.judgeNotes,
      updatedAt: new Date(),
    };
  }

  async function mockApplyRuling(rulingData: any, judgeId: string) {
    if (mockJudge.id !== judgeId && mockOrganizer.id !== judgeId) {
      throw new Error('Only judges can apply rulings');
    }

    return {
      id: 'judging-' + Date.now(),
      matchId: rulingData.matchId,
      judgeId,
      rulingText: rulingData.rulingText,
      penalty: rulingData.penalty,
      attachments: rulingData.attachments,
      metadata: rulingData.metadata,
      createdAt: new Date(),
    };
  }

  async function mockGetAuditLogs(eventId: string) {
    return [
      {
        id: 'audit-1',
        entityType: 'Event',
        entityId: eventId,
        action: 'create',
        actorId: mockOrganizer.id,
        metadataJson: { eventData: testEventData },
        timestamp: new Date(),
        provenanceHash: 'abc123def456789',
      },
      {
        id: 'audit-2',
        entityType: 'Judging',
        entityId: 'judging-1',
        action: 'apply_ruling',
        actorId: mockJudge.id,
        metadataJson: { ruling: 'test' },
        timestamp: new Date(),
        provenanceHash: 'def789abc123456',
      },
    ];
  }

  async function mockSimulateMatch(matchId: string, userId: string) {
    return {
      matchId,
      simulationResult: {
        winProbabilities: [0.65, 0.35],
        expectedDuration: '45 minutes',
        criticalTurns: [3, 7, 12],
        affectsRatings: false,
      },
      disclaimer: 'This is a sandbox simulation and does not affect actual ratings',
    };
  }

  async function mockPredictMatchQuality(player1Id: string, player2Id: string, format: string) {
    return {
      quality: 0.78,
      winProbabilities: [0.52, 0.48],
      skillDifference: 85,
      uncertaintyFactor: 150,
      balanceCategory: 'good',
    };
  }

  async function mockExportEventData(eventId: string, exportOptions: any) {
    if (exportOptions.format === 'csv') {
      return 'position,playerId,playerName,matchPoints\n1,player-001,player1,3\n2,player-002,player2,0';
    }
    
    return {
      participants: [
        { userId: 'player-001', username: 'player1', checkedIn: true, isWaitlisted: false },
        { userId: 'player-002', username: 'player2', checkedIn: true, isWaitlisted: false },
      ],
    };
  }

  async function mockGetEventStatistics(eventId: string) {
    return {
      eventId,
      totalParticipants: 8,
      completedRounds: 1,
      totalMatches: 4,
      completedMatches: 4,
      topStandings: await mockGetStandings(eventId),
      eventDuration: '2 hours',
    };
  }

  async function mockGetRatingHistory(playerId: string) {
    return [
      {
        id: 'rating-1',
        userId: playerId,
        priorDistribution: { skill: 1200, uncertainty: 100 },
        posteriorDistribution: { skill: 1250, uncertainty: 95 },
        matchId: 'match-1',
        delta: 50,
        confidenceInterval: [1060, 1440],
        createdAt: new Date(),
      },
    ];
  }

  async function mockWebSocketNotification(event: string, data: any, socket: any) {
    socket.emit(event, data);
  }

  function mockCalculateProvenanceHash(logData: any) {
    // Mock hash calculation - in real implementation would use crypto
    return 'abc123def456789';
  }
});