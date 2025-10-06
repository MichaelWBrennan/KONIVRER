import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MarketplaceSearch } from './MarketplaceSearch';
import { PriceTracker } from './PriceTracker';
import * as s from './marketplaceDashboard.css';

interface MarketOverview {
  totalCards: number;
  averagePrice: number;
  priceChanges: {
    rising: number;
    falling: number;
    stable: number;
  };
  topGainers: Array<{
    cardId: string;
    name: string;
    changePercent: number;
  }>;
  topLosers: Array<{
    cardId: string;
    name: string;
    changePercent: number;
  }>;
}

interface TrendingCard {
  cardId: string;
  name: string;
  priceChange: number;
  changePercent: number;
  trend: 'rising' | 'falling' | 'stable';
}

export const MarketplaceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'tracker' | 'insights'>('search');
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [trendingCards, setTrendingCards] = useState<TrendingCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [overviewResponse, insightsResponse] = await Promise.all([
        api.get('/marketplace/overview'),
        api.get('/marketplace/insights'),
      ]);

      if (overviewResponse.data.success) {
        setMarketOverview(overviewResponse.data.data);
      }

      if (insightsResponse.data.success) {
        setTrendingCards(insightsResponse.data.data.trendingCards);
      }
    } catch (err) {
      setError('Failed to load market data');
      console.error('Market data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return '📈';
      case 'falling':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '❓';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return '#28a745';
      case 'falling':
        return '#dc3545';
      case 'stable':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <MarketplaceSearch />;
      case 'tracker':
        return <PriceTracker />;
      case 'insights':
        return (
          <div className={s.insightsContent}>
            <div className={s.insightsHeader}>
              <h2 className={s.insightsTitle}>Market Insights</h2>
              <p className={s.insightsSubtitle}>Real-time market trends and analysis</p>
            </div>

            {loading && (
              <div className={s.loading}>
                <div className={s.spinner} />
                <p>Loading market data...</p>
              </div>
            )}

            {error && (
              <div className={s.errorMessage}>
                {error}
              </div>
            )}

            {!loading && !error && marketOverview && (
              <>
                <div className={s.overviewGrid}>
                  <div className={s.overviewCard}>
                    <div className={s.overviewIcon}>📊</div>
                    <div className={s.overviewContent}>
                      <h3 className={s.overviewTitle}>Total Cards</h3>
                      <p className={s.overviewValue}>{marketOverview.totalCards.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className={s.overviewCard}>
                    <div className={s.overviewIcon}>💰</div>
                    <div className={s.overviewContent}>
                      <h3 className={s.overviewTitle}>Average Price</h3>
                      <p className={s.overviewValue}>{formatPrice(marketOverview.averagePrice)}</p>
                    </div>
                  </div>

                  <div className={s.overviewCard}>
                    <div className={s.overviewIcon}>📈</div>
                    <div className={s.overviewContent}>
                      <h3 className={s.overviewTitle}>Rising</h3>
                      <p className={s.overviewValue} style={{ color: '#28a745' }}>
                        {marketOverview.priceChanges.rising}
                      </p>
                    </div>
                  </div>

                  <div className={s.overviewCard}>
                    <div className={s.overviewIcon}>📉</div>
                    <div className={s.overviewContent}>
                      <h3 className={s.overviewTitle}>Falling</h3>
                      <p className={s.overviewValue} style={{ color: '#dc3545' }}>
                        {marketOverview.priceChanges.falling}
                      </p>
                    </div>
                  </div>

                  <div className={s.overviewCard}>
                    <div className={s.overviewIcon}>➡️</div>
                    <div className={s.overviewContent}>
                      <h3 className={s.overviewTitle}>Stable</h3>
                      <p className={s.overviewValue} style={{ color: '#6c757d' }}>
                        {marketOverview.priceChanges.stable}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={s.trendingSection}>
                  <h3 className={s.sectionTitle}>Trending Cards</h3>
                  <div className={s.trendingGrid}>
                    {trendingCards.slice(0, 6).map((card) => (
                      <div key={card.cardId} className={s.trendingCard}>
                        <div className={s.trendingHeader}>
                          <span className={s.trendingIcon}>
                            {getTrendIcon(card.trend)}
                          </span>
                          <span className={s.trendingName}>{card.name}</span>
                        </div>
                        <div className={s.trendingDetails}>
                          <span
                            className={s.trendingChange}
                            style={{ color: getTrendColor(card.trend) }}
                          >
                            {card.changePercent > 0 ? '+' : ''}{card.changePercent.toFixed(2)}%
                          </span>
                          <span className={s.trendingAmount}>
                            {card.priceChange > 0 ? '+' : ''}{formatPrice(card.priceChange)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={s.topMoversSection}>
                  <div className={s.topGainers}>
                    <h4 className={s.subsectionTitle}>Top Gainers</h4>
                    <div className={s.moversList}>
                      {marketOverview.topGainers.slice(0, 5).map((card, index) => (
                        <div key={card.cardId} className={s.moverItem}>
                          <span className={s.moverRank}>#{index + 1}</span>
                          <span className={s.moverName}>{card.name}</span>
                          <span className={s.moverChange} style={{ color: '#28a745' }}>
                            +{card.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={s.topLosers}>
                    <h4 className={s.subsectionTitle}>Top Losers</h4>
                    <div className={s.moversList}>
                      {marketOverview.topLosers.slice(0, 5).map((card, index) => (
                        <div key={card.cardId} className={s.moverItem}>
                          <span className={s.moverRank}>#{index + 1}</span>
                          <span className={s.moverName}>{card.name}</span>
                          <span className={s.moverChange} style={{ color: '#dc3545' }}>
                            {card.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>Marketplace</h1>
        <p className={s.subtitle}>Search, track, and analyze card prices across marketplaces</p>
      </div>

      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === 'search' ? s.active : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search Cards
        </button>
        <button
          className={`${s.tab} ${activeTab === 'tracker' ? s.active : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          📊 Price Tracker
        </button>
        <button
          className={`${s.tab} ${activeTab === 'insights' ? s.active : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📈 Market Insights
        </button>
      </div>

      <div className={s.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};