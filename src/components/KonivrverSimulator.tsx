import React, { useState, useEffect } from "react";
import { detectDevice, DeviceInfo } from "../utils/deviceDetection";
import { useKonivrverGameState } from "../hooks/useKonivrverGameState";
import type { Card } from "../types/game";
import { Board3D } from "./three/Board3D";

// Legacy 2D zone UI removed in favor of 3D renderer. Drop logic stays in hooks.

export const KonivrverSimulator: React.FC = () => {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const {
    gameState,
    dragState,
    getCurrentPlayerLife,
    startDrag,
    handleZoneDrop,
    nextPhase,
    drawCard,
    playCard,
  } = useKonivrverGameState();

  useEffect(() => {
    const deviceInfo = detectDevice();
    setDevice(deviceInfo);
  }, []);

  if (!device) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f0f",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading KONIVRER Simulator...
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayer];

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);

    // If card is in hand and it's main phase, try to play it
    if (gameState.phase === "main") {
      const isInHand = currentPlayer.zones.hand.cards.some(
        (c) => c.id === card.id,
      );
      if (isInHand) {
        playCard(card);
        setSelectedCard(null);
      }
    }
  };

  // Minimal drag start integration for 3D (source zone inferred from current player zones)
  const handleStartDrag = (card: Card) => {
    const from = (Object.entries(currentPlayer.zones).find(([, z]) =>
      z.cards.some((c) => c.id === card.id),
    )?.[0] || "hand") as any;
    // startDrag expects KonivrverZoneType
    // @ts-ignore safe at runtime due to type union
    startDrag(card as any, from);
  };

  // Render phase indicator
  const renderPhaseIndicator = () => (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 100, 200, 0.9)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "capitalize",
        cursor: "pointer",
        zIndex: 100,
      }}
      onClick={nextPhase}
    >
      Turn {gameState.turn} - {gameState.phase}
    </div>
  );

  // Render player info
  const renderPlayerInfo = () => (
    <div
      style={{
        position: "absolute",
        top: "60px",
        left: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "14px",
        zIndex: 100,
      }}
    >
      <div>
        <strong>{currentPlayer.name}</strong>
      </div>
      <div>Life Cards: {getCurrentPlayerLife()}</div>
      <div style={{ marginTop: "8px" }}>
        <strong>Azoth Pool:</strong>
        {Object.entries(currentPlayer.azothPool).map(
          ([element, amount]) =>
            amount > 0 && (
              <div key={element} style={{ fontSize: "12px" }}>
                {element}: {amount}
              </div>
            ),
        )}
      </div>
    </div>
  );

  // Render control buttons
  const renderControls = () => (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "8px",
        zIndex: 100,
      }}
    >
      <button
        style={{
          backgroundColor: "rgba(0, 150, 0, 0.8)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={drawCard}
      >
        Draw Card
      </button>
      <button
        style={{
          backgroundColor: "rgba(150, 0, 0, 0.8)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => window.location.reload()}
      >
        Reset Game
      </button>
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #2c1810 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, serif",
        userSelect: "none",
      }}
    >
      {/* 3D Board */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Board3D
          gameState={gameState}
          dragState={dragState}
          device={device}
          onCardClick={handleCardClick}
          onCardContext={() => {}}
          onStartDrag={(c) => handleStartDrag(c)}
          onZoneDrop={(z) => handleZoneDrop(z as any)}
        />
      </div>

      {/* UI Overlays */}
      {renderPhaseIndicator()}
      {renderPlayerInfo()}
      {renderControls()}

      {/* Selected Card Details */}
      {selectedCard && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
            zIndex: 1000,
            border: "2px solid #666",
          }}
        >
          <h3>{selectedCard.name}</h3>
          <p>
            <strong>Type:</strong> {selectedCard.lesserType}
          </p>
          <p>
            <strong>Elements:</strong> {selectedCard.elements.join(", ")}
          </p>
          <p>
            <strong>Azoth Cost:</strong> {selectedCard.azothCost}
          </p>
          {selectedCard.power && selectedCard.toughness && (
            <p>
              <strong>Power/Toughness:</strong> {selectedCard.power}/
              {selectedCard.toughness}
            </p>
          )}
          <p>
            <strong>Rules Text:</strong> {selectedCard.rulesText}
          </p>
          {selectedCard.abilities && selectedCard.abilities.length > 0 && (
            <p>
              <strong>Abilities:</strong> {selectedCard.abilities.join(", ")}
            </p>
          )}
          <button
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedCard(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "12px",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        Click cards in hand during Main phase to play them • Drag cards between
        zones • Click phase indicator to advance
      </div>
    </div>
  );
};
