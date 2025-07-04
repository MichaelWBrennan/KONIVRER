# KONIVRER AI Recorder Guide

## Overview

The KONIVRER AI Recorder is a comprehensive development tracking system designed to provide complete transparency and documentation of AI-driven development activities. It meticulously records every action, decision, and change made during the development process.

## Features

### 🎯 **Core Capabilities**
- **Real-time Activity Logging**: Records all development activities as they happen
- **Code Change Tracking**: Monitors file modifications with context and git diffs
- **Decision Documentation**: Captures AI reasoning and decision-making processes
- **Performance Monitoring**: Tracks build times, test durations, and bundle sizes
- **Security Event Recording**: Logs security-related changes and vulnerability fixes
- **Automated Documentation**: Generates comprehensive session summaries

### 🔧 **Technical Features**
- **File System Watching**: Automatically detects and records file changes
- **Git Integration**: Tracks commits, branches, and code diffs
- **Performance Metrics**: Monitors and records performance indicators
- **Session Management**: Organizes activities into discrete development sessions
- **Export Capabilities**: Generates reports in multiple formats

## Installation & Setup

The AI Recorder is already integrated into the KONIVRER project. No additional installation is required.

### Configuration

The recorder uses `ai-recorder.config.js` for configuration. Key settings include:

```javascript
{
  recording: {
    enabled: true,
    autoStart: false,
    watchFiles: true,
    includeGitDiff: true
  },
  watch: {
    include: ['src/**/*', 'scripts/**/*'],
    exclude: ['node_modules/**', 'ai-logs/**']
  }
}
```

## Usage

### Starting a Recording Session

```bash
# Start interactive recording session
npm run ai:start

# Start recording with development server
npm run dev:ai
```

### Recording Activities

```bash
# Record a general activity
npm run ai:activity "feature" "Implementing card search functionality"

# Record a decision
npm run ai:decision "Use React hooks" "Better state management and cleaner code"

# Record performance metrics
npm run ai:performance "buildTime" "15000"

# Record security events
npm run ai:security "vulnerability" "Fixed XSS vulnerability in search component"
```

### Running Commands with Recording

```bash
# Run build with recording
npm run build:ai

# Run tests with recording
npm run test:ai

# Run any command with recording
npm run ai:run "npm run lint"
```

### Ending a Session

```bash
# End current session and generate summary
npm run ai:stop

# Generate summary without ending session
npm run ai:summary
```

## Output Structure

### Session Files

Each recording session creates several files in the `ai-logs/` directory:

```
ai-logs/
├── session-ai-1234567890-abc123.json    # Detailed session data
├── ai-development-summary.md            # Human-readable summary
└── ai-metrics.json                      # Aggregated metrics
```

### Session Data Structure

```json
{
  "id": "ai-1234567890-abc123",
  "startTime": "2024-01-01T12:00:00.000Z",
  "endTime": "2024-01-01T13:30:00.000Z",
  "activities": [
    {
      "timestamp": "2024-01-01T12:05:00.000Z",
      "type": "feature",
      "description": "Implementing unified card explorer",
      "details": {
        "impact": "Improved user experience across devices"
      }
    }
  ],
  "codeChanges": [
    {
      "timestamp": "2024-01-01T12:10:00.000Z",
      "filePath": "src/components/UnifiedCardExplorer.jsx",
      "changeType": "create",
      "description": "Created responsive card explorer component",
      "linesChanged": 245,
      "gitDiff": "..."
    }
  ],
  "decisions": [
    {
      "timestamp": "2024-01-01T12:15:00.000Z",
      "decision": "Use user agent detection for responsive design",
      "rationale": "Provides better mobile experience than CSS media queries alone",
      "alternatives": ["CSS-only responsive design", "Separate mobile app"],
      "impact": "Improved mobile performance and user experience"
    }
  ],
  "performance": {
    "buildTimes": [
      {
        "timestamp": "2024-01-01T12:20:00.000Z",
        "value": 15000,
        "context": { "unit": "ms" }
      }
    ]
  },
  "security": {
    "vulnerabilities": [],
    "fixes": []
  }
}
```

## Integration with Development Workflow

### Automated Recording

The AI Recorder integrates seamlessly with existing development tools:

- **Vite Development Server**: Automatically records HMR events and build times
- **Git Operations**: Tracks commits, branch changes, and code diffs
- **NPM Scripts**: Records script execution and performance
- **File System**: Monitors file changes in real-time

