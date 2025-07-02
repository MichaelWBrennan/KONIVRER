import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Deck Archetype Analysis Component
 *
 * This component analyzes deck compositions, identifies archetypes,
 * provides statistical insights, and visualizes meta trends.
 */
const DeckArchetypeAnalysis = ({
  deckData,
  metaData,
  onArchetypeSelect,
  onCardSelect,
  selectedArchetype = null,
  selectedCard = null,
  timeRange = '30d', // '7d', '30d', '90d', 'all'
  format = 'standard', // 'standard', 'modern', 'legacy', 'vintage', 'commander'
  showWinrates = true,
  showTrends = true,
  showCardBreakdown = true,
  showMetaPercentages = true,
}) => {
  const { isAncientTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('archetypes'); // 'archetypes', 'cards', 'meta', 'trends'
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'winrate', 'name', 'change'
  const [sortDirection, setSortDirection] = useState('desc');
  const [filteredArchetypes, setFilteredArchetypes] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedFormat, setSelectedFormat] = useState(format);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [expandedArchetype, setExpandedArchetype] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredArchetype, setHoveredArchetype] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Refs
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Sample deck data for demonstration
  const sampleDeckData = useMemo(
    () => [
      {
        id: 'deck-001',
        name: 'Aggro Burn',
        archetype: 'Aggro',
        subArchetype: 'Burn',
        format: 'standard',
        author: 'player-001',
        authorName: 'Alex Johnson',
        created: '2025-05-15T10:00:00Z',
        updated: '2025-06-10T14:30:00Z',
        cards: [
          {
            id: 'KON006',
            name: 'Lightning Bolt',
            count: 4,
            type: 'Spell',
            rarity: 'Common',
          },
          {
            id: 'KON012',
            name: 'Fire Elemental',
            count: 4,
            type: 'Creature',
            rarity: 'Uncommon',
          },
          {
            id: 'KON018',
            name: 'Volcanic Eruption',
            count: 2,
            type: 'Spell',
            rarity: 'Rare',
          },
          {
            id: 'KON024',
            name: 'Ember Mage',
            count: 4,
            type: 'Creature',
            rarity: 'Uncommon',
          },
          {
            id: 'KON030',
            name: 'Flame Strike',
            count: 3,
            type: 'Spell',
            rarity: 'Uncommon',
          },
          {
            id: 'KON036',
            name: 'Mountain',
            count: 23,
            type: 'Land',
            rarity: 'Common',
          },
        ],
        stats: {
          matches: 120,
          wins: 72,
          losses: 48,
          winrate: 0.6,
          popularity: 0.15,
          metaShare: 0.12,
          previousMetaShare: 0.08,
          change: 0.04,
        },
      },
      {
        id: 'deck-002',
        name: 'Control Blue',
        archetype: 'Control',
        subArchetype: 'Blue Control',
        format: 'standard',
        author: 'player-002',
        authorName: 'Maria Garcia',
        created: '2025-05-20T11:30:00Z',
        updated: '2025-06-12T09:15:00Z',
        cards: [
          {
            id: 'KON007',
            name: 'Counterspell',
            count: 4,
            type: 'Spell',
            rarity: 'Uncommon',
          },
          {
            id: 'KON013',
            name: 'Mystic Scholar',
            count: 3,
            type: 'Creature',
            rarity: 'Rare',
          },
          {
            id: 'KON019',
            name: 'Time Warp',
            count: 2,
            type: 'Spell',
            rarity: 'Mythic',
          },
          {
            id: 'KON025',
            name: 'Mind Control',
            count: 2,
            type: 'Spell',
            rarity: 'Rare',
          },
          {
            id: 'KON031',
            name: 'Divination',
            count: 4,
            type: 'Spell',
            rarity: 'Common',
          },
          {
            id: 'KON037',
            name: 'Island',
            count: 25,
            type: 'Land',
            rarity: 'Common',
          },
        ],
        stats: {
          matches: 150,
          wins: 90,
          losses: 60,
          winrate: 0.6,
          popularity: 0.12,
          metaShare: 0.1,
          previousMetaShare: 0.11,
          change: -0.01,
        },
      },
      {
        id: 'deck-003',
        name: 'Midrange Green',
        archetype: 'Midrange',
        subArchetype: 'Green Stompy',
        format: 'standard',
        author: 'player-003',
        authorName: 'James Wilson',
        created: '2025-05-18T14:45:00Z',
        updated: '2025-06-15T16:20:00Z',
        cards: [
          {
            id: 'KON008',
            name: 'Giant Growth',
            count: 4,
            type: 'Spell',
            rarity: 'Common',
          },
          {
            id: 'KON014',
            name: 'Ancient Guardian',
            count: 3,
            type: 'Creature',
            rarity: 'Mythic',
          },
          {
            id: 'KON020',
            name: 'Verdant Force',
            count: 2,
            type: 'Creature',
            rarity: 'Rare',
          },
          {
            id: 'KON026',
            name: 'Elvish Mystic',
            count: 4,
            type: 'Creature',
            rarity: 'Common',
          },
          {
            id: 'KON032',
            name: 'Natural Order',
            count: 2,
            type: 'Spell',
            rarity: 'Rare',
          },
          {
            id: 'KON038',
            name: 'Forest',
            count: 25,
            type: 'Land',
            rarity: 'Common',
          },
        ],
        stats: {
          matches: 130,
          wins: 71,
          losses: 59,
          winrate: 0.546,
          popularity: 0.1,
          metaShare: 0.09,
          previousMetaShare: 0.07,
          change: 0.02,
        },
      },
      {
        id: 'deck-004',
        name: 'Combo Elves',
        archetype: 'Combo',
        subArchetype: 'Elf Combo',
        format: 'standard',
        author: 'player-004',
        authorName: 'Sarah Chen',
        created: '2025-05-22T09:10:00Z',
        updated: '2025-06-18T11:45:00Z',
        cards: [
          {
            id: 'KON009',
            name: 'Elvish Archdruid',
            count: 4,
            type: 'Creature',
            rarity: 'Rare',
          },
          {
            id: 'KON015',
            name: 'Glimpse of Nature',
            count: 4,
            type: 'Spell',
            rarity: 'Rare',
          },
          {
            id: 'KON021',
            name: 'Wirewood Symbiote',
            count: 4,
            type: 'Creature',
            rarity: 'Uncommon',
          },
          {
            id: 'KON027',
            name: 'Heritage Druid',
            count: 4,
            type: 'Creature',
            rarity: 'Uncommon',
          },
          {
            id: 'KON033',
            name: 'Craterhoof Behemoth',
            count: 1,
            type: 'Creature',
            rarity: 'Mythic',
          },
          {
            id: 'KON038',
            name: 'Forest',
            count: 23,
            type: 'Land',
            rarity: 'Common',
          },
        ],
        stats: {
          matches: 100,
          wins: 65,
          losses: 35,
          winrate: 0.65,
          popularity: 0.08,
          metaShare: 0.07,
          previousMetaShare: 0.04,
          change: 0.03,
        },
      },
      {
        id: 'deck-005',
        name: 'Aggro White Weenie',
        archetype: 'Aggro',
        subArchetype: 'White Weenie',
        format: 'standard',
        author: 'player-005',
        authorName: 'David Kim',
        created: '2025-05-25T16:30:00Z',
        updated: '2025-06-20T10:15:00Z',
        cards: [
          {
            id: 'KON010',
            name: 'Elite Vanguard',
            count: 4,
            type: 'Creature',
            rarity: 'Common',
          },
          {
            id: 'KON016',
            name: 'Honor of the Pure',
            count: 4,
            type: 'Spell',
            rarity: 'Rare',
          },
          {
            id: 'KON022',
            name: 'Knight of the White Orchid',
            count: 4,
            type: 'Creature',
            rarity: 'Rare',
          },
          {
            id: 'KON028',
            name: 'Path to Exile',
            count: 4,
            type: 'Spell',
            rarity: 'Uncommon',
          },
          {
            id: 'KON034',
            name: 'Brave the Elements',
            count: 3,
            type: 'Spell',
            rarity: 'Common',
          },
          {
            id: 'KON039',
            name: 'Plains',
            count: 21,
            type: 'Land',
            rarity: 'Common',
          },
        ],
        stats: {
          matches: 110,
          wins: 60,
          losses: 50,
          winrate: 0.545,
          popularity: 0.09,
          metaShare: 0.08,
          previousMetaShare: 0.09,
          change: -0.01,
        },
      },
    ],
    [],
  );

  // Sample meta data for demonstration
  const sampleMetaData = useMemo(
    () => ({
      format: 'standard',
      lastUpdated: '2025-06-22T08:00:00Z',
      totalMatches: 5000,
      totalDecks: 1200,
      archetypes: [
        {
          name: 'Aggro',
          metaShare: 0.35,
          previousMetaShare: 0.32,
          change: 0.03,
          winrate: 0.52,
          subArchetypes: [
            {
              name: 'Burn',
              metaShare: 0.12,
              previousMetaShare: 0.08,
              change: 0.04,
              winrate: 0.6,
            },
            {
              name: 'White Weenie',
              metaShare: 0.08,
              previousMetaShare: 0.09,
              change: -0.01,
              winrate: 0.545,
            },
            {
              name: 'Red Deck Wins',
              metaShare: 0.09,
              previousMetaShare: 0.1,
              change: -0.01,
              winrate: 0.48,
            },
            {
              name: 'Other Aggro',
              metaShare: 0.06,
              previousMetaShare: 0.05,
              change: 0.01,
              winrate: 0.5,
            },
          ],
        },
        {
          name: 'Control',
          metaShare: 0.25,
          previousMetaShare: 0.28,
          change: -0.03,
          winrate: 0.55,
          subArchetypes: [
            {
              name: 'Blue Control',
              metaShare: 0.1,
              previousMetaShare: 0.11,
              change: -0.01,
              winrate: 0.6,
            },
            {
              name: 'Azorius Control',
              metaShare: 0.08,
              previousMetaShare: 0.09,
              change: -0.01,
              winrate: 0.53,
            },
            {
              name: 'Black Control',
              metaShare: 0.05,
              previousMetaShare: 0.06,
              change: -0.01,
              winrate: 0.51,
            },
            {
              name: 'Other Control',
              metaShare: 0.02,
              previousMetaShare: 0.02,
              change: 0,
              winrate: 0.5,
            },
          ],
        },
        {
          name: 'Midrange',
          metaShare: 0.2,
          previousMetaShare: 0.18,
          change: 0.02,
          winrate: 0.54,
          subArchetypes: [
            {
              name: 'Green Stompy',
              metaShare: 0.09,
              previousMetaShare: 0.07,
              change: 0.02,
              winrate: 0.546,
            },
            {
              name: 'Jund Midrange',
              metaShare: 0.06,
              previousMetaShare: 0.06,
              change: 0,
              winrate: 0.55,
            },
            {
              name: 'Abzan Midrange',
              metaShare: 0.03,
              previousMetaShare: 0.03,
              change: 0,
              winrate: 0.52,
            },
            {
              name: 'Other Midrange',
              metaShare: 0.02,
              previousMetaShare: 0.02,
              change: 0,
              winrate: 0.53,
            },
          ],
        },
        {
          name: 'Combo',
          metaShare: 0.15,
          previousMetaShare: 0.12,
          change: 0.03,
          winrate: 0.58,
          subArchetypes: [
            {
              name: 'Elf Combo',
              metaShare: 0.07,
              previousMetaShare: 0.04,
              change: 0.03,
              winrate: 0.65,
            },
            {
              name: 'Storm Combo',
              metaShare: 0.04,
              previousMetaShare: 0.04,
              change: 0,
              winrate: 0.55,
            },
            {
              name: 'Reanimator',
              metaShare: 0.03,
              previousMetaShare: 0.03,
              change: 0,
              winrate: 0.52,
            },
            {
              name: 'Other Combo',
              metaShare: 0.01,
              previousMetaShare: 0.01,
              change: 0,
              winrate: 0.5,
            },
          ],
        },
        {
          name: 'Other',
          metaShare: 0.05,
          previousMetaShare: 0.1,
          change: -0.05,
          winrate: 0.45,
          subArchetypes: [
            {
              name: 'Rogue Decks',
              metaShare: 0.03,
              previousMetaShare: 0.06,
              change: -0.03,
              winrate: 0.47,
            },
            {
              name: 'Experimental',
              metaShare: 0.02,
              previousMetaShare: 0.04,
              change: -0.02,
              winrate: 0.42,
            },
          ],
        },
      ],
      topCards: [
        {
          id: 'KON006',
          name: 'Lightning Bolt',
          usage: 0.25,
          previousUsage: 0.22,
          change: 0.03,
          winrate: 0.55,
        },
        {
          id: 'KON007',
          name: 'Counterspell',
          usage: 0.2,
          previousUsage: 0.21,
          change: -0.01,
          winrate: 0.58,
        },
        {
          id: 'KON008',
          name: 'Giant Growth',
          usage: 0.18,
          previousUsage: 0.15,
          change: 0.03,
          winrate: 0.53,
        },
        {
          id: 'KON028',
          name: 'Path to Exile',
          usage: 0.17,
          previousUsage: 0.18,
          change: -0.01,
          winrate: 0.54,
        },
        {
          id: 'KON015',
          name: 'Glimpse of Nature',
          usage: 0.15,
          previousUsage: 0.1,
          change: 0.05,
          winrate: 0.62,
        },
      ],
      matchups: [
        { archetype1: 'Aggro', archetype2: 'Control', winrate: 0.45 },
        { archetype1: 'Aggro', archetype2: 'Midrange', winrate: 0.55 },
        { archetype1: 'Aggro', archetype2: 'Combo', winrate: 0.6 },
        { archetype1: 'Control', archetype2: 'Midrange', winrate: 0.52 },
        { archetype1: 'Control', archetype2: 'Combo', winrate: 0.58 },
        { archetype1: 'Midrange', archetype2: 'Combo', winrate: 0.48 },
      ],
      trends: [
        {
          date: '2025-05-22',
          archetypes: [
            { name: 'Aggro', metaShare: 0.32 },
            { name: 'Control', metaShare: 0.28 },
            { name: 'Midrange', metaShare: 0.18 },
            { name: 'Combo', metaShare: 0.12 },
            { name: 'Other', metaShare: 0.1 },
          ],
        },
        {
          date: '2025-05-29',
          archetypes: [
            { name: 'Aggro', metaShare: 0.33 },
            { name: 'Control', metaShare: 0.27 },
            { name: 'Midrange', metaShare: 0.19 },
            { name: 'Combo', metaShare: 0.13 },
            { name: 'Other', metaShare: 0.08 },
          ],
        },
        {
          date: '2025-06-05',
          archetypes: [
            { name: 'Aggro', metaShare: 0.34 },
            { name: 'Control', metaShare: 0.26 },
            { name: 'Midrange', metaShare: 0.19 },
            { name: 'Combo', metaShare: 0.14 },
            { name: 'Other', metaShare: 0.07 },
          ],
        },
        {
          date: '2025-06-12',
          archetypes: [
            { name: 'Aggro', metaShare: 0.34 },
            { name: 'Control', metaShare: 0.25 },
            { name: 'Midrange', metaShare: 0.2 },
            { name: 'Combo', metaShare: 0.15 },
            { name: 'Other', metaShare: 0.06 },
          ],
        },
        {
          date: '2025-06-19',
          archetypes: [
            { name: 'Aggro', metaShare: 0.35 },
            { name: 'Control', metaShare: 0.25 },
            { name: 'Midrange', metaShare: 0.2 },
            { name: 'Combo', metaShare: 0.15 },
            { name: 'Other', metaShare: 0.05 },
          ],
        },
      ],
    }),
    [],
  );

  // Use sample data if no data is provided
  const decks = deckData || sampleDeckData;
  const meta = metaData || sampleMetaData;

  // Initialize data
  useEffect(() => {
    loadData();
  }, [decks, meta, selectedTimeRange, selectedFormat]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, we would fetch data from an API
      // For this demo, we'll use the sample data

      // Filter archetypes
      const archetypes = meta.archetypes.map(archetype => ({
        ...archetype,
        decks: decks.filter(deck => deck.archetype === archetype.name),
      }));

      setFilteredArchetypes(archetypes);

      // Filter cards
      const allCards = decks.flatMap(deck => deck.cards);
      const uniqueCards = Array.from(
        new Set(allCards.map(card => card.id)),
      ).map(id => {
        const card = allCards.find(card => card.id === id);
        const usage = allCards.filter(c => c.id === id).length / decks.length;
        const topCard = meta.topCards.find(c => c.id === id);

        return {
          ...card,
          usage,
          previousUsage: topCard?.previousUsage || usage * 0.9,
          change: topCard?.change || usage * 0.1,
          winrate: topCard?.winrate || 0.5,
        };
      });

      setFilteredCards(uniqueCards);

      // Prepare chart data
      prepareChartData();

      setIsLoading(false);
    } catch (err) {
      setError(
        `Failed to load data: ${err instanceof Error ? err.message : String(err)}`,
      );
      setIsLoading(false);
    }
  }, [decks, meta, selectedTimeRange, selectedFormat]);

  // Prepare chart data
  const prepareChartData = useCallback(() => {
    // In a real implementation, we would prepare chart data based on the meta data
    // For this demo, we'll use the sample data

    const trendData = {
      labels: meta.trends.map(trend => trend.date),
      datasets: meta.archetypes.map((archetype, index) => ({
        label: archetype.name,
        data: meta.trends.map(trend => {
          const archetypeData = trend.archetypes.find(
            a => a.name === archetype.name,
          );
          return archetypeData ? archetypeData.metaShare * 100 : 0;
        }),
        borderColor: getArchetypeColor(archetype.name, index),
        backgroundColor: getArchetypeColor(archetype.name, index, 0.2),
        fill: true,
      })),
    };

    setChartData(trendData);
  }, [meta]);

  // Get archetype color
  const getArchetypeColor = useCallback((archetypeName, index, alpha = 1) => {
    const colors = {
      Aggro: `rgba(255, 99, 132, ${alpha})`,
      Control: `rgba(54, 162, 235, ${alpha})`,
      Midrange: `rgba(75, 192, 192, ${alpha})`,
      Combo: `rgba(153, 102, 255, ${alpha})`,
      Other: `rgba(201, 203, 207, ${alpha})`,
    };

    return (
      colors[archetypeName] ||
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${alpha})`
    );
  }, []);

  // Handle search
  const handleSearch = useCallback(
    e => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      if (activeTab === 'archetypes') {
        const filtered = meta.archetypes
          .filter(
            archetype =>
              archetype.name.toLowerCase().includes(query) ||
              archetype.subArchetypes.some(sub =>
                sub.name.toLowerCase().includes(query),
              ),
          )
          .map(archetype => ({
            ...archetype,
            decks: decks.filter(deck => deck.archetype === archetype.name),
          }));

        setFilteredArchetypes(filtered);
      } else if (activeTab === 'cards') {
        const allCards = decks.flatMap(deck => deck.cards);
        const uniqueCards = Array.from(new Set(allCards.map(card => card.id)))
          .map(id => {
            const card = allCards.find(card => card.id === id);
            const usage =
              allCards.filter(c => c.id === id).length / decks.length;
            const topCard = meta.topCards.find(c => c.id === id);

            return {
              ...card,
              usage,
              previousUsage: topCard?.previousUsage || usage * 0.9,
              change: topCard?.change || usage * 0.1,
              winrate: topCard?.winrate || 0.5,
            };
          })
          .filter(card => card.name.toLowerCase().includes(query));

        setFilteredCards(uniqueCards);
      }
    },
    [activeTab, meta.archetypes, meta.topCards, decks],
  );

  // Handle sort
  const handleSort = useCallback(
    field => {
      if (sortBy === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortDirection('desc');
      }
    },
    [sortBy],
  );

  // Sort archetypes
  const sortedArchetypes = useMemo(() => {
    if (!filteredArchetypes.length) return [];

    return [...filteredArchetypes].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'popularity':
          valueA = a.metaShare;
          valueB = b.metaShare;
          break;
        case 'winrate':
          valueA = a.winrate;
          valueB = b.winrate;
          break;
        case 'change':
          valueA = a.change;
          valueB = b.change;
          break;
        default:
          valueA = a.metaShare;
          valueB = b.metaShare;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [filteredArchetypes, sortBy, sortDirection]);

  // Sort cards
  const sortedCards = useMemo(() => {
    if (!filteredCards.length) return [];

    return [...filteredCards].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'popularity':
          valueA = a.usage;
          valueB = b.usage;
          break;
        case 'winrate':
          valueA = a.winrate;
          valueB = b.winrate;
          break;
        case 'change':
          valueA = a.change;
          valueB = b.change;
          break;
        default:
          valueA = a.usage;
          valueB = b.usage;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [filteredCards, sortBy, sortDirection]);

  // Handle archetype click
  const handleArchetypeClick = useCallback(
    archetype => {
      setExpandedArchetype(prev =>
        prev === archetype.name ? null : archetype.name,
      );

      if (onArchetypeSelect) {
        onArchetypeSelect(archetype);
      }
    },
    [onArchetypeSelect],
  );

  // Handle card click
  const handleCardClick = useCallback(
    card => {
      setExpandedCard(prev => (prev === card.id ? null : card.id));

      if (onCardSelect) {
        onCardSelect(card);
      }
    },
    [onCardSelect],
  );

  // Format percentage
  const formatPercentage = useCallback(value => {
    return `${(value * 100).toFixed(1)}%`;
  }, []);

  // Get change class
  const getChangeClass = useCallback(change => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }, []);

  // Get winrate class
  const getWinrateClass = useCallback(winrate => {
    if (winrate > 0.55) return 'positive';
    if (winrate < 0.45) return 'negative';
    return 'neutral';
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div
        className={`deck-archetype-analysis ${isAncientTheme ? 'ancient-theme' : ''}`}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading archetype data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className={`deck-archetype-analysis ${isAncientTheme ? 'ancient-theme' : ''}`}
      >
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`deck-archetype-analysis ${isAncientTheme ? 'ancient-theme' : ''}`}
    >
      <h2>Deck Archetype Analysis</h2>

      <div className="analysis-header">
        <div className="meta-info">
          <div className="meta-format">
            Format:
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="legacy">Legacy</option>
              <option value="vintage">Vintage</option>
              <option value="commander">Commander</option>
            </select>
          </div>

          <div className="meta-time-range">
            Time Range:
            <select
              value={selectedTimeRange}
              onChange={e => setSelectedTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="meta-last-updated">
            Last Updated: {new Date(meta.lastUpdated).toLocaleString()}
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'archetypes' ? 'archetypes' : 'cards'}...`}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="analysis-tabs">
        <button
          className={`tab-button ${activeTab === 'archetypes' ? 'active' : ''}`}
          onClick={() => setActiveTab('archetypes')}
        >
          Archetypes
        </button>

        <button
          className={`tab-button ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </button>

        <button
          className={`tab-button ${activeTab === 'meta' ? 'active' : ''}`}
          onClick={() => setActiveTab('meta')}
        >
          Meta Breakdown
        </button>

        <button
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      <div className="analysis-content">
        {activeTab === 'archetypes' && (
          <div className="archetypes-tab">
            <div className="table-header">
              <div
                className={`header-cell name ${sortBy === 'name' ? 'sorted' : ''}`}
                onClick={() => handleSort('name')}
              >
                Archetype
                {sortBy === 'name' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>

              {showMetaPercentages && (
                <div
                  className={`header-cell popularity ${sortBy === 'popularity' ? 'sorted' : ''}`}
                  onClick={() => handleSort('popularity')}
                >
                  Meta %
                  {sortBy === 'popularity' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}

              {showWinrates && (
                <div
                  className={`header-cell winrate ${sortBy === 'winrate' ? 'sorted' : ''}`}
                  onClick={() => handleSort('winrate')}
                >
                  Winrate
                  {sortBy === 'winrate' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}

              {showTrends && (
                <div
                  className={`header-cell change ${sortBy === 'change' ? 'sorted' : ''}`}
                  onClick={() => handleSort('change')}
                >
                  Change
                  {sortBy === 'change' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="table-body">
              {sortedArchetypes.length === 0 ? (
                <div className="no-results">No archetypes found</div>
              ) : (
                sortedArchetypes.map(archetype => (
                  <div key={archetype.name}>
                    <div
                      className={`table-row ${expandedArchetype === archetype.name ? 'expanded' : ''} ${selectedArchetype === archetype.name ? 'selected' : ''} ${hoveredArchetype === archetype.name ? 'hovered' : ''}`}
                      onClick={() => handleArchetypeClick(archetype)}
                      onMouseEnter={() => setHoveredArchetype(archetype.name)}
                      onMouseLeave={() => setHoveredArchetype(null)}
                    >
                      <div className="cell name">
                        <div
                          className="archetype-color"
                          style={{
                            backgroundColor: getArchetypeColor(
                              archetype.name,
                              sortedArchetypes.indexOf(archetype),
                            ),
                          }}
                        ></div>
                        <span>{archetype.name}</span>
                        <span className="expand-indicator">
                          {expandedArchetype === archetype.name ? '▼' : '►'}
                        </span>
                      </div>

                      {showMetaPercentages && (
                        <div className="cell popularity">
                          {formatPercentage(archetype.metaShare)}
                        </div>
                      )}

                      {showWinrates && (
                        <div
                          className={`cell winrate ${getWinrateClass(archetype.winrate)}`}
                        >
                          {formatPercentage(archetype.winrate)}
                        </div>
                      )}

                      {showTrends && (
                        <div
                          className={`cell change ${getChangeClass(archetype.change)}`}
                        >
                          {archetype.change > 0 ? '+' : ''}
                          {formatPercentage(archetype.change)}
                        </div>
                      )}
                    </div>

                    {expandedArchetype === archetype.name && (
                      <div className="archetype-details">
                        <div className="sub-archetypes">
                          <h4>Sub-Archetypes</h4>
                          <div className="sub-table">
                            <div className="sub-header">
                              <div className="sub-cell name">Name</div>
                              {showMetaPercentages && (
                                <div className="sub-cell popularity">
                                  Meta %
                                </div>
                              )}
                              {showWinrates && (
                                <div className="sub-cell winrate">Winrate</div>
                              )}
                              {showTrends && (
                                <div className="sub-cell change">Change</div>
                              )}
                            </div>

                            {archetype.subArchetypes.map(subArchetype => (
                              <div className="sub-row" key={subArchetype.name}>
                                <div className="sub-cell name">
                                  {subArchetype.name}
                                </div>
                                {showMetaPercentages && (
                                  <div className="sub-cell popularity">
                                    {formatPercentage(subArchetype.metaShare)}
                                  </div>
                                )}
                                {showWinrates && (
                                  <div
                                    className={`sub-cell winrate ${getWinrateClass(subArchetype.winrate)}`}
                                  >
                                    {formatPercentage(subArchetype.winrate)}
                                  </div>
                                )}
                                {showTrends && (
                                  <div
                                    className={`sub-cell change ${getChangeClass(subArchetype.change)}`}
                                  >
                                    {subArchetype.change > 0 ? '+' : ''}
                                    {formatPercentage(subArchetype.change)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {showCardBreakdown && (
                          <div className="popular-cards">
                            <h4>Popular Cards</h4>
                            <div className="cards-grid">
                              {archetype.decks
                                .flatMap(deck => deck.cards)
                                .reduce((acc, card) => {
                                  const existing = acc.find(
                                    c => c.id === card.id,
                                  );
                                  if (existing) {
                                    existing.count += card.count;
                                    existing.decks += 1;
                                  } else {
                                    acc.push({ ...card, decks: 1 });
                                  }
                                  return acc;
                                }, [])
                                .sort((a, b) => b.decks - a.decks)
                                .slice(0, 10)
                                .map(card => (
                                  <div className="card-item" key={card.id}>
                                    <div className="card-name">{card.name}</div>
                                    <div className="card-usage">
                                      {Math.round(
                                        (card.decks / archetype.decks.length) *
                                          100,
                                      )}
                                      % of decks
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="matchups">
                          <h4>Matchups</h4>
                          <div className="matchups-grid">
                            {meta.matchups
                              .filter(
                                matchup =>
                                  matchup.archetype1 === archetype.name ||
                                  matchup.archetype2 === archetype.name,
                              )
                              .map((matchup, index) => {
                                const isArchetype1 =
                                  matchup.archetype1 === archetype.name;
                                const otherArchetype = isArchetype1
                                  ? matchup.archetype2
                                  : matchup.archetype1;
                                const winrate = isArchetype1
                                  ? matchup.winrate
                                  : 1 - matchup.winrate;

                                return (
                                  <div className="matchup-item" key={index}>
                                    <div className="matchup-vs">
                                      vs. {otherArchetype}
                                    </div>
                                    <div
                                      className={`matchup-winrate ${getWinrateClass(winrate)}`}
                                    >
                                      {formatPercentage(winrate)}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="cards-tab">
            <div className="table-header">
              <div
                className={`header-cell name ${sortBy === 'name' ? 'sorted' : ''}`}
                onClick={() => handleSort('name')}
              >
                Card
                {sortBy === 'name' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>

              {showMetaPercentages && (
                <div
                  className={`header-cell popularity ${sortBy === 'popularity' ? 'sorted' : ''}`}
                  onClick={() => handleSort('popularity')}
                >
                  Usage %
                  {sortBy === 'popularity' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}

              {showWinrates && (
                <div
                  className={`header-cell winrate ${sortBy === 'winrate' ? 'sorted' : ''}`}
                  onClick={() => handleSort('winrate')}
                >
                  Winrate
                  {sortBy === 'winrate' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}

              {showTrends && (
                <div
                  className={`header-cell change ${sortBy === 'change' ? 'sorted' : ''}`}
                  onClick={() => handleSort('change')}
                >
                  Change
                  {sortBy === 'change' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="table-body">
              {sortedCards.length === 0 ? (
                <div className="no-results">No cards found</div>
              ) : (
                sortedCards.map(card => (
                  <div key={card.id}>
                    <div
                      className={`table-row ${expandedCard === card.id ? 'expanded' : ''} ${selectedCard === card.id ? 'selected' : ''} ${hoveredCard === card.id ? 'hovered' : ''}`}
                      onClick={() => handleCardClick(card)}
                      onMouseEnter={() => setHoveredCard(card.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="cell name">
                        <div
                          className={`card-type-icon ${card.type.toLowerCase()}`}
                        ></div>
                        <span>{card.name}</span>
                        <span className="card-rarity">{card.rarity}</span>
                        <span className="expand-indicator">
                          {expandedCard === card.id ? '▼' : '►'}
                        </span>
                      </div>

                      {showMetaPercentages && (
                        <div className="cell popularity">
                          {formatPercentage(card.usage)}
                        </div>
                      )}

                      {showWinrates && (
                        <div
                          className={`cell winrate ${getWinrateClass(card.winrate)}`}
                        >
                          {formatPercentage(card.winrate)}
                        </div>
                      )}

                      {showTrends && (
                        <div
                          className={`cell change ${getChangeClass(card.change)}`}
                        >
                          {card.change > 0 ? '+' : ''}
                          {formatPercentage(card.change)}
                        </div>
                      )}
                    </div>

                    {expandedCard === card.id && (
                      <div className="card-details">
                        <div className="card-archetypes">
                          <h4>Used In Archetypes</h4>
                          <div className="archetypes-grid">
                            {meta.archetypes
                              .map(archetype => {
                                const archetypeDecks = decks.filter(
                                  deck => deck.archetype === archetype.name,
                                );
                                const decksWithCard = archetypeDecks.filter(
                                  deck =>
                                    deck.cards.some(c => c.id === card.id),
                                );
                                const usage =
                                  decksWithCard.length / archetypeDecks.length;

                                if (usage > 0) {
                                  return (
                                    <div
                                      className="archetype-item"
                                      key={archetype.name}
                                    >
                                      <div className="archetype-name">
                                        {archetype.name}
                                      </div>
                                      <div className="archetype-usage">
                                        {formatPercentage(usage)}
                                      </div>
                                    </div>
                                  );
                                }

                                return null;
                              })
                              .filter(Boolean)}
                          </div>
                        </div>

                        <div className="card-synergies">
                          <h4>Card Synergies</h4>
                          <div className="synergies-grid">
                            {decks
                              .filter(deck =>
                                deck.cards.some(c => c.id === card.id),
                              )
                              .flatMap(deck => deck.cards)
                              .filter(c => c.id !== card.id)
                              .reduce((acc, c) => {
                                const existing = acc.find(
                                  item => item.id === c.id,
                                );
                                if (existing) {
                                  existing.count += c.count;
                                } else {
                                  acc.push({ ...c });
                                }
                                return acc;
                              }, [])
                              .sort((a, b) => b.count - a.count)
                              .slice(0, 5)
                              .map(synergy => (
                                <div className="synergy-item" key={synergy.id}>
                                  <div className="synergy-name">
                                    {synergy.name}
                                  </div>
                                  <div className="synergy-strength">
                                    <div
                                      className="synergy-bar"
                                      style={{
                                        width: `${Math.min(100, synergy.count * 5)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="meta-tab">
            <div className="meta-overview">
              <div className="meta-stat">
                <div className="stat-label">Total Matches</div>
                <div className="stat-value">
                  {meta.totalMatches.toLocaleString()}
                </div>
              </div>

              <div className="meta-stat">
                <div className="stat-label">Total Decks</div>
                <div className="stat-value">
                  {meta.totalDecks.toLocaleString()}
                </div>
              </div>

              <div className="meta-stat">
                <div className="stat-label">Top Archetype</div>
                <div className="stat-value">
                  {
                    meta.archetypes.sort((a, b) => b.metaShare - a.metaShare)[0]
                      .name
                  }
                </div>
              </div>

              <div className="meta-stat">
                <div className="stat-label">Top Card</div>
                <div className="stat-value">
                  {meta.topCards.sort((a, b) => b.usage - a.usage)[0].name}
                </div>
              </div>
            </div>

            <div className="meta-charts">
              <div className="meta-chart">
                <h4>Archetype Distribution</h4>
                <div className="pie-chart">
                  <div className="pie-segments">
                    {meta.archetypes.map((archetype, index) => (
                      <div
                        key={archetype.name}
                        className="pie-segment"
                        style={{
                          backgroundColor: getArchetypeColor(
                            archetype.name,
                            index,
                          ),
                          transform: `rotate(${index === 0 ? 0 : meta.archetypes.slice(0, index).reduce((sum, a) => sum + a.metaShare, 0) * 360}deg)`,
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((meta.archetypes.slice(0, index + 1).reduce((sum, a) => sum + a.metaShare, 0) - meta.archetypes.slice(0, index).reduce((sum, a) => sum + a.metaShare, 0)) * Math.PI * 2)}% ${50 + 50 * Math.sin((meta.archetypes.slice(0, index + 1).reduce((sum, a) => sum + a.metaShare, 0) - meta.archetypes.slice(0, index).reduce((sum, a) => sum + a.metaShare, 0)) * Math.PI * 2)}%, 50% 50%)`,
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="pie-legend">
                    {meta.archetypes.map((archetype, index) => (
                      <div className="legend-item" key={archetype.name}>
                        <div
                          className="legend-color"
                          style={{
                            backgroundColor: getArchetypeColor(
                              archetype.name,
                              index,
                            ),
                          }}
                        ></div>
                        <div className="legend-label">{archetype.name}</div>
                        <div className="legend-value">
                          {formatPercentage(archetype.metaShare)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="meta-chart">
                <h4>Matchup Matrix</h4>
                <div className="matchup-matrix">
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        {meta.archetypes.map(archetype => (
                          <th key={archetype.name}>{archetype.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {meta.archetypes.map(archetype1 => (
                        <tr key={archetype1.name}>
                          <th>{archetype1.name}</th>
                          {meta.archetypes.map(archetype2 => {
                            if (archetype1.name === archetype2.name) {
                              return (
                                <td
                                  key={archetype2.name}
                                  className="matchup-cell same"
                                >
                                  -
                                </td>
                              );
                            }

                            const matchup = meta.matchups.find(
                              m =>
                                (m.archetype1 === archetype1.name &&
                                  m.archetype2 === archetype2.name) ||
                                (m.archetype1 === archetype2.name &&
                                  m.archetype2 === archetype1.name),
                            );

                            if (!matchup) {
                              return (
                                <td
                                  key={archetype2.name}
                                  className="matchup-cell"
                                >
                                  N/A
                                </td>
                              );
                            }

                            const winrate =
                              matchup.archetype1 === archetype1.name
                                ? matchup.winrate
                                : 1 - matchup.winrate;

                            return (
                              <td
                                key={archetype2.name}
                                className={`matchup-cell ${getWinrateClass(winrate)}`}
                              >
                                {formatPercentage(winrate)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="trends-tab">
            <div className="trends-chart">
              <h4>Meta Evolution</h4>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <div className="chart-lines">
                    {meta.trends.map((trend, index) => (
                      <div
                        key={index}
                        className="chart-line"
                        style={{
                          left: `${(index / (meta.trends.length - 1)) * 100}%`,
                        }}
                      >
                        <div className="chart-date">{trend.date}</div>
                      </div>
                    ))}
                  </div>

                  <div className="chart-areas">
                    {meta.archetypes.map((archetype, archetypeIndex) => {
                      const points = meta.trends.map((trend, trendIndex) => {
                        const archetypeData = trend.archetypes.find(
                          a => a.name === archetype.name,
                        );
                        const metaShare = archetypeData
                          ? archetypeData.metaShare
                          : 0;
                        const previousArchetypes = meta.archetypes.slice(
                          0,
                          archetypeIndex,
                        );
                        const previousMetaShare = trend.archetypes
                          .filter(a =>
                            previousArchetypes.some(pa => pa.name === a.name),
                          )
                          .reduce((sum, a) => sum + a.metaShare, 0);

                        return {
                          x: (trendIndex / (meta.trends.length - 1)) * 100,
                          y1: previousMetaShare * 100,
                          y2: (previousMetaShare + metaShare) * 100,
                        };
                      });

                      const pathD = `M${points[0].x},${points[0].y2} ${points.map(p => `L${p.x},${p.y2}`).join(' ')} L${points[points.length - 1].x},${points[points.length - 1].y1} ${points
                        .reverse()
                        .map(p => `L${p.x},${p.y1}`)
                        .join(' ')} Z`;

                      return (
                        <svg
                          key={archetype.name}
                          className="chart-area"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={pathD}
                            fill={getArchetypeColor(
                              archetype.name,
                              archetypeIndex,
                              0.7,
                            )}
                          />
                        </svg>
                      );
                    })}
                  </div>

                  <div className="chart-legend">
                    {meta.archetypes.map((archetype, index) => (
                      <div className="legend-item" key={archetype.name}>
                        <div
                          className="legend-color"
                          style={{
                            backgroundColor: getArchetypeColor(
                              archetype.name,
                              index,
                            ),
                          }}
                        ></div>
                        <div className="legend-label">{archetype.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="trends-highlights">
              <h4>Meta Highlights</h4>

              <div className="highlights-grid">
                <div className="highlight-card">
                  <div className="highlight-title">Biggest Gainer</div>
                  <div className="highlight-content">
                    {(() => {
                      const archetype = [...meta.archetypes].sort(
                        (a, b) => b.change - a.change,
                      )[0];
                      return (
                        <>
                          <div className="highlight-name">{archetype.name}</div>
                          <div className={`highlight-value positive`}>
                            +{formatPercentage(archetype.change)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-title">Biggest Decliner</div>
                  <div className="highlight-content">
                    {(() => {
                      const archetype = [...meta.archetypes].sort(
                        (a, b) => a.change - b.change,
                      )[0];
                      return (
                        <>
                          <div className="highlight-name">{archetype.name}</div>
                          <div className={`highlight-value negative`}>
                            {formatPercentage(archetype.change)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-title">Highest Winrate</div>
                  <div className="highlight-content">
                    {(() => {
                      const archetype = [...meta.archetypes].sort(
                        (a, b) => b.winrate - a.winrate,
                      )[0];
                      return (
                        <>
                          <div className="highlight-name">{archetype.name}</div>
                          <div className={`highlight-value positive`}>
                            {formatPercentage(archetype.winrate)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-title">Rising Card</div>
                  <div className="highlight-content">
                    {(() => {
                      const card = [...meta.topCards].sort(
                        (a, b) => b.change - a.change,
                      )[0];
                      return (
                        <>
                          <div className="highlight-name">{card.name}</div>
                          <div className={`highlight-value positive`}>
                            +{formatPercentage(card.change)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .deck-archetype-analysis {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          width: 100%;
        }

        h2,
        h3,
        h4 {
          margin-top: 0;
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }

        .analysis-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 15px;
        }

        .meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .meta-format,
        .meta-time-range {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .meta-format select,
        .meta-time-range select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }

        .search-container {
          flex: 1;
          max-width: 300px;
        }

        .search-container input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }

        .analysis-tabs {
          display: flex;
          border-bottom: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          margin-bottom: 20px;
        }

        .tab-button {
          padding: 10px 15px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          cursor: pointer;
          font-weight: 500;
          transition: border-color 0.3s;
        }

        .tab-button.active {
          border-bottom-color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }

        .table-header {
          display: flex;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 10px 15px;
          border-radius: 8px 8px 0 0;
          font-weight: bold;
        }

        .header-cell {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .header-cell.sorted {
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }

        .header-cell.name {
          flex: 2;
        }

        .header-cell.popularity,
        .header-cell.winrate,
        .header-cell.change {
          flex: 1;
          text-align: center;
          justify-content: center;
        }

        .table-body {
          border: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          border-top: none;
          border-radius: 0 0 8px 8px;
          overflow: hidden;
        }

        .table-row {
          display: flex;
          padding: 12px 15px;
          border-bottom: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
        }

        .table-row.expanded {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
        }

        .table-row.selected {
          background-color: ${isAncientTheme ? '#4a4a35' : '#e3f2fd'};
        }

        .cell {
          display: flex;
          align-items: center;
        }

        .cell.name {
          flex: 2;
          gap: 10px;
        }

        .cell.popularity,
        .cell.winrate,
        .cell.change {
          flex: 1;
          justify-content: center;
        }

        .archetype-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .card-type-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .card-type-icon.creature {
          background-color: #4caf50;
        }

        .card-type-icon.spell {
          background-color: #2196f3;
        }

        .card-type-icon.land {
          background-color: #795548;
        }

        .card-type-icon.artifact {
          background-color: #9e9e9e;
        }

        .card-rarity {
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-left: auto;
          margin-right: 10px;
        }

        .expand-indicator {
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }

        .positive {
          color: var(--color-success);
        }

        .negative {
          color: var(--color-error);
        }

        .neutral {
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }

        .archetype-details,
        .card-details {
          padding: 15px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-bottom: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .sub-archetypes,
        .card-archetypes {
          grid-column: 1;
        }

        .popular-cards,
        .card-synergies {
          grid-column: 2;
        }

        .matchups {
          grid-column: 1 / 3;
        }

        .sub-table {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 8px;
          overflow: hidden;
        }

        .sub-header {
          display: flex;
          background-color: ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          padding: 8px 12px;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .sub-cell {
          flex: 1;
        }

        .sub-cell.name {
          flex: 2;
        }

        .sub-row {
          display: flex;
          padding: 8px 12px;
          border-bottom: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          font-size: 0.9rem;
        }

        .sub-row:last-child {
          border-bottom: none;
        }

        .cards-grid,
        .archetypes-grid,
        .matchups-grid,
        .synergies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .card-item,
        .archetype-item,
        .matchup-item,
        .synergy-item {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .card-name,
        .archetype-name,
        .matchup-vs,
        .synergy-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .card-usage,
        .archetype-usage {
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }

        .matchup-winrate {
          font-weight: bold;
        }

        .synergy-strength {
          height: 8px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          border-radius: 4px;
          overflow: hidden;
          margin-top: 5px;
        }

        .synergy-bar {
          height: 100%;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          border-radius: 4px;
        }

        .no-results {
          padding: 20px;
          text-align: center;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }

        .meta-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .meta-stat {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-label {
          font-size: 0.9rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .meta-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .meta-chart {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 15px;
          border-radius: 8px;
        }

        .pie-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .pie-segments {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
        }

        .pie-segment {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform-origin: 50% 50%;
        }

        .pie-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-label {
          font-size: 0.9rem;
        }

        .legend-value {
          font-size: 0.9rem;
          font-weight: bold;
          margin-left: 5px;
        }

        .matchup-matrix {
          overflow-x: auto;
        }

        .matchup-matrix table {
          width: 100%;
          border-collapse: collapse;
        }

        .matchup-matrix th,
        .matchup-matrix td {
          padding: 8px;
          text-align: center;
          border: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
        }

        .matchup-matrix th {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          font-weight: bold;
        }

        .matchup-cell.same {
          background-color: ${isAncientTheme ? '#2c2b20' : '#f5f5f5'};
        }

        .trends-chart {
          margin-bottom: 20px;
        }

        .chart-container {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 15px;
          border-radius: 8px;
        }

        .chart-placeholder {
          position: relative;
          height: 300px;
          width: 100%;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 8px;
          overflow: hidden;
        }

        .chart-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .chart-line {
          position: absolute;
          top: 0;
          height: 100%;
          width: 1px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
        }

        .chart-date {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          white-space: nowrap;
        }

        .chart-areas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .chart-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .chart-legend {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: ${isAncientTheme
            ? 'rgba(44, 43, 32, 0.8)'
            : 'rgba(255, 255, 255, 0.8)'};
          padding: 10px;
          border-radius: 8px;
          z-index: 2;
        }

        .trends-highlights {
          margin-top: 20px;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .highlight-card {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          padding: 15px;
          border-radius: 8px;
        }

        .highlight-title {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .highlight-content {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          padding: 10px;
          border-radius: 8px;
        }

        .highlight-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .highlight-value {
          font-size: 1.2rem;
          font-weight: bold;
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
          to {
            transform: rotate(360deg);
          }
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

        .ancient-theme h2,
        .ancient-theme h3,
        .ancient-theme h4 {
          font-family: 'Cinzel', serif;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .analysis-header {
            flex-direction: column;
          }

          .search-container {
            max-width: 100%;
          }

          .archetype-details,
          .card-details {
            grid-template-columns: 1fr;
          }

          .sub-archetypes,
          .popular-cards,
          .card-archetypes,
          .card-synergies,
          .matchups {
            grid-column: 1;
          }

          .meta-charts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(DeckArchetypeAnalysis);
