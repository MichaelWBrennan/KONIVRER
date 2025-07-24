import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Camera,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Edit,
  Share2,
  Eye,
  BarChart3,
  Users,
  Clock,
  Zap,
  Star,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Settings,
  Monitor,
  Scissors,
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward
} from 'lucide-react';

/**
 * Content Creation & Streaming Tools
 * Professional-grade tools for tournament content creation
 */
const ContentCreationTools = ({ tournament, matches, players }) => {
  const [activeTab, setActiveTab] = useState('recording');
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [recordedClips, setRecordedClips] = useState([]);
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    duration: 0,
    chatMessages: 0
  });

  const tabs = [
    {
      id: 'recording',
      name: 'Recording',
      icon: <Video className="w-5 h-5" />,
      description: 'Record and edit match highlights'
    },
    {
      id: 'streaming',
      name: 'Live Stream',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Live streaming with overlays'
    },
    {
      id: 'highlights',
      name: 'Auto Highlights',
      icon: <Zap className="w-5 h-5" />,
      description: 'AI-generated highlight reels'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Content performance metrics'
    },
    {
      id: 'commentary',
      name: 'Commentary',
      icon: <Mic className="w-5 h-5" />,
      description: 'Commentator assistance tools'
    },
    {
      id: 'viewer',
      name: 'Viewer Tools',
      icon: <Eye className="w-5 h-5" />,
      description: 'Interactive viewer features'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-[OpenDyslexic] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Content Creation Studio
          </h1>
          <p className="text-gray-300 text-lg">
            Professional streaming and content creation tools
          </p>
          <div className="mt-4 bg-green-600/20 border border-green-500 rounded-lg p-3 inline-block">
            <span className="text-green-300 font-semibold">All Premium Features Free</span>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {tab.icon}
                <h3 className="font-semibold mt-2 text-sm">{tab.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{tab.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            {activeTab === 'recording' && (
              <RecordingStudio 
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                recordedClips={recordedClips}
                setRecordedClips={setRecordedClips}
                tournament={tournament}
              />
            )}
            {activeTab === 'streaming' && (
              <LiveStreamingStudio 
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
                streamStats={streamStats}
                setStreamStats={setStreamStats}
                tournament={tournament}
              />
            )}
            {activeTab === 'highlights' && (
              <AutoHighlightGenerator matches={matches} players={players} />
            )}
            {activeTab === 'analytics' && (
              <ContentAnalytics recordedClips={recordedClips} streamStats={streamStats} />
            )}
            {activeTab === 'commentary' && (
              <CommentaryTools tournament={tournament} matches={matches} players={players} />
            )}
            {activeTab === 'viewer' && (
              <ViewerInteractionTools tournament={tournament} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Recording Studio Component
const RecordingStudio = ({ 
  isRecording, 
  setIsRecording, 
  recordedClips, 
  setRecordedClips,
  tournament 
}) => {
  const [recordingSettings, setRecordingSettings] = useState({
    quality: '1080p',
    fps: 60,
    audio: true,
    autoSave: true
  });
  const [currentRecording, setCurrentRecording] = useState(null);
  const videoRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: 1920, 
          height: 1080,
          frameRate: recordingSettings.fps
        },
        audio: recordingSettings.audio
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const newClip = {
          id: Date.now(),
          url,
          duration: Date.now() - currentRecording.startTime,
          timestamp: new Date(),
          title: `Match Recording ${recordedClips.length + 1}`,
          size: blob.size
        };
        
        setRecordedClips(prev => [...prev, newClip]);
        setCurrentRecording(null);
      };
      
      mediaRecorder.start();
      setCurrentRecording({
        recorder: mediaRecorder,
        startTime: Date.now()
      });
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [recordingSettings, recordedClips.length, setRecordedClips, setIsRecording]);

  const stopRecording = useCallback(() => {
    if (currentRecording) {
      currentRecording.recorder.stop();
      setIsRecording(false);
    }
  }, [currentRecording, setIsRecording]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recording Studio</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Controls */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recording Controls</h3>
          
          <div className="space-y-4">
            {/* Record Button */}
            <div className="text-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8" />
                ) : (
                  <Video className="w-8 h-8" />
                )}
              </button>
              <p className="mt-2 text-sm text-gray-400">
                {isRecording ? 'Recording...' : 'Start Recording'}
              </p>
            </div>
            
            {/* Recording Settings */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Quality</label>
                <select
                  value={recordingSettings.quality}
                  onChange={(e) => setRecordingSettings(prev => ({
                    ...prev,
                    quality: e.target.value
                  }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="1440p">1440p QHD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Frame Rate</label>
                <select
                  value={recordingSettings.fps}
                  onChange={(e) => setRecordingSettings(prev => ({
                    ...prev,
                    fps: parseInt(e.target.value)
                  }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                  <option value={120}>120 FPS</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Include Audio</span>
                <button
                  onClick={() => setRecordingSettings(prev => ({
                    ...prev,
                    audio: !prev.audio
                  }))}
                  className={`px-3 py-1 rounded ${
                    recordingSettings.audio
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {recordingSettings.audio ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recorded Clips */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recorded Clips</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recordedClips.map(clip => (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{clip.title}</h4>
                  <span className="text-xs text-gray-400">
                    {formatFileSize(clip.size)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>{formatDuration(clip.duration)}</span>
                  <span>{clip.timestamp.toLocaleTimeString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors">
                    <Play className="w-3 h-3 mr-1 inline" />
                    Play
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors">
                    <Edit className="w-3 h-3 mr-1 inline" />
                    Edit
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors">
                    <Download className="w-3 h-3 mr-1 inline" />
                    Export
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {recordedClips.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recordings yet</p>
              <p className="text-sm">Start recording to see clips here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Live Streaming Studio Component
const LiveStreamingStudio = ({ 
  isStreaming, 
  setIsStreaming, 
  streamStats, 
  setStreamStats,
  tournament 
}) => {
  const [streamSettings, setStreamSettings] = useState({
    platform: 'twitch',
    quality: '1080p',
    bitrate: 6000,
    overlays: true
  });
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamStats(prev => ({
          ...prev,
          duration: prev.duration + 1,
          viewers: prev.viewers + Math.floor(Math.random() * 3) - 1,
          chatMessages: prev.chatMessages + Math.floor(Math.random() * 2)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, setStreamStats]);

  const startStream = useCallback(() => {
    setIsStreaming(true);
    setStreamStats({ viewers: 1, duration: 0, chatMessages: 0 });
  }, [setIsStreaming, setStreamStats]);

  const stopStream = useCallback(() => {
    setIsStreaming(false);
  }, [setIsStreaming]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Live Streaming Studio</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Controls */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stream Controls</h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={isStreaming ? stopStream : startStream}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isStreaming
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Square className="w-4 h-4 mr-2 inline" />
                    Stop Stream
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 inline" />
                    Go Live
                  </>
                )}
              </button>
            </div>
            
            {isStreaming && (
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-gray-800/50 rounded">
                  <p className="text-gray-400">Viewers</p>
                  <p className="font-bold text-green-400">{streamStats.viewers}</p>
                </div>
                <div className="p-2 bg-gray-800/50 rounded">
                  <p className="text-gray-400">Duration</p>
                  <p className="font-bold text-blue-400">{formatDuration(streamStats.duration * 1000)}</p>
                </div>
                <div className="p-2 bg-gray-800/50 rounded">
                  <p className="text-gray-400">Messages</p>
                  <p className="font-bold text-purple-400">{streamStats.chatMessages}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select
                  value={streamSettings.platform}
                  onChange={(e) => setStreamSettings(prev => ({
                    ...prev,
                    platform: e.target.value
                  }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="twitch">Twitch</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook Gaming</option>
                  <option value="custom">Custom RTMP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quality</label>
                <select
                  value={streamSettings.quality}
                  onChange={(e) => setStreamSettings(prev => ({
                    ...prev,
                    quality: e.target.value
                  }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Preview */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stream Preview</h3>
          
          <div className="bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              <Monitor className="w-16 h-16 text-gray-600" />
              
              {isStreaming && (
                <div className="absolute inset-0">
                  {/* Stream Overlays */}
                  <div className="absolute top-4 left-4 bg-red-600 px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-gray-900/80 px-2 py-1 rounded text-xs">
                    {streamStats.viewers} viewers
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-900/80 p-2 rounded">
                      <p className="text-sm font-medium">{tournament?.name || 'Tournament'}</p>
                      <p className="text-xs text-gray-300">Round {tournament?.currentRound || 1}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overlays</span>
              <button
                onClick={() => setStreamSettings(prev => ({
                  ...prev,
                  overlays: !prev.overlays
                }))}
                className={`px-2 py-1 rounded text-xs ${
                  streamSettings.overlays
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {streamSettings.overlays ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Bitrate</span>
              <span className="text-gray-400">{streamSettings.bitrate} kbps</span>
            </div>
          </div>
        </div>

        {/* Chat Integration */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Live Chat</h3>
          
          <div className="bg-gray-800/50 rounded-lg p-3 h-64 overflow-y-auto mb-3">
            {isStreaming ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-purple-400 font-medium">Viewer{i + 1}:</span>
                    <span className="ml-2 text-gray-300">
                      {['Great match!', 'Amazing play!', 'Who\'s winning?', 'Love this tournament!'][i % 4]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Chat will appear when live</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
              disabled={!isStreaming}
            />
            <button
              disabled={!isStreaming}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auto Highlight Generator Component
const AutoHighlightGenerator = ({ matches, players }) => {
  const [highlights, setHighlights] = useState([]);
  const [generatingHighlights, setGeneratingHighlights] = useState(false);
  const [highlightSettings, setHighlightSettings] = useState({
    minDuration: 30,
    maxDuration: 180,
    includeComeback: true,
    includeUpsets: true,
    includeCloseGames: true
  });

  const generateHighlights = useCallback(async () => {
    setGeneratingHighlights(true);
    
    // Simulate AI highlight generation
    setTimeout(() => {
      const mockHighlights = [
        {
          id: 1,
          title: 'Amazing Comeback Victory',
          description: 'Player recovers from 1 life to win the match',
          duration: 45,
          timestamp: '12:34',
          excitement: 95,
          type: 'comeback'
        },
        {
          id: 2,
          title: 'Perfect Curve Play',
          description: 'Flawless execution of turn 1-4 plays',
          duration: 32,
          timestamp: '08:15',
          excitement: 78,
          type: 'skillful'
        },
        {
          id: 3,
          title: 'Upset Victory',
          description: 'Lower-rated player defeats tournament favorite',
          duration: 67,
          timestamp: '25:42',
          excitement: 88,
          type: 'upset'
        }
      ];
      
      setHighlights(mockHighlights);
      setGeneratingHighlights(false);
    }, 3000);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">AI Highlight Generator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Settings */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Highlight Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration Range: {highlightSettings.minDuration}s - {highlightSettings.maxDuration}s
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={highlightSettings.minDuration}
                    onChange={(e) => setHighlightSettings(prev => ({
                      ...prev,
                      minDuration: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">Min</span>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="60"
                    max="300"
                    value={highlightSettings.maxDuration}
                    onChange={(e) => setHighlightSettings(prev => ({
                      ...prev,
                      maxDuration: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">Max</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Include Types:</h4>
              {Object.entries(highlightSettings).filter(([key]) => 
                ['includeComeback', 'includeUpsets', 'includeCloseGames'].includes(key)
              ).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setHighlightSettings(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">
                    {key.replace('include', '').replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
            
            <button
              onClick={generateHighlights}
              disabled={generatingHighlights}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                generatingHighlights
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {generatingHighlights ? (
                <>
                  <Zap className="w-4 h-4 mr-2 inline animate-spin" />
                  Generating Highlights...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2 inline" />
                  Generate Highlights
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Highlights */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Generated Highlights</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {highlights.map(highlight => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{highlight.title}</h4>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-400">{highlight.excitement}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-2">{highlight.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{highlight.duration}s duration</span>
                  <span>@ {highlight.timestamp}</span>
                  <span className="capitalize bg-purple-600/20 px-2 py-1 rounded">
                    {highlight.type}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors">
                    <Play className="w-3 h-3 mr-1 inline" />
                    Preview
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors">
                    <Download className="w-3 h-3 mr-1 inline" />
                    Export
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors">
                    <Share2 className="w-3 h-3 mr-1 inline" />
                    Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {highlights.length === 0 && !generatingHighlights && (
            <div className="text-center py-8 text-gray-400">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No highlights generated yet</p>
              <p className="text-sm">Click generate to create AI highlights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Content Analytics Component
const ContentAnalytics = ({ recordedClips, streamStats }) => {
  const analyticsData = {
    totalViews: 15420,
    totalWatchTime: 8760, // minutes
    averageViewDuration: 4.2, // minutes
    engagement: 78, // percentage
    topClips: [
      { title: 'Amazing Comeback', views: 3420, likes: 156 },
      { title: 'Perfect Play', views: 2890, likes: 134 },
      { title: 'Tournament Highlight', views: 2156, likes: 98 }
    ]
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Content Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Stats */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          
          <div className="space-y-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{analyticsData.totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Views</p>
            </div>
            
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{Math.floor(analyticsData.totalWatchTime / 60)}h</p>
              <p className="text-sm text-gray-400">Watch Time</p>
            </div>
            
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">{analyticsData.engagement}%</p>
              <p className="text-sm text-gray-400">Engagement</p>
            </div>
            
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{recordedClips.length}</p>
              <p className="text-sm text-gray-400">Total Clips</p>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium">Views</p>
                <p className="text-sm text-gray-400">vs last week</p>
              </div>
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+23%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium">Engagement</p>
                <p className="text-sm text-gray-400">vs last week</p>
              </div>
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium">Subscribers</p>
                <p className="text-sm text-gray-400">vs last week</p>
              </div>
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Top Clips</h3>
          
          <div className="space-y-3">
            {analyticsData.topClips.map((clip, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{clip.title}</h4>
                  <span className="text-xs bg-purple-600/20 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>{clip.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    <span>{clip.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Commentary Tools Component
const CommentaryTools = ({ tournament, matches, players }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [commentaryNotes, setCommentaryNotes] = useState('');
  const [playerStats, setPlayerStats] = useState({});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Commentator Assistance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Selection & Stats */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Match Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Match</label>
              <select
                value={selectedMatch || ''}
                onChange={(e) => setSelectedMatch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Choose a match...</option>
                {matches.slice(0, 5).map((match, index) => (
                  <option key={index} value={index}>
                    Match {index + 1} - Table {index + 1}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedMatch !== null && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Player Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Player 1</p>
                      <p className="font-medium">John Doe</p>
                      <p className="text-gray-400">Rating: 1850</p>
                      <p className="text-gray-400">Record: 4-1</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Player 2</p>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-gray-400">Rating: 1720</p>
                      <p className="text-gray-400">Record: 3-2</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Deck Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-purple-400">Control Deck</p>
                      <p className="text-gray-400">Win Rate: 68%</p>
                    </div>
                    <div>
                      <p className="text-red-400">Aggro Deck</p>
                      <p className="text-gray-400">Win Rate: 72%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-2">Matchup Analysis</h4>
                  <p className="text-sm text-gray-400">
                    Historically, this matchup favors the aggro player 60-40. 
                    Key cards to watch for include counterspells and removal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Commentary Notes */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Commentary Notes</h3>
          
          <div className="space-y-4">
            <textarea
              value={commentaryNotes}
              onChange={(e) => setCommentaryNotes(e.target.value)}
              placeholder="Add commentary notes, talking points, or observations..."
              className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 resize-none"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                Save Notes
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors">
                Export
              </button>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Facts</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Tournament: {tournament?.name || 'Current Tournament'}</li>
                <li>• Round: {tournament?.currentRound || 1}</li>
                <li>• Format: {tournament?.format || 'Standard'}</li>
                <li>• Players: {players.length}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Viewer Interaction Tools Component
const ViewerInteractionTools = ({ tournament }) => {
  const [polls, setPolls] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);

  const createPoll = useCallback(() => {
    const newPoll = {
      id: Date.now(),
      question: 'Who will win this match?',
      options: ['Player 1', 'Player 2'],
      votes: [0, 0],
      active: true
    };
    
    setPolls(prev => [...prev, newPoll]);
    setCurrentPoll(newPoll);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Viewer Interaction</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Polls */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Polls</h3>
            <button
              onClick={createPoll}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
            >
              Create Poll
            </button>
          </div>
          
          {currentPoll ? (
            <div className="space-y-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium mb-3">{currentPoll.question}</h4>
                
                <div className="space-y-2">
                  {currentPoll.options.map((option, index) => {
                    const totalVotes = currentPoll.votes.reduce((sum, votes) => sum + votes, 0);
                    const percentage = totalVotes > 0 ? (currentPoll.votes[index] / totalVotes) * 100 : 0;
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option}</span>
                          <span>{Math.round(percentage)}% ({currentPoll.votes[index]})</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  Total votes: {currentPoll.votes.reduce((sum, votes) => sum + votes, 0)}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors">
                  End Poll
                </button>
                <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active polls</p>
              <p className="text-sm">Create a poll to engage viewers</p>
            </div>
          )}
        </div>

        {/* Predictions & Betting */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Match Predictions</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Current Match</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="font-medium">Player 1</p>
                  <p className="text-2xl font-bold text-blue-400">65%</p>
                  <p className="text-sm text-gray-400">234 predictions</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Player 2</p>
                  <p className="text-2xl font-bold text-red-400">35%</p>
                  <p className="text-sm text-gray-400">126 predictions</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Tournament Winner</h4>
              <div className="space-y-2">
                {['John Doe', 'Jane Smith', 'Bob Wilson'].map((player, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{player}</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${[45, 30, 25][index]}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{[45, 30, 25][index]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Viewer Engagement</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-gray-400">Active</p>
                  <p className="font-bold text-green-400">89</p>
                </div>
                <div>
                  <p className="text-gray-400">Predictions</p>
                  <p className="font-bold text-blue-400">360</p>
                </div>
                <div>
                  <p className="text-gray-400">Points</p>
                  <p className="font-bold text-purple-400">12.5k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility Functions
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
}

export default ContentCreationTools;