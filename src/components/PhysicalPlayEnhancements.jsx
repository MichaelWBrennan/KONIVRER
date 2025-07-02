/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Scan,
  Smartphone,
  Wifi,
  Volume2,
  VolumeX,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  Mic,
  MicOff,
  QrCode,
  NfcIcon,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Monitor,
} from 'lucide-react';

/**
 * Physical Play Enhancements Component
 * Advanced features for in-person tournament management
 */
const PhysicalPlayEnhancements = ({
  tournament,
  players,
  onUpdateTournament,
}) => {
  const [activeFeature, setActiveFeature] = useState('deck-scan');
  const [isScanning, setIsScanning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [environmentSettings, setEnvironmentSettings] = useState({
    lighting: 'normal',
    tableSpace: 'standard',
    noiseLevel: 'moderate',
  });
  const [scanResults, setScanResults] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const features = [
    {
      id: 'deck-scan',
      name: 'Deck Registration',
      icon: <Camera className="w-5 h-5" />,
      description: 'Computer vision deck scanning',
    },
    {
      id: 'nfc-pairing',
      name: 'NFC Pairing',
      icon: <NfcIcon className="w-5 h-5" />,
      description: 'Quick player pairing with NFC',
    },
    {
      id: 'voice-control',
      name: 'Voice Control',
      icon: <Mic className="w-5 h-5" />,
      description: 'Voice-controlled match reporting',
    },
    {
      id: 'venue-optimization',
      name: 'Venue Optimization',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Space and flow optimization',
    },
    {
      id: 'environmental',
      name: 'Environmental',
      icon: <Eye className="w-5 h-5" />,
      description: 'Adaptive lighting and conditions',
    },
    {
      id: 'streaming',
      name: 'Stream Integration',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Content creation tools',
    },
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
            Physical Play Enhancements
          </h1>
          <p className="text-gray-300 text-lg">
            Industry-leading tools for in-person tournament management
          </p>
          <div className="mt-4 bg-green-600/20 border border-green-500 rounded-lg p-3 inline-block">
            <span className="text-green-300 font-semibold">
              All Premium Features Free
            </span>
          </div>
        </motion.div>

        {/* Feature Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {features.map(feature => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all ${
                activeFeature === feature.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="font-semibold mt-2 text-sm">{feature.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            {activeFeature === 'deck-scan' && (
              <DeckRegistrationScanner
                isScanning={isScanning}
                setIsScanning={setIsScanning}
                scanResults={scanResults}
                setScanResults={setScanResults}
                videoRef={videoRef}
                canvasRef={canvasRef}
              />
            )}
            {activeFeature === 'nfc-pairing' && (
              <NFCPairingSystem players={players} tournament={tournament} />
            )}
            {activeFeature === 'voice-control' && (
              <VoiceControlSystem
                voiceEnabled={voiceEnabled}
                setVoiceEnabled={setVoiceEnabled}
                tournament={tournament}
                onUpdateTournament={onUpdateTournament}
              />
            )}
            {activeFeature === 'venue-optimization' && (
              <VenueOptimization tournament={tournament} players={players} />
            )}
            {activeFeature === 'environmental' && (
              <EnvironmentalAdaptation
                settings={environmentSettings}
                setSettings={setEnvironmentSettings}
              />
            )}
            {activeFeature === 'streaming' && (
              <StreamingIntegration tournament={tournament} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Deck Registration Scanner Component
const DeckRegistrationScanner = ({
  isScanning,
  setIsScanning,
  scanResults,
  setScanResults,
  videoRef,
  canvasRef,
}) => {
  const [scanMode, setScanMode] = useState('auto');
  const [confidence, setConfidence] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [setIsScanning, videoRef]);

  const stopScanning = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, [setIsScanning, videoRef]);

  const simulateCardDetection = useCallback(() => {
    // Simulate card detection for demo
    const mockCards = [
      { name: 'Lightning Bolt', set: 'M21', confidence: 0.95 },
      { name: 'Counterspell', set: 'M21', confidence: 0.88 },
      { name: 'Tarmogoyf', set: 'MM3', confidence: 0.92 },
    ];

    const randomCard = mockCards[Math.floor(Math.random() * mockCards.length)];
    setCurrentCard(randomCard);
    setConfidence(randomCard.confidence);

    setTimeout(() => {
      setScanResults(prev => [...prev, randomCard]);
      setCurrentCard(null);
    }, 2000);
  }, [setScanResults]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Computer Vision Deck Registration
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Camera Feed</h3>
            <div className="flex space-x-2">
              <button
                onClick={isScanning ? stopScanning : startScanning}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScanning
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isScanning ? (
                  <>
                    <Camera className="w-4 h-4 mr-2 inline" />
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2 inline" />
                    Start Scanning
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-purple-500 rounded-lg w-64 h-40 flex items-center justify-center">
                  <span className="text-purple-300 font-medium">
                    Position card here
                  </span>
                </div>
              </div>
            )}

            {currentCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 left-4 bg-green-600/90 rounded-lg p-3"
              >
                <p className="font-semibold">{currentCard.name}</p>
                <p className="text-sm">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              </motion.div>
            )}
          </div>

          {isScanning && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={simulateCardDetection}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Simulate Card Detection
              </button>
            </div>
          )}
        </div>

        {/* Scan Results */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Detected Cards</h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {scanResults.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-gray-400">{card.set}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400">
                    {Math.round(card.confidence * 100)}%
                  </p>
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>

          {scanResults.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Scan className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No cards detected yet</p>
              <p className="text-sm">Start scanning to detect cards</p>
            </div>
          )}

          {scanResults.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Total Cards: {scanResults.length}
                </span>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors">
                    Export List
                  </button>
                  <button
                    onClick={() => setScanResults([])}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// NFC Pairing System Component
const NFCPairingSystem = ({ players, tournament }) => {
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [pairedPlayers, setPairedPlayers] = useState([]);
  const [scanningFor, setScanningFor] = useState(null);

  const checkNFCSupport = useCallback(() => {
    if ('NDEFReader' in window) {
      setNfcEnabled(true);
    } else {
      console.log('NFC not supported on this device');
    }
  }, []);

  useEffect(() => {
    checkNFCSupport();
  }, [checkNFCSupport]);

  const startNFCPairing = useCallback(
    async playerId => {
      if (!nfcEnabled) return;

      try {
        setScanningFor(playerId);
        // Simulate NFC pairing
        setTimeout(() => {
          const opponent = players.find(p => p.id !== playerId);
          if (opponent) {
            setPairedPlayers(prev => [
              ...prev,
              { player1: playerId, player2: opponent.id },
            ]);
          }
          setScanningFor(null);
        }, 2000);
      } catch (error) {
        console.error('NFC pairing error:', error);
        setScanningFor(null);
      }
    },
    [nfcEnabled, players],
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">NFC Quick Pairing</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NFC Status */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <NfcIcon className="w-5 h-5 mr-2" />
            NFC Status
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span>NFC Support</span>
              <div className="flex items-center">
                {nfcEnabled ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-400">Available</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-400">Not Available</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span>Active Pairings</span>
              <span className="font-semibold">{pairedPlayers.length}</span>
            </div>

            {!nfcEnabled && (
              <div className="p-3 bg-yellow-600/20 border border-yellow-500 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  NFC not supported on this device. Use QR codes as alternative.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Player Pairing */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Pairing</h3>

          <div className="space-y-3">
            {players.slice(0, 6).map(player => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-gray-400">
                    Rating: {Math.round(player.rating || 1500)}
                  </p>
                </div>

                <button
                  onClick={() => startNFCPairing(player.id)}
                  disabled={!nfcEnabled || scanningFor === player.id}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    scanningFor === player.id
                      ? 'bg-yellow-600 text-white'
                      : nfcEnabled
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {scanningFor === player.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 inline animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <NfcIcon className="w-3 h-3 mr-1 inline" />
                      Pair
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paired Players */}
      {pairedPlayers.length > 0 && (
        <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Pairings</h3>
          <div className="space-y-3">
            {pairedPlayers.map((pairing, index) => {
              const player1 = players.find(p => p.id === pairing.player1);
              const player2 = players.find(p => p.id === pairing.player2);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="text-center mr-4">
                      <p className="font-medium">{player1?.name}</p>
                      <p className="text-sm text-gray-400">
                        {Math.round(player1?.rating || 1500)}
                      </p>
                    </div>
                    <div className="mx-4 text-purple-400">VS</div>
                    <div className="text-center ml-4">
                      <p className="font-medium">{player2?.name}</p>
                      <p className="text-sm text-gray-400">
                        {Math.round(player2?.rating || 1500)}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors">
                      Confirm
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Voice Control System Component
const VoiceControlSystem = ({
  voiceEnabled,
  setVoiceEnabled,
  tournament,
  onUpdateTournament,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceCommands, setVoiceCommands] = useState([]);

  const startListening = useCallback(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      setRecognizedText(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const processVoiceCommand = useCallback(command => {
    const lowerCommand = command.toLowerCase();
    let action = null;

    if (lowerCommand.includes('player') && lowerCommand.includes('won')) {
      action = 'Record player win';
    } else if (
      lowerCommand.includes('match') &&
      lowerCommand.includes('result')
    ) {
      action = 'Record match result';
    } else if (
      lowerCommand.includes('next') &&
      lowerCommand.includes('round')
    ) {
      action = 'Advance to next round';
    } else if (
      lowerCommand.includes('time') &&
      lowerCommand.includes('extension')
    ) {
      action = 'Grant time extension';
    }

    if (action) {
      setLastCommand(command);
      setVoiceCommands(prev => [
        ...prev,
        { command, action, timestamp: new Date() },
      ]);
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Voice-Controlled Match Reporting
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Control Interface */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Voice Control</h3>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                voiceEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2 inline" />
                  Enabled
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 mr-2 inline" />
                  Disabled
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!voiceEnabled}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : voiceEnabled
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
              <p className="mt-2 text-sm text-gray-400">
                {isListening ? 'Listening...' : 'Click to start listening'}
              </p>
            </div>

            {recognizedText && (
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Recognized:</p>
                <p className="font-medium">{recognizedText}</p>
              </div>
            )}

            {lastCommand && (
              <div className="p-3 bg-green-600/20 border border-green-500 rounded-lg">
                <p className="text-sm text-green-400 mb-1">Last Command:</p>
                <p className="font-medium">{lastCommand}</p>
              </div>
            )}
          </div>
        </div>

        {/* Command History */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Command History</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {voiceCommands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-300">
                    {cmd.action}
                  </span>
                  <span className="text-xs text-gray-400">
                    {cmd.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{cmd.command}</p>
              </motion.div>
            ))}
          </div>

          {voiceCommands.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No voice commands yet</p>
              <p className="text-sm">Start speaking to see commands here</p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Command Reference */}
      <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Voice Command Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-purple-300">Match Results</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>"Player [name] won"</li>
              <li>"Record match result"</li>
              <li>"Match ended in draw"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-purple-300">
              Tournament Control
            </h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>"Next round"</li>
              <li>"Time extension"</li>
              <li>"Pause tournament"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Venue Optimization Component
const VenueOptimization = ({ tournament, players }) => {
  const [venueLayout, setVenueLayout] = useState('grid');
  const [tableCount, setTableCount] = useState(16);
  const [flowAnalysis, setFlowAnalysis] = useState({});

  const layoutOptions = [
    {
      id: 'grid',
      name: 'Grid Layout',
      description: 'Traditional rectangular grid',
    },
    {
      id: 'circular',
      name: 'Circular',
      description: 'Tables arranged in circles',
    },
    { id: 'pods', name: 'Pod System', description: 'Grouped table pods' },
    {
      id: 'streaming',
      name: 'Stream Optimized',
      description: 'Layout optimized for streaming',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Venue Optimization</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layout Configuration */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Layout Configuration</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Layout Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setVenueLayout(option.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      venueLayout === option.id
                        ? 'bg-purple-600/20 border-purple-500'
                        : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                    }`}
                  >
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-gray-400">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Tables: {tableCount}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={tableCount}
                onChange={e => setTableCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-sm text-gray-400">Players</p>
                <p className="text-xl font-bold">{players.length}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-sm text-gray-400">Tables Needed</p>
                <p className="text-xl font-bold">
                  {Math.ceil(players.length / 2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Venue Visualization */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Venue Layout</h3>

          <div className="bg-gray-800 rounded-lg p-4 min-h-64 flex items-center justify-center">
            <VenueLayoutVisualization
              layout={venueLayout}
              tableCount={tableCount}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 bg-gray-800/50 rounded">
              <p className="text-gray-400">Space Efficiency</p>
              <p className="font-semibold text-green-400">85%</p>
            </div>
            <div className="p-2 bg-gray-800/50 rounded">
              <p className="text-gray-400">Flow Score</p>
              <p className="font-semibold text-blue-400">92%</p>
            </div>
            <div className="p-2 bg-gray-800/50 rounded">
              <p className="text-gray-400">Judge Coverage</p>
              <p className="font-semibold text-purple-400">98%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Environmental Adaptation Component
const EnvironmentalAdaptation = ({ settings, setSettings }) => {
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Environmental Adaptation</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lighting Conditions */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Lighting
          </h3>

          <div className="space-y-3">
            {['dim', 'normal', 'bright'].map(level => (
              <button
                key={level}
                onClick={() => updateSetting('lighting', level)}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  settings.lighting === level
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <p className="font-medium capitalize">{level}</p>
                <p className="text-xs text-gray-400">
                  {level === 'dim' && 'Low light conditions'}
                  {level === 'normal' && 'Standard venue lighting'}
                  {level === 'bright' && 'Well-lit environment'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Table Space */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Table Space
          </h3>

          <div className="space-y-3">
            {['compact', 'standard', 'spacious'].map(space => (
              <button
                key={space}
                onClick={() => updateSetting('tableSpace', space)}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  settings.tableSpace === space
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <p className="font-medium capitalize">{space}</p>
                <p className="text-xs text-gray-400">
                  {space === 'compact' && 'Limited table space'}
                  {space === 'standard' && 'Normal table dimensions'}
                  {space === 'spacious' && 'Large table areas'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Noise Level */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Noise Level
          </h3>

          <div className="space-y-3">
            {['quiet', 'moderate', 'loud'].map(noise => (
              <button
                key={noise}
                onClick={() => updateSetting('noiseLevel', noise)}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  settings.noiseLevel === noise
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <p className="font-medium capitalize">{noise}</p>
                <p className="text-xs text-gray-400">
                  {noise === 'quiet' && 'Library-like environment'}
                  {noise === 'moderate' && 'Normal conversation level'}
                  {noise === 'loud' && 'Busy, noisy venue'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Adaptive Recommendations */}
      <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Adaptive Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2 text-green-400">Optimizations</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Increase font sizes for dim lighting</li>
              <li>• Enable high contrast mode</li>
              <li>• Adjust camera exposure settings</li>
            </ul>
          </div>

          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-400">Suggestions</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Use voice commands in noisy environments</li>
              <li>• Enable vibration notifications</li>
              <li>• Adjust table spacing for compact areas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Streaming Integration Component
const StreamingIntegration = ({ tournament }) => {
  const [streamingEnabled, setStreamingEnabled] = useState(false);
  const [featuredTable, setFeaturedTable] = useState(1);
  const [overlaySettings, setOverlaySettings] = useState({
    showPlayerNames: true,
    showRatings: true,
    showTimer: true,
    showDecklists: false,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Streaming Integration</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Configuration */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stream Configuration</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Streaming Enabled</span>
              <button
                onClick={() => setStreamingEnabled(!streamingEnabled)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  streamingEnabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {streamingEnabled ? 'On' : 'Off'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Table
              </label>
              <select
                value={featuredTable}
                onChange={e => setFeaturedTable(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Table {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Overlay Settings</h4>
              <div className="space-y-2">
                {Object.entries(overlaySettings).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={e =>
                        setOverlaySettings(prev => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stream Preview */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stream Preview</h3>

          <div
            className="bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Monitor className="w-16 h-16 text-gray-600" />

              {streamingEnabled && (
                <div className="absolute inset-0">
                  {/* Simulated stream overlay */}
                  {overlaySettings.showPlayerNames && (
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <div className="bg-blue-600/80 px-3 py-1 rounded">
                        <p className="font-semibold">Player 1</p>
                      </div>
                      <div className="bg-red-600/80 px-3 py-1 rounded">
                        <p className="font-semibold">Player 2</p>
                      </div>
                    </div>
                  )}

                  {overlaySettings.showTimer && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 px-3 py-1 rounded">
                      <p className="font-mono">25:30</p>
                    </div>
                  )}

                  {overlaySettings.showRatings && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <div className="bg-gray-900/80 px-3 py-1 rounded">
                        <p className="text-sm">Rating: 1850</p>
                      </div>
                      <div className="bg-gray-900/80 px-3 py-1 rounded">
                        <p className="text-sm">Rating: 1720</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Table {featuredTable} - Round {tournament?.currentRound || 1}
            </span>
            <div className="flex space-x-2">
              <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors">
                Go Live
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors">
                Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Venue Layout Visualization Component
const VenueLayoutVisualization = ({ layout, tableCount }) => {
  const renderLayout = () => {
    const tables = Array.from(
      { length: Math.min(tableCount, 16) },
      (_, i) => i + 1,
    );

    switch (layout) {
      case 'grid':
        return (
          <div className="grid grid-cols-4 gap-2">
            {tables.map(table => (
              <div
                key={table}
                className="w-8 h-6 bg-purple-600 rounded flex items-center justify-center text-xs"
              >
                {table}
              </div>
            ))}
          </div>
        );

      case 'circular':
        return (
          <div className="relative w-48 h-48">
            {tables.map((table, index) => {
              const angle = (index / tables.length) * 2 * Math.PI;
              const radius = 80;
              const x = Math.cos(angle) * radius + 96;
              const y = Math.sin(angle) * radius + 96;

              return (
                <div
                  key={table}
                  className="absolute w-6 h-4 bg-purple-600 rounded flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  {table}
                </div>
              );
            })}
          </div>
        );

      case 'pods':
        return (
          <div className="grid grid-cols-2 gap-8">
            {[0, 1].map(pod => (
              <div key={pod} className="grid grid-cols-2 gap-1">
                {tables.slice(pod * 8, (pod + 1) * 8).map(table => (
                  <div
                    key={table}
                    className="w-6 h-4 bg-purple-600 rounded flex items-center justify-center text-xs"
                  >
                    {table}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'streaming':
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-8 bg-yellow-600 rounded flex items-center justify-center text-xs">
                FEAT
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tables.slice(1, 10).map(table => (
                <div
                  key={table}
                  className="w-6 h-4 bg-purple-600 rounded flex items-center justify-center text-xs"
                >
                  {table}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-gray-400">Select a layout</div>;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-48">
      {renderLayout()}
    </div>
  );
};

export default PhysicalPlayEnhancements;
