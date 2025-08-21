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

