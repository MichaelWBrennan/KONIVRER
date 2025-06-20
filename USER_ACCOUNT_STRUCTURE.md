# KONIVRER User Account Structure

## Overview
This document outlines the complete user account structure for the KONIVRER platform, including data schemas, user roles, and account features.

## User Data Schema

### Core User Properties
```javascript
{
  // Identity
  id: number,                    // Unique user identifier
  email: string,                 // Email address (validated)
  username: string,              // Unique username (3-20 chars, alphanumeric + underscore)
  displayName: string,           // Public display name (1-50 chars)
  avatar: string,                // Avatar URL (auto-generated from username)
  
  // Roles & Permissions
  roles: ['player', 'judge', 'organizer', 'admin'],  // Array of user roles
  judgeLevel: number,            // Judge certification level (0-5)
  organizerLevel: number,        // Tournament organizer level (0-5)
  
  // Profile Information
  joinDate: string,              // Account creation date (ISO format)
  location: string,              // User location (optional)
  bio: string,                   // User biography (max 500 chars)
  verified: boolean,             // Account verification status
  
  // Security
  twoFactorEnabled: boolean,     // 2FA status
  lastLogin: string,             // Last login timestamp
  loginAttempts: number,         // Failed login attempts counter
  accountLocked: boolean,        // Account lock status
}
```

### User Statistics
```javascript
stats: {
  tournamentsPlayed: number,     // Total tournaments participated
  tournamentsWon: number,        // Tournaments won
  decksCreated: number,          // Number of decks created
  judgeEvents: number,           // Events judged (for judges)
  organizedEvents: number,       // Events organized (for organizers)
}
```

### Achievement System
```javascript
achievements: [
  {
    id: number,                  // Achievement ID
    name: string,                // Achievement name
    description: string,         // Achievement description
    earned: boolean,             // Whether user has earned it
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  }
]
```

### User Preferences
```javascript
preferences: {
  // Appearance
  theme: 'dark' | 'light' | 'auto',
  language: string,              // Language code (default: 'en')
  timezone: string,              // User timezone
  
  // Notifications
  emailNotifications: boolean,
  pushNotifications: boolean,
  tournamentReminders: boolean,
  
  // Privacy
  deckSharing: 'public' | 'friends' | 'private',
  profileVisibility: 'public' | 'friends' | 'private',
  
  // Legal
  dataProcessing: boolean,       // Data processing consent
  marketing: boolean,            // Marketing communications consent
}
```

### User Collections & Associations
```javascript
{
  savedDecks: number[],          // Array of saved deck IDs
  registeredTournaments: number[], // Tournaments user is registered for
  organizedTournaments: number[], // Tournaments user has organized
}
```

## User Roles & Permissions

### 1. Player (Default)
- Basic account features
- Create and manage decks
- Register for tournaments
- View public content
- Access game simulator

### 2. Judge
- All Player permissions
- Access to Judge Center
- Tournament judging tools
- Judge-specific resources
- Level-based permissions (1-5)

### 3. Organizer
- All Player permissions
- Create and manage tournaments
- Access to tournament management tools
- Event organization features
- Level-based permissions (1-5)

### 4. Admin
- All permissions
- User management
- Platform administration
- System configuration
- Content moderation

## Account Features & Pages

### Profile Management (`/profile`)
- **Overview Tab**: Basic info, stats, achievements
- **Edit Profile**: Update personal information
- **Security Settings**: Password, 2FA, login history
- **Preferences**: Theme, notifications, privacy
- **Achievements**: View earned achievements and progress

### Personal Collections
- **My Decks** (`/decks`): Personal deck collection
- **Collection** (`/collection`): Card collection management
- **Battle Pass** (`/battle-pass`): Progression system

### Account Navigation
Users can access their account through:
1. **User Avatar Dropdown** (top-right corner)
2. **Profile Dropdown** (main navigation)
3. **Direct Profile Link** (`/profile`)

## Security Features

### Authentication
- Email/password login
- OAuth integration support
- Session token management
- Rate limiting (5 attempts per 15 minutes)

### Security Measures
- Password hashing with salt
- Session token generation
- Account lockout protection
- Login attempt tracking
- Two-factor authentication support

### Data Protection
- Input validation with Zod schemas
- XSS protection
- CSRF protection
- Secure session storage

## Registration Process

### Required Fields
- Email address
- Password (8+ chars, complexity requirements)
- Username (3-20 chars, unique)
- Display name
- Terms & privacy agreement

### Optional Fields
- Location
- Profile picture (auto-generated if not provided)

### New User Defaults
- Role: ['player']
- Theme: 'dark'
- All notifications: enabled
- Profile visibility: 'public'
- Deck sharing: 'public'
- Welcome achievement automatically granted

## Data Storage

### Current Implementation
- **Frontend Storage**: localStorage for session persistence
- **Session Management**: Encrypted session tokens
- **Mock Data**: Comprehensive user examples in AuthContext

### Production Considerations
- Database integration needed for persistent storage
- User data encryption
- Backup and recovery systems
- GDPR compliance features
- Data export/deletion capabilities

## Account Lifecycle

### Account Creation
1. User registration with validation
2. Email verification (planned)
3. Welcome achievement granted
4. Default preferences applied
5. Auto-generated avatar assigned

### Account Management
- Profile updates
- Password changes
- Role applications (judge/organizer)
- Preference modifications
- Achievement tracking

### Account Security
- Login monitoring
- Suspicious activity detection
- Account recovery options
- Data export capabilities
- Account deletion (planned)

## Future Enhancements

### Planned Features
- Email verification system
- Password recovery
- Social login integration
- Advanced achievement system
- Friend/follow system
- Account analytics dashboard
- Data export tools
- Account deletion workflow

### Integration Points
- Tournament system integration
- Deck builder integration
- Community features
- Analytics tracking
- External platform connections