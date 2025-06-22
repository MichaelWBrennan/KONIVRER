# New Components Documentation

This document provides detailed information about the new components added to the KONIVRER Next-Gen Platform.

## Table of Contents

- [AR Card Scanner](#ar-card-scanner)
- [Tournament Bracket](#tournament-bracket)
- [Deck Archetype Analysis](#deck-archetype-analysis)
- [WebAssembly Card Processor](#webassembly-card-processor)
- [WebRTC Match](#webrtc-match)

## AR Card Scanner

The AR Card Scanner component uses the device camera to scan physical cards, identify them using computer vision, and provide augmented reality overlays with card information and game actions.

### Features

- Real-time card detection and recognition
- AR overlays with card information
- Card authenticity verification
- Support for multiple scanning modes (auto, manual, continuous)
- Debug mode for developers
- Ancient theme support

### Usage

```jsx
import { ARCardScanner } from './components/ARCardScanner';

// Basic usage
<ARCardScanner 
  onCardDetected={(card) => console.log('Card detected:', card)}
  onCardVerified={(result) => console.log('Verification result:', result)}
  enableAR={true}
  showDebugInfo={false}
  scanMode="auto"
/>

// With all options
<ARCardScanner 
  onCardDetected={(card) => handleCardDetection(card)}
  onCardVerified={(result) => handleCardVerification(result)}
  enableAR={true}
  showDebugInfo={true}
  scanMode="continuous" // 'auto', 'manual', 'continuous'
  cardDatabase={myCardDatabase}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCardDetected` | Function | - | Callback function called when a card is detected |
| `onCardVerified` | Function | - | Callback function called when a card is verified |
| `enableAR` | Boolean | `true` | Enable or disable AR overlays |
| `showDebugInfo` | Boolean | `false` | Show or hide debug information |
| `scanMode` | String | `'auto'` | Scanning mode: 'auto', 'manual', or 'continuous' |
| `cardDatabase` | Array | `[]` | Array of card data for recognition |

## Tournament Bracket

The Tournament Bracket component visualizes tournament brackets with interactive features, match details, player statistics, and customizable display options.

### Features

- Support for various tournament formats (single elimination, double elimination, Swiss, round-robin)
- Interactive match and player details
- Zoom and pan navigation
- Real-time updates for in-progress tournaments
- Multiple theme options
- Responsive design for all screen sizes

### Usage

```jsx
import { TournamentBracket } from './components/TournamentBracket';

// Basic usage
<TournamentBracket 
  tournamentData={tournamentData}
  onMatchClick={(match) => console.log('Match clicked:', match)}
  onPlayerClick={(player) => console.log('Player clicked:', player)}
/>

// With all options
<TournamentBracket 
  tournamentData={tournamentData}
  onMatchClick={(match) => handleMatchClick(match)}
  onPlayerClick={(player) => handlePlayerClick(player)}
  highlightedMatch="match-007"
  highlightedPlayer="player-001"
  layout="horizontal" // 'horizontal', 'vertical'
  showScores={true}
  showPlayerStats={true}
  animateProgress={true}
  bracketType="single" // 'single', 'double', 'swiss', 'round-robin'
  theme="default" // 'default', 'minimal', 'classic', 'ancient'
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tournamentData` | Object | - | Tournament data object |
| `onMatchClick` | Function | - | Callback function called when a match is clicked |
| `onPlayerClick` | Function | - | Callback function called when a player is clicked |
| `highlightedMatch` | String | `null` | ID of the match to highlight |
| `highlightedPlayer` | String | `null` | ID of the player to highlight |
| `layout` | String | `'horizontal'` | Layout orientation: 'horizontal' or 'vertical' |
| `showScores` | Boolean | `true` | Show or hide match scores |
| `showPlayerStats` | Boolean | `true` | Show or hide player statistics |
| `animateProgress` | Boolean | `true` | Enable or disable animations for in-progress matches |
| `bracketType` | String | `'single'` | Bracket type: 'single', 'double', 'swiss', or 'round-robin' |
| `theme` | String | `'default'` | Theme: 'default', 'minimal', 'classic', or 'ancient' |

## Deck Archetype Analysis

The Deck Archetype Analysis component analyzes deck compositions, identifies archetypes, provides statistical insights, and visualizes meta trends.

### Features

- Comprehensive archetype identification and analysis
- Meta percentage tracking and trend visualization
- Card usage statistics and synergy analysis
- Matchup win rate matrix
- Interactive filtering and sorting options
- Support for multiple formats and time ranges

### Usage

```jsx
import { DeckArchetypeAnalysis } from './components/DeckArchetypeAnalysis';

// Basic usage
<DeckArchetypeAnalysis 
  deckData={deckData}
  metaData={metaData}
  onArchetypeSelect={(archetype) => console.log('Archetype selected:', archetype)}
/>

// With all options
<DeckArchetypeAnalysis 
  deckData={deckData}
  metaData={metaData}
  onArchetypeSelect={(archetype) => handleArchetypeSelect(archetype)}
  onCardSelect={(card) => handleCardSelect(card)}
  selectedArchetype="Aggro"
  selectedCard="KON006"
  timeRange="30d" // '7d', '30d', '90d', 'all'
  format="standard" // 'standard', 'modern', 'legacy', 'vintage', 'commander'
  showWinrates={true}
  showTrends={true}
  showCardBreakdown={true}
  showMetaPercentages={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deckData` | Array | - | Array of deck data objects |
| `metaData` | Object | - | Meta data object with archetype information |
| `onArchetypeSelect` | Function | - | Callback function called when an archetype is selected |
| `onCardSelect` | Function | - | Callback function called when a card is selected |
| `selectedArchetype` | String | `null` | Currently selected archetype |
| `selectedCard` | String | `null` | Currently selected card |
| `timeRange` | String | `'30d'` | Time range: '7d', '30d', '90d', or 'all' |
| `format` | String | `'standard'` | Format: 'standard', 'modern', 'legacy', 'vintage', or 'commander' |
| `showWinrates` | Boolean | `true` | Show or hide win rates |
| `showTrends` | Boolean | `true` | Show or hide trend data |
| `showCardBreakdown` | Boolean | `true` | Show or hide card breakdown |
| `showMetaPercentages` | Boolean | `true` | Show or hide meta percentages |

## WebAssembly Card Processor

The WebAssembly Card Processor component uses WebAssembly for high-performance card data processing, filtering, and sorting operations.

### Features

- High-performance card filtering and sorting
- Fast image processing for card recognition
- Efficient data compression and decompression
- Real-time card analysis and statistics

### Usage

```jsx
import { WasmCardProcessor } from './components/WasmCardProcessor';

// Basic usage
<WasmCardProcessor 
  cards={cards}
  initialFilters={{}}
  initialSortBy="name"
  initialSortDirection="asc"
/>

// With all options
<WasmCardProcessor 
  cards={cards}
  initialFilters={{
    types: ['Creature', 'Spell'],
    rarities: ['Rare', 'Mythic'],
    costRange: [1, 5]
  }}
  initialSortBy="name"
  initialSortDirection="asc"
  onProcessingComplete={(result) => handleProcessingComplete(result)}
  maxCards={1000}
  processingMode="standard" // 'standard', 'high-performance', 'memory-optimized'
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | Array | `[]` | Array of card data objects |
| `initialFilters` | Object | `{}` | Initial filter settings |
| `initialSortBy` | String | `'name'` | Initial sort field |
| `initialSortDirection` | String | `'asc'` | Initial sort direction: 'asc' or 'desc' |
| `onProcessingComplete` | Function | - | Callback function called when processing is complete |
| `maxCards` | Number | `1000` | Maximum number of cards to process |
| `processingMode` | String | `'standard'` | Processing mode: 'standard', 'high-performance', or 'memory-optimized' |

## WebRTC Match

The WebRTC Match component enables real-time peer-to-peer match communication using WebRTC technology.

### Features

- Real-time peer-to-peer communication
- Video and audio streaming during matches
- Secure data exchange between players
- Support for multiple connection modes
- Fallback mechanisms for NAT traversal
- Ancient theme support

### Usage

```jsx
import { WebRTCMatch } from './components/WebRTCMatch';

// Basic usage
<WebRTCMatch 
  isHost={true}
  playerName="Player_1"
/>

// With all options
<WebRTCMatch 
  isHost={true}
  playerName="Player_1"
  roomId="match-123"
  onConnect={(peerId) => console.log('Connected to peer:', peerId)}
  onDisconnect={(peerId) => console.log('Disconnected from peer:', peerId)}
  onMessage={(data) => handleIncomingMessage(data)}
  enableVideo={true}
  enableAudio={true}
  signalServer="wss://signal.example.com"
  iceServers={[
    { urls: 'stun:stun.example.com:19302' },
    { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
  ]}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isHost` | Boolean | `false` | Whether this client is the host |
| `playerName` | String | - | Name of the player |
| `roomId` | String | - | ID of the room to join |
| `onConnect` | Function | - | Callback function called when connected to a peer |
| `onDisconnect` | Function | - | Callback function called when disconnected from a peer |
| `onMessage` | Function | - | Callback function called when a message is received |
| `enableVideo` | Boolean | `true` | Enable or disable video streaming |
| `enableAudio` | Boolean | `true` | Enable or disable audio streaming |
| `signalServer` | String | - | WebSocket URL of the signaling server |
| `iceServers` | Array | - | Array of ICE server configurations |