import { Player } from '../../multiplayer/RealtimeMultiplayer';
import { TournamentSecurity } from '../integrity/AntiCheatSystem';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  bracket: TournamentBracket;
  settings: TournamentSettings;
  organizer: TournamentOrganizer;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  status: TournamentStatus;
  schedule: TournamentSchedule;
  prizes: TournamentPrize[];
  security: TournamentSecurity;
  statistics: TournamentStatistics;
}

export interface TournamentFormat {
  type: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss' | 'ladder';
  gameMode: 'best-of-1' | 'best-of-3' | 'best-of-5';
  timeControl: TimeControl;
  deckRules: DeckRules;
  advancementRules: AdvancementRule[];
}

export interface TimeControl {
  matchTimeLimit: number; // minutes
  turnTimeLimit: number; // seconds
  totalTimePerPlayer: number; // minutes
  overtimeRules: 'sudden-death' | 'extra-time' | 'draw';
}

export interface DeckRules {
  format: 'standard' | 'extended' | 'legacy' | 'custom';
  deckSizeMin: number;
  deckSizeMax: number;
  bannedCards: string[];
  restrictedCards: Map<string, number>; // card ID -> max copies
  sideboardSize?: number;
  deckSubmissionDeadline?: Date;
}

export interface AdvancementRule {
  stage: string;
  condition: 'win-count' | 'win-percentage' | 'points' | 'elimination';
  threshold: number;
  tiebreaker: TiebreakerRule[];
}

export interface TiebreakerRule {
  type: 'head-to-head' | 'opponent-win-percentage' | 'game-win-percentage' | 'random';
  order: number;
}

export interface TournamentBracket {
  type: BracketType;
  rounds: BracketRound[];
  advancementPath: Map<string, string>; // participant ID -> next match ID
  eliminationPath: Map<string, string>; // participant ID -> elimination bracket
  currentRound: number;
  seeds: TournamentSeed[];
}

export type BracketType = 'single-tree' | 'double-tree' | 'round-robin-groups' | 'swiss-pairings' | 'ladder-ranking';

export interface BracketRound {
  roundNumber: number;
  name: string;
  matches: string[]; // match IDs
  status: 'pending' | 'in-progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface TournamentSeed {
  participantId: string;
  seedNumber: number;
  placement: 'upper' | 'lower' | 'bye';
  reasoning: string;
}

export interface TournamentSettings {
  isPublic: boolean;
  requiresApproval: boolean;
  maxParticipants: number;
  registrationDeadline: Date;
  startTime: Date;
  endTime?: Date;
  allowSpectators: boolean;
  allowLateRegistration: boolean;
  registrationFee?: number;
  ageRestriction?: number;
  skillRequirement?: 'none' | 'beginner' | 'intermediate' | 'advanced';
}

export interface TournamentOrganizer {
  id: string;
  name: string;
  contactInfo: ContactInfo;
  permissions: OrganizerPermissions;
  assistants: TournamentAssistant[];
}

export interface ContactInfo {
  email?: string;
  discord?: string;
  website?: string;
  phone?: string;
}

export interface OrganizerPermissions {
  canModifyBracket: boolean;
  canDisqualifyPlayers: boolean;
  canAdjustMatches: boolean;
  canViewPrivateData: boolean;
  canHandleDisputes: boolean;
  canAwardPrizes: boolean;
}

export interface TournamentAssistant {
  id: string;
  name: string;
  role: 'moderator' | 'scorekeeper' | 'stream-manager' | 'tech-support';
  permissions: Partial<OrganizerPermissions>;
}

export interface TournamentParticipant {
  playerId: string;
  registrationTime: Date;
  status: 'registered' | 'checked-in' | 'disqualified' | 'withdrawn' | 'eliminated' | 'active';
  seed?: number;
  currentMatchId?: string;
  record: ParticipantRecord;
  deck?: TournamentDeck;
  notes?: string;
  qrCode?: string;
}

export interface ParticipantRecord {
  matchesPlayed: number;
  matchesWon: number;
  gamesPlayed: number;
  gamesWon: number;
  points: number;
  tiebreakers: Map<string, number>;
  opponentsPlayed: Set<string>;
}

