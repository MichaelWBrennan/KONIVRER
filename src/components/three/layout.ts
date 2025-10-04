import type { GameZone, KonivrverZoneType } from "../../types/game";

export interface RectPx {
  x: number; // left
  y: number; // top
  width: number;
  height: number;
}

export interface RectWorld {
  centerX: number; // in world units
  centerZ: number; // in world units (we use XZ plane)
  width: number; // world units
  height: number; // world units
  zoneId: KonivrverZoneType;
}

export interface BoardLayout {
  worldWidth: number;
  worldHeight: number;
  worldOrigin: { x: number; z: number }; // top-left of the board in world units
  zones: RectWorld[];
}

/**
 * Compute a 3D board layout from zones that include pixel positions.
 * We map the pixel-space board extents to a world area (XZ plane) of fixed width while preserving aspect ratio.
 */
export function computeBoardLayout(
  zonesById: Record<KonivrverZoneType, GameZone>,
  options?: { boardWorldWidth?: number }
): BoardLayout {
  const boardWorldWidth = options?.boardWorldWidth ?? 10; // world units

  // Build list of pixel rects
  const rects: Array<{ id: KonivrverZoneType; rect: RectPx }> = [];
  (Object.keys(zonesById) as KonivrverZoneType[]).forEach((id) => {
    const z = zonesById[id];
    const p = z.position || { x: 0, y: 0, width: 100, height: 100 };
    rects.push({ id, rect: { x: p.x, y: p.y, width: p.width, height: p.height } });
  });

  // Get bounding box in pixel space
  const minX = Math.min(...rects.map((r) => r.rect.x));
  const minY = Math.min(...rects.map((r) => r.rect.y));
  const maxX = Math.max(...rects.map((r) => r.rect.x + r.rect.width));
  const maxY = Math.max(...rects.map((r) => r.rect.y + r.rect.height));

  const boardPxWidth = Math.max(1, maxX - minX);
  const boardPxHeight = Math.max(1, maxY - minY);

  const worldWidth = boardWorldWidth;
  const worldHeight = (boardPxHeight / boardPxWidth) * worldWidth;

  // Map pixel rects into world rects
  const zones: RectWorld[] = rects.map(({ id, rect }) => {
    const cxPx = rect.x - minX + rect.width / 2;
    const cyPx = rect.y - minY + rect.height / 2;

    // Convert to world: X maps to X, Y maps to Z with top-left origin
    const centerX = (cxPx / boardPxWidth) * worldWidth - worldWidth / 2;
    const centerZ = (cyPx / boardPxHeight) * worldHeight - worldHeight / 2;
    const width = (rect.width / boardPxWidth) * worldWidth;
    const height = (rect.height / boardPxHeight) * worldHeight;

    return { centerX, centerZ, width, height, zoneId: id };
  });

  return {
    worldWidth,
    worldHeight,
    worldOrigin: { x: -worldWidth / 2, z: -worldHeight / 2 },
    zones,
  };
}
