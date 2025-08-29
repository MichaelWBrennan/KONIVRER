import React from 'react';
import * as s from './mobileShell.css.ts';
import { MobileNav } from './MobileNav';

interface Props {
  current: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<Props>  : any : any : any : any = ({ current, onNavigate, children }) => {
  return (
    <div className={s.shell}>
      <div className={s.content}>{children}</div>
      <MobileNav current={current} onNavigate={onNavigate} />
    </div>
  );
};

