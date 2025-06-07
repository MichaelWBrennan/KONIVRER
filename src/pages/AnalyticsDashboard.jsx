import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Trophy,
  Target,
  Zap,
  Clock,
  Calendar,
  Filter,
  Download,
  Share2,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Database,
  Cpu,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Award,
  Gamepad2,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Moon,
  Sparkles,
  Brain,
  Robot,
  ChartBar,
  ChartLine,
  ChartPie,
  BarChart,
  ScatterChart,
  Radar,
  Map,
  Globe,
  MapPin,
  Navigation,
  Compass
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PerformanceMonitor, CacheManager } from '../utils/modernFeatures';

const AnalyticsDashboard = () => {
  const { user, wsManager } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState(['winRate', 'gamesPlayed', 'deckPerformance']);
  const [dashboardLayout, setDashboardLayout] = useState('grid');
  const [isRealTime, setIsRealTime] = useState(true);
  const [filters, setFilters] = useState({
    format: 'all',
    deckType: 'all',
    opponent: 'all',
    timeOfDay: 'all'
  });
  
  // Analytics data
  const [playerStats, setPlayerStats] = useState({});
  const [deckAnalytics, setDeckAnalytics] = useState([]);
  const [metaAnalysis, setMetaAnalysis] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [predictiveInsights, setPredictiveInsights] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [userBehavior, setUserBehavior] = useState({});
  const [aiRecommendations, setAiRecommendations] = useState([]);
  
  // Visualization refs
  const winRateChartRef = useRef(null);
  const deckPerformanceRef = useRef(null);
  const metaDistributionRef = useRef(null);
  const timelineChartRef = useRef(null);
  const heatmapRef = useRef(null);
  const radarChartRef = useRef(null);
  
  // Real-time data
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 0,
    gamesInProgress: 0,
    tournamentsLive: 0,
    streamViewers: 0
  });
  
  const cacheManager = useMemo(() => new CacheManager(), []);

  useEffect(() => {
    initializeAnalytics();
    setupRealTimeUpdates();
    
    return () => {
      if (wsManager) {
        wsManager.send('unsubscribe_analytics', { userId: user?.id });
      }
    };
  }, [timeRange, filters]);

  const initializeAnalytics = async () => {
    try {
      // Performance monitoring
      PerformanceMonitor.measureUserTiming('analytics_load', async () => {
        await loadAnalyticsData();
      });
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  };

  const loadAnalyticsData = async () => {
    // Load cached data first for instant display
    const cachedData = await cacheManager.getOrFetch('analytics_data', async () => {
      return generateMockAnalyticsData();
    }, 300000); // 5 minutes cache

    setPlayerStats(cachedData.playerStats);
    setDeckAnalytics(cachedData.deckAnalytics);
    setMetaAnalysis(cachedData.metaAnalysis);
    setPerformanceMetrics(cachedData.performanceMetrics);
    setPredictiveInsights(cachedData.predictiveInsights);
    setCompetitorAnalysis(cachedData.competitorAnalysis);
    setMarketTrends(cachedData.marketTrends);
    setUserBehavior(cachedData.userBehavior);
    setAiRecommendations(cachedData.aiRecommendations);

    // Render charts
    renderCharts();
  };

  const generateMockAnalyticsData = () => {
    const now = new Date();
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    // Generate time series data
    const timeSeriesData = Array.from({ length: days * 24 }, (_, i) => {
      const date = new Date(now.getTime() - (days * 24 - i) * 60 * 60 * 1000);
      return {
        timestamp: date.toISOString(),
        winRate: 45 + Math.random() * 30 + Math.sin(i / 12) * 10,
        gamesPlayed: Math.floor(Math.random() * 20) + 5,
        averageGameLength: 8 + Math.random() * 12,
        deckPerformance: Math.random() * 100
      };
    });

    return {
      playerStats: {
        totalGames: 1247,
        wins: 789,
        losses: 458,
        winRate: 63.3,
        averageGameLength: 12.5,
        favoriteFormat: 'Standard',
        mostPlayedDeck: 'Elemental Storm',
        currentStreak: 7,
        longestStreak: 15,
        rankProgress: {
          current: 'Diamond 2',
          next: 'Diamond 1',
          progress: 75
        },
        weeklyProgress: {
          gamesPlayed: 45,
          winRate: 68.9,
          change: '+5.6%'
        }
      },
      deckAnalytics: [
        {
          name: 'Elemental Storm',
          games: 234,
          wins: 156,
          winRate: 66.7,
          averageTurns: 8.5,
          metaShare: 12.3,
          trend: 'up',
          elements: ['Fire', 'Air'],
          cost: 'Budget',
          difficulty: 'Medium'
        },
        {
          name: 'Control Master',
          games: 189,
          wins: 98,
          winRate: 51.9,
          averageTurns: 15.2,
          metaShare: 8.7,
          trend: 'down',
          elements: ['Water', 'Earth'],
          cost: 'Expensive',
          difficulty: 'Hard'
        },
        {
          name: 'Aggro Rush',
          games: 156,
          wins: 112,
          winRate: 71.8,
          averageTurns: 6.3,
          metaShare: 15.6,
          trend: 'up',
          elements: ['Fire'],
          cost: 'Budget',
          difficulty: 'Easy'
        }
      ],
      metaAnalysis: {
        topDecks: [
          { name: 'Elemental Storm', share: 12.3, winRate: 64.2, trend: 'up' },
          { name: 'Aggro Rush', share: 15.6, winRate: 58.9, trend: 'up' },
          { name: 'Control Master', share: 8.7, winRate: 52.1, trend: 'down' },
          { name: 'Combo Burst', share: 6.4, winRate: 61.3, trend: 'stable' }
        ],
        elementDistribution: {
          Fire: 28.5,
          Water: 22.1,
          Earth: 19.8,
          Air: 18.3,
          Neutral: 11.3
        },
        formatPopularity: {
          Standard: 45.2,
          Legacy: 28.7,
          Draft: 16.8,
          Casual: 9.3
        }
      },
      performanceMetrics: {
        timeSeriesData,
        heatmapData: generateHeatmapData(),
        radarData: {
          aggression: 75,
          control: 45,
          combo: 60,
          consistency: 80,
          adaptability: 65,
          efficiency: 70
        }
      },
      predictiveInsights: [
        {
          type: 'deck_recommendation',
          confidence: 87,
          title: 'Optimal Deck for Current Meta',
          description: 'Based on recent meta shifts, Elemental Storm variants are performing 15% better than average.',
          action: 'Try Elemental Storm',
          impact: '+12% win rate'
        },
        {
          type: 'timing_optimization',
          confidence: 73,
          title: 'Best Playing Times',
          description: 'Your win rate is 18% higher when playing between 7-9 PM on weekdays.',
          action: 'Schedule games optimally',
          impact: '+8% win rate'
        },
        {
          type: 'meta_prediction',
          confidence: 91,
          title: 'Meta Shift Incoming',
          description: 'Control decks are gaining popularity. Consider adding more aggressive options.',
          action: 'Adjust deck selection',
          impact: 'Stay ahead of meta'
        }
      ],
      competitorAnalysis: [
        {
          player: 'ElementalMage',
          rank: 'Legend',
          winRate: 72.4,
          favoriteDecks: ['Elemental Storm', 'Fire Aggro'],
          recentPerformance: 'up',
          matchupRecord: { wins: 3, losses: 7 }
        },
        {
          player: 'StormCaller',
          rank: 'Diamond 1',
          winRate: 68.9,
          favoriteDecks: ['Control Master', 'Combo Burst'],
          recentPerformance: 'stable',
          matchupRecord: { wins: 5, losses: 4 }
        }
      ],
      marketTrends: [
        {
          card: 'Lightning Bolt',
          price: 12.50,
          change: '+15%',
          volume: 1250,
          trend: 'up',
          reason: 'Meta shift towards aggro'
        },
        {
          card: 'Mystic Shield',
          price: 8.75,
          change: '-8%',
          volume: 890,
          trend: 'down',
          reason: 'Less control in meta'
        }
      ],
      userBehavior: {
        playPatterns: {
          peakHours: [19, 20, 21],
          preferredFormats: ['Standard', 'Draft'],
          sessionLength: 45.6,
          gamesPerSession: 3.2
        },
        deckPreferences: {
          aggro: 35,
          control: 25,
          midrange: 30,
          combo: 10
        },
        socialActivity: {
          friendsPlayed: 23,
          communitiesJoined: 5,
          postsShared: 12
        }
      },
      aiRecommendations: [
        {
          category: 'deck_optimization',
          title: 'Improve Mana Curve',
          description: 'Your deck has too many 4-cost cards. Consider replacing 2 cards with 2-cost alternatives.',
          priority: 'high',
          expectedImprovement: '+8% consistency'
        },
        {
          category: 'play_style',
          title: 'Aggressive Mulligan Strategy',
          description: 'You keep hands too often. Being more selective could improve your win rate.',
          priority: 'medium',
          expectedImprovement: '+5% win rate'
        },
        {
          category: 'meta_adaptation',
          title: 'Sideboard Adjustment',
          description: 'Add more removal spells to handle the current aggro meta.',
          priority: 'high',
          expectedImprovement: '+12% vs aggro'
        }
      ]
    };
  };

  const generateHeatmapData = () => {
    const hours = 24;
    const days = 7;
    const data = [];
    
    for (let day = 0; day < days; day++) {
      for (let hour = 0; hour < hours; hour++) {
        data.push({
          day,
          hour,
          value: Math.random() * 100,
          games: Math.floor(Math.random() * 20),
          winRate: 40 + Math.random() * 40
        });
      }
    }
    
    return data;
  };

  const setupRealTimeUpdates = () => {
    if (!wsManager || !isRealTime) return;

    wsManager.send('subscribe_analytics', { 
      userId: user?.id,
      metrics: selectedMetrics,
      timeRange 
    });

    wsManager.on('analytics_update', (data) => {
      setLiveMetrics(prev => ({ ...prev, ...data }));
    });

    wsManager.on('meta_shift', (data) => {
      setMetaAnalysis(prev => ({ ...prev, ...data }));
    });

    wsManager.on('performance_update', (data) => {
      setPerformanceMetrics(prev => ({ ...prev, ...data }));
      renderCharts();
    });
  };

  const renderCharts = () => {
    renderWinRateChart();
    renderDeckPerformanceChart();
    renderMetaDistributionChart();
    renderTimelineChart();
    renderHeatmap();
    renderRadarChart();
  };

  const renderWinRateChart = () => {
    const canvas = winRateChartRef.current;
    if (!canvas || !performanceMetrics.timeSeriesData) return;

    const ctx = canvas.getContext('2d');
    const data = performanceMetrics.timeSeriesData;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find min/max values
    const winRates = data.map(d => d.winRate);
    const minWinRate = Math.min(...winRates);
    const maxWinRate = Math.max(...winRates);
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = canvas.height - padding - ((point.winRate - minWinRate) / (maxWinRate - minWinRate)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = canvas.height - padding - ((point.winRate - minWinRate) / (maxWinRate - minWinRate)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minWinRate + ((maxWinRate - minWinRate) / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1) + '%', padding - 10, y + 4);
    }
  };

  const renderDeckPerformanceChart = () => {
    const canvas = deckPerformanceRef.current;
    if (!canvas || !deckAnalytics.length) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const barWidth = chartWidth / deckAnalytics.length - 10;
    
    // Draw bars
    deckAnalytics.forEach((deck, index) => {
      const x = padding + (chartWidth / deckAnalytics.length) * index + 5;
      const barHeight = (deck.winRate / 100) * chartHeight;
      const y = canvas.height - padding - barHeight;
      
      // Bar color based on performance
      ctx.fillStyle = deck.winRate > 60 ? '#10b981' : deck.winRate > 50 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Deck name
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - 10);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(deck.name, 0, 0);
      ctx.restore();
      
      // Win rate label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(deck.winRate.toFixed(1) + '%', x + barWidth / 2, y - 5);
    });
  };

  const renderMetaDistributionChart = () => {
    const canvas = metaDistributionRef.current;
    if (!canvas || !metaAnalysis.elementDistribution) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const elements = Object.entries(metaAnalysis.elementDistribution);
    const total = elements.reduce((sum, [, value]) => sum + value, 0);
    
    const colors = {
      Fire: '#ef4444',
      Water: '#3b82f6',
      Earth: '#84cc16',
      Air: '#a855f7',
      Neutral: '#6b7280'
    };
    
    let currentAngle = -Math.PI / 2;
    
    elements.forEach(([element, value]) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      // Draw slice
      ctx.fillStyle = colors[element] || '#6b7280';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      
      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(element, labelX, labelY);
      ctx.fillText(value.toFixed(1) + '%', labelX, labelY + 15);
      
      currentAngle += sliceAngle;
    });
  };

  const renderTimelineChart = () => {
    // Similar implementation for timeline chart
  };

  const renderHeatmap = () => {
    const canvas = heatmapRef.current;
    if (!canvas || !performanceMetrics.heatmapData) return;

    const ctx = canvas.getContext('2d');
    const data = performanceMetrics.heatmapData;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cellWidth = canvas.width / 24;
    const cellHeight = canvas.height / 7;
    
    data.forEach(cell => {
      const x = cell.hour * cellWidth;
      const y = cell.day * cellHeight;
      
      // Color based on win rate
      const intensity = cell.winRate / 100;
      const red = Math.floor(255 * (1 - intensity));
      const green = Math.floor(255 * intensity);
      
      ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
      ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
      
      // Add text if cell is large enough
      if (cellWidth > 20 && cellHeight > 20) {
        ctx.fillStyle = intensity > 0.5 ? '#000000' : '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          cell.winRate.toFixed(0) + '%',
          x + cellWidth / 2,
          y + cellHeight / 2 + 3
        );
      }
    });
  };

  const renderRadarChart = () => {
    const canvas = radarChartRef.current;
    if (!canvas || !performanceMetrics.radarData) return;

    const ctx = canvas.getContext('2d');
    const data = performanceMetrics.radarData;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    const attributes = Object.keys(data);
    const angleStep = (2 * Math.PI) / attributes.length;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      const gridRadius = (radius / 5) * i;
      
      attributes.forEach((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * gridRadius;
        const y = centerY + Math.sin(angle) * gridRadius;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw axes
    attributes.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    });
    
    // Draw data
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    attributes.forEach((attr, index) => {
      const value = data[attr];
      const angle = index * angleStep - Math.PI / 2;
      const distance = (value / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    // Draw labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    attributes.forEach((attr, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelDistance = radius + 20;
      const x = centerX + Math.cos(angle) * labelDistance;
      const y = centerY + Math.sin(angle) * labelDistance;
      
      ctx.fillText(attr, x, y);
    });
  };

  const exportData = (format) => {
    const data = {
      playerStats,
      deckAnalytics,
      metaAnalysis,
      performanceMetrics,
      timestamp: new Date().toISOString()
    };
    
    let exportContent = '';
    let filename = '';
    
    switch (format) {
      case 'json':
        exportContent = JSON.stringify(data, null, 2);
        filename = `analytics_${Date.now()}.json`;
        break;
      case 'csv':
        // Convert to CSV format
        exportContent = convertToCSV(data);
        filename = `analytics_${Date.now()}.csv`;
        break;
      case 'pdf':
        // Generate PDF report
        generatePDFReport(data);
        return;
    }
    
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    // Simple CSV conversion for deck analytics
    let csv = 'Deck Name,Games,Wins,Win Rate,Average Turns,Meta Share\n';
    data.deckAnalytics.forEach(deck => {
      csv += `${deck.name},${deck.games},${deck.wins},${deck.winRate},${deck.averageTurns},${deck.metaShare}\n`;
    });
    return csv;
  };

  const generatePDFReport = (data) => {
    // PDF generation would require a library like jsPDF
    console.log('PDF generation not implemented in this demo');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted">Advanced performance insights and predictions</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-muted">
                  {isRealTime ? 'Live' : 'Static'}
                </span>
              </div>
              
              {/* Time range selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              {/* Controls */}
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`btn btn-sm ${isRealTime ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isRealTime ? <Wifi size={14} /> : <WifiOff size={14} />}
                Real-time
              </button>
              
              <button
                onClick={() => loadAnalyticsData()}
                className="btn btn-sm btn-secondary"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
              
              <div className="relative">
                <button className="btn btn-sm btn-secondary">
                  <Download size={14} />
                  Export
                </button>
                {/* Export dropdown would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Live Metrics Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{liveMetrics.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-muted">Active Users</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{liveMetrics.gamesInProgress.toLocaleString()}</div>
            <div className="text-sm text-muted">Games in Progress</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{liveMetrics.tournamentsLive}</div>
            <div className="text-sm text-muted">Live Tournaments</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{liveMetrics.streamViewers.toLocaleString()}</div>
            <div className="text-sm text-muted">Stream Viewers</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Win Rate Trend */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Win Rate Trend</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-green-400">+5.6%</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <canvas
                  ref={winRateChartRef}
                  width={600}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>

            {/* Deck Performance */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Deck Performance</h3>
              </div>
              <div className="p-4">
                <canvas
                  ref={deckPerformanceRef}
                  width={600}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>

            {/* Performance Heatmap */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Performance Heatmap</h3>
                <p className="text-sm text-muted">Win rate by day and hour</p>
              </div>
              <div className="p-4">
                <div className="mb-2 flex justify-between text-xs text-muted">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>11 PM</span>
                </div>
                <canvas
                  ref={heatmapRef}
                  width={600}
                  height={200}
                  className="w-full"
                />
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Stats Summary */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Player Summary</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Total Games</span>
                  <span className="font-medium">{playerStats.totalGames?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Win Rate</span>
                  <span className="font-medium text-green-400">{playerStats.winRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Current Streak</span>
                  <span className="font-medium">{playerStats.currentStreak} wins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Avg Game Length</span>
                  <span className="font-medium">{playerStats.averageGameLength}m</span>
                </div>
                
                {/* Rank Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{playerStats.rankProgress?.current}</span>
                    <span>{playerStats.rankProgress?.next}</span>
                  </div>
                  <div className="w-full bg-tertiary rounded-full h-2">
                    <div 
                      className="bg-accent-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${playerStats.rankProgress?.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Distribution */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Meta Distribution</h3>
              </div>
              <div className="p-4">
                <canvas
                  ref={metaDistributionRef}
                  width={250}
                  height={250}
                  className="w-full"
                />
              </div>
            </div>

            {/* Performance Radar */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Play Style Analysis</h3>
              </div>
              <div className="p-4">
                <canvas
                  ref={radarChartRef}
                  width={250}
                  height={250}
                  className="w-full"
                />
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain size={16} />
                  AI Insights
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {aiRecommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="border border-color rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{rec.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-2">{rec.description}</p>
                    <div className="text-xs text-green-400">{rec.expectedImprovement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target size={16} />
                  Predictions
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {predictiveInsights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="border border-color rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{insight.title}</span>
                      <span className="text-xs text-green-400">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-xs text-muted mb-2">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-accent-primary">{insight.impact}</span>
                      <button className="btn btn-xs btn-primary">
                        {insight.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;