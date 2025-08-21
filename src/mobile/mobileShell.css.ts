import { style } from '@vanilla-extract/css';

export const shell = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
});

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 999,
  background: 'rgba(20,20,26,0.9)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  padding: '10px 12px',
});

export const title = style({ fontWeight: 700, fontSize: '1.05rem' });

export const content = style({ flex: 1, display: 'flex', flexDirection: 'column' });

export const headerRow = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 });
export const headerActions = style({ display: 'flex', alignItems: 'center', gap: 8 });
export const iconBtn = style({ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' });

