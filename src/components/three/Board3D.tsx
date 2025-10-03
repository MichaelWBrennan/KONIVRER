import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";
import type { GameState, DragState, Card as CardType, KonivrverZoneType } from "../../types/game";
import type { DeviceInfo } from "../../utils/deviceDetection";
import { Zones3D } from "./Zones3D";

interface Board3DProps {
  gameState: GameState;
  dragState: DragState;
  device: DeviceInfo;
  onCardClick: (c: CardType) => void;
  onCardContext: (c: CardType) => void;
  onStartDrag?: (c: CardType, from: KonivrverZoneType) => void;
  onZoneDrop?: (target: KonivrverZoneType) => void;
}

export const Board3D: React.FC<Board3DProps> = ({
  gameState,
  dragState,
  device,
  onCardClick,
  onCardContext,
  onStartDrag,
  onZoneDrop,
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayer];

  // Textures (local, free-to-use in repo)
  const boardTex = useTexture("/assets/game-area-layout.png");
  const groundTex = useTexture("/assets/cards/BRIGHTMUD.webp");
  boardTex.wrapS = boardTex.wrapT = RepeatWrapping;
  groundTex.wrapS = groundTex.wrapT = RepeatWrapping;
  groundTex.repeat.set(6, 6);

  return (
    <Canvas shadows camera={{ position: [0, 6, 8], fov: 45 }}>
      <color attach="background" args={[0.07, 0.07, 0.09]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Ground table */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={groundTex} />
      </mesh>

      {/* Game board area (slightly raised) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial map={boardTex} />
      </mesh>

      {/* Zones and cards */}
      <Zones3D
        zones={currentPlayer.zones}
        device={device}
        dragState={dragState}
        onCardClick={onCardClick}
        onCardContext={onCardContext}
        onStartDrag={onStartDrag}
        onZoneDrop={onZoneDrop}
      />

      {/* Helpers */}
      <Environment preset="city" />
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};
