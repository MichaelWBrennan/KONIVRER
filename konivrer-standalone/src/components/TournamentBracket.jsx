import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Tournament Bracket Component
 * 
 * This component visualizes tournament brackets with interactive features,
 * match details, player statistics, and customizable display options.
 */
const TournamentBracket = ({
  tournamentData,
  onMatchClick,
  onPlayerClick,
  highlightedMatch = null,
  highlightedPlayer = null,
  layout = 'horizontal', // 'horizontal', 'vertical'
  showScores = true,
  showPlayerStats = true,
  animateProgress = true,
  bracketType = 'single', // 'single', 'double', 'swiss', 'round-robin'
  theme = 'default' // 'default', 'minimal', 'classic', 'ancient'
}) => {
  const { isAncientTheme } = useTheme();
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [hoveredMatch, setHoveredMatch] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [visibleRounds, setVisibleRounds] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoScroll, setAutoScroll] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showPlayerImages, setShowPlayerImages] = useState(true);
  const [showMatchTimes, setShowMatchTimes] = useState(true);
  
  // Refs
  const bracketRef = useRef(null);
  const containerRef = useRef(null);
  
  // Sample tournament data for demonstration
  const sampleTournamentData = useMemo(() => ({
    id: 'tournament-001',
    name: 'KONIVRER Championship Series',
    startDate: '2025-06-20T10:00:00Z',
    endDate: '2025-06-22T18:00:00Z',
    status: 'in-progress', // 'upcoming', 'in-progress', 'completed'
    format: 'single-elimination',
    players: [
      { id: 'player-001', name: 'Alex Johnson', seed: 1, rating: 1850, wins: 2, losses: 0, avatar: '/images/avatars/player1.jpg' },
      { id: 'player-002', name: 'Maria Garcia', seed: 2, rating: 1820, wins: 2, losses: 0, avatar: '/images/avatars/player2.jpg' },
      { id: 'player-003', name: 'James Wilson', seed: 3, rating: 1790, wins: 1, losses: 1, avatar: '/images/avatars/player3.jpg' },
      { id: 'player-004', name: 'Sarah Chen', seed: 4, rating: 1780, wins: 1, losses: 1, avatar: '/images/avatars/player4.jpg' },
      { id: 'player-005', name: 'David Kim', seed: 5, rating: 1760, wins: 0, losses: 1, avatar: '/images/avatars/player5.jpg' },
      { id: 'player-006', name: 'Emma Davis', seed: 6, rating: 1740, wins: 0, losses: 1, avatar: '/images/avatars/player6.jpg' },
      { id: 'player-007', name: 'Michael Brown', seed: 7, rating: 1720, wins: 0, losses: 1, avatar: '/images/avatars/player7.jpg' },
      { id: 'player-008', name: 'Sophia Martinez', seed: 8, rating: 1700, wins: 0, losses: 1, avatar: '/images/avatars/player8.jpg' }
    ],
    rounds: [
      {
        id: 'round-001',
        name: 'Quarter-Finals',
        number: 1,
        status: 'completed',
        matches: [
          {
            id: 'match-001',
            player1: { id: 'player-001', name: 'Alex Johnson', seed: 1 },
            player2: { id: 'player-008', name: 'Sophia Martinez', seed: 8 },
            winner: 'player-001',
            score: '2-0',
            status: 'completed',
            startTime: '2025-06-20T10:00:00Z',
            endTime: '2025-06-20T11:30:00Z',
            games: [
              { id: 'game-001', winner: 'player-001', score: '20-15' },
              { id: 'game-002', winner: 'player-001', score: '20-12' }
            ]
          },
          {
            id: 'match-002',
            player1: { id: 'player-004', name: 'Sarah Chen', seed: 4 },
            player2: { id: 'player-005', name: 'David Kim', seed: 5 },
            winner: 'player-004',
            score: '2-1',
            status: 'completed',
            startTime: '2025-06-20T12:00:00Z',
            endTime: '2025-06-20T14:00:00Z',
            games: [
              { id: 'game-003', winner: 'player-005', score: '20-18' },
              { id: 'game-004', winner: 'player-004', score: '20-10' },
              { id: 'game-005', winner: 'player-004', score: '20-15' }
            ]
          },
          {
            id: 'match-003',
            player1: { id: 'player-002', name: 'Maria Garcia', seed: 2 },
            player2: { id: 'player-007', name: 'Michael Brown', seed: 7 },
            winner: 'player-002',
            score: '2-0',
            status: 'completed',
            startTime: '2025-06-20T14:30:00Z',
            endTime: '2025-06-20T16:00:00Z',
            games: [
              { id: 'game-006', winner: 'player-002', score: '20-14' },
              { id: 'game-007', winner: 'player-002', score: '20-17' }
            ]
          },
          {
            id: 'match-004',
            player1: { id: 'player-003', name: 'James Wilson', seed: 3 },
            player2: { id: 'player-006', name: 'Emma Davis', seed: 6 },
            winner: 'player-003',
            score: '2-0',
            status: 'completed',
            startTime: '2025-06-20T16:30:00Z',
            endTime: '2025-06-20T18:00:00Z',
            games: [
              { id: 'game-008', winner: 'player-003', score: '20-16' },
              { id: 'game-009', winner: 'player-003', score: '20-19' }
            ]
          }
        ]
      },
      {
        id: 'round-002',
        name: 'Semi-Finals',
        number: 2,
        status: 'completed',
        matches: [
          {
            id: 'match-005',
            player1: { id: 'player-001', name: 'Alex Johnson', seed: 1 },
            player2: { id: 'player-004', name: 'Sarah Chen', seed: 4 },
            winner: 'player-001',
            score: '2-0',
            status: 'completed',
            startTime: '2025-06-21T10:00:00Z',
            endTime: '2025-06-21T12:00:00Z',
            games: [
              { id: 'game-010', winner: 'player-001', score: '20-15' },
              { id: 'game-011', winner: 'player-001', score: '20-18' }
            ]
          },
          {
            id: 'match-006',
            player1: { id: 'player-002', name: 'Maria Garcia', seed: 2 },
            player2: { id: 'player-003', name: 'James Wilson', seed: 3 },
            winner: 'player-002',
            score: '2-1',
            status: 'completed',
            startTime: '2025-06-21T13:00:00Z',
            endTime: '2025-06-21T15:30:00Z',
            games: [
              { id: 'game-012', winner: 'player-003', score: '20-17' },
              { id: 'game-013', winner: 'player-002', score: '20-14' },
              { id: 'game-014', winner: 'player-002', score: '20-16' }
            ]
          }
        ]
      },
      {
        id: 'round-003',
        name: 'Finals',
        number: 3,
        status: 'in-progress',
        matches: [
          {
            id: 'match-007',
            player1: { id: 'player-001', name: 'Alex Johnson', seed: 1 },
            player2: { id: 'player-002', name: 'Maria Garcia', seed: 2 },
            winner: null,
            score: '1-1',
            status: 'in-progress',
            startTime: '2025-06-22T14:00:00Z',
            endTime: null,
            games: [
              { id: 'game-015', winner: 'player-001', score: '20-16' },
              { id: 'game-016', winner: 'player-002', score: '20-18' }
            ]
          }
        ]
      }
    ]
  }), []);
  
  // Use sample data if no tournament data is provided
  const tournament = tournamentData || sampleTournamentData;
  
  // Initialize visible rounds
  useEffect(() => {
    if (tournament && tournament.rounds) {
      setVisibleRounds(tournament.rounds.map(round => round.id));
    }
  }, [tournament]);
  
  // Auto-scroll to highlighted match
  useEffect(() => {
    if (highlightedMatch && bracketRef.current) {
      const matchElement = bracketRef.current.querySelector(`[data-match-id="${highlightedMatch}"]`);
      
      if (matchElement && autoScroll) {
        matchElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [highlightedMatch, autoScroll]);
  
  // Handle match click
  const handleMatchClick = useCallback((match) => {
    setExpandedMatch(prev => prev === match.id ? null : match.id);
    
    if (onMatchClick) {
      onMatchClick(match);
    }
  }, [onMatchClick]);
  
  // Handle player click
  const handlePlayerClick = useCallback((player) => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  }, [onPlayerClick]);
  
  // Handle mouse down for panning
  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  }, [panOffset]);
  
  // Handle mouse move for panning
  const handleMouseMove = useCallback((e) => {
    if (isDragging && containerRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPanOffset({ x: newX, y: newY });
    }
  }, [isDragging, dragStart]);
  
  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Handle mouse leave for panning
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Handle wheel for zooming
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(2, zoomLevel + delta));
    
    setZoomLevel(newZoom);
  }, [zoomLevel]);
  
  // Toggle round visibility
  const toggleRound = useCallback((roundId) => {
    setVisibleRounds(prev => {
      if (prev.includes(roundId)) {
        return prev.filter(id => id !== roundId);
      } else {
        return [...prev, roundId];
      }
    });
  }, []);
  
  // Reset view
  const resetView = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    
    if (tournament && tournament.rounds) {
      setVisibleRounds(tournament.rounds.map(round => round.id));
    }
  }, [tournament]);
  
  // Toggle auto-scroll
  const toggleAutoScroll = useCallback(() => {
    setAutoScroll(prev => !prev);
  }, []);
  
  // Toggle show completed matches
  const toggleShowCompleted = useCallback(() => {
    setShowCompleted(prev => !prev);
  }, []);
  
  // Toggle show upcoming matches
  const toggleShowUpcoming = useCallback(() => {
    setShowUpcoming(prev => !prev);
  }, []);
  
  // Toggle show player images
  const toggleShowPlayerImages = useCallback(() => {
    setShowPlayerImages(prev => !prev);
  }, []);
  
  // Toggle show match times
  const toggleShowMatchTimes = useCallback(() => {
    setShowMatchTimes(prev => !prev);
  }, []);
  
  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  }, []);
  
  // Get match status class
  const getMatchStatusClass = useCallback((match) => {
    if (match.status === 'completed') return 'completed';
    if (match.status === 'in-progress') return 'in-progress';
    return 'upcoming';
  }, []);
  
  // Get player status class
  const getPlayerStatusClass = useCallback((playerId, match) => {
    if (match.status !== 'completed') return '';
    if (match.winner === playerId) return 'winner';
    return 'loser';
  }, []);
  
  // Filter visible matches
  const getVisibleMatches = useCallback((matches) => {
    return matches.filter(match => {
      if (match.status === 'completed' && !showCompleted) return false;
      if (match.status !== 'completed' && !showUpcoming) return false;
      return true;
    });
  }, [showCompleted, showUpcoming]);
  
  // Render player
  const renderPlayer = useCallback((player, match) => {
    if (!player) return (
      <div className="player empty">
        <div className="player-name">TBD</div>
      </div>
    );
    
    const isHighlighted = highlightedPlayer === player.id;
    const isHovered = hoveredPlayer === player.id;
    const statusClass = getPlayerStatusClass(player.id, match);
    
    return (
      <div 
        className={`player ${statusClass} ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={() => handlePlayerClick(player)}
        onMouseEnter={() => setHoveredPlayer(player.id)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        {showPlayerImages && player.avatar && (
          <div className="player-avatar">
            <img src={player.avatar} alt={player.name} />
          </div>
        )}
        
        <div className="player-info">
          <div className="player-name">
            {player.name}
            {player.seed && <span className="player-seed">#{player.seed}</span>}
          </div>
          
          {showPlayerStats && (
            <div className="player-stats">
              {tournament.players.find(p => p.id === player.id)?.rating && (
                <span className="player-rating">
                  Rating: {tournament.players.find(p => p.id === player.id)?.rating}
                </span>
              )}
              
              {tournament.players.find(p => p.id === player.id)?.wins !== undefined && (
                <span className="player-record">
                  {tournament.players.find(p => p.id === player.id)?.wins}-
                  {tournament.players.find(p => p.id === player.id)?.losses}
                </span>
              )}
            </div>
          )}
        </div>
        
        {showScores && match.status !== 'upcoming' && (
          <div className="player-score">
            {match.games.filter(game => game.winner === player.id).length}
          </div>
        )}
      </div>
    );
  }, [
    highlightedPlayer, 
    hoveredPlayer, 
    showPlayerImages, 
    showPlayerStats, 
    showScores, 
    tournament.players, 
    getPlayerStatusClass, 
    handlePlayerClick
  ]);
  
  // Render match
  const renderMatch = useCallback((match) => {
    const isExpanded = expandedMatch === match.id;
    const isHighlighted = highlightedMatch === match.id;
    const isHovered = hoveredMatch === match.id;
    const statusClass = getMatchStatusClass(match);
    
    return (
      <div 
        className={`match ${statusClass} ${isExpanded ? 'expanded' : ''} ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''}`}
        data-match-id={match.id}
        onClick={() => handleMatchClick(match)}
        onMouseEnter={() => setHoveredMatch(match.id)}
        onMouseLeave={() => setHoveredMatch(null)}
      >
        <div className="match-header">
          <div className="match-id">Match #{match.id.split('-')[1]}</div>
          
          {showMatchTimes && (
            <div className="match-time">
              {match.status === 'upcoming' && formatDate(match.startTime)}
              {match.status === 'in-progress' && 'In Progress'}
              {match.status === 'completed' && formatDate(match.endTime)}
            </div>
          )}
        </div>
        
        <div className="match-players">
          {renderPlayer(match.player1, match)}
          {renderPlayer(match.player2, match)}
        </div>
        
        {isExpanded && match.games.length > 0 && (
          <div className="match-games">
            <h4>Games</h4>
            <div className="games-list">
              {match.games.map(game => (
                <div key={game.id} className="game">
                  <div className="game-id">Game {game.id.split('-')[1]}</div>
                  <div className="game-result">
                    {game.winner ? (
                      <>
                        Winner: {tournament.players.find(p => p.id === game.winner)?.name}
                        {game.score && <span className="game-score">{game.score}</span>}
                      </>
                    ) : (
                      'In Progress'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [
    expandedMatch, 
    highlightedMatch, 
    hoveredMatch, 
    showMatchTimes, 
    tournament.players, 
    getMatchStatusClass, 
    handleMatchClick, 
    renderPlayer, 
    formatDate
  ]);
  
  // Render round
  const renderRound = useCallback((round) => {
    const isVisible = visibleRounds.includes(round.id);
    const visibleMatches = getVisibleMatches(round.matches);
    
    return (
      <div className={`round ${isVisible ? 'visible' : 'hidden'}`} key={round.id}>
        <div 
          className="round-header"
          onClick={() => toggleRound(round.id)}
        >
          <h3>{round.name}</h3>
          <div className="round-toggle">
            {isVisible ? '▼' : '►'}
          </div>
        </div>
        
        {isVisible && (
          <div className="round-matches">
            {visibleMatches.map(match => (
              <div className="match-container" key={match.id}>
                {renderMatch(match)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [visibleRounds, getVisibleMatches, renderMatch, toggleRound]);
  
  return (
    <div className={`tournament-bracket ${isAncientTheme ? 'ancient-theme' : ''} ${theme} ${layout}`}>
      <div className="bracket-header">
        <h2>{tournament.name}</h2>
        
        <div className="tournament-info">
          <div className="tournament-dates">
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </div>
          
          <div className="tournament-status">
            Status: <span className={`status-${tournament.status}`}>{tournament.status}</span>
          </div>
          
          <div className="tournament-format">
            Format: {tournament.format}
          </div>
        </div>
        
        <div className="bracket-controls">
          <div className="view-controls">
            <button 
              className="control-button"
              onClick={resetView}
              title="Reset View"
            >
              Reset View
            </button>
            
            <div className="zoom-controls">
              <button 
                className="zoom-button"
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                title="Zoom Out"
              >
                -
              </button>
              
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              
              <button 
                className="zoom-button"
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="display-controls">
            <label className="control-checkbox">
              <input 
                type="checkbox" 
                checked={autoScroll}
                onChange={toggleAutoScroll}
              />
              Auto-scroll
            </label>
            
            <label className="control-checkbox">
              <input 
                type="checkbox" 
                checked={showCompleted}
                onChange={toggleShowCompleted}
              />
              Completed Matches
            </label>
            
            <label className="control-checkbox">
              <input 
                type="checkbox" 
                checked={showUpcoming}
                onChange={toggleShowUpcoming}
              />
              Upcoming Matches
            </label>
            
            <label className="control-checkbox">
              <input 
                type="checkbox" 
                checked={showPlayerImages}
                onChange={toggleShowPlayerImages}
              />
              Player Images
            </label>
            
            <label className="control-checkbox">
              <input 
                type="checkbox" 
                checked={showMatchTimes}
                onChange={toggleShowMatchTimes}
              />
              Match Times
            </label>
          </div>
        </div>
      </div>
      
      <div 
        className="bracket-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div 
          className="bracket"
          ref={bracketRef}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          {tournament.rounds.map(round => renderRound(round))}
        </div>
      </div>
      
      <div className="bracket-legend">
        <div className="legend-item">
          <div className="legend-color completed"></div>
          <div className="legend-label">Completed</div>
        </div>
        
        <div className="legend-item">
          <div className="legend-color in-progress"></div>
          <div className="legend-label">In Progress</div>
        </div>
        
        <div className="legend-item">
          <div className="legend-color upcoming"></div>
          <div className="legend-label">Upcoming</div>
        </div>
        
        <div className="legend-item">
          <div className="legend-color winner"></div>
          <div className="legend-label">Winner</div>
        </div>
        
        <div className="legend-item">
          <div className="legend-color loser"></div>
          <div className="legend-label">Loser</div>
        </div>
      </div>
      
      <style jsx>{`
        .tournament-bracket {
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
        
        .bracket-header {
          margin-bottom: 20px;
        }
        
        .tournament-info {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .tournament-status .status-completed {
          color: var(--color-success);
        }
        
        .tournament-status .status-in-progress {
          color: var(--color-warning);
        }
        
        .tournament-status .status-upcoming {
          color: var(--color-info);
        }
        
        .bracket-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
          padding: 10px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
        }
        
        .view-controls, .display-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        
        .control-button {
          padding: 8px 12px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .control-button:hover {
          background-color: ${isAncientTheme ? '#a89a6a' : '#7b81ff'};
        }
        
        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .zoom-button {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .zoom-level {
          width: 50px;
          text-align: center;
        }
        
        .control-checkbox {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .bracket-container {
          overflow: hidden;
          position: relative;
          height: 600px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          cursor: ${isDragging ? 'grabbing' : 'grab'};
        }
        
        .bracket {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          transition: transform 0.1s ease-out;
          display: flex;
          flex-direction: ${layout === 'horizontal' ? 'row' : 'column'};
          gap: 30px;
          padding: 30px;
        }
        
        .round {
          display: flex;
          flex-direction: column;
          gap: 15px;
          min-width: 300px;
        }
        
        .round.hidden .round-matches {
          display: none;
        }
        
        .round-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .round-header h3 {
          margin: 0;
        }
        
        .round-toggle {
          font-size: 0.8rem;
        }
        
        .round-matches {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .match-container {
          display: flex;
          justify-content: center;
        }
        
        .match {
          width: 100%;
          max-width: 400px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .match:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .match.highlighted {
          box-shadow: 0 0 0 3px ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }
        
        .match.completed {
          border-left: 4px solid var(--color-success);
        }
        
        .match.in-progress {
          border-left: 4px solid var(--color-warning);
          animation: ${animateProgress ? 'pulse 2s infinite' : 'none'};
        }
        
        .match.upcoming {
          border-left: 4px solid var(--color-info);
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--color-warning-rgb), 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(var(--color-warning-rgb), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--color-warning-rgb), 0); }
        }
        
        .match-header {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          font-size: 0.8rem;
        }
        
        .match-players {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        
        .player {
          display: flex;
          align-items: center;
          padding: 10px;
          gap: 10px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
        }
        
        .player.empty {
          opacity: 0.5;
          font-style: italic;
        }
        
        .player.winner {
          background-color: ${isAncientTheme ? '#3a4a28' : '#e8f5e9'};
        }
        
        .player.loser {
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
        }
        
        .player.highlighted {
          box-shadow: 0 0 0 2px ${isAncientTheme ? '#d4b86a' : '#646cff'} inset;
        }
        
        .player-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .player-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .player-info {
          flex: 1;
          min-width: 0;
        }
        
        .player-name {
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .player-seed {
          margin-left: 5px;
          font-weight: normal;
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }
        
        .player-stats {
          display: flex;
          gap: 10px;
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }
        
        .player-score {
          font-weight: bold;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 50%;
        }
        
        .match-games {
          padding: 10px;
          border-top: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
        }
        
        .match-games h4 {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
        }
        
        .games-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .game {
          display: flex;
          justify-content: space-between;
          padding: 5px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .game-score {
          margin-left: 5px;
          font-weight: bold;
        }
        
        .bracket-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 20px;
          padding: 10px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .legend-color.completed {
          background-color: var(--color-success);
        }
        
        .legend-color.in-progress {
          background-color: var(--color-warning);
        }
        
        .legend-color.upcoming {
          background-color: var(--color-info);
        }
        
        .legend-color.winner {
          background-color: ${isAncientTheme ? '#3a4a28' : '#e8f5e9'};
        }
        
        .legend-color.loser {
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
        }
        
        /* Theme: Minimal */
        .tournament-bracket.minimal .match {
          box-shadow: none;
          border: 1px solid ${isAncientTheme ? '#3a3828' : '#e0e0e0'};
        }
        
        .tournament-bracket.minimal .round-header {
          box-shadow: none;
          border: 1px solid ${isAncientTheme ? '#3a3828' : '#e0e0e0'};
        }
        
        /* Theme: Classic */
        .tournament-bracket.classic .match {
          border-radius: 0;
          border: 2px solid ${isAncientTheme ? '#8a7e55' : '#646cff'};
        }
        
        .tournament-bracket.classic .round-header {
          border-radius: 0;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
        }
        
        .tournament-bracket.classic .round-header h3 {
          color: white;
        }
        
        /* Theme: Ancient */
        .tournament-bracket.ancient .match {
          background-color: ${isAncientTheme ? '#2c2b20' : '#f5f5f5'};
          border: 2px solid ${isAncientTheme ? '#8a7e55' : '#646cff'};
          border-radius: 0;
          box-shadow: 4px 4px 0 ${isAncientTheme ? '#1a1914' : '#333333'};
        }
        
        .tournament-bracket.ancient .round-header {
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border-radius: 0;
          box-shadow: 4px 4px 0 ${isAncientTheme ? '#1a1914' : '#333333'};
        }
        
        .tournament-bracket.ancient .round-header h3 {
          color: white;
        }
        
        .tournament-bracket.ancient .player {
          border-bottom: 1px solid ${isAncientTheme ? '#3a3828' : '#e0e0e0'};
        }
        
        /* Vertical Layout */
        .tournament-bracket.vertical .bracket {
          flex-direction: column;
        }
        
        .tournament-bracket.vertical .round {
          min-width: auto;
          width: 100%;
        }
        
        .tournament-bracket.vertical .round-matches {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .ancient-theme h2, .ancient-theme h3, .ancient-theme h4 {
          font-family: 'Cinzel', serif;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .tournament-info {
            flex-direction: column;
            gap: 10px;
          }
          
          .bracket-controls {
            flex-direction: column;
            gap: 10px;
          }
          
          .bracket-container {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(TournamentBracket);