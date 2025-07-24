import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface AnalyticsData {
  playerStats: PlayerStats;
  deckPerformance: DeckPerformance[];
  matchHistory: MatchResult[];
  metaAnalysis: MetaData;
  cardUsage: CardUsageStats[];
}

export interface PlayerStats {
  playerId: string;
  username: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  averageGameLength: number;
  favoriteCards: string[];
  preferredStrategies: string[];
  rankingHistory: RankingPoint[];
}

export interface DeckPerformance {
  deckId: string;
  deckName: string;
  games: number;
  wins: number;
  winRate: number;
  averageTurns: number;
  popularityRank: number;
  strengthVsWeakness: { [key: string]: number };
}

export interface MatchResult {
  matchId: string;
  date: Date;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  duration: number;
  deckUsed: string;
  turnsPlayed: number;
  cardsPlayed: number;
}

export interface MetaData {
  topDecks: DeckPerformance[];
  cardPopularity: CardUsageStats[];
  strategyTrends: StrategyTrend[];
  balanceMetrics: BalanceMetric[];
}

export interface CardUsageStats {
  cardId: string;
  cardName: string;
  usageRate: number;
  winRateWhenUsed: number;
  averageTurnPlayed: number;
  synergies: string[];
}

export interface RankingPoint {
  date: Date;
  rank: number;
  rating: number;
}

export interface StrategyTrend {
  strategy: string;
  popularity: number;
  winRate: number;
  trend: 'rising' | 'falling' | 'stable';
}

export interface BalanceMetric {
  cardId: string;
  cardName: string;
  powerLevel: number;
  playRate: number;
  winRate: number;
  balanceScore: number;
}

export interface AnalyticsDashboardProps {
  data: AnalyticsData;
  width?: number;
  height?: number;
  interactive?: boolean;
}

