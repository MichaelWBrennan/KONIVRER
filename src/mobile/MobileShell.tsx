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
  return (
    <div className={s.shell}>
      <header className={s.header}>
        <div className={s.title}>{title}</div>
      </header>
      <div className={s.content}>{children}</div>
      <MobileNav current={current} onNavigate={onNavigate} />
    </div>
  );
};

