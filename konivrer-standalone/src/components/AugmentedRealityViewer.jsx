import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Augmented Reality Card Viewer component
 * This component uses the device camera to recognize cards and display
 * 3D models, animations, and additional information in augmented reality.
 */
const AugmentedRealityViewer = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [arEffects, setArEffects] = useState([]);
  const [showCardStats, setShowCardStats] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { isAncientTheme } = useTheme();

  // Simulated card database with AR assets
  const cardDatabase = {
    KON001: {
      name: 'Ancient Guardian',
      type: 'Creature',
      rarity: 'Mythic',
      power: 4,
      toughness: 6,
      cost: 5,
      description:
        'When Ancient Guardian enters the battlefield, create a 1/1 Spirit token with flying.',
      arModel: 'ancient_guardian_model',
      arAnimations: ['idle', 'attack', 'defend'],
      arEffects: ['particles_gold', 'aura_protection'],
    },
    KON004: {
      name: 'Ethereal Dragon',
      type: 'Creature',
      rarity: 'Mythic',
      power: 6,
      toughness: 6,
      cost: 7,
      description:
        'Flying. When Ethereal Dragon deals combat damage to a player, draw a card.',
      arModel: 'ethereal_dragon_model',
      arAnimations: ['idle', 'attack', 'fly'],
      arEffects: ['particles_blue', 'aura_mystical'],
    },
    KON008: {
      name: 'Volcanic Eruption',
      type: 'Spell',
      rarity: 'Rare',
      cost: 6,
      description:
        'Volcanic Eruption deals 5 damage to each creature and each player.',
      arModel: 'volcanic_eruption_model',
      arAnimations: ['cast', 'impact'],
      arEffects: ['particles_fire', 'screen_shake'],
    },
  };

  /**
   * Initialize the AR viewer
   */
  const initializeAR = useCallback(async () => {
    try {
      setErrorMessage('');
      setIsActive(true);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Start the AR detection loop
        requestAnimationFrame(detectCards);
      }
    } catch (error) {
      setErrorMessage(`AR initialization error: ${error.message}`);
      setIsActive(false);
    }
  }, []);

  /**
   * Stop the AR viewer and release resources
   */
  const stopAR = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setCurrentCard(null);
    setArEffects([]);
  }, []);

  /**
   * Simulated card detection algorithm
   * In a real implementation, this would use computer vision libraries
   */
  const detectCards = useCallback(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simulated card detection (would be replaced with actual computer vision)
    // This is a placeholder for the real implementation
    if (Math.random() > 0.95) {
      // Simulate occasional card detection
      const cardIds = Object.keys(cardDatabase);
      const randomCardId = cardIds[Math.floor(Math.random() * cardIds.length)];
      const detectedCard = {
        id: randomCardId,
        ...cardDatabase[randomCardId],
      };

      // Only update if it's a different card
      if (!currentCard || currentCard.id !== detectedCard.id) {
        setCurrentCard(detectedCard);

        // Simulate AR effects
        const newEffects = [];
        for (let i = 0; i < 3; i++) {
          newEffects.push({
            id: `effect_${i}`,
            type: detectedCard.arEffects[i % detectedCard.arEffects.length],
            position: {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
            },
            scale: Math.random() * 0.5 + 0.5,
            rotation: Math.random() * 360,
            opacity: Math.random() * 0.5 + 0.5,
          });
        }
        setArEffects(newEffects);
      }

      // Draw bounding box around detected card
      context.strokeStyle = '#00ff00';
      context.lineWidth = 3;
      context.strokeRect(
        canvas.width * 0.3,
        canvas.height * 0.2,
        canvas.width * 0.4,
        canvas.height * 0.6,
      );

      // Draw AR effects
      drawArEffects(context, detectedCard);
    }

    // Continue the detection loop
    requestAnimationFrame(detectCards);
  }, [isActive, currentCard]);

  /**
   * Draw AR effects on the canvas
   */
  const drawArEffects = useCallback(
    (context, card) => {
      if (!card) return;

      const canvas = context.canvas;

      // Draw 3D model placeholder
      context.fillStyle = 'rgba(0, 0, 0, 0.5)';
      context.fillRect(
        canvas.width * 0.3,
        canvas.height * 0.2,
        canvas.width * 0.4,
        canvas.height * 0.6,
      );

      // Draw model name
      context.fillStyle = '#ffffff';
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.fillText(
        `[3D ${card.arModel}]`,
        canvas.width * 0.5,
        canvas.height * 0.5,
      );

      // Draw particle effects
      arEffects.forEach(effect => {
        context.save();
        context.translate(effect.position.x, effect.position.y);
        context.rotate((effect.rotation * Math.PI) / 180);
        context.scale(effect.scale, effect.scale);

        // Draw different effects based on type
        if (effect.type.includes('particles_fire')) {
          drawFireParticles(context, effect.opacity);
        } else if (effect.type.includes('particles_gold')) {
          drawGoldParticles(context, effect.opacity);
        } else if (effect.type.includes('particles_blue')) {
          drawBlueParticles(context, effect.opacity);
        } else if (effect.type.includes('aura')) {
          drawAura(
            context,
            effect.type.includes('mystical') ? '#4287f5' : '#f5d742',
            effect.opacity,
          );
        }

        context.restore();
      });

      // Draw card stats if enabled
      if (showCardStats) {
        drawCardStats(context, card);
      }
    },
    [arEffects, showCardStats],
  );

  /**
   * Draw fire particle effect
   */
  const drawFireParticles = (context, opacity) => {
    const colors = ['#ff4500', '#ff6600', '#ff8c00', '#ffaa00'];

    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      context.fillStyle =
        color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, '0');
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
  };

  /**
   * Draw gold particle effect
   */
  const drawGoldParticles = (context, opacity) => {
    const colors = ['#ffd700', '#ffdf00', '#f0e68c', '#daa520'];

    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const size = Math.random() * 5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      context.fillStyle =
        color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, '0');
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
  };

  /**
   * Draw blue particle effect
   */
  const drawBlueParticles = (context, opacity) => {
    const colors = ['#4287f5', '#42c5f5', '#42f5f2', '#428df5'];

    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const size = Math.random() * 5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      context.fillStyle =
        color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, '0');
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
  };

  /**
   * Draw aura effect
   */
  const drawAura = (context, color, opacity) => {
    const gradient = context.createRadialGradient(0, 0, 10, 0, 0, 50);
    gradient.addColorStop(
      0,
      color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, '0'),
    );
    gradient.addColorStop(1, color + '00');

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 50, 0, Math.PI * 2);
    context.fill();
  };

  /**
   * Draw card statistics overlay
   */
  const drawCardStats = (context, card) => {
    const canvas = context.canvas;

    // Draw stats background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, canvas.height - 120, canvas.width, 120);

    // Draw card name
    context.fillStyle = '#ffffff';
    context.font = 'bold 18px Arial';
    context.textAlign = 'left';
    context.fillText(card.name, 10, canvas.height - 95);

    // Draw card type and rarity
    context.font = '14px Arial';
    context.fillText(`${card.type} • ${card.rarity}`, 10, canvas.height - 75);

    // Draw card stats
    if (card.type === 'Creature') {
      context.fillText(
        `Power/Toughness: ${card.power}/${card.toughness}`,
        10,
        canvas.height - 55,
      );
    }
    context.fillText(`Cost: ${card.cost}`, 10, canvas.height - 35);

    // Draw card description (truncated if needed)
    const description =
      card.description.length > 60
        ? card.description.substring(0, 57) + '...'
        : card.description;
    context.fillText(description, 10, canvas.height - 15);

    // Draw available animations
    context.textAlign = 'right';
    context.fillText('Animations:', canvas.width - 10, canvas.height - 95);
    card.arAnimations.forEach((animation, index) => {
      context.fillText(
        animation,
        canvas.width - 10,
        canvas.height - 75 + index * 20,
      );
    });
  };

  /**
   * Toggle card statistics display
   */
  const toggleCardStats = useCallback(() => {
    setShowCardStats(prev => !prev);
  }, []);

  /**
   * Trigger a random animation for the current card
   */
  const triggerAnimation = useCallback(() => {
    if (!currentCard) return;

    const animation =
      currentCard.arAnimations[
        Math.floor(Math.random() * currentCard.arAnimations.length)
      ];
    alert(`Triggered animation: ${animation}`);

    // In a real implementation, this would trigger the 3D model animation
  }, [currentCard]);

  /**
   * Clean up resources when component unmounts
   */
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className={`ar-viewer ${isAncientTheme ? 'ancient-theme' : ''}`}>
      <h2>Augmented Reality Card Viewer</h2>

      <div className="ar-container">
        <video
          ref={videoRef}
          className="ar-video"
          playsInline
          muted
          style={{ display: isActive ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="ar-canvas"
          style={{ display: isActive ? 'block' : 'none' }}
        />

        {!isActive && (
          <div className="ar-placeholder">
            <p>Experience your cards in augmented reality!</p>
            <p className="ar-description">
              Point your camera at a physical card to see it come to life with
              3D models and animations.
            </p>
            <button onClick={initializeAR}>Start AR Experience</button>
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="ar-controls">
        {isActive && (
          <>
            <button onClick={stopAR} className="stop-button">
              Stop AR
            </button>

            <button onClick={toggleCardStats} className="toggle-button">
              {showCardStats ? 'Hide Card Stats' : 'Show Card Stats'}
            </button>

            {currentCard && (
              <button onClick={triggerAnimation} className="animation-button">
                Trigger Animation
              </button>
            )}
          </>
        )}
      </div>

      {currentCard && isActive && (
        <div className="detected-card-info">
          <h3>Detected Card</h3>
          <div className="card-details">
            <div className="card-main-info">
              <p>
                <strong>Name:</strong> {currentCard.name}
              </p>
              <p>
                <strong>ID:</strong> {currentCard.id}
              </p>
              <p>
                <strong>Type:</strong> {currentCard.type}
              </p>
              <p>
                <strong>Rarity:</strong> {currentCard.rarity}
              </p>
              {currentCard.type === 'Creature' && (
                <p>
                  <strong>Stats:</strong> {currentCard.power}/
                  {currentCard.toughness}
                </p>
              )}
              <p>
                <strong>Cost:</strong> {currentCard.cost}
              </p>
            </div>

            <div className="card-ar-info">
              <p>
                <strong>3D Model:</strong> {currentCard.arModel}
              </p>
              <p>
                <strong>Animations:</strong>{' '}
                {currentCard.arAnimations.join(', ')}
              </p>
              <p>
                <strong>Effects:</strong> {currentCard.arEffects.join(', ')}
              </p>
            </div>
          </div>

          <div className="card-description">
            <p>
              <strong>Description:</strong>
            </p>
            <p>{currentCard.description}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .ar-viewer {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }

        .ar-container {
          position: relative;
          width: 100%;
          height: 400px;
          margin: 20px 0;
          border: 2px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 8px;
          overflow: hidden;
          background-color: ${isAncientTheme ? '#1a1914' : '#f0f0f0'};
        }

        .ar-video,
        .ar-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          text-align: center;
        }

        .ar-description {
          margin-bottom: 20px;
          font-style: italic;
          max-width: 400px;
        }

        .ar-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: ${isAncientTheme ? '#a89a6a' : '#535bf2'};
        }

        .stop-button {
          background-color: ${isAncientTheme ? '#7a4e4e' : '#f44336'};
        }

        .stop-button:hover {
          background-color: ${isAncientTheme ? '#8c5f5f' : '#d32f2f'};
        }

        .toggle-button {
          background-color: ${isAncientTheme ? '#4e7a7a' : '#2196f3'};
        }

        .toggle-button:hover {
          background-color: ${isAncientTheme ? '#5f8c8c' : '#1976d2'};
        }

        .animation-button {
          background-color: ${isAncientTheme ? '#7a4e7a' : '#9c27b0'};
        }

        .animation-button:hover {
          background-color: ${isAncientTheme ? '#8c5f8c' : '#7b1fa2'};
        }

        .detected-card-info {
          padding: 15px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          margin-top: 20px;
        }

        .card-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .card-main-info,
        .card-ar-info {
          flex: 1;
          min-width: 200px;
        }

        .card-description {
          border-top: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          padding-top: 10px;
        }

        .error-message {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          background-color: rgba(255, 0, 0, 0.7);
          color: white;
          text-align: center;
        }

        .ancient-theme h2,
        .ancient-theme h3 {
          font-family: 'Cinzel', serif;
          color: #d4b86a;
        }
      `}</style>
    </div>
  );
};

export default React.memo(AugmentedRealityViewer);
