/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Hashtag tracking service for monitoring social media platforms
import { announceToScreenReader } from '../utils/modernFeatures';

// Platform interface
interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  apiEndpoint: string;
  enabled: boolean;
  [key: string]: any;
}

// Hashtag interface
interface Hashtag {
  id: string;
  tag: string;
  platforms: string[];
  count: number;
  trending: boolean;
  lastUpdated: Date;
  [key: string]: any;
}

// Post interface
interface SocialPost {
  id: string;
  platform: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: Date;
  hashtags: string[];
  media?: string[];
  url: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  [key: string]: any;
}

// Trend interface
interface HashtagTrend {
  tag: string;
  platform: string;
  count: number;
  previousCount: number;
  percentageChange: number;
  timestamp: Date;
  [key: string]: any;
}

// Analytics interface
interface HashtagAnalytics {
  tag: string;
  totalMentions: number;
  platformBreakdown: Record<string, number>;
  timeSeriesData: Array<{
    timestamp: Date;
    count: number;
  }>;
  topPosts: SocialPost[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  relatedTags: Array<{
    tag: string;
    coOccurrences: number;
  }>;
  [key: string]: any;
}

// Notification interface
interface HashtagNotification {
  id: string;
  type: 'milestone' | 'trending' | 'engagement' | 'mention';
  tag: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
  [key: string]: any;
}

// Campaign interface
interface HashtagCampaign {
  id: string;
  name: string;
  description: string;
  tags: string[];
  platforms: string[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'scheduled' | 'completed' | 'cancelled';
  goals: {
    reach?: number;
    engagement?: number;
    mentions?: number;
  };
  currentStats: {
    reach: number;
    engagement: number;
    mentions: number;
  };
  [key: string]: any;
}

// Filter options interface
interface HashtagFilterOptions {
  platforms?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'count' | 'trending' | 'alphabetical' | 'recent';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  includeInactive?: boolean;
  [key: string]: any;
}

// Search options interface
interface HashtagSearchOptions {
  query: string;
  exactMatch?: boolean;
  caseSensitive?: boolean;
  platforms?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  [key: string]: any;
}

class HashtagService {
  private platforms: Record<string, SocialPlatform>;
  private hashtags: Hashtag[];
  private posts: SocialPost[];
  private trends: HashtagTrend[];
  private notifications: HashtagNotification[];
  private campaigns: HashtagCampaign[];
  private refreshInterval: number | null;
  private apiBaseUrl: string;
  private isInitialized: boolean;
  private lastRefresh: Date | null;
  private eventListeners: Record<string, Array<(data: any) => void>>;
  private authToken: string | null;
  private debugMode: boolean;

  constructor() {
    this.platforms = {
      twitter: {
        name: 'Twitter/X',
        icon: '𝕏',
        color: '#000000',
        apiEndpoint: '/api/hashtags/twitter',
        enabled: true
      },
      instagram: {
        name: 'Instagram',
        icon: '📷',
        color: '#E4405F',
        apiEndpoint: '/api/hashtags/instagram',
        enabled: true
      },
      tiktok: {
        name: 'TikTok',
        icon: '🎵',
        color: '#000000',
        apiEndpoint: '/api/hashtags/tiktok',
        enabled: true
      },
      facebook: {
        name: 'Facebook',
        icon: '👥',
        color: '#1877F2',
        apiEndpoint: '/api/hashtags/facebook',
        enabled: true
      },
      youtube: {
        name: 'YouTube',
        icon: '📺',
        color: '#FF0000',
        apiEndpoint: '/api/hashtags/youtube',
        enabled: true
      },
      reddit: {
        name: 'Reddit',
        icon: '🔺',
        color: '#FF4500',
        apiEndpoint: '/api/hashtags/reddit',
        enabled: true
      },
      discord: {
        name: 'Discord',
        icon: '💬',
        color: '#5865F2',
        apiEndpoint: '/api/hashtags/discord',
        enabled: true
      },
      twitch: {
        name: 'Twitch',
        icon: '🎮',
        color: '#9146FF',
        apiEndpoint: '/api/hashtags/twitch',
        enabled: true
      }
    };

    this.hashtags = [];
    this.posts = [];
    this.trends = [];
    this.notifications = [];
    this.campaigns = [];
    this.refreshInterval = null;
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    this.isInitialized = false;
    this.lastRefresh = null;
    this.eventListeners = {
      'hashtag-update': [],
      'new-post': [],
      'trending-update': [],
      'notification': [],
      'campaign-update': [],
      'error': []
    };
    this.authToken = null;
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize the hashtag service
   */
  async initialize(authToken?: string): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      this.authToken = authToken || null;
      
      // Load initial data
      await this.refreshHashtags();
      
      // Set up refresh interval (every 5 minutes)
      this.refreshInterval = window.setInterval(() => {
        this.refreshHashtags().catch(error => {
          this.emitEvent('error', { message: 'Failed to refresh hashtags', error });
        });
      }, 5 * 60 * 1000);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      this.emitEvent('error', { message: 'Failed to initialize hashtag service', error });
      return false;
    }
  }

  /**
   * Refresh hashtag data from all enabled platforms
   */
  async refreshHashtags(): Promise<void> {
    try {
      const enabledPlatforms = Object.keys(this.platforms).filter(
        platform => this.platforms[platform].enabled
      );
      
      const requests = enabledPlatforms.map(platform => 
        this.fetchHashtagsFromPlatform(platform)
      );
      
      const results = await Promise.allSettled(requests);
      
      // Process successful results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const platformName = enabledPlatforms[index];
          this.processPlatformData(platformName, result.value);
        } else {
          const platformName = enabledPlatforms[index];
          this.emitEvent('error', { 
            message: `Failed to fetch hashtags from ${platformName}`,
            error: result.reason
          });
        }
      });
      
      // Update last refresh time
      this.lastRefresh = new Date();
      
      // Emit update event
      this.emitEvent('hashtag-update', { hashtags: this.hashtags });
      
      // Check for trending hashtags
      this.checkForTrendingHashtags();
      
      // Update campaign stats
      this.updateCampaignStats();
      
      // Announce to screen reader if needed
      if (this.trends.length > 0) {
        const trendingTags = this.trends
          .slice(0, 3)
          .map(trend => `#${trend.tag}`)
          .join(', ');
        
        announceToScreenReader(`Trending hashtags updated: ${trendingTags}`);
      }
    } catch (error) {
      this.emitEvent('error', { message: 'Failed to refresh hashtags', error });
      throw error;
    }
  }

  /**
   * Fetch hashtags from a specific platform
   */
  private async fetchHashtagsFromPlatform(platform: string): Promise<any> {
    if (!this.platforms[platform]) {
      throw new Error(`Unknown platform: ${platform}`);
    }
    
    const { apiEndpoint } = this.platforms[platform];
    const url = `${this.apiBaseUrl}${apiEndpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Process data from a platform
   */
  private processPlatformData(platform: string, data: any): void {
    if (!data || !data.hashtags || !Array.isArray(data.hashtags)) {
      this.logDebug(`Invalid data format from ${platform}`);
      return;
    }
    
    // Process hashtags
    data.hashtags.forEach((tag: any) => {
      this.updateOrCreateHashtag(tag, platform);
    });
    
    // Process posts if available
    if (data.posts && Array.isArray(data.posts)) {
      data.posts.forEach((post: any) => {
        this.addPost({
          ...post,
          platform,
          timestamp: new Date(post.timestamp)
        });
      });
    }
  }

  /**
   * Update or create a hashtag
   */
  private updateOrCreateHashtag(tagData: any, platform: string): void {
    const { tag, count } = tagData;
    
    if (!tag) {
      this.logDebug('Invalid hashtag data: missing tag');
      return;
    }
    
    // Find existing hashtag
    const existingIndex = this.hashtags.findIndex(h => h.tag.toLowerCase() === tag.toLowerCase());
    
    if (existingIndex >= 0) {
      // Update existing hashtag
      const existing = this.hashtags[existingIndex];
      
      // Add platform if not already included
      if (!existing.platforms.includes(platform)) {
        existing.platforms.push(platform);
      }
      
      // Update count
      existing.count = (existing.count || 0) + (count || 0);
      
      // Update last updated
      existing.lastUpdated = new Date();
      
      this.hashtags[existingIndex] = existing;
    } else {
      // Create new hashtag
      const newHashtag: Hashtag = {
        id: `hashtag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tag,
        platforms: [platform],
        count: count || 0,
        trending: false,
        lastUpdated: new Date()
      };
      
      this.hashtags.push(newHashtag);
    }
  }

  /**
   * Add a new social post
   */
  private addPost(postData: any): void {
    if (!postData.id || !postData.platform || !postData.content) {
      this.logDebug('Invalid post data');
      return;
    }
    
    // Check if post already exists
    const existingIndex = this.posts.findIndex(p => p.id === postData.id);
    
    if (existingIndex >= 0) {
      // Update existing post
      this.posts[existingIndex] = {
        ...this.posts[existingIndex],
        ...postData
      };
    } else {
      // Create new post
      const newPost: SocialPost = {
        id: postData.id,
        platform: postData.platform,
        content: postData.content,
        author: postData.author || 'Unknown',
        authorId: postData.authorId || '',
        authorAvatar: postData.authorAvatar,
        likes: postData.likes || 0,
        shares: postData.shares || 0,
        comments: postData.comments || 0,
        timestamp: postData.timestamp instanceof Date ? postData.timestamp : new Date(),
        hashtags: postData.hashtags || [],
        media: postData.media,
        url: postData.url || '',
        sentiment: postData.sentiment
      };
      
      this.posts.push(newPost);
      
      // Emit new post event
      this.emitEvent('new-post', { post: newPost });
    }
  }

  /**
   * Check for trending hashtags
   */
  private checkForTrendingHashtags(): void {
    // Reset trending status
    this.hashtags.forEach(hashtag => {
      hashtag.trending = false;
    });
    
    // Clear previous trends
    this.trends = [];
    
    // Group posts by hashtag and platform
    const hashtagCounts: Record<string, Record<string, number>> = {};
    
    // Only consider posts from the last 24 hours
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const recentPosts = this.posts.filter(post => post.timestamp > cutoffTime);
    
    recentPosts.forEach(post => {
      post.hashtags.forEach(tag => {
        if (!hashtagCounts[tag]) {
          hashtagCounts[tag] = {};
        }
        
        if (!hashtagCounts[tag][post.platform]) {
          hashtagCounts[tag][post.platform] = 0;
        }
        
        hashtagCounts[tag][post.platform]++;
      });
    });
    
    // Get previous counts (from 24-48 hours ago)
    const previousCutoffTime = new Date();
    previousCutoffTime.setHours(previousCutoffTime.getHours() - 48);
    
    const previousPosts = this.posts.filter(
      post => post.timestamp > previousCutoffTime && post.timestamp <= cutoffTime
    );
    
    const previousHashtagCounts: Record<string, Record<string, number>> = {};
    
    previousPosts.forEach(post => {
      post.hashtags.forEach(tag => {
        if (!previousHashtagCounts[tag]) {
          previousHashtagCounts[tag] = {};
        }
        
        if (!previousHashtagCounts[tag][post.platform]) {
          previousHashtagCounts[tag][post.platform] = 0;
        }
        
        previousHashtagCounts[tag][post.platform]++;
      });
    });
    
    // Calculate trends
    Object.keys(hashtagCounts).forEach(tag => {
      Object.keys(hashtagCounts[tag]).forEach(platform => {
        const currentCount = hashtagCounts[tag][platform];
        const previousCount = previousHashtagCounts[tag]?.[platform] || 0;
        
        // Calculate percentage change
        let percentageChange = 0;
        if (previousCount > 0) {
          percentageChange = ((currentCount - previousCount) / previousCount) * 100;
        } else if (currentCount > 0) {
          percentageChange = 100; // New hashtag
        }
        
        // Consider trending if percentage change is significant and count is meaningful
        if ((percentageChange >= 50 && currentCount >= 10) || currentCount >= 100) {
          // Add to trends
          this.trends.push({
            tag,
            platform,
            count: currentCount,
            previousCount,
            percentageChange,
            timestamp: new Date()
          });
          
          // Mark hashtag as trending
          const hashtagIndex = this.hashtags.findIndex(h => h.tag.toLowerCase() === tag.toLowerCase());
          if (hashtagIndex >= 0) {
            this.hashtags[hashtagIndex].trending = true;
          }
        }
      });
    });
    
    // Sort trends by percentage change
    this.trends.sort((a, b) => b.percentageChange - a.percentageChange);
    
    // Emit trending update event
    if (this.trends.length > 0) {
      this.emitEvent('trending-update', { trends: this.trends });
      
      // Create notifications for significant trends
      this.trends.slice(0, 5).forEach(trend => {
        if (trend.percentageChange >= 100) {
          this.addNotification({
            type: 'trending',
            tag: trend.tag,
            message: `#${trend.tag} is trending on ${this.platforms[trend.platform].name} with a ${Math.round(trend.percentageChange)}% increase`,
            data: trend
          });
        }
      });
    }
  }

  /**
   * Update campaign statistics
   */
  private updateCampaignStats(): void {
    if (this.campaigns.length === 0) {
      return;
    }
    
    const now = new Date();
    
    this.campaigns.forEach((campaign, index) => {
      // Skip inactive campaigns
      if (campaign.status !== 'active') {
        return;
      }
      
      // Skip campaigns that haven't started yet
      if (campaign.startDate > now) {
        return;
      }
      
      // Skip campaigns that have ended
      if (campaign.endDate && campaign.endDate < now) {
        // Mark as completed
        this.campaigns[index].status = 'completed';
        return;
      }
      
      // Reset current stats
      const currentStats = {
        reach: 0,
        engagement: 0,
        mentions: 0
      };
      
      // Filter posts relevant to this campaign
      const campaignPosts = this.posts.filter(post => {
        // Check if post contains any of the campaign hashtags
        return post.hashtags.some(tag => campaign.tags.includes(tag)) &&
               // Check if post is on one of the campaign platforms
               campaign.platforms.includes(post.platform) &&
               // Check if post is within campaign date range
               post.timestamp >= campaign.startDate &&
               (!campaign.endDate || post.timestamp <= campaign.endDate);
      });
      
      // Calculate stats
      currentStats.mentions = campaignPosts.length;
      
      // Calculate reach and engagement
      campaignPosts.forEach(post => {
        // Reach is estimated as 1 per post (simplified)
        currentStats.reach++;
        
        // Engagement is sum of likes, shares, and comments
        currentStats.engagement += post.likes + post.shares + post.comments;
      });
      
      // Update campaign stats
      this.campaigns[index].currentStats = currentStats;
      
      // Check if goals have been met
      const { goals } = campaign;
      let goalsAchieved = false;
      
      if (goals.reach && currentStats.reach >= goals.reach) {
        goalsAchieved = true;
      }
      
      if (goals.engagement && currentStats.engagement >= goals.engagement) {
        goalsAchieved = true;
      }
      
      if (goals.mentions && currentStats.mentions >= goals.mentions) {
        goalsAchieved = true;
      }
      
      // Create notification if goals have been achieved
      if (goalsAchieved) {
        this.addNotification({
          type: 'milestone',
          tag: campaign.tags[0],
          message: `Campaign "${campaign.name}" has achieved its goals!`,
          data: campaign
        });
      }
    });
    
    // Emit campaign update event
    this.emitEvent('campaign-update', { campaigns: this.campaigns });
  }

  /**
   * Add a notification
   */
  private addNotification(data: Partial<HashtagNotification>): void {
    const notification: HashtagNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type || 'mention',
      tag: data.tag || '',
      message: data.message || '',
      timestamp: new Date(),
      read: false,
      data: data.data
    };
    
    this.notifications.push(notification);
    
    // Emit notification event
    this.emitEvent('notification', { notification });
  }

  /**
   * Get all hashtags with optional filtering
   */
  getHashtags(options?: HashtagFilterOptions): Hashtag[] {
    if (!options) {
      return [...this.hashtags];
    }
    
    let filteredHashtags = [...this.hashtags];
    
    // Filter by platforms
    if (options.platforms && options.platforms.length > 0) {
      filteredHashtags = filteredHashtags.filter(hashtag => 
        hashtag.platforms.some(platform => options.platforms?.includes(platform))
      );
    }
    
    // Filter by date range
    if (options.dateRange) {
      filteredHashtags = filteredHashtags.filter(hashtag => 
        hashtag.lastUpdated >= options.dateRange!.start && 
        hashtag.lastUpdated <= options.dateRange!.end
      );
    }
    
    // Filter inactive hashtags
    if (!options.includeInactive) {
      filteredHashtags = filteredHashtags.filter(hashtag => hashtag.count > 0);
    }
    
    // Sort hashtags
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'count':
          filteredHashtags.sort((a, b) => b.count - a.count);
          break;
        case 'trending':
          filteredHashtags.sort((a, b) => {
            if (a.trending && !b.trending) return -1;
            if (!a.trending && b.trending) return 1;
            return b.count - a.count;
          });
          break;
        case 'alphabetical':
          filteredHashtags.sort((a, b) => a.tag.localeCompare(b.tag));
          break;
        case 'recent':
          filteredHashtags.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
          break;
      }
      
      // Apply sort direction
      if (options.sortDirection === 'asc') {
        filteredHashtags.reverse();
      }
    }
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      filteredHashtags = filteredHashtags.slice(0, options.limit);
    }
    
    return filteredHashtags;
  }

  /**
   * Get trending hashtags
   */
  getTrendingHashtags(limit?: number): HashtagTrend[] {
    let trends = [...this.trends];
    
    if (limit && limit > 0) {
      trends = trends.slice(0, limit);
    }
    
    return trends;
  }

  /**
   * Get posts for a specific hashtag
   */
  getPostsByHashtag(tag: string, options?: HashtagFilterOptions): SocialPost[] {
    if (!tag) {
      return [];
    }
    
    let filteredPosts = this.posts.filter(post => 
      post.hashtags.some(hashtag => hashtag.toLowerCase() === tag.toLowerCase())
    );
    
    // Apply platform filter
    if (options?.platforms && options.platforms.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        options.platforms?.includes(post.platform)
      );
    }
    
    // Apply date range filter
    if (options?.dateRange) {
      filteredPosts = filteredPosts.filter(post => 
        post.timestamp >= options.dateRange!.start && 
        post.timestamp <= options.dateRange!.end
      );
    }
    
    // Sort by timestamp (newest first)
    filteredPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    if (options?.limit && options.limit > 0) {
      filteredPosts = filteredPosts.slice(0, options.limit);
    }
    
    return filteredPosts;
  }

  /**
   * Search for hashtags
   */
  searchHashtags(options: HashtagSearchOptions): Hashtag[] {
    if (!options.query) {
      return [];
    }
    
    const query = options.caseSensitive ? options.query : options.query.toLowerCase();
    
    let results = this.hashtags.filter(hashtag => {
      const tag = options.caseSensitive ? hashtag.tag : hashtag.tag.toLowerCase();
      
      if (options.exactMatch) {
        return tag === query;
      } else {
        return tag.includes(query);
      }
    });
    
    // Apply platform filter
    if (options.platforms && options.platforms.length > 0) {
      results = results.filter(hashtag => 
        hashtag.platforms.some(platform => options.platforms?.includes(platform))
      );
    }
    
    // Apply date range filter
    if (options.dateRange) {
      results = results.filter(hashtag => 
        hashtag.lastUpdated >= options.dateRange!.start && 
        hashtag.lastUpdated <= options.dateRange!.end
      );
    }
    
    // Sort by relevance (exact match first, then by count)
    results.sort((a, b) => {
      const aExact = a.tag.toLowerCase() === query.toLowerCase();
      const bExact = b.tag.toLowerCase() === query.toLowerCase();
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return b.count - a.count;
    });
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  }

  /**
   * Get analytics for a specific hashtag
   */
  async getHashtagAnalytics(tag: string): Promise<HashtagAnalytics> {
    if (!tag) {
      throw new Error('Tag is required');
    }
    
    // Find hashtag
    const hashtag = this.hashtags.find(h => h.tag.toLowerCase() === tag.toLowerCase());
    
    if (!hashtag) {
      throw new Error(`Hashtag #${tag} not found`);
    }
    
    // Get posts for this hashtag
    const posts = this.getPostsByHashtag(tag);
    
    // Calculate platform breakdown
    const platformBreakdown: Record<string, number> = {};
    
    hashtag.platforms.forEach(platform => {
      platformBreakdown[platform] = posts.filter(post => post.platform === platform).length;
    });
    
    // Generate time series data (last 7 days)
    const timeSeriesData: Array<{ timestamp: Date; count: number }> = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = posts.filter(post => 
        post.timestamp >= date && post.timestamp < nextDate
      ).length;
      
      timeSeriesData.push({ timestamp: date, count });
    }
    
    // Get top posts
    const topPosts = [...posts]
      .sort((a, b) => (b.likes + b.shares + b.comments) - (a.likes + a.shares + a.comments))
      .slice(0, 5);
    
    // Calculate sentiment
    const sentiment = {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    posts.forEach(post => {
      if (post.sentiment === 'positive') {
        sentiment.positive++;
      } else if (post.sentiment === 'negative') {
        sentiment.negative++;
      } else {
        sentiment.neutral++;
      }
    });
    
    // Find related tags
    const relatedTags: Array<{ tag: string; coOccurrences: number }> = [];
    const tagCounts: Record<string, number> = {};
    
    posts.forEach(post => {
      post.hashtags.forEach(postTag => {
        if (postTag.toLowerCase() !== tag.toLowerCase()) {
          if (!tagCounts[postTag]) {
            tagCounts[postTag] = 0;
          }
          tagCounts[postTag]++;
        }
      });
    });
    
    Object.keys(tagCounts).forEach(relatedTag => {
      relatedTags.push({
        tag: relatedTag,
        coOccurrences: tagCounts[relatedTag]
      });
    });
    
    // Sort related tags by co-occurrences
    relatedTags.sort((a, b) => b.coOccurrences - a.coOccurrences);
    
    // Return analytics
    return {
      tag: hashtag.tag,
      totalMentions: hashtag.count,
      platformBreakdown,
      timeSeriesData,
      topPosts,
      sentiment,
      relatedTags: relatedTags.slice(0, 10)
    };
  }

  /**
   * Create a new hashtag campaign
   */
  createCampaign(campaignData: Partial<HashtagCampaign>): HashtagCampaign {
    if (!campaignData.name || !campaignData.tags || campaignData.tags.length === 0) {
      throw new Error('Campaign name and tags are required');
    }
    
    const campaign: HashtagCampaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: campaignData.name,
      description: campaignData.description || '',
      tags: campaignData.tags,
      platforms: campaignData.platforms || Object.keys(this.platforms),
      startDate: campaignData.startDate || new Date(),
      endDate: campaignData.endDate,
      status: campaignData.status || 'active',
      goals: campaignData.goals || {},
      currentStats: {
        reach: 0,
        engagement: 0,
        mentions: 0
      }
    };
    
    this.campaigns.push(campaign);
    
    // Emit campaign update event
    this.emitEvent('campaign-update', { campaigns: this.campaigns });
    
    return campaign;
  }

  /**
   * Get all campaigns
   */
  getCampaigns(): HashtagCampaign[] {
    return [...this.campaigns];
  }

  /**
   * Get a specific campaign by ID
   */
  getCampaignById(id: string): HashtagCampaign | undefined {
    return this.campaigns.find(campaign => campaign.id === id);
  }

  /**
   * Update a campaign
   */
  updateCampaign(id: string, updates: Partial<HashtagCampaign>): HashtagCampaign | undefined {
    const index = this.campaigns.findIndex(campaign => campaign.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...updates
    };
    
    // Emit campaign update event
    this.emitEvent('campaign-update', { campaigns: this.campaigns });
    
    return this.campaigns[index];
  }

  /**
   * Delete a campaign
   */
  deleteCampaign(id: string): boolean {
    const index = this.campaigns.findIndex(campaign => campaign.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.campaigns.splice(index, 1);
    
    // Emit campaign update event
    this.emitEvent('campaign-update', { campaigns: this.campaigns });
    
    return true;
  }

  /**
   * Get all notifications
   */
  getNotifications(unreadOnly: boolean = false): HashtagNotification[] {
    if (unreadOnly) {
      return this.notifications.filter(notification => !notification.read);
    }
    
    return [...this.notifications];
  }

  /**
   * Mark a notification as read
   */
  markNotificationAsRead(id: string): boolean {
    const index = this.notifications.findIndex(notification => notification.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.notifications[index].read = true;
    
    // Emit notification event
    this.emitEvent('notification', { notification: this.notifications[index] });
    
    return true;
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    
    // Emit notification event
    this.emitEvent('notification', { notifications: this.notifications });
  }

  /**
   * Get all platforms
   */
  getPlatforms(): Record<string, SocialPlatform> {
    return { ...this.platforms };
  }

  /**
   * Enable or disable a platform
   */
  setPlatformEnabled(platform: string, enabled: boolean): boolean {
    if (!this.platforms[platform]) {
      return false;
    }
    
    this.platforms[platform].enabled = enabled;
    return true;
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      return;
    }
    
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit an event
   */
  private emitEvent(event: string, data: any): void {
    if (!this.eventListeners[event]) {
      return;
    }
    
    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }

  /**
   * Log debug message
   */
  private logDebug(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[HashtagService] ${message}`, ...args);
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.refreshInterval !== null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    this.eventListeners = {
      'hashtag-update': [],
      'new-post': [],
      'trending-update': [],
      'notification': [],
      'campaign-update': [],
      'error': []
    };
    
    this.isInitialized = false;
  }
}

// Create singleton instance
const hashtagService = new HashtagService();

export default hashtagService;