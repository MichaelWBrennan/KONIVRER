import React from 'react';
import SimpleMobileLayout from '../components/SimpleMobileLayout';

const MobileHomePage: React.FC = () => {
  return (
    <SimpleMobileLayout currentPage="home">
      {/* Empty home page - only the brown bottom navigation menu */}
    </SimpleMobileLayout>
  );
};

export default MobileHomePage;