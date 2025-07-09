import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '../data/cards';

interface AnalyticsData {
  cardUsage: Array<{ card: Card; usage: number; winRate: number }>;
  deckPerformance: Array<{ deckId: string; winRate: number; games: number; avgTurns: number }>;
  metaTrends: Array<{ date: Date; strategy: string; popularity: number }>;
  playerStats: {
    totalGames: number;
    winRate: number;
    avgGameLength: number;
    favoriteCards: Card[];
    rankHistory: Array<{ date: Date; rank: number }>;
  };
  tournamentData: Array<{
    id: string;
    name: string;
    participants: number;
    prizePool: number;
    winner: string;
  }>;
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
  width?: number;
  height?: number;
  interactive?: boolean;
}

// Advanced Analytics Dashboard with D3.js visualizations
const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  data,
  width = 1200,
  height = 800,
  interactive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'cards' | 'meta' | 'tournaments'>('overview');
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    switch (selectedView) {
      case 'overview':
        renderOverview(svg, data, width, height);
        break;
      case 'cards':
        renderCardAnalytics(svg, data, width, height);
        break;
      case 'meta':
        renderMetaTrends(svg, data, width, height);
        break;
      case 'tournaments':
        renderTournamentAnalytics(svg, data, width, height);
        break;
    }
  }, [data, selectedView, width, height, animationSpeed]);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white'
    }}>
      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '16px'
      }}>
        {['overview', 'cards', 'meta', 'tournaments'].map(view => (
          <button
            key={view}
            onClick={() => setSelectedView(view as any)}
            style={{
              padding: '12px 24px',
              background: selectedView === view ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: selectedView === view ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        alignItems: 'center'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Animation Speed:
          <input
            type="range"
            min="100"
            max="2000"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            style={{ width: '120px' }}
          />
          <span>{animationSpeed}ms</span>
        </label>
      </div>

      {/* Main Visualization */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      />

      {/* Legend and Info */}
      <div style={{ 
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#667eea' }}>Key Insights</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Total games analyzed: {data.playerStats.totalGames.toLocaleString()}</li>
            <li>Overall win rate: {(data.playerStats.winRate * 100).toFixed(1)}%</li>
            <li>Average game length: {data.playerStats.avgGameLength.toFixed(1)} turns</li>
            <li>Most used card: {data.cardUsage[0]?.card.name || 'N/A'}</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#764ba2' }}>Performance Metrics</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Best performing deck: {data.deckPerformance[0]?.winRate.toFixed(1)}% WR</li>
            <li>Meta diversity index: {calculateMetaDiversity(data.metaTrends).toFixed(2)}</li>
            <li>Tournament participation: {data.tournamentData.length}</li>
            <li>Rank progression: {getRankTrend(data.playerStats.rankHistory)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Render overview dashboard
function renderOverview(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number) {
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .style('fill', '#667eea')
    .text('Player Performance Overview');

  // Win Rate Gauge
  renderWinRateGauge(g, data.playerStats.winRate, innerWidth * 0.3, innerHeight * 0.4, 80);

  // Rank History Line Chart
  renderRankHistory(g, data.playerStats.rankHistory, innerWidth * 0.65, innerHeight * 0.4, innerWidth * 0.3, innerHeight * 0.3);

  // Card Usage Pie Chart
  renderCardUsagePie(g, data.cardUsage.slice(0, 8), innerWidth * 0.15, innerHeight * 0.75, 100);

  // Deck Performance Bar Chart
  renderDeckPerformanceBars(g, data.deckPerformance.slice(0, 5), innerWidth * 0.6, innerHeight * 0.75, innerWidth * 0.35, innerHeight * 0.2);
}

// Render card analytics
function renderCardAnalytics(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number) {
  const margin = { top: 40, right: 40, bottom: 80, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .style('fill', '#667eea')
    .text('Card Usage vs Win Rate Analysis');

  // Scatter plot: Usage vs Win Rate
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.cardUsage, d => d.usage) || 1])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);

  const colorScale = d3.scaleOrdinal()
    .domain(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'])
    .range(['#808080', '#00FF00', '#0080FF', '#8000FF', '#FFD700']);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .append('text')
    .attr('x', innerWidth / 2)
    .attr('y', 40)
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Usage Frequency');

  g.append('g')
    .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50)
    .attr('x', -innerHeight / 2)
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Win Rate');

  // Scatter points
  g.selectAll('.card-point')
    .data(data.cardUsage)
    .enter()
    .append('circle')
    .attr('class', 'card-point')
    .attr('cx', d => xScale(d.usage))
    .attr('cy', d => yScale(d.winRate))
    .attr('r', 0)
    .style('fill', d => colorScale(d.card.rarity) as string)
    .style('opacity', 0.7)
    .style('stroke', 'white')
    .style('stroke-width', 1)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 50)
    .attr('r', d => Math.sqrt(d.usage) * 2 + 3);

  // Tooltips
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.8)')
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font-size', '12px');

  g.selectAll('.card-point')
    .on('mouseover', function(event, d) {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`
        <strong>${d.card.name}</strong><br/>
        Usage: ${(d.usage * 100).toFixed(1)}%<br/>
        Win Rate: ${(d.winRate * 100).toFixed(1)}%<br/>
        Rarity: ${d.card.rarity}
      `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition().duration(500).style('opacity', 0);
    });
}

// Render meta trends
function renderMetaTrends(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number) {
  const margin = { top: 40, right: 120, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .style('fill', '#667eea')
    .text('Meta Strategy Trends Over Time');

  // Group data by strategy
  const strategyData = d3.group(data.metaTrends, d => d.strategy);
  const strategies = Array.from(strategyData.keys());

  const xScale = d3.scaleTime()
    .domain(d3.extent(data.metaTrends, d => d.date) as [Date, Date])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.metaTrends, d => d.popularity) || 1])
    .range([innerHeight, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(strategies);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));

  // Line generator
  const line = d3.line<any>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.popularity))
    .curve(d3.curveMonotoneX);

  // Draw lines for each strategy
  strategies.forEach(strategy => {
    const strategyPoints = strategyData.get(strategy) || [];
    
    const path = g.append('path')
      .datum(strategyPoints)
      .attr('fill', 'none')
      .attr('stroke', colorScale(strategy) as string)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add points
    g.selectAll(`.point-${strategy}`)
      .data(strategyPoints)
      .enter()
      .append('circle')
      .attr('class', `point-${strategy}`)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.popularity))
      .attr('r', 0)
      .style('fill', colorScale(strategy) as string)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('r', 4);
  });

  // Legend
  const legend = g.append('g')
    .attr('transform', `translate(${innerWidth + 20}, 20)`);

  strategies.forEach((strategy, i) => {
    const legendRow = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);

    legendRow.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', colorScale(strategy) as string);

    legendRow.append('text')
      .attr('x', 25)
      .attr('y', 14)
      .style('fill', 'white')
      .style('font-size', '14px')
      .text(strategy);
  });
}

