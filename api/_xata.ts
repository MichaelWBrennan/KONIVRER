export function getXataBaseUrl(): string {
  const baseUrl = process.env.XATA_DATABASE_URL;
  if (!baseUrl) throw new Error('XATA_DATABASE_URL is not set');
  return baseUrl.replace(/\/$/, '');
}

export function getXataHeaders(): Record<string, string> {
  const apiKey = process.env.XATA_API_KEY;
  if (!apiKey) throw new Error('XATA_API_KEY is not set');
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function xataFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getXataBaseUrl()}${path}`;
  const headers = { ...getXataHeaders(), ...(init?.headers as any) };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Xata API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

