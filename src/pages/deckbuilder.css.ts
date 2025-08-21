import { style } from '@vanilla-extract/css';

export const container = style({ padding: '2rem', maxWidth: 1400, margin: '0 auto' });
export const header = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' });
export const actions = style({ display: 'flex', gap: '0.5rem' });
export const content = style({ display: 'grid', gridTemplateColumns: '360px 1fr 360px', gap: '1rem', alignItems: 'start' });

export const listPanel = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const panelHeader = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' });
export const deckGrid = style({ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' });
export const deckCard = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.75rem', cursor: 'pointer' });
export const deckCardSelected = style({ outline: '2px solid var(--accent-color)' });
export const deckHeader = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' });
export const deckColors = style({ display: 'flex', gap: 4 });
export const colorIndicator = style({ width: 10, height: 10, borderRadius: '50%', border: '1px solid #444' });
export const deckInfo = style({ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' });
export const deckDate = style({ color: 'var(--text-secondary)', fontSize: '0.85rem' });

export const editorPanel = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const editor = style({ display: 'flex', flexDirection: 'column', gap: '1rem' });
export const editorHeader = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' });
export const deckNameInput = style({ flex: 1, padding: '0.5rem 0.75rem', background: 'var(--primary-bg)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)' });
export const deckStats = style({ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' });
export const categories = style({ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' });
export const category = style({});
export const cardSlots = style({ background: 'var(--primary-bg)', border: '1px dashed var(--border-color)', borderRadius: 8, padding: '1rem', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' });

export const analysis = style({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' });
export const analysisCard = style({ background: 'var(--primary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const statItem = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', padding: '0.35rem 0' });

export const noDeck = style({ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' });

export const searchPanel = style({ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1rem' });
export const cardResults = style({ padding: '1rem', background: 'var(--primary-bg)', borderRadius: 6, border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', textAlign: 'center' });