// Render tournament analytics
function renderTournamentAnalytics(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: AnalyticsData, width: number, height: number) {
  const margin = { top: 40, right: 40, bottom: 100, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .style('fill', '#667eea')
    .text('Tournament Analytics');

  // Bubble chart: Participants vs Prize Pool
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.tournamentData, d => d.participants) || 1])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.tournamentData, d => d.prizePool) || 1])
    .range([innerHeight, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(data.tournamentData, d => d.participants) || 1])
    .range([5, 30]);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .append('text')
    .attr('x', innerWidth / 2)
    .attr('y', 40)
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Participants');

  g.append('g')
    .call(d3.axisLeft(yScale))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50)
    .attr('x', -innerHeight / 2)
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .text('Prize Pool ($)');

  // Tournament bubbles
  g.selectAll('.tournament-bubble')
    .data(data.tournamentData)
    .enter()
    .append('circle')
    .attr('class', 'tournament-bubble')
    .attr('cx', d => xScale(d.participants))
    .attr('cy', d => yScale(d.prizePool))
    .attr('r', 0)
    .style('fill', '#667eea')
    .style('opacity', 0.7)
    .style('stroke', 'white')
    .style('stroke-width', 2)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 200)
    .attr('r', d => sizeScale(d.participants));
}

// Helper functions
function renderWinRateGauge(g: d3.Selection<SVGGElement, unknown, null, undefined>, winRate: number, x: number, y: number, radius: number) {
  const arc = d3.arc()
    .innerRadius(radius - 20)
    .outerRadius(radius)
    .startAngle(-Math.PI / 2)
    .endAngle(-Math.PI / 2 + (winRate * Math.PI));

  const backgroundArc = d3.arc()
    .innerRadius(radius - 20)
    .outerRadius(radius)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  const gauge = g.append('g')
    .attr('transform', `translate(${x},${y})`);

  // Background
  gauge.append('path')
    .attr('d', backgroundArc as any)
    .style('fill', 'rgba(255,255,255,0.1)');

  // Foreground
  gauge.append('path')
    .attr('d', arc as any)
    .style('fill', winRate > 0.6 ? '#00FF00' : winRate > 0.4 ? '#FFD700' : '#FF4500');

  // Text
  gauge.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 10)
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .style('fill', 'white')
    .text(`${(winRate * 100).toFixed(1)}%`);

  gauge.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 30)
    .style('font-size', '14px')
    .style('fill', '#ccc')
    .text('Win Rate');
}