export interface TournamentDeck {
  deckId: string;
  name: string;
  cards: any[]; // Card list
  sideboard?: any[];
  submissionTime: Date;
  verified: boolean;
  archetype?: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  participants: string[]; // participant IDs
  scores: Map<string, number>; // participant ID -> score
  status: MatchStatus;
  startTime?: Date;
  endTime?: Date;
  games: MatchGame[];
  assignedTable?: string;
  judgeAssigned?: string;
  notes?: string;
  disputes?: MatchDispute[];
}

export type MatchStatus = 'scheduled' | 'in-progress' | 'completed' | 'dispute' | 'cancelled' | 'forfeit';

export interface MatchGame {
  gameNumber: number;
  winner?: string;
  duration: number;
  replayId?: string;
  notes?: string;
}

export interface MatchDispute {
  id: string;
  reportedBy: string;
  type: 'rules-violation' | 'timing' | 'cheating' | 'technical' | 'other';
  description: string;
  evidence?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'appealed';
  resolution?: DisputeResolution;
  reportedAt: Date;
  resolvedAt?: Date;
}

export interface DisputeResolution {
  decidedBy: string;
  decision: string;
  reasoning: string;
  penalties?: Penalty[];
  appealable: boolean;
}

export interface Penalty {
  type: 'warning' | 'game-loss' | 'match-loss' | 'disqualification';
  reason: string;
  appealable: boolean;
}

export type TournamentStatus = 'registration' | 'seeding' | 'in-progress' | 'completed' | 'cancelled';

export interface TournamentSchedule {
  phases: SchedulePhase[];
  breaks: ScheduleBreak[];
  cutToTop?: number; // Cut to top X players
  cutTime?: Date;
}

export interface SchedulePhase {
  name: string;
  startTime: Date;
  endTime?: Date;
  description: string;
  rounds: number[];
}

export interface ScheduleBreak {
  name: string;
  startTime: Date;
  duration: number; // minutes
  description: string;
}

export interface TournamentPrize {
  placement: string; // "1st", "2nd", "Top 8", etc.
  type: 'cash' | 'store-credit' | 'cosmetic' | 'trophy' | 'other';
  value: number;
  description: string;
  quantity: number;
}

export interface TournamentStatistics {
  totalParticipants: number;
  averageMatchDuration: number;
  archetypeBreakdown: Map<string, number>;
  attendanceByRound: number[];
  dropoutRate: number;
  averageGamesPerMatch: number;
  disputeCount: number;
}

export interface QRRegistration {
  tournamentId: string;
  qrCode: string;
  url: string;
  expiresAt: Date;
  registrationData?: PreRegistrationData;
}

export interface PreRegistrationData {
  playerName: string;
  contactInfo: ContactInfo;
  deckSubmitted: boolean;
  feePaid: boolean;
  notes?: string;
}

export interface MatchReport {
  matchId: string;
  reportedBy: string;
  scores: Map<string, number>;
  gameResults: GameResult[];
  duration: number;
  timestamp: Date;
  verified: boolean;
}

export interface GameResult {
  gameNumber: number;
  winner: string;
  method: 'normal' | 'forfeit' | 'timeout' | 'disqualification';
  duration: number;
}

export class TournamentOrganizerSystem {
  private tournaments: Map<string, Tournament> = new Map();
  private qrRegistrations: Map<string, QRRegistration> = new Map();
  private activeMatches: Map<string, TournamentMatch> = new Map();
  private matchReports: Map<string, MatchReport[]> = new Map();

  constructor() {
    console.log('Tournament Organizer System initialized');
  }

