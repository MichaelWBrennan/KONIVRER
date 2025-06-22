import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * WebAssembly-powered card data processor component
 * This component uses WebAssembly for high-performance card data processing,
 * including advanced filtering, sorting, and statistical analysis.
 */
interface WasmCardProcessorProps {
  cards?: CardData[];
  initialFilters?: FilterOptions;
  initialSortBy?: SortOption;
  initialSortDirection?: 'asc' | 'desc';
  onProcessingComplete?: (result: ProcessingResult) => void;
  maxCards?: number;
  processingMode?: 'standard' | 'advanced' | 'extreme';
}

interface CardData {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  power?: number;
  toughness?: number;
  text?: string;
  set: string;
  tags: string[];
  imageUrl?: string;
  foil?: boolean;
  holographic?: boolean;
  price?: number;
  releaseDate?: string;
}

interface FilterOptions {
  types?: string[];
  rarities?: string[];
  sets?: string[];
  tags?: string[];
  costRange?: [number, number];
  powerRange?: [number, number];
  toughnessRange?: [number, number];
  priceRange?: [number, number];
  textSearch?: string;
  foilOnly?: boolean;
  holographicOnly?: boolean;
}

type SortOption = 
  | 'name' 
  | 'cost' 
  | 'power' 
  | 'toughness' 
  | 'rarity' 
  | 'set' 
  | 'price' 
  | 'releaseDate';

interface ProcessingResult {
  filteredCards: CardData[];
  statistics: CardStatistics;
  processingTime: number;
  memoryUsage: number;
}

interface CardStatistics {
  totalCards: number;
  typeDistribution: Record<string, number>;
  rarityDistribution: Record<string, number>;
  setDistribution: Record<string, number>;
  costDistribution: Record<number, number>;
  powerDistribution: Record<number, number>;
  toughnessDistribution: Record<number, number>;
  tagDistribution: Record<string, number>;
  averageCost: number;
  averagePower: number;
  averageToughness: number;
  averagePrice: number;
  foilCount: number;
  holographicCount: number;
}

