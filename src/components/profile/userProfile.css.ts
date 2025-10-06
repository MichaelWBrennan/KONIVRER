import { style, globalStyle } from '@vanilla-extract/css';

export const container = style({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
});

export const header = style({
  position: 'relative',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const banner = style({
  height: '200px',
  backgroundColor: '#e0e0e0',
  position: 'relative',
  overflow: 'hidden',
});

export const bannerImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const profileInfo = style({
  display: 'flex',
  alignItems: 'flex-end',
  padding: '2rem',
  gap: '2rem',
  position: 'relative',
});

export const avatarSection = style({
  position: 'relative',
  marginTop: '-60px',
});

export const avatar = style({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  border: '4px solid white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  objectFit: 'cover',
});

export const userInfo = style({
  flex: 1,
});

export const displayName = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#333',
  margin: 0,
  marginBottom: '0.5rem',
});

export const bio = style({
  fontSize: '1.1rem',
  color: '#666',
  margin: 0,
  marginBottom: '1rem',
  lineHeight: 1.5,
});

export const socialConnections = style({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
});

export const socialLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '20px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '0.9rem',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#e9ecef',
  },
});

export const verified = style({
  color: '#28a745',
  fontWeight: 'bold',
});

export const tabs = style({
  display: 'flex',
  backgroundColor: 'white',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
});

export const tab = style({
  padding: '1rem 2rem',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '3px solid transparent',
  fontSize: '1rem',
  fontWeight: '500',
  color: '#666',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
});

export const active = style({
  color: '#007bff',
  borderBottomColor: '#007bff',
  backgroundColor: '#f8f9fa',
});

export const content = style({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
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
  fontSize: '1.1rem',
});

export const overview = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
});

export const statCard = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  transition: 'transform 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
  },
});

export const statIcon = style({
  fontSize: '2rem',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '50%',
});

export const statContent = style({
  flex: 1,
});

export const statValue = style({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#333',
  margin: 0,
});

export const favoriteElement = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const elementDisplay = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem',
});

export const elementIcon = style({
  fontSize: '2rem',
});

export const elementName = style({
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#333',
});

export const achievements = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const achievementsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
});

export const achievementCard = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '2px solid transparent',
  display: 'flex',
  gap: '1rem',
  transition: 'transform 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
  },
});

export const achievementIcon = style({
  fontSize: '2rem',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '50%',
});

export const achievementInfo = style({
  flex: 1,
});

export const achievementName = style({
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#333',
  margin: 0,
  marginBottom: '0.5rem',
});

export const achievementDescription = style({
  fontSize: '0.9rem',
  color: '#666',
  margin: 0,
  marginBottom: '0.5rem',
  lineHeight: 1.4,
});

export const achievementMeta = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const achievementRarity = style({
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'uppercase',
});

export const achievementDate = style({
  fontSize: '0.8rem',
  color: '#666',
});

export const stats = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

export const statsSection = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const statsTable = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1rem',
});

export const statsRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
});

export const elementStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
});

export const elementStat = style({
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderRadius: '8px',
});

export const elementStatHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
});

export const elementStatIcon = style({
  fontSize: '1.5rem',
});

export const elementStatName = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#333',
});

export const elementStatDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  fontSize: '0.9rem',
  color: '#666',
});

export const history = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

export const historySection = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const gamesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1rem',
});

export const gameItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
});

export const gameResult = style({
  minWidth: '80px',
});

export const resultBadge = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'uppercase',
});

export const win = style({
  backgroundColor: '#d4edda',
  color: '#155724',
});

export const loss = style({
  backgroundColor: '#f8d7da',
  color: '#721c24',
});

export const draw = style({
  backgroundColor: '#fff3cd',
  color: '#856404',
});

export const gameDetails = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const gameOpponent = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#333',
});

export const gameDeck = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const gameDate = style({
  fontSize: '0.8rem',
  color: '#999',
});

export const gameDuration = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const decksList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
});

export const deckItem = style({
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderRadius: '8px',
});

export const deckName = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '0.5rem',
});

export const deckStats = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: '#666',
});

// Responsive design
globalStyle('@media (max-width: 768px)', {
  selectors: {
    [`${container}`]: {
      minHeight: 'auto',
    },
    [`${profileInfo}`]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    [`${avatarSection}`]: {
      marginTop: '-40px',
    },
    [`${avatar}`]: {
      width: '100px',
      height: '100px',
    },
    [`${displayName}`]: {
      fontSize: '2rem',
    },
    [`${tabs}`]: {
      flexDirection: 'column',
    },
    [`${tab}`]: {
      padding: '0.75rem 1rem',
      borderBottom: 'none',
      borderRight: '3px solid transparent',
    },
    [`${active}`]: {
      borderBottomColor: 'transparent',
      borderRightColor: '#007bff',
    },
    [`${content}`]: {
      padding: '1rem',
    },
    [`${statsGrid}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${achievementsGrid}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${elementStats}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${decksList}`]: {
      gridTemplateColumns: '1fr',
    },
  },
});