  createTournament(
    organizer: TournamentOrganizer,
    settings: TournamentSettings,
    format: TournamentFormat
  ): Tournament {
    const tournamentId = `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tournament: Tournament = {
      id: tournamentId,
      name: `Tournament ${new Date().toLocaleDateString()}`,
      description: 'KONIVRER Tournament',
      format,
      bracket: this.initializeBracket(format.type),
      settings,
      organizer,
      participants: [],
      matches: [],
      status: 'registration',
      schedule: {
        phases: [],
        breaks: []
      },
      prizes: [],
      security: this.createDefaultSecurity(tournamentId),
      statistics: {
        totalParticipants: 0,
        averageMatchDuration: 0,
        archetypeBreakdown: new Map(),
        attendanceByRound: [],
        dropoutRate: 0,
        averageGamesPerMatch: 0,
        disputeCount: 0
      }
    };

    this.tournaments.set(tournamentId, tournament);
    return tournament;
  }

  private initializeBracket(type: BracketType): TournamentBracket {
    return {
      type,
      rounds: [],
      advancementPath: new Map(),
      eliminationPath: new Map(),
      currentRound: 0,
      seeds: []
    };
  }

  private createDefaultSecurity(tournamentId: string): TournamentSecurity {
    return {
      tournamentId,
      securityLevel: 'enhanced',
      lockedRules: [
        {
          id: 'deck-verification',
          name: 'Deck Verification',
          description: 'All decks must be verified before play',
          enforced: true,
          parameters: { requireSubmission: true }
        }
      ],
      enforcedRestrictions: [
        {
          type: 'deck-validation',
          enabled: true,
          parameters: { realTimeCheck: true }
        }
      ],
      monitoring: {
        replayRecording: true,
        behaviorAnalysis: true,
        realTimeValidation: true,
        audienceMode: false,
        adminOverrides: true
      },
      participants: []
    };
  }

  generateQRRegistration(tournamentId: string): QRRegistration {
    const qrCode = `KONIVRER_${tournamentId}_${Date.now()}`;
    const url = `https://app.konivrer.com/tournament/register/${qrCode}`;
    
    const qrRegistration: QRRegistration = {
      tournamentId,
      qrCode,
      url,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.qrRegistrations.set(qrCode, qrRegistration);
    return qrRegistration;
  }

  registerParticipant(
    tournamentId: string,
    player: Player,
    qrCode?: string
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    if (tournament.status !== 'registration') return false;
    if (tournament.participants.length >= tournament.settings.maxParticipants) return false;

    // Check registration deadline
    if (new Date() > tournament.settings.registrationDeadline) {
      if (!tournament.settings.allowLateRegistration) return false;
    }

    // Verify QR code if provided
    if (qrCode) {
      const qrRegistration = this.qrRegistrations.get(qrCode);
      if (!qrRegistration || qrRegistration.tournamentId !== tournamentId) {
        return false;
      }
      if (new Date() > qrRegistration.expiresAt) return false;
    }

    const participant: TournamentParticipant = {
      playerId: player.id,
      registrationTime: new Date(),
      status: 'registered',
      record: {
        matchesPlayed: 0,
        matchesWon: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        points: 0,
        tiebreakers: new Map(),
        opponentsPlayed: new Set()
      },
      qrCode: qrCode
    };

    tournament.participants.push(participant);
    tournament.statistics.totalParticipants++;

    return true;
  }

  submitDeck(
    tournamentId: string,
    playerId: string,
    deck: TournamentDeck
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const participant = tournament.participants.find(p => p.playerId === playerId);
    if (!participant) return false;

    // Verify deck meets tournament rules
    if (!this.validateDeck(deck, tournament.format.deckRules)) {
      return false;
    }

    deck.submissionTime = new Date();
    deck.verified = true;
    participant.deck = deck;

    return true;
  }

  private validateDeck(deck: TournamentDeck, rules: DeckRules): boolean {
    // Check deck size
    if (deck.cards.length < rules.deckSizeMin || deck.cards.length > rules.deckSizeMax) {
      return false;
    }

    // Check banned cards
    const deckCardIds = deck.cards.map(card => card.id);
    if (rules.bannedCards.some(bannedId => deckCardIds.includes(bannedId))) {
      return false;
    }

    // Check restricted cards
    const cardCounts = new Map<string, number>();
    deckCardIds.forEach(cardId => {
      cardCounts.set(cardId, (cardCounts.get(cardId) || 0) + 1);
    });

    for (const [cardId, maxCopies] of rules.restrictedCards) {
      if ((cardCounts.get(cardId) || 0) > maxCopies) {
        return false;
      }
    }

    // Check sideboard if applicable
    if (rules.sideboardSize && deck.sideboard) {
      if (deck.sideboard.length > rules.sideboardSize) {
        return false;
      }
    }

    return true;
  }

  startTournament(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    if (tournament.status !== 'registration') return false;
    if (tournament.participants.length < 2) return false;

    // Check that all participants have submitted decks if required
    if (tournament.format.deckRules.deckSubmissionDeadline) {
      const missingDecks = tournament.participants.filter(p => !p.deck);
      if (missingDecks.length > 0) return false;
    }

    tournament.status = 'seeding';
    
    // Generate seeding
    this.generateSeeding(tournament);
    
    // Generate bracket
    this.generateBracket(tournament);
    
    tournament.status = 'in-progress';
    
    // Start first round
    this.startRound(tournament, 1);

    return true;
  }

  private generateSeeding(tournament: Tournament): void {
    // Simple random seeding for now
    // In a real system, this would use rating, previous results, etc.
    const participants = [...tournament.participants];
    
    // Shuffle participants for random seeding
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    tournament.bracket.seeds = participants.map((participant, index) => ({
      participantId: participant.playerId,
      seedNumber: index + 1,
      placement: 'upper',
      reasoning: 'Random seeding'
    }));
  }

  private generateBracket(tournament: Tournament): void {
    const participantCount = tournament.participants.length;
    
    switch (tournament.format.type) {
      case 'single-elimination':
        this.generateSingleEliminationBracket(tournament);
        break;
      case 'double-elimination':
        this.generateDoubleEliminationBracket(tournament);
        break;
      case 'round-robin':
        this.generateRoundRobinBracket(tournament);
        break;
      case 'swiss':
        this.generateSwissBracket(tournament);
        break;
      default:
        console.error('Unsupported tournament format:', tournament.format.type);
    }
  }

  private generateSingleEliminationBracket(tournament: Tournament): void {
    const participantCount = tournament.participants.length;
    const rounds = Math.ceil(Math.log2(participantCount));
    
    tournament.bracket.rounds = [];
    
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = Math.ceil(participantCount / Math.pow(2, round));
      const roundMatches: string[] = [];
      
      for (let match = 0; match < matchesInRound; match++) {
        const matchId = `match_r${round}_m${match}`;
        roundMatches.push(matchId);
        
        // Create the match
        const tournamentMatch: TournamentMatch = {
          id: matchId,
          round,
          participants: [], // Will be populated when round starts
          scores: new Map(),
          status: 'scheduled',
          games: []
        };
        
        tournament.matches.push(tournamentMatch);
      }
      
      tournament.bracket.rounds.push({
        roundNumber: round,
        name: this.getRoundName(round, rounds),
        matches: roundMatches,
        status: 'pending'
      });
    }
  }

  private generateDoubleEliminationBracket(tournament: Tournament): void {
    // Simplified double elimination - would need more complex bracket logic
    this.generateSingleEliminationBracket(tournament);
    // Add elimination bracket rounds...
  }

  private generateRoundRobinBracket(tournament: Tournament): void {
    const participants = tournament.participants;
    const rounds = participants.length - 1;
    
    tournament.bracket.rounds = [];
    
    for (let round = 1; round <= rounds; round++) {
      const roundMatches: string[] = [];
      
      // Generate pairings for this round
      const pairings = this.generateRoundRobinPairings(participants, round);
      
      pairings.forEach((pairing, index) => {
        const matchId = `match_r${round}_m${index}`;
        roundMatches.push(matchId);
        
        const tournamentMatch: TournamentMatch = {
          id: matchId,
          round,
          participants: [pairing[0].playerId, pairing[1].playerId],
          scores: new Map(),
          status: 'scheduled',
          games: []
        };
        
        tournament.matches.push(tournamentMatch);
      });
      
      tournament.bracket.rounds.push({
        roundNumber: round,
        name: `Round ${round}`,
        matches: roundMatches,
        status: 'pending'
      });
    }
  }

  private generateRoundRobinPairings(
    participants: TournamentParticipant[], 
    round: number
  ): [TournamentParticipant, TournamentParticipant][] {
    // Simplified round-robin pairing algorithm
    const pairings: [TournamentParticipant, TournamentParticipant][] = [];
    const used = new Set<string>();
    
    for (let i = 0; i < participants.length; i++) {
      if (used.has(participants[i].playerId)) continue;
      
      for (let j = i + 1; j < participants.length; j++) {
        if (used.has(participants[j].playerId)) continue;
        
        // Simple pairing - in real implementation, would ensure all participants play each other
        pairings.push([participants[i], participants[j]]);
        used.add(participants[i].playerId);
        used.add(participants[j].playerId);
        break;
      }
    }
    
    return pairings;
  }

  private generateSwissBracket(tournament: Tournament): void {
    // Swiss pairings are generated dynamically each round
    const estimatedRounds = Math.ceil(Math.log2(tournament.participants.length)) + 2;
    
    tournament.bracket.rounds = [];
    
    for (let round = 1; round <= estimatedRounds; round++) {
      tournament.bracket.rounds.push({
        roundNumber: round,
        name: `Round ${round}`,
        matches: [], // Populated when round starts
        status: 'pending'
      });
    }
  }

  private getRoundName(round: number, totalRounds: number): string {
    const roundsFromEnd = totalRounds - round + 1;
    
    switch (roundsFromEnd) {
      case 1: return 'Finals';
      case 2: return 'Semifinals';
      case 3: return 'Quarterfinals';
      case 4: return 'Round of 16';
      case 5: return 'Round of 32';
      default: return `Round ${round}`;
    }
  }

  private startRound(tournament: Tournament, roundNumber: number): void {
    const round = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber);
    if (!round) return;

    round.status = 'in-progress';
    round.startTime = new Date();
    tournament.bracket.currentRound = roundNumber;

    // Pair participants for this round
    if (tournament.format.type === 'swiss') {
      this.generateSwissPairings(tournament, roundNumber);
    } else {
      this.assignParticipantsToMatches(tournament, roundNumber);
    }

    // Start matches
    round.matches.forEach(matchId => {
      const match = tournament.matches.find(m => m.id === matchId);
      if (match && match.participants.length === 2) {
        this.startMatch(match);
      }
    });
  }

  private generateSwissPairings(tournament: Tournament, roundNumber: number): void {
    // Sort participants by points/record
    const participants = [...tournament.participants].sort((a, b) => {
      return b.record.points - a.record.points || 
             b.record.matchesWon - a.record.matchesWon;
    });

    const round = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber)!;
    const pairings: [TournamentParticipant, TournamentParticipant][] = [];
    const paired = new Set<string>();

    // Simple Swiss pairing - pair adjacent players who haven't played each other
    for (let i = 0; i < participants.length; i++) {
      if (paired.has(participants[i].playerId)) continue;

      for (let j = i + 1; j < participants.length; j++) {
        if (paired.has(participants[j].playerId)) continue;
        
        // Check if they've played before
        if (!participants[i].record.opponentsPlayed.has(participants[j].playerId)) {
          pairings.push([participants[i], participants[j]]);
          paired.add(participants[i].playerId);
          paired.add(participants[j].playerId);
          break;
        }
      }
    }

    // Create matches for pairings
    round.matches = [];
    pairings.forEach((pairing, index) => {
      const matchId = `match_r${roundNumber}_m${index}`;
      round.matches.push(matchId);

      const match: TournamentMatch = {
        id: matchId,
        round: roundNumber,
        participants: [pairing[0].playerId, pairing[1].playerId],
        scores: new Map(),
        status: 'scheduled',
        games: []
      };

      tournament.matches.push(match);
    });
  }

  private assignParticipantsToMatches(tournament: Tournament, roundNumber: number): void {
    const round = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber);
    if (!round) return;

    // For first round, use seeding
    if (roundNumber === 1) {
      const seeds = tournament.bracket.seeds;
      round.matches.forEach((matchId, index) => {
        const match = tournament.matches.find(m => m.id === matchId);
        if (match) {
          const participant1 = seeds[index * 2];
          const participant2 = seeds[index * 2 + 1];
          
          if (participant1) match.participants.push(participant1.participantId);
          if (participant2) match.participants.push(participant2.participantId);
        }
      });
    } else {
      // For subsequent rounds, use bracket advancement logic
      this.advanceWinners(tournament, roundNumber);
    }
  }

  private advanceWinners(tournament: Tournament, roundNumber: number): void {
    const previousRound = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber - 1);
    const currentRound = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber);
    
    if (!previousRound || !currentRound) return;

    const winners: string[] = [];
    
    previousRound.matches.forEach(matchId => {
      const match = tournament.matches.find(m => m.id === matchId);
      if (match && match.status === 'completed') {
        const winner = this.getMatchWinner(match);
        if (winner) winners.push(winner);
      }
    });

    // Pair winners for next round
    currentRound.matches.forEach((matchId, index) => {
      const match = tournament.matches.find(m => m.id === matchId);
      if (match) {
        const participant1 = winners[index * 2];
        const participant2 = winners[index * 2 + 1];
        
        if (participant1) match.participants.push(participant1);
        if (participant2) match.participants.push(participant2);
      }
    });
  }

  private startMatch(match: TournamentMatch): void {
    match.status = 'in-progress';
    match.startTime = new Date();
    this.activeMatches.set(match.id, match);
  }

  reportMatchResult(
    tournamentId: string,
    matchId: string,
    reportedBy: string,
    scores: Map<string, number>,
    gameResults: GameResult[]
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match) return false;

    // Verify reporter is authorized (participant or organizer)
    if (!this.canReportMatch(tournament, match, reportedBy)) {
      return false;
    }

    const report: MatchReport = {
      matchId,
      reportedBy,
      scores,
      gameResults,
      duration: Date.now() - (match.startTime?.getTime() || Date.now()),
      timestamp: new Date(),
      verified: false
    };

    // Store report
    if (!this.matchReports.has(matchId)) {
      this.matchReports.set(matchId, []);
    }
    this.matchReports.get(matchId)!.push(report);

    // Apply result if verified
    if (this.verifyMatchReport(tournament, match, report)) {
      this.applyMatchResult(tournament, match, report);
    }

    return true;
  }

  private canReportMatch(
    tournament: Tournament,
    match: TournamentMatch,
    reporterId: string
  ): boolean {
    // Organizer can always report
    if (reporterId === tournament.organizer.id) return true;
    
    // Participants can report their own matches
    return match.participants.includes(reporterId);
  }

  private verifyMatchReport(
    tournament: Tournament,
    match: TournamentMatch,
    report: MatchReport
  ): boolean {
    // Auto-verify if reported by organizer
    if (report.reportedBy === tournament.organizer.id) {
      report.verified = true;
      return true;
    }

    // Check if both participants agree (if multiple reports)
    const reports = this.matchReports.get(match.id) || [];
    const participantReports = reports.filter(r => 
      match.participants.includes(r.reportedBy)
    );

    if (participantReports.length >= 2) {
      // Both participants reported - check if scores match
      const firstReport = participantReports[0];
      const scoresMatch = this.scoresMatch(firstReport.scores, report.scores);
      
      if (scoresMatch) {
        report.verified = true;
        return true;
      } else {
        // Create dispute
        this.createMatchDispute(match, 'other', 'Score mismatch between participants', report.reportedBy);
      }
    }

    return false;
  }

  private scoresMatch(scores1: Map<string, number>, scores2: Map<string, number>): boolean {
    if (scores1.size !== scores2.size) return false;
    
    for (const [playerId, score] of scores1) {
      if (scores2.get(playerId) !== score) return false;
    }
    
    return true;
  }

  private applyMatchResult(
    tournament: Tournament,
    match: TournamentMatch,
    report: MatchReport
  ): void {
    match.status = 'completed';
    match.endTime = new Date();
    match.scores = new Map(report.scores);
    match.games = report.gameResults.map((result, index) => ({
      gameNumber: index + 1,
      winner: result.winner,
      duration: result.duration,
      notes: `Won by ${result.method}`
    }));

    // Update participant records
    match.participants.forEach(participantId => {
      const participant = tournament.participants.find(p => p.playerId === participantId);
      if (!participant) return;

      participant.record.matchesPlayed++;
      participant.record.gamesPlayed += report.gameResults.length;
      
      const gamesWon = report.gameResults.filter(g => g.winner === participantId).length;
      participant.record.gamesWon += gamesWon;
      
      const matchScore = report.scores.get(participantId) || 0;
      if (matchScore > 0) {
        participant.record.matchesWon++;
        participant.record.points += 3; // Win = 3 points
      } else if (this.isMatchDraw(report.scores)) {
        participant.record.points += 1; // Draw = 1 point
      }

      // Update opponents played
      match.participants.forEach(opponentId => {
        if (opponentId !== participantId) {
          participant.record.opponentsPlayed.add(opponentId);
        }
      });
    });

    // Check if round is complete
    this.checkRoundCompletion(tournament, match.round);
  }

  private isMatchDraw(scores: Map<string, number>): boolean {
    const scoreValues = Array.from(scores.values());
    return scoreValues.every(score => score === scoreValues[0]);
  }

  private getMatchWinner(match: TournamentMatch): string | null {
    if (match.scores.size === 0) return null;
    
    let maxScore = -1;
    let winner = null;
    let tieCount = 0;
    
    for (const [participantId, score] of match.scores) {
      if (score > maxScore) {
        maxScore = score;
        winner = participantId;
        tieCount = 1;
      } else if (score === maxScore) {
        tieCount++;
      }
    }
    
    return tieCount === 1 ? winner : null;
  }

  private checkRoundCompletion(tournament: Tournament, roundNumber: number): void {
    const round = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber);
    if (!round) return;

    const allMatchesComplete = round.matches.every(matchId => {
      const match = tournament.matches.find(m => m.id === matchId);
      return match && match.status === 'completed';
    });

    if (allMatchesComplete) {
      round.status = 'completed';
      round.endTime = new Date();
      
      // Start next round if it exists
      const nextRound = tournament.bracket.rounds.find(r => r.roundNumber === roundNumber + 1);
      if (nextRound) {
        setTimeout(() => {
          this.startRound(tournament, roundNumber + 1);
        }, 5000); // 5 second break between rounds
      } else {
        // Tournament complete
        this.completeTournament(tournament);
      }
    }
  }

  private completeTournament(tournament: Tournament): void {
    tournament.status = 'completed';
    
    // Calculate final standings
    this.calculateFinalStandings(tournament);
    
    // Award prizes
    this.awardPrizes(tournament);
    
    // Generate final statistics
    this.calculateTournamentStatistics(tournament);
  }

  private calculateFinalStandings(tournament: Tournament): void {
    // Sort participants by final record
    tournament.participants.sort((a, b) => {
      // Primary: Points
      if (a.record.points !== b.record.points) {
        return b.record.points - a.record.points;
      }
      
      // Tiebreaker 1: Head-to-head
      if (a.record.opponentsPlayed.has(b.playerId)) {
        // Look up head-to-head match
        const h2hMatch = tournament.matches.find(match => 
          match.participants.includes(a.playerId) && 
          match.participants.includes(b.playerId)
        );
        
        if (h2hMatch && h2hMatch.scores) {
          const aScore = h2hMatch.scores.get(a.playerId) || 0;
          const bScore = h2hMatch.scores.get(b.playerId) || 0;
          if (aScore !== bScore) {
            return bScore - aScore;
          }
        }
      }
      
      // Tiebreaker 2: Match win percentage
      const aWinPct = a.record.matchesPlayed > 0 ? a.record.matchesWon / a.record.matchesPlayed : 0;
      const bWinPct = b.record.matchesPlayed > 0 ? b.record.matchesWon / b.record.matchesPlayed : 0;
      
      return bWinPct - aWinPct;
    });
  }

  private awardPrizes(tournament: Tournament): void {
    tournament.prizes.forEach((prize, index) => {
      const participant = tournament.participants[index];
      if (participant) {
        console.log(`Awarding ${prize.description} to ${participant.playerId}`);
        // In a real system, this would trigger prize distribution
      }
    });
  }

  private calculateTournamentStatistics(tournament: Tournament): void {
    const stats = tournament.statistics;
    
    // Calculate average match duration
    const completedMatches = tournament.matches.filter(m => m.status === 'completed');
    if (completedMatches.length > 0) {
      const totalDuration = completedMatches.reduce((sum, match) => {
        return sum + (match.endTime!.getTime() - match.startTime!.getTime());
      }, 0);
      stats.averageMatchDuration = totalDuration / completedMatches.length / 1000; // in seconds
    }
    
    // Calculate archetype breakdown
    stats.archetypeBreakdown.clear();
    tournament.participants.forEach(participant => {
      if (participant.deck?.archetype) {
        const current = stats.archetypeBreakdown.get(participant.deck.archetype) || 0;
        stats.archetypeBreakdown.set(participant.deck.archetype, current + 1);
      }
    });
    
    // Calculate dropout rate
    const activeParticipants = tournament.participants.filter(p => 
      p.status === 'active' || p.status === 'checked-in'
    ).length;
    stats.dropoutRate = 1 - (activeParticipants / stats.totalParticipants);
    
    // Calculate average games per match
    const totalGames = completedMatches.reduce((sum, match) => sum + match.games.length, 0);
    stats.averageGamesPerMatch = completedMatches.length > 0 ? totalGames / completedMatches.length : 0;
  }

  createMatchDispute(
    match: TournamentMatch,
    type: MatchDispute['type'],
    description: string,
    reportedBy: string
  ): string {
    const disputeId = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const dispute: MatchDispute = {
      id: disputeId,
      reportedBy,
      type,
      description,
      status: 'open',
      reportedAt: new Date()
    };

    if (!match.disputes) {
      match.disputes = [];
    }
    match.disputes.push(dispute);
    match.status = 'dispute';

    return disputeId;
  }

  resolveDispute(
    tournamentId: string,
    matchId: string,
    disputeId: string,
    resolution: DisputeResolution
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match || !match.disputes) return false;

    const dispute = match.disputes.find(d => d.id === disputeId);
    if (!dispute) return false;

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();

    // Apply penalties if any
    if (resolution.penalties) {
      resolution.penalties.forEach(penalty => {
        this.applyPenalty(tournament, penalty);
      });
    }

    // Update match status if all disputes resolved
    const openDisputes = match.disputes.filter(d => d.status === 'open').length;
    if (openDisputes === 0) {
      match.status = 'completed';
    }

    return true;
  }

  private applyPenalty(tournament: Tournament, penalty: Penalty): void {
    console.log(`Applying penalty: ${penalty.type} - ${penalty.reason}`);
    // In a real system, this would apply the penalty to the appropriate participant
  }

  // Public API methods
  getTournament(tournamentId: string): Tournament | undefined {
    return this.tournaments.get(tournamentId);
  }

  getTournamentList(): Tournament[] {
    return Array.from(this.tournaments.values());
  }

  getActiveMatches(tournamentId: string): TournamentMatch[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return [];
    
    return tournament.matches.filter(match => match.status === 'in-progress');
  }

  getParticipantRecord(tournamentId: string, playerId: string): ParticipantRecord | null {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return null;
    
    const participant = tournament.participants.find(p => p.playerId === playerId);
    return participant ? participant.record : null;
  }

  checkInParticipant(tournamentId: string, playerId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;
    
    const participant = tournament.participants.find(p => p.playerId === playerId);
    if (!participant || participant.status !== 'registered') return false;
    
    participant.status = 'checked-in';
    return true;
  }

  withdrawParticipant(tournamentId: string, playerId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;
    
    const participant = tournament.participants.find(p => p.playerId === playerId);
    if (!participant) return false;
    
    participant.status = 'withdrawn';
    return true;
  }
}

export const tournamentOrganizerSystem = new TournamentOrganizerSystem();