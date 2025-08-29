# KONIVRER Azoth TCG - Godot 4 Implementation

**KONIVRER Azoth TCG** is a fully interactive, HTML5-optimized game board for the Azoth-based TCG framework built with Godot 4. It matches professional arena-style polish for animations and interactivity while implementing a custom zone layout designed for the Azoth card game system.

## 🆕 NEW: Full Repository Automation System

This repository now includes **Full Repository Automation**, a production-ready autonomous system for branch/PR lifecycle management with zero human intervention. The system automatically validates, resolves conflicts, merges, releases, and reports across ALL branches.

### Quick Links

- 🤖 [Autonomous Repository Management](#full-repo-automation)
- 📊 [Weekly Reporting System](#weekly-reporting)
- 🔧 [Smart Conflict Resolution](#smart-conflict-resolution)
- 🏷️ [Intelligent PR Labeling](#smart-pr-labeling)

---

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

### KONIVRER Game

```bash
# Clone the repository
git clone https://github.com/MichaelWBrennan/KONIVRER-deck-database.git
cd KONIVRER-deck-database

# Open in Godot Editor
# File → Import Project → Select project.godot
# Press F5 to run the project
```

### Full Repository Automation

```bash
# The automation system runs automatically on all PRs
# No manual setup required - just create PRs and they'll be processed

# To manually trigger automation:
# 1. Go to Actions tab → "🤖 Autonomous Repository Management"
# 2. Click "Run workflow"
# 3. Select target branch and force scan options
```

## 📱 Technology Stack

### KONIVRER Game

- **Game Engine**: Godot 4.2+ with GDScript
- **Export Target**: HTML5/WebAssembly for browser deployment
- **Graphics**: 2D Control nodes with hardware acceleration
- **State Management**: Singleton pattern with signal-based architecture
- **Asset Pipeline**: SVG graphics with texture atlases for optimization

### Full Repository Automation
### Backend Services (NestJS)

- PostgreSQL via TypeORM (entities auto-synced in development)
- Modules: Users, Auth, Matchmaking (TrueSkill Bayesian), Tournaments, Events, Ratings, Simulator, Audit
- New module: Progression (Tournament Profiles & Point History)

New APIs (selected):

- Progression
  - GET `/api/v1/progression/:userId/profile`
  - PUT `/api/v1/progression/:userId/preferences`
  - POST `/api/v1/progression/points/update`
- Tournaments
  - GET `/api/v1/tournaments/discover`
- Matchmaking
  - POST `/matchmaking/tournament-prep`
  - POST `/matchmaking/qualification-prep`


- **Runtime**: Python 3.11+ with GitHub API integration
- **Workflows**: GitHub Actions with comprehensive triggers
- **Conflict Resolution**: Smart merge strategies with fallback mechanisms
- **Reporting**: Automated KPI generation and issue creation
- **Labeling**: AI-powered PR categorization and tagging

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

---

## 🤖 Full Repo Automation

### 🏗️ System Architecture

The Full Repository Automation system provides complete autonomous management of all PR lifecycles with zero human intervention.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PR Creation   │───▶│  Smart Labeler   │───▶│ Auto-Approval   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CI Integration │    │ Conflict Resolver│    │ Merge Engine    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Status Checking │    │ Smart Strategies │    │ Post-Merge     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Weekly Reports  │    │ Issue Escalation│    │ Branch Cleanup  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🔄 Core Workflows

#### 1. Autonomous Repository Management (`.github/workflows/automerge-all.yml`)

- **Triggers**: PR lifecycle events, CI completion, hourly sweeps
- **Permissions**: Full repository access for autonomous operations
- **Features**:
  - Universal PR intake (all branches, all creators)
  - Automatic branch updates and rebasing
  - Smart conflict resolution orchestration
  - Zero-touch merging with fallback strategies

#### 2. Weekly Reporting System (`.github/workflows/weekly-report.yml`)

- **Schedule**: Every Monday at 1 PM UTC
- **Output**: Comprehensive KPI reports as GitHub issues
- **Metrics**: PR merge rates, conflict resolution success, CI performance, system health

#### 3. Smart PR Labeling (`.github/workflows/labeler.yml`)

- **Triggers**: PR creation and updates
- **Intelligence**: Content-aware labeling based on files, commits, and metadata
- **Categories**: Priority, type, scope, complexity, and automation readiness

### ⚙️ Configuration

#### Central Policy File (`.github/merge-rules.yaml`)

```yaml
policy:
  merge_method: squash # Primary merge strategy
  fallback_merge_method: merge # Fallback if primary fails
  retries: 3 # Maximum retry attempts
  backoff_minutes: [5, 15, 45] # Exponential backoff delays

  # Safety controls
  deny_labels: ["no-auto", "wip", "manual-review"]
  deny_paths: [] # Empty for full autonomy

  # Smart conflict resolution
  conflict_resolution:
    strategies:
      [
        "clean_rebase",
        "heuristics",
        "merge_patience",
        "merge_theirs",
        "merge_ours",
      ]
```

#### Key Configuration Options

- **`deny_paths`**: Set to `[]` for full autonomy, or specify critical paths
- **`merge_method`**: Choose between `squash`, `merge`, or `rebase`
- **`retries`**: Configure retry attempts for transient failures
- **`lockfile_regenerate`**: Enable automatic dependency regeneration

### 🚀 Smart Conflict Resolution

#### Tiered Resolution Strategy

1. **Clean Rebase**: Attempt standard rebase first
2. **Intelligent Heuristics**:
   - Lockfiles: Regenerate from base branch
   - Generated assets: Prefer base version
   - Formatting conflicts: Use patience merge
   - Documentation: Prefer incoming changes
3. **Fallback Strategies**: `-X theirs`, `-X ours` as last resorts

#### Conflict Resolver Script (`scripts/conflict_resolver.sh`)

```bash
# Automatic conflict resolution with intelligent heuristics
./scripts/conflict_resolver.sh \
  --pr-number 123 \
  --repository owner/repo \
  --github-token $GITHUB_TOKEN
```

### 📊 Weekly Reporting

#### Automated KPI Generation

- **PR Processing Metrics**: Merge rates, time-to-merge, success rates
- **Conflict Resolution Analysis**: Strategy usage and success rates
- **CI/CD Performance**: Workflow success rates, duration analysis
- **System Health**: Overall automation health score (0-100)

#### Report Generation (`scripts/report_weekly.py`)

```bash
# Generate weekly report
python scripts/report_weekly.py \
  --repository owner/repo \
  --date-range 7d \
  --output-file weekly_report.json
```

### 🏷️ Smart PR Labeling

#### Automatic Categorization

- **Priority**: urgent, high, medium, low
- **Type**: feature, bugfix, documentation, refactor, test, chore
- **Scope**: frontend, backend, infrastructure, mobile, desktop
- **Complexity**: simple, moderate, complex, major
- **Automation**: auto-merge, needs-review, no-auto, wip

#### Labeler Script (`scripts/smart_labeler.py`)

```bash
# Label PR with intelligent categorization
python scripts/smart_labeler.py \
  --repository owner/repo \
  --pr-number 123 \
  --create-labels
```

## 🚨 Operations & Recovery

### 🛡️ Safety Features

#### Infinite Loop Prevention

- **Commit Flagging**: Use `[skip-auto]` to disable automation
- **Actor Checks**: Workflows exit if triggered by automation bot
- **Commit Message Tags**: `[auto-merge]` prevents re-triggering

#### Critical Path Protection

- **Configurable Deny Paths**: Protect sensitive areas
- **Branch Protection Respect**: Works with existing rules
- **Secret Scanning**: Automatic security validation

### 🔧 Manual Overrides

#### Pause Automation

```bash
# Add to commit message
git commit -m "Update config [skip-auto]"

# Or add label to PR
# no-auto, manual-review, wip
```

#### Force Manual Processing

```bash
# Add label to PR
# needs-review, manual-merge, human-required
```

### 🚑 Disaster Recovery

#### Revert Automation Changes

```bash
# Revert the automation commit
git revert <automation-commit-hash>

# Re-run failed workflows manually
# Go to Actions → Select workflow → Re-run jobs
```

#### Manual Merge Overrides

```bash
# Force merge via GitHub UI
# 1. Go to PR
# 2. Click "Merge pull request"
# 3. Choose merge strategy
# 4. Complete merge manually
```

#### System Health Monitoring

```bash
# Check automation status
# 1. Review Actions tab for failed workflows
# 2. Check Issues for escalation reports
# 3. Review weekly reports for system health
# 4. Monitor PR merge rates and conflict resolution
```

### 📋 Recovery Runbook

#### Scenario 1: Automation Loop Detected

1. **Immediate Action**: Add `[skip-auto]` to next commit
2. **Investigation**: Check workflow logs for loop indicators
3. **Resolution**: Review and fix automation logic
4. **Verification**: Test with small PR before re-enabling

#### Scenario 2: High Escalation Rate

1. **Assessment**: Review weekly report for escalation patterns
2. **Root Cause**: Identify common failure modes
3. **Adjustment**: Update merge rules and conflict resolution
4. **Monitoring**: Track escalation rate improvement

#### Scenario 3: CI Integration Failures

1. **Diagnosis**: Check CI workflow status and logs
2. **Configuration**: Verify CI workflow names in automerge config
3. **Testing**: Validate CI integration with test PR
4. **Rollback**: Revert to previous working configuration if needed

#### Scenario 4: Conflict Resolution Failures

1. **Analysis**: Review conflict resolver logs and strategies used
2. **Strategy Adjustment**: Update merge rules for conflict resolution
3. **Testing**: Test with known conflict scenarios
4. **Documentation**: Update conflict resolution procedures

## 🧪 Testing & Validation

### Acceptance Test Scenarios

#### 1. Autonomous Merge Validation

```bash
# Create test PRs with different scenarios:
# - Simple text changes
# - Lockfile conflicts
# - Formatting conflicts
# - Trivial code conflicts

# Verify automatic resolution and merging
```

#### 2. Conflict Resolution Testing

```bash
# Test conflict resolver with various file types:
# - package-lock.json conflicts
# - Generated asset conflicts
# - Documentation conflicts
# - Code formatting conflicts
```

#### 3. Weekly Report Validation

```bash
# Trigger weekly report generation
# Verify issue creation with accurate metrics
# Check data completeness and accuracy
```

#### 4. Safety Feature Testing

```bash
# Test infinite loop prevention:
# - Add [auto-merge] to commit
# - Verify workflow exit
# - Test [skip-auto] functionality
```

### Performance Benchmarks

#### Expected Metrics

- **PR Merge Rate**: >90% for eligible PRs
- **Conflict Resolution Success**: >95% with smart strategies
- **CI Integration Success**: >98% workflow completion
- **System Health Score**: >80/100 overall

#### Monitoring Points

- **Workflow Duration**: Target <60 minutes per PR
- **Conflict Resolution Time**: Target <30 minutes per conflict
- **Report Generation**: Target <5 minutes for weekly reports
- **Labeling Accuracy**: Target >90% correct categorization

## 🔮 Future Enhancements

### Planned Features

- **AI-Powered Conflict Resolution**: Machine learning for better conflict handling
- **Predictive Analytics**: Forecast merge success probability
- **Advanced Branch Management**: Automatic backporting and cherry-picking
- **Integration APIs**: Webhook support for external systems
- **Custom Workflow Support**: User-defined automation rules

### Scalability Improvements

- **Parallel Processing**: Handle multiple PRs simultaneously
- **Caching Layer**: Reduce API calls and improve performance
- **Distributed Processing**: Support for large repositories
- **Real-time Monitoring**: Live dashboard for system status

## 🤝 Contributing

This Godot 4 implementation provides native game development features for improved performance and functionality. Contributions welcome for:

- Additional card types and mechanics
- Enhanced visual effects and animations
- Multiplayer networking implementation
- Advanced AI opponent systems
- Accessibility features and improvements

### Automation Contributions

- **Conflict Resolution Strategies**: New heuristic algorithms
- **Labeling Rules**: Enhanced categorization logic
- **Reporting Metrics**: Additional KPI calculations
- **Safety Features**: Improved protection mechanisms

## 📄 Game Rules

See [KONIVRER Basic Rules PDF](./KONIVRER_BASIC_RULES.pdf) for complete game mechanics and strategies.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_KONIVRER Azoth TCG: Professional-grade card game development with Godot 4 + Full Repository Automation_
