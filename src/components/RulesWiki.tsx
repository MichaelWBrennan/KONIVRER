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

KONIVRER (pronounced Conjurer) is a strategic, expandable card game set within an alternate history parallel to our own. Players take on the role of powerful magic users aptly named "Conjurers," building powerful decks representing their grimoire.

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
- **Players**: 2 or more (supports 1v1, 2v2, 3v3, free-for-all)
- **Required**: A flat playing surface (e.g., table)

## Deck Construction
- 1 "Flag" to anchor your deck's Azoth identity (does not count toward total)
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
- **Spell**: Play a card from your hand but put it onto the bottom of your deck after resolving one of the abilities on the card
- **Burst**: You may play a card for free or put it in your hand when it's drawn from your life cards after you take damage

## 3. Combat Phase
- Attack with Familiars individually by placing them in the Combat Row

## 4. Post-Combat Main Phase
- Play additional cards if resources allow

## 5. Refresh Phase
- Refresh all rested Azoth sources (turning vertical)`
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