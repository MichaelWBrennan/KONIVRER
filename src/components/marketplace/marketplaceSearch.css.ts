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

export const searchSection = style({
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '2rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const searchBar = style({
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.5rem',
});

export const searchInput = style({
  flex: 1,
  padding: '0.75rem 1rem',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  ':focus': {
    borderColor: '#007bff',
  },
});

export const searchButton = style({
  padding: '0.75rem 2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#0056b3',
  },
  ':disabled': {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
});

export const filters = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
});

export const filterGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const filterLabel = style({
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#333',
});

export const priceRange = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export const priceInput = style({
  flex: 1,
  padding: '0.5rem',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  fontSize: '0.9rem',
  outline: 'none',
  ':focus': {
    borderColor: '#007bff',
  },
});

export const priceSeparator = style({
  color: '#666',
  fontWeight: '500',
});

export const filterSelect = style({
  padding: '0.5rem',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  fontSize: '0.9rem',
  outline: 'none',
  backgroundColor: 'white',
  cursor: 'pointer',
  ':focus': {
    borderColor: '#007bff',
  },
});

export const errorMessage = style({
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
});

export const results = style({
  minHeight: '200px',
});

export const resultsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
});

export const cardItem = style({
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '1rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
});

export const cardImage = style({
  width: '100%',
  height: '200px',
  marginBottom: '1rem',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
});

export const cardImageImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const cardInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const cardName = style({
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#333',
  margin: 0,
  lineHeight: 1.3,
});

export const cardPrice = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

export const priceValue = style({
  fontSize: '1.3rem',
  fontWeight: 'bold',
  color: '#28a745',
});

export const marketplace = style({
  fontSize: '0.9rem',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const cardDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const availability = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '#666',
});

export const availabilityDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
});

export const priceRanges = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const priceRangeItem = style({
  fontSize: '0.8rem',
  color: '#666',
});

export const noResults = style({
  textAlign: 'center',
  padding: '3rem',
  color: '#666',
  fontSize: '1.1rem',
});

// Responsive design
globalStyle('@media (max-width: 768px)', {
  selectors: {
    [`${container}`]: {
      padding: '1rem',
    },
    [`${searchBar}`]: {
      flexDirection: 'column',
    },
    [`${filters}`]: {
      gridTemplateColumns: '1fr',
    },
    [`${resultsGrid}`]: {
      gridTemplateColumns: '1fr',
    },
  },
});