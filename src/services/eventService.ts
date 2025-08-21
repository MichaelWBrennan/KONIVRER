export type ReportPayload = { eventId: string; round: number; table: number; winnerId?: string; result: string; drop?: boolean };

export const EventService = {
  async fetchPairings(_eventId: string, _round: number) {
    // TODO: integrate real API; for now return mock data
    await new Promise((r) => setTimeout(r, 300));
    return [
      { tableNumber: 1, playerA: { id: 'p1', name: 'Alice' }, playerB: { id: 'p2', name: 'Bob' }, status: 'pending' as const },
      { tableNumber: 2, playerA: { id: 'p3', name: 'Carol' }, playerB: { id: 'p4', name: 'Dan' }, status: 'pending' as const },
    ];
  },
  async reportMatch(_payload: ReportPayload) {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true };
  },
  async callJudge(_eventId: string, _table: number, _message?: string) {
    await new Promise((r) => setTimeout(r, 200));
    return { ok: true, ticketId: Math.random().toString(36).slice(2) };
  },
};

