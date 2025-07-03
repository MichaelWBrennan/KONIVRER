# KONIVRER Game Board Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           OPPONENT                                         │
│                      Health: 20  Cards: 7                                  │
├───────┬───────────────────────────────────────────────────────────┬───────┤
│       │                                                           │       │
│       │                   OPPONENT'S COMBAT ROW                   │       │
│ FLAG  │                                                           │ DECK  │
│       │                                                           │       │
│       │                   OPPONENT'S FIELD                        │       │
│       │                                                           │       │
├───────┤                                                           ├───────┤
│       │                                                           │REMOVED│
│ LIFE  │                                                           │ FROM  │
│ CARDS │                                                           │ PLAY  │
│       │                                                           │       │
├───────┼───────────────────────────────────────────────────────────┼───────┤
│       │                                                           │       │
│       │                     YOUR COMBAT ROW                       │       │
│ FLAG  │                                                           │ DECK  │
│       │                                                           │       │
│       │                      YOUR FIELD                           │       │
│       │                                                           │       │
├───────┤                                                           ├───────┤
│       │                                                           │REMOVED│
│ LIFE  │                     YOUR AZOTH ROW                        │ FROM  │
│ CARDS │                                                           │ PLAY  │
│       │                                                           │       │
├───────┴───────────────────────────────────────────────────────────┴───────┤
│                              YOU                                           │
│                 Health: 20  Turn: 2  Mana: 0/2                            │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  [Draw]    [End Turn]    [Show/Hide Log]    [Concede]                     │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│                           YOUR HAND                                       │
│                                                                           │
│   ┌─────┐    ┌─────┐    ┌─────┐                                           │
│   │  5  │    │  3  │    │  5  │                                           │
│   │     │    │     │    │     │                                           │
│   │     │    │     │    │     │                                           │
│   └─────┘    └─────┘    └─────┘                                           │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Game Board Zones Explanation

### Opponent's Area
- **Opponent**: Shows opponent's health and remaining deck cards
- **Opponent's Combat Row**: Where opponent's attacking and defending Familiars are placed
- **Opponent's Field**: Where opponent's Familiars and Spells are played
- **Opponent's Flag**: Shows opponent's deck identity and elemental alignment
- **Opponent's Life Cards**: Contains opponent's face-down Life Cards
- **Opponent's Deck**: Opponent's draw pile
- **Opponent's Removed from Play**: Cards removed from play by Void effects

### Your Area
- **Your Combat Row**: Where your attacking and defending Familiars are placed
- **Your Field**: Where your Familiars and Spells are played
- **Your Azoth Row**: Where your Azoth resource cards are placed
- **Your Flag**: Shows your deck identity and elemental alignment
- **Your Life Cards**: Contains your face-down Life Cards
- **Your Deck**: Your draw pile
- **Your Removed from Play**: Cards removed from play by Void effects

### Player Information
- **You**: Shows your health, current turn number, and available/total mana

### Game Controls
- **Draw**: Draw a card from your deck
- **End Turn**: End your current turn
- **Show/Hide Log**: Toggle the game log display
- **Concede**: Surrender the current game

### Hand Area
- **Your Hand**: Shows cards in your hand with their mana costs

## Implementation Notes

1. **Responsive Design**
   - The layout should adjust based on screen size
   - On smaller screens, some zones may be collapsed or accessed via tabs

2. **Visual Clarity**
   - Each zone should have a distinct visual boundary
   - Important zones (Combat Row, Field) should be more prominent

3. **Interaction Design**
   - Cards should be draggable between appropriate zones
   - Valid drop zones should highlight when a card is being dragged

4. **Information Display**
   - Card details should be viewable on hover/tap
   - Game state information should be clearly visible at all times