### CI/CD Integration

The recorder can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions integration
- name: Run tests with AI recording
  run: npm run test:ai

- name: Build with AI recording
  run: npm run build:ai

- name: Upload AI logs
  uses: actions/upload-artifact@v3
  with:
    name: ai-development-logs
    path: ai-logs/
```

## Best Practices

### 1. **Descriptive Activity Logging**
```bash
# Good
npm run ai:activity "feature" "Implementing responsive card grid with infinite scroll"

# Better
npm run ai:activity "feature" "Implementing responsive card grid with infinite scroll to improve mobile UX and reduce initial load time"
```

### 2. **Decision Documentation**
Always document the reasoning behind significant decisions:
```bash
npm run ai:decision "Use Framer Motion for animations" "Provides better performance than CSS transitions and includes gesture support needed for mobile interactions"
```

### 3. **Performance Tracking**
Record performance metrics at key milestones:
```bash
npm run ai:performance "bundleSize" "2.1MB"
npm run ai:performance "loadTime" "850ms"
```

### 4. **Security Awareness**
Document security-related changes:
```bash
npm run ai:security "fix" "Added input sanitization to prevent XSS attacks"
```

## Advanced Features

### Custom Activity Types

You can define custom activity types in the configuration:

```javascript
activities: {
  types: [
    'feature',
    'bugfix',
    'refactor',
    'optimization',
    'security',
    'testing',
    'documentation',
    'deployment',
    'maintenance',
    'ai-training',      // Custom type
    'user-feedback'     // Custom type
  ]
}
```

### Performance Thresholds

Set performance thresholds to automatically flag issues:

```javascript
performance: {
  thresholds: {
    buildTime: 30000,     // Flag builds over 30 seconds
    testDuration: 60000,  // Flag test runs over 1 minute
    bundleSize: 5000000   // Flag bundles over 5MB
  }
}
```

### Webhook Integration

Configure webhooks for external integrations:

```javascript
notifications: {
  webhook: {
    enabled: true,
    url: 'https://your-webhook-endpoint.com/ai-events',
    events: ['session_start', 'session_end', 'security_event']
  }
}
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   chmod +x scripts/ai-recorder.js
   ```

2. **File Watching Issues**
   - Check that the `ai-logs` directory is writable
   - Ensure file paths in config are correct

3. **Git Integration Problems**
   - Verify git is installed and repository is initialized
   - Check git permissions

### Debug Mode

Enable debug logging:
```bash
DEBUG=ai-recorder npm run ai:start
```

## API Reference

### AIRecorder Class

```javascript
import AIRecorder from './scripts/ai-recorder.js';

const recorder = new AIRecorder();

// Record activities
await recorder.recordActivity('feature', 'Description', { details });

// Record code changes
await recorder.recordCodeChange('/path/to/file', 'modify', 'Description');

// Record decisions
await recorder.recordDecision('Decision', 'Rationale', ['Alternative1']);

// Record performance
await recorder.recordPerformanceMetric('buildTime', 15000);

// Record security events
await recorder.recordSecurityEvent('fix', 'Description', 'medium');

// End session
await recorder.endSession();
```

## Contributing

When contributing to the AI Recorder:

1. **Test thoroughly** with different scenarios
2. **Document new features** in this guide
3. **Follow existing patterns** for consistency
4. **Add appropriate error handling**
5. **Update configuration options** as needed

## License

The AI Recorder is part of the KONIVRER Deck Database project and is licensed under the MIT License.

---

## Quick Reference

### Essential Commands
```bash
npm run ai:start          # Start recording session
npm run ai:stop           # End session
npm run dev:ai            # Development with recording
npm run build:ai          # Build with recording
npm run ai:summary        # Generate summary
```

### Activity Types
- `feature` - New functionality
- `bugfix` - Bug fixes
- `refactor` - Code restructuring
- `optimization` - Performance improvements
- `security` - Security-related changes
- `testing` - Test-related activities
- `documentation` - Documentation updates

### Performance Metrics
- `buildTime` - Build duration in milliseconds
- `testDuration` - Test execution time
- `bundleSize` - Bundle size in bytes
- `loadTime` - Page load time
- `memoryUsage` - Memory consumption

### Security Event Types
- `vulnerability` - Security vulnerability discovered
- `fix` - Security fix applied
- `audit` - Security audit performed
- `scan` - Security scan executed

---

*For more information, see the source code in `scripts/ai-recorder.js` or contact the KONIVRER development team.*