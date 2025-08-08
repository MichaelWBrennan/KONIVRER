import React from 'react';
import RulesViewer from '../components/RulesViewer';

const RulesPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        paddingBottom: '120px',
        background:
          'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      }}
    >


      {/* Rules Viewer Component */}
      <RulesViewer />
    </div>
  );
};

export default RulesPage;