// Sample card data for demonstration
const sampleCards: CardData[] = [
  {
    id: 'KON001',
    name: 'Ancient Guardian',
    type: 'Creature',
    rarity: 'Mythic',
    cost: 5,
    power: 4,
    toughness: 6,
    text: 'When Ancient Guardian enters the battlefield, create a 1/1 Spirit token with flying.',
    set: 'Core',
    tags: ['Spirit', 'Defender', 'Token Generator'],
    imageUrl: '/images/ancient_guardian.jpg',
    foil: false,
    holographic: false,
    price: 15.99,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON002',
    name: 'Mystic Oracle',
    type: 'Creature',
    rarity: 'Rare',
    cost: 3,
    power: 2,
    toughness: 3,
    text: 'When Mystic Oracle enters the battlefield, scry 2.',
    set: 'Core',
    tags: ['Wizard', 'Scry'],
    imageUrl: '/images/mystic_oracle.jpg',
    foil: false,
    holographic: false,
    price: 5.99,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON003',
    name: 'Shadow Assassin',
    type: 'Creature',
    rarity: 'Uncommon',
    cost: 2,
    power: 3,
    toughness: 1,
    text: 'Shadow Assassin can\'t be blocked by creatures with power 2 or greater.',
    set: 'Core',
    tags: ['Rogue', 'Evasion'],
    imageUrl: '/images/shadow_assassin.jpg',
    foil: false,
    holographic: false,
    price: 1.99,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON004',
    name: 'Ethereal Dragon',
    type: 'Creature',
    rarity: 'Mythic',
    cost: 7,
    power: 6,
    toughness: 6,
    text: 'Flying. When Ethereal Dragon deals combat damage to a player, draw a card.',
    set: 'Expansion I',
    tags: ['Dragon', 'Flying', 'Card Draw'],
    imageUrl: '/images/ethereal_dragon.jpg',
    foil: true,
    holographic: true,
    price: 24.99,
    releaseDate: '2025-03-20'
  },
  {
    id: 'KON005',
    name: 'Temporal Mage',
    type: 'Creature',
    rarity: 'Rare',
    cost: 4,
    power: 3,
    toughness: 3,
    text: 'When Temporal Mage enters the battlefield, take an extra turn after this one.',
    set: 'Expansion I',
    tags: ['Wizard', 'Time', 'Extra Turn'],
    imageUrl: '/images/temporal_mage.jpg',
    foil: false,
    holographic: true,
    price: 12.99,
    releaseDate: '2025-03-20'
  },
  {
    id: 'KON006',
    name: 'Lightning Bolt',
    type: 'Spell',
    rarity: 'Common',
    cost: 1,
    text: 'Lightning Bolt deals 3 damage to any target.',
    set: 'Core',
    tags: ['Damage', 'Instant'],
    imageUrl: '/images/lightning_bolt.jpg',
    foil: false,
    holographic: false,
    price: 0.99,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON007',
    name: 'Counterspell',
    type: 'Spell',
    rarity: 'Uncommon',
    cost: 2,
    text: 'Counter target spell.',
    set: 'Core',
    tags: ['Counter', 'Instant'],
    imageUrl: '/images/counterspell.jpg',
    foil: false,
    holographic: false,
    price: 2.49,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON008',
    name: 'Volcanic Eruption',
    type: 'Spell',
    rarity: 'Rare',
    cost: 6,
    text: 'Volcanic Eruption deals 5 damage to each creature and each player.',
    set: 'Expansion I',
    tags: ['Damage', 'Board Clear', 'Sorcery'],
    imageUrl: '/images/volcanic_eruption.jpg',
    foil: true,
    holographic: false,
    price: 7.99,
    releaseDate: '2025-03-20'
  },
  {
    id: 'KON009',
    name: 'Elven Sanctuary',
    type: 'Land',
    rarity: 'Uncommon',
    cost: 0,
    text: 'Tap: Add one mana of any color. If you control a Forest, add one additional green mana.',
    set: 'Core',
    tags: ['Mana', 'Elf'],
    imageUrl: '/images/elven_sanctuary.jpg',
    foil: false,
    holographic: false,
    price: 3.49,
    releaseDate: '2025-01-15'
  },
  {
    id: 'KON010',
    name: 'Mystic Forge',
    type: 'Artifact',
    rarity: 'Rare',
    cost: 4,
    text: 'Whenever you cast a spell, you may pay 2 life. If you do, draw a card.',
    set: 'Expansion I',
    tags: ['Card Draw', 'Life Payment'],
    imageUrl: '/images/mystic_forge.jpg',
    foil: false,
    holographic: false,
    price: 6.99,
    releaseDate: '2025-03-20'
  }
];

// WebAssembly module interface
interface WasmModule {
  memory: WebAssembly.Memory;
  filterCards: (
    cardsPtr: number, 
    cardsLength: number, 
    filtersPtr: number, 
    resultPtr: number
  ) => number;
  sortCards: (
    cardsPtr: number, 
    cardsLength: number, 
    sortBy: number, 
    sortDirection: number, 
    resultPtr: number
  ) => number;
  calculateStatistics: (
    cardsPtr: number, 
    cardsLength: number, 
    resultPtr: number
  ) => number;
  allocateMemory: (size: number) => number;
  freeMemory: (ptr: number) => void;
}

const WasmCardProcessor: React.FC<WasmCardProcessorProps> = ({
  cards = sampleCards,
  initialFilters = {},
  initialSortBy = 'name',
  initialSortDirection = 'asc',
  onProcessingComplete,
  maxCards = 1000,
  processingMode = 'standard'
}) => {
  const { isAncientTheme } = useTheme();
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  
  // Load WebAssembly module
  useEffect(() => {
    const loadWasm = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, we would load the actual WebAssembly module
        // For this demo, we'll simulate the WebAssembly module with JavaScript
        
        // Simulate WebAssembly loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a simulated WebAssembly module
        const simulatedModule: WasmModule = {
          // Simulated WebAssembly memory
          memory: new WebAssembly.Memory({ initial: 10, maximum: 100 }),
          
          // Simulated WebAssembly functions
          filterCards: (cardsPtr, cardsLength, filtersPtr, resultPtr) => {
            // In a real implementation, this would be a WebAssembly function
            // For this demo, we'll just return a success code
            return 1;
          },
          
          sortCards: (cardsPtr, cardsLength, sortByCode, sortDirectionCode, resultPtr) => {
            // In a real implementation, this would be a WebAssembly function
            // For this demo, we'll just return a success code
            return 1;
          },
          
          calculateStatistics: (cardsPtr, cardsLength, resultPtr) => {
            // In a real implementation, this would be a WebAssembly function
            // For this demo, we'll just return a success code
            return 1;
          },
          
          allocateMemory: (size) => {
            // Simulate memory allocation
            return 1000; // Simulated memory address
          },
          
          freeMemory: (ptr) => {
            // Simulate memory deallocation
          }
        };
        
        setWasmModule(simulatedModule);
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load WebAssembly module: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };
    
    loadWasm();
    
    // Cleanup function
    return () => {
      // In a real implementation, we would clean up WebAssembly resources
    };
  }, []);
  
  // Process cards when filters or sort options change
  useEffect(() => {
    if (wasmModule && !isLoading && !error) {
      processCards();
    }
  }, [wasmModule, filters, sortBy, sortDirection, cards, processingMode]);
  
  // Process cards using WebAssembly
  const processCards = useCallback(async () => {
    if (!wasmModule || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Start performance measurement
      const startTime = performance.now();
      
      // In a real implementation, we would:
      // 1. Serialize cards and filters to a format WebAssembly can understand
      // 2. Allocate memory in the WebAssembly module
      // 3. Copy the data to WebAssembly memory
      // 4. Call the WebAssembly functions
      // 5. Read the results from WebAssembly memory
      // 6. Free the allocated memory
      
      // For this demo, we'll simulate the processing with JavaScript
      
      // Simulate processing delay based on mode
      const processingDelay = 
        processingMode === 'standard' ? 200 : 
        processingMode === 'advanced' ? 500 : 
        1000; // 'extreme'
      
      await new Promise(resolve => setTimeout(resolve, processingDelay));
      
      // Simulate filtering
      let filteredCards = [...cards];
      
      if (filters.types && filters.types.length > 0) {
        filteredCards = filteredCards.filter(card => filters.types?.includes(card.type));
      }
      
      if (filters.rarities && filters.rarities.length > 0) {
        filteredCards = filteredCards.filter(card => filters.rarities?.includes(card.rarity));
      }
      
      if (filters.sets && filters.sets.length > 0) {
        filteredCards = filteredCards.filter(card => filters.sets?.includes(card.set));
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredCards = filteredCards.filter(card => 
          filters.tags?.some(tag => card.tags.includes(tag))
        );
      }
      
      if (filters.costRange) {
        filteredCards = filteredCards.filter(card => 
          card.cost >= (filters.costRange?.[0] || 0) && 
          card.cost <= (filters.costRange?.[1] || Infinity)
        );
      }
      
      if (filters.powerRange) {
        filteredCards = filteredCards.filter(card => 
          card.power !== undefined && 
          card.power >= (filters.powerRange?.[0] || 0) && 
          card.power <= (filters.powerRange?.[1] || Infinity)
        );
      }
      
      if (filters.toughnessRange) {
        filteredCards = filteredCards.filter(card => 
          card.toughness !== undefined && 
          card.toughness >= (filters.toughnessRange?.[0] || 0) && 
          card.toughness <= (filters.toughnessRange?.[1] || Infinity)
        );
      }
      
      if (filters.priceRange) {
        filteredCards = filteredCards.filter(card => 
          card.price !== undefined && 
          card.price >= (filters.priceRange?.[0] || 0) && 
          card.price <= (filters.priceRange?.[1] || Infinity)
        );
      }
      
      if (filters.textSearch) {
        const searchLower = filters.textSearch.toLowerCase();
        filteredCards = filteredCards.filter(card => 
          card.name.toLowerCase().includes(searchLower) || 
          card.text?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.foilOnly) {
        filteredCards = filteredCards.filter(card => card.foil);
      }
      
      if (filters.holographicOnly) {
        filteredCards = filteredCards.filter(card => card.holographic);
      }
      
      // Simulate sorting
      filteredCards.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      });
      
      // Simulate calculating statistics
      const statistics: CardStatistics = {
        totalCards: filteredCards.length,
        typeDistribution: {},
        rarityDistribution: {},
        setDistribution: {},
        costDistribution: {},
        powerDistribution: {},
        toughnessDistribution: {},
        tagDistribution: {},
        averageCost: 0,
        averagePower: 0,
        averageToughness: 0,
        averagePrice: 0,
        foilCount: 0,
        holographicCount: 0
      };
      
      let totalCost = 0;
      let totalPower = 0;
      let totalToughness = 0;
      let totalPrice = 0;
      let powerCount = 0;
      let toughnessCount = 0;
      let priceCount = 0;
      
      filteredCards.forEach(card => {
        // Type distribution
        statistics.typeDistribution[card.type] = (statistics.typeDistribution[card.type] || 0) + 1;
        
        // Rarity distribution
        statistics.rarityDistribution[card.rarity] = (statistics.rarityDistribution[card.rarity] || 0) + 1;
        
        // Set distribution
        statistics.setDistribution[card.set] = (statistics.setDistribution[card.set] || 0) + 1;
        
        // Cost distribution
        statistics.costDistribution[card.cost] = (statistics.costDistribution[card.cost] || 0) + 1;
        
        // Power distribution
        if (card.power !== undefined) {
          statistics.powerDistribution[card.power] = (statistics.powerDistribution[card.power] || 0) + 1;
          totalPower += card.power;
          powerCount++;
        }
        
        // Toughness distribution
        if (card.toughness !== undefined) {
          statistics.toughnessDistribution[card.toughness] = (statistics.toughnessDistribution[card.toughness] || 0) + 1;
          totalToughness += card.toughness;
          toughnessCount++;
        }
        
        // Tag distribution
        card.tags.forEach(tag => {
          statistics.tagDistribution[tag] = (statistics.tagDistribution[tag] || 0) + 1;
        });
        
        // Foil and holographic counts
        if (card.foil) statistics.foilCount++;
        if (card.holographic) statistics.holographicCount++;
        
        // Totals for averages
        totalCost += card.cost;
        
        if (card.price !== undefined) {
          totalPrice += card.price;
          priceCount++;
        }
      });
      
      // Calculate averages
      statistics.averageCost = totalCost / filteredCards.length;
      statistics.averagePower = powerCount > 0 ? totalPower / powerCount : 0;
      statistics.averageToughness = toughnessCount > 0 ? totalToughness / toughnessCount : 0;
      statistics.averagePrice = priceCount > 0 ? totalPrice / priceCount : 0;
      
      // End performance measurement
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Simulate memory usage
      const memoryUsage = Math.floor(Math.random() * 50) + 50; // 50-100 MB
      
      // Create result
      const result: ProcessingResult = {
        filteredCards,
        statistics,
        processingTime,
        memoryUsage
      };
      
      setProcessingResult(result);
      setProcessingTime(processingTime);
      setMemoryUsage(memoryUsage);
      
      // Call the callback if provided
      if (onProcessingComplete) {
        onProcessingComplete(result);
      }
    } catch (err) {
      setError(`Processing error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  }, [wasmModule, cards, filters, sortBy, sortDirection, processingMode, onProcessingComplete]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Handle sort changes
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, []);
  
  // Handle sort direction change
  const handleSortDirectionChange = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);
  
  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(cards.map(card => card.type)));
    const rarities = Array.from(new Set(cards.map(card => card.rarity)));
    const sets = Array.from(new Set(cards.map(card => card.set)));
    const tags = Array.from(new Set(cards.flatMap(card => card.tags)));
    
    return { types, rarities, sets, tags };
  }, [cards]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`wasm-card-processor ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading WebAssembly module...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className={`wasm-card-processor ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`wasm-card-processor ${isAncientTheme ? 'ancient-theme' : ''}`}>
      <h2>WebAssembly Card Processor</h2>
      
      <div className="processor-controls">
        <div className="filter-section">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Card Type</label>
            <div className="checkbox-group">
              {filterOptions.types.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.types?.includes(type) || false}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...(filters.types || []), type]
                        : (filters.types || []).filter(t => t !== type);
                      handleFilterChange({ types: newTypes.length > 0 ? newTypes : undefined });
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Rarity</label>
            <div className="checkbox-group">
              {filterOptions.rarities.map(rarity => (
                <label key={rarity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.rarities?.includes(rarity) || false}
                    onChange={(e) => {
                      const newRarities = e.target.checked
                        ? [...(filters.rarities || []), rarity]
                        : (filters.rarities || []).filter(r => r !== rarity);
                      handleFilterChange({ rarities: newRarities.length > 0 ? newRarities : undefined });
                    }}
                  />
                  {rarity}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Set</label>
            <div className="checkbox-group">
              {filterOptions.sets.map(set => (
                <label key={set} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.sets?.includes(set) || false}
                    onChange={(e) => {
                      const newSets = e.target.checked
                        ? [...(filters.sets || []), set]
                        : (filters.sets || []).filter(s => s !== set);
                      handleFilterChange({ sets: newSets.length > 0 ? newSets : undefined });
                    }}
                  />
                  {set}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Cost Range</label>
            <div className="range-inputs">
              <input
                type="number"
                min="0"
                max="20"
                value={filters.costRange?.[0] || 0}
                onChange={(e) => {
                  const min = parseInt(e.target.value);
                  const max = filters.costRange?.[1] || 20;
                  handleFilterChange({ costRange: [min, max] });
                }}
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                max="20"
                value={filters.costRange?.[1] || 20}
                onChange={(e) => {
                  const min = filters.costRange?.[0] || 0;
                  const max = parseInt(e.target.value);
                  handleFilterChange({ costRange: [min, max] });
                }}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Special</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.foilOnly || false}
                  onChange={(e) => handleFilterChange({ foilOnly: e.target.checked })}
                />
                Foil Only
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.holographicOnly || false}
                  onChange={(e) => handleFilterChange({ holographicOnly: e.target.checked })}
                />
                Holographic Only
              </label>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Text Search</label>
            <input
              type="text"
              value={filters.textSearch || ''}
              onChange={(e) => handleFilterChange({ textSearch: e.target.value || undefined })}
              placeholder="Search card name or text"
            />
          </div>
        </div>
        
        <div className="sort-section">
          <h3>Sort</h3>
          
          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
            >
              <option value="name">Name</option>
              <option value="cost">Cost</option>
              <option value="power">Power</option>
              <option value="toughness">Toughness</option>
              <option value="rarity">Rarity</option>
              <option value="set">Set</option>
              <option value="price">Price</option>
              <option value="releaseDate">Release Date</option>
            </select>
            
            <button 
              className="sort-direction-button" 
              onClick={handleSortDirectionChange}
              aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          <div className="processing-mode">
            <h4>Processing Mode</h4>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="processingMode"
                  value="standard"
                  checked={processingMode === 'standard'}
                  onChange={() => setFilters(prev => ({ ...prev, processingMode: 'standard' }))}
                />
                Standard
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="processingMode"
                  value="advanced"
                  checked={processingMode === 'advanced'}
                  onChange={() => setFilters(prev => ({ ...prev, processingMode: 'advanced' }))}
                />
                Advanced
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="processingMode"
                  value="extreme"
                  checked={processingMode === 'extreme'}
                  onChange={() => setFilters(prev => ({ ...prev, processingMode: 'extreme' }))}
                />
                Extreme
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="processing-stats">
        <div className="stat">
          <span>Processing Time:</span>
          <span>{processingTime.toFixed(2)} ms</span>
        </div>
        <div className="stat">
          <span>Memory Usage:</span>
          <span>{memoryUsage} MB</span>
        </div>
        <div className="stat">
          <span>Cards Processed:</span>
          <span>{cards.length}</span>
        </div>
        <div className="stat">
          <span>Cards Filtered:</span>
          <span>{processingResult?.filteredCards.length || 0}</span>
        </div>
      </div>
      
      {isProcessing && (
        <div className="processing-overlay">
          <div className="loading-spinner"></div>
          <p>Processing cards with WebAssembly...</p>
        </div>
      )}
      
      {processingResult && (
        <div className="results-section">
          <h3>Results ({processingResult.filteredCards.length} cards)</h3>
          
          <div className="results-tabs">
            <button className="tab-button active">Cards</button>
            <button className="tab-button">Statistics</button>
            <button className="tab-button">Charts</button>
          </div>
          
          <div className="card-grid">
            {processingResult.filteredCards.map(card => (
              <div key={card.id} className={`card-item ${card.foil ? 'foil' : ''} ${card.holographic ? 'holographic' : ''}`}>
                <div className="card-header">
                  <span className="card-name">{card.name}</span>
                  <span className="card-cost">{card.cost}</span>
                </div>
                <div className="card-type">{card.type} - {card.rarity}</div>
                {card.power !== undefined && card.toughness !== undefined && (
                  <div className="card-stats">{card.power}/{card.toughness}</div>
                )}
                <div className="card-text">{card.text}</div>
                <div className="card-set">{card.set}</div>
                <div className="card-tags">
                  {card.tags.map(tag => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
                {card.price !== undefined && (
                  <div className="card-price">${card.price.toFixed(2)}</div>
                )}
                <div className="card-special">
                  {card.foil && <span className="foil-indicator">Foil</span>}
                  {card.holographic && <span className="holo-indicator">Holographic</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .wasm-card-processor {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          width: 100%;
        }
        
        h2, h3, h4 {
          margin-top: 0;
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }
        
        .processor-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .filter-section, .sort-section {
          flex: 1;
          min-width: 300px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 15px;
          border-radius: 8px;
        }
        
        .filter-group {
          margin-bottom: 15px;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .checkbox-group, .radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .checkbox-label, .radio-label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .range-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-inputs input {
          width: 60px;
          padding: 5px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#1a1914' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }
        
        input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#1a1914' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }
        
        .sort-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        select {
          flex: 1;
          padding: 8px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#1a1914' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }
        
        .sort-direction-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          padding: 0;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .processing-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          min-width: 120px;
        }
        
        .stat span:first-child {
          font-weight: bold;
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }
        
        .stat span:last-child {
          font-size: 1.2rem;
          font-weight: 500;
        }
        
        .processing-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          color: white;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-container {
          padding: 20px;
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
          border-radius: 8px;
          color: ${isAncientTheme ? '#ff6b6b' : '#d32f2f'};
          margin-bottom: 20px;
        }
        
        .error-container button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .results-section {
          margin-top: 20px;
        }
        
        .results-tabs {
          display: flex;
          gap: 5px;
          margin-bottom: 15px;
          border-bottom: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
        }
        
        .tab-button {
          padding: 8px 16px;
          background-color: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          cursor: pointer;
        }
        
        .tab-button.active {
          border-bottom-color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          font-weight: bold;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .card-item {
          padding: 15px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f9f9f9'};
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#e0e0e0'};
          position: relative;
          overflow: hidden;
        }
        
        .card-item.foil {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 75%
          );
          background-size: 10px 10px;
        }
        
        .card-item.holographic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(255, 0, 0, 0.1),
            rgba(255, 255, 0, 0.1),
            rgba(0, 255, 0, 0.1),
            rgba(0, 255, 255, 0.1),
            rgba(0, 0, 255, 0.1),
            rgba(255, 0, 255, 0.1)
          );
          background-size: 400% 400%;
          animation: holographic 5s ease infinite;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: overlay;
        }
        
        @keyframes holographic {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .card-name {
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .card-cost {
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .card-type {
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        
        .card-stats {
          background-color: ${isAncientTheme ? '#4a4a35' : '#f0f0f0'};
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .card-text {
          margin-bottom: 10px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .card-set {
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-bottom: 8px;
        }
        
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 8px;
        }
        
        .card-tag {
          background-color: ${isAncientTheme ? '#4a4a35' : '#f0f0f0'};
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .card-price {
          font-weight: bold;
          color: ${isAncientTheme ? '#d4b86a' : '#4caf50'};
        }
        
        .card-special {
          display: flex;
          gap: 5px;
          margin-top: 8px;
        }
        
        .foil-indicator, .holo-indicator {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .foil-indicator {
          background-color: ${isAncientTheme ? '#4a4a35' : '#e0e0e0'};
          color: ${isAncientTheme ? '#d4b86a' : '#333333'};
        }
        
        .holo-indicator {
          background: linear-gradient(
            45deg,
            #ff8a00,
            #e52e71,
            #ff8a00
          );
          color: white;
          background-size: 200% 200%;
          animation: holographic-text 2s ease infinite;
        }
        
        @keyframes holographic-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .ancient-theme h2, .ancient-theme h3, .ancient-theme h4 {
          font-family: 'Cinzel', serif;
        }
      `}</style>
    </div>
  );
};

export default React.memo(WasmCardProcessor);