import { globalStyle, globalFontFace } from '@vanilla-extract/css';

globalFontFace('OpenDyslexic', {
  src: 'url(/fonts/OpenDyslexic-Regular.woff2) format("woff2"), url(/fonts/opendyslexic/OpenDyslexic-Regular.otf) format("opentype")',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('OpenDyslexic', {
  src: 'url(/fonts/OpenDyslexic-Bold.woff2) format("woff2"), url(/fonts/opendyslexic/OpenDyslexic-Bold.otf) format("opentype")',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalFontFace('OpenDyslexic', {
  src: 'url(/fonts/opendyslexic/OpenDyslexic-Italic.otf) format("opentype")',
  fontWeight: 'normal',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalFontFace('OpenDyslexic', {
  src: 'url(/fonts/opendyslexic/OpenDyslexic-BoldItalic.otf) format("opentype")',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontDisplay: 'swap',
});

globalStyle(':root', {
  vars: {
    '--vh': '1vh',
    '--primary-bg': '#0b0c10',
    '--secondary-bg': '#12141d',
    '--text-primary': '#ffffff',
    '--text-secondary': '#b0b0b0',
    '--accent-color': '#4a90e2',
    '--border-color': '#2a2d34',
  } as any,
});

// Light theme variables
globalStyle('[data-theme="light"]', {
  vars: {
    '--primary-bg': '#f7f7fb',
    '--secondary-bg': '#ffffff',
    '--text-primary': '#111827',
    '--text-secondary': '#4b5563',
    '--accent-color': '#2563eb',
    '--border-color': '#e5e7eb',
  } as any,
});

globalStyle('*', { margin: 0, padding: 0, boxSizing: 'border-box', WebkitTapHighlightColor: 'transparent' });

globalStyle('html', { height: '100%', overflow: 'hidden' });

globalStyle('html, body, input, textarea, button', { WebkitTextSizeAdjust: '100%' });

globalStyle('body', {
  fontFamily: 'OpenDyslexic, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  background: 'var(--primary-bg)',
  color: 'var(--text-primary)',
  lineHeight: '1.6',
  height: '100%',
  overflow: 'auto',
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overscrollBehavior: 'none',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('#root', {
  minHeight: '100vh',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingLeft: 'env(safe-area-inset-left, 0px)',
  paddingRight: 'env(safe-area-inset-right, 0px)',
});

globalStyle('::-webkit-scrollbar', { display: 'none' });

globalStyle('html', { scrollbarWidth: 'none' });

globalStyle('*:focus-visible', { outline: '2px solid var(--accent-color)', outlineOffset: 2, borderRadius: 4 });

// Common UI utilities migrated from legacy global CSS
globalStyle('.search-container', {
  padding: '2rem',
  background: 'var(--secondary-bg)',
  borderBottom: '1px solid var(--border-color)'
});

globalStyle('.search-input', {
  width: '100%',
  maxWidth: '600px',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: '1px solid var(--border-color)',
  borderRadius: 6,
  background: 'var(--primary-bg)',
  color: 'var(--text-primary)',
  margin: '0 auto',
  display: 'block'
});

globalStyle('.search-input:focus', {
  outline: 'none',
  borderColor: 'var(--accent-color)',
  boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)'
});

globalStyle('.filters', { display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' });

globalStyle('.filter-select', {
  padding: '0.5rem',
  border: '1px solid var(--border-color)',
  borderRadius: 4,
  background: 'var(--primary-bg)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem'
});

globalStyle('.results-count', { color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' });

globalStyle('.card-grid', { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1rem' });

globalStyle('.cards-grid', { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1rem' });

globalStyle('.card-item', {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
});

globalStyle('.card-item:hover', { transform: 'translateY(-4px)', boxShadow: '0 10px 26px rgba(0, 0, 0, 0.45)' });

globalStyle('.card-info', { padding: '1rem' });

globalStyle('.card-name', { fontSize: '1.1rem', fontWeight: 600 as any, marginBottom: '0.5rem', color: 'var(--text-primary)' });

globalStyle('.card-details', { fontSize: '0.9rem', color: 'var(--text-secondary)' });

globalStyle('.pagination-info', { color: 'var(--text-secondary)', textAlign: 'center', margin: '0.5rem 0' });

globalStyle('.pagination', { display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '2rem 0' });

globalStyle('.no-results', { textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' });

// Layout
globalStyle('.container', { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' });

globalStyle('.section', { marginTop: '1.5rem' });

// Analytics/Dashboard structure
globalStyle('.analytics-header', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' });

globalStyle('.view-tabs', { display: 'flex', gap: '0.5rem' });

globalStyle('.dashboard-metrics', { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem', marginTop: '1rem' });

globalStyle('.metric-card', { background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' });

globalStyle('.metric-card h4', { marginBottom: '0.5rem' });

globalStyle('.metric-value', { fontSize: '1.25rem', fontWeight: 700 as any });

globalStyle('.metric-change', { marginTop: '0.25rem', fontSize: '0.9rem' });

globalStyle('.metric-change.positive', { color: '#10b981' });

globalStyle('.metric-change.neutral', { color: 'var(--text-secondary)' });

globalStyle('.metric-change.warning', { color: '#f59e0b' });

globalStyle('.dashboard-charts', { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginTop: '1rem' });

globalStyle('.chart-section h4', { marginBottom: '0.5rem' });

// Realtime section
globalStyle('.realtime-stats', { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem' });

globalStyle('.realtime-stat', { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.75rem' });

globalStyle('.stat-label', { color: 'var(--text-secondary)', fontSize: '0.85rem' });

globalStyle('.stat-value', { fontSize: '1.1rem', fontWeight: 700 as any });

globalStyle('.stat-indicator', { marginLeft: '0.5rem' });

globalStyle('.stat-indicator.positive', { color: '#10b981' });

globalStyle('.stat-indicator.warning', { color: '#f59e0b' });

globalStyle('.realtime-chart h4', { marginBottom: '0.5rem' });

globalStyle('.system-alerts', { marginTop: '1rem' });

// Anomalies center
globalStyle('.anomalies-view .anomaly-header', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' });

globalStyle('.anomalies-list', { display: 'grid', gap: '0.75rem', marginTop: '0.5rem' });

globalStyle('.anomaly-item', { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem' });

globalStyle('.anomaly-item .anomaly-header', { display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' });

globalStyle('.severity', { padding: '2px 6px', borderRadius: 6, fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' });

globalStyle('.severity.critical', { borderColor: 'rgba(239,68,68,0.35)', color: '#ef4444' });

globalStyle('.severity.medium', { borderColor: 'rgba(245,158,11,0.35)', color: '#f59e0b' });

globalStyle('.anomaly-description', { color: 'var(--text-secondary)', marginBottom: '0.5rem' });

globalStyle('.anomaly-details', { display: 'flex', gap: '1rem', color: 'var(--text-secondary)' });

globalStyle('.anomaly-actions', { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' });

// Buttons
globalStyle('.btn', { border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.5rem 1rem', cursor: 'pointer', transition: 'all 0.2s ease', background: 'rgba(255,255,255,0.02)' });

globalStyle('.btn-small', { padding: '0.4rem 0.6rem', fontSize: '0.85rem' });

globalStyle('.btn-primary', { background: 'var(--accent-color)', color: 'var(--text-primary)', boxShadow: '0 8px 20px rgba(74,144,226,0.35)' });

globalStyle('.btn-primary:hover', { background: '#3b7ddd', boxShadow: '0 10px 24px rgba(74,144,226,0.45)' });

globalStyle('.btn-secondary', { background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)' });

globalStyle('.btn-danger', { background: '#ef4444', color: '#fff' });

// Feedback
globalStyle('.error-container .error', { color: '#c00' });

globalStyle('.alert-item', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' });

globalStyle('.alert-item.success', { borderColor: 'rgba(16,185,129,0.35)' });

globalStyle('.alert-item.warning', { borderColor: 'rgba(234,179,8,0.35)' });

globalStyle('.alert-time', { color: 'var(--text-secondary)', fontSize: '0.85rem' });

globalStyle('.loading', { color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' });

// Mobile-first utilities formerly from mobile-first.css (subset used)
globalStyle('.btn-touch', {
  minHeight: 44,
  minWidth: 44,
  padding: '0.75rem 1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: '0.5rem',
  fontWeight: 500 as any,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  border: 'none',
  textDecoration: 'none',
  userSelect: 'none',
});

globalStyle('.btn-touch:active', { transform: 'scale(0.95)' });

// Simple utility classes
globalStyle('.flex', { display: 'flex' });

globalStyle('.items-center', { alignItems: 'center' });

globalStyle('.justify-center', { justifyContent: 'center' });

globalStyle('.mr-2', { marginRight: '0.5rem' });

globalStyle('.mb-3', { marginBottom: '0.75rem' });

globalStyle('.mb-4', { marginBottom: '1rem' });

globalStyle('.text-lg', { fontSize: '1.125rem', lineHeight: '1.75rem' });

globalStyle('.text-sm', { fontSize: '0.875rem', lineHeight: '1.25rem' });

globalStyle('.font-semibold', { fontWeight: 600 as any });

globalStyle('.text-secondary', { color: 'var(--text-secondary)' });

// Safe-area and accessibility polish
globalStyle('main', { paddingBottom: '72px' });
// Reduced motion media rule attached to * selector
globalStyle('*', { '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none !important', transition: 'none !important', scrollBehavior: 'auto !important' } } as any } as any);
// Larger tap area for buttons
globalStyle('.btn', { minHeight: 44, lineHeight: '1.2' });
// High contrast mode tweaks
globalStyle('[data-contrast="high"]', { vars: { '--border-color': '#888' } as any });
globalStyle('[data-contrast="high"] .btn', { boxShadow: '0 0 0 2px var(--border-color) inset' });
globalStyle('[data-contrast="high"] .card-item', { boxShadow: 'none', border: '2px solid var(--border-color)' });
// Font size scaling
globalStyle('[data-font-size="small"]', { fontSize: '14px' });
globalStyle('[data-font-size="medium"]', { fontSize: '16px' });
globalStyle('[data-font-size="large"]', { fontSize: '18px' });
globalStyle('[data-font-size="extra-large"]', { fontSize: '20px' });