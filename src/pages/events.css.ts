import { style } from '@vanilla-extract/css';

export const container = style({ padding: '2rem', maxWidth: 1200, margin: '0 auto' });
export const header = style({ textAlign: 'center', marginBottom: '1.5rem' });
export const nav = style({ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' });
export const navTabs = style({ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' });
export const content = style({});
export const list = style({ display: 'grid', gap: '1rem' });
export const empty = style({ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' });
export const eventCard = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const eventHeader = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' });
export const eventName = style({ margin: 0, color: 'var(--text-primary)' });
export const eventStatus = style({ color: 'var(--text-secondary)', fontSize: '0.85rem' });
export const eventDetails = style({ color: 'var(--text-secondary)' });
export const actions = style({ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' });
export const viewSelector = style({ display: 'flex', gap: '0.5rem' });

