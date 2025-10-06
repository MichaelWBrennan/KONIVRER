import { style, globalStyle } from '@vanilla-extract/css';

export const container = style({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
});

export const header = style({
  backgroundColor: 'white',
  padding: '2rem',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const title = style({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '0.5rem',
});

export const subtitle = style({
  fontSize: '1.2rem',
  color: '#666',
  margin: 0,
});

export const tabs = style({
  display: 'flex',
  justifyContent: 'center',
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

export const tabContent = style({
  minHeight: '600px',
});

export const insightsContent = style({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const insightsHeader = style({
  textAlign: 'center',
  marginBottom: '2rem',
});

export const insightsTitle = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '0.5rem',
});

export const insightsSubtitle = style({
  fontSize: '1.1rem',
  color: '#666',
  margin: 0,
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

export const errorMessage = style({
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
  textAlign: 'center',
});

export const overviewGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
  marginBottom: '3rem',
});

export const overviewCard = style({
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

export const overviewIcon = style({
  fontSize: '2rem',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '50%',
});

export const overviewContent = style({
  flex: 1,
});

export const overviewTitle = style({
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#666',
  margin: 0,
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const overviewValue = style({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#333',
  margin: 0,
});

export const trendingSection = style({
  marginBottom: '3rem',
});

export const sectionTitle = style({
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '1.5rem',
});

export const trendingGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
});

export const trendingCard = style({
  backgroundColor: 'white',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
  },
});

export const trendingHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
});

export const trendingIcon = style({
  fontSize: '1.2rem',
});

export const trendingName = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#333',
  flex: 1,
});

export const trendingDetails = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const trendingChange = style({
  fontSize: '1.1rem',
  fontWeight: '600',
});

export const trendingAmount = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const topMoversSection = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
});

export const topGainers = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const topLosers = style({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const subsectionTitle = style({
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '1rem',
  margin: 0,
});

export const moversList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const moverItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#e9ecef',
  },
});

export const moverRank = style({
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#666',
  minWidth: '30px',
});

export const moverName = style({
  fontSize: '0.9rem',
  color: '#333',
  flex: 1,
});

export const moverChange = style({
  fontSize: '0.9rem',
  fontWeight: '600',
});

// Responsive design
globalStyle('@media (max-width: 768px)', {
  selectors: {
    [`${container}`]: {
      minHeight: 'auto',
    },
    [`${header}`]: {
      padding: '1rem',
    },
    [`${title}`]: {
      fontSize: '2rem',
    },
    [`${tabs`]: {
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
    [`${insightsContent}`]: {
      padding: '1rem',
    },
    [`${overviewGrid}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${trendingGrid}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${topMoversSection}`]: {
      gridTemplateColumns: '1fr',
    },
  },
});