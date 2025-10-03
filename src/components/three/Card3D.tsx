import React, { useMemo, useRef } from "react";
import { Mesh, TextureLoader, DoubleSide } from "three";
import { useLoader } from "@react-three/fiber";
import type { Card as CardType, DragState } from "../../types/game";
import { DeviceInfo } from "../../utils/deviceDetection";
import { resolveCardImageUrls } from "../../utils/cardImages";

interface Card3DProps {
  card: CardType;
  device: DeviceInfo;
  dragState: DragState;
  position: [number, number, number]; // x,y,z in world units
  rotationY?: number; // radians
  width?: number; // world units
  height?: number; // world units
  onClick: (c: CardType) => void;
  onContext: (c: CardType) => void;
  onStartDrag?: (c: CardType) => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  card,
  position,
  rotationY = 0,
  width = 0.7,
  height = 1,
  onClick,
  onContext,
  onStartDrag,
}) => {
  const meshRef = useRef<Mesh>(null);

  const texture = useLoader(TextureLoader, (() => {
    const { imgSrc } = resolveCardImageUrls(card as any);
    return imgSrc;
  })());

  // Maintain aspect ratio similar to standard card (63x88mm ≈ 0.716)
  const [planeW, planeH] = useMemo(() => {
    const aspect = width / height;
    if (Math.abs(aspect - 0.716) < 0.05) return [width, height];
    return [0.716 * height, height];
  }, [width, height]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onStartDrag?.(card);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick(card);
  };

  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    onContext(card);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[ -Math.PI / 2, rotationY, 0 ]}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[planeW, planeH]} />
      <meshStandardMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
};
