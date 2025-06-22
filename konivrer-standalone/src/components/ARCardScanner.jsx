import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * AR Card Scanner Component
 * 
 * This component uses the device camera to scan physical cards,
 * identify them using computer vision, and provide augmented reality
 * overlays with card information and game actions.
 */
const ARCardScanner = ({
  onCardDetected,
  onCardVerified,
  enableAR = true,
  showDebugInfo = false,
  scanMode = 'auto', // 'auto', 'manual', 'continuous'
  cardDatabase = []
}) => {
  const { isAncientTheme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCards, setDetectedCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' or 'user'
  const [scanStats, setScanStats] = useState({
    fps: 0,
    detectionTime: 0,
    confidence: 0,
    scannedCount: 0
  });
  const [arOverlayVisible, setArOverlayVisible] = useState(true);
  const [debugInfo, setDebugInfo] = useState({
    resolution: { width: 0, height: 0 },
    capabilities: {},
    detectionThreshold: 0.7,
    processingRegion: { x: 0, y: 0, width: 0, height: 0 },
    lastDetectionResult: null
  });
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const modelRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);
  const processingRef = useRef(false);
  
  // Sample card database for demonstration
  const sampleCardDatabase = [
    {
      id: 'KON001',
      name: 'Ancient Guardian',
      type: 'Creature',
      rarity: 'Mythic',
      cost: 5,
      power: 4,
      toughness: 6,
      text: 'When Ancient Guardian enters the battlefield, create a 1/1 Spirit token with flying.',
      set: 'Core',
      imageUrl: '/images/ancient_guardian.jpg',
      features: ['holographic', 'foil'],
      patternPoints: [
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.1 },
        { x: 0.9, y: 0.9 },
        { x: 0.1, y: 0.9 }
      ]
    },
    {
      id: 'KON002',
      name: 'Mystic Oracle',
      type: 'Creature',
      rarity: 'Rare',
      cost: 3,
      power: 2,
      toughness: 3,
      text: 'When Mystic Oracle enters the battlefield, scry 2.',
      set: 'Core',
      imageUrl: '/images/mystic_oracle.jpg',
      features: [],
      patternPoints: [
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.2 },
        { x: 0.8, y: 0.8 },
        { x: 0.2, y: 0.8 }
      ]
    },
    {
      id: 'KON003',
      name: 'Shadow Assassin',
      type: 'Creature',
      rarity: 'Uncommon',
      cost: 2,
      power: 3,
      toughness: 1,
      text: 'Shadow Assassin can\'t be blocked by creatures with power 2 or greater.',
      set: 'Core',
      imageUrl: '/images/shadow_assassin.jpg',
      features: ['foil'],
      patternPoints: [
        { x: 0.15, y: 0.15 },
        { x: 0.85, y: 0.15 },
        { x: 0.85, y: 0.85 },
        { x: 0.15, y: 0.85 }
      ]
    }
  ];
  
  // Initialize camera and models
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitialized(false);
        setError(null);
        
        // Check camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera is not supported in your browser');
        }
        
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          await new Promise(resolve => {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().then(resolve);
            };
          });
          
          // Get video track capabilities
          const videoTrack = stream.getVideoTracks()[0];
          const capabilities = videoTrack.getCapabilities();
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            resolution: {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight
            },
            capabilities
          }));
          
          // Set canvas dimensions
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          
          if (overlayCanvasRef.current) {
            overlayCanvasRef.current.width = videoRef.current.videoWidth;
            overlayCanvasRef.current.height = videoRef.current.videoHeight;
          }
          
          // Calculate processing region (center 80% of the video)
          const processingRegion = {
            x: videoRef.current.videoWidth * 0.1,
            y: videoRef.current.videoHeight * 0.1,
            width: videoRef.current.videoWidth * 0.8,
            height: videoRef.current.videoHeight * 0.8
          };
          
          setDebugInfo(prev => ({
            ...prev,
            processingRegion
          }));
        }
        
        // Load detection model
        await loadDetectionModel();
        
        setCameraPermission(true);
        setIsInitialized(true);
        
        // Start scanning if auto mode
        if (scanMode === 'auto' || scanMode === 'continuous') {
          startScanning();
        }
      } catch (err) {
        setError(`Failed to initialize camera: ${err instanceof Error ? err.message : String(err)}`);
        setIsInitialized(false);
      }
    };
    
    initialize();
    
    // Cleanup function
    return () => {
      // Stop scanning
      stopScanning();
      
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacing, scanMode]);
  
  // Load detection model
  const loadDetectionModel = async () => {
    try {
      // In a real implementation, we would load a machine learning model
      // For this demo, we'll simulate the model loading
      
      // Simulate model loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simulated model
      modelRef.current = {
        // Simulated detection function
        detect: async (imageData) => {
          // In a real implementation, this would use the ML model to detect cards
          // For this demo, we'll simulate detection with random results
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Randomly detect a card from the sample database
          const shouldDetect = Math.random() > 0.7;
          
          if (shouldDetect) {
            const randomIndex = Math.floor(Math.random() * sampleCardDatabase.length);
            const card = sampleCardDatabase[randomIndex];
            
            // Simulate detection result
            return {
              card,
              confidence: 0.7 + Math.random() * 0.3,
              boundingBox: {
                x: 0.2 + Math.random() * 0.1,
                y: 0.2 + Math.random() * 0.1,
                width: 0.5 + Math.random() * 0.1,
                height: 0.7 + Math.random() * 0.1
              },
              corners: [
                { x: 0.2 + Math.random() * 0.05, y: 0.2 + Math.random() * 0.05 },
                { x: 0.7 + Math.random() * 0.05, y: 0.2 + Math.random() * 0.05 },
                { x: 0.7 + Math.random() * 0.05, y: 0.9 + Math.random() * 0.05 },
                { x: 0.2 + Math.random() * 0.05, y: 0.9 + Math.random() * 0.05 }
              ]
            };
          }
          
          return null;
        }
      };
      
      console.log('Detection model loaded');
    } catch (err) {
      throw new Error(`Failed to load detection model: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Start scanning
  const startScanning = useCallback(() => {
    if (!isInitialized || !modelRef.current || isScanning) return;
    
    setIsScanning(true);
    
    // Start detection loop
    if (scanMode === 'continuous') {
      // Continuous mode: detect in every frame
      startContinuousDetection();
    } else {
      // Auto mode: detect periodically
      startPeriodicDetection();
    }
    
    // Start rendering loop
    startRenderingLoop();
  }, [isInitialized, isScanning, scanMode]);
  
  // Stop scanning
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    
    // Stop detection loop
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Stop rendering loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  // Start continuous detection
  const startContinuousDetection = useCallback(() => {
    const detectFrame = async () => {
      if (!isScanning || !videoRef.current || !canvasRef.current || !modelRef.current) return;
      
      if (!processingRef.current) {
        processingRef.current = true;
        
        try {
          // Capture video frame
          const context = canvasRef.current.getContext('2d');
          context.drawImage(videoRef.current, 0, 0);
          
          // Get image data
          const imageData = context.getImageData(
            debugInfo.processingRegion.x,
            debugInfo.processingRegion.y,
            debugInfo.processingRegion.width,
            debugInfo.processingRegion.height
          );
          
          // Start detection timer
          const detectionStart = performance.now();
          
          // Detect card
          const result = await modelRef.current.detect(imageData);
          
          // End detection timer
          const detectionTime = performance.now() - detectionStart;
          
          // Update detection stats
          setScanStats(prev => ({
            ...prev,
            detectionTime
          }));
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            lastDetectionResult: result
          }));
          
          // Handle detection result
          if (result && result.confidence > debugInfo.detectionThreshold) {
            handleCardDetection(result);
          }
        } catch (err) {
          console.error('Detection error:', err);
        } finally {
          processingRef.current = false;
        }
      }
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };
    
    // Start detection loop
    detectFrame();
  }, [isScanning, debugInfo.processingRegion, debugInfo.detectionThreshold]);
  
  // Start periodic detection
  const startPeriodicDetection = useCallback(() => {
    // Detect every 500ms
    detectionIntervalRef.current = setInterval(async () => {
      if (!isScanning || !videoRef.current || !canvasRef.current || !modelRef.current) return;
      
      if (!processingRef.current) {
        processingRef.current = true;
        
        try {
          // Capture video frame
          const context = canvasRef.current.getContext('2d');
          context.drawImage(videoRef.current, 0, 0);
          
          // Get image data
          const imageData = context.getImageData(
            debugInfo.processingRegion.x,
            debugInfo.processingRegion.y,
            debugInfo.processingRegion.width,
            debugInfo.processingRegion.height
          );
          
          // Start detection timer
          const detectionStart = performance.now();
          
          // Detect card
          const result = await modelRef.current.detect(imageData);
          
          // End detection timer
          const detectionTime = performance.now() - detectionStart;
          
          // Update detection stats
          setScanStats(prev => ({
            ...prev,
            detectionTime
          }));
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            lastDetectionResult: result
          }));
          
          // Handle detection result
          if (result && result.confidence > debugInfo.detectionThreshold) {
            handleCardDetection(result);
          }
        } catch (err) {
          console.error('Detection error:', err);
        } finally {
          processingRef.current = false;
        }
      }
    }, 500);
  }, [isScanning, debugInfo.processingRegion, debugInfo.detectionThreshold]);
  
  // Start rendering loop
  const startRenderingLoop = useCallback(() => {
    const renderFrame = () => {
      if (!isScanning || !videoRef.current || !overlayCanvasRef.current) return;
      
      // Update FPS counter
      frameCountRef.current++;
      const now = performance.now();
      
      if (now - lastFpsUpdateRef.current >= 1000) {
        setScanStats(prev => ({
          ...prev,
          fps: frameCountRef.current
        }));
        
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }
      
      // Render AR overlay
      renderAROverlay();
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };
    
    // Start rendering loop
    renderFrame();
  }, [isScanning]);
  
  // Handle card detection
  const handleCardDetection = useCallback((result) => {
    const { card, confidence, boundingBox, corners } = result;
    
    // Check if this is a new detection
    const isNewDetection = !currentCard || currentCard.id !== card.id;
    
    if (isNewDetection) {
      console.log('Card detected:', card.name, 'Confidence:', confidence);
      
      // Set current card
      setCurrentCard({
        ...card,
        confidence,
        boundingBox,
        corners,
        detectedAt: Date.now()
      });
      
      // Add to detected cards list if not already present
      setDetectedCards(prev => {
        const exists = prev.some(c => c.id === card.id);
        
        if (!exists) {
          // Call detection callback
          if (onCardDetected) {
            onCardDetected(card);
          }
          
          return [...prev, {
            ...card,
            confidence,
            detectedAt: Date.now()
          }];
        }
        
        return prev;
      });
      
      // Update scan stats
      setScanStats(prev => ({
        ...prev,
        confidence,
        scannedCount: prev.scannedCount + (isNewDetection ? 1 : 0)
      }));
      
      // Verify card if needed
      verifyCard(card);
    } else {
      // Update current card position
      setCurrentCard(prev => ({
        ...prev,
        confidence,
        boundingBox,
        corners,
        lastSeenAt: Date.now()
      }));
    }
  }, [currentCard, onCardDetected]);
  
  // Verify card
  const verifyCard = useCallback((card) => {
    // In a real implementation, we would verify the card's authenticity
    // For this demo, we'll simulate verification
    
    // Simulate verification delay
    setTimeout(() => {
      // Simulate verification result
      const isVerified = Math.random() > 0.1;
      
      // Call verification callback
      if (onCardVerified) {
        onCardVerified({
          card,
          isVerified,
          verificationMethod: 'pattern-matching',
          verificationTime: Date.now()
        });
      }
      
      // Update current card
      setCurrentCard(prev => {
        if (prev && prev.id === card.id) {
          return {
            ...prev,
            isVerified,
            verifiedAt: Date.now()
          };
        }
        
        return prev;
      });
    }, 1000);
  }, [onCardVerified]);
  
  // Render AR overlay
  const renderAROverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !arOverlayVisible) return;
    
    const context = overlayCanvasRef.current.getContext('2d');
    const { width, height } = overlayCanvasRef.current;
    
    // Clear canvas
    context.clearRect(0, 0, width, height);
    
    // Draw processing region if debug mode is enabled
    if (showDebugInfo) {
      context.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      context.lineWidth = 2;
      context.strokeRect(
        debugInfo.processingRegion.x,
        debugInfo.processingRegion.y,
        debugInfo.processingRegion.width,
        debugInfo.processingRegion.height
      );
    }
    
    // Draw current card overlay if available
    if (currentCard && currentCard.corners) {
      // Draw card outline
      context.beginPath();
      context.moveTo(currentCard.corners[0].x * width, currentCard.corners[0].y * height);
      
      for (let i = 1; i < currentCard.corners.length; i++) {
        context.lineTo(currentCard.corners[i].x * width, currentCard.corners[i].y * height);
      }
      
      context.closePath();
      
      // Set style based on verification status
      if (currentCard.isVerified) {
        context.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      } else if (currentCard.isVerified === false) {
        context.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      } else {
        context.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      }
      
      context.lineWidth = 3;
      context.stroke();
      
      // Draw card info
      const infoX = currentCard.corners[0].x * width;
      const infoY = currentCard.corners[0].y * height - 80;
      
      // Draw info background
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(infoX, infoY, 250, 70);
      
      // Draw card name
      context.fillStyle = '#ffffff';
      context.font = 'bold 16px Arial';
      context.fillText(currentCard.name, infoX + 10, infoY + 20);
      
      // Draw card type and rarity
      context.font = '14px Arial';
      context.fillText(`${currentCard.type} - ${currentCard.rarity}`, infoX + 10, infoY + 40);
      
      // Draw card stats if applicable
      if (currentCard.power !== undefined && currentCard.toughness !== undefined) {
        context.fillText(`${currentCard.power}/${currentCard.toughness}`, infoX + 10, infoY + 60);
      }
      
      // Draw confidence
      context.fillStyle = currentCard.confidence > 0.9 ? '#00ff00' : currentCard.confidence > 0.7 ? '#ffff00' : '#ff0000';
      context.fillText(`Confidence: ${(currentCard.confidence * 100).toFixed(1)}%`, infoX + 150, infoY + 60);
    }
    
    // Draw FPS counter if debug mode is enabled
    if (showDebugInfo) {
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(10, 10, 200, 80);
      
      context.fillStyle = '#ffffff';
      context.font = '14px Arial';
      context.fillText(`FPS: ${scanStats.fps}`, 20, 30);
      context.fillText(`Detection Time: ${scanStats.detectionTime.toFixed(1)} ms`, 20, 50);
      context.fillText(`Cards Scanned: ${scanStats.scannedCount}`, 20, 70);
      
      // Draw detection threshold
      context.fillText(`Threshold: ${debugInfo.detectionThreshold.toFixed(2)}`, 20, 90);
    }
  }, [currentCard, arOverlayVisible, showDebugInfo, scanStats, debugInfo]);
  
  // Manual scan
  const manualScan = useCallback(async () => {
    if (!isInitialized || !videoRef.current || !canvasRef.current || !modelRef.current || processingRef.current) return;
    
    processingRef.current = true;
    
    try {
      // Capture video frame
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0);
      
      // Get image data
      const imageData = context.getImageData(
        debugInfo.processingRegion.x,
        debugInfo.processingRegion.y,
        debugInfo.processingRegion.width,
        debugInfo.processingRegion.height
      );
      
      // Start detection timer
      const detectionStart = performance.now();
      
      // Detect card
      const result = await modelRef.current.detect(imageData);
      
      // End detection timer
      const detectionTime = performance.now() - detectionStart;
      
      // Update detection stats
      setScanStats(prev => ({
        ...prev,
        detectionTime
      }));
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        lastDetectionResult: result
      }));
      
      // Handle detection result
      if (result && result.confidence > debugInfo.detectionThreshold) {
        handleCardDetection(result);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Manual scan error:', err);
      return false;
    } finally {
      processingRef.current = false;
    }
  }, [isInitialized, debugInfo.processingRegion, debugInfo.detectionThreshold, handleCardDetection]);
  
  // Toggle camera facing
  const toggleCameraFacing = useCallback(() => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);
  
  // Toggle AR overlay
  const toggleAROverlay = useCallback(() => {
    setArOverlayVisible(prev => !prev);
  }, []);
  
  // Clear detected cards
  const clearDetectedCards = useCallback(() => {
    setDetectedCards([]);
    setCurrentCard(null);
    setScanStats(prev => ({
      ...prev,
      scannedCount: 0
    }));
  }, []);
  
  // Adjust detection threshold
  const adjustDetectionThreshold = useCallback((value) => {
    setDebugInfo(prev => ({
      ...prev,
      detectionThreshold: Math.max(0.1, Math.min(1.0, value))
    }));
  }, []);
  
  // Render loading state
  if (!isInitialized) {
    return (
      <div className={`ar-card-scanner ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing AR Scanner...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className={`ar-card-scanner ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
  
  // Render permission request
  if (!cameraPermission) {
    return (
      <div className={`ar-card-scanner ${isAncientTheme ? 'ancient-theme' : ''}`}>
        <div className="permission-container">
          <h3>Camera Permission Required</h3>
          <p>Please allow camera access to use the AR Card Scanner.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`ar-card-scanner ${isAncientTheme ? 'ancient-theme' : ''}`}>
      <h2>AR Card Scanner</h2>
      
      <div className="scanner-container">
        <div className="video-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
          />
          <canvas 
            ref={canvasRef} 
            className="processing-canvas"
          />
          <canvas 
            ref={overlayCanvasRef} 
            className="overlay-canvas"
          />
          
          {scanMode === 'manual' && (
            <div className="scan-button-container">
              <button 
                className="scan-button"
                onClick={manualScan}
                disabled={processingRef.current}
              >
                {processingRef.current ? 'Scanning...' : 'Scan Card'}
              </button>
            </div>
          )}
          
          <div className="scanner-controls">
            <button 
              className="control-button"
              onClick={toggleCameraFacing}
              title="Switch Camera"
            >
              <span className="icon">📷</span>
            </button>
            
            <button 
              className="control-button"
              onClick={toggleAROverlay}
              title={arOverlayVisible ? 'Hide AR Overlay' : 'Show AR Overlay'}
            >
              <span className="icon">{arOverlayVisible ? '👁️' : '👁️‍🗨️'}</span>
            </button>
            
            {scanMode !== 'manual' && (
              <button 
                className="control-button"
                onClick={isScanning ? stopScanning : startScanning}
                title={isScanning ? 'Stop Scanning' : 'Start Scanning'}
              >
                <span className="icon">{isScanning ? '⏹️' : '▶️'}</span>
              </button>
            )}
            
            <button 
              className="control-button"
              onClick={clearDetectedCards}
              title="Clear Detected Cards"
            >
              <span className="icon">🗑️</span>
            </button>
          </div>
        </div>
        
        <div className="results-container">
          <h3>Detected Cards ({detectedCards.length})</h3>
          
          <div className="cards-list">
            {detectedCards.length === 0 ? (
              <div className="no-cards">
                <p>No cards detected yet.</p>
                <p>Point your camera at a card to scan it.</p>
              </div>
            ) : (
              detectedCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-header">
                    <span className="card-name">{card.name}</span>
                    <span className="card-id">{card.id}</span>
                  </div>
                  
                  <div className="card-details">
                    <div className="card-type">{card.type} - {card.rarity}</div>
                    
                    {card.power !== undefined && card.toughness !== undefined && (
                      <div className="card-stats">{card.power}/{card.toughness}</div>
                    )}
                    
                    <div className="card-text">{card.text}</div>
                    
                    <div className="card-set">{card.set}</div>
                    
                    {card.features && card.features.length > 0 && (
                      <div className="card-features">
                        {card.features.map(feature => (
                          <span key={feature} className={`feature ${feature}`}>{feature}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="card-scan-info">
                    <div className="scan-time">
                      Scanned: {new Date(card.detectedAt).toLocaleTimeString()}
                    </div>
                    
                    <div className="confidence">
                      Confidence: {(card.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {showDebugInfo && (
        <div className="debug-panel">
          <h3>Debug Information</h3>
          
          <div className="debug-section">
            <h4>Camera</h4>
            <div className="debug-item">
              <span>Resolution:</span>
              <span>{debugInfo.resolution.width}x{debugInfo.resolution.height}</span>
            </div>
            
            <div className="debug-item">
              <span>Facing:</span>
              <span>{cameraFacing}</span>
            </div>
          </div>
          
          <div className="debug-section">
            <h4>Detection</h4>
            <div className="debug-item">
              <span>Threshold:</span>
              <span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={debugInfo.detectionThreshold}
                  onChange={(e) => adjustDetectionThreshold(parseFloat(e.target.value))}
                />
                {debugInfo.detectionThreshold.toFixed(2)}
              </span>
            </div>
            
            <div className="debug-item">
              <span>Processing Region:</span>
              <span>
                {debugInfo.processingRegion.width}x{debugInfo.processingRegion.height}
              </span>
            </div>
            
            <div className="debug-item">
              <span>Last Result:</span>
              <span>
                {debugInfo.lastDetectionResult 
                  ? `${debugInfo.lastDetectionResult.card.name} (${(debugInfo.lastDetectionResult.confidence * 100).toFixed(1)}%)`
                  : 'None'
                }
              </span>
            </div>
          </div>
          
          <div className="debug-section">
            <h4>Performance</h4>
            <div className="debug-item">
              <span>FPS:</span>
              <span>{scanStats.fps}</span>
            </div>
            
            <div className="debug-item">
              <span>Detection Time:</span>
              <span>{scanStats.detectionTime.toFixed(1)} ms</span>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .ar-card-scanner {
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
        
        .scanner-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .video-container {
          position: relative;
          width: 100%;
          max-width: 640px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #000;
        }
        
        video {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .processing-canvas {
          display: none;
        }
        
        .overlay-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .scan-button-container {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }
        
        .scan-button {
          padding: 12px 24px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s, transform 0.2s;
        }
        
        .scan-button:hover {
          background-color: ${isAncientTheme ? '#a89a6a' : '#7b81ff'};
        }
        
        .scan-button:active {
          transform: scale(0.95);
        }
        
        .scan-button:disabled {
          background-color: ${isAncientTheme ? '#5a5a46' : '#a0a0a0'};
          cursor: not-allowed;
        }
        
        .scanner-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .control-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .control-button:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        
        .icon {
          font-size: 1.2rem;
        }
        
        .results-container {
          flex: 1;
          min-width: 300px;
        }
        
        .cards-list {
          max-height: 500px;
          overflow-y: auto;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          padding: 10px;
        }
        
        .no-cards {
          padding: 20px;
          text-align: center;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
        }
        
        .card-item {
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        
        .card-name {
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .card-id {
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          font-size: 0.8rem;
        }
        
        .card-details {
          margin-bottom: 10px;
        }
        
        .card-type {
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-bottom: 5px;
        }
        
        .card-stats {
          display: inline-block;
          background-color: ${isAncientTheme ? '#4a4a35' : '#f0f0f0'};
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .card-text {
          margin-bottom: 5px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .card-set {
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-bottom: 5px;
        }
        
        .card-features {
          display: flex;
          gap: 5px;
          margin-top: 5px;
        }
        
        .feature {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .feature.foil {
          background-color: ${isAncientTheme ? '#4a4a35' : '#e0e0e0'};
          color: ${isAncientTheme ? '#d4b86a' : '#333333'};
        }
        
        .feature.holographic {
          background: linear-gradient(
            45deg,
            #ff8a00,
            #e52e71,
            #ff8a00
          );
          color: white;
          background-size: 200% 200%;
          animation: holographic-text 2s ease infinite;
        }
        
        @keyframes holographic-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .card-scan-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: ${isAncientTheme ? '#a89a6a' : '#666666'};
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid ${isAncientTheme ? '#3a3828' : '#f0f0f0'};
        }
        
        .confidence {
          font-weight: bold;
        }
        
        .debug-panel {
          margin-top: 20px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 8px;
          padding: 15px;
        }
        
        .debug-section {
          margin-bottom: 15px;
        }
        
        .debug-section h4 {
          margin-bottom: 10px;
          font-size: 1rem;
        }
        
        .debug-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .debug-item input[type="range"] {
          width: 100px;
          margin-right: 10px;
        }
        
        .loading-container, .permission-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-container, .permission-container {
          padding: 20px;
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
          border-radius: 8px;
          color: ${isAncientTheme ? '#ff6b6b' : '#d32f2f'};
          margin-bottom: 20px;
          text-align: center;
        }
        
        .error-container button, .permission-container button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .ancient-theme h2, .ancient-theme h3, .ancient-theme h4 {
          font-family: 'Cinzel', serif;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .scanner-container {
            flex-direction: column;
          }
          
          .video-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(ARCardScanner);