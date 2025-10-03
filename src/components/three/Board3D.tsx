import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture, useGLTF, Html } from "@react-three/drei";
import { RepeatWrapping, Color, EquirectangularReflectionMapping, sRGBEncoding } from "three";
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

  // Esoteric props: CC0 models from Poly Haven (pre-downloaded)
  const chandelier = useGLTF("/assets/3d/models/Chandelier_03_1k.gltf");
  const lantern = useGLTF("/assets/3d/models/wooden_lantern_01_1k.gltf");
  const chair = useGLTF("/assets/3d/models/ArmChair_01_1k.gltf");

  return (
    <Canvas shadows camera={{ position: [0, 6, 8], fov: 45 }}>
      <color attach="background" args={[0.07, 0.07, 0.09]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.9}
        color={new Color('#ffd9a3')}
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

      {/* Esoteric props */}
      <group position={[0, 3.2, 0]}>
        <primitive object={chandelier.scene} scale={0.7} />
      </group>
      <group position={[-5.2, 0, -3.2]}>
        <primitive object={chair.scene} scale={0.02} rotation={[0, Math.PI/6, 0]} />
      </group>
      <group position={[5.2, 0, -3.2]}>
        <primitive object={chair.scene.clone()} scale={0.02} rotation={[0, -Math.PI/6, 0]} />
      </group>
      <group position={[ -3.5, 0.02, 3.2 ]}>
        <primitive object={lantern.scene} scale={0.004} />
      </group>

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
      {/* Night HDRI for mood (2K) */}
      <Environment files="/assets/3d/hdr/zwinger_night_2k.hdr" background />
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};
