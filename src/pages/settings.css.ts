import { style } from '@vanilla-extract/css';

export const root = style({ padding: 12, display: 'grid', gap: 16 });
export const section = style({ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 });
export const sectionTitle = style({ fontWeight: 700, marginBottom: 8 });
export const row = style({ display: 'grid', gap: 8, marginTop: 8 });
export const actions = style({ display: 'flex', gap: 8, flexWrap: 'wrap' });

