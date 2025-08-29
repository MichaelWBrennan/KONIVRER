import type { KonivrverRule, KonivrverKeywordAbility } from '../types/game';

/**
 * KONIVRER Rules Parser Service
 * Parses the KONIVRER rules PDF content into searchable JSON format
 */

// KONIVRER Rules Structure (from requirements analysis)
export const konivrverRules: KonivrverRule[]= [
  {
    section: "I",
    title: "Introduction",
    content: `What is KONIVRER?
Set within an alternate history parallel to our own, KONIVRER (pronounced Conjurer) is a strategic, expandable card game made to simulate head-to-head battles where players take on the role of powerful magic users aptly named "Conjurers," of which this game takes its name. Build powerful decks representing your grimoire, the cards, and the pages within. Gods and monsters of legend inhabit this familiar yet new world.

Q&A:
Q: "So what's with the funky letters in the card names?"
A: "In this alternative history, one empire-sized butterfly effect had to occur to achieve a level of narrative cohesion and 'fantasy realism' that I was satisfied with having for this world to exist: Rome never came to power. Because of this, the modern-day alphabet of this world doesn't have the structure in our world and stays in a Latin-derived form very similar to Roman Square but with heavier Greek influence. Part 7 of this rulebook shows how this alphabet works."

Objective:
• Winning: Reduce your opponent's Life Cards to 0 by attacking with Familiars and Spells. Players can defend with their own Familiar to protect their Life Cards. The last player or team standing wins.

Components:
• 6× 5 Element Flags
• 2× sets of the 63-card intro set.
• Rulebook (this document)
• Optional: Dice to track counters (not included)

Game Details:
• Playtime: 30–60 minutes.
• Age: 12+
• Players: 2 or more (supports 1v1, 2v2, 3v3, free-for-all)
• Required: A flat playing surface (e.g., table)

Deck Construction:
• 1 "Flag" to anchor your deck's Azoth identity (does not count toward total).
• 40 cards total.
• 1 copy per card maximum.
• 25 Common (🜠) cards.
• 13 Uncommon (☽) cards.
• 2 Rare (☉) cards.`,
    keywords: ["KONIVRER", "Conjurer", "winning", "life cards", "familiars", "spells", "deck construction", "flag", "azoth", "common", "uncommon", "rare"]
  },
  {
    section: "II",
    title: "Card Parts", 
    content: `All cards contain the following parts:
• Elements: The magical energies the card draws from
• Name: The card's unique identifier
• Lesser Type: The specific type of card (Familiar, Spell, Artifact, etc.)
• Abilities: Special rules and keyword abilities
• Flavor: Story text that adds atmosphere
• Set/Rarity: Set symbol and rarity indicator (🜠, ☽, ☉)
• Set Number: Numerical identifier within the set`,
    keywords: ["card parts", "elements", "name", "lesser type", "abilities", "flavor", "rarity", "set number"]
  },
  {
    section: "III", 
    title: "Zones",
    content: `Game zones define where cards can be placed:
• Field: Main battlefield for creatures and permanents
• Combat Row: Active combat and temporary effects (horizontal above Field)
• Azoth Row: Resource management and energy system (full-width bottom)
• Deck: Player library and draw pile
• Life: Life Cards that determine victory/defeat
• Flag: Special objective markers and game state indicators
• Removed from Play (Void): Exiled and removed cards
• Hand: Cards currently available to play`,
    keywords: ["zones", "field", "combat row", "azoth row", "deck", "life", "flag", "removed from play", "void", "hand"]
  },
  {
    section: "IV",
    title: "Phases",
    content: `Each turn consists of the following phases in order:
• Pre-Game: Setup and preparation phase
• Start: Beginning of turn effects and abilities
• Main: Primary phase for playing cards and abilities
• Combat: Attack and defend with creatures
• Post-Combat: Effects that trigger after combat
• Refresh: End of turn cleanup and preparation for next turn`,
    keywords: ["phases", "pre-game", "start", "main", "combat", "post-combat", "refresh", "turn"]
  },
  {
    section: "V",
    title: "Dynamic Resolution Chain (DRC)",
    content: `The DRC handles the resolution of spells and abilities:
• Effects are added to the chain in the order they are played
• The chain resolves in last-in, first-out order
• Players can respond to effects on the chain
• Each player must pass priority for the chain to resolve
• Some effects can change the order of resolution`,
    keywords: ["dynamic resolution chain", "DRC", "spells", "abilities", "priority", "resolution", "stack"]
  },
  {
    section: "VI",
    title: "Keyword Abilities",
    content: `KONIVRER features the following keyword abilities:
• Amalgam: Combines with other cards
• Brilliance: Light-based ability providing protection and healing
• Gust: Air-based ability granting speed and evasion  
• Inferno: Fire-based ability dealing direct damage
• Steadfast: Earth-based ability providing durability and strength
• Submerged: Water-based ability offering control and card draw
• Quintessence: Multi-element ability with versatile effects
• Void: Dark-based ability involving sacrifice and destruction`,
    keywords: ["keyword abilities", "amalgam", "brilliance", "gust", "inferno", "steadfast", "submerged", "quintessence", "void"]
  },
  {
    section: "VII",
    title: "KONIVRER Alphabet and Symbols",
    content: `KONIVRER uses a unique alphabet system derived from Roman Square with Greek influences:
• Element Symbols: Each element has a unique symbol
• Rarity Symbols: 🜠 (Common), ☽ (Uncommon), ☉ (Rare)
• Card Type Symbols: Special symbols for different card types
• The alphabet maintains readability while providing authentic flavor
• All symbols are designed to be easily recognizable and searchable`,
    keywords: ["alphabet", "symbols", "elements", "rarity", "card types", "roman square", "greek"]
  }
];

// Keyword ability definitions
export const keywordAbilities: Record<KonivrverKeywordAbility, string>= {
  amalgam: "Combines with other cards to create more powerful effects",
  brilliance: "Light-based ability providing protection, healing, and purification effects",
  gust: "Air-based ability granting increased speed, evasion, and temporary effects", 
  inferno: "Fire-based ability dealing direct damage and aggressive effects",
  steadfast: "Earth-based ability providing increased durability, strength, and permanence",
  submerged: "Water-based ability offering control, card draw, and manipulation effects",
  quintessence: "Multi-element ability with versatile effects that can adapt to different situations",
  void: "Dark-based ability involving sacrifice, destruction, and powerful but costly effects"
};

// Phase descriptions with exact text
export const phaseDescriptions: Record<string, string>= {
  "preGame": "Pre-Game: Setup phase where players prepare their decks, choose starting hands, and establish initial game state.",
  "start": "Start Phase: Beginning of turn effects trigger, draw a card (after first turn), and any start-of-turn abilities activate.",
  "main": "Main Phase: The primary phase where players can play cards, activate abilities, and make strategic decisions.",
  "combat": "Combat Phase: Players attack with their Familiars and defenders can block. Combat damage is assigned and resolved.",
  "postCombat": "Post-Combat Phase: Effects that trigger after combat resolve, and any end-of-combat abilities activate.",
  "refresh": "Refresh Phase: End of turn cleanup, discard to hand size limit, and prepare for the next player's turn."
};

/**
 * Search rules by text content
 */
export function searchRules(query: string, options?: {
  exactMatch?: boolean;
  caseSensitive?: boolean;
  searchKeywords?: boolean;
}): KonivrverRule[] {
  const { exactMatch= false, caseSensitive = false, searchKeywords = true } = options || {};
  const searchTerm= caseSensitive ? query : query.toLowerCase();
  
  return konivrverRules.filter(rule => {
    const content= caseSensitive ? rule.content : rule.content.toLowerCase();
    const title= caseSensitive ? rule.title : rule.title.toLowerCase();
    const keywords= rule.keywords.map(k => caseSensitive ? k : k.toLowerCase());
    
    if (exactMatch) {
      return content.includes(searchTerm) || title.includes(searchTerm) || 
             (searchKeywords && keywords.some(k => k === searchTerm));
    } else {
      return content.includes(searchTerm) || title.includes(searchTerm) || 
             (searchKeywords && keywords.some(k => k.includes(searchTerm)));
    }
  });
}

/**
 * Get rule by section
 */
export function getRuleBySection(section: string): KonivrverRule | undefined {
  return konivrverRules.find(rule => rule.section === section);
}

/**
 * Get keyword ability definition
 */
export function getKeywordDefinition(keyword: KonivrverKeywordAbility): string {
  return keywordAbilities[keyword];
}

/**
 * Get phase description
 */
export function getPhaseDescription(phase: string): string {
  return phaseDescriptions[phase] || "Unknown phase";
}

/**
 * Get all rules as JSON (for API export)
 */
export function getAllRulesAsJSON(): {
  rules: KonivrverRule[];
  keywords: Record<string, string>;
  phases: Record<string, string>;
} {
  return {
    rules: konivrverRules,
    keywords: keywordAbilities,
    phases: phaseDescriptions
  };
}

/**
 * Search with synonyms support
 */
export function searchWithSynonyms(query: string): KonivrverRule[] {
  const synonyms: Record<string, string[]>= {
    "removed from play": ["void", "exile", "exiled"],
    "void": ["removed from play", "exile", "exiled"],
    "familiar": ["creature", "monster", "being"],
    "azoth": ["mana", "energy", "resource"],
    "life cards": ["life", "health", "vitality"]
  };
  
  let results = searchRules(query);
  
  // Also search synonyms
  const queryLower= query.toLowerCase();
  Object.entries(synonyms).forEach(([key, values]) => {
    if (key.includes(queryLower) || values.some(v => v.includes(queryLower))) {
      const synonymResults= [key, ...values].flatMap(term => searchRules(term));
      results = [...results, ...synonymResults];
    }
  });
  
  // Remove duplicates
  const seen= new Set();
  return results.filter(rule => {
    const key= rule.section;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}