# KONIVRER Game UI Implementation Guide

Based on the official rules and game board screenshots, here are recommendations for implementing the game zones and card parts in the user interface.

## Game Board Layout

The current game board should be updated to include all the zones specified in the rules:

### Player Areas (Both Players)

1. **Flag Zone**
   - Position: Left side of the player's area
   - Purpose: Displays the player's Flag card
   - Implementation: Add a designated slot with a "FLAG" label

2. **Life Cards Zone**
   - Position: Below the Flag zone
   - Purpose: Contains the player's 4 face-down Life Cards
   - Implementation: Add a stack area with "LIFE" label showing the count of remaining Life Cards

3. **Combat Row**
   - Position: Center of the battlefield, above "Your Cards" area
   - Purpose: Where Familiars engage in battle
   - Implementation: Add a highlighted row with "COMBAT ROW" label

4. **Field**
   - Position: Already implemented as "Your Cards" and "Opponent's Cards"
   - Purpose: Where Familiars and Spells are played
   - Implementation: Maintain current implementation but add clear boundaries

5. **Azoth Row**
   - Position: Below the player's field
   - Purpose: Where Azoth resource cards are placed
   - Implementation: Add a new row with "AZOTH ROW" label

6. **Removed from Play Zone**
   - Position: Right side of the player's area
   - Purpose: For cards affected by the Void keyword
   - Implementation: Add a designated area with "REMOVED FROM PLAY" label

7. **Deck**
   - Position: Right side, above the Removed from Play zone
   - Purpose: Player's draw pile
   - Implementation: Add a card stack with "DECK" label and card count

8. **Hand**
   - Position: Already implemented as "Your Hand"
   - Purpose: Cards not yet played
   - Implementation: Maintain current implementation

### Card Display

When a card is displayed, ensure it shows all the parts described in the rules:

1. **Element(s)**
   - Position: Top left corner
   - Display: Show the elemental symbols (△, ▽, ⊡, △, ○, □, ⊗) with their costs

2. **Name**
   - Position: Top center
   - Display: Card title in bold text

3. **Lesser Type**
   - Position: Below the name
   - Display: "FAMILIAR" or "SPELL" in smaller text

4. **Ability Text**
   - Position: Center of card
   - Display: Card effects in clear, concise text

5. **Flavor Text**
   - Position: Below ability text
   - Display: Italicized narrative text

6. **Set and Rarity Symbol**
   - Position: Bottom left
   - Display: Set icon and rarity symbol (🜠, ☽, ☉)

7. **Set Number**
   - Position: Bottom right
   - Display: Card's number within its set

## Game Flow UI Elements

1. **Turn Indicator**
   - Position: Center of screen
   - Purpose: Shows whose turn it is and the current phase
   - Implementation: Add a prominent display showing "YOUR TURN - DRAW PHASE", etc.

2. **Phase Buttons**
   - Position: Below the turn indicator
   - Purpose: Allow players to progress through turn phases
   - Implementation: Add buttons for "DRAW", "MAIN", "ATTACK", "DEFENSE", "RESOLUTION", "END"

3. **Mana/Azoth Counter**
   - Position: Already implemented
   - Purpose: Shows available and total mana/Azoth
   - Implementation: Update to show elemental breakdown of available Azoth

4. **Game Log**
   - Position: Already implemented
   - Purpose: Records game actions
   - Implementation: Enhance to show more detailed card interactions

## Visual Enhancements

1. **Elemental Effects**
   - Add visual effects when cards of specific elements are played
   - Example: Fire cards create flame animations, Water cards create ripple effects

2. **Combat Animations**
   - Add attack and defense animations when Familiars battle
   - Show damage numbers and health reductions

3. **Card Highlighting**
   - Highlight cards that can be played based on available mana
   - Highlight valid targets during attack and defense phases

4. **Zone Transitions**
   - Animate cards moving between zones (hand to field, field to removed from play, etc.)
   - Add visual cues for card state changes

## Mobile Optimizations

1. **Responsive Layout**
   - Ensure all zones are visible and accessible on smaller screens
   - Implement collapsible sections for less frequently used zones

2. **Touch Controls**
   - Optimize drag-and-drop for card placement
   - Add tap-and-hold gestures for card inspection

3. **Orientation Support**
   - Design for both portrait and landscape orientations
   - Prioritize critical game elements in portrait mode