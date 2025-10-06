import { style, globalStyle } from '@vanilla-extract/css';

export const mobileContainer = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
});

export const mobileStatusBar = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: '#000',
  color: '#fff',
  fontSize: '0.8rem',
  fontWeight: '500',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
});

export const statusLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

export const statusRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

export const connectionStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const batteryStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const onlineStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
});

export const online = style({
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
  color: '#22c55e',
});

export const offline = style({
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  color: '#ef4444',
});

export const installBanner = style({
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '1rem',
  position: 'sticky',
  top: '2.5rem',
  zIndex: 999,
  animation: 'slideDown 0.3s ease-out',
});

export const installContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  maxWidth: '600px',
  margin: '0 auto',
});

export const installIcon = style({
  fontSize: '2rem',
  flexShrink: 0,
});

export const installText = style({
  flex: 1,
});

export const installButton = style({
  backgroundColor: 'white',
  color: '#3b82f6',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#f1f5f9',
  },
});

export const installClose = style({
  backgroundColor: 'transparent',
  color: 'white',
  border: 'none',
  padding: '0.25rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1.2rem',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const offlineBanner = style({
  backgroundColor: '#f59e0b',
  color: 'white',
  padding: '0.75rem 1rem',
  position: 'sticky',
  top: '2.5rem',
  zIndex: 999,
  animation: 'slideDown 0.3s ease-out',
});

export const offlineContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  maxWidth: '600px',
  margin: '0 auto',
});

export const offlineIcon = style({
  fontSize: '1.2rem',
});

export const offlineText = style({
  fontSize: '0.9rem',
  fontWeight: '500',
});

export const mainContent = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const gestureIndicators = style({
  position: 'fixed',
  bottom: '1rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 100,
  pointerEvents: 'none',
});

export const swipeIndicator = style({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '500',
  animation: 'pulse 2s infinite',
});

// Animations
globalStyle('@keyframes slideDown', {
  '0%': {
    transform: 'translateY(-100%)',
    opacity: '0',
  },
  '100%': {
    transform: 'translateY(0)',
    opacity: '1',
  },
});

globalStyle('@keyframes pulse', {
  '0%, 100%': {
    opacity: '0.7',
  },
  '50%': {
    opacity: '1',
  },
});

// Touch optimizations
globalStyle('*', {
  WebkitTapHighlightColor: 'transparent',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
});

globalStyle('input, textarea, [contenteditable]', {
  WebkitUserSelect: 'text',
  userSelect: 'text',
});

// Mobile-specific optimizations
globalStyle('@media (max-width: 768px)', {
  selectors: {
    'body': {
      fontSize: '16px', // Prevent zoom on iOS
      touchAction: 'manipulation',
    },
    'button, a': {
      minHeight: '44px', // Apple's minimum touch target
      minWidth: '44px',
    },
    'input, select, textarea': {
      fontSize: '16px', // Prevent zoom on iOS
    },
  },
});

// PWA specific styles
globalStyle('@media (display-mode: standalone)', {
  selectors: {
    [`${mobileStatusBar}`]: {
      display: 'none', // Hide custom status bar in standalone mode
    },
    [`${installBanner}`]: {
      top: '0', // Adjust position in standalone mode
    },
    [`${offlineBanner}`]: {
      top: '0', // Adjust position in standalone mode
    },
  },
});

// Dark mode support
globalStyle('@media (prefers-color-scheme: dark)', {
  selectors: {
    [`${mobileContainer}`]: {
      backgroundColor: '#1a1a1a',
    },
  },
});

// Reduced motion support
globalStyle('@media (prefers-reduced-motion: reduce)', {
  selectors: {
    [`${installBanner}, ${offlineBanner}`]: {
      animation: 'none',
    },
    [`${swipeIndicator}`]: {
      animation: 'none',
    },
  },
});