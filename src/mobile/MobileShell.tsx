import React from 'react';
import * as s from './mobileShell.css.ts';
import { MobileNav } from './MobileNav';

interface Props {
  current: string;
  title: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<Props> = ({ current, title, onNavigate, children }) => {
  const actions = () => {
    if (current === 'cards') return (<button className={s.iconBtn} onClick={()=>document.querySelector<HTMLInputElement>('.search-input')?.focus()}>Search</button>);
    if (current === 'decks') return (<button className={s.iconBtn} onClick={()=>onNavigate('deckbuilder')}>New Deck</button>);
    if (current === 'events') return (<button className={s.iconBtn} onClick={()=>{ const el = document.querySelector("button:contains('Report')"); (el as HTMLButtonElement)?.click(); }}>Report</button>);
    return null;
  };
  return (
    <div className={s.shell}>
      <header className={s.header}>
        <div className={s.headerRow}>
          <div className={s.title}>{title}</div>
          <div className={s.headerActions}>{actions()}</div>
        </div>
      </header>
      <div className={s.content}>{children}</div>
      <MobileNav current={current} onNavigate={onNavigate} />
    </div>
  );
};

