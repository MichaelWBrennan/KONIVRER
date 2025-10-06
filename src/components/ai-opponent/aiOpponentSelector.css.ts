import { style, globalStyle } from '@vanilla-extract/css';

export const container = style({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const header = style({
  textAlign: 'center',
  marginBottom: '2rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '0.5rem',
});

export const subtitle = style({
  fontSize: '1.1rem',
  color: '#666',
  margin: 0,
});

export const filters = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem',
});

export const filterButton = style({
  padding: '0.75rem 1.5rem',
  backgroundColor: 'white',
  border: '2px solid #e0e0e0',
  borderRadius: '25px',
  fontSize: '1rem',
  fontWeight: '500',
  color: '#666',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#007bff',
  },
});

export const active = style({
  backgroundColor: '#007bff',
  borderColor: '#007bff',
  color: 'white',
});

export const opponentsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem',
});

export const opponentCard = style({
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid transparent',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
});

export const selected = style({
  borderColor: '#007bff',
  backgroundColor: '#f8f9fa',
});

export const locked = style({
  opacity: 0.6,
  cursor: 'not-allowed',
  ':hover': {
    transform: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
});

export const opponentHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  position: 'relative',
});

export const opponentAvatar = style({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
});

export const defaultAvatar = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const opponentInfo = style({
  flex: 1,
});

export const opponentName = style({
  fontSize: '1.3rem',
  fontWeight: 'bold',
  color: '#333',
  margin: 0,
  marginBottom: '0.25rem',
});

export const difficulty = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export const difficultyIcon = style({
  fontSize: '1.2rem',
});

export const difficultyText = style({
  fontSize: '0.9rem',
  fontWeight: '600',
});

export const lockedIcon = style({
  position: 'absolute',
  top: '-0.5rem',
  right: '-0.5rem',
  fontSize: '1.5rem',
  color: '#dc3545',
});

export const opponentDescription = style({
  marginBottom: '1rem',
});

export const opponentDetails = style({
  marginBottom: '1rem',
});

export const elements = style({
  marginBottom: '1rem',
});

export const elementList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

export const elementTag = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.25rem 0.75rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '15px',
  fontSize: '0.8rem',
  color: '#666',
});

export const strategies = style({
  marginBottom: '1rem',
});

export const strategyList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

export const strategyTag = style({
  padding: '0.25rem 0.75rem',
  backgroundColor: '#e3f2fd',
  borderRadius: '15px',
  fontSize: '0.8rem',
  color: '#1976d2',
  textTransform: 'capitalize',
});

export const opponentStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '1rem',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
});

export const statItem = style({
  textAlign: 'center',
});

export const statLabel = style({
  display: 'block',
  fontSize: '0.8rem',
  color: '#666',
  marginBottom: '0.25rem',
});

export const statValue = style({
  display: 'block',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#333',
});

export const unlockRequirements = style({
  padding: '1rem',
  backgroundColor: '#fff3cd',
  borderRadius: '8px',
  border: '1px solid #ffeaa7',
  marginBottom: '1rem',
});

export const personality = style({
  marginBottom: '1rem',
});

export const personalityBars = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '0.5rem',
});

export const personalityBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
});

export const bar = style({
  flex: 1,
  height: '8px',
  backgroundColor: '#e0e0e0',
  borderRadius: '4px',
  overflow: 'hidden',
});

export const barFill = style({
  height: '100%',
  backgroundColor: '#007bff',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
});

export const actionPanel = style({
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  zIndex: 1000,
});

export const selectedOpponent = style({
  flex: 1,
});

export const startGameButton = style({
  padding: '1rem 2rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#218838',
  },
});

export const loading = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
  color: '#666',
});

export const spinner = style({
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #007bff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '1rem',
});

globalStyle('@keyframes spin', {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const error = style({
  textAlign: 'center',
  padding: '3rem',
  color: '#dc3545',
});

export const retryButton = style({
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem',
  ':hover': {
    backgroundColor: '#0056b3',
  },
});

// Responsive design
globalStyle('@media (max-width: 768px)', {
  selectors: {
    [`${container}`]: {
      padding: '1rem',
    },
    [`${opponentsGrid}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${opponentStats}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${actionPanel}`]: {
      position: 'relative',
      bottom: 'auto',
      left: 'auto',
      transform: 'none',
      flexDirection: 'column',
      gap: '1rem',
    },
  },
});