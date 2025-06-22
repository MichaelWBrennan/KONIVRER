# KONIVRER Physical Matchmaking Component

This is a simplified implementation of the Physical Matchmaking component for the KONIVRER Deck Database. It demonstrates the core functionality of the physical matchmaking system with QR code generation.

## Build Status

This simplified version has been successfully built and tested. The main project's build is currently experiencing issues with React dependencies, but this simplified implementation provides all the core functionality needed for the physical matchmaking component.

## Features

- **Physical Match Management**: Create and manage physical matches between players
- **Tournament Organization**: Set up and manage tournaments with various formats
- **QR Code Generation**: Generate QR codes for matches and tournaments
- **Player Statistics**: Track player ratings and performance

## Implementation Details

### Components

1. **PhysicalMatchmaking**: Main component that displays matches, tournaments, and player statistics
2. **QRCodeGenerator**: Component for generating QR codes with match or tournament data

### Context

- **PhysicalMatchmakingContext**: Provides state management and business logic for the physical matchmaking system

## QR Code Implementation

The QR codes contain structured JSON data that includes:

### Match QR Codes
- Match ID and type
- Player information (names, IDs, ratings)
- Match format and status
- Timestamp and app version

### Tournament QR Codes
- Tournament ID, name, and type
- Format and status
- Participant details
- Round information
- Timestamp and app version

## Usage

1. Select a match or tournament from the dropdown
2. A QR code will be generated with the relevant information
3. This QR code can be scanned by players to access match or tournament details
4. Enable the "Show QR code data" option to view the raw data for debugging

## Integration with Main Project

To integrate this component with the main KONIVRER Deck Database:

1. Copy the components and context to the appropriate directories
2. Import and use the PhysicalMatchmaking component in your routes
3. Ensure the PhysicalMatchmakingProvider is available in the component tree

## Styling

The current implementation uses basic styling. For the ancient-esoteric theme:

1. Add appropriate CSS classes to the components
2. Use the theme's color palette and typography
3. Consider adding decorative elements around the QR codes

## Dependencies

- React
- qrcode.react for QR code generation