function renderRankHistory(g: d3.Selection<SVGGElement, unknown, null, undefined>, rankHistory: Array<{date: Date, rank: number}>, x: number, y: number, width: number, height: number) {
  const rankG = g.append('g')
    .attr('transform', `translate(${x},${y})`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(rankHistory, d => d.date) as [Date, Date])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(rankHistory, d => d.rank) as [number, number])
    .range([height, 0]);

  const line = d3.line<any>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.rank))
    .curve(d3.curveMonotoneX);

  rankG.append('path')
    .datum(rankHistory)
    .attr('fill', 'none')
    .attr('stroke', '#764ba2')
    .attr('stroke-width', 2)
    .attr('d', line);

  rankG.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .style('font-weight', 'bold')
    .text('Rank History');
}

function renderCardUsagePie(g: d3.Selection<SVGGElement, unknown, null, undefined>, cardUsage: Array<{card: Card, usage: number}>, x: number, y: number, radius: number) {
  const pie = d3.pie<any>()
    .value(d => d.usage);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const pieG = g.append('g')
    .attr('transform', `translate(${x},${y})`);

  const arcs = pieG.selectAll('.arc')
    .data(pie(cardUsage))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('d', arc as any)
    .style('fill', (d, i) => d3.schemeCategory10[i]);

  pieG.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', radius + 30)
    .style('fill', 'white')
    .style('font-weight', 'bold')
    .text('Top Cards');
}

function renderDeckPerformanceBars(g: d3.Selection<SVGGElement, unknown, null, undefined>, deckPerformance: Array<{deckId: string, winRate: number}>, x: number, y: number, width: number, height: number) {
  const barG = g.append('g')
    .attr('transform', `translate(${x},${y})`);

  const xScale = d3.scaleBand()
    .domain(deckPerformance.map(d => d.deckId))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  barG.selectAll('.bar')
    .data(deckPerformance)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.deckId) || 0)
    .attr('width', xScale.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .style('fill', '#667eea')
    .transition()
    .duration(1000)
    .attr('y', d => yScale(d.winRate))
    .attr('height', d => height - yScale(d.winRate));

  barG.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .style('font-weight', 'bold')
    .text('Deck Performance');
}

function calculateMetaDiversity(metaTrends: Array<{strategy: string, popularity: number}>): number {
  const strategies = d3.group(metaTrends, d => d.strategy);
  const avgPopularity = Array.from(strategies.values()).map(trends => 
    d3.mean(trends, d => d.popularity) || 0
  );
  
  return 1 - d3.deviation(avgPopularity) || 0;
}

function getRankTrend(rankHistory: Array<{date: Date, rank: number}>): string {
  if (rankHistory.length < 2) return 'Stable';
  
  const recent = rankHistory[rankHistory.length - 1].rank;
  const previous = rankHistory[rankHistory.length - 2].rank;
  
  if (recent > previous) return '↗ Rising';
  if (recent < previous) return '↘ Falling';
  return '→ Stable';
}

export default AdvancedAnalytics;