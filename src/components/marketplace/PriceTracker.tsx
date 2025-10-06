import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import * as s from './priceTracker.css';

interface PriceHistory {
  id: string;
  cardId: string;
  marketplace: string;
  price: number;
  currency: string;
  condition: string;
  foil: boolean;
  language: string;
  date: string;
  listingUrl?: string;
}

interface PriceTrend {
  cardId: string;
  marketplace: string;
  trend: 'rising' | 'falling' | 'stable';
  changePercent: number;
  changeAmount: number;
  period: string;
}

interface Card {
  id: string;
  name: string;
  imageUrl: string;
}

export const PriceTracker: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);

  const handleCardSelect = async (card: Card) => {
    setSelectedCard(card);
    setLoading(true);
    setError(null);

    try {
      const [historyResponse, trendsResponse] = await Promise.all([
        api.get(`/marketplace/cards/${card.id}/price-history`, {
          params: { days: timeRange },
        }),
        api.get(`/marketplace/cards/${card.id}/trends`, {
          params: { days: timeRange },
        }),
      ]);

      if (historyResponse.data.success) {
        setPriceHistory(historyResponse.data.data);
      }

      if (trendsResponse.data.success) {
        setPriceTrends(trendsResponse.data.data);
      }
    } catch (err) {
      setError('Failed to load price data');
      console.error('Price tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'tcgplayer':
        return '🛒';
      case 'scryfall':
        return '🔍';
      case 'cardmarket':
        return '🇪🇺';
      default:
        return '💳';
    }
  };

  // Mock card data - in real app, this would come from props or API
  const mockCards: Card[] = [
    {
      id: '1',
      name: 'Azoth',
      imageUrl: '/assets/cards/AZOTH.webp',
    },
    {
      id: '2',
      name: 'Bright Lightning',
      imageUrl: '/assets/cards/BRIGHTLIGHTNING.webp',
    },
    {
      id: '3',
      name: 'Chaos Dust',
      imageUrl: '/assets/cards/CHAOSDUST.webp',
    },
  ];

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Price Tracker</h2>
        <p className={s.subtitle}>Track card prices and market trends</p>
      </div>

      <div className={s.content}>
        <div className={s.sidebar}>
          <div className={s.cardSelector}>
            <h3 className={s.sectionTitle}>Select Card</h3>
            <div className={s.cardList}>
              {mockCards.map((card) => (
                <div
                  key={card.id}
                  className={`${s.cardItem} ${selectedCard?.id === card.id ? s.selected : ''}`}
                  onClick={() => handleCardSelect(card)}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className={s.cardImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/cards/card_back.svg';
                    }}
                  />
                  <span className={s.cardName}>{card.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={s.controls}>
            <h3 className={s.sectionTitle}>Time Range</h3>
            <div className={s.timeRangeButtons}>
              {[7, 30, 90, 365].map((days) => (
                <button
                  key={days}
                  className={`${s.timeRangeButton} ${timeRange === days ? s.active : ''}`}
                  onClick={() => setTimeRange(days)}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.mainContent}>
          {selectedCard ? (
            <>
              <div className={s.cardHeader}>
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.name}
                  className={s.selectedCardImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/cards/card_back.svg';
                  }}
                />
                <div className={s.cardInfo}>
                  <h3 className={s.selectedCardName}>{selectedCard.name}</h3>
                  <p className={s.selectedCardSubtitle}>Price tracking data</p>
                </div>
              </div>

              {loading && (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  <p>Loading price data...</p>
                </div>
              )}

              {error && (
                <div className={s.errorMessage}>
                  {error}
                </div>
              )}

              {!loading && !error && (
                <>
                  {priceTrends.length > 0 && (
                    <div className={s.trendsSection}>
                      <h4 className={s.sectionTitle}>Price Trends</h4>
                      <div className={s.trendsGrid}>
                        {priceTrends.map((trend, index) => (
                          <div key={index} className={s.trendItem}>
                            <div className={s.trendHeader}>
                              <span className={s.trendIcon}>
                                {getTrendIcon(trend.trend)}
                              </span>
                              <span className={s.trendMarketplace}>
                                {getMarketplaceIcon(trend.marketplace)} {trend.marketplace}
                              </span>
                            </div>
                            <div className={s.trendDetails}>
                              <span
                                className={s.trendChange}
                                style={{ color: getTrendColor(trend.trend) }}
                              >
                                {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(2)}%
                              </span>
                              <span className={s.trendAmount}>
                                {trend.changeAmount > 0 ? '+' : ''}{formatPrice(trend.changeAmount, 'USD')}
                              </span>
                            </div>
                            <div className={s.trendPeriod}>
                              {trend.period}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {priceHistory.length > 0 && (
                    <div className={s.historySection}>
                      <h4 className={s.sectionTitle}>Price History</h4>
                      <div className={s.historyTable}>
                        <div className={s.historyHeader}>
                          <span>Date</span>
                          <span>Marketplace</span>
                          <span>Price</span>
                          <span>Condition</span>
                          <span>Foil</span>
                        </div>
                        {priceHistory.map((entry) => (
                          <div key={entry.id} className={s.historyRow}>
                            <span className={s.historyDate}>
                              {formatDate(entry.date)}
                            </span>
                            <span className={s.historyMarketplace}>
                              {getMarketplaceIcon(entry.marketplace)} {entry.marketplace}
                            </span>
                            <span className={s.historyPrice}>
                              {formatPrice(entry.price, entry.currency)}
                            </span>
                            <span className={s.historyCondition}>
                              {entry.condition.replace('_', ' ')}
                            </span>
                            <span className={s.historyFoil}>
                              {entry.foil ? 'Yes' : 'No'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {priceHistory.length === 0 && priceTrends.length === 0 && (
                    <div className={s.noData}>
                      <p>No price data available for this card.</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className={s.noSelection}>
              <p>Select a card to view price tracking data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};