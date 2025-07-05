/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import EnhancedTournamentManager from '../components/tournaments/EnhancedTournamentManager';
import TournamentNotifications from '../components/notifications/TournamentNotifications';

/**
 * LiveTournament component
 * Displays the tournament management interface for organizers and participants
 */
const LiveTournament = (): any => {
  const { tournamentId } = useParams();

  return (
    <div className="min-h-screen bg-background" />
      <EnhancedTournamentManager tournamentId={tournamentId} / />
      <TournamentNotifications tournamentId={tournamentId} / />
    </div>
  );
};

export default LiveTournament;