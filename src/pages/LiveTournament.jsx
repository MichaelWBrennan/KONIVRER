/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Users,
  Clock,
  Trophy,
  Target,
  Zap,
  Eye,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Cast,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Activity,
  Gamepad2,
  Timer,
  Award,
  Star,
  Heart,
  ThumbsUp,
  Gift,
  Sparkles,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  WebSocketManager,
  announceToScreenReader,
  PerformanceMonitor,
} from '../utils/modernFeatures';

const LiveTournament = () => {
  const { tournamentId } = useParams();
  const { user, wsManager } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [streamQuality, setStreamQuality] = useState('auto');
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [donations, setDonations] = useState([]);

  // Streaming and broadcasting
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSettings, setStreamSettings] = useState({
    resolution: '1080p',
    bitrate: 'auto',
    fps: 60,
    audioEnabled: true,
    videoEnabled: true,
    screenShare: false,
  });

  // Real-time analytics
  const [analytics, setAnalytics] = useState({
    totalViewers: 0,
    peakViewers: 0,
    averageViewTime: 0,
    chatActivity: 0,
    reactions: 0,
    shares: 0,
  });

  const videoRef = useRef(null);
  const chatRef = useRef(null);
  const streamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    // Load tournament data from actual data source when available
    // For now, set empty states until real data is connected
    setTournament(null);
    setCurrentMatch(null);
    setViewerCount(0);
    setIsLive(false);
    setConnectionStatus('disconnected');
    setStandings([]);

    // Performance monitoring
    PerformanceMonitor.measureUserTiming('tournament_load', () => {
      console.log('Tournament loaded');
    });
  }, [tournamentId]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (wsManager && tournamentId) {
      // Subscribe to tournament updates
      wsManager.send('subscribe', {
        type: 'tournament',
        id: tournamentId,
        features: ['match_updates', 'chat', 'standings', 'analytics'],
      });

      // Listen for real-time events
      wsManager.on('match_update', data => {
        setCurrentMatch(prev => ({ ...prev, ...data }));
        announceToScreenReader(`Match update: ${data.description}`);
      });

      wsManager.on('chat_message', message => {
        setChatMessages(prev => [...prev.slice(-99), message]);
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      });

      wsManager.on('viewer_count', count => {
        setViewerCount(count);
      });

      wsManager.on('standings_update', newStandings => {
        setStandings(newStandings);
      });

      wsManager.on('reaction', reaction => {
        setReactions(prev => [
          ...prev.slice(-19),
          { ...reaction, id: Date.now() },
        ]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 3000);
      });

      wsManager.on('donation', donation => {
        setDonations(prev => [...prev.slice(-4), donation]);
        announceToScreenReader(
          `New donation: $${donation.amount} from ${donation.username}`,
        );
      });

      return () => {
        wsManager.send('unsubscribe', { type: 'tournament', id: tournamentId });
      };
    }
  }, [wsManager, tournamentId]);

  // Stream management
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: streamSettings.videoEnabled
          ? {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: streamSettings.fps },
            }
          : false,
        audio: streamSettings.audioEnabled,
      });

      setLocalStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize WebRTC for broadcasting
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      setIsStreaming(true);
      announceToScreenReader('Stream started successfully');
    } catch (error) {
      console.error('Failed to start stream:', error);
      announceToScreenReader('Failed to start stream');
    }
  };

  const stopStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsStreaming(false);
    announceToScreenReader('Stream stopped');
  };

  const toggleScreenShare = async () => {
    try {
      if (streamSettings.screenShare) {
        // Stop screen share, return to camera
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) videoTrack.stop();
        }
        await startStream();
      } else {
        // Start screen share
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        setLocalStream(screenStream);
      }

      setStreamSettings(prev => ({
        ...prev,
        screenShare: !prev.screenShare,
      }));
    } catch (error) {
      console.error('Screen share failed:', error);
    }
  };

  const sendChatMessage = message => {
    if (wsManager && message.trim()) {
      wsManager.send('chat_message', {
        tournamentId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const sendReaction = type => {
    if (wsManager) {
      wsManager.send('reaction', {
        tournamentId,
        type,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'connecting':
        return 'text-yellow-400';
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-tertiary rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-tertiary rounded w-32 mx-auto"></div>
          </div>
          <p className="text-muted mt-4">Loading tournament...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Tournament Header */}
      <div className="bg-card border-b border-color">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{tournament.name}</h1>
              <div className="flex items-center gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  <Trophy size={14} />
                  {tournament.currentRound}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {viewerCount.toLocaleString()} viewers
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Live for{' '}
                  {Math.floor(
                    (Date.now() - new Date(tournament.startTime)) / 60000,
                  )}
                  m
                </span>
                <span
                  className={`flex items-center gap-1 ${getConnectionStatusColor(connectionStatus)}`}
                >
                  {connectionStatus === 'connected' ? (
                    <Wifi size={14} />
                  ) : (
                    <WifiOff size={14} />
                  )}
                  {connectionStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-0 whitespace-nowrap rounded-full text-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              )}
              <button
                onClick={() => setShowStats(!showStats)}
                className="btn btn-secondary btn-sm"
              >
                <BarChart3 size={14} />
                Stats
              </button>
              <button
                onClick={toggleFullscreen}
                className="btn btn-secondary btn-sm"
              >
                <Maximize size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                controls={false}
              />

              {/* Stream Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Live indicator */}
                {isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-0 whitespace-nowrap rounded text-sm font-medium">
                    🔴 LIVE
                  </div>
                )}

                {/* Viewer count */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-0 whitespace-nowrap rounded text-sm">
                  <Eye size={12} className="inline mr-1" />
                  {viewerCount.toLocaleString()}
                </div>

                {/* Current match info */}
                {currentMatch && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/80 text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">
                          {currentMatch.round} - Game {currentMatch.game}
                        </span>
                        <span className="text-sm text-gray-300">
                          Turn {currentMatch.gameState.turn}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={currentMatch.player1.avatar}
                            alt={currentMatch.player1.displayName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">
                              {currentMatch.player1.displayName}
                            </div>
                            <div className="text-xs text-gray-300">
                              {currentMatch.player1.deck}
                            </div>
                          </div>
                          <div className="ml-auto text-lg font-bold">
                            {currentMatch.player1.wins}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <img
                            src={currentMatch.player2.avatar}
                            alt={currentMatch.player2.displayName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">
                              {currentMatch.player2.displayName}
                            </div>
                            <div className="text-xs text-gray-300">
                              {currentMatch.player2.deck}
                            </div>
                          </div>
                          <div className="ml-auto text-lg font-bold">
                            {currentMatch.player2.wins}
                          </div>
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="mt-2 text-center">
                        <div className="text-sm text-gray-300">
                          Time Remaining
                        </div>
                        <div className="text-lg font-mono">
                          {formatTime(currentMatch.gameState.timeRemaining)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating reactions */}
                <div className="absolute inset-0 pointer-events-none">
                  {reactions.map(reaction => (
                    <div
                      key={reaction.id}
                      className="absolute animate-bounce"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 60 + 20}%`,
                        fontSize: '2rem',
                      }}
                    >
                      {reaction.type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-gray-300"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={streamQuality}
                      onChange={e => setStreamQuality(e.target.value)}
                      className="bg-black/50 text-white border border-gray-600 rounded px-2 py-0 whitespace-nowrap text-sm"
                    >
                      <option value="auto">Auto</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                    </select>

                    <button className="btn btn-xs btn-ghost">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reaction Bar */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {['👏', '🔥', '😱', '💯', '⚡', '🏆'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-tertiary"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Tournament Info Tabs */}
            <div className="card">
              <div className="flex border-b border-color">
                {['Overview', 'Standings', 'Schedule', 'Rules'].map(tab => (
                  <button
                    key={tab}
                    className="px-4 py-0 whitespace-nowrap border-b-2 border-transparent hover:border-accent-primary transition-colors"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Tournament Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Prize Pool:</span>
                        <span className="text-green-400 font-medium">
                          {tournament.prizePool}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Organizer:</span>
                        <span>{tournament.organizer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Venue:</span>
                        <span>{tournament.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Casters</h3>
                    <div className="space-y-2">
                      {tournament.casters.map((caster, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>{caster.name}</span>
                          <span className="text-muted">{caster.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            <div className="card">
              <div className="flex items-center justify-between p-4 border-b border-color">
                <h3 className="font-semibold">Live Chat</h3>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-muted hover:text-primary"
                >
                  <MessageCircle size={16} />
                </button>
              </div>

              {showChat && (
                <>
                  <div
                    ref={chatRef}
                    className="h-64 overflow-y-auto p-4 space-y-2"
                  >
                    {chatMessages.map((message, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-accent-primary">
                          {message.username}:
                        </span>
                        <span className="ml-2">{message.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-color">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="input flex-1 text-sm"
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            sendChatMessage(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button className="btn btn-primary btn-sm">Send</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Current Standings */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Current Standings</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {standings.slice(0, 8).map(player => (
                    <div
                      key={player.rank}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 text-center font-medium ${
                            player.rank === 1
                              ? 'text-yellow-400'
                              : player.rank === 2
                                ? 'text-gray-300'
                                : player.rank === 3
                                  ? 'text-yellow-600'
                                  : ''
                          }`}
                        >
                          {player.rank}
                        </span>
                        <span>{player.player}</span>
                      </div>
                      <div className="text-muted">
                        {player.wins}-{player.losses}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            {donations.length > 0 && (
              <div className="card">
                <div className="p-4 border-b border-color">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Gift size={16} />
                    Recent Donations
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {donations.map((donation, index) => (
                    <div
                      key={index}
                      className="bg-tertiary p-2 rounded text-sm"
                    >
                      <div className="font-medium text-green-400">
                        ${donation.amount} from {donation.username}
                      </div>
                      {donation.message && (
                        <div className="text-muted mt-1">
                          {donation.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stream Controls (for streamers) */}
            {user?.roles?.includes('streamer') && (
              <div className="card">
                <div className="p-4 border-b border-color">
                  <h3 className="font-semibold">Stream Controls</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    {!isStreaming ? (
                      <button
                        onClick={startStream}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        <Play size={14} />
                        Start Stream
                      </button>
                    ) : (
                      <button
                        onClick={stopStream}
                        className="btn btn-red btn-sm flex-1"
                      >
                        <Pause size={14} />
                        Stop Stream
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setStreamSettings(prev => ({
                          ...prev,
                          videoEnabled: !prev.videoEnabled,
                        }))
                      }
                      className={`btn btn-sm flex-1 ${
                        streamSettings.videoEnabled
                          ? 'btn-secondary'
                          : 'btn-red'
                      }`}
                    >
                      {streamSettings.videoEnabled ? (
                        <Video size={14} />
                      ) : (
                        <VideoOff size={14} />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setStreamSettings(prev => ({
                          ...prev,
                          audioEnabled: !prev.audioEnabled,
                        }))
                      }
                      className={`btn btn-sm flex-1 ${
                        streamSettings.audioEnabled
                          ? 'btn-secondary'
                          : 'btn-red'
                      }`}
                    >
                      {streamSettings.audioEnabled ? (
                        <Mic size={14} />
                      ) : (
                        <MicOff size={14} />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={toggleScreenShare}
                    className="btn btn-secondary btn-sm w-full"
                  >
                    <Cast size={14} />
                    {streamSettings.screenShare ? 'Stop' : 'Start'} Screen Share
                  </button>
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Share Tournament</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="btn btn-secondary btn-sm w-full">
                  <Share2 size={14} />
                  Share on Twitter
                </button>
                <button className="btn btn-secondary btn-sm w-full">
                  <Download size={14} />
                  Copy Stream Link
                </button>
                <button className="btn btn-secondary btn-sm w-full">
                  <Sparkles size={14} />
                  Create Highlight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overlay */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Live Analytics</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="btn btn-ghost"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card">
                  <div className="p-4 text-center">
                    <TrendingUp
                      className="mx-auto text-green-400 mb-2"
                      size={24}
                    />
                    <div className="text-2xl font-bold">
                      {analytics.totalViewers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted">Total Viewers</div>
                  </div>
                </div>

                <div className="card">
                  <div className="p-4 text-center">
                    <Activity
                      className="mx-auto text-blue-400 mb-2"
                      size={24}
                    />
                    <div className="text-2xl font-bold">
                      {analytics.peakViewers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted">Peak Viewers</div>
                  </div>
                </div>

                <div className="card">
                  <div className="p-4 text-center">
                    <MessageCircle
                      className="mx-auto text-purple-400 mb-2"
                      size={24}
                    />
                    <div className="text-2xl font-bold">
                      {analytics.chatActivity}
                    </div>
                    <div className="text-sm text-muted">Chat Messages/Min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTournament;
