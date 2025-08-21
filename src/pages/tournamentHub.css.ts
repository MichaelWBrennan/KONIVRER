import { style } from '@vanilla-extract/css';

export const root = style({ padding: 12 });
export const tabs = style({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 });
export const tab = style({ padding: '8px 6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer' });
export const tabActive = style({ background: 'rgba(255,255,255,0.06)' });

export const search = style({ marginBottom: 10 });
export const pairingItem = style({ display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, marginBottom: 8 });
export const timer = style({ fontVariantNumeric: 'tabular-nums', textAlign: 'center', margin: '12px 0', fontSize: '1.2rem' });
export const form = style({ display: 'grid', gap: 8 });

