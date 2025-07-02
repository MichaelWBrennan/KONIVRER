# KONIVRER Physical Matchmaking Utilities

This document provides an overview of the utility functions and hooks used in the KONIVRER Physical Matchmaking component.

## Table of Contents

- [Utility Functions](#utility-functions)
- [Custom Hooks](#custom-hooks)
- [Constants](#constants)

## Utility Functions

The utility functions are defined in `/src/utils/index.js` and provide common functionality used throughout the application.

### `formatTimestamp(timestamp)`

Formats an ISO timestamp string into a human-readable date and time.

```javascript
const formattedDate = formatTimestamp('2025-06-22T05:31:24.577Z');
// Returns: "Jun 22, 2025, 05:31 AM"
```

### `calculateBayesianRating(player, matches, confidenceFactor = 100)`

Calculates a Bayesian rating for a player based on their base rating and match history. This provides a more accurate rating by accounting for the number of matches played.

```javascript
const bayesianRating = calculateBayesianRating(player, matches);
// Returns a number representing the player's Bayesian-adjusted rating
```

### `generateId()`

Generates a unique ID for new entities (players, matches, tournaments).

```javascript
const newId = generateId();
// Returns a string like "lq1ab3c7d"
```

### `safeStringify(data)`

Safely converts an object to a JSON string with error handling.

```javascript
const jsonString = safeStringify(complexObject);
// Returns a formatted JSON string or error message
```

### `safeParse(jsonString, fallback = {})`

Safely parses a JSON string with error handling.

```javascript
const parsedObject = safeParse(jsonString, { default: true });
// Returns the parsed object or the fallback if parsing fails
```

### `debounce(func, wait = 300)`

Creates a debounced function that delays invoking the provided function until after the specified wait time.

```javascript
const debouncedSearch = debounce(searchFunction, 500);
// Will only execute searchFunction after 500ms of inactivity
```

### `throttle(func, wait = 300)`

Creates a throttled function that only invokes the provided function at most once per specified wait time.

```javascript
const throttledScroll = throttle(scrollHandler, 100);
// Will execute scrollHandler at most once every 100ms
```

### `isEmpty(value)`

Checks if a value is empty (null, undefined, empty string, empty array, empty object).

```javascript
if (isEmpty(data)) {
  // Handle empty data
}
```

## Custom Hooks

Custom hooks are defined in the `/src/hooks` directory and provide reusable stateful logic.

### `useLocalStorage(key, initialValue)`

A hook for using localStorage with React state, with automatic serialization/deserialization.

```javascript
const [players, setPlayers] = useLocalStorage('konivrer_players', []);
// Players will be loaded from localStorage if available, otherwise initialized as an empty array
// Changes to players will be automatically saved to localStorage
```

### `useTheme()`

A hook for managing theme preferences with localStorage persistence.

```javascript
const {
  theme,
  isAncientTheme,
  toggleTheme,
  setStandardTheme,
  setAncientTheme,
} = useTheme();
// Access current theme and theme-related functions
```

### `useDebugMode()`

A hook for managing debug mode with localStorage persistence.

```javascript
const { debugMode, toggleDebugMode, enableDebugMode, disableDebugMode } =
  useDebugMode();
// Access debug mode state and related functions
```

## Constants

Constants are defined in `/src/utils/constants.js` and provide centralized configuration values.

### Application Constants

- `APP_VERSION`: Current application version
- `DEFAULT_RATING`: Default player rating (1500)
- `DEFAULT_QR_SIZE`: Default QR code size in pixels (200)
- `DEFAULT_CONFIDENCE_FACTOR`: Default confidence factor for Bayesian rating calculation (100)

### Status Constants

- `MATCH_STATUS`: Match status options (scheduled, in_progress, completed, cancelled)
- `TOURNAMENT_STATUS`: Tournament status options (registration, active, completed, cancelled)

### Format Constants

- `TOURNAMENT_FORMATS`: Tournament formats (Swiss, Single Elimination, etc.)
- `TOURNAMENT_TYPES`: Tournament types (Standard, Modern, Legacy, etc.)
- `MATCH_FORMATS`: Match formats (Best of 1, Best of 3, Best of 5)

### QR Code Constants

- `QR_CODE_TYPES`: QR code types (match, tournament, player)

### Error Messages

- `ERROR_MESSAGES`: Standardized error messages for consistent user feedback

### Storage Keys

- `STORAGE_KEYS`: localStorage keys for persistent data

### Theme Options

- `THEMES`: Available theme options (standard, ancient)

### API Endpoints

- `API_ENDPOINTS`: API endpoints for future backend integration
