import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Save, 
  Share2, 
  Download, 
  Upload,
  Zap,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Shuffle,
  Eye,
  EyeOff,
  Lightbulb,
  Sparkles,
  Cpu,
  Activity,
  Layers,
  PieChart,
  LineChart,
  Settings,
  Magic,
  Wand2,
  Bot,
  Gamepad2,
  Trophy,
  Star,
  Heart,
  Bookmark,
  Copy,
  Trash2,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Grid,
  List,
  SlidersHorizontal,
  Palette,
  Beaker,
  FlaskConical,
  TestTube,
  Microscope
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CacheManager, PerformanceMonitor, announceToScreenReader } from '../utils/modernFeatures';

const AdvancedDeckBuilder = () => {
  const { deckId } = useParams();
  const { user } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cost: [],
    type: [],
    element: [],
    rarity: [],
    set: []
  });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCard, setSelectedCard] = useState(null);
  const [deckStats, setDeckStats] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showSideboard, setShowSideboard] = useState(false);
  const [deckValidation, setDeckValidation] = useState({});
  const [metaAnalysis, setMetaAnalysis] = useState({});
  const [playtest, setPlaytest] = useState({
    hands: [],
    currentHand: [],
    mulligans: 0,
    turn: 1
  });
  const [isPlaytesting, setIsPlaytesting] = useState(false);
  
  // Advanced features
  const [deckOptimizer, setDeckOptimizer] = useState({
    enabled: false,
    goals: ['consistency', 'power', 'speed'],
    constraints: ['budget', 'collection']
  });
  const [collaborators, setCollaborators] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);
  const [exportFormats, setExportFormats] = useState(['arena', 'cockatrice', 'xmage', 'pdf']);

  const cacheManager = useMemo(() => new CacheManager(), []);
  const canvasRef = useRef(null);
  const [deckVisualization, setDeckVisualization] = useState('curve');

  // Mock data initialization
  useEffect(() => {
    const initializeDeckBuilder = async () => {
      // Load cards with caching
      const cardsData = await cacheManager.getOrFetch('cards_database', async () => {
        // Simulate API call
        return [
          {
            id: 1,
            name: 'Brilliant Watcher',
            cost: 2,
            type: 'Creature',
            element: 'Fire',
            rarity: 'Rare',
            set: 'Core Set',
            power: 2,
            toughness: 1,
            abilities: ['Flying', 'When Brilliant Watcher enters play, draw a card'],
            image: '/api/placeholder/200/280',
            metaScore: 8.5,
            playRate: 45.2,
            winRate: 62.1
          },
          {
            id: 2,
            name: 'Infernal Sprinter',
            cost: 1,
            type: 'Creature',
            element: 'Fire',
            rarity: 'Common',
            set: 'Core Set',
            power: 2,
            toughness: 1,
            abilities: ['Haste', 'At end of turn, sacrifice Infernal Sprinter'],
            image: '/api/placeholder/200/280',
            metaScore: 7.2,
            playRate: 38.7,
            winRate: 58.9
          },
          // Add more cards...
        ];
      });

      setCards(cardsData);
      setFilteredCards(cardsData);

      // Load existing deck or create new
      if (deckId) {
        const deckData = await cacheManager.getOrFetch(`deck_${deckId}`, async () => {
          return {
            id: deckId,
            name: 'Elemental Storm',
            format: 'Standard',
            mainboard: [
              { cardId: 1, quantity: 4 },
              { cardId: 2, quantity: 4 }
            ],
            sideboard: [],
            description: 'Aggressive elemental deck',
            tags: ['Aggro', 'Elemental'],
            version: '2.1',
            lastModified: new Date().toISOString(),
            isPublic: false,
            collaborators: []
          };
        });
        setDeck(deckData);
      } else {
        // Create new deck
        setDeck({
          id: null,
          name: 'New Deck',
          format: 'Standard',
          mainboard: [],
          sideboard: [],
          description: '',
          tags: [],
          version: '1.0',
          lastModified: new Date().toISOString(),
          isPublic: false,
          collaborators: []
        });
      }

      // Initialize AI analysis
      await runAIAnalysis();
    };

    initializeDeckBuilder();
  }, [deckId]);

  // Real-time deck analysis
  useEffect(() => {
    if (deck && deck.mainboard.length > 0) {
      calculateDeckStats();
      validateDeck();
      runMetaAnalysis();
    }
  }, [deck]);

  // AI-powered deck analysis
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = [
        {
          type: 'optimization',
          priority: 'high',
          title: 'Mana Curve Optimization',
          description: 'Your deck has too many 3-cost cards. Consider adding more 1-2 cost cards for better early game.',
          cards: [
            { id: 2, name: 'Infernal Sprinter', reason: 'Excellent 1-cost aggressive creature' }
          ],
          impact: '+12% consistency'
        },
        {
          type: 'synergy',
          priority: 'medium',
          title: 'Elemental Synergy',
          description: 'Adding more elemental creatures would improve your tribal synergies.',
          cards: [
            { id: 3, name: 'Elemental Token Generator', reason: 'Creates multiple elemental tokens' }
          ],
          impact: '+8% win rate vs control'
        },
        {
          type: 'meta',
          priority: 'medium',
          title: 'Meta Adaptation',
          description: 'Current meta favors removal-heavy decks. Consider adding protection spells.',
          cards: [
            { id: 4, name: 'Elemental Ward', reason: 'Protects key creatures from removal' }
          ],
          impact: '+15% win rate vs meta decks'
        }
      ];
      
      setAiSuggestions(suggestions);
      announceToScreenReader(`AI analysis complete. Found ${suggestions.length} suggestions.`);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateDeckStats = () => {
    if (!deck || !deck.mainboard) return;

    const mainboardCards = deck.mainboard.map(entry => {
      const card = cards.find(c => c.id === entry.cardId);
      return { ...card, quantity: entry.quantity };
    }).filter(Boolean);

    const totalCards = mainboardCards.reduce((sum, card) => sum + card.quantity, 0);
    
    // Mana curve
    const manaCurve = {};
    mainboardCards.forEach(card => {
      const cost = Math.min(card.cost, 7); // Cap at 7+
      manaCurve[cost] = (manaCurve[cost] || 0) + card.quantity;
    });

    // Card types
    const cardTypes = {};
    mainboardCards.forEach(card => {
      cardTypes[card.type] = (cardTypes[card.type] || 0) + card.quantity;
    });

    // Elements
    const elements = {};
    mainboardCards.forEach(card => {
      elements[card.element] = (elements[card.element] || 0) + card.quantity;
    });

    // Average cost
    const totalCost = mainboardCards.reduce((sum, card) => sum + (card.cost * card.quantity), 0);
    const averageCost = totalCards > 0 ? (totalCost / totalCards).toFixed(2) : 0;

    // Power level estimation
    const averageMetaScore = mainboardCards.reduce((sum, card) => sum + (card.metaScore * card.quantity), 0) / totalCards;
    
    setDeckStats({
      totalCards,
      manaCurve,
      cardTypes,
      elements,
      averageCost,
      powerLevel: averageMetaScore.toFixed(1),
      consistency: calculateConsistency(mainboardCards),
      speed: calculateSpeed(manaCurve),
      resilience: calculateResilience(mainboardCards)
    });
  };

  const calculateConsistency = (cards) => {
    // Simplified consistency calculation based on card quantities and curve
    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
    const fourOfs = cards.filter(card => card.quantity === 4).length;
    const threeOfs = cards.filter(card => card.quantity === 3).length;
    
    const consistencyScore = (fourOfs * 4 + threeOfs * 3) / totalCards * 100;
    return Math.min(consistencyScore, 100).toFixed(1);
  };

  const calculateSpeed = (manaCurve) => {
    const earlyGame = (manaCurve[0] || 0) + (manaCurve[1] || 0) + (manaCurve[2] || 0);
    const total = Object.values(manaCurve).reduce((sum, count) => sum + count, 0);
    return total > 0 ? ((earlyGame / total) * 100).toFixed(1) : 0;
  };

  const calculateResilience = (cards) => {
    // Count cards with protective abilities or card advantage
    const protectiveCards = cards.filter(card => 
      card.abilities.some(ability => 
        ability.includes('draw') || 
        ability.includes('return') || 
        ability.includes('indestructible') ||
        ability.includes('hexproof')
      )
    );
    const total = cards.reduce((sum, card) => sum + card.quantity, 0);
    return total > 0 ? ((protectiveCards.length / total) * 100).toFixed(1) : 0;
  };

  const validateDeck = () => {
    const validation = {
      isLegal: true,
      errors: [],
      warnings: []
    };

    const totalCards = deck.mainboard.reduce((sum, entry) => sum + entry.quantity, 0);
    
    if (totalCards < 40) {
      validation.isLegal = false;
      validation.errors.push(`Deck must have at least 40 cards (currently ${totalCards})`);
    }

    if (totalCards > 60) {
      validation.warnings.push(`Deck has ${totalCards} cards. Consider reducing to 40-60 for optimal consistency.`);
    }

    // Check for banned cards (mock)
    const bannedCards = [];
    deck.mainboard.forEach(entry => {
      const card = cards.find(c => c.id === entry.cardId);
      if (card && bannedCards.includes(card.name)) {
        validation.isLegal = false;
        validation.errors.push(`${card.name} is banned in ${deck.format}`);
      }
    });

    // Check for card limits
    deck.mainboard.forEach(entry => {
      if (entry.quantity > 4) {
        validation.isLegal = false;
        validation.errors.push(`Cannot have more than 4 copies of a card`);
      }
    });

    setDeckValidation(validation);
  };

  const runMetaAnalysis = async () => {
    // Simulate meta analysis
    const analysis = {
      metaPosition: 'Tier 2',
      favorableMatchups: ['Control Decks', 'Midrange Decks'],
      unfavorableMatchups: ['Fast Aggro', 'Combo Decks'],
      metaShare: 8.5,
      winRate: 62.3,
      popularityTrend: 'rising',
      recommendations: [
        'Strong against current meta control decks',
        'Consider sideboard cards for aggro matchups',
        'Meta is shifting towards faster decks'
      ]
    };
    
    setMetaAnalysis(analysis);
  };

  const addCardToDeck = (card, quantity = 1) => {
    setDeck(prev => {
      const newDeck = { ...prev };
      const existingEntry = newDeck.mainboard.find(entry => entry.cardId === card.id);
      
      if (existingEntry) {
        if (existingEntry.quantity + quantity <= 4) {
          existingEntry.quantity += quantity;
        }
      } else {
        newDeck.mainboard.push({ cardId: card.id, quantity });
      }
      
      newDeck.lastModified = new Date().toISOString();
      return newDeck;
    });
    
    announceToScreenReader(`Added ${card.name} to deck`);
  };

  const removeCardFromDeck = (cardId, quantity = 1) => {
    setDeck(prev => {
      const newDeck = { ...prev };
      const entryIndex = newDeck.mainboard.findIndex(entry => entry.cardId === cardId);
      
      if (entryIndex !== -1) {
        const entry = newDeck.mainboard[entryIndex];
        entry.quantity -= quantity;
        
        if (entry.quantity <= 0) {
          newDeck.mainboard.splice(entryIndex, 1);
        }
      }
      
      newDeck.lastModified = new Date().toISOString();
      return newDeck;
    });
  };

  const startPlaytest = () => {
    const shuffledDeck = [...deck.mainboard]
      .flatMap(entry => Array(entry.quantity).fill(entry.cardId))
      .sort(() => Math.random() - 0.5);
    
    const initialHand = shuffledDeck.slice(0, 7);
    
    setPlaytest({
      hands: [initialHand],
      currentHand: initialHand,
      mulligans: 0,
      turn: 1,
      library: shuffledDeck.slice(7)
    });
    
    setIsPlaytesting(true);
    announceToScreenReader('Playtest started with opening hand');
  };

  const mulligan = () => {
    if (playtest.mulligans < 3) {
      const newHandSize = 7 - playtest.mulligans - 1;
      const shuffledDeck = [...deck.mainboard]
        .flatMap(entry => Array(entry.quantity).fill(entry.cardId))
        .sort(() => Math.random() - 0.5);
      
      const newHand = shuffledDeck.slice(0, newHandSize);
      
      setPlaytest(prev => ({
        ...prev,
        hands: [...prev.hands, newHand],
        currentHand: newHand,
        mulligans: prev.mulligans + 1,
        library: shuffledDeck.slice(newHandSize)
      }));
      
      announceToScreenReader(`Mulligan ${playtest.mulligans + 1}. New hand size: ${newHandSize}`);
    }
  };

  const drawCard = () => {
    if (playtest.library.length > 0) {
      const drawnCard = playtest.library[0];
      setPlaytest(prev => ({
        ...prev,
        currentHand: [...prev.currentHand, drawnCard],
        library: prev.library.slice(1),
        turn: prev.turn + 1
      }));
    }
  };

  const saveDeck = async () => {
    try {
      // Simulate save operation
      const savedDeck = {
        ...deck,
        lastModified: new Date().toISOString()
      };
      
      await cacheManager.set(`deck_${deck.id || Date.now()}`, savedDeck);
      announceToScreenReader('Deck saved successfully');
    } catch (error) {
      console.error('Failed to save deck:', error);
      announceToScreenReader('Failed to save deck');
    }
  };

  const exportDeck = (format) => {
    let exportText = '';
    
    switch (format) {
      case 'arena':
        exportText = deck.mainboard.map(entry => {
          const card = cards.find(c => c.id === entry.cardId);
          return `${entry.quantity} ${card.name}`;
        }).join('\n');
        break;
      case 'cockatrice':
        exportText = `<?xml version="1.0" encoding="UTF-8"?>\n<cockatrice_deck>\n`;
        exportText += `<deckname>${deck.name}</deckname>\n<zone name="main">\n`;
        deck.mainboard.forEach(entry => {
          const card = cards.find(c => c.id === entry.cardId);
          exportText += `<card number="${entry.quantity}" name="${card.name}"/>\n`;
        });
        exportText += `</zone>\n</cockatrice_deck>`;
        break;
      default:
        exportText = JSON.stringify(deck, null, 2);
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render deck visualization
  useEffect(() => {
    if (canvasRef.current && deckStats.manaCurve) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (deckVisualization === 'curve') {
        // Draw mana curve
        const maxCount = Math.max(...Object.values(deckStats.manaCurve));
        const barWidth = canvas.width / 8;
        
        Object.entries(deckStats.manaCurve).forEach(([cost, count], index) => {
          const barHeight = (count / maxCount) * (canvas.height - 40);
          const x = index * barWidth + 10;
          const y = canvas.height - barHeight - 20;
          
          // Draw bar
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(x, y, barWidth - 5, barHeight);
          
          // Draw label
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(cost, x + barWidth / 2, canvas.height - 5);
          ctx.fillText(count, x + barWidth / 2, y - 5);
        });
      }
    }
  }, [deckStats, deckVisualization]);

  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-tertiary rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-tertiary rounded w-32 mx-auto"></div>
          </div>
          <p className="text-muted mt-4">Loading deck builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={deck.name}
                onChange={(e) => setDeck(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold bg-transparent border-none outline-none"
              />
              <select
                value={deck.format}
                onChange={(e) => setDeck(prev => ({ ...prev, format: e.target.value }))}
                className="input"
              >
                <option value="Standard">Standard</option>
                <option value="Legacy">Legacy</option>
                <option value="Draft">Draft</option>
              </select>
              {deckValidation.isLegal ? (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle size={16} />
                  <span className="text-sm">Legal</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">Invalid</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAI(!showAI)}
                className={`btn btn-sm ${showAI ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Brain size={14} />
                AI Assistant
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`btn btn-sm ${showStats ? 'btn-primary' : 'btn-secondary'}`}
              >
                <BarChart3 size={14} />
                Stats
              </button>
              <button
                onClick={startPlaytest}
                className="btn btn-sm btn-secondary"
              >
                <Gamepad2 size={14} />
                Playtest
              </button>
              <button
                onClick={saveDeck}
                className="btn btn-sm btn-primary"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Card Database */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="card mb-6">
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      className="input pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-secondary">
                    <Filter size={16} />
                    Filters
                  </button>
                  <div className="flex border border-color rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-accent-primary text-white' : 'text-muted hover:text-primary'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-accent-primary text-white' : 'text-muted hover:text-primary'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  {['Fire', 'Water', 'Earth', 'Air'].map(element => (
                    <button
                      key={element}
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        // Toggle element filter
                      }}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Grid */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
              {filteredCards.slice(0, 20).map(card => (
                <div
                  key={card.id}
                  className={`${viewMode === 'grid' ? 'card hover:border-accent-primary cursor-pointer' : 'card flex items-center gap-4 hover:border-accent-primary cursor-pointer'}`}
                  onClick={() => setSelectedCard(card)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full aspect-[5/7] object-cover rounded"
                      />
                      <div className="p-2">
                        <div className="font-medium text-sm">{card.name}</div>
                        <div className="text-xs text-muted">{card.cost} • {card.type}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{card.name}</div>
                        <div className="text-sm text-muted">{card.cost} • {card.type} • {card.element}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addCardToDeck(card);
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deck and Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Deck */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Mainboard ({deckStats.totalCards || 0} cards)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSideboard(!showSideboard)}
                      className="btn btn-sm btn-secondary"
                    >
                      Sideboard
                    </button>
                    <button className="btn btn-sm btn-secondary">
                      <Shuffle size={14} />
                      Sort
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                {deck.mainboard.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Start building your deck by adding cards</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deck.mainboard.map(entry => {
                      const card = cards.find(c => c.id === entry.cardId);
                      if (!card) return null;
                      
                      return (
                        <div key={entry.cardId} className="flex items-center gap-3 p-2 hover:bg-tertiary rounded">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-8 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{card.name}</div>
                            <div className="text-sm text-muted">{card.cost} • {card.type}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeCardFromDeck(card.id)}
                              className="btn btn-sm btn-ghost"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-medium">{entry.quantity}</span>
                            <button
                              onClick={() => addCardToDeck(card)}
                              className="btn btn-sm btn-ghost"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Deck Statistics */}
            {showStats && deckStats.totalCards > 0 && (
              <div className="card">
                <div className="p-4 border-b border-color">
                  <h3 className="font-semibold">Deck Statistics</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-primary">{deckStats.averageCost}</div>
                      <div className="text-sm text-muted">Avg. Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{deckStats.powerLevel}</div>
                      <div className="text-sm text-muted">Power Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{deckStats.consistency}%</div>
                      <div className="text-sm text-muted">Consistency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{deckStats.speed}%</div>
                      <div className="text-sm text-muted">Speed</div>
                    </div>
                  </div>
                  
                  {/* Mana Curve Visualization */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Mana Curve</h4>
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={150}
                      className="w-full border border-color rounded"
                    />
                  </div>
                  
                  {/* Validation Messages */}
                  {deckValidation.errors?.length > 0 && (
                    <div className="space-y-1">
                      {deckValidation.errors.map((error, index) => (
                        <div key={index} className="text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle size={12} />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {deckValidation.warnings?.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {deckValidation.warnings.map((warning, index) => (
                        <div key={index} className="text-yellow-400 text-sm flex items-center gap-1">
                          <AlertTriangle size={12} />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Assistant */}
            {showAI && (
              <div className="card">
                <div className="p-4 border-b border-color">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Brain size={16} />
                      AI Assistant
                    </h3>
                    <button
                      onClick={runAIAnalysis}
                      disabled={isAnalyzing}
                      className="btn btn-sm btn-primary"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-color rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            suggestion.priority === 'high' ? 'bg-red-400' :
                            suggestion.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          <span className="font-medium">{suggestion.title}</span>
                        </div>
                        <span className="text-xs text-green-400">{suggestion.impact}</span>
                      </div>
                      <p className="text-sm text-secondary mb-2">{suggestion.description}</p>
                      {suggestion.cards && (
                        <div className="space-y-1">
                          {suggestion.cards.map((card, cardIndex) => (
                            <div key={cardIndex} className="flex items-center justify-between text-xs">
                              <span className="text-accent-primary">{card.name}</span>
                              <button
                                onClick={() => {
                                  const fullCard = cards.find(c => c.name === card.name);
                                  if (fullCard) addCardToDeck(fullCard);
                                }}
                                className="btn btn-xs btn-primary"
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playtest Modal */}
      {isPlaytesting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Playtest - Turn {playtest.turn}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={mulligan}
                    disabled={playtest.mulligans >= 3}
                    className="btn btn-secondary"
                  >
                    Mulligan ({playtest.mulligans}/3)
                  </button>
                  <button
                    onClick={drawCard}
                    className="btn btn-primary"
                  >
                    Draw Card
                  </button>
                  <button
                    onClick={() => setIsPlaytesting(false)}
                    className="btn btn-ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Current Hand ({playtest.currentHand.length} cards)</h3>
                <div className="flex gap-2 overflow-x-auto">
                  {playtest.currentHand.map((cardId, index) => {
                    const card = cards.find(c => c.id === cardId);
                    return (
                      <img
                        key={index}
                        src={card?.image}
                        alt={card?.name}
                        className="w-20 h-28 object-cover rounded flex-shrink-0"
                      />
                    );
                  })}
                </div>
              </div>
              
              <div className="text-sm text-muted">
                Library: {playtest.library?.length || 0} cards remaining
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex gap-6">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-48 h-64 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{selectedCard.name}</h2>
                  <div className="space-y-2 text-sm mb-4">
                    <div>Cost: {selectedCard.cost}</div>
                    <div>Type: {selectedCard.type}</div>
                    <div>Element: {selectedCard.element}</div>
                    <div>Rarity: {selectedCard.rarity}</div>
                    {selectedCard.power && (
                      <div>Power/Toughness: {selectedCard.power}/{selectedCard.toughness}</div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Abilities</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedCard.abilities.map((ability, index) => (
                        <li key={index}>• {ability}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Meta Stats</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted">Meta Score</div>
                        <div className="font-medium">{selectedCard.metaScore}/10</div>
                      </div>
                      <div>
                        <div className="text-muted">Play Rate</div>
                        <div className="font-medium">{selectedCard.playRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted">Win Rate</div>
                        <div className="font-medium">{selectedCard.winRate}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => addCardToDeck(selectedCard)}
                      className="btn btn-primary"
                    >
                      <Plus size={16} />
                      Add to Deck
                    </button>
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedDeckBuilder;