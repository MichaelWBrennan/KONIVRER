import React from 'react';
import SimpleMobileLayout from '../components/SimpleMobileLayout';

const MobileHomePage: React.FC = () => {
  return (
    <SimpleMobileLayout currentPage="home">
      {/* Completely empty content area - only bottom navigation */}
    </SimpleMobileLayout>
  );
};

export default MobileHomePage;