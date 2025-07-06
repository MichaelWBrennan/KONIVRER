import React from 'react';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  variant?: 'standard' | 'golden' | 'mobile';
  currentPage?: string;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ 
  children, 
  variant = 'standard', 
  currentPage = '' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'golden':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#f59e0b'
        };
      case 'mobile':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        };
      default:
        return {
          backgroundColor: '#ffffff',
          color: '#1f2937',
          borderColor: '#e5e7eb'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: styles.backgroundColor,
      color: styles.color 
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${styles.borderColor}`,
        padding: '1rem 0',
        backgroundColor: variant === 'golden' ? '#fbbf24' : '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: variant === 'golden' ? '#92400e' : '#1f2937'
          }}>
            KONIVRER {currentPage && `- ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}`}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${styles.borderColor}`,
        padding: '2rem 0',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            © 2024 KONIVRER. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLayout;