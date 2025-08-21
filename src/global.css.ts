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
    '--primary-bg': '#0f0f0f',
    '--secondary-bg': '#1a1a2e',
    '--text-primary': '#ffffff',
    '--text-secondary': '#b0b0b0',
    '--accent-color': '#4a90e2',
    '--border-color': '#333',
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
  background: 'var(--secondary-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: 8,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
});
globalStyle('.card-item:hover', { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(74, 144, 226, 0.3)' });
globalStyle('.card-info', { padding: '1rem' });
globalStyle('.card-name', { fontSize: '1.1rem', fontWeight: 600 as any, marginBottom: '0.5rem', color: 'var(--text-primary)' });
globalStyle('.card-details', { fontSize: '0.9rem', color: 'var(--text-secondary)' });

globalStyle('.pagination-info', { color: 'var(--text-secondary)', textAlign: 'center', margin: '0.5rem 0' });
globalStyle('.pagination', { display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '2rem 0' });
globalStyle('.no-results', { textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' });

// Buttons
globalStyle('.btn', { border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', transition: 'all 0.2s ease' });
globalStyle('.btn-small', { padding: '0.4rem 0.6rem', fontSize: '0.85rem' });
globalStyle('.btn-primary', { background: 'var(--accent-color)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(74,144,226,0.3)' });
globalStyle('.btn-primary:hover', { background: '#3b7ddd', boxShadow: '0 4px 12px rgba(74,144,226,0.4)' });
globalStyle('.btn-secondary', { background: 'var(--secondary-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' });
globalStyle('.btn-danger', { background: '#ef4444', color: '#fff' });

// Feedback
globalStyle('.error-container .error', { color: '#c00' });
globalStyle('.loading', { color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' });

