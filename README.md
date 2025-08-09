# KONIVRER Azoth TCG - Godot 4 Implementation

**KONIVRER Azoth TCG** is a fully interactive, HTML5-optimized game board for the Azoth-based TCG framework built with Godot 4. It matches professional arena-style polish for animations and interactivity while implementing a custom zone layout designed for the Azoth card game system.

## 🎮 Game Features

### Core Zones
- **FLAG zone** (top-left): Special objective markers and game state indicators
- **LIFE zone** (mid-left): Player life totals and health tracking
- **Combat Row** (horizontal above Field): Active combat and temporary effects
- **Field** (central play area): Main battlefield for creatures and permanents
- **Deck zone** (top-right): Player library and draw pile
- **Removed From Play zone** (mid-right): Exiled and removed cards
- **Azoth Row** (full-width bottom): Resource management and energy system

### Interactive Features
- **Drag & Drop System**: Seamless card movement between all zones
- **Snapping Grid**: Automatic positioning in Combat Row, Field, and Azoth Row
- **Multi-Selection**: Shift-click to select multiple cards simultaneously
- **Hover Effects**: Smooth elevation tweens and visual feedback
- **Context Menus**: Right-click actions for advanced card interactions
- **Auto-Play**: Double-click cards to move them to default zones

### Technical Excellence
- **60 FPS Performance**: Optimized for HTML5 with 50+ cards on screen
- **Responsive Design**: Scales seamlessly from 720p to 1440p resolution
- **Memory Efficient**: Under 100MB usage for web deployment
- **Godot 4 Powered**: Latest game engine features and HTML5 export

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MichaelWBrennan/KONIVRER-deck-database.git
cd KONIVRER-deck-database

# Open in Godot Editor
# File → Import Project → Select project.godot
# Press F5 to run the project
```

## 📱 Technology Stack

- **Game Engine**: Godot 4.2+ with GDScript
- **Export Target**: HTML5/WebAssembly for browser deployment
- **Graphics**: 2D Control nodes with hardware acceleration
- **State Management**: Singleton pattern with signal-based architecture
- **Asset Pipeline**: SVG graphics with texture atlases for optimization

## 🔧 Development

### Build for HTML5
```bash
# In Godot Editor:
# Project → Export
# Add HTML5 preset
# Export to build/ directory
# Deploy build/ folder to web server
```

### Controls
- **Left Click**: Select card
- **Shift + Click**: Multi-select cards  
- **Double Click**: Auto-play card to default zone
- **Right Click**: Context menu (planned)
- **Drag**: Move cards between zones
- **Space**: Advance to next turn
- **R**: Reset board (planned)
- **Escape**: Clear all selections

## 🎯 Architecture Overview

### Scene Structure
```
Board (Control)
├── ZoneContainer/
│   ├── FlagZone (Control)
│   ├── LifeZone (Control)
│   ├── CombatRowZone (Control)
│   ├── FieldZone (Control)
│   ├── DeckZone (Control)
│   ├── RemovedZone (Control)
│   └── AzothRowZone (Control)
└── UI/ (Control)
    ├── LifeContainer/
    ├── AzothContainer/
    └── TurnContainer/
```

### GameState Singleton
Centralized state management handles:
- **Zone Contents**: Tracking which cards are in each zone
- **Player Data**: Life totals, Azoth resources, turn information
- **Card Registry**: Complete database of all card properties
- **Signal System**: Event-driven updates for UI and game logic

## 🔮 Game Mechanics

### Zone Interactions
- **Grid Snapping**: Combat Row, Field, and Azoth Row automatically arrange cards in organized grids
- **Stack Behavior**: FLAG, LIFE, Deck, and Removed zones stack cards with slight offsets
- **Visual Feedback**: All zones provide hover highlights and drop indicators
- **Flexible Positioning**: Manual positioning supported alongside automated systems

### Performance Optimizations
- **Texture Atlases**: Combined card graphics minimize draw calls
- **Control Nodes**: Lightweight UI system avoids physics overhead  
- **Object Pooling**: Card instances reused to reduce memory allocation
- **Selective Updates**: Only visible elements process animation and input

## 🎨 Visual Design

### Zone Aesthetics
- **Color-Coded Zones**: Each zone has distinct background colors and borders
- **Transparency Effects**: Semi-transparent backgrounds maintain visibility
- **Clear Labels**: Zone names prominently displayed for easy identification
- **Consistent Styling**: Unified design language across all interface elements

### Card Presentation
- **High-Quality Scaling**: Vector graphics maintain clarity at all resolutions
- **Smooth Animations**: 60 FPS tweening for all movement and effects
- **Depth Layering**: Proper z-ordering ensures cards display correctly during interactions
- **Visual Hierarchy**: Selected cards, hover states, and active elements clearly distinguished

## 🤝 Contributing

This Godot 4 implementation provides native game development features for improved performance and functionality. Contributions welcome for:

- Additional card types and mechanics
- Enhanced visual effects and animations  
- Multiplayer networking implementation
- Advanced AI opponent systems
- Accessibility features and improvements

## 📄 Game Rules

See [KONIVRER Basic Rules PDF](./KONIVRER_BASIC_RULES.pdf) for complete game mechanics and strategies.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*KONIVRER Azoth TCG: Professional-grade card game development with Godot 4*