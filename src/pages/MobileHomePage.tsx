import React from 'react';
import MobileLayout from '../components/MobileLayout';

const MobileHomePage: React.FC = () => {
  return (
    <MobileLayout currentPage="home">
      <div className="p-4">
        {/* Empty content area - just the mobile layout with navigation */}
      </div>
    </MobileLayout>
  );
};

export default MobileHomePage;