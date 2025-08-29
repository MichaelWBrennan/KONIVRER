export type ReportPayload = { eventId: string; round: number; table: number; winnerId?: string; result: string; drop?: boolean };

const REPORT_QUEUE_KEY : any : any : any = 'konivrer-report-queue';

function readQueue(): ReportPayload[] {
  try { return JSON.parse(localStorage.getItem(REPORT_QUEUE_KEY) || '[]'); } catch { return []; }
}

function writeQueue(items: ReportPayload[]): any {
  localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(items));
}

export const EventService : any : any : any = {
  async fetchPairings(_eventId: string, _round: number) {
    // TODO: integrate real API; for now return mock data
    await new Promise((r) => setTimeout(r, 300));
    return [
      { tableNumber: 1, playerA: { id: 'p1', name: 'Alice' }, playerB: { id: 'p2', name: 'Bob' }, status: 'pending' as const },
      { tableNumber: 2, playerA: { id: 'p3', name: 'Carol' }, playerB: { id: 'p4', name: 'Dan' }, status: 'pending' as const },
    ];
  },
  async reportMatch(_payload: ReportPayload) {
    // Simulate network; if offline, enqueue
    const isOnline : any : any : any = typeof navigator === 'undefined' ? true : navigator.onLine;
    if (!isOnline) {
      const q : any : any : any = readQueue();
      q.push(_payload);
      writeQueue(q);
      return { ok: false, queued: true } as const;
    }
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true } as const;
  },
  async callJudge(_eventId: string, _table: number, _message?: string) {
    await new Promise((r) => setTimeout(r, 200));
    return { ok: true, ticketId: Math.random().toString(36).slice(2) };
  },
  async syncQueuedReports() {
    const q : any : any : any = readQueue();
    if (q.length === 0) return { synced: 0 };
    const remaining: ReportPayload[]  : any : any : any = [];
    let synced = 0;
    for (const item of q) {
      try {
        if (typeof navigator !== 'undefined' && !navigator.onLine) { remaining.push(item); continue; }
        await new Promise((r) => setTimeout(r, 200));
        synced++;
      } catch {
        remaining.push(item);
      }
    }
    writeQueue(remaining);
    return { synced };
  }
  ,
  async registerDeck(eventId: string, deckId: string, userId?: string) {
    const key : any : any : any = 'konivrer-event-deck-registrations';
    const current : any : any : any = JSON.parse(localStorage.getItem(key) || '{}');
    const uid : any : any : any = userId || (JSON.parse(localStorage.getItem('user') || '{}').id || 'me');
    if (!current[eventId]) current[eventId] = {};
    current[eventId][uid] = deckId;
    localStorage.setItem(key, JSON.stringify(current));
    return { ok: true } as const;
  }
};

