import { useState, useEffect, useRef } from 'react';
import {
  Hash,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Eye,
  Settings,
  Plus,
  Minus,
  X,
  Clock,
  Activity,
  Globe,
  Users,
  MessageCircle,
  Heart,
  Share2,
  ExternalLink,
  Download,
  Upload,
  Calendar,
  Target,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import hashtagService from '../services/hashtagService';
import { announceToScreenReader } from '../utils/modernFeatures';

const SocialHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trending');

  // Hashtag tracking state
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [trackedHashtags, setTrackedHashtags] = useState([]);
  const [platforms, setPlatforms] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [hashtagAnalytics, setHashtagAnalytics] = useState({});
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  const [timeframe, setTimeframe] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [filters, setFilters] = useState({
    platforms: [],
    sentiment: 'all',
    minMentions: 0,
    sortBy: 'mentions',
  });

  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    initializeHashtagData();
    setupAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      setupAutoRefresh();
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }
  }, [autoRefresh, refreshInterval]);

  const initializeHashtagData = async () => {
    setIsLoading(true);
    try {
      // Initialize platforms
      const platformsData = hashtagService.getPlatforms();
      setPlatforms(platformsData);

      // Get tracked hashtags
      const tracked = hashtagService.getTrackedHashtags();
      setTrackedHashtags(tracked);

      // Get trending hashtags
      const trending = await hashtagService.getTrendingHashtags(timeframe);
      setTrendingHashtags(trending);

      // Get real-time updates
      const updates = await hashtagService.getRealtimeUpdates(tracked);
      setRealtimeUpdates(updates);

      announceToScreenReader('Hashtag data loaded successfully');
    } catch (error) {
      console.error('Error initializing hashtag data:', error);
      announceToScreenReader('Error loading hashtag data');
    } finally {
      setIsLoading(false);
    }
  };

  const setupAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        refreshData();
      }, refreshInterval);
    }
  };

  const refreshData = async () => {
    try {
      const trending = await hashtagService.getTrendingHashtags(timeframe);
      setTrendingHashtags(trending);

      const updates = await hashtagService.getRealtimeUpdates(trackedHashtags);
      setRealtimeUpdates(prev => [...updates, ...prev].slice(0, 50)); // Keep last 50 updates

      if (selectedHashtag) {
        const analytics =
          await hashtagService.getHashtagAnalytics(selectedHashtag);
        setHashtagAnalytics(analytics);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const searchHashtags = async query => {
    if (!query.trim()) {
      setSearchResults({});
      return;
    }

    setIsLoading(true);
    try {
      const results = await hashtagService.searchHashtags(query);
      setSearchResults(results);
      announceToScreenReader(`Found hashtag results for ${query}`);
    } catch (error) {
      console.error('Error searching hashtags:', error);
      announceToScreenReader('Error searching hashtags');
    } finally {
      setIsLoading(false);
    }
  };

  const selectHashtag = async hashtag => {
    setSelectedHashtag(hashtag);
    setIsLoading(true);
    try {
      const analytics = await hashtagService.getHashtagAnalytics(hashtag);
      setHashtagAnalytics(analytics);
      announceToScreenReader(`Loaded analytics for ${hashtag}`);
    } catch (error) {
      console.error('Error loading hashtag analytics:', error);
      announceToScreenReader('Error loading hashtag analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const addHashtagToTracking = hashtag => {
    const success = hashtagService.addTrackedHashtag(hashtag);
    if (success) {
      setTrackedHashtags(hashtagService.getTrackedHashtags());
    }
  };

  const removeHashtagFromTracking = hashtag => {
    const success = hashtagService.removeTrackedHashtag(hashtag);
    if (success) {
      setTrackedHashtags(hashtagService.getTrackedHashtags());
    }
  };

  const togglePlatform = platformKey => {
    const enabled = hashtagService.togglePlatform(platformKey);
    setPlatforms(hashtagService.getPlatforms());
    refreshData();
  };

  const formatNumber = num => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = sentiment => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentIcon = sentiment => {
    switch (sentiment) {
      case 'positive':
        return <ArrowUp size={16} className="text-green-600" />;
      case 'negative':
        return <ArrowDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const filteredTrendingHashtags = trendingHashtags
    .filter(hashtag => {
      if (
        filters.minMentions > 0 &&
        hashtag.totalMentions < filters.minMentions
      )
        return false;
      if (
        filters.sentiment !== 'all' &&
        hashtag.sentiment !== filters.sentiment
      )
        return false;
      if (filters.platforms.length > 0) {
        const hasActivePlatform = filters.platforms.some(
          platform =>
            hashtag.platforms[platform] &&
            hashtag.platforms[platform].mentions > 0,
        );
        if (!hasActivePlatform) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'growth':
          return parseFloat(b.growth) - parseFloat(a.growth);
        case 'mentions':
        default:
          return b.totalMentions - a.totalMentions;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Hash className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Social Media Hashtag Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor KONIVRER hashtags across all major social platforms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`btn ${autoRefresh ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                  aria-label={
                    autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'
                  }
                >
                  {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
                  Auto-refresh
                </button>
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="btn btn-secondary flex items-center gap-2"
                  aria-label="Refresh data"
                >
                  <RefreshCw
                    size={16}
                    className={isLoading ? 'animate-spin' : ''}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search hashtags..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  searchHashtags(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Platform Toggles */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(platforms).map(([key, platform]) => (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  platform.enabled
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
                style={{
                  borderColor: platform.enabled
                    ? platform.color
                    : 'transparent',
                }}
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'tracked', label: 'Tracked', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'realtime', label: 'Real-time', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Trending Hashtags
                </h2>
                <div className="flex items-center gap-4">
                  <select
                    value={filters.sortBy}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, sortBy: e.target.value }))
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="mentions">Sort by Mentions</option>
                    <option value="growth">Sort by Growth</option>
                  </select>
                  <button className="btn btn-secondary btn-sm flex items-center gap-2">
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredTrendingHashtags.map((hashtag, index) => (
                  <div
                    key={hashtag.hashtag}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => selectHashtag(hashtag.hashtag)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {hashtag.hashtag}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              {formatNumber(hashtag.totalMentions)} mentions
                            </span>
                            <span
                              className={`flex items-center gap-1 ${hashtag.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {hashtag.growth.startsWith('+') ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )}
                              {hashtag.growth}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(hashtag.sentiment)}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            trackedHashtags.includes(hashtag.hashtag)
                              ? removeHashtagFromTracking(hashtag.hashtag)
                              : addHashtagToTracking(hashtag.hashtag);
                          }}
                          className={`btn btn-sm ${
                            trackedHashtags.includes(hashtag.hashtag)
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                        >
                          {trackedHashtags.includes(hashtag.hashtag) ? (
                            <Minus size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Platform breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {Object.entries(hashtag.platforms).map(
                        ([platform, data]) => (
                          <div key={platform} className="text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {platforms[platform]?.icon}{' '}
                              {platforms[platform]?.name}
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatNumber(data.mentions)}
                            </div>
                            <div
                              className={`text-xs ${data.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {data.growth}
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Top posts preview */}
                    {hashtag.topPosts && hashtag.topPosts.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Top Posts
                        </h4>
                        <div className="space-y-2">
                          {hashtag.topPosts
                            .slice(0, 2)
                            .map((post, postIndex) => (
                              <div
                                key={postIndex}
                                className="bg-gray-50 dark:bg-gray-700 rounded-md p-3"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {platforms[post.platform]?.icon}{' '}
                                    {post.author}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatTimestamp(post.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Heart size={12} />
                                    {formatNumber(post.engagement)}
                                  </span>
                                  <button className="btn btn-xs btn-ghost">
                                    <ExternalLink size={12} />
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracked Tab */}
          {activeTab === 'tracked' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tracked Hashtags
                </h2>
                <button className="btn btn-primary flex items-center gap-2">
                  <Plus size={16} />
                  Add Hashtag
                </button>
              </div>

              <div className="grid gap-4">
                {trackedHashtags.map(hashtag => {
                  const trendingData = trendingHashtags.find(
                    t => t.hashtag === hashtag,
                  );
                  return (
                    <div
                      key={hashtag}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {hashtag}
                          </h3>
                          {trendingData && (
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span>
                                {formatNumber(trendingData.totalMentions)}{' '}
                                mentions
                              </span>
                              <span
                                className={`flex items-center gap-1 ${trendingData.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {trendingData.growth.startsWith('+') ? (
                                  <ArrowUp size={12} />
                                ) : (
                                  <ArrowDown size={12} />
                                )}
                                {trendingData.growth}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => selectHashtag(hashtag)}
                            className="btn btn-secondary btn-sm flex items-center gap-2"
                          >
                            <BarChart3 size={16} />
                            Analytics
                          </button>
                          <button
                            onClick={() => removeHashtagFromTracking(hashtag)}
                            className="btn btn-red btn-sm"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {trackedHashtags.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No hashtags tracked yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start tracking hashtags to monitor their performance
                      across social media platforms.
                    </p>
                    <button className="btn btn-primary">
                      Add Your First Hashtag
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hashtag Analytics
                </h2>
                {selectedHashtag && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Hash size={16} />
                    {selectedHashtag}
                  </div>
                )}
              </div>

              {selectedHashtag ? (
                <div className="space-y-6">
                  {Object.entries(hashtagAnalytics).map(([platform, data]) => (
                    <div
                      key={platform}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">
                          {platforms[platform]?.icon}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {platforms[platform]?.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatNumber(data.mentions)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Mentions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatNumber(data.engagement)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Engagement
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatNumber(data.reach)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Reach
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${getSentimentColor(data.sentiment)}`}
                          >
                            {data.sentiment}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Sentiment
                          </div>
                        </div>
                      </div>

                      {/* Top Influencers */}
                      {data.topInfluencers &&
                        data.topInfluencers.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                              Top Influencers
                            </h4>
                            <div className="space-y-2">
                              {data.topInfluencers.map((influencer, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md p-3"
                                >
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {influencer.username}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatNumber(influencer.followers)}{' '}
                                      followers
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {influencer.mentions} mentions
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Recent Posts */}
                      {data.recentPosts && data.recentPosts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Recent Posts
                          </h4>
                          <div className="space-y-3">
                            {data.recentPosts.map((post, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-700 rounded-md p-3"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {post.author}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimestamp(post.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Heart size={12} />
                                    {formatNumber(post.engagement)}
                                  </span>
                                  <button className="btn btn-xs btn-ghost">
                                    <ExternalLink size={12} />
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a hashtag to view analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click on any hashtag from the trending or tracked lists to
                    see detailed analytics.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Real-time Tab */}
          {activeTab === 'realtime' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Real-time Updates
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Activity className="text-green-500" size={16} />
                  Live
                </div>
              </div>

              <div className="space-y-3">
                {realtimeUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-xl">
                        {platforms[update.platform]?.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {update.hashtag}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          on {platforms[update.platform]?.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {update.content}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTimestamp(update.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatNumber(update.engagement)} engagement
                      </div>
                    </div>
                  </div>
                ))}

                {realtimeUpdates.length === 0 && (
                  <div className="text-center py-12">
                    <Activity
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No real-time updates yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Real-time updates will appear here as they happen across
                      social media platforms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Results Overlay */}
        {searchTerm && Object.keys(searchResults).length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Results for "{searchTerm}"
                </h3>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(searchResults).map(([platform, results]) => (
                  <div key={platform}>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <span>{platforms[platform]?.icon}</span>
                      {platforms[platform]?.name}
                    </h4>
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => {
                            selectHashtag(result.hashtag);
                            setSearchTerm('');
                            setSearchResults({});
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {result.hashtag}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>
                                {formatNumber(result.mentions)} mentions
                              </span>
                              <span
                                className={
                                  result.growth.startsWith('+')
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                {result.growth}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialHub;
