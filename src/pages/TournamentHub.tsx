import React, { useEffect, useMemo, useState } from 'react';
import * as s from './tournamentHub.css.ts';
import { useEventStore } from '../stores/eventStore';
import { EventService } from '../services/eventService';

type HubTab = 'pairings' | 'report' | 'timer' | 'judge';

export const TournamentHub: React.FC = () => {
  const [tab, setTab] = useState<HubTab>('pairings');
  const [query, setQuery] = useState('');
  const { currentEventId, roundNumber, roundEndsAt, pairings, myTable, setPairings, setMyTableFromPairings, setLoading, setError } = useEventStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await EventService.fetchPairings(currentEventId || 'demo', roundNumber || 1);
        setPairings(data);
        setMyTableFromPairings();
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

  const [report, setReport] = useState({ table: myTable || 0, result: '2-1', winnerId: '' });

  const remainingMs = Math.max(0, (roundEndsAt || Date.now() + 45*60*1000) - Date.now());
  const mins = Math.floor(remainingMs / 60000); const secs = Math.floor((remainingMs % 60000)/1000).toString().padStart(2,'0');

  return (
    <div className={s.root}>
      <div className={s.tabs}>
        {(['pairings','report','timer','judge'] as HubTab[]).map(t => (
          <button key={t} className={`${s.tab} ${tab===t?s.tabActive:''}`} onClick={() => setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === 'pairings' && (
        <div>
          <input className={`search-input ${s.search}`} placeholder="Search by name or table" value={query} onChange={(e)=>setQuery(e.target.value)} />
          {filtered.map((p) => (
            <div key={p.tableNumber} className={s.pairingItem}>
              <div>Table {p.tableNumber}</div>
              <div>{p.playerA.name} vs {p.playerB.name}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'report' && (
        <form className={s.form} onSubmit={async (e)=>{e.preventDefault(); await EventService.reportMatch({eventId: currentEventId||'demo', round: roundNumber||1, table: report.table, winnerId: report.winnerId, result: report.result}); alert('Report submitted');}}>
          <input type="number" className="search-input" placeholder="Table" value={report.table} onChange={(e)=>setReport(r=>({...r, table: Number(e.target.value)}))} />
          <select className="filter-select" value={report.result} onChange={(e)=>setReport(r=>({...r, result: e.target.value}))}>
            {['2-0','2-1','1-2','0-2','ID'].map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          <input className="search-input" placeholder="Winner player ID (optional)" value={report.winnerId} onChange={(e)=>setReport(r=>({...r, winnerId: e.target.value}))} />
          <button className="btn btn-primary" type="submit">Submit Result</button>
        </form>
      )}

      {tab === 'timer' && (
        <div className={s.timer}>{mins}:{secs}</div>
      )}

      {tab === 'judge' && (
        <div className={s.form}>
          <button className="btn btn-danger" onClick={async ()=>{ await EventService.callJudge(currentEventId||'demo', myTable||0); alert('Judge called'); }}>Call Judge to Table {myTable||'-'}</button>
          <a className="btn btn-secondary" href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'});}}>Open Rules</a>
        </div>
      )}
    </div>
  );
};

