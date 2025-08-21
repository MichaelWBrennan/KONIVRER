import type { VercelRequest, VercelResponse } from 'vercel';
import { xataFetch } from '../_xata';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    const { table, filter, columns, page, sorts } = req.body || {};
    if (!table) {
      res.status(400).json({ error: 'Missing table' });
      return;
    }
    const body = JSON.stringify({ filter, columns, page, sorts });
    const data = await xataFetch(`/tables/${encodeURIComponent(table)}/query`, {
      method: 'POST',
      body,
    });
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}

