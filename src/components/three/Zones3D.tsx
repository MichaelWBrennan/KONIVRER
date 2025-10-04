import React, { useMemo } from "react";
import type { Card as CardType, DragState, GameZone, KonivrverZoneType } from "../../types/game";
import { DeviceInfo } from "../../utils/deviceDetection";
import { computeBoardLayout } from "./layout";
import { Card3D } from "./Card3D";

interface Zones3DProps {
  zones: Record<KonivrverZoneType, GameZone>;
  device: DeviceInfo;
  dragState: DragState;
  onCardClick: (c: CardType) => void;
  onCardContext: (c: CardType) => void;
  onStartDrag?: (c: CardType, from: KonivrverZoneType) => void;
  onZoneDrop?: (target: KonivrverZoneType) => void;
}

export const Zones3D: React.FC<Zones3DProps> = ({
  zones,
  device,
  dragState,
  onCardClick,
  onCardContext,
  onStartDrag,
  onZoneDrop,
}) => {
  const layout = useMemo(() => computeBoardLayout(zones, { boardWorldWidth: 10 }), [zones]);

  // Helper to lay out cards in a zone: grid for field/rows, stack for stacks, fan for hand
  const renderZoneCards = (zoneId: KonivrverZoneType) => {
    const zone = zones[zoneId];
    const rect = layout.zones.find((z) => z.zoneId === zoneId)!;

    if (!zone || !rect) return null;

    const cards = zone.cards;

    if (cards.length === 0) return null;

    const items: React.ReactNode[] = [];

    if (zone.layout === "stack") {
      // Slight offsets to create stacked look
      cards.forEach((card, idx) => {
        const offset = idx * 0.02;
        items.push(
          <Card3D
            key={card.id}
            card={card}
            device={device}
            dragState={dragState}
            position={[rect.centerX + offset, 0.02 + idx * 0.001, rect.centerZ + offset]}
            rotationY={0}
            width={rect.width * 0.5}
            height={rect.height * 0.9}
            onClick={onCardClick}
            onContext={onCardContext}
            onStartDrag={(c) => onStartDrag?.(c, zoneId)}
          />
        );
      });
    } else if (zone.layout === "fan") {
      const spacing = (rect.width * 0.8) / Math.max(cards.length, 1);
      const start = rect.centerX - (rect.width * 0.8) / 2 + spacing / 2;
      cards.forEach((card, idx) => {
        const x = start + idx * spacing;
        const angle = ((idx - cards.length / 2) * Math.PI) / 36; // small fan
        items.push(
          <Card3D
            key={card.id}
            card={card}
            device={device}
            dragState={dragState}
            position={[x, 0.02, rect.centerZ]}
            rotationY={angle}
            width={rect.width / 8}
            height={rect.height * 0.9}
            onClick={onCardClick}
            onContext={onCardContext}
            onStartDrag={(c) => onStartDrag?.(c, zoneId)}
          />
        );
      });
    } else {
      // grid/row layout
      const maxCols = Math.max(1, Math.floor(rect.width / 0.9));
      cards.forEach((card, idx) => {
        const row = Math.floor(idx / maxCols);
        const col = idx % maxCols;
        const x = rect.centerX - rect.width / 2 + 0.5 + col * 0.9;
        const z = rect.centerZ - rect.height / 2 + 0.6 + row * 1.1;
        items.push(
          <Card3D
            key={card.id}
            card={card}
            device={device}
            dragState={dragState}
            position={[x, 0.02, z]}
            rotationY={0}
            width={0.65}
            height={0.9}
            onClick={onCardClick}
            onContext={onCardContext}
            onStartDrag={(c) => onStartDrag?.(c, zoneId)}
          />
        );
      });
    }

    return <>{items}</>;
  };

  // Render drop planes per zone and cards
  return (
    <group>
      {(Object.keys(zones) as KonivrverZoneType[]).map((zoneId) => {
        const rect = layout.zones.find((r) => r.zoneId === zoneId)!;
        const isDroppable = dragState.validDropZones.includes(zoneId);
        return (
          <group key={zoneId}>
            {/* Invisible/low alpha plane to detect pointer up for drops */}
            <mesh
              position={[rect.centerX, 0.011, rect.centerZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (dragState.isDragging && isDroppable) {
                  onZoneDrop?.(zoneId);
                }
              }}
              onPointerOver={(e) => {
                // allow cursor hover when valid drop target
                if (dragState.isDragging && isDroppable) {
                  (e.target as any).cursor = "pointer";
                }
              }}
            >
              <planeGeometry args={[rect.width, rect.height]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Cards inside zone */}
            {renderZoneCards(zoneId)}
          </group>
        );
      })}
    </group>
  );
};
