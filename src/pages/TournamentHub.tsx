import React, { useEffect, useMemo, useState } from 'react';
import * as s from './tournamentHub.css.ts';
import { useEventStore } from '../stores/eventStore';
import { EventService } from '../services/eventService';
import { NotificationService } from '../services/notifications';

type EventsTab = 'live' | 'archive';

export const TournamentHub: React.FC = () => {
  const [tab, setTab] = useState<EventsTab>('live');
  const [query, setQuery] = useState('');
  const { currentEventId, roundNumber, roundEndsAt, pairings, myTable, setPairings, setMyTableFromPairings, setLoading, setError } = useEventStore();

  useEffect(() => {
    const handler = (e: any) => setQuery(e.detail || '');
    window.addEventListener('pairings-search', handler as any);
    return () => window.removeEventListener('pairings-search', handler as any);
  }, []);

  useEffect(() => {
    // Update global search context so SearchBar adjusts placeholder when switching tabs
    const ctx = tab === 'archive' ? 'event-archive' : 'events';
    window.dispatchEvent(new CustomEvent('search-context', { detail: ctx }));
  }, [tab]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await EventService.fetchPairings(currentEventId || 'demo', roundNumber || 1);
        setPairings(data);
        setMyTableFromPairings();
        const mine = data.find(d => d.tableNumber === (useEventStore.getState().myTable || 0));
        if (mine) {
          NotificationService.getInstance().sendSeatingAssignmentNotification(mine.tableNumber, mine.playerA.name, currentEventId || 'demo', roundNumber || 1);
        }
      } catch (e) {
        setError('Failed to load pairings');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentEventId, roundNumber, setLoading, setPairings, setMyTableFromPairings, setError]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return pairings;
    return pairings.filter((p) => `${p.tableNumber}`.includes(q) || p.playerA.name.toLowerCase().includes(q) || p.playerB.name.toLowerCase().includes(q));
  }, [pairings, query]);

  const current = useMemo(() => {
    if (!myTable) return undefined;
    return pairings.find(p => p.tableNumber === myTable);
  }, [pairings, myTable]);

  const [report, setReport] = useState({ table: myTable || 0, result: '2-1', winnerId: '' });

  // Show timer only when roundEndsAt is provided (round started)
  const showTimer = !!roundEndsAt && roundEndsAt > Date.now();
  const remainingMs = Math.max(0, (roundEndsAt || 0) - Date.now());
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000)/1000).toString().padStart(2,'0');

  // Archive stub data
  const archived = useMemo(() => ([
    { name: 'City Championship - June', date: '2025-06-12', players: 128 },
    { name: 'Regional Open - May', date: '2025-05-03', players: 256 },
  ]), []);
  const archivedFiltered = useMemo(() => archived.filter(a => (a.name.toLowerCase().includes(query.toLowerCase()) || a.date.includes(query))), [archived, query]);

  return (
    <div className={s.root}>
      <div className={s.tabs}>
        {(['live','archive'] as EventsTab[]).map(t => (
          <button key={t} className={`${s.tab} ${tab===t?s.tabActive:''}`} onClick={() => setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === 'live' && (
        <div>
          {showTimer && <div className={s.timer}>{mins}:{secs}</div>}

          {current && (
            <div className={s.pairingItem}>
              <div>Table {current.tableNumber}</div>
              <div>{current.playerA.name} vs {current.playerB.name}</div>
            </div>
          )}

          <form className={s.form} onSubmit={async (e)=>{e.preventDefault(); await EventService.reportMatch({eventId: currentEventId||'demo', round: roundNumber||1, table: report.table, winnerId: report.winnerId, result: report.result}); alert('Report submitted');}}>
            <input type="number" className="search-input" placeholder="Table" value={report.table} onChange={(e)=>setReport(r=>({...r, table: Number(e.target.value)}))} />
            <select className="filter-select" value={report.result} onChange={(e)=>setReport(r=>({...r, result: e.target.value}))}>
              {['2-0','2-1','1-2','0-2','ID'].map(x=>(<option key={x} value={x}>{x}</option>))}
            </select>
            <input className="search-input" placeholder="Winner player ID (optional)" value={report.winnerId} onChange={(e)=>setReport(r=>({...r, winnerId: e.target.value}))} />
            <button className="btn btn-primary" type="submit">Submit Result</button>
          </form>

          {filtered.map((p) => (
            <div key={p.tableNumber} className={s.pairingItem}>
              <div>Table {p.tableNumber}</div>
              <div>{p.playerA.name} vs {p.playerB.name}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'archive' && (
        <div>
          {archivedFiltered.map(ev => (
            <div key={ev.name} className={s.pairingItem}>
              <div>{ev.name}</div>
              <div>{ev.date} • {ev.players} players</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