export const AdvancedAnalytics: React.FC<AnalyticsDashboardProps> = ({
  data,
  width = 1200,
  height = 800,
  interactive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'deck' | 'meta' | 'cards'>('overview');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    switch (selectedView) {
      case 'overview':
        renderOverview(svg, data, width, height);
        break;
      case 'deck':
        renderDeckAnalysis(svg, data, width, height, selectedDeck);
        break;
      case 'meta':
        renderMetaAnalysis(svg, data, width, height);
        break;
      case 'cards':
        renderCardAnalysis(svg, data, width, height);
        break;
    }
  }, [data, selectedView, selectedDeck, width, height]);

  return (
    <div className="analytics-dashboard">
      <div className="analytics-controls">
        <button 
          onClick={() => setSelectedView('overview')}
          className={selectedView === 'overview' ? 'active' : ''}
        >
          Overview
        </button>
        <button 
          onClick={() => setSelectedView('deck')}
          className={selectedView === 'deck' ? 'active' : ''}
        >
          Deck Analysis
        </button>
        <button 
          onClick={() => setSelectedView('meta')}
          className={selectedView === 'meta' ? 'active' : ''}
        >
          Meta Analysis
        </button>
        <button 
          onClick={() => setSelectedView('cards')}
          className={selectedView === 'cards' ? 'active' : ''}
        >
          Card Statistics
        </button>
      </div>
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', background: '#f9f9f9' }}
      />
      
      {selectedView === 'deck' && (
        <div className="deck-selector">
          <select 
            value={selectedDeck || ''} 
            onChange={(e) => setSelectedDeck(e.target.value || null)}
          >
            <option value="">Select a deck</option>
            {data.deckPerformance.map(deck => (
              <option key={deck.deckId} value={deck.deckId}>
                {deck.deckName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

function renderOverview(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number): void {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Win rate over time chart
  const winRateData = data.playerStats.rankingHistory.map(point => ({
    date: point.date,
    winRate: calculateWinRateAtDate(data.matchHistory, point.date)
  }));

  const xScale = d3.scaleTime()
    .domain(d3.extent(winRateData, d => d.date) as [Date, Date])
    .range([0, chartWidth / 2]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([chartHeight / 2, 0]);

  const line = d3.line<{ date: Date; winRate: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.winRate))
    .curve(d3.curveMonotoneX);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Win rate line chart
  g.append('path')
    .datum(winRateData)
    .attr('fill', 'none')
    .attr('stroke', '#4a90e2')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add axes
  g.append('g')
    .attr('transform', `translate(0,${chartHeight / 2})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Add title
  g.append('text')
    .attr('x', chartWidth / 4)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Win Rate Over Time');

  // Deck performance pie chart
  const pieData = data.deckPerformance.slice(0, 5); // Top 5 decks
  const pie = d3.pie<DeckPerformance>()
    .value(d => d.games)
    .sort(null);

  const arc = d3.arc<d3.PieArcDatum<DeckPerformance>>()
    .innerRadius(0)
    .outerRadius(Math.min(chartWidth, chartHeight) / 6);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pieG = svg.append('g')
    .attr('transform', `translate(${width * 0.75},${height * 0.3})`);

  const arcs = pieG.selectAll('.arc')
    .data(pie(pieData))
    .enter().append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i.toString()));

  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .text(d => d.data.deckName);

  // Add pie chart title
  pieG.append('text')
    .attr('x', 0)
    .attr('y', -Math.min(chartWidth, chartHeight) / 6 - 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Deck Usage Distribution');

  // Statistics summary
  const statsG = svg.append('g')
    .attr('transform', `translate(${margin.left},${height * 0.6})`);

  const stats = [
    { label: 'Total Games', value: data.playerStats.totalGames },
    { label: 'Win Rate', value: `${(data.playerStats.winRate * 100).toFixed(1)}%` },
    { label: 'Avg Game Length', value: `${data.playerStats.averageGameLength.toFixed(1)} min` }
  ];

  stats.forEach((stat, i) => {
    const statG = statsG.append('g')
      .attr('transform', `translate(${i * 200}, 0)`);

    statG.append('rect')
      .attr('width', 180)
      .attr('height', 60)
      .attr('fill', '#e8f4f8')
      .attr('stroke', '#4a90e2')
      .attr('rx', 5);

    statG.append('text')
      .attr('x', 90)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(stat.label);

    statG.append('text')
      .attr('x', 90)
      .attr('y', 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#4a90e2')
      .text(stat.value);
  });
}

function renderDeckAnalysis(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number, selectedDeckId: string | null): void {
  if (!selectedDeckId) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Select a deck to view detailed analysis');
    return;
  }

  const deck = data.deckPerformance.find(d => d.deckId === selectedDeckId);
  if (!deck) return;

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Performance over time
  const deckMatches = data.matchHistory.filter(match => match.deckUsed === selectedDeckId);
  const performanceData = aggregatePerformanceByWeek(deckMatches);

  const xScale = d3.scaleTime()
    .domain(d3.extent(performanceData, d => d.week) as [Date, Date])
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([chartHeight / 2, 0]);

  const line = d3.line<{ week: Date; winRate: number }>()
    .x(d => xScale(d.week))
    .y(d => yScale(d.winRate))
    .curve(d3.curveMonotoneX);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Performance line
  g.append('path')
    .datum(performanceData)
    .attr('fill', 'none')
    .attr('stroke', '#e74c3c')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add axes
  g.append('g')
    .attr('transform', `translate(0,${chartHeight / 2})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Matchup analysis
  const matchupData = Object.entries(deck.strengthVsWeakness)
    .map(([opponent, winRate]) => ({ opponent, winRate }))
    .sort((a, b) => b.winRate - a.winRate);

  const matchupG = svg.append('g')
    .attr('transform', `translate(${width * 0.6},${margin.top})`);

  const matchupScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 200]);

  matchupData.forEach((matchup, i) => {
    const barG = matchupG.append('g')
      .attr('transform', `translate(0, ${i * 25})`);

    barG.append('rect')
      .attr('width', matchupScale(matchup.winRate))
      .attr('height', 20)
      .attr('fill', matchup.winRate > 0.5 ? '#27ae60' : '#e74c3c');

    barG.append('text')
      .attr('x', -5)
      .attr('y', 15)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .text(matchup.opponent);

    barG.append('text')
      .attr('x', matchupScale(matchup.winRate) + 5)
      .attr('y', 15)
      .style('font-size', '12px')
      .text(`${(matchup.winRate * 100).toFixed(1)}%`);
  });
}

function renderMetaAnalysis(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number): void {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Strategy trends bubble chart
  const bubbleData = data.metaAnalysis.strategyTrends;
  
  const xScale = d3.scaleLinear()
    .domain(d3.extent(bubbleData, d => d.popularity) as [number, number])
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(bubbleData, d => d.winRate) as [number, number])
    .range([chartHeight, 0]);

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(bubbleData, d => d.popularity) || 1])
    .range([5, 30]);

  const colorScale = d3.scaleOrdinal()
    .domain(['rising', 'stable', 'falling'])
    .range(['#27ae60', '#f39c12', '#e74c3c']);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Bubbles
  g.selectAll('.bubble')
    .data(bubbleData)
    .enter().append('circle')
    .attr('class', 'bubble')
    .attr('cx', d => xScale(d.popularity))
    .attr('cy', d => yScale(d.winRate))
    .attr('r', d => radiusScale(d.popularity))
    .attr('fill', d => colorScale(d.trend) as string)
    .attr('opacity', 0.7)
    .attr('stroke', '#333')
    .attr('stroke-width', 1);

  // Labels
  g.selectAll('.bubble-label')
    .data(bubbleData)
    .enter().append('text')
    .attr('class', 'bubble-label')
    .attr('x', d => xScale(d.popularity))
    .attr('y', d => yScale(d.winRate))
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .style('font-size', '10px')
    .style('font-weight', 'bold')
    .text(d => d.strategy);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Axis labels
  g.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', chartHeight + margin.bottom)
    .attr('text-anchor', 'middle')
    .text('Popularity');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (chartHeight / 2))
    .attr('dy', '1em')
    .attr('text-anchor', 'middle')
    .text('Win Rate');
}

function renderCardAnalysis(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number): void {
  const margin = { top: 20, right: 20, bottom: 30, left: 100 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Top cards by usage rate
  const topCards = data.cardUsage
    .sort((a, b) => b.usageRate - a.usageRate)
    .slice(0, 15);

  const yScale = d3.scaleBand()
    .domain(topCards.map(d => d.cardName))
    .range([0, chartHeight])
    .padding(0.1);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(topCards, d => d.usageRate) || 1])
    .range([0, chartWidth]);

  const colorScale = d3.scaleLinear<string>()
    .domain([0.4, 0.5, 0.6])
    .range(['#e74c3c', '#f39c12', '#27ae60']);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Bars
  g.selectAll('.bar')
    .data(topCards)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => yScale(d.cardName)!)
    .attr('width', d => xScale(d.usageRate))
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(d.winRateWhenUsed));

  // Labels
  g.selectAll('.bar-label')
    .data(topCards)
    .enter().append('text')
    .attr('class', 'bar-label')
    .attr('x', d => xScale(d.usageRate) + 5)
    .attr('y', d => yScale(d.cardName)! + yScale.bandwidth() / 2)
    .attr('dy', '.35em')
    .style('font-size', '10px')
    .text(d => `${(d.usageRate * 100).toFixed(1)}%`);

  // Y-axis
  g.append('g')
    .call(d3.axisLeft(yScale));

  // X-axis
  g.append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale));
}

// Helper functions
function calculateWinRateAtDate(matches: MatchResult[], date: Date): number {
  const relevantMatches = matches.filter(match => match.date <= date);
  if (relevantMatches.length === 0) return 0;
  
  const wins = relevantMatches.filter(match => match.result === 'win').length;
  return wins / relevantMatches.length;
}

function aggregatePerformanceByWeek(matches: MatchResult[]): { week: Date; winRate: number }[] {
  const weeklyData = new Map<string, { wins: number; total: number }>();
  
  matches.forEach(match => {
    const week = d3.timeWeek.floor(match.date);
    const weekKey = week.toISOString();
    
    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, { wins: 0, total: 0 });
    }
    
    const data = weeklyData.get(weekKey)!;
    data.total++;
    if (match.result === 'win') {
      data.wins++;
    }
  });
  
  return Array.from(weeklyData.entries()).map(([weekKey, data]) => ({
    week: new Date(weekKey),
    winRate: data.wins / data.total
  }));
}

export default AdvancedAnalytics;