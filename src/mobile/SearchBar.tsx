import React, { useEffect, useState } from 'react';
import * as s from './searchBar.css.ts';

interface Props {
  current: string;
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<Props>   : any = ({ current, onSearch }) => {
  const [q, setQ]  : any = useState('');
  const [contextOverride, setContextOverride]  : any = useState<string | null>(null);
  useEffect(() => {
    const handler  : any = (e: any) => setContextOverride(e.detail);
    window.addEventListener('search-context', handler);
    return () => window.removeEventListener('search-context', handler);
  }, []);
  const placeholder  : any = (() => {
    const ctx  : any = contextOverride || current;
    switch (current) {
      case 'cards': return 'Search cards...';
      case 'decks': return 'Search decks...';
      case 'events':
        if (ctx === 'event-archive') return 'Search past events...';
        if (ctx === 'event-standings') return 'Search standings...';
        return 'Search pairings (name or table)...';
      case 'home': return 'Search posts...';
      default: return 'Search...';
    }
  })();
  useEffect(() => { const h  : any = setTimeout(() => onSearch(q), 300); return () => clearTimeout(h); }, [q]);
  return (
    <div className={s.wrap}>
      <input className={s.input} placeholder={placeholder} value={q} onChange={(e)=>setQ(e.target.value)} />
    </div>
  );
};

