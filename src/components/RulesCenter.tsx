import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const RulesCenter = (): any => {
  const [rulesData, setRulesData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState(
    new Set(['overview']),
  );
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    // Load rules data
    const loadRulesData = async () => {
      try {
        const data = await import('../data/rules.json');
        console.log('Rules data loaded in component:', data);

        // Check if data is valid
        if (
          !data ||
          (typeof data === 'object' && Object.keys(data).length === 0)
        ) {
          console.error('Rules data is empty or invalid');
          setRulesData({
            overview: {
              title: '1. Game Overview',
              content:
                'Rules data is currently unavailable. Please check back later.',
              keywords: ['overview'],
            },
          });
          return;
        }

        setRulesData(data.default || data);
      } catch (error: any) {
        console.error('Failed to load rules:', err);
        // Set fallback data
        setRulesData({
          overview: {
            title: '1. Game Overview',
            content:
              'Rules data is currently unavailable. Please check back later.',
            keywords: ['overview'],
          },
        });
      }
    };

    loadRulesData();
  }, []);

  // Reset expanded sections when switching tabs
  useEffect(() => {
    if (true) {
      setExpandedSections(new Set(['overview']));
    } else if (true) {
      setExpandedSections(new Set(['tournamentOverview']));
    } else if (true) {
      setExpandedSections(new Set(['sportsmanship']));
    }
    setSearchTerm(''); // Clear search when switching tabs
  }, [activeTab]);

  // Tournament Rules Data - Unified approach from KONIVRER, Yu-Gi-Oh!, and Pokemon TCG
  const tournamentRulesData = {
    tournamentOverview: {
      title: "1. Tournament Overview",
      content: "KONIVRER tournaments are competitive events where players test their deck-building skills and strategic gameplay against other Conjurers. These events follow standardized procedures to ensure fair, consistent, and enjoyable competition for all participants.\n\nTournament play represents the pinnacle of KONIVRER competition, bringing together players from diverse backgrounds to compete in structured, organized events. Whether you're a casual player looking to test your skills or a competitive player seeking championship glory, KONIVRER tournaments provide exciting opportunities for strategic gameplay and community engagement.",
      keywords: ["tournament", "competitive", "overview", "introduction"]
    },
    tournamentTypes: {
      title: "1.1 Tournament Types and Classifications",
      content: "**Casual Events**\n• Local store tournaments with relaxed enforcement and learning focus\n• Emphasis on fun, education, and community building\n• Ideal for new players learning tournament procedures\n• Relaxed time limits and penalty enforcement\n• Judges available to help with rules questions and learning\n\n**Competitive Events**\n• Regional qualifiers and championship series with strict rule enforcement\n• Higher stakes competition with significant prizes\n• Professional-level judging and tournament procedures\n• Strict adherence to all tournament rules and time limits\n• Advanced players seeking qualification for higher-tier events\n\n**Professional Events**\n• Premier tournaments with highest level of competition and prizes\n• Invitation-only or qualification-required events\n• Maximum prize support and championship recognition\n• Live streaming and coverage for community viewing\n• Elite players competing for titles and professional recognition\n\n**Constructed Tournaments**\n• Players bring pre-built 40-card decks meeting format requirements\n• Deck lists must be submitted before tournament begins\n• Various constructed formats available (Standard, Extended, Legacy)\n• Emphasis on deck building strategy and preparation\n\n**Limited Draft Tournaments**\n• Players build decks from booster packs during the event in draft pods\n• Typically 6-8 players per draft pod for optimal experience\n• 3 booster packs per player for deck construction\n• Tests adaptability and card evaluation skills\n• Equal playing field regardless of card collection\n\n**Sealed Deck Tournaments**\n• Players build decks from a fixed pool of unopened booster product\n• Usually 6 booster packs provided per player\n• 30-minute deck construction period before tournament begins\n• Tests deck building skills with limited card pool\n• No prior knowledge of available cards required\n\n**Team Events**\n• Multiple players compete as coordinated teams with shared strategies\n• Team formats include Team Constructed and Team Limited\n• Communication allowed between team members during matches\n• Shared prize pools and recognition for team achievements\n\n**Online Tournaments**\n• Digital events conducted through official KONIVRER platforms\n• Global participation without geographical restrictions\n• Automated tournament management and result tracking\n• Special digital-only promotional cards and prizes",
      keywords: ["tournament types", "casual", "competitive", "professional", "constructed", "draft", "sealed", "team", "online"]
    },
    tournamentStructure: {
      title: "1.2 Tournament Structure and Format",
      content: "**Swiss Pairing System**\n• Preliminary rounds use Swiss pairing system ensuring balanced competition\n• Players paired against opponents with similar records each round\n• No player elimination during Swiss rounds - everyone plays all rounds\n• Optimal number of rounds determined by attendance using standard formulas\n• Prevents early elimination while maintaining competitive integrity\n\n**Round Determination Formula**\n• 8-16 players: 4 Swiss rounds\n• 17-32 players: 5 Swiss rounds\n• 33-64 players: 6 Swiss rounds\n• 65-128 players: 7 Swiss rounds\n• 129+ players: 8 Swiss rounds\n• Additional rounds may be added for larger events\n\n**Single-Elimination Playoffs**\n• Top performers advance to single-elimination bracket based on Swiss standings\n• Standard cuts: Top 8 for 32+ players, Top 4 for 16-31 players\n• Playoff bracket seeded by final Swiss standings\n• Higher seeds receive advantageous pairings\n• Single elimination continues until champion is determined\n\n**Match Format Structure**\n• Best of 3 games with optional sideboarding between games\n• First player determined randomly for game 1\n• Loser of previous game chooses who plays first in subsequent games\n• Sideboarding allowed between games when format permits\n• Match winner determined by first player to win 2 games\n\n**Time Limits and Management**\n• Swiss rounds: 50 minutes per match plus 5 additional turns after time expires\n• Playoff rounds may use extended time limits (70-90 minutes)\n• Championship finals may be untimed at judge discretion\n• Official time announcements at regular intervals\n• Time extensions granted for judge calls and deck checks\n\n**Tiebreaker Procedures**\n• Match Win Percentage: Primary tiebreaker for Swiss standings\n• Opponent Match Win Percentage: Secondary tiebreaker\n• Game Win Percentage: Tertiary tiebreaker\n• Opponent Game Win Percentage: Final statistical tiebreaker\n• Head-to-head record used when applicable\n• Random determination only when all other tiebreakers are identical",
      keywords: ["tournament structure", "swiss", "elimination", "rounds", "time limits", "tiebreakers", "playoffs"]
    },
    participationRequirements: {
      title: "1.3 Participation Requirements and Eligibility",
      content: "**Registration Requirements**\n• Valid player registration with tournament organizer required before event start\n• Complete registration form with accurate personal information\n• Acknowledgment of tournament rules and code of conduct\n• Payment of entry fees and any applicable taxes\n• Registration deadlines strictly enforced for competitive events\n\n**Identification and Verification**\n• Government-issued photo identification required for competitive events\n• Name on ID must match tournament registration exactly\n• International players may use passport or official government ID\n• Minors may use school ID with parental consent form\n• Tournament staff reserves right to verify identity at any time\n\n**Eligibility Standards**\n• Compliance with all tournament policies, procedures, and code of conduct\n• Players under suspension or disciplinary action prohibited from participation\n• Age verification required for youth divisions and age-restricted events\n• Geographic restrictions may apply for regional qualification events\n• Professional players may have additional eligibility requirements\n\n**Pre-Tournament Preparation**\n• Deck registration and verification must be completed before tournament begins\n• Deck lists submitted using official forms with required information\n• Legal deck construction verified by tournament staff\n• All required tournament materials must be present (sleeves, counters, etc.)\n• Players must be present for mandatory player meeting when required\n\n**Code of Conduct Acknowledgment**\n• All participants must acknowledge and agree to follow tournament code of conduct\n• Understanding of penalty system and appeals process required\n• Commitment to sportsmanlike behavior and fair play\n• Agreement to follow all judge instructions and tournament procedures\n• Acceptance of tournament organizer's final authority on all matters\n\n**Special Accommodations**\n• Reasonable accommodations available for players with disabilities\n• Language assistance provided when possible for non-native speakers\n• Religious or cultural accommodations considered on case-by-case basis\n• Medical accommodations require advance notice and documentation\n• All accommodation requests subject to tournament organizer approval",
      keywords: ["participation", "registration", "eligibility", "identification", "requirements", "accommodations"]
    },
    tournamentRoles: {
      title: "1.4 Tournament Roles and Responsibilities",
      content: "**Tournament Organizer (TO)**\n• Overall event management, logistics, and final authority on all tournament matters\n• Responsible for venue, registration, prize support, and tournament scheduling\n• Hires and manages tournament staff including judges and scorekeepers\n• Handles player disputes that cannot be resolved by tournament staff\n• Makes final decisions on tournament format, structure, and special circumstances\n• Ensures compliance with sanctioning organization requirements\n• Manages emergency situations and venue-related issues\n\n**Head Judge**\n• Final authority on all rules interpretations and penalty decisions during tournament\n• Supervises floor judges and ensures consistent rule enforcement\n• Handles appeals from players regarding judge decisions and penalties\n• Makes rulings on complex rules interactions and unusual situations\n• Responsible for maintaining tournament integrity and fair play\n• Issues severe penalties including disqualifications when necessary\n• Conducts judge training and ensures proper tournament procedures\n\n**Floor Judges**\n• Monitor matches and provide rules assistance to players during competition\n• Answer player questions about card interactions and game procedures\n• Enforce tournament rules and issue appropriate penalties for infractions\n• Conduct deck checks and verify deck legality throughout tournament\n• Maintain order in tournament area and ensure proper pace of play\n• Report significant issues and penalty recommendations to Head Judge\n• Assist with tournament logistics and player management\n\n**Scorekeeper**\n• Maintain accurate pairings, standings, and match results throughout tournament\n• Input match results and update standings after each round\n• Generate pairings for subsequent rounds using tournament software\n• Track player attendance and handle late arrivals or early departures\n• Maintain official tournament records and documentation\n• Assist with prize distribution and final standings verification\n• Provide statistical information to tournament organizer and judges\n\n**Players**\n• Compete fairly and honestly while following all tournament rules and procedures\n• Maintain sportsmanlike conduct and treat all participants with respect\n• Arrive punctually for all scheduled matches and tournament activities\n• Keep accurate game state and call judges when rules questions arise\n• Accept judge decisions gracefully and follow all tournament staff instructions\n• Assist in maintaining clean and organized tournament environment\n• Report any violations or concerns to tournament staff immediately\n\n**Spectators**\n• Observe matches silently without interfering in gameplay or providing assistance\n• Maintain appropriate distance from playing areas to avoid distractions\n• Follow all venue rules and tournament staff instructions\n• Report any observed violations to tournament staff rather than intervening\n• Respect player privacy and avoid photographing cards or notes without permission\n• Keep discussions of ongoing matches away from active players\n• Support positive tournament atmosphere through respectful behavior",
      keywords: ["tournament roles", "organizer", "judge", "scorekeeper", "players", "spectators", "responsibilities"]
    },
    tournamentTiers: {
      title: "1.5 Tournament Tiers and Sanctioning",
      content: "**Local Events (Tier 1)**\n• Store-level tournaments with basic prize support and relaxed atmosphere\n• Entry-level competition perfect for new and casual players\n• Local game store partnerships provide regular tournament opportunities\n• Emphasis on community building and player development\n• Basic prize support including booster packs and promotional items\n• Relaxed enforcement level with educational focus\n• Typically 8-32 players with 4-5 Swiss rounds\n\n**Regional Qualifiers (Tier 2)**\n• Multi-store events qualifying players for higher-tier competitions\n• Increased prize support and competitive atmosphere\n• Professional-level judging and tournament procedures\n• Qualification slots for National Championships awarded to top finishers\n• Attracts players from wider geographic areas\n• Stricter rule enforcement and penalty guidelines\n• Typically 50-150 players with 6-7 Swiss rounds plus Top 8\n\n**National Championships (Tier 3)**\n• Country-level premier events with significant prizes and recognition\n• Invitation or qualification required for participation\n• Maximum prize support including cash, products, and exclusive items\n• Professional coverage with live streaming and commentary\n• Elite competition featuring top players from across the nation\n• Highest level of rule enforcement and tournament procedures\n• Qualification for World Championship awarded to top finishers\n\n**World Championships (Tier 4)**\n• International competition featuring top players from around the globe\n• Invitation-only event for qualified players from National Championships\n• Largest prize pools and most prestigious recognition in KONIVRER\n• Extensive media coverage and community engagement\n• Multiple formats and side events throughout championship weekend\n• Crown the annual World Champion and recognize global excellence\n• Sets the standard for competitive KONIVRER play worldwide\n\n**Special Events**\n• Promotional tournaments with unique formats, themes, or restrictions\n• Charity events supporting community causes and organizations\n• Convention tournaments at gaming and pop culture events\n• Online championship series with global participation\n• Seasonal celebrations and holiday-themed competitions\n• Beta testing events for new cards, formats, or rule changes\n• Community appreciation events recognizing player contributions\n\n**Sanctioning Benefits**\n• All sanctioned events contribute to official player rankings and statistics\n• Tournament results tracked in global database for competitive recognition\n• Players earn Championship Points based on tournament performance\n• Access to exclusive promotional cards and tournament supplies\n• Eligibility for qualification events and invitation-only tournaments\n• Official recognition and support from KONIVRER tournament organization\n• Insurance coverage and dispute resolution through sanctioning body",
      keywords: ["tournament tiers", "sanctioning", "local", "regional", "national", "world championship", "special events"]
    },
    deckRegistration: {
      title: "2. Deck Registration and Verification",
      content: "2.1 Deck List Submission Requirements\n• Complete deck lists must be submitted before tournament begins using official forms\n• Include exact card names, quantities, set information, and collector numbers\n• Element Flag must be clearly identified and legal for the tournament format\n• Deck must conform to all construction restrictions for the specific format\n• Lists must be legible with clear handwriting or typed format - illegible lists rejected\n• Player name, tournament information, and signature required on all deck lists\n• Deck lists become official tournament documents and cannot be altered after submission\n• Late deck list submission results in automatic game loss penalty for first round\n• Players must retain a copy of their deck list for personal reference during event\n\n2.2 Deck Construction Verification Procedures\n• Random deck checks conducted between rounds by certified tournament staff\n• Players must present physical deck matching registered list exactly card-for-card\n• Deck composition errors result in penalties ranging from game loss to disqualification\n• Players are solely responsible for deck legality, accuracy, and format compliance\n• Proxy cards strictly prohibited except when authorized by head judge for damaged cards\n• Counterfeit cards result in immediate disqualification and removal from venue\n• Deck checks must be completed within 10 minutes or time extension granted\n• Players may request judge verification of deck legality before tournament start\n\n2.3 Sideboard Procedures and Regulations\n• Standard tournaments: No sideboard permitted - main deck only competition\n• Advanced formats: 15-card sideboard maximum when format allows sideboarding\n• Sideboard cards must be clearly listed separately on deck registration form\n• Between games, players may exchange cards between main deck and sideboard\n• Final deck configuration must match original main deck count exactly\n• Sideboard cards must meet same legality requirements as main deck cards\n• Time limit for sideboarding: 3 minutes between games, monitored by judges\n• Sideboard cards must be kept separate and clearly distinguishable during matches\n• Players may not look at sideboard cards during game play unless card effect allows\n\n2.4 Card Sleeves and Marking Prevention\n• Uniform card sleeves required for all competitive tournaments above casual level\n• Sleeves must be opaque, identical, and in good condition without distinguishing marks\n• Marked or damaged sleeves must be replaced immediately when discovered\n• Tournament staff may require sleeve changes at any time for tournament integrity\n• Sleeve color restrictions may apply - check with tournament organizer before event\n• Double-sleeving permitted if inner sleeves are uniform and tournament-legal\n• Artistic sleeves allowed unless they create gameplay advantages or distractions\n• Players responsible for maintaining sleeve condition throughout tournament duration\n\n2.5 Deck Check Procedures and Penalties\n• Deck checks performed randomly, after reported deck problems, or judge discretion\n• Players must present entire deck and sideboard for verification when requested\n• Deck check time does not count against match time - extensions granted automatically\n• Missing cards: Game loss penalty, player must obtain legal replacement immediately\n• Extra cards: Warning for first offense, game loss for subsequent violations\n• Illegal cards: Game loss penalty, illegal cards removed and replaced if possible\n• Marked cards: Warning to game loss depending on pattern and potential advantage\n• Severe deck problems or intentional violations result in disqualification",
      keywords: ["deck registration", "verification", "deck list", "sideboard", "sleeves", "construction", "penalties", "checks"]
    },
    matchProcedures: {
      title: "3. Match Procedures",
      content: "3.1 Pre-Match Procedures and Setup\n• Players locate assigned seating using tournament pairings and verify opponent identity\n• Present decks for opponent inspection and optional shuffling opportunity\n• Determine first player using random method (dice roll, coin flip, or high card)\n• Both players shuffle decks thoroughly and present to opponent for final shuffle/cut\n• Draw opening hands of 7 cards and declare any mulligans according to game rules\n• Begin game when both players confirm readiness and game state is clear\n• Record starting life totals and any pre-game effects or abilities\n• Ensure all required materials are present: life counters, dice, tokens, etc.\n\n3.2 During Match Play Requirements\n• Maintain clear and organized game state at all times with cards properly positioned\n• Announce all game actions clearly and allow opponent reasonable response time\n• Call judge immediately for any rules questions, disputes, or unclear situations\n• No outside assistance permitted from spectators, other players, or electronic devices\n• Electronic devices must be silenced and face-down during active match play\n• Note-taking permitted using pen and paper only - no electronic note-taking devices\n• Players must clearly indicate when passing priority or ending phases/turns\n• Maintain appropriate pace of play without unnecessary delays or stalling\n• Respect opponent's thinking time while avoiding excessive delays\n\n3.3 Time Management and Round Structure\n• 50-minute rounds with official time announcements at regular intervals\n• 10-minute warning announced when 10 minutes remain in round\n• 5-minute warning announced when 5 minutes remain in round\n• When time expires, current turn completes plus exactly 5 additional turns\n• Players must maintain reasonable pace of play throughout entire match\n• Slow play warnings issued for excessive delays, escalating to game loss\n• Judges monitor pace and may extend time for legitimate delays or judge calls\n• Time extensions granted for deck checks, judge calls, or technical difficulties\n• Players may not deliberately slow play to gain advantage from time constraints\n\n3.4 End-of-Match Procedures and Results\n• Determine match winner based on games won in best-of-three format\n• If time expires during additional turns, player with most life points wins current game\n• In case of tied life points at end of additional turns, current game is a draw\n• Match winner determined by games won: 2-0, 2-1 wins; 1-1-1 is match draw\n• Complete match result slip with both player signatures and clear result indication\n• Report results to tournament staff immediately - do not leave table without reporting\n• Return to designated waiting area without discussing ongoing matches with other players\n• Prepare for next round or elimination bracket as directed by tournament staff\n• Players may not concede or draw matches for prizes, money, or other considerations\n\n3.5 Comprehensive Tiebreaker System\n• Match Points: 3 points for match win, 1 point for draw, 0 points for loss\n• Game Win Percentage: Total games won divided by total games played (minimum 33%)\n• Opponent Match Win Percentage: Average match win percentage of all opponents faced\n• Opponent Game Win Percentage: Average game win percentage of all opponents faced\n• Head-to-head record used when players have identical records and faced each other\n• Random determination used only when all other tiebreakers are identical\n• Tiebreakers applied in order until standings are determined for all tied players\n• Playoff seeding determined by final Swiss standings using tiebreaker system\n\n3.6 Special Match Situations\n• Concessions allowed at any time but must be clearly stated to opponent and judges\n• Intentional draws allowed only in final Swiss round and must be agreed before match starts\n• Players may not offer or accept bribes, prizes, or considerations for match results\n• Spectators may not provide assistance, advice, or point out missed plays to either player\n• Language barriers accommodated through judge assistance when available\n• Players with disabilities receive reasonable accommodations as needed\n• Emergency situations handled by tournament staff with appropriate time extensions",
      keywords: ["match procedures", "time limit", "game state", "judges", "shuffling", "pace", "tiebreakers", "concessions"]
    },
    penalties: {
      title: "4. Penalties and Infractions",
      content: "4.1 Comprehensive Infraction Categories\n• Procedural Errors: Minor mistakes in game procedure, missed triggers, or tournament rules\n• Tournament Errors: Deck problems, tardiness, registration issues, or administrative violations\n• Unsporting Conduct: Behavior that disrupts tournament environment or violates conduct standards\n• Cheating: Intentional rule violations, deceptive practices, or attempts to gain unfair advantage\n• Communication Violations: Improper information sharing, coaching, or outside assistance\n• Electronic Device Violations: Unauthorized use of phones, internet, or recording devices\n\n4.2 Penalty Guidelines and Escalation\n• Warning: First offense for minor procedural errors, officially recorded in tournament records\n• Game Loss: Serious procedural errors, deck problems, repeated infractions, or significant violations\n• Match Loss: Major unsporting conduct, severe tournament violations, or repeated game losses\n• Disqualification: Cheating, severe misconduct, repeated serious infractions, or criminal behavior\n• Suspension: Extended punishment preventing participation in future sanctioned events\n• All penalties are cumulative and escalate based on severity and repetition patterns\n\n4.3 Specific Infractions and Standard Penalties\n• Drawing Extra Cards: Warning for first unintentional offense, game loss for repeated violations\n• Marked Cards: Warning to game loss depending on pattern, advantage gained, and intent\n• Slow Play: Warning with instruction and monitoring, escalating to game loss for persistence\n• Deck/Decklist Problems: Game loss penalty with deck corrected to match legal registered list\n• Tardiness: Warning at 5 minutes late, game loss at 10 minutes, match loss at 15 minutes\n• Unsporting Conduct: Range from match loss to disqualification based on severity and impact\n• Cheating: Immediate disqualification without prize eligibility and potential suspension\n• Outside Assistance: Warning to game loss depending on information received and advantage\n• Bribery/Collusion: Immediate disqualification and removal from tournament premises\n\n4.4 Detailed Appeals Process and Procedures\n• Players may appeal any penalty to the head judge immediately upon assessment\n• Appeals must be made before continuing play, leaving tournament area, or next round begins\n• Head judge reviews all circumstances, evidence, and witness statements before final determination\n• Appeals of disqualification are not permitted - head judge decision is final\n• Tournament organizer may review head judge decisions post-event for future consideration\n• Players have right to explanation of penalty reasoning and applicable tournament rules\n• Documentation of all penalties maintained in official tournament records\n• Repeat offenders tracked across multiple tournaments for pattern identification\n\n4.5 Penalty Assessment Factors and Considerations\n• Intent: Accidental mistakes treated differently than deliberate rule violations\n• Impact: Advantage gained or potential to affect game outcome influences penalty severity\n• Experience: Player's tournament history and familiarity with rules considered\n• Cooperation: Player's attitude and willingness to correct behavior affects penalty\n• Frequency: Repeated infractions result in escalated penalties regardless of type\n• Tournament Level: Higher-tier events may have stricter penalty enforcement\n• Education: First-time violations often include instruction to prevent future occurrences\n\n4.6 Special Circumstances and Mitigating Factors\n• Language barriers may reduce penalties when communication issues cause violations\n• Physical disabilities accommodated with modified procedures when possible\n• Age considerations for younger players with educational focus over punishment\n• Emergency situations may warrant penalty reduction or time extensions\n• Technical difficulties beyond player control may result in penalty mitigation\n• Judge errors that contribute to violations may reduce or eliminate player penalties\n• Good faith efforts to correct mistakes before discovery may influence penalty severity",
      keywords: ["penalties", "infractions", "warnings", "disqualification", "appeals", "cheating", "escalation", "assessment"]
    },
    communication: {
      title: "5. Communication and Conduct",
      content: "5.1 Player Communication Standards and Requirements\n• Players must communicate clearly, honestly, and accurately during all matches\n• Game state information must be provided truthfully when requested by opponent\n• Private information (hand contents, deck order, drawn cards) may not be revealed voluntarily\n• Players may ask judges for clarification on rules, card interactions, or tournament procedures\n• Language barriers accommodated through judge assistance and translation when available\n• Players must announce all game actions clearly and allow opponent reasonable response time\n• Derived information (life totals, cards in hand, graveyard contents) must be provided accurately\n• Players may not deliberately mislead opponents about game state or rules\n• Communication must be respectful and professional at all times\n\n5.2 Comprehensive Spectator Guidelines and Restrictions\n• Spectators must remain completely silent during active matches and not interfere\n• No coaching, advice, assistance, or strategic guidance to players permitted at any time\n• Spectators may not point out missed triggers, game errors, or rules violations\n• Disruptive spectators will be warned once, then removed from tournament area\n• Photography and recording subject to tournament organizer approval and player consent\n• Spectators must maintain appropriate distance from playing area to avoid distractions\n• No discussion of ongoing matches within hearing distance of active players\n• Spectators may not use electronic devices to assist players or provide information\n• Tournament staff may restrict spectator access during high-level matches\n\n5.3 Judge Interactions and Authority\n• Players must follow all judge instructions immediately and without argument\n• Judges have final authority to issue penalties, make rulings, and interpret tournament rules\n• Questions about rules, card interactions, or procedures welcome at any time during matches\n• Disputes with judge decisions may be appealed to head judge before continuing play\n• Respectful communication required in all judge interactions - disrespect results in penalties\n• Judges may observe matches, ask questions, and intervene when necessary\n• Players must call judges immediately for any rules disputes or unclear situations\n• Judge calls do not count against match time - appropriate extensions granted\n• False or frivolous judge calls may result in slow play penalties\n\n5.4 Electronic Device Policy and Restrictions\n• Cell phones must be completely silenced and face-down during active matches\n• No internet access, messaging, or communication permitted during tournament rounds\n• Calculators allowed for life point tracking and basic mathematical calculations only\n• Photography of opponent's cards, notes, or deck contents strictly prohibited\n• Emergency communications must be handled through tournament staff only\n• Smart watches and fitness trackers must be in airplane mode during matches\n• Tablets, laptops, and other computing devices prohibited in tournament area\n• Audio devices, headphones, and music players not permitted during competition\n• Violation of electronic device policy results in immediate game loss penalty\n\n5.5 Professional Conduct and Sportsmanship Standards\n• All participants must maintain highest standards of sportsmanship and fair play\n• Respectful treatment of opponents, judges, and tournament staff required at all times\n• Appropriate language free from profanity, offensive content, or discriminatory remarks\n• Gracious acceptance of both victories and defeats with dignity and composure\n• No excessive celebration, taunting, or unsporting behavior toward opponents\n• Players must assist in maintaining clean and organized tournament environment\n• Prompt arrival and preparation for all scheduled matches and activities\n• Cooperation with tournament staff and compliance with all venue rules and policies",
      keywords: ["communication", "spectators", "judges", "electronic devices", "conduct", "sportsmanship", "professional"]
    },
    formats: {
      title: "6. Tournament Formats and Legality",
      content: "6.1 Constructed Tournament Formats\n• Standard Format: Current rotation sets with most recent banned/restricted list updates\n• Extended Format: Larger card pool spanning multiple years of releases for deeper strategy\n• Legacy Format: All tournament-legal cards with comprehensive banned list for balance\n• Pauper Format: Common rarity cards only with format-specific restrictions and bans\n• Modern Format: Cards from recent sets with curated banned list for competitive balance\n• Pioneer Format: Mid-range card pool bridging Standard and Legacy formats\n• Historic Format: Digital-only format including special promotional and digital cards\n• Block Constructed: Limited to cards from specific set blocks or expansions\n\n6.2 Limited Tournament Formats\n• Booster Draft: Players draft from shared booster packs in pods of 6-8 players\n• Sealed Deck: Players build decks from predetermined booster pack allocation (typically 6 packs)\n• Team Draft: Teams of players draft and play coordinated matches with shared strategy\n• Cube Draft: Curated card pool designed for balanced draft environment and replayability\n• Rochester Draft: Face-up drafting format for high-level competitive events\n• Winston Draft: Two-player draft format using special drafting procedures\n• Grid Draft: Alternative draft format using grid-based card selection\n• Chaos Draft: Mixed booster packs from different sets for unpredictable gameplay\n\n6.3 Card Legality and Tournament Standards\n• Only tournament-legal cards permitted in sanctioned events - no proxies or counterfeits\n• Cards must be in original language or approved translation with official card database\n• Promotional cards legal only when specifically authorized by tournament organizer\n• Damaged cards may require replacement or head judge approval for continued use\n• Counterfeit cards result in immediate disqualification and removal from premises\n• Alternate art and special edition cards legal if functionally identical to tournament version\n• Foreign language cards permitted with official translation reference available\n• Misprinted cards legal unless they provide gameplay advantage or confusion\n\n6.4 Banned and Restricted Lists Management\n• Banned cards may not be included in any deck, sideboard, or tournament materials\n• Restricted cards limited to specified quantities per deck as defined by format rules\n• Lists updated periodically with advance notice and effective dates clearly announced\n• Players solely responsible for checking current legality before all tournament events\n• Emergency bans may be implemented immediately for tournament integrity and balance\n• Restricted list violations result in deck illegality and automatic game loss penalties\n• Format-specific restrictions may vary between different tournament types and tiers\n• Appeals for banned/restricted list changes handled through official channels only\n\n6.5 Deck Construction Requirements by Format\n• Minimum deck size: 40 cards for all constructed formats unless otherwise specified\n• Maximum deck size: No limit, but players must be able to shuffle unassisted\n• Sideboard maximum: 15 cards when permitted by format rules\n• Card quantity limits: Maximum 4 copies of any single card except basic lands\n• Element Flag requirements: Exactly 1 Element Flag card required in all constructed decks\n• Basic land restrictions: No limit on basic lands in constructed formats\n• Special card types: Legendary, Artifact, and Spell cards follow standard quantity rules\n• Format rotation: Standard format rotates annually, other formats maintain larger card pools",
      keywords: ["formats", "constructed", "limited", "legality", "banned", "restricted", "deck construction", "rotation"]
    },
    tournamentOperations: {
      title: "7. Tournament Operations and Technology",
      content: "7.1 Tournament Software and Digital Infrastructure\n• Official KONIVRER Tournament System (KTS) used for all sanctioned competitive events\n• Automated Swiss pairing system ensures fair opponent distribution and prevents rematches\n• Real-time standings and bracket updates available to players through mobile app\n• Digital match result reporting with verification systems and error checking\n• Integration with player rating and ranking databases for accurate skill assessment\n• Backup systems and offline capabilities for technical difficulties\n• Live streaming integration for featured matches and coverage\n• Anti-cheating detection algorithms monitoring for suspicious patterns\n• Tournament history tracking for statistical analysis and improvement\n\n7.2 Registration and Check-In Procedures\n• Online pre-registration required for Championship events with advance deadline\n• On-site registration available for local tournaments when space permits\n• Valid government-issued photo identification required for all competitive events\n• Player eligibility verification through official database and suspension checking\n• Late registration cutoff enforced strictly per event guidelines - no exceptions\n• Entry fee payment required before deck registration and tournament participation\n• Age division verification for youth and senior categories when applicable\n• Special accommodation requests processed during registration period\n• Waitlist management for oversubscribed events with fair admission procedures\n\n7.3 Round Structure and Timing Management\n• Swiss rounds determined by attendance using standard mathematical formulas\n• Top cut elimination rounds for events with 8+ players based on final standings\n• Round timer synchronized across all tournament areas with central control\n• 10-minute, 5-minute, and time-called announcements broadcast clearly\n• Playoff bracket seeding based on Swiss standings with tiebreaker application\n• Time extensions granted automatically for judge calls and deck checks\n• Round length adjustments for different tournament tiers and formats\n• Emergency procedures for venue issues, power outages, or other disruptions\n• Makeup rounds and schedule adjustments for unforeseen circumstances\n\n7.4 Comprehensive Prize Structure and Distribution\n• Prize support provided based on tournament tier, attendance, and sanctioning level\n• Booster packs, promotional cards, playmats, and tournament supplies awarded\n• Championship Points awarded for competitive ranking system and qualification\n• Special recognition for top performers, sportsmanship, and community contribution\n• Prize distribution requires valid player identification and signature confirmation\n• Tax documentation provided for prizes exceeding legal reporting thresholds\n• Prize substitution policies for unavailable items or player preferences\n• Unclaimed prize procedures and time limits for collection\n• Special prizes for achievements: undefeated records, comeback victories, etc.\n\n7.5 Data Collection, Reporting, and Analytics\n• Match results recorded in official tournament database with complete game history\n• Player performance statistics tracked for ranking purposes and skill assessment\n• Tournament reports submitted to sanctioning organization within 48 hours\n• Penalty tracking for repeat offense identification and pattern analysis\n• Event feedback collection for continuous improvement and player satisfaction\n• Demographic data collection for community growth and diversity tracking\n• Venue and organizer performance metrics for quality assurance\n• Financial reporting for prize distribution and tournament economics\n• Research data for game balance and format health analysis\n\n7.6 Tournament Security and Integrity Measures\n• Video surveillance of tournament area for security and dispute resolution\n• Bag checks and security screening for high-level events when necessary\n• Anti-fraud measures for registration, deck lists, and result reporting\n• Incident reporting procedures for theft, harassment, or other violations\n• Emergency contact information and procedures prominently displayed\n• Coordination with venue security and local law enforcement when required\n• Player conduct monitoring and intervention for problematic behavior\n• Confidential reporting channels for sensitive issues or concerns\n• Insurance coverage for tournament operations and participant safety",
      keywords: ["operations", "software", "registration", "prizes", "data", "technology", "security", "integrity"]
    }
  };

  // Code of Conduct Data - Comprehensive standards from major TCG organizations
  const codeOfConductData = {
    sportsmanship: {
      title: "1. Sportsmanship and Fair Play",
      content: "1.1 Core Principles\n• Treat all participants with dignity, respect, and courtesy\n• Maintain the highest standards of competitive integrity\n• Accept victories and defeats with equal grace and composure\n• Foster a welcoming environment for players of all skill levels\n• Demonstrate exemplary behavior as a representative of the KONIVRER community\n\n1.2 Expected Conduct\n• Arrive punctually and prepared for all scheduled activities\n• Follow all tournament rules and procedures without exception\n• Communicate clearly and honestly with opponents and officials\n• Assist newer players in learning proper procedures when appropriate\n• Maintain focus and respect during matches and tournament activities\n\n1.3 Competitive Standards\n• Play to the best of your ability in every match\n• Make all decisions based on game strategy, not external factors\n• Acknowledge your own errors and rule violations promptly\n• Respect your opponent's right to think and make strategic decisions\n• Uphold the spirit of fair competition in all interactions\n\n1.4 Professional Behavior\n• Use appropriate language free from profanity or offensive content\n• Respect personal space and physical boundaries of all participants\n• Keep discussions focused on game-related topics during matches\n• Follow instructions from tournament staff immediately and completely\n• Represent yourself and the game positively at all times",
      keywords: ["sportsmanship", "respect", "fair play", "communication", "integrity", "professional"]
    },
    prohibitedBehavior: {
      title: "2. Prohibited Conduct and Violations",
      content: "2.1 Zero Tolerance Violations\n• Cheating, fraud, or any form of deceptive practice\n• Harassment, discrimination, or intimidation based on any personal characteristic\n• Threats of violence or actual physical confrontation\n• Theft, vandalism, or destruction of property\n• Bribery, collusion, or manipulation of tournament results\n• Impersonation of tournament officials or staff members\n\n2.2 Serious Misconduct\n• Intentional slow play or deliberate stalling tactics\n• Excessive celebration, taunting, or unsporting behavior toward opponents\n• Arguing with or showing disrespect toward judges and tournament staff\n• Disrupting other matches or tournament activities\n• Sharing strategic information about ongoing matches\n• Violating electronic device policies during competition\n\n2.3 Minor Infractions\n• Failure to maintain proper game state or follow tournament procedures\n• Using inappropriate language or engaging in disruptive conversation\n• Arriving late to scheduled matches or tournament activities\n• Failing to properly register or provide required documentation\n• Minor violations of dress code or tournament guidelines\n\n2.4 Consequences and Enforcement\n• Violations result in penalties ranging from warnings to permanent suspension\n• Serious misconduct may result in immediate removal from premises\n• Criminal behavior will be reported to appropriate law enforcement\n• Repeat offenders face escalating penalties and potential lifetime bans\n• All penalties are recorded and may affect future tournament eligibility",
      keywords: ["prohibited", "cheating", "harassment", "unsporting", "consequences", "violations"]
    },
    inclusivity: {
      title: "3. Diversity, Equity, and Inclusion",
      content: "3.1 Community Values\n• KONIVRER welcomes participants from all backgrounds and identities\n• Zero tolerance for discrimination based on race, gender, religion, sexual orientation, disability, or any other characteristic\n• Commitment to creating safe, inclusive spaces for all community members\n• Equal opportunities and treatment regardless of skill level or experience\n• Celebration of diversity as a strength of our gaming community\n\n3.2 Anti-Discrimination Policy\n• Discriminatory language, symbols, imagery, or behavior strictly prohibited\n• Offensive content on clothing, accessories, or personal items not permitted\n• Harassment or targeting of individuals based on personal characteristics forbidden\n• Retaliation against those reporting discrimination is itself a violation\n• All community members responsible for maintaining inclusive environment\n\n3.3 Accessibility and Accommodation\n• Reasonable accommodations provided for participants with disabilities\n• Alternative communication methods available when needed\n• Physical accessibility considerations addressed at all tournament venues\n• Assistance available for players requiring support during competition\n• Advance notice requested but not required for accommodation requests\n\n3.4 Reporting and Response\n• Multiple channels available for reporting discrimination or harassment\n• Anonymous reporting options provided when possible\n• Prompt investigation of all reported incidents\n• Appropriate corrective action taken based on investigation findings\n• Support resources available for affected community members",
      keywords: ["inclusivity", "diversity", "discrimination", "accessibility", "safe space", "accommodation"]
    },
    reporting: {
      title: "4. Reporting Procedures and Support",
      content: "4.1 Incident Reporting\n• Report violations immediately to any tournament judge or staff member\n• Anonymous reporting forms available at tournament registration\n• Direct contact with tournament organizers for serious concerns\n• Email conduct@konivrer.com for post-event reporting or ongoing issues\n• Emergency contact information prominently displayed at all events\n\n4.2 Investigation Process\n• All reports treated seriously and investigated thoroughly\n• Confidentiality maintained to the maximum extent possible\n• Fair and impartial hearing process for all parties involved\n• Evidence gathering and witness interviews conducted as appropriate\n• Timely resolution with clear communication of outcomes\n\n4.3 Appeals and Review\n• Appeals process available for disputed penalty decisions\n• Independent review board for serious disciplinary actions\n• Clear timeline and procedures for appeal submissions\n• Right to representation or advocacy during appeal process\n• Final decisions communicated in writing with reasoning provided\n\n4.4 Support Resources\n• Tournament staff trained in conflict resolution and crisis intervention\n• Mental health and counseling resources available upon request\n• Player advocates present at major tournaments and championship events\n• Follow-up support provided for participants affected by serious incidents\n• Referrals to external support services and resources when appropriate\n\n4.5 Community Education\n• Regular training sessions on conduct expectations and reporting procedures\n• Educational materials distributed at tournaments and online\n• Workshops on inclusive behavior and cultural competency\n• Mentorship programs pairing experienced players with newcomers\n• Ongoing dialogue about community standards and improvement opportunities",
      keywords: ["reporting", "enforcement", "investigation", "support", "resources", "appeals", "education"]
    }
  };

  const toggleSection = sectionId => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (true) {
    return (
      <div className="flex items-center justify-center min-h-screen"></div>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get current data based on active tab
  const getCurrentData = (): any => {
    switch (true) {
      case 'tournament':
        return tournamentRulesData;
      case 'conduct':
        return codeOfConductData;
      default:
        return rulesData;
    }
  };

  const currentData = getCurrentData();

  const filteredSections = currentData
    ? Object.entries(currentData).filter(([key, section]) => {
        try {
          // Skip metadata fields
          if (key === 'lastUpdated' || key === 'version') return false;
          // If no search term, include all sections
          if (!searchTerm) return true;
          // Search in title and content for any word
          const searchLower = searchTerm.toLowerCase();
          return (
            (section.title &&
              section.title.toLowerCase().includes(searchLower)) ||
            (section.content &&
              section.content.toLowerCase().includes(searchLower))
          );
        } catch (error: any) {
          console.error(`Error filtering section ${key}:`, error);
          return false;
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="container mx-auto px-4 py-4"></div>
        {/* Search and Controls - Now on top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-md p-1 mb-0"
         />
          <div className="relative"></div>
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" / />
            <input
              type="text"
              placeholder="Search rules and content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-0 bg-white/10 border border-white/20 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs whitespace-nowrap"
            />
          </div>
        </motion.div>

        {/* Tab Navigation - Now below search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-md p-1 mb-0"
         />
          <div className="flex gap-1"></div>
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-2 py-0 rounded-sm transition-all font-medium text-xs whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Basic Rules
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`px-2 py-0 rounded-sm transition-all font-medium text-xs whitespace-nowrap ${
                activeTab === 'tournament'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Tournament Rules
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`px-2 py-0 rounded-sm transition-all font-medium text-xs whitespace-nowrap ${
                activeTab === 'conduct'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Code of Conduct
            </button>
        </motion.div>

        {/* Rules Sections as Dropdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-0"
         />
          {filteredSections.map(([key, section]) => (
            <div
              key={key}
              className="bg-white/10 backdrop-blur-sm rounded-md overflow-hidden"
             />
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-2 py-0 flex items-center justify-between text-left hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <div className="flex items-center"></div>
                  <h2 className="text-sm font-bold text-white tracking-wide whitespace-nowrap" />
                    {section.title || 'Rules Section'}
                </div>
                <div className="flex items-center gap-1"></div>
                  <span className="text-xs text-gray-400 hidden sm:block whitespace-nowrap"></span>
                    {expandedSections.has(key) ? 'Collapse' : 'Expand'}
                  {expandedSections.has(key) ? (
                    <ChevronUp className="w-3 h-3 text-gray-400" / />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-gray-400" / />
                  )}
              </button>

              {/* Section Content - Collapsible */}
              <AnimatePresence />
                {expandedSections.has(key) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                   />
                    <div className="px-2 py-0 bg-white/5"></div>
                      <div className="max-w-none"></div>
                        {section?.content ? (
                          <div className="text-gray-200 leading-relaxed space-y-0 text-sm"></div>
                            {section.content
                              .split('\n\n')
                              .map((paragraph, index) => {
                                // Skip empty paragraphs
                                if (!paragraph.trim()) return null;
                                // Handle headers (lines that start with #)
                                if (paragraph.startsWith('#')) {
                                  const headerLevel =
                                    paragraph.match(/^#+/)[0].length;
                                  const headerText = paragraph.replace(
                                    /^#+\s*/,
                                    '',
                                  );
                                  const HeaderTag = `h${Math.min(headerLevel + 2, 6)}`;

                                  return (
                                    <div
                                      key={index}
                                      className={`${headerLevel === 1 ? 'text-lg' : headerLevel === 2 ? 'text-base' : 'text-sm'} font-bold text-white mt-0 mb-0 first:mt-0`}
                                     />
                                      {headerText}
                                  );
                                }

                                // Handle lists (lines that start with - or *)
                                if (
                                  paragraph.includes('\n-') ||
                                  paragraph.includes('\n*') ||
                                  paragraph.startsWith('-') ||
                                  paragraph.startsWith('*')
                                ) {
                                  const listItems = paragraph
                                    .split('\n')
                                    .filter(
                                      line =>
                                        line.trim().startsWith('-') ||
                                        line.trim().startsWith('*'),
                                    );
                                  if (true) {
                                    return (
                                      <ul
                                        key={index}
                                        className="list-disc list-inside space-y-0 ml-4 text-sm"
                                       />
                                        {listItems.map((item, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-gray-200 leading-relaxed"
                                           />
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: item
                                                  .replace(/^[-*]\s*/, '')
                                                  .replace(
                                                    /\*\*(.*?)\*\*/g,
                                                    '<strong class="text-white font-semibold">$1</strong>',
                                                  ),
                                              }}
                                            />
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                }

                                // Handle numbered lists
                                if (paragraph.match(/^\d+\./)) {
                                  const listItems = paragraph
                                    .split('\n')
                                    .filter(line =>
                                      line.trim().match(/^\d+\./),
                                    );
                                  if (true) {
                                    return (
                                      <ol
                                        key={index}
                                        className="list-decimal list-inside space-y-0 ml-4 text-sm"
                                       />
                                        {listItems.map((item, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-gray-200 leading-relaxed"
                                           />
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: item
                                                  .replace(/^\d+\.\s*/, '')
                                                  .replace(
                                                    /\*\*(.*?)\*\*/g,
                                                    '<strong class="text-white font-semibold">$1</strong>',
                                                  ),
                                              }}
                                            />
                                          </li>
                                        ))}
                                      </ol>
                                    );
                                  }
                                }

                                // Regular paragraphs
                                return (
                                  <p
                                    key={index}
                                    className="text-gray-200 leading-relaxed text-sm"
                                   />
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: paragraph.replace(
                                          /\*\*(.*?)\*\*/g,
                                          '<strong class="text-white font-semibold">$1</strong>',
                                        ),
                                      }}
                                    />
                                  </p>
                                );
                              })
                              .filter(Boolean)}
                          </div>
                        ) : (
                          <div className="text-gray-300 leading-relaxed"></div>
                            <p>Content for this section is not available.</p>
                        )}
                      </div>
                  </motion.div>
                )}
              </AnimatePresence>
          ))}
        </motion.div>
      </div>
  );
};

export default RulesCenter;