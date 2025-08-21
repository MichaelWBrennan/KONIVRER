import { style, globalStyle } from '@vanilla-extract/css';

export const root = style({ position: 'fixed', zIndex: 1000, pointerEvents: 'none', display: 'block', contain: 'layout style' });
export const mobile = style({ bottom: 'max(20px, env(safe-area-inset-bottom, 0px) + 10px)', left: 'max(20px, env(safe-area-inset-left, 0px) + 10px)', right: 'max(20px, env(safe-area-inset-right, 0px) + 10px)' });
export const desktop = style({ top: 20, right: 20 });
export const bubbleContainer = style({ position: 'absolute', pointerEvents: 'auto', contain: 'layout style', order: 'initial' as any, willChange: 'auto' });

export const bubbleBtn = style({
  width: 56,
  height: 56,
  minWidth: 44,
  minHeight: 44,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--accent-color)',
  color: 'white',
  fontSize: 20,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s ease',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 2,
  touchAction: 'manipulation',
  userSelect: 'none',
  selectors: {
    '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.4)' },
  },
});

export const accessibilityBtn = style({ background: '#059669' });
export const searchBtn = style({ background: '#3b82f6' });
export const loginBtn = style({ background: '#8b5cf6' });
export const menuBtn = style({ background: '#f97316' });

export const panel = style({
  position: 'relative',
  background: 'var(--background-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(10px)',
  zIndex: 1,
  minWidth: 280,
  maxWidth: 'calc(100vw - 40px)'
});

export const panelCloseBtn = style({ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 16, cursor: 'pointer', padding: 4, borderRadius: 4, lineHeight: '1', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' });

export const settingGroup = style({ marginBottom: 16 });
export const menuNav = style({ display: 'flex', flexDirection: 'column', gap: 4 });
export const menuItem = style({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: 'none', borderRadius: 8, background: 'transparent', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: 16, width: '100%' });
export const menuItemActive = style({ background: 'var(--accent-color)', color: 'white' });
export const menuLabel = style({ fontWeight: 500 });

// User panel styles
export const userProfile = style({ textAlign: 'center' });
export const userAvatarLarge = style({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'var(--accent-color)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 32,
  margin: '0 auto 16px auto',
});
export const userActions = style({ display: 'flex', gap: 10, justifyContent: 'center' });

globalStyle(`${root}.mobile .accessibility-bubble`, { bottom: 70, left: 0, position: 'absolute', order: 1 as any });
globalStyle(`${root}.mobile .search-bubble`, { bottom: 70, right: 0, position: 'absolute', order: 2 as any });
globalStyle(`${root}.mobile .login-bubble`, { bottom: 0, left: 0, position: 'absolute', order: 3 as any });
globalStyle(`${root}.mobile .menu-bubble`, { bottom: 0, right: 0, position: 'absolute', order: 4 as any });

globalStyle(`${root}.desktop .accessibility-bubble`, { top: 0, right: 0, position: 'absolute', order: 1 as any });
globalStyle(`${root}.desktop .search-bubble`, { top: 70, right: 0, position: 'absolute', order: 2 as any });
globalStyle(`${root}.desktop .login-bubble`, { top: 140, right: 0, position: 'absolute', order: 3 as any });
globalStyle(`${root}.desktop .menu-bubble`, { top: 210, right: 0, position: 'absolute', order: 4 as any });

