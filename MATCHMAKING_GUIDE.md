# KONIVRER Physical Matchmaking System

## 🎯 Overview

The KONIVRER Matchmaking System is designed to help organize and manage physical card game tournaments, matches, and player tracking. It works both online and offline, making it perfect for local game stores, tournaments, and casual play groups.

## 🚀 Features

### 📱 PWA Support
- **Installable Web App**: Can be installed on phones, tablets, and computers
- **Offline Functionality**: Works without internet connection
- **Cross-Platform**: Runs on iOS, Android, Windows, Mac, and Linux
- **Touch Optimized**: Designed for mobile and tablet use

### 👥 Player Management
- Add and manage player profiles
- Track player ratings, wins, losses, and draws
- Import/export player data
- Search and filter players

### ⚡ Quick Match Creation
- Select multiple players for instant pairing
- Randomized or manual player pairing
- Multiple format support (Standard, Extended, Legacy, Draft)
- Best-of-1, Best-of-3, or Best-of-5 matches

### 🏆 Tournament Organization
- Create tournaments with various formats
- Single elimination, double elimination, Swiss, round-robin
- Player registration and bracket management
- Real-time match tracking and results

### 📊 Match Tracking
- Live score tracking during matches
- Game-by-game result recording
- Automatic winner determination
- Match history and statistics

### 💾 Data Management
- Local storage for offline use
- Export data as JSON files
- Import previously exported data
- Backup and restore functionality

## 🔗 Access Methods

### 1. Integrated Version
**URL**: `/matchmaking`
- Full integration with KONIVRER website
- Access to user accounts and profiles
- Synchronized with online rankings
- Best for established communities

### 2. Standalone PWA Version
**URL**: `/standalone-matchmaking`
- Independent operation
- No account required
- Perfect for local tournaments
- Optimized for mobile devices

## 📱 Installation as PWA

### iOS (Safari)
1. Open the matchmaking system in Safari
2. Tap the Share button (square with arrow up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to install

### Android (Chrome)
1. Open the matchmaking system in Chrome
2. Tap the menu (three dots) in the browser
3. Select "Add to Home screen" or "Install app"
4. Tap "Add" or "Install"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click it and select "Install"
3. The app will be added to your applications

## 🎮 Usage Guide

### Setting Up Players

1. **Navigate to Players Tab**
   - Click on "Players" in the navigation
   - View all registered players

2. **Add New Player**
   - Click "Add Player" button
   - Fill in player information:
     - Name (required)
     - Email (optional)
     - Starting rating (default: 1500)
     - Current wins/losses/draws

3. **Edit Player**
   - Click the edit icon next to any player
   - Update their information and statistics

### Creating Quick Matches

1. **Go to Quick Match Tab**
   - Select "Quick Match" from navigation

2. **Select Players**
   - Click on players to select them for matches
   - Selected players will be highlighted in blue
   - You need at least 2 players to create matches

3. **Configure Match Settings**
   - Choose format (Standard, Extended, Legacy, Draft)
   - Select match length (Best of 1, 3, or 5)

4. **Create Matches**
   - Click "Create Matches" button
   - Players will be randomly paired
   - Matches appear in the "Active Matches" section

### Recording Match Results

1. **Find Active Match**
   - Scroll to "Active Matches" section
   - Locate the match in progress

2. **Record Game Results**
   - Click "[Player Name] Wins" for each game
   - Scores update automatically
   - Match completes when a player reaches required wins

3. **View Completed Matches**
   - Completed matches show the final winner
   - Results are automatically saved

### Tournament Management

1. **Create Tournament**
   - Go to "Tournaments" tab
   - Click "New Tournament"
   - Configure tournament settings:
     - Name and format
     - Tournament type (elimination, Swiss, etc.)
     - Maximum players
     - Start date

2. **Manage Tournament**
   - Add players to tournament
   - Track bracket progression
   - Record match results
   - View tournament standings

## 📊 Data Management

### Exporting Data
1. Click the Settings icon (gear) in the header
2. Select "Export Data"
3. A JSON file will be downloaded with all your data
4. Save this file as a backup

### Importing Data
1. Click the Settings icon in the header
2. Click "Import Data"
3. Select a previously exported JSON file
4. Data will be restored from the file

### Data Structure
The exported JSON contains:
```json
{
  "players": [...],
  "tournaments": [...],
  "matches": [...],
  "exportDate": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}
```

## 🔧 Technical Features

### Offline Functionality
- All data stored locally in browser
- No internet required for operation
- Automatic sync when connection restored
- Works in airplane mode

### Mobile Optimization
- Touch-friendly interface
- Responsive design for all screen sizes
- Optimized for portrait and landscape modes
- Fast performance on mobile devices

### Browser Compatibility
- Chrome 67+ (full PWA support)
- Safari 11.1+ (iOS PWA support)
- Firefox 79+ (partial PWA support)
- Edge 79+ (full PWA support)

## 🎯 Use Cases

### Local Game Store Tournaments
- Install on store tablet/computer
- Manage weekly tournaments
- Track regular player progress
- Export results for record keeping

### Casual Play Groups
- Install on personal device
- Quick match creation for game nights
- Track friend group statistics
- Share results via export/import

### Large Tournaments
- Multiple devices for different sections
- Export/import to combine results
- Offline operation in venues with poor internet
- Real-time match tracking

### Home Tournaments
- Family game tournaments
- Track seasonal competitions
- Maintain player rankings
- Historical match data

## 🔄 Sharing and Collaboration

### QR Code Sharing
- Click QR code icon in header
- Share QR code for easy access
- Others can scan to join tournament

### Data Sharing
- Export data from one device
- Import on another device
- Combine multiple tournament results
- Backup important tournaments

### URL Sharing
- Share direct link to matchmaking system
- Works on any device with browser
- No installation required for basic use

## 🛠️ Troubleshooting

### Common Issues

**App won't install as PWA**
- Ensure you're using a supported browser
- Check that you're on HTTPS
- Try refreshing the page and trying again

**Data not saving**
- Check browser storage permissions
- Clear browser cache and try again
- Ensure you have sufficient storage space

**Matches not updating**
- Refresh the page
- Check if you're in offline mode
- Verify match settings are correct

**Import/Export not working**
- Check file format is JSON
- Ensure file isn't corrupted
- Try exporting again and re-importing

### Performance Tips

- **Regular Exports**: Export data regularly as backup
- **Clear Old Data**: Remove completed tournaments periodically
- **Browser Updates**: Keep browser updated for best performance
- **Storage Management**: Monitor browser storage usage

## 🔐 Privacy and Security

### Data Storage
- All data stored locally on your device
- No data sent to external servers
- You control all player information
- Export/delete data anytime

### Privacy Features
- No account registration required
- No tracking or analytics
- No personal data collection
- Offline-first design

## 🚀 Future Enhancements

### Planned Features
- Advanced tournament brackets
- Statistical analysis and reporting
- Integration with ranking systems
- Multi-language support
- Enhanced mobile gestures
- Voice commands for match recording

### Community Requests
- Custom tournament formats
- Team tournaments
- Integration with streaming platforms
- Advanced player statistics
- Tournament scheduling

## 📞 Support

For issues or feature requests:
1. Check this guide first
2. Try the troubleshooting section
3. Export your data as backup
4. Contact support with specific details

## 🎉 Getting Started

1. **Visit the matchmaking system**
   - Go to `/matchmaking` or `/standalone-matchmaking`

2. **Add some players**
   - Start with 4-8 players for testing

3. **Create your first matches**
   - Select players and create quick matches

4. **Record results**
   - Practice recording game results

5. **Install as PWA**
   - Install on your device for easy access

6. **Export data**
   - Create your first backup

Ready to organize your KONIVRER tournaments like a pro! 🎯