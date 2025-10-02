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

function sanitizeDisplayName(name: string): string {
  return name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function deriveBaseNameFromCard(card: Pick<Card, "name"> & Partial<Card>): string {
  // Prefer deriving from the human-readable display name to match local asset naming
  const fromName = sanitizeDisplayName(card.name);
  if (fromName) return fromName;

  // Fallback: try to extract from provided URLs (backend may return mismatched paths)
  const candidates: Array<string | undefined> = [card.webpUrl, card.imageUrl];
  for (const c of candidates) {
    if (!c) continue;
    const base = extractBaseFromPath(c);
    if (base) return sanitizeDisplayName(base);
  }

  // Final fallback
  return "";
}

export function resolveCardImageUrls(
  card: Pick<Card, "name"> & Partial<Card>,
): { webpSrc: string; imgSrc: string } {
  const base = deriveBaseNameFromCard(card);

  const baseUrl = (import.meta as any)?.env?.BASE_URL ?? "/";
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  const fallback = `${normalizedBaseUrl}assets/card-back-new.webp`;

  // Prefer explicit webpUrl if provided
  if (card.webpUrl && typeof card.webpUrl === "string") {
    // If it is a root-relative asset, prefix BASE_URL
    if (card.webpUrl.startsWith("/assets/")) {
      const webpSrc = `${normalizedBaseUrl}${card.webpUrl.replace(/^\/+/, "")}`;
      return { webpSrc, imgSrc: webpSrc };
    }
    // If it is an absolute URL or another path, use as-is
    return { webpSrc: card.webpUrl, imgSrc: card.webpUrl };
  }

  if (base) {
    const webpSrc = `${normalizedBaseUrl}assets/cards/${base}.webp`;
    return { webpSrc, imgSrc: webpSrc };
  }

  return { webpSrc: fallback, imgSrc: fallback };
}

