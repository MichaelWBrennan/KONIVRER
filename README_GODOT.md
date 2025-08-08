# KONIVRER Azoth TCG - Godot 4 Implementation

A fully interactive, HTML5-optimized game board for the Azoth-based TCG framework built with Godot 4. Matches MTG Arena's polish for animations and interactivity with custom zone layout.

## Zone Layout

- **FLAG zone** (top-left)
- **LIFE zone** (mid-left)  
- **Combat Row** (horizontal container above Field)
- **Field** (central play area)
- **Deck zone** (top-right)
- **Removed From Play zone** (mid-right)
- **Azoth Row** (full-width bottom bar)

## Features

- **Interactive Card System**: Drag/drop between zones, hover effects, context menus
- **Snapping Grid**: Combat Row, Field, and Azoth Row support grid-based positioning
- **Zone Management**: Flexible Control nodes with responsive scaling
- **Game State Management**: Centralized singleton tracks all game data
- **HTML5 Optimized**: 60 FPS performance with 50+ cards
- **Multi-Resolution Support**: Scales from 720p to 1440p

## Controls

- **Left Click**: Select card
- **Shift + Click**: Multi-select cards
- **Double Click**: Auto-play card to default zone
- **Right Click**: Context menu (TODO)
- **Drag**: Move cards between zones
- **Space**: Next turn
- **R**: Reset board (TODO)
- **Escape**: Clear selections

## File Structure

```
├── project.godot          # Main project configuration
├── export_presets.cfg     # HTML5 export settings
├── scenes/
│   ├── Board.tscn         # Main board layout
│   └── Card.tscn          # Reusable card scene
├── scripts/
│   ├── board.gd           # Board layout and interaction logic
│   ├── card.gd            # Card visuals and per-card interactions
│   └── game_state.gd      # Singleton game state management
└── assets/
    ├── cards/             # Card artwork
    ├── zones/             # Zone frame graphics
    └── ui/                # UI elements
```

## Build Instructions

1. Open project in Godot 4.2+
2. For HTML5 export:
   - Go to Project → Export
   - Add HTML5 preset
   - Export to `build/` directory
3. Deploy `build/` folder to web server

## Development Notes

- Uses Godot's Control nodes for flexible UI scaling
- Manual transform system avoids unnecessary physics overhead
- Texture atlases minimize draw calls for HTML5 performance
- GameState singleton separates game logic from visuals
- Keyboard navigation ready for accessibility features

## Performance Targets

- 60 FPS with 50+ cards on HTML5
- Sub-200ms response time for drag operations
- Memory usage under 100MB for web deployment