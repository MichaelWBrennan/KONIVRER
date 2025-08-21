import React, { useState } from 'react';
import * as s from './mobileNav.css.ts';

type Tab = 'home' | 'cards' | 'decks' | 'simulator' | 'more';

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ current, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const active = (t: Tab) => (current === t ? s.tabActive : '');
  return (
    <nav className={s.nav} aria-label="Primary">
      <div className={s.navInner}>
        <button className={`${s.tab} ${active('home')}`} onClick={() => onNavigate('home')}>
          <span>🏠</span>
          <span className={s.label}>Home</span>
        </button>
        <button className={`${s.tab} ${active('cards')}`} onClick={() => onNavigate('cards')}>
          <span>🃏</span>
          <span className={s.label}>Cards</span>
        </button>
        <button className={`${s.tab} ${active('decks')}`} onClick={() => onNavigate('decks')}>
          <span>🗂️</span>
          <span className={s.label}>Decks</span>
        </button>
        <button className={`${s.tab} ${active('simulator')}`} onClick={() => onNavigate('simulator')}>
          <span>🎮</span>
          <span className={s.label}>Play</span>
        </button>
        <button className={`${s.tab} ${active('more')}`} onClick={() => setOpen(true)}>
          <span>⋯</span>
          <span className={s.label}>More</span>
        </button>
      </div>

      {open && (
        <div className={s.moreOverlay} onClick={() => setOpen(false)}>
          <div className={s.sheet} onClick={(e) => e.stopPropagation()}>
            {[
              ['my-decks','My Decks'],
              ['deckbuilder','Deckbuilder'],
              ['analytics','Analytics'],
              ['events','Events'],
              ['rules','Rules'],
              ['judge','Judge'],
              ['pdf','PDF Viewer'],
              ['settings','Settings'],
            ].map(([page, label]) => (
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

