import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * WebRTC-powered real-time match component
 * This component enables peer-to-peer real-time matches between players
 * with video, audio, and game state synchronization.
 */
interface WebRTCMatchProps {
  matchId?: string;
  playerName?: string;
  isHost?: boolean;
  onMatchEnd?: (result: MatchResult) => void;
}

interface MatchResult {
  winner: string;
  loser: string;
  score: string;
  duration: number;
  gameActions: GameAction[];
}

interface GameAction {
  type: string;
  player: string;
  card?: string;
  target?: string;
  timestamp: number;
}

interface PeerConnection {
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
}

interface PeerMessage {
  type:
    | 'chat'
    | 'gameState'
    | 'action'
    | 'offer'
    | 'answer'
    | 'ice'
    | 'join'
    | 'leave'
    | 'ready';
  sender: string;
  content: any;
  timestamp: number;
}

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

interface GameState {
  turn: number;
  activePlayer: string;
  phase: 'setup' | 'draw' | 'main' | 'combat' | 'end';
  players: {
    [playerId: string]: {
      life: number;
      hand: string[];
      battlefield: string[];
      graveyard: string[];
      exile: string[];
      library: number;
    };
  };
  stack: StackItem[];
}

interface StackItem {
  card: string;
  controller: string;
  targets: string[];
}

const WebRTCMatch: React.FC<WebRTCMatchProps> = ({
  matchId = `match_${Math.random().toString(36).substring(2, 9)}`,
  playerName = `Player_${Math.random().toString(36).substring(2, 5)}`,
  isHost = false,
  onMatchEnd,
}) => {
  const { isAncientTheme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { sender: string; message: string; timestamp: number }[]
  >([]);
  const [messageInput, setMessageInput] = useState('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [isMatchEnded, setIsMatchEnded] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected');
  const [networkStats, setNetworkStats] = useState<{
    latency: number;
    packetLoss: number;
    bandwidth: number;
  }>({
    latency: 0,
    packetLoss: 0,
    bandwidth: 0,
  });

  // Refs
  const peerConnectionRef = useRef<PeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const gameActionsRef = useRef<GameAction[]>([]);
  const matchStartTimeRef = useRef<number | null>(null);
  const statsIntervalRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const playerIdRef = useRef<string>(
    `player_${Math.random().toString(36).substring(2, 9)}`,
  );

  // Initialize WebRTC
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitialized(false);
        setError(null);

        // Check WebRTC support
        if (!navigator.mediaDevices || !window.RTCPeerConnection) {
          throw new Error('WebRTC is not supported in your browser');
        }

        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize as host or join as guest
        if (isHost) {
          // Initialize as host
          initializeAsHost();
        } else {
          // Join as guest
          joinAsGuest();
        }

        setIsInitialized(true);
      } catch (err) {
        setError(
          `Failed to initialize WebRTC: ${err instanceof Error ? err.message : String(err)}`,
        );
        setIsInitialized(false);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.connection.close();
      }

      // Clear intervals
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [isHost, matchId]);

  // Initialize as host
  const initializeAsHost = useCallback(() => {
    // Create peer connection
    const peerConnection = createPeerConnection();

    // Create data channel
    const dataChannel = peerConnection.connection.createDataChannel(
      'gameChannel',
      {
        ordered: true,
      },
    );

    setupDataChannel(dataChannel);

    peerConnectionRef.current = {
      ...peerConnection,
      dataChannel,
    };

    // Add local player
    setPlayers([
      {
        id: playerIdRef.current,
        name: playerName,
        isHost: true,
        isReady: false,
        isConnected: true,
      },
    ]);

    // Set connection status
    setConnectionStatus('connecting');

    // In a real implementation, we would set up signaling here
    // For this demo, we'll simulate the signaling process

    console.log('Initialized as host');
  }, [playerName]);

  // Join as guest
  const joinAsGuest = useCallback(() => {
    // Create peer connection
    const peerConnection = createPeerConnection();

    peerConnectionRef.current = peerConnection;

    // Set up data channel event
    peerConnection.connection.ondatachannel = event => {
      const dataChannel = event.channel;
      setupDataChannel(dataChannel);

      if (peerConnectionRef.current) {
        peerConnectionRef.current.dataChannel = dataChannel;
      }
    };

    // Add local player
    setPlayers([
      {
        id: playerIdRef.current,
        name: playerName,
        isHost: false,
        isReady: false,
        isConnected: true,
      },
    ]);

    // Set connection status
    setConnectionStatus('connecting');

    // In a real implementation, we would set up signaling here
    // For this demo, we'll simulate the signaling process

    console.log('Initialized as guest');
  }, [playerName]);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    // Create RTCPeerConnection
    const connection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    // Add local stream tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        connection.addTrack(track, localStream);
      });
    }

    // Set up ICE candidate event
    connection.onicecandidate = event => {
      if (event.candidate) {
        // In a real implementation, we would send the ICE candidate to the peer
        // For this demo, we'll simulate the signaling process
        console.log('ICE candidate', event.candidate);
      }
    };

    // Set up ICE connection state change event
    connection.oniceconnectionstatechange = () => {
      console.log('ICE connection state', connection.iceConnectionState);

      if (
        connection.iceConnectionState === 'connected' ||
        connection.iceConnectionState === 'completed'
      ) {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      } else if (
        connection.iceConnectionState === 'disconnected' ||
        connection.iceConnectionState === 'failed'
      ) {
        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < 3) {
          reconnectAttemptsRef.current++;
          setTimeout(() => {
            // In a real implementation, we would attempt to reconnect
            // For this demo, we'll simulate the reconnection process
            console.log('Attempting to reconnect...');
            setConnectionStatus('connecting');

            // Simulate successful reconnection after a delay
            setTimeout(() => {
              setIsConnected(true);
              setConnectionStatus('connected');
            }, 2000);
          }, 1000);
        }
      }
    };

    // Set up track event
    connection.ontrack = event => {
      console.log('Track received', event.track);

      // Create remote stream if it doesn't exist
      if (!remoteStream) {
        const stream = new MediaStream();
        stream.addTrack(event.track);
        setRemoteStream(stream);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      } else {
        // Add track to existing remote stream
        remoteStream.addTrack(event.track);
      }
    };

    return { connection };
  }, [localStream, remoteStream]);

  // Set up data channel
  const setupDataChannel = useCallback(
    (dataChannel: RTCDataChannel) => {
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        console.log('Data channel opened');

        // Start network stats interval
        startNetworkStatsInterval();

        // Send join message
        sendMessage({
          type: 'join',
          sender: playerIdRef.current,
          content: {
            name: playerName,
            isHost: isHost,
          },
          timestamp: Date.now(),
        });
      };

      dataChannel.onclose = () => {
        console.log('Data channel closed');

        // Stop network stats interval
        if (statsIntervalRef.current) {
          clearInterval(statsIntervalRef.current);
        }
      };

      dataChannel.onerror = error => {
        console.error('Data channel error', error);
      };

      dataChannel.onmessage = event => {
        try {
          const message: PeerMessage = JSON.parse(event.data);
          handlePeerMessage(message);
        } catch (err) {
          console.error('Failed to parse message', err);
        }
      };
    },
    [playerName, isHost],
  );

  // Start network stats interval
  const startNetworkStatsInterval = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    statsIntervalRef.current = window.setInterval(async () => {
      if (!peerConnectionRef.current) return;

      try {
        // Get connection stats
        const stats = await peerConnectionRef.current.connection.getStats();

        let latency = 0;
        let packetLoss = 0;
        let bandwidth = 0;

        stats.forEach(report => {
          if (report.type === 'remote-inbound-rtp') {
            latency = report.roundTripTime ? report.roundTripTime * 1000 : 0;
            packetLoss = report.packetsLost
              ? (report.packetsLost / report.packetsReceived) * 100
              : 0;
          }

          if (report.type === 'outbound-rtp') {
            bandwidth = report.bytesSent ? (report.bytesSent * 8) / 1000 : 0;
          }
        });

        setNetworkStats({
          latency,
          packetLoss,
          bandwidth,
        });
      } catch (err) {
        console.error('Failed to get stats', err);
      }
    }, 1000);
  }, []);

  // Handle peer message
  const handlePeerMessage = useCallback(
    (message: PeerMessage) => {
      console.log('Received message', message);

      switch (message.type) {
        case 'chat':
          // Add chat message
          setChatMessages(prev => [
            ...prev,
            {
              sender: message.content.name,
              message: message.content.message,
              timestamp: message.timestamp,
            },
          ]);
          break;

        case 'gameState':
          // Update game state
          setGameState(message.content);
          break;

        case 'action':
          // Add game action
          const action: GameAction = message.content;
          gameActionsRef.current.push(action);

          // Update game state based on action
          // In a real implementation, we would update the game state based on the action
          // For this demo, we'll simulate the game state update
          break;

        case 'join':
          // Add player
          setPlayers(prev => {
            // Check if player already exists
            const playerExists = prev.some(p => p.id === message.sender);

            if (playerExists) {
              return prev.map(p =>
                p.id === message.sender
                  ? {
                      ...p,
                      isConnected: true,
                      name: message.content.name,
                      isHost: message.content.isHost,
                    }
                  : p,
              );
            } else {
              return [
                ...prev,
                {
                  id: message.sender,
                  name: message.content.name,
                  isHost: message.content.isHost,
                  isReady: false,
                  isConnected: true,
                },
              ];
            }
          });

          // Send current game state to new player if host
          if (isHost && gameState) {
            sendMessage({
              type: 'gameState',
              sender: playerIdRef.current,
              content: gameState,
              timestamp: Date.now(),
            });
          }

          // Send ready status
          sendMessage({
            type: 'ready',
            sender: playerIdRef.current,
            content: {
              isReady,
            },
            timestamp: Date.now(),
          });
          break;

        case 'leave':
          // Remove player
          setPlayers(prev =>
            prev.map(p =>
              p.id === message.sender ? { ...p, isConnected: false } : p,
            ),
          );
          break;

        case 'ready':
          // Update player ready status
          setPlayers(prev =>
            prev.map(p =>
              p.id === message.sender
                ? { ...p, isReady: message.content.isReady }
                : p,
            ),
          );

          // Check if all players are ready
          const allPlayersReady = players.every(
            p => p.isReady || p.id === playerIdRef.current,
          );

          if (allPlayersReady && isHost && !isMatchStarted) {
            // Start match
            startMatch();
          }
          break;

        default:
          console.warn('Unknown message type', message.type);
      }
    },
    [isHost, isMatchStarted, gameState, players, isReady],
  );

  // Send message
  const sendMessage = useCallback((message: PeerMessage) => {
    if (
      !dataChannelRef.current ||
      dataChannelRef.current.readyState !== 'open'
    ) {
      console.warn('Data channel not open');
      return;
    }

    try {
      dataChannelRef.current.send(JSON.stringify(message));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }, []);

  // Send chat message
  const sendChatMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    // Add message to local chat
    setChatMessages(prev => [
      ...prev,
      {
        sender: playerName,
        message: messageInput,
        timestamp: Date.now(),
      },
    ]);

    // Send message to peer
    sendMessage({
      type: 'chat',
      sender: playerIdRef.current,
      content: {
        name: playerName,
        message: messageInput,
      },
      timestamp: Date.now(),
    });

    // Clear input
    setMessageInput('');
  }, [messageInput, playerName]);

  // Toggle ready status
  const toggleReady = useCallback(() => {
    const newReadyStatus = !isReady;
    setIsReady(newReadyStatus);

    // Send ready status to peer
    sendMessage({
      type: 'ready',
      sender: playerIdRef.current,
      content: {
        isReady: newReadyStatus,
      },
      timestamp: Date.now(),
    });

    // Update local player
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerIdRef.current ? { ...p, isReady: newReadyStatus } : p,
      ),
    );

    // Check if all players are ready and host
    const allPlayersReady = players.every(
      p =>
        (p.id === playerIdRef.current && newReadyStatus) ||
        (p.id !== playerIdRef.current && p.isReady),
    );

    if (allPlayersReady && isHost && !isMatchStarted) {
      // Start match
      startMatch();
    }
  }, [isReady, isHost, isMatchStarted, players]);

  // Start match
  const startMatch = useCallback(() => {
    if (isMatchStarted) return;

    console.log('Starting match');

    // Set match started
    setIsMatchStarted(true);

    // Record start time
    matchStartTimeRef.current = Date.now();

    // Initialize game state
    const initialGameState: GameState = {
      turn: 1,
      activePlayer: playerIdRef.current,
      phase: 'setup',
      players: {},
      stack: [],
    };

    // Add players to game state
    players.forEach(player => {
      initialGameState.players[player.id] = {
        life: 20,
        hand: [],
        battlefield: [],
        graveyard: [],
        exile: [],
        library: 60,
      };
    });

    // Set game state
    setGameState(initialGameState);

    // Send game state to peer
    sendMessage({
      type: 'gameState',
      sender: playerIdRef.current,
      content: initialGameState,
      timestamp: Date.now(),
    });

    // Simulate game progression
    simulateGameProgression();
  }, [isMatchStarted, players]);

  // Simulate game progression
  const simulateGameProgression = useCallback(() => {
    // In a real implementation, the game would progress based on player actions
    // For this demo, we'll simulate the game progression

    // Simulate drawing cards
    setTimeout(() => {
      if (!gameState) return;

      const newGameState = { ...gameState };

      // Draw cards for each player
      Object.keys(newGameState.players).forEach(playerId => {
        const player = newGameState.players[playerId];

        // Draw 7 cards
        for (let i = 0; i < 7; i++) {
          player.hand.push(
            `card_${Math.random().toString(36).substring(2, 9)}`,
          );
          player.library--;
        }
      });

      // Update phase
      newGameState.phase = 'main';

      // Update game state
      setGameState(newGameState);

      // Send game state to peer
      sendMessage({
        type: 'gameState',
        sender: playerIdRef.current,
        content: newGameState,
        timestamp: Date.now(),
      });

      // Simulate game actions
      simulateGameActions();
    }, 2000);
  }, [gameState]);

  // Simulate game actions
  const simulateGameActions = useCallback(() => {
    // In a real implementation, the game would progress based on player actions
    // For this demo, we'll simulate some game actions

    // Simulate playing cards
    const simulateAction = (delay: number, action: () => void) => {
      setTimeout(action, delay);
    };

    // Simulate player 1 playing a card
    simulateAction(3000, () => {
      if (!gameState) return;

      const newGameState = { ...gameState };
      const player1Id = Object.keys(newGameState.players)[0];
      const player1 = newGameState.players[player1Id];

      // Play a card
      if (player1.hand.length > 0) {
        const card = player1.hand.shift();
        if (card) {
          player1.battlefield.push(card);

          // Record action
          const action: GameAction = {
            type: 'play',
            player: player1Id,
            card,
            timestamp: Date.now(),
          };

          gameActionsRef.current.push(action);

          // Send action to peer
          sendMessage({
            type: 'action',
            sender: playerIdRef.current,
            content: action,
            timestamp: Date.now(),
          });
        }
      }

      // Update game state
      setGameState(newGameState);

      // Send game state to peer
      sendMessage({
        type: 'gameState',
        sender: playerIdRef.current,
        content: newGameState,
        timestamp: Date.now(),
      });
    });

    // Simulate player 2 playing a card
    simulateAction(6000, () => {
      if (!gameState) return;

      const newGameState = { ...gameState };
      const player2Id = Object.keys(newGameState.players)[1];

      if (player2Id) {
        const player2 = newGameState.players[player2Id];

        // Play a card
        if (player2.hand.length > 0) {
          const card = player2.hand.shift();
          if (card) {
            player2.battlefield.push(card);

            // Record action
            const action: GameAction = {
              type: 'play',
              player: player2Id,
              card,
              timestamp: Date.now(),
            };

            gameActionsRef.current.push(action);

            // Send action to peer
            sendMessage({
              type: 'action',
              sender: playerIdRef.current,
              content: action,
              timestamp: Date.now(),
            });
          }
        }

        // Update game state
        setGameState(newGameState);

        // Send game state to peer
        sendMessage({
          type: 'gameState',
          sender: playerIdRef.current,
          content: newGameState,
          timestamp: Date.now(),
        });
      }
    });

    // Simulate combat
    simulateAction(9000, () => {
      if (!gameState) return;

      const newGameState = { ...gameState };
      const player1Id = Object.keys(newGameState.players)[0];
      const player2Id = Object.keys(newGameState.players)[1];

      if (player1Id && player2Id) {
        const player1 = newGameState.players[player1Id];
        const player2 = newGameState.players[player2Id];

        // Attack with player 1's card
        if (player1.battlefield.length > 0) {
          const attackingCard = player1.battlefield[0];

          // Record action
          const action: GameAction = {
            type: 'attack',
            player: player1Id,
            card: attackingCard,
            target: player2Id,
            timestamp: Date.now(),
          };

          gameActionsRef.current.push(action);

          // Send action to peer
          sendMessage({
            type: 'action',
            sender: playerIdRef.current,
            content: action,
            timestamp: Date.now(),
          });

          // Simulate damage
          player2.life -= 2;
        }

        // Update phase
        newGameState.phase = 'end';

        // Update game state
        setGameState(newGameState);

        // Send game state to peer
        sendMessage({
          type: 'gameState',
          sender: playerIdRef.current,
          content: newGameState,
          timestamp: Date.now(),
        });
      }
    });

    // Simulate end of turn
    simulateAction(12000, () => {
      if (!gameState) return;

      const newGameState = { ...gameState };

      // Increment turn
      newGameState.turn++;

      // Switch active player
      const player1Id = Object.keys(newGameState.players)[0];
      const player2Id = Object.keys(newGameState.players)[1];

      if (player1Id && player2Id) {
        newGameState.activePlayer =
          newGameState.activePlayer === player1Id ? player2Id : player1Id;

        // Update phase
        newGameState.phase = 'draw';

        // Update game state
        setGameState(newGameState);

        // Send game state to peer
        sendMessage({
          type: 'gameState',
          sender: playerIdRef.current,
          content: newGameState,
          timestamp: Date.now(),
        });
      }
    });

    // Simulate game end
    simulateAction(15000, () => {
      if (!gameState) return;

      // End match
      endMatch();
    });
  }, [gameState]);

  // End match
  const endMatch = useCallback(() => {
    if (isMatchEnded) return;

    console.log('Ending match');

    // Set match ended
    setIsMatchEnded(true);

    // Calculate match duration
    const duration = matchStartTimeRef.current
      ? (Date.now() - matchStartTimeRef.current) / 1000
      : 0;

    // Determine winner and loser
    const player1Id = Object.keys(gameState?.players || {})[0];
    const player2Id = Object.keys(gameState?.players || {})[1];

    let winner = '';
    let loser = '';

    if (player1Id && player2Id && gameState) {
      const player1 = gameState.players[player1Id];
      const player2 = gameState.players[player2Id];

      if (player1.life > player2.life) {
        winner = player1Id;
        loser = player2Id;
      } else {
        winner = player2Id;
        loser = player1Id;
      }
    }

    // Create match result
    const result: MatchResult = {
      winner,
      loser,
      score: `${gameState?.players[winner]?.life || 0}-${gameState?.players[loser]?.life || 0}`,
      duration,
      gameActions: gameActionsRef.current,
    };

    // Set match result
    setMatchResult(result);

    // Call onMatchEnd callback
    if (onMatchEnd) {
      onMatchEnd(result);
    }
  }, [isMatchEnded, gameState, onMatchEnd]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Render loading state
  if (!isInitialized) {
    return (
      <div className={`webrtc-match ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing WebRTC...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`webrtc-match ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`webrtc-match ${isAncientTheme ? 'ancient-theme' : ''}`}>
      <h2>WebRTC Real-Time Match</h2>

      <div className="match-info">
        <div className="match-id">Match ID: {matchId}</div>
        <div className={`connection-status ${connectionStatus}`}>
          Status:{' '}
          {connectionStatus === 'connected'
            ? 'Connected'
            : connectionStatus === 'connecting'
              ? 'Connecting...'
              : 'Disconnected'}
        </div>
      </div>

      <div className="match-container">
        <div className="video-section">
          <div className="video-container local">
            <video ref={localVideoRef} autoPlay muted playsInline />
            <div className="player-info">
              <span className="player-name">{playerName}</span>
              <span className="player-role">{isHost ? 'Host' : 'Guest'}</span>
            </div>
          </div>

          <div className="video-container remote">
            <video ref={remoteVideoRef} autoPlay playsInline />
            <div className="player-info">
              <span className="player-name">
                {players.find(p => p.id !== playerIdRef.current)?.name ||
                  'Waiting for opponent...'}
              </span>
              <span className="player-role">
                {players.find(p => p.id !== playerIdRef.current)?.isHost
                  ? 'Host'
                  : 'Guest'}
              </span>
            </div>

            {connectionStatus !== 'connected' && (
              <div className="connecting-overlay">
                <div className="loading-spinner"></div>
                <p>
                  {connectionStatus === 'connecting'
                    ? 'Connecting to opponent...'
                    : 'Disconnected'}
                </p>
              </div>
            )}
          </div>

          <div className="network-stats">
            <div className="stat">
              <span>Latency:</span>
              <span
                className={
                  networkStats.latency < 50
                    ? 'good'
                    : networkStats.latency < 100
                      ? 'medium'
                      : 'bad'
                }
              >
                {networkStats.latency.toFixed(0)} ms
              </span>
            </div>
            <div className="stat">
              <span>Packet Loss:</span>
              <span
                className={
                  networkStats.packetLoss < 1
                    ? 'good'
                    : networkStats.packetLoss < 5
                      ? 'medium'
                      : 'bad'
                }
              >
                {networkStats.packetLoss.toFixed(1)}%
              </span>
            </div>
            <div className="stat">
              <span>Bandwidth:</span>
              <span>{(networkStats.bandwidth / 1000).toFixed(2)} Mbps</span>
            </div>
          </div>
        </div>

        <div className="game-section">
          {!isMatchStarted ? (
            <div className="lobby">
              <h3>Match Lobby</h3>

              <div className="players-list">
                {players.map(player => (
                  <div
                    key={player.id}
                    className={`player-item ${player.isConnected ? '' : 'disconnected'}`}
                  >
                    <span className="player-name">{player.name}</span>
                    <span className="player-status">
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`ready-button ${isReady ? 'ready' : ''}`}
                onClick={toggleReady}
              >
                {isReady ? 'Ready' : 'Not Ready'}
              </button>

              <p className="lobby-instructions">
                {isHost
                  ? 'Waiting for all players to be ready...'
                  : 'Waiting for the host to start the match...'}
              </p>
            </div>
          ) : isMatchEnded ? (
            <div className="match-results">
              <h3>Match Results</h3>

              {matchResult && (
                <>
                  <div className="result-item">
                    <span>Winner:</span>
                    <span>
                      {players.find(p => p.id === matchResult.winner)?.name ||
                        'Unknown'}
                    </span>
                  </div>

                  <div className="result-item">
                    <span>Loser:</span>
                    <span>
                      {players.find(p => p.id === matchResult.loser)?.name ||
                        'Unknown'}
                    </span>
                  </div>

                  <div className="result-item">
                    <span>Score:</span>
                    <span>{matchResult.score}</span>
                  </div>

                  <div className="result-item">
                    <span>Duration:</span>
                    <span>
                      {Math.floor(matchResult.duration / 60)}:
                      {(matchResult.duration % 60).toFixed(0).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="actions-summary">
                    <h4>Game Actions</h4>
                    <div className="actions-list">
                      {matchResult.gameActions.map((action, index) => (
                        <div key={index} className="action-item">
                          <span className="action-player">
                            {players.find(p => p.id === action.player)?.name ||
                              'Unknown'}
                          </span>
                          <span className="action-type">{action.type}</span>
                          {action.card && (
                            <span className="action-card">{action.card}</span>
                          )}
                          {action.target && (
                            <span className="action-target">
                              →{' '}
                              {players.find(p => p.id === action.target)
                                ?.name || action.target}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="play-again-button"
                    onClick={() => window.location.reload()}
                  >
                    Play Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="game-board">
              <div className="game-info">
                <div className="turn-info">
                  <span>Turn {gameState?.turn || 1}</span>
                  <span>Phase: {gameState?.phase || 'setup'}</span>
                </div>

                <div className="active-player">
                  Active Player:{' '}
                  {players.find(p => p.id === gameState?.activePlayer)?.name ||
                    'Unknown'}
                </div>
              </div>

              <div className="players-board">
                {gameState &&
                  Object.entries(gameState.players).map(
                    ([playerId, playerState]) => {
                      const player = players.find(p => p.id === playerId);
                      const isLocalPlayer = playerId === playerIdRef.current;

                      return (
                        <div
                          key={playerId}
                          className={`player-board ${isLocalPlayer ? 'local-player' : 'opponent-player'}`}
                        >
                          <div className="player-header">
                            <span className="player-name">
                              {player?.name || 'Unknown'}
                            </span>
                            <span className="player-life">
                              Life: {playerState.life}
                            </span>
                          </div>

                          <div className="player-zones">
                            <div className="zone library">
                              <div className="zone-label">Library</div>
                              <div className="zone-content">
                                {playerState.library} cards
                              </div>
                            </div>

                            <div className="zone hand">
                              <div className="zone-label">Hand</div>
                              <div className="zone-content">
                                {playerState.hand.map((card, index) => (
                                  <div key={index} className="card">
                                    {isLocalPlayer ? card : '?'}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="zone battlefield">
                              <div className="zone-label">Battlefield</div>
                              <div className="zone-content">
                                {playerState.battlefield.map((card, index) => (
                                  <div key={index} className="card">
                                    {card}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="zone graveyard">
                              <div className="zone-label">Graveyard</div>
                              <div className="zone-content">
                                {playerState.graveyard.length > 0
                                  ? playerState.graveyard.map((card, index) => (
                                      <div key={index} className="card">
                                        {card}
                                      </div>
                                    ))
                                  : 'Empty'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>

              <div className="game-controls">
                <button className="game-button" disabled>
                  Draw Card
                </button>
                <button className="game-button" disabled>
                  Play Card
                </button>
                <button className="game-button" disabled>
                  Attack
                </button>
                <button className="game-button" disabled>
                  End Turn
                </button>
                <button className="game-button end-match" onClick={endMatch}>
                  End Match
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="chat-section">
          <h3>Chat</h3>

          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender === playerName ? 'local' : 'remote'}`}
              >
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="message-content">{message.message}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <button
              onClick={sendChatMessage}
              disabled={!isConnected || !messageInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .webrtc-match {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          width: 100%;
        }

        h2,
        h3,
        h4 {
          margin-top: 0;
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }

        .match-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 10px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
        }

        .match-id {
          font-weight: bold;
        }

        .connection-status {
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: bold;
        }

        .connection-status.connected {
          background-color: rgba(var(--color-success-rgb), 0.2);
          color: var(--color-success);
        }

        .connection-status.connecting {
          background-color: rgba(var(--color-warning-rgb), 0.2);
          color: var(--color-warning);
        }

        .connection-status.disconnected {
          background-color: rgba(var(--color-error-rgb), 0.2);
          color: var(--color-error);
        }

        .match-container {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 15px;
          height: 600px;
        }

        .video-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .video-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background-color: #000;
          aspect-ratio: 4/3;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .player-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          justify-content: space-between;
        }

        .connecting-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .network-stats {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 10px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          margin-top: auto;
        }

        .network-stats .stat {
          display: flex;
          justify-content: space-between;
        }

        .network-stats .good {
          color: var(--color-success);
        }

        .network-stats .medium {
          color: var(--color-warning);
        }

        .network-stats .bad {
          color: var(--color-error);
        }

        .game-section {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }

        .lobby {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .players-list {
          width: 100%;
          margin-bottom: 20px;
        }

        .player-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 4px;
          margin-bottom: 5px;
        }

        .player-item.disconnected {
          opacity: 0.5;
        }

        .ready-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#7a4e4e' : '#f44336'};
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .ready-button.ready {
          background-color: ${isAncientTheme ? '#5d7a4e' : '#4caf50'};
        }

        .lobby-instructions {
          margin-top: 20px;
          font-style: italic;
        }

        .match-results {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 4px;
          margin-bottom: 5px;
        }

        .actions-summary {
          margin-top: 20px;
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .actions-list {
          flex: 1;
          overflow-y: auto;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 4px;
          padding: 10px;
        }

        .action-item {
          padding: 5px;
          border-bottom: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .action-player {
          font-weight: bold;
        }

        .action-type {
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        .action-card {
          background-color: ${isAncientTheme ? '#4a4a35' : '#f0f0f0'};
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 0.8rem;
        }

        .action-target {
          font-style: italic;
        }

        .play-again-button {
          margin-top: 20px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .game-board {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .game-info {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .players-board {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .player-board {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 4px;
          padding: 10px;
        }

        .player-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .player-life {
          font-weight: bold;
        }

        .player-zones {
          display: grid;
          grid-template-columns: 1fr 3fr;
          grid-template-rows: auto auto;
          gap: 10px;
        }

        .zone {
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 4px;
          padding: 5px;
        }

        .zone-label {
          font-weight: bold;
          font-size: 0.8rem;
          margin-bottom: 5px;
        }

        .zone-content {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          min-height: 30px;
        }

        .card {
          background-color: ${isAncientTheme ? '#4a4a35' : '#e0e0e0'};
          padding: 5px;
          border-radius: 3px;
          font-size: 0.8rem;
          min-width: 60px;
          text-align: center;
        }

        .game-controls {
          display: flex;
          gap: 5px;
          margin-top: 10px;
        }

        .game-button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .game-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .game-button.end-match {
          background-color: ${isAncientTheme ? '#7a4e4e' : '#f44336'};
        }

        .chat-section {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-message {
          max-width: 90%;
          padding: 8px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
        }

        .chat-message.local {
          align-self: flex-end;
          background-color: ${isAncientTheme ? '#4a4a35' : '#e3f2fd'};
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.8rem;
        }

        .message-sender {
          font-weight: bold;
        }

        .message-time {
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }

        .chat-input {
          display: flex;
          gap: 5px;
        }

        .chat-input input {
          flex: 1;
          padding: 8px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }

        .chat-input button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-container {
          padding: 20px;
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
          border-radius: 8px;
          color: ${isAncientTheme ? '#ff6b6b' : '#d32f2f'};
          margin-bottom: 20px;
        }

        .error-container button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .ancient-theme h2,
        .ancient-theme h3,
        .ancient-theme h4 {
          font-family: 'Cinzel', serif;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .match-container {
            grid-template-columns: 1fr 2fr;
            grid-template-rows: auto 1fr;
          }

          .chat-section {
            grid-column: 1 / 3;
            grid-row: 2;
            height: 300px;
            margin-top: 15px;
          }
        }

        @media (max-width: 768px) {
          .match-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }

          .video-section {
            grid-row: 1;
          }

          .game-section {
            grid-row: 2;
          }

          .chat-section {
            grid-column: 1;
            grid-row: 3;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(WebRTCMatch);
