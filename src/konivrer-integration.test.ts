import { describe, it, expect, beforeEach } from 'vitest';
import { KonivrRulesSearchService } from '../backend/src/search/konivr-rules-search.service';

describe('KONIVRER Rules Integration Tests', () => {
  let rulesService: KonivrRulesSearchService;

  beforeEach(() => {
    rulesService = new KonivrRulesSearchService();
  });

  describe('KONIVRER Rules Search', () => {
    it('should find rules by keyword search', async () => {
      const results = await rulesService.searchRules('amalgam');
      
      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].rule.title).toContain('Amalgam');
      expect(results[0].matchingTerms).toContain('amalgam');
    });

    it('should find rules by element search', async () => {
      const results = await rulesService.searchRules('fire 🜂');
      
      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
      
      // Should find rules related to fire element
      const hasFireRules = results.some(r => 
        r.rule.elements.includes('🜂') || 
        r.rule.keywords.includes('fire')
      );
      expect(hasFireRules).toBe(true);
    });

    it('should return rules by specific keyword', async () => {
      const brillianceRules = await rulesService.getRulesByKeyword('brilliance');
      
      expect(brillianceRules).toBeDefined();
      expect(brillianceRules.length).toBeGreaterThan(0);
      expect(brillianceRules[0].title).toContain('Brilliance');
    });

    it('should return rules by element', async () => {
      const fireRules = await rulesService.getRulesByElement('🜂');
      
      expect(fireRules).toBeDefined();
      expect(fireRules.length).toBeGreaterThan(0);
      
      // Should include Inferno rules
      const hasInfernoRule = fireRules.some(r => r.keywords.includes('inferno'));
      expect(hasInfernoRule).toBe(true);
    });

    it('should provide quick reference for common scenarios', async () => {
      const combatRules = await rulesService.getQuickReference('combat');
      
      expect(combatRules).toBeDefined();
      expect(combatRules.length).toBeGreaterThan(0);
      
      // Should include combat-related rules
      const hasCombatRule = combatRules.some(r => 
        r.keywords.includes('combat') || r.title.includes('Combat')
      );
      expect(hasCombatRule).toBe(true);
    });

    it('should explore rules with related rules', async () => {
      const exploration = await rulesService.exploreRule('KR-700.1');
      
      expect(exploration).toBeDefined();
      expect(exploration?.rule.title).toContain('Amalgam');
      expect(exploration?.relatedRules.length).toBeGreaterThan(0);
      expect(exploration?.interactions.length).toBeGreaterThan(0);
    });
  });

  describe('KONIVRER Game Mechanics Validation', () => {
    it('should validate deck construction rules', async () => {
      const deckRules = await rulesService.getRulesByKeyword('deck construction');
      
      expect(deckRules).toBeDefined();
      expect(deckRules.length).toBeGreaterThan(0);
      
      const rule = deckRules[0];
      expect(rule.text).toContain('40 cards');
      expect(rule.text).toContain('25 Common');
      expect(rule.text).toContain('13 Uncommon');
      expect(rule.text).toContain('2 Rare');
    });

    it('should validate life cards system', async () => {
      const lifeCardRules = await rulesService.searchRules('life cards');
      
      expect(lifeCardRules).toBeDefined();
      expect(lifeCardRules.length).toBeGreaterThan(0);
      
      const rule = lifeCardRules[0];
      expect(rule.rule.text).toContain('4 cards');
      expect(rule.rule.text).toContain('face down');
      expect(rule.rule.keywords).toContain('life cards');
    });

    it('should validate element immunity system', async () => {
      const gustRule = await rulesService.getRulesByKeyword('gust');
      const brillianceRule = await rulesService.getRulesByKeyword('brilliance');
      
      expect(gustRule).toBeDefined();
      expect(brillianceRule).toBeDefined();
      
      // Gust should not affect Earth cards
      expect(gustRule[0].text).toContain('🜃');
      expect(gustRule[0].text).toContain('does not affect');
      
      // Brilliance should not affect Nether cards
      expect(brillianceRule[0].text).toContain('▢');
      expect(brillianceRule[0].text).toContain('does not affect');
    });

    it('should validate phase system', async () => {
      const phaseRules = await rulesService.getRulesByKeyword('phases');
      
      expect(phaseRules).toBeDefined();
      expect(phaseRules.length).toBeGreaterThan(0);
      
      const rule = phaseRules[0];
      expect(rule.text).toContain('Start Phase');
      expect(rule.text).toContain('Main Phase');
      expect(rule.text).toContain('Combat Phase');
      expect(rule.text).toContain('Refresh Phase');
    });
  });

  describe('KONIVRER Keyword Interactions', () => {
    it('should validate Amalgam choice mechanics', async () => {
      const amalgamRule = await rulesService.getRulesByKeyword('amalgam');
      
      expect(amalgamRule).toBeDefined();
      expect(amalgamRule[0].text).toContain('choose');
      expect(amalgamRule[0].text).toContain('two options');
      expect(amalgamRule[0].keywords).toContain('choice');
    });

    it('should validate keyword strength limitations', async () => {
      const keywords = ['brilliance', 'gust', 'inferno', 'steadfast', 'submerged'];
      
      for (const keyword of keywords) {
        const rules = await rulesService.getRulesByKeyword(keyword);
        expect(rules).toBeDefined();
        expect(rules.length).toBeGreaterThan(0);
        
        // Each keyword should have strength limitations
        expect(rules[0].text).toContain('≤');
        expect(rules[0].text).toMatch(/🜂|🜄|🜃|🜁|⭘|▢/); // Contains element symbols
      }
    });

    it('should validate Void keyword mechanics', async () => {
      const voidRules = await rulesService.getRulesByKeyword('void');
      
      expect(voidRules).toBeDefined();
      expect(voidRules[0].text).toContain('Remove');
      expect(voidRules[0].text).toContain('from the game');
      expect(voidRules[0].text).toContain('⭘'); // Aether immunity
    });

    it('should validate Quintessence keyword mechanics', async () => {
      const quintessenceRules = await rulesService.getRulesByKeyword('quintessence');
      
      expect(quintessenceRules).toBeDefined();
      expect(quintessenceRules[0].text).toContain("can't be played as a Familiar");
      expect(quintessenceRules[0].text).toContain('any Azoth type');
      expect(quintessenceRules[0].keywords).toContain('azoth');
    });
  });

  describe('KONIVRER Zone System', () => {
    it('should validate zone definitions', async () => {
      const zoneRules = await rulesService.getRulesByKeyword('zones');
      
      expect(zoneRules).toBeDefined();
      expect(zoneRules[0].text).toContain('Field');
      expect(zoneRules[0].text).toContain('Combat Row');
      expect(zoneRules[0].text).toContain('Azoth Row');
      expect(zoneRules[0].text).toContain('Removed from Play');
    });

    it('should provide zone-specific guidance', async () => {
      const quickRef = await rulesService.getQuickReference('setup');
      
      expect(quickRef).toBeDefined();
      expect(quickRef.length).toBeGreaterThan(0);
      
      // Should include life cards and phase information
      const hasLifeCards = quickRef.some(r => r.keywords.includes('life cards'));
      const hasPhases = quickRef.some(r => r.keywords.includes('phases'));
      
      expect(hasLifeCards).toBe(true);
      expect(hasPhases).toBe(true);
    });
  });
});

describe('KONIVRER Element System Tests', () => {
  let rulesService: KonivrRulesSearchService;

  beforeEach(() => {
    rulesService = new KonivrRulesSearchService();
  });

  const elements = [
    { symbol: '🜂', name: 'fire', immunity: '🜄' },
    { symbol: '🜄', name: 'water', immunity: '🜁' },
    { symbol: '🜃', name: 'earth', immunity: '🜂' },
    { symbol: '🜁', name: 'air', immunity: '🜃' },
    { symbol: '⭘', name: 'aether', immunity: null },
    { symbol: '▢', name: 'nether', immunity: null },
  ];

  it('should validate all element symbols are recognized', async () => {
    for (const element of elements) {
      const rules = await rulesService.getRulesByElement(element.symbol);
      expect(rules).toBeDefined();
    }
  });

  it('should validate element immunity patterns', async () => {
    // Fire effects (Inferno) should not affect Water cards
    const infernoRule = await rulesService.getRulesByKeyword('inferno');
    expect(infernoRule[0].text).toContain('🜄');
    expect(infernoRule[0].text).toContain('does not affect');

    // Air effects (Gust) should not affect Earth cards
    const gustRule = await rulesService.getRulesByKeyword('gust');
    expect(gustRule[0].text).toContain('🜃');
    expect(gustRule[0].text).toContain('does not affect');
  });

  it('should provide element-based search results', async () => {
    const fireResults = await rulesService.searchRules('fire');
    const waterResults = await rulesService.searchRules('water');

    expect(fireResults.length).toBeGreaterThan(0);
    expect(waterResults.length).toBeGreaterThan(0);

    // Fire results should include Inferno
    const hasInferno = fireResults.some(r => r.rule.keywords.includes('inferno'));
    expect(hasInferno).toBe(true);
  });
});