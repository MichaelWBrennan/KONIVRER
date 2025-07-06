import React from 'react';
import MobileLayout from '../components/MobileLayout';

const MobileHomePage: React.FC = () => {
  return (
    <MobileLayout currentPage="home">
      {/* Completely empty content area - only bottom navigation */}
    </MobileLayout>
  );
};

export default MobileHomePage;