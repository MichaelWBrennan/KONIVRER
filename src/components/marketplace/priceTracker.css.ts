import { style, globalStyle } from '@vanilla-extract/css';

export const container = style({
  padding: '2rem',
  maxWidth: '1400px',
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

export const content = style({
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: '2rem',
  minHeight: '600px',
});

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const cardSelector = style({
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const sectionTitle = style({
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '1rem',
  margin: 0,
});

export const cardList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const cardItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid transparent',
  ':hover': {
    backgroundColor: '#e9ecef',
    transform: 'translateY(-1px)',
  },
});

export const selected = style({
  backgroundColor: '#e3f2fd',
  borderColor: '#2196f3',
});

export const cardImage = style({
  width: '40px',
  height: '56px',
  objectFit: 'cover',
  borderRadius: '4px',
  backgroundColor: '#f8f9fa',
});

export const cardName = style({
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#333',
  flex: 1,
});

export const controls = style({
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const timeRangeButtons = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
});

export const timeRangeButton = style({
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#f8f9fa',
  },
});

export const active = style({
  backgroundColor: '#007bff',
  color: 'white',
  borderColor: '#007bff',
});

export const mainContent = style({
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e0e0e0',
});

export const selectedCardImage = style({
  width: '80px',
  height: '112px',
  objectFit: 'cover',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const cardInfo = style({
  flex: 1,
});

export const selectedCardName = style({
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#333',
  margin: 0,
  marginBottom: '0.25rem',
});

export const selectedCardSubtitle = style({
  fontSize: '1rem',
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
});

export const trendsSection = style({
  marginBottom: '2rem',
});

export const trendsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1rem',
});

export const trendItem = style({
  backgroundColor: 'white',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const trendHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem',
});

export const trendIcon = style({
  fontSize: '1.2rem',
});

export const trendMarketplace = style({
  fontSize: '0.9rem',
  color: '#666',
  fontWeight: '500',
});

export const trendDetails = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

export const trendChange = style({
  fontSize: '1.1rem',
  fontWeight: '600',
});

export const trendAmount = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const trendPeriod = style({
  fontSize: '0.8rem',
  color: '#999',
});

export const historySection = style({
  marginBottom: '2rem',
});

export const historyTable = style({
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const historyHeader = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  fontWeight: '600',
  color: '#333',
  borderBottom: '1px solid #e0e0e0',
});

export const historyRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  gap: '1rem',
  padding: '1rem',
  borderBottom: '1px solid #f0f0f0',
  ':hover': {
    backgroundColor: '#f8f9fa',
  },
  ':last-child': {
    borderBottom: 'none',
  },
});

export const historyDate = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const historyMarketplace = style({
  fontSize: '0.9rem',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const historyPrice = style({
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#28a745',
});

export const historyCondition = style({
  fontSize: '0.9rem',
  color: '#666',
  textTransform: 'capitalize',
});

export const historyFoil = style({
  fontSize: '0.9rem',
  color: '#666',
});

export const noData = style({
  textAlign: 'center',
  padding: '3rem',
  color: '#666',
  fontSize: '1.1rem',
});

export const noSelection = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '400px',
  color: '#666',
  fontSize: '1.1rem',
});

// Responsive design
globalStyle('@media (max-width: 1024px)', {
  selectors: {
    [`${content}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${sidebar}`]: {
      order: 2,
    },
    [`${mainContent}`]: {
      order: 1,
    },
  },
});

globalStyle('@media (max-width: 768px)', {
  selectors: {
    [`${container}`]: {
      padding: '1rem',
    },
    [`${historyHeader}`]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      fontSize: '0.8rem',
    },
    [`${historyRow}`]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      fontSize: '0.8rem',
    },
    [`${trendsGrid}`]: {
      gridTemplateColumns: '1fr',
    },
  },
});