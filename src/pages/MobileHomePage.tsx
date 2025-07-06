import React from 'react';
import MobileLayout from '../components/MobileLayout';

const MobileHomePage: React.FC = () => {
  return (
    <MobileLayout currentPage="home">
      <div className="flex flex-col items-center justify-center p-4 h-full">
        <h1 className="text-4xl font-light text-center mb-8 tracking-wide" style={{ color: 'var(--text-primary, #ffffff)' }}>
          KONIVRER
        </h1>
      </div>
    </MobileLayout>
  );
};

export default MobileHomePage;