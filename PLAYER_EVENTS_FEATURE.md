# Player Events Feature Implementation

This document outlines the implementation of the new player events feature, which allows players to view their registered events, current tournament placements, and submit match results directly from their profile.

## Overview

The player events feature adds a new tab to player profiles that displays:

1. Currently active events with:
   - Current placement and standings
   - Active match information
   - Match result submission
   - Time remaining in the current round

2. Upcoming events with:
   - Registration information
   - Decklist submission links

3. Past events with:
   - Final placement
   - Record
   - Prize information

## Implementation Details

### New Components and Modifications

1. **PlayerProfile.jsx**
   - Added new "Events" tab to the profile navigation
   - Implemented event data loading and state management
   - Created UI for displaying active, upcoming, and past events
   - Added match result submission functionality

### Data Structure

The events data structure includes:

```javascript
{
  id: 1,
  name: 'Friday Night KONIVRER',
  date: '2025-07-05',
  time: '19:00',
  venue: 'Local Game Store',
  status: 'active', // 'active', 'upcoming', or 'completed'
  round: 2,
  totalRounds: 4,
  record: '1-0-0',
  currentPlacement: 5,
  totalParticipants: 32
}
```

The pairings data structure includes:

```javascript
{
  id: 1,
  eventId: 1,
  round: 2,
  opponent: 'Alex Johnson',
  opponentRank: 'Gold',
  table: 5,
  status: 'active', // 'active' or 'completed'
  timeRemaining: 2400 // 40 minutes in seconds
}
```

### Features

1. **Event Registration Display**
   - Players can see all events they've registered for
   - Events are categorized as active, upcoming, or completed

2. **Tournament Progress Tracking**
   - Current round and total rounds
   - Visual progress bar
   - Current record and placement

3. **Match Management**
   - View current opponent
   - See time remaining in the round
   - Submit match results (Win/Loss/Draw with score)

4. **Decklist Submission**
   - Direct links to submit decklists for upcoming events

## User Flow

1. User navigates to their profile page (`/player/:playerId`)
2. User clicks on the "Events" tab
3. User sees their registered events
4. For active events:
   - User can see their current placement and opponent
   - User can submit match results
5. For upcoming events:
   - User can submit decklists

## API Integration

The feature is designed to work with the following API endpoints (to be implemented):

- `GET /api/players/:playerId/events` - Get all events for a player
- `GET /api/players/:playerId/pairings` - Get active pairings for a player
- `POST /api/pairings/:pairingId/results` - Submit match results

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live tournament updates
   - Push notifications for round pairings

2. **Enhanced Match History**
   - Detailed match history with opponent information
   - Performance analytics

3. **Tournament Check-in**
   - Allow players to check in to events from their profile

4. **Mobile Optimization**
   - Further improvements for mobile experience
   - QR code generation for quick table finding

## Conclusion

This feature enhances the player experience by providing a centralized location for all tournament-related activities. Players can now easily track their tournament progress, manage their matches, and submit results without leaving their profile page.