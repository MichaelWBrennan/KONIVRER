import type { Card } from "../data/cards";

function extractBaseFromPath(path: string): string | null {
  try {
    const last = path.split("/").pop();
    if (!last) return null;
    const base = last.replace(/\.(png|jpg|jpeg|webp|svg)$/i, "");
    return base || null;
  } catch {
    return null;
  }
}

function deriveBaseNameFromCard(card: Pick<Card, "name"> & Partial<Card>): string {
  const candidates: Array<string | undefined> = [card.webpUrl, card.imageUrl];
  for (const c of candidates) {
    if (!c) continue;
    const base = extractBaseFromPath(c);
    if (base) return base.toUpperCase();
  }

  // Fallback: derive from display name by stripping non-alphanumerics and uppercasing
  const normalized = card.name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return normalized;
}

export function resolveCardImageUrls(card: Card): { webpSrc: string; imgSrc: string } {
  const base = deriveBaseNameFromCard(card);
  const webpSrc = `/assets/cards/${base}.webp`;
  // Prefer WebP for both <source> and <img> to avoid broken PNG references
  const imgSrc = webpSrc;
  return { webpSrc, imgSrc };
}

