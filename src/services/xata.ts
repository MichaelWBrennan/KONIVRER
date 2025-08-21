export type XataQueryOptions = {
  table: string;
  filter?: Record<string, unknown>;
  columns?: string[];
  page?: { size?: number; offset?: number };
  sorts?: { column: string; direction?: 'asc' | 'desc' }[];
};

export async function xataQuery<T = unknown>(opts: XataQueryOptions): Promise<T> {
  const res = await fetch('/api/xata/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  if (!res.ok) throw new Error(`Xata query failed: ${res.status}`);
  return (await res.json()) as T;
}

