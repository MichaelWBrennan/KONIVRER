import React, { useState } from 'react';
import * as s from './mobileNav.css.ts';
import { useAuth } from '../hooks/useAuth';

type Tab = 'home' | 'cards' | 'decks' | 'simulator' | 'more';

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props>    = ({ current, onNavigate }) => {
  const [open, setOpen]     = useState(false);
  const active     = (t: Tab) => (current === t ? s.tabActive : '');
  const { isAuthenticated, canAccessJudgePortal }     = useAuth();
  return (
    <nav className={s.nav} aria-label="Primary">
      <div className={s.navInner}>
        <button className={`${s.tab} ${active('home')}`} aria-current={current==='home'} onClick={() => onNavigate('home')}>
          <span className={s.label}>Home</span>
        </button>
        <button className={`${s.tab} ${active('cards')}`} aria-current={current==='cards'} onClick={() => onNavigate('cards')}>
          <span className={s.label}>Cards</span>
        </button>
        <button className={`${s.tab} ${active('decks')}`} aria-current={current==='decks'} onClick={() => onNavigate('decks')}>
          <span className={s.label}>Decks</span>
        </button>
        <button className={`${s.tab} ${active('simulator')}`} aria-current={current==='simulator'} onClick={() => onNavigate('simulator')}>
          <span className={s.label}>Play</span>
        </button>
        <button className={`${s.tab}`} onClick={() => { const evt     = new CustomEvent('open-login'); window.dispatchEvent(evt); }}>
          <span className={s.label}>Login</span>
        </button>
        <button className={`${s.tab} ${active('more')}`} aria-current={current==='more'} onClick={() => setOpen(true)}>
          <span className={s.label}>More</span>
        </button>
      </div>

      {open && (
        <div className={s.moreOverlay} onClick={() => setOpen(false)}>
          <div className={s.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={s.sheetHeader}>
              <div>Menu</div>
              <button className={s.closeBtn} onClick={()=>setOpen(false)} aria-label="Close menu">×</button>
            </div>
            {([
              ...(isAuthenticated ? [['my-decks','My Decks'] as const] : []),
              ['deckbuilder','Deckbuilder'] as const,
              ['events','Events'] as const,
              ['analytics','Analytics'] as const,
              ['rules','Rules'] as const,
              ...(canAccessJudgePortal() ? [['judge','Judge'] as const] : []),
              ['settings','Settings'] as const,
            ] as const).map(([page, label]) => (
              <div key={page} className={s.sheetItem} onClick={() => { onNavigate(page); setOpen(false); }}>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};