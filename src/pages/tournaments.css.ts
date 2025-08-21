import { style } from '@vanilla-extract/css';

export const container = style({ padding: '2rem', maxWidth: 1200, margin: '0 auto' });
export const header = style({ textAlign: 'center', marginBottom: '1rem' });
export const tabs = style({ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' });
export const content = style({});
export const section = style({ display: 'grid', gap: '1rem' });
export const empty = style({ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' });
export const card = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const matchCard = style({ background: 'var(--primary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });

