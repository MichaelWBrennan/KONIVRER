import React, { useState, useMemo } from "react";
import * as cs from "./rulesWiki.css.ts";

interface WikiSection {
  id: string;
  title: string;
  content: string;
  subsections?: WikiSection[];
  keywords: string[];
  category: "basic" | "tournament" | "conduct";
}

interface RulesWikiProps {
  className?: string;
}

export const RulesWiki: React.FC<RulesWikiProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "basic" | "tournament" | "conduct">("all");

  const wikiSections: WikiSection[] = useMemo(() => [
    // BASIC RULES SECTIONS
    {
      id: "introduction",
      title: "Introduction to KONIVRER",
      category: "basic",
      keywords: ["introduction", "overview", "objective", "components", "game details"],
      content: `# What is KONIVRER?

Set within an alternate history parallel to our own, KONIVRER (pronounced Conjurer) is a strategic, expandable card game made to simulate head-to-head battles where players take on the role of powerful magic users aptly named "Conjurers," of which this game takes its name. Build powerful decks representing your grimoire, the cards, and the pages within. Gods and monsters of legend inhabit this familiar yet new world. Do you have what it takes to survive?

## Objective
- **Winning**: Reduce your opponent's Life Cards to 0 by attacking with Familiars and Spells
- Players can defend with their own Familiar to protect their Life Cards
- The last player or team standing wins

## Components
- 6× 5 Element Flags
- 2× sets of the 63-card intro set
- Rulebook (this document)
- Optional: Dice to track counters (not included)

## Game Details
- **Playtime**: 30–60 minutes
- **Age**: 12+
- **Players**: 2 or more (supports multiple game modes, including 1v1, 2v2, 3v3, and free-for-all)
- **Required**: A flat playing surface (e.g., table)

## Deck Construction
Each deck follows strict building rules:
- 1 "Flag" to anchor your deck's Azoth identity, and it does not count toward your deck total
- 40 cards total
- 1 copy per card maximum
- 25 Common (🜠) cards
- 13 Uncommon (☽) cards
- 2 Rare (☉) cards`,
      subsections: [
        {
          id: "q-and-a",
          title: "Q&A",
          category: "basic",
          keywords: ["alphabet", "letters", "history", "rome", "latin", "greek"],
          content: `## Q&A

**Q: "So what's with the funky letters in the card names?"**

**A:** "In this alternative history, one empire-sized butterfly effect had to occur to achieve a level of narrative cohesion and 'fantasy realism' that I was satisfied with having for this world to exist: Rome never came to power. Because of this, the modern-day alphabet of this world doesn't have the structure in our world and stays in a Latin-derived form very similar to Roman Square but with heavier Greek influence. Part 7 of this rulebook shows how this alphabet works."`
        }
      ]
    },
    {
      id: "card-parts",
      title: "Parts of a Card",
      category: "basic",
      keywords: ["card parts", "elements", "name", "lesser type", "abilities", "flavor", "rarity"],
      content: `# Parts of a Card

All cards contain the following parts:

## 1. Element(s)
The cost and elemental alignment of a card. The symbol "✡⃝" determines the card's initial Strength on play, which is the amount of Azoth spent beyond the required elemental cost.

- 🜂: Fire
- 🜄: Water  
- 🜃: Earth
- 🜁: Air
- ⭘: Aether
- ▢: Nether
- ✡⃝: Generic

## 2. Name
The card's title.

## 3. Lesser Type
What type of card it is when on the Field.

## 4. Ability(s)
Effect(s) when played as a Familiar or Spell.

## 5. Flavor Text
Adds narrative context to the game world.

## 6. Set and Rarity Symbol
Indicates the card's set and rarity level.

## 7. Set Number
Identifies the card's place within its set.`
    },
    {
      id: "zones",
      title: "Game Zones",
      category: "basic",
      keywords: ["zones", "field", "combat row", "azoth row", "deck", "life", "flag", "removed from play"],
      content: `# Game Zones

## 1. Field
Where Familiars and Spells are played.

## 2. Combat Row
Designated area for Familiar battles.

## 3. Azoth Row
Where Azoth cards are placed as resources.

## 4. Deck
Your draw pile for the duration of the game.

## 5. Life
- Before the game, shuffle your deck
- Place the top 4 cards face down in a separate stack
- These are your Life Cards
- Life Cards remain hidden until revealed as damage is taken

## 6. Flag
Place your Flag here so everyone can see what elements your deck abides by and has bonus damage against.

## 7. Removed from Play
A zone for cards that are affected by the Void keyword. These cards are visible to all players but cannot be interacted with.

## 8. Player's Hand
Cards not yet played.`
    },
    {
      id: "gameplay",
      title: "Gameplay Phases",
      category: "basic",
      keywords: ["phases", "pre-game", "start", "main", "combat", "post-combat", "refresh"],
      content: `# Gameplay Phases

The game is divided into several phases, repeated until one player or team remains:

## 0. Pre Game Actions
- Place your Flag on the top left corner of your play area
- Thoroughly shuffle your Deck and place it in the top right corner of your play area
- Take the top 4 cards of your Deck and place them in a stack below your Flag
- Do not look at these cards

## 1. Start Phase
- Draw 2 cards from your deck (only at the start of the game)
- Optionally place 1 card face up in your Azoth Row as a resource

## 2. Main Phase
- Play cards from your hand by resting Azoth (turning horizontally) to pay the costs of cards
- **Inherent**: All cards can be played via one of the conditions below

### Card Play Modes:
- **Summon**: Cards enter with +1 counters = the amount of Azoth paid for ✡⃝ if placed on the Field as a Familiar
- **Tribute**: If a card is Summoned, you may reduce the cost by the combined Elements costs and +1 counters of any number of Familiars you control, by removing them from the game
- **Azoth**: Place a card face-up in your Azoth Row. Each Azoth can only generate 1 type at a time
- **Spell**: Play a card from your hand but put it onto the bottom of your deck after resolving one of the abilities on the card; Use the amount of Azoth paid for ✡⃝ in place of the Element symbol in the ability's text
- **Burst**: You may play a card for free or put it in your hand when it's drawn from your life cards after you take damage. ✡⃝ = the number of life cards you have left when you play the card this way (this does not include itself,) and its keywords do not resolve
- **Resolve Keywords**
- **Draw a card** after each time you play a card

## 3. Combat Phase
- Attack with Familiars individually by placing them in the Combat Row

## 4. Post-Combat Main Phase
- Play additional cards if resources allow

## 5. Refresh Phase
- Refresh all rested Azoth sources (turning vertical)`
    },
    {
      id: "dynamic-resolution-chain",
      title: "Dynamic Resolution Chain (DRC)",
      category: "basic",
      keywords: ["drc", "dynamic resolution chain", "priority", "stack", "resolution"],
      content: `# Dynamic Resolution Chain (DRC)

The Dynamic Resolution Chain (DRC) is the system used to resolve spells and abilities in KONIVRER. This system ensures that all effects are resolved in the correct order and that players have opportunities to respond to each other's actions.

## How the DRC Works
- Effects are added to the chain in the order they are played
- The chain resolves in last-in, first-out order
- Players can respond to effects on the chain
- Each player must pass priority for the chain to resolve
- Some effects can change the order of resolution

## Priority System
- Active player receives priority at start of each phase
- Players may respond to spells and abilities with priority
- Stack resolves in last-in, first-out order
- Both players must pass priority for phases to end
- State-based actions checked whenever player gains priority`
    },
    {
      id: "keywords",
      title: "Keyword Abilities",
      category: "basic",
      keywords: ["keywords", "amalgam", "brilliance", "gust", "inferno", "steadfast", "submerged", "quintessence", "void"],
      content: `# Keyword Abilities

Each activates only once on the play of the respective Spell/Familiar.

## Amalgam
**Summoned**: Choose one of the two listed Keywords when you play the card. The card gains that Keyword and its linked Element while it's in play.

**Azoth**: Choose one of the two listed Elements when you play the card as an Azoth Source. While in play, the card can generate that Element whenever it is exhausted.

## Brilliance
Place target Familiar with +1 Counters or Spell with Strength ≤ ⭘ used to pay for this card's Strength on the bottom of its owner's life cards. (doesn't affect ▢ cards)

## Gust
Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 used to pay for this card's Strength to its owner's hand. (doesn't affect 🜃 cards)

## Inferno
After damage is dealt to the target card, add damage ≤ 🜂 used to pay for this card's Strength. (doesn't affect 🜄 cards)

## Steadfast
Redirect damage ≤ 🜃 used to pay for this card's Strength, that would be done to you or cards you control, to this card's Strength. (doesn't affect 🜂 cards)

## Submerged
Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 used to pay for this card's Strength, that many cards below the top of its owner's deck (doesn't affect 🜁 cards)

## Quintessence
This card can't be played as a Familiar. While in the Azoth row, it produces any Azoth type.

## Void
Remove target card from the game. (doesn't affect ⭘ cards)`
    },
    {
      id: "alphabet",
      title: "KONIVRER Alphabet & Symbols",
      category: "basic",
      keywords: ["alphabet", "symbols", "vowels", "consonants", "digraphs", "diphthongs"],
      content: `# KONIVRER Alphabet & Core Symbols

## Vowels
- A /a/, /æ/ (APL)
- E /e/, /ɛ/ (BED)
- I /i/, /ɪ/, /j/ (BIT, YES → IES)
- O /o/, /ɔ/ (BOAT)
- V (for U) /u/, /ʊ/ (RVLE)

## Consonants (Standard)
- B /b/, D /d/, G → Γ /g/, H /h/, K /k/, L /l/, M /m/, N /n/
- P /p/, R /r/, T /t/, Z /s/, /z/ (ZNAK, ZOO), V /v/
- VV (for W) /w/ (VVOD), Ξ /ks/, /gz/ (BOΞ), Φ /f/ (ΦISH)
- C replaced by Κ /k/, Q replaced by KW

## Merged/Eliminated Letters
- Y → I, J → I, U → V, C, Q, W removed

## Digraphs (Mandatory Compound Symbols)
- Χ = CH /x/, /k/ (BAΧ)
- Σ = SH /ʃ/ (ΣIP)
- Θ = TH /θ/ (ΘINK)
- Δ = DH /ð/ (ΔIS)
- NG /ŋ/ (SING), HL /hl/ (HLAF), HR /hr/ (HRING)
- KN /kn/ (KNIFE), GN /gn/ (GNOME), WH /ʍ/, /hw/ (WHILE)

## Diphthongs
- AI /ai/ (TAIM), AU /au/ (HAUS), EI /ei/ (EIT)
- IE /iə/, /je/ (FIEL), EA /æə/, /ɛə/ (BEAR)
- EO /eo/, /eə/ (BEON), OU /ou/ (OUT)

## Letter Doubling Rules
- **Allowed**: for stress/distinction — BUTTER vs. BUTER
- **Removed**: when unstressed or redundant — HAPINES, TAL`
    },

    // TOURNAMENT RULES SECTIONS
    {
      id: "tournament-structure",
      title: "Tournament Structure & Formats",
      category: "tournament",
      keywords: ["tournament", "tiers", "formats", "age divisions", "enforcement levels"],
      content: `# Tournament Structure and Formats

## Tournament Tiers
KONIVRER tournaments are organized into four tiers based on competitive level and scope:

| Tier | Event Type | REL | Typical Size | Special Requirements |
|------|------------|-----|--------------|---------------------|
| Tier 1 | Local Store Events | Casual | 8-32 players | GEM account required |
| Tier 2 | Regional Championships | Competitive | 32-128 players | Invitation or qualification |
| Tier 3 | National Championships | Professional | 128-512 players | Invitation only |
| Tier 4 | World Championships | Professional | 64-256 players | Qualification required |

## Rules Enforcement Levels (REL)
- **Casual REL**: Emphasis on education and enjoyment
- **Competitive REL**: Balance of education and tournament integrity
- **Professional REL**: Maximum emphasis on tournament integrity

## Tournament Formats
- **Standard**: 60-card minimum, current rotation
- **Extended**: Larger card pool, 60-card minimum
- **Legacy**: All sets legal, restricted list applies
- **Sealed Deck**: 6 booster packs, 40-card minimum
- **Booster Draft**: Draft from packs, 40-card minimum
- **Team Format**: 3-player teams, coordinated play
- **Two-Headed Giant**: 2v2 shared life totals

## Age Divisions
| Division | Age Range | Match Format | Round Time | Special Rules |
|----------|-----------|--------------|------------|---------------|
| Junior | Ages 6-10 | Best of 1 | 25 minutes | Simplified penalties |
| Senior | Ages 11-15 | Best of 3 | 50 minutes | Standard rules |
| Masters | Ages 16+ | Best of 3 | 50 minutes | Full tournament rules |
| Open | All ages | Best of 3 | 50 minutes | Mixed division option |`
    },
    {
      id: "player-eligibility",
      title: "Player Eligibility & Registration",
      category: "tournament",
      keywords: ["eligibility", "registration", "gem", "identification", "requirements"],
      content: `# Player Eligibility and Registration

## General Eligibility Requirements
All players must meet the following requirements:
- Valid GEM (Game Event Manager) profile registration
- Age verification for appropriate division placement
- Agreement to abide by tournament rules and Code of Conduct
- Current membership in good standing (for premier events)
- Government-issued identification for Tier 3+ events

## Ineligible Participants
The following individuals are not eligible to participate:
- Currently banned individuals (all events)
- Currently suspended individuals (Tier 2+ events only)
- Individuals under 12 without guardian permission
- Tournament officials (Tier 2+ events)
- Individuals prohibited by local laws or venue management

## Player Identification Systems
Multiple identification systems ensure accurate player tracking:
- **GEM Profile**: Unique Player ID for all KONIVRER events
- **Bandai TCG+**: Integration for cross-game compatibility
- **DCI Number**: Legacy support for established players
- **Government ID**: Required for premier events and age verification

## Registration Process
Tournament registration follows these standardized steps:
- Online pre-registration preferred (closes 24 hours before event)
- On-site registration available until player meeting
- Entry fee payment required at registration
- Deck list submission deadline: 15 minutes before player meeting
- Photo identification verification for Tier 3+ events`
    },
    {
      id: "deck-construction",
      title: "Deck Construction Requirements",
      category: "tournament",
      keywords: ["deck construction", "format", "sideboard", "banned", "restricted"],
      content: `# Deck Construction Requirements

## Standard Format Construction
The primary competitive format for KONIVRER tournaments:
- Minimum 60 cards in main deck
- Maximum 4 copies of any single card (except basic lands)
- Optional sideboard of exactly 15 cards
- All cards must be from legal sets as determined by current rotation
- Banned and restricted list updated quarterly

## Alternative Format Construction

| Format | Main Deck | Side Deck | Copy Limit | Special Rules |
|--------|-----------|-----------|------------|---------------|
| Limited (Sealed) | 40 minimum | None | No limit | From sealed pool only |
| Limited (Draft) | 40 minimum | None | No limit | From drafted cards only |
| Team Format | 60 minimum | 15 cards | 4 copies | Shared card pool restrictions |
| Digimon Style | 50 cards | None | 4 copies | Includes Digi-Egg deck (0-5) |
| Dragon Ball Style | 50 cards | None | 4 copies | Includes Leader card |

## Deck List Requirements
All tournament decks must be registered with complete deck lists:
- Card names must be written clearly and completely
- Quantities must be accurate and legible
- Main deck and sideboard must be clearly separated
- Player name, ID, and event information required
- Electronic submission preferred for Tier 2+ events
- Photo verification required for online events

## Deck Verification Process
- Random deck checks performed throughout tournament
- Judges may request deck verification at any time
- Players must present deck for counting and comparison
- Deck list errors result in penalties based on severity
- Intentional deck list falsification results in disqualification`
    },
    {
      id: "gameplay-rules",
      title: "Game Play Rules and Timing",
      category: "tournament",
      keywords: ["priority", "timing", "communication", "slow play", "game state"],
      content: `# Game Play Rules and Timing

## Priority and Timing Rules
KONIVRER uses a priority-based system for resolving game actions:
- Active player receives priority at start of each phase
- Players may respond to spells and abilities with priority
- Stack resolves in last-in, first-out order
- Both players must pass priority for phases to end
- State-based actions checked whenever player gains priority

## Communication Standards
- Announce all game actions clearly and audibly
- Maintain accurate representation of game state
- Use official card names when referencing cards
- Ask for clarification when uncertain
- Provide honest answers to opponent's questions
- Announce changes to public game zones

## Game State Management
Players must maintain clear and accurate game states:
- Keep life totals visible and accurate
- Clearly separate different zones (hand, field, graveyard)
- Announce changes to game state
- Allow opponent to verify game state when requested
- Maintain proper card positioning and orientation

## Slow Play Policy
- Players must make decisions within reasonable time
- Judges may issue slow play warnings for excessive delays
- Repeated slow play results in game losses
- Intentional stalling grounds for disqualification
- Complex game states allow additional thinking time

## Round Structure and Timing

| Division | Match Format | Round Time | Extra Turns | Online Extension |
|----------|--------------|------------|-------------|------------------|
| Junior | Best of 1 | 25 minutes | 3 turns each | +10 minutes |
| Senior/Masters | Best of 3 | 50 minutes | 5 turns each | +15 minutes |
| Top Cut | Best of 3 | No time limit | N/A | No time limit |
| Draft | Best of 3 | 50 minutes | 5 turns each | +15 minutes |
| Team Format | Best of 3 | 60 minutes | 5 turns each | +20 minutes |`
    },
    {
      id: "swiss-system",
      title: "Swiss Tournament System",
      category: "tournament",
      keywords: ["swiss", "pairings", "tiebreakers", "rounds", "standings"],
      content: `# Swiss Tournament System

## Swiss System Overview
The Swiss system ensures all players compete in every round:
- Players paired against opponents with similar records
- No player elimination until top cut
- Number of rounds based on player count
- Tiebreakers determine final standings

## Recommended Number of Swiss Rounds
Based on player count and tournament goals:

| Players | Swiss Rounds | Top Cut | Rationale |
|---------|--------------|---------|-----------|
| 4-8 | 3 rounds | Top 4 | Single elimination alternative |
| 9-16 | 4-5 rounds | Top 4-8 | Depends on format |
| 17-32 | 5 rounds | Top 8 | Standard regional size |
| 33-64 | 6 rounds | Top 8 | Large regional |
| 65-128 | 7 rounds | Top 8-16 | National qualifier |
| 129-256 | 8 rounds | Top 16 | Major championship |
| 257-512 | 9 rounds | Top 32 | World championship |
| 513+ | 10+ rounds | Top 32-64 | Massive events |

## Pairing Procedures
Detailed pairing algorithms for fair competition:

### Round 1 Pairings:
- Random pairings within each age division
- Accelerated pairings option for large events
- Bye awarded to lowest-seeded player if odd numbers

### Subsequent Round Pairings:
- Group players by match points (wins/losses)
- Within each group, pair by tiebreaker rankings
- Avoid repeat pairings when possible
- Balance color assignments (if applicable)

## Tiebreaker System
Multi-level tiebreaker system for accurate rankings:

| Priority | Tiebreaker | Description | Used By |
|----------|------------|-------------|---------|
| 1st | Match Points | Total wins in tournament | All TCGs |
| 2nd | Opponent Match Win % | Strength of opponents faced | MTG, Pokemon |
| 3rd | Game Win % | Percentage of games won | MTG, Pokemon |
| 4th | Opponent Game Win % | Opponents' game win percentage | MTG, Pokemon |
| 5th | Head-to-Head | Direct matchup results | Yu-Gi-Oh!, Digimon |
| 6th | Buchholz Score | Sum of opponents' scores | Flesh and Blood |
| 7th | Random | Final tiebreaker | All TCGs |`
    },
    {
      id: "elimination-procedures",
      title: "Elimination Tournament Procedures",
      category: "tournament",
      keywords: ["elimination", "bracket", "top cut", "seeding", "advancement"],
      content: `# Elimination Tournament Procedures

## Single Elimination Format
Top cut elimination procedures:
- Players seeded by Swiss standings
- Higher seed chooses play/draw in game 1
- Best-of-3 matches (except Junior division)
- No time limits in elimination rounds
- Winner advances, loser eliminated

## Bracket Structure
Standard elimination bracket seeding:
- **Top 8**: 1v8, 2v7, 3v6, 4v5
- **Top 16**: Standard tournament bracket
- **Top 32**: Extended bracket with multiple rounds
- Byes awarded to higher seeds in uneven brackets

## Elimination Tiebreakers
Final placement determination:
- Eliminated players ranked by Swiss standings
- Higher Swiss seed receives higher final rank
- Semifinal losers ranked 3rd and 4th by Swiss standings
- Prize distribution based on final elimination rank`
    },
    {
      id: "judge-calls",
      title: "Judge Calls & Dispute Resolution",
      category: "tournament",
      keywords: ["judge", "disputes", "appeals", "hierarchy", "resolution"],
      content: `# Judge Calls and Dispute Resolution

## When to Call a Judge
Players should call a judge in these situations:
- Rules questions or clarifications needed
- Disputes about game state or legal plays
- Suspected rule violations or cheating
- Time extensions needed due to judge calls
- Any situation requiring official intervention
- Deck check requests or irregularities

## Judge Hierarchy and Authority
Tournament judge structure and responsibilities:

### Head Judge:
- Final authority on all tournament decisions
- May overturn other judges' rulings
- Responsible for tournament integrity
- Issues disqualifications and serious penalties

### Floor Judges:
- Handle routine rules questions and minor infractions
- Conduct deck checks and investigations
- Issue warnings and game losses
- Escalate complex situations to Head Judge

## Appeal Process
Player rights and appeal procedures:
- Appeals must be made immediately after ruling
- Only Head Judge can overturn floor judge rulings
- Head Judge decisions are final
- Appeals do not stop tournament progression
- Players may request private discussion with judges`
    },
    {
      id: "penalties",
      title: "Penalties and Infractions",
      category: "tournament",
      keywords: ["penalties", "infractions", "warnings", "game loss", "disqualification"],
      content: `# Penalties and Infractions

## Penalty Philosophy
KONIVRER uses a progressive penalty system:
- Education-focused at Casual REL
- Balanced approach at Competitive REL
- Strict enforcement at Professional REL
- Penalties escalate with repeated infractions

## Penalty Guidelines Matrix

| Infraction Category | First Offense | Second Offense | Third Offense | Severe Cases |
|-------------------|---------------|----------------|---------------|--------------|
| Procedural Error | Warning | Warning | Game Loss | Match Loss |
| Deck/Decklist Error | Warning/Game Loss | Game Loss | Match Loss | Disqualification |
| Tardiness | Warning | Game Loss | Match Loss | Drop from event |
| Communication Error | Warning | Warning | Game Loss | Match Loss |
| Marked Cards | Warning | Game Loss | Match Loss | Disqualification |
| Unsporting Conduct | Warning | Game Loss | Disqualification | Suspension |
| Cheating | Disqualification | Suspension | Permanent Ban | Legal Action |

## Specific Infractions

### Game Play Errors
- Looking at extra cards
- Drawing extra cards
- Missed triggers and abilities
- Illegal game actions

### Tournament Errors
- Late arrival to matches
- Failure to report results
- Deck list errors and omissions
- Incorrect number of cards in deck

### Unsporting Conduct
- Minor unsporting behavior
- Major unsporting behavior
- Improperly determining winner
- Bribery and wagering

### Serious Infractions
- Intentional cheating
- Aggressive behavior
- Theft of tournament materials
- Bringing prohibited items`
    },
    {
      id: "prize-structure",
      title: "Prize Structure & Advancement",
      category: "tournament",
      keywords: ["prizes", "championship points", "advancement", "qualification", "titles"],
      content: `# Prize Structure and Advancement

## Prize Distribution by Tournament Tier

| Tournament Tier | 1st Place | 2nd Place | 3rd-4th | 5th-8th | Participation |
|----------------|------------|-----------|---------|---------|---------------|
| Tier 1 (Local) | Store Credit | Store Credit | Promo Cards | Promo Cards | Participation Prize |
| Tier 2 (Regional) | Trophy + Prizes | Prizes | Prizes | Promo Cards | Championship Points |
| Tier 3 (National) | Championship Title | Runner-up Title | Semifinalist | Quarterfinalist | Invitation Credits |
| Tier 4 (World) | World Champion | World Finalist | World Semifinalist | World Quarterfinalist | World Competitor |

## Championship Points System
Points earned based on tournament performance and tier:
- **Tier 1 events**: 1-4 points based on finish
- **Tier 2 events**: 5-20 points based on finish
- **Tier 3 events**: 25-100 points based on finish
- **Tier 4 events**: 150-500 points based on finish
- Seasonal totals determine premier event invitations

## Advancement and Qualification
Pathways to premier events:
- Regional champions receive automatic National invitations
- Top championship point earners receive invitations
- National champions receive World Championship invitations
- Special qualifier events provide additional pathways`
    },
    {
      id: "special-formats",
      title: "Special Tournament Formats",
      category: "tournament",
      keywords: ["limited", "sealed", "draft", "team", "multiplayer", "specialty"],
      content: `# Special Tournament Formats

## Limited Formats

### Sealed Deck Format:
- Each player receives 6 booster packs
- 30-minute deck construction period
- Minimum 40-card deck from sealed pool only
- Basic lands provided by tournament organizer
- No sideboarding between games

### Booster Draft Format:
- Players draft cards from booster packs in pods of 8
- Three packs drafted per player
- Pick 1, pass remaining cards to next player
- Minimum 40-card decks from drafted cards
- 30-minute deck construction after draft

## Team Formats

### Team Tournament (3-Player Teams):
- Each team member plays different opponent
- Team wins when majority of members win matches
- Limited communication between team members during matches
- Shared deck construction restrictions may apply

### Two-Headed Giant (2v2):
- Teams of 2 players share life total (30 life)
- Teammates sit next to each other
- Shared turns with both players acting
- Open communication between teammates

## Specialty Formats

### Learn-to-Play Format:
- Simplified rules for new players
- Preconstructed decks provided
- Judge assistance encouraged
- Focus on education over competition

### Ultimate Pit Fight (Multiplayer):
- 4-8 players in single game
- Last player standing wins
- Special multiplayer rules apply
- Casual REL enforcement only`
    },
    {
      id: "online-tournaments",
      title: "Online Tournament Guidelines",
      category: "tournament",
      keywords: ["online", "digital", "platform", "requirements", "verification"],
      content: `# Online Tournament Guidelines

## Platform Requirements
Technical requirements for online play:
- Stable internet connection (minimum 10 Mbps)
- HD webcam (1080p recommended, 720p minimum)
- Clear microphone for communication
- Updated client software mandatory
- Dedicated playing space with proper lighting

## Online-Specific Rules
Special considerations for digital tournaments:
- All cards must remain visible on camera
- Shuffling must be performed on camera
- Hand must be held to prevent information leaks
- Disconnections result in automatic time extensions
- Screen sharing may be required for deck verification

## Online Tournament Software
Recommended platforms for online events:
- **Discord**: Voice/video communication and organization
- **TCG Meister**: Tournament management and pairings
- **Bandai TCG+**: Card database and rules reference
- **Official KONIVRER client**: Digital play platform

## Online Deck Registration
Enhanced verification for online events:
- Photo submission of physical deck required
- Electronic deck list submission mandatory
- Random deck checks via video call
- Timestamp verification for deck photos`
    },
    {
      id: "accessibility-tournament",
      title: "Accessibility & Accommodations",
      category: "tournament",
      keywords: ["accessibility", "accommodations", "disability", "inclusion", "universal design"],
      content: `# Accessibility and Accommodations

## General Accessibility Policy
KONIVRER is committed to inclusive tournament play:
- Reasonable accommodations provided upon request
- Advance notice preferred but not required
- Accommodations must not provide competitive advantage
- Tournament integrity maintained in all cases

## Common Accommodations
Frequently provided accommodations include:
- Extended time for players with disabilities
- Alternative seating arrangements
- Assistance with card manipulation
- Large print materials when available
- Interpreter services for hearing impaired

## Accommodation Request Process
How to request tournament accommodations:
- Contact tournament organizer before event
- Provide documentation if requested
- Discuss specific needs and solutions
- Confirm arrangements before tournament day`
    },
    {
      id: "coverage-media",
      title: "Coverage & Media Guidelines",
      category: "tournament",
      keywords: ["coverage", "media", "streaming", "privacy", "broadcasting"],
      content: `# Coverage and Media Guidelines

## Tournament Coverage
Media coverage enhances tournament experience:
- Live streaming of feature matches
- Commentary and analysis provided
- Player interviews and profiles
- Social media updates and highlights

## Player Rights and Privacy
Protecting player privacy during coverage:
- Players may decline feature match coverage
- Deck lists remain private until authorized
- Personal information protected
- Players control their image usage

## Coverage Team Responsibilities
Coverage team obligations:
- Maintain professional conduct
- Respect player privacy and concentration
- Follow tournament rules and procedures
- Coordinate with tournament staff`
    },
    {
      id: "appendices",
      title: "Appendices & Quick Reference",
      category: "tournament",
      keywords: ["appendices", "checklist", "reference", "contacts", "history"],
      content: `# Appendices and Quick Reference

## Tournament Checklist for Players

### Pre-Tournament Preparation:
- Register for the event and pay entry fee
- Prepare legal deck with proper sleeves
- Complete and submit deck list
- Bring required identification
- Review current banned/restricted list
- Prepare life tracking materials

### During Tournament:
- Arrive on time for each round
- Verify opponent and deck before each match
- Maintain accurate game state
- Call judge when needed
- Report match results promptly
- Follow all tournament procedures

## Judge Quick Reference
Common penalty guidelines:
- **Warning**: Education and documentation
- **Game Loss**: Significant advantage gained
- **Match Loss**: Repeated or serious infractions
- **Disqualification**: Cheating or serious misconduct

## Contact Information
For tournament-related inquiries:
- **Tournament Operations**: tournaments@konivrer.com
- **Rules Questions**: rules@konivrer.com
- **Judge Program**: judges@konivrer.com
- **Appeals and Complaints**: appeals@konivrer.com
- **Accessibility Requests**: accessibility@konivrer.com
- **Media and Coverage**: media@konivrer.com

## Document History
Version history and updates:
- **Version 4.0 (January 2025)**: Comprehensive TCG integration
- **Version 3.0 (December 2024)**: Major policy updates
- **Version 2.0 (June 2024)**: Online tournament support
- **Version 1.0 (January 2024)**: Initial release

This comprehensive document incorporates best practices and policies from Magic: The Gathering, Pokemon TCG, Yu-Gi-Oh!, Flesh and Blood, Digimon Card Game, Dragon Ball Super Card Game, and One Piece Card Game, adapted for the KONIVRER competitive environment.`
    },

    // CODE OF CONDUCT SECTIONS
    {
      id: "inclusion-commitment",
      title: "Our Commitment to Inclusion",
      category: "conduct",
      keywords: ["inclusion", "diversity", "community", "respect", "equity"],
      content: `# Our Commitment to Inclusion

## Mission Statement
KONIVRER is committed to creating and maintaining a gaming community where every person feels valued, respected, and empowered to participate fully, regardless of their background, identity, or circumstances. We believe that diversity strengthens our community and that inclusion is not just a goal, but a fundamental responsibility.

## Our Vision for Community
We envision a KONIVRER community that:
- Celebrates diversity in all its forms
- Provides equal opportunities for participation and advancement
- Actively works to remove barriers to inclusion
- Fosters belonging for players of all backgrounds and skill levels
- Serves as a model for inclusive gaming communities worldwide

## Scope and Application
This Code of Conduct applies to all KONIVRER community spaces, including:
- Official tournaments and events (in-person and online)
- Local game stores hosting KONIVRER events
- Online platforms, forums, and social media spaces
- Community Discord servers and chat platforms
- Streaming and content creation related to KONIVRER
- Any space where KONIVRER community members gather

## Shared Responsibility
Creating an inclusive community is everyone's responsibility. Every community member—players, judges, organizers, content creators, and staff—has a role in:
- Modeling respectful and inclusive behavior
- Speaking up when they witness harmful behavior
- Supporting community members who experience harassment
- Continuously learning about inclusion and cultural sensitivity
- Contributing to a welcoming environment for all`
    },
    {
      id: "expected-behavior",
      title: "Expected Behavior Standards",
      category: "conduct",
      keywords: ["behavior", "communication", "pronouns", "welcoming", "conflict resolution"],
      content: `# Expected Behavior Standards

## Inclusive Communication
All community members are expected to communicate in ways that are:

| Standard | Description | Examples |
|----------|-------------|----------|
| Respectful | Treating others with courtesy and consideration | Using please/thank you, listening actively |
| Inclusive | Using language that welcomes all people | Avoiding gendered assumptions, using inclusive terms |
| Clear | Communicating in ways others can understand | Explaining game terms, speaking clearly |
| Patient | Allowing time for others to process and respond | Waiting for translations, repeating when needed |
| Constructive | Focusing on solutions and improvement | Offering helpful feedback, suggesting alternatives |
| Culturally Aware | Considering cultural context in communication | Avoiding idioms that don't translate, being mindful of holidays |

## Pronoun Usage and Respect
Respecting people's pronouns is a fundamental aspect of dignity:
- Ask for pronouns when introducing yourself or making name tags
- Use the pronouns people specify for themselves
- If you make a mistake, apologize briefly and move on
- Don't assume pronouns based on appearance or name
- Use gender-neutral language when addressing groups
- Respect that some people may not want to share pronouns

## Welcoming New Community Members
Creating a welcoming environment for newcomers includes:
- Greeting new players warmly and offering assistance
- Explaining unwritten rules and community norms
- Offering to teach or practice with less experienced players
- Including newcomers in conversations and activities
- Being patient with questions and learning curves
- Connecting newcomers with resources and support

## Conflict Resolution and De-escalation
When conflicts arise, community members should:
- Remain calm and avoid escalating tensions
- Listen to understand, not just to respond
- Focus on the behavior or issue, not personal attacks
- Seek to find common ground and solutions
- Involve mediators or staff when needed
- Take breaks if emotions are running high`
    },
    {
      id: "prohibited-behavior",
      title: "Prohibited Behavior and Harassment",
      category: "conduct",
      keywords: ["harassment", "discrimination", "zero tolerance", "prohibited", "microaggressions"],
      content: `# Prohibited Behavior and Harassment

## Zero Tolerance Policy
KONIVRER has zero tolerance for harassment, discrimination, and harmful behavior. This policy applies regardless of intent—impact matters more than intention.

## Forms of Harassment and Discrimination

| Category | Examples | Impact |
|----------|----------|--------|
| Verbal Harassment | Slurs, insults, threats, unwelcome comments about appearance/identity | Creates hostile environment, causes emotional harm |
| Physical Harassment | Unwanted touching, blocking movement, aggressive gestures | Violates personal boundaries, creates safety concerns |
| Sexual Harassment | Unwelcome sexual attention, comments, or advances | Creates unsafe environment, particularly for women and LGBTQIA+ individuals |
| Microaggressions | Subtle discriminatory comments or actions | Cumulative harm, exclusion, stereotype reinforcement |
| Cyberbullying | Online harassment, doxxing, coordinated attacks | Extends harm beyond physical spaces, affects mental health |
| Exclusionary Behavior | Deliberately excluding people from activities or conversations | Reinforces marginalization, prevents full participation |
| Cultural Insensitivity | Mocking accents, cultural practices, or religious observances | Devalues cultural identity, creates unwelcoming environment |
| Ableism | Mocking disabilities, refusing accommodations, using disability as insult | Excludes disabled community members, perpetuates stigma |

## Specific Prohibited Language and Behavior

### Language Violations:
- Slurs or derogatory terms targeting any group or identity
- Hate speech or language promoting violence against groups
- Sexually explicit or suggestive language in public spaces
- Threats of violence or harm, even if meant as jokes
- Doxxing or sharing personal information without consent

### Behavioral Violations:
- Unwanted physical contact or invasion of personal space
- Following or stalking behavior, online or offline
- Deliberately misgendering or deadnaming individuals
- Gatekeeping or questioning someone's right to participate
- Retaliation against those who report violations

## Intent vs. Impact
While we consider intent in our response to violations, the impact of behavior on community members is our primary concern. Saying 'I didn't mean it that way' does not excuse harmful behavior. We expect community members to:
- Take responsibility for the impact of their words and actions
- Apologize sincerely when they cause harm
- Learn from feedback and change their behavior
- Understand that good intentions don't negate harmful impact`
    },
    {
      id: "core-values",
      title: "Core Values and Principles",
      category: "conduct",
      keywords: ["values", "principles", "respect", "dignity", "equity", "justice"],
      content: `# Core Values and Principles

## Respect and Dignity
Every person deserves to be treated with respect and dignity, regardless of their:

| Protected Characteristics | Examples | Our Commitment |
|--------------------------|----------|----------------|
| Race and Ethnicity | All racial and ethnic backgrounds | Zero tolerance for racial discrimination |
| Gender Identity | Cisgender, transgender, non-binary, genderfluid | Respect chosen names and pronouns |
| Sexual Orientation | LGBTQIA+ identities and allies | Inclusive language and representation |
| Religion and Beliefs | All faiths and philosophical beliefs | Accommodation of religious practices |
| Disability Status | Visible and invisible disabilities | Accessibility and reasonable accommodations |
| Age | Players of all ages | Age-appropriate interactions and mentorship |
| Socioeconomic Status | All economic backgrounds | Affordable participation opportunities |
| Neurodiversity | Autism, ADHD, and other neurotypes | Sensory accommodations and understanding |
| Physical Appearance | All body types and presentations | Body positivity and anti-bullying |
| Cultural Background | All cultures and nationalities | Cultural celebration and sensitivity |

## Equity and Justice
We recognize that equality of treatment does not always result in equality of outcome. We are committed to:
- Identifying and addressing systemic barriers to participation
- Providing additional support where needed to ensure equal opportunities
- Actively working to correct historical exclusions
- Measuring and improving our inclusion efforts continuously

## Cultural Humility and Learning
We approach cultural differences with humility, recognizing that:
- We don't know what we don't know about other cultures
- Learning about different perspectives is an ongoing process
- Mistakes are opportunities for growth, not reasons for shame
- Cultural competency requires active effort and education

## Psychological Safety
We strive to create environments where people feel safe to:
- Express their authentic selves without fear of judgment
- Ask questions and admit when they don't understand something
- Make mistakes and learn from them without harsh punishment
- Speak up about concerns or problems they observe
- Participate fully regardless of their skill level or experience`
    },
    {
      id: "cultural-sensitivity",
      title: "Cultural Sensitivity and Awareness",
      category: "conduct",
      keywords: ["cultural", "sensitivity", "awareness", "religion", "language", "celebration"],
      content: `# Cultural Sensitivity and Awareness

## Understanding Cultural Differences
KONIVRER is a global community with members from diverse cultural backgrounds. Cultural sensitivity involves:
- Recognizing that cultural norms vary significantly across communities
- Understanding that communication styles differ between cultures
- Respecting different approaches to conflict resolution
- Acknowledging varying comfort levels with physical contact
- Being aware of different concepts of time and punctuality

## Religious and Spiritual Considerations
We respect all religious and spiritual practices, including:

| Consideration | Examples | Accommodations |
|---------------|----------|----------------|
| Prayer Times | Daily prayers, Sabbath observance | Flexible scheduling, quiet spaces |
| Dietary Restrictions | Halal, Kosher, vegetarian, vegan | Food labeling, alternative options |
| Religious Holidays | Major and minor religious observances | Event scheduling awareness, excused absences |
| Dress Requirements | Head coverings, modest dress, religious symbols | Dress code flexibility, respectful recognition |
| Ritual Observances | Fasting periods, ceremonial requirements | Understanding and accommodation |
| Sacred Objects | Religious jewelry, texts, symbols | Respectful treatment, storage options |

## Language and Communication Barriers
Supporting community members for whom English is not their first language:
- Speak clearly and at a moderate pace
- Avoid idioms, slang, and cultural references that may not translate
- Be patient with translation apps and interpretation
- Offer to repeat or rephrase when asked
- Provide written materials in multiple languages when possible
- Connect non-English speakers with community translators

## Cultural Celebrations and Recognition
We actively celebrate cultural diversity through:
- Recognizing major cultural holidays in event planning
- Featuring diverse cultural themes in promotional materials
- Inviting community members to share their cultural traditions
- Ensuring representation in leadership and decision-making
- Supporting cultural affinity groups within the community

## Avoiding Cultural Appropriation
We distinguish between cultural appreciation and appropriation:
- Appreciation involves learning about and respecting other cultures
- Appropriation involves taking elements without permission or understanding
- When in doubt, ask members of that culture for guidance
- Give credit and context when sharing cultural elements
- Avoid stereotypes and oversimplifications`
    },
    {
      id: "digital-conduct",
      title: "Digital Spaces and Online Conduct",
      category: "conduct",
      keywords: ["digital", "online", "social media", "cyberbullying", "moderation"],
      content: `# Digital Spaces and Online Conduct

## Online Community Standards
Digital spaces require the same level of respect and inclusion as physical spaces. Online conduct standards include:
- Using respectful language in all communications
- Respecting others' time and attention
- Avoiding spam, excessive self-promotion, or off-topic content
- Respecting privacy and not sharing personal information
- Following platform-specific rules and guidelines

## Social Media and Streaming Guidelines
When representing KONIVRER or the community online:
- Model inclusive behavior and language
- Avoid controversial topics unrelated to the game
- Respect copyright and intellectual property
- Handle criticism and feedback professionally
- Promote positive community values

## Digital Harassment and Cyberbullying
Online harassment is taken as seriously as in-person harassment:

| Type | Examples | Response |
|------|----------|----------|
| Coordinated Harassment | Brigading, mass reporting, organized attacks | Platform reporting, community protection |
| Doxxing | Sharing personal information without consent | Immediate removal, potential legal action |
| Impersonation | Creating fake accounts, identity theft | Platform verification, account protection |
| Revenge Sharing | Non-consensual sharing of private content | Immediate removal, serious consequences |
| Trolling | Deliberately provocative or disruptive behavior | Moderation, education, potential removal |
| Hate Raids | Coordinated attacks on streams or posts | Platform tools, community support |

## Content Moderation and Community Management
Our approach to content moderation prioritizes:
- Transparency in moderation decisions and policies
- Consistency in applying community standards
- Education and rehabilitation over punishment when possible
- Community input in developing and updating policies
- Regular training for moderators and community managers`
    },
    {
      id: "reporting-support",
      title: "Reporting and Support Systems",
      category: "conduct",
      keywords: ["reporting", "support", "channels", "bystander", "intervention"],
      content: `# Reporting and Support Systems

## Multiple Reporting Channels
We provide various ways to report concerns to accommodate different comfort levels:

| Method | Best For | Response Time | Anonymity |
|--------|----------|---------------|-----------|
| In-Person Report | Immediate safety concerns | Immediate | Optional |
| Online Form | Detailed incidents, documentation | 24-48 hours | Available |
| Email | Complex situations, follow-ups | 24-48 hours | Optional |
| Phone Hotline | Urgent concerns, verbal reporting | Immediate | Available |
| Trusted Community Member | Informal concerns, guidance | Varies | Optional |
| Anonymous Tip Line | Sensitive information, whistleblowing | 48-72 hours | Guaranteed |

## What to Include in a Report
Helpful information for reports includes:
- Date, time, and location of the incident
- Names or descriptions of people involved
- Detailed description of what happened
- Any witnesses who observed the incident
- Screenshots, photos, or other evidence if available
- Impact the incident had on you or others
- What outcome or resolution you're seeking

## Support for Reporters
We provide comprehensive support for those who report incidents:
- Immediate safety measures if needed
- Emotional support and counseling resources
- Regular updates on investigation progress
- Protection from retaliation
- Accommodation of needs during the process
- Connection with external support services

## Bystander Intervention
Community members can help by safely intervening when they witness problems:
- **Direct intervention**: Safely addressing the behavior directly
- **Distraction**: Creating a diversion to defuse the situation
- **Delegation**: Getting help from staff or authorities
- **Documentation**: Recording evidence for later reporting
- **Support**: Checking on and supporting the affected person`
    },
    {
      id: "investigation-resolution",
      title: "Investigation and Resolution Process",
      category: "conduct",
      keywords: ["investigation", "resolution", "process", "rights", "restorative justice"],
      content: `# Investigation and Resolution Process

## Investigation Principles
All investigations are conducted with:
- Impartiality and fairness to all parties
- Respect for privacy and confidentiality
- Thoroughness and attention to detail
- Timeliness and regular communication
- Trauma-informed approaches
- Cultural sensitivity and awareness

## Investigation Process
The investigation process typically follows these steps:

| Step | Description | Timeline | Participants |
|------|-------------|----------|--------------|
| Initial Assessment | Determine severity and immediate safety needs | 24 hours | Trained staff |
| Evidence Gathering | Collect statements, documentation, witnesses | 3-7 days | All relevant parties |
| Analysis | Review evidence, consult policies, consider context | 2-3 days | Investigation team |
| Decision | Determine if violation occurred and appropriate response | 1-2 days | Decision makers |
| Communication | Inform parties of outcome and next steps | 1 day | All parties |
| Implementation | Carry out consequences and support measures | Ongoing | Relevant staff |
| Follow-up | Monitor effectiveness and provide ongoing support | 30-90 days | Support team |

## Rights of All Parties
Throughout the process, all parties have the right to:
- Be treated with dignity and respect
- Have their privacy protected to the extent possible
- Receive regular updates on the process
- Have a support person present during interviews
- Request accommodations for disabilities or other needs
- Appeal decisions through established procedures

## Restorative Justice Approaches
When appropriate, we use restorative justice principles that focus on:
- Repairing harm caused by the incident
- Understanding the impact on all affected parties
- Taking responsibility and making amends
- Learning and growth for all involved
- Strengthening community bonds and preventing future harm`
    },
    {
      id: "consequences-restorative",
      title: "Consequences and Restorative Justice",
      category: "conduct",
      keywords: ["consequences", "restorative", "discipline", "appeals", "progressive"],
      content: `# Consequences and Restorative Justice

## Progressive Discipline Framework
Our approach to consequences is progressive, educational, and restorative:

| Level | Typical Consequences | Focus | Duration |
|-------|---------------------|-------|----------|
| Educational | Warning, education, apology | Learning and understanding | Immediate |
| Corrective | Temporary restrictions, training requirements | Behavior change | Days to weeks |
| Protective | Suspension, no-contact orders | Community safety | Weeks to months |
| Removal | Permanent ban, legal action | Community protection | Permanent |
| Restorative | Community service, mediation | Healing and repair | Varies |

## Factors Considered in Determining Consequences
When determining appropriate consequences, we consider:
- Severity and impact of the behavior
- Intent and awareness of the person who caused harm
- Previous history of similar behavior
- Willingness to take responsibility and make amends
- Needs and wishes of those who were harmed
- Potential for rehabilitation and behavior change
- Impact on community safety and trust

## Restorative Practices
Restorative practices may include:
- Facilitated dialogue between affected parties
- Community service or volunteer work
- Educational workshops or training
- Mentoring or coaching relationships
- Public acknowledgment and apology
- Ongoing check-ins and support

## Appeals Process
Individuals may appeal consequences through:
- Written appeal within 30 days of decision
- Review by independent appeals panel
- Consideration of new evidence or circumstances
- Final decision within 60 days of appeal`
    },
    {
      id: "education-community",
      title: "Education and Community Building",
      category: "conduct",
      keywords: ["education", "community", "building", "leadership", "development"],
      content: `# Education and Community Building

## Ongoing Education Programs
We provide regular education on inclusion and cultural sensitivity:
- Monthly workshops on diversity and inclusion topics
- Cultural competency training for staff and volunteers
- Bystander intervention training
- Unconscious bias awareness sessions
- Accessibility and accommodation training

## Community Building Initiatives
Programs to strengthen our inclusive community:
- Mentorship programs pairing experienced and new players
- Affinity groups for underrepresented communities
- Cultural celebration events and heritage months
- Accessibility awareness and advocacy campaigns
- Community feedback sessions and listening tours

## Leadership Development
Developing inclusive leaders throughout our community:
- Leadership training with inclusion focus
- Diverse representation in decision-making roles
- Succession planning for underrepresented groups
- Recognition and advancement opportunities`
    },
    {
      id: "special-considerations",
      title: "Special Considerations",
      category: "conduct",
      keywords: ["minors", "international", "mental health", "crisis", "support"],
      content: `# Special Considerations

## Minors and Youth Protection
Special protections for community members under 18:
- Enhanced supervision and safety measures
- Age-appropriate communication and consequences
- Parental/guardian involvement when appropriate
- Mandatory reporting of suspected abuse
- Youth-specific support resources

## International and Cross-Cultural Events
Additional considerations for global events:
- Local law and custom awareness
- Translation and interpretation services
- Cultural liaison and support staff
- Flexible policies for cultural differences
- International incident reporting procedures

## Mental Health and Crisis Support
Supporting community members in crisis:
- Trained mental health first aid responders
- Crisis intervention protocols
- Referral networks for professional support
- Trauma-informed response procedures
- Follow-up care and ongoing support`
    },
    {
      id: "resources-support",
      title: "Resources and Support",
      category: "conduct",
      keywords: ["resources", "support", "contacts", "emergency", "services"],
      content: `# Resources and Support

## Internal Resources
KONIVRER community support resources:
- Inclusion and Diversity Committee
- Trained community advocates and allies
- Peer support networks and mentorship programs
- Educational materials and resource libraries
- Community forums and discussion spaces

## External Resources
Professional and community support services:
- National crisis hotlines and support services
- Local mental health and counseling services
- Legal aid and advocacy organizations
- Cultural and religious community centers
- Disability rights and advocacy groups

## Emergency Contacts
Important contact information:
- **KONIVRER Inclusion Hotline**: 1-800-INCLUDE
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **LGBTQ National Hotline**: 1-888-843-4564
- **RAINN Sexual Assault Hotline**: 1-800-656-4673`
    },
    {
      id: "implementation-enforcement",
      title: "Implementation and Enforcement",
      category: "conduct",
      keywords: ["implementation", "enforcement", "training", "monitoring", "accountability"],
      content: `# Implementation and Enforcement

## Training and Preparation
All staff, volunteers, and community leaders receive:
- Comprehensive code of conduct training
- Cultural competency and bias awareness education
- Incident response and de-escalation training
- Regular refresher training and updates
- Specialized training for specific roles and responsibilities

## Monitoring and Evaluation
We continuously monitor our inclusion efforts through:
- Regular community surveys and feedback collection
- Demographic data analysis and trend monitoring
- Incident reporting and pattern analysis
- External audits and assessments
- Benchmarking against industry best practices

## Accountability Measures
Ensuring accountability at all levels:
- Clear performance expectations for inclusion
- Regular evaluation of staff and volunteer performance
- Consequences for failure to uphold standards
- Recognition and rewards for exemplary inclusion work
- Transparent reporting on progress and challenges`
    },
    {
      id: "continuous-improvement",
      title: "Continuous Improvement",
      category: "conduct",
      keywords: ["improvement", "feedback", "innovation", "excellence", "evolution"],
      content: `# Continuous Improvement

## Regular Review and Updates
This Code of Conduct is reviewed and updated:
- Annually by the Inclusion and Diversity Committee
- Following significant incidents or community feedback
- When new research or best practices emerge
- In response to changing community needs
- With input from diverse community stakeholders

## Community Feedback and Input
We actively seek community input through:
- Annual community inclusion surveys
- Focus groups with underrepresented communities
- Open forums and town hall meetings
- Suggestion boxes and anonymous feedback systems
- Partnership with external advocacy organizations

## Innovation and Best Practices
We stay current with inclusion innovations by:
- Participating in industry conferences and research
- Collaborating with academic institutions
- Sharing our learnings with other gaming communities
- Piloting new approaches and measuring their effectiveness
- Investing in cutting-edge inclusion technologies

## Commitment to Excellence
Our commitment to inclusion excellence means:
- Never being satisfied with 'good enough'
- Always striving to do better for our community
- Learning from our mistakes and growing stronger
- Leading by example in the gaming industry
- Measuring success by the experiences of our most marginalized members

## Conclusion
This Code of Conduct represents our unwavering commitment to creating a gaming community where everyone can thrive. It is a living document that will evolve with our community and our understanding of inclusion. Together, we will build a KONIVRER community that serves as a model for inclusive gaming worldwide.

## Contact Information
- **Inclusion and Diversity**: inclusion@konivrer.com
- **Code of Conduct Reports**: conduct@konivrer.com
- **Community Support**: support@konivrer.com
- **Accessibility Services**: accessibility@konivrer.com

© 2025 KONIVRER Community. This Code of Conduct is licensed under Creative Commons Attribution-ShareAlike 4.0 International License, allowing adaptation and sharing with attribution.`
    },
    {
      id: "accessibility",
      title: "Accessibility and Accommodations",
      category: "conduct",
      keywords: ["accessibility", "accommodations", "disability", "inclusion", "universal design"],
      content: `# Accessibility and Accommodations

## Universal Design Principles
We design our events and spaces to be accessible to as many people as possible from the start, rather than retrofitting accommodations. This includes:
- Physical accessibility (ramps, wide doorways, accessible seating)
- Sensory considerations (lighting, sound levels, quiet spaces)
- Cognitive accessibility (clear signage, simple navigation)
- Communication accessibility (multiple formats, interpretation)

## Types of Accommodations

| Disability Type | Common Accommodations | Implementation |
|----------------|----------------------|----------------|
| Mobility | Wheelchair access, reserved seating, assistance with materials | Accessible venues, volunteer support |
| Visual | Large print materials, screen readers, audio descriptions | Digital accessibility, alternative formats |
| Hearing | Sign language interpreters, captioning, visual alerts | Professional interpreters, assistive technology |
| Cognitive | Extended time, simplified instructions, memory aids | Flexible policies, clear communication |
| Neurological | Seizure precautions, medication breaks, quiet spaces | Medical awareness, environmental controls |
| Mental Health | Emotional support, break areas, flexible participation | Trained staff, supportive environment |
| Chronic Illness | Flexible scheduling, rest areas, medical accommodations | Understanding policies, health support |

## Requesting Accommodations
The accommodation request process is designed to be simple and respectful:
- Requests can be made at any time, though advance notice is helpful
- No medical documentation required for most accommodations
- Requests are handled confidentially by trained staff
- Interactive process to determine effective accommodations
- Regular check-ins to ensure accommodations are working

## Neurodiversity and Inclusion
We recognize and celebrate neurodiversity, understanding that neurological differences are natural variations. We support neurodiverse community members by:
- Providing sensory-friendly environments and quiet spaces
- Offering multiple ways to participate and communicate
- Training staff on neurodiversity awareness
- Avoiding assumptions about communication styles or behaviors
- Celebrating different ways of thinking and problem-solving`
    }
  ], []);

  const filteredSections = useMemo(() => {
    let filtered = wikiSections;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(section => section.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(section => 
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query) ||
        section.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [wikiSections, selectedCategory, searchQuery]);

  const activeSectionData = useMemo(() => {
    return wikiSections.find(section => section.id === activeSection);
  }, [wikiSections, activeSection]);

  return (
    <div className={`${cs.wikiContainer} ${className || ""}`}>
      <div className={cs.wikiHeader}>
        <h1>KONIVRER Rules Wiki</h1>
        <p>Comprehensive guide to KONIVRER rules, tournaments, and community standards</p>
      </div>

      <div className={cs.wikiContent}>
        <div className={cs.sidebar}>
          <div className={cs.searchSection}>
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cs.searchInput}
            />
          </div>

          <div className={cs.categoryFilter}>
            <h3>Categories</h3>
            <div className={cs.categoryButtons}>
              <button
                className={`${cs.categoryButton} ${selectedCategory === "all" ? cs.active : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              <button
                className={`${cs.categoryButton} ${selectedCategory === "basic" ? cs.active : ""}`}
                onClick={() => setSelectedCategory("basic")}
              >
                Basic Rules
              </button>
              <button
                className={`${cs.categoryButton} ${selectedCategory === "tournament" ? cs.active : ""}`}
                onClick={() => setSelectedCategory("tournament")}
              >
                Tournament Rules
              </button>
              <button
                className={`${cs.categoryButton} ${selectedCategory === "conduct" ? cs.active : ""}`}
                onClick={() => setSelectedCategory("conduct")}
              >
                Code of Conduct
              </button>
            </div>
          </div>

          <div className={cs.sectionList}>
            <h3>Sections</h3>
            <ul className={cs.sectionListItems}>
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <button
                    className={`${cs.sectionButton} ${activeSection === section.id ? cs.active : ""}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cs.mainContent}>
          {activeSectionData ? (
            <div className={cs.sectionContent}>
              <h2 className={cs.sectionTitle}>{activeSectionData.title}</h2>
              <div 
                className={cs.sectionBody}
                dangerouslySetInnerHTML={{ 
                  __html: activeSectionData.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, (match) => {
                    const level = match.trim().length;
                    return `<h${level}>`;
                  }).replace(/\n/g, '</h' + '>') 
                }}
              />
              
              {activeSectionData.subsections && (
                <div className={cs.subsections}>
                  {activeSectionData.subsections.map((subsection) => (
                    <div key={subsection.id} className={cs.subsection}>
                      <h3>{subsection.title}</h3>
                      <div 
                        className={cs.subsectionContent}
                        dangerouslySetInnerHTML={{ 
                          __html: subsection.content.replace(/\n/g, '<br/>') 
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={cs.noContent}>
              <h2>No content found</h2>
              <p>Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};