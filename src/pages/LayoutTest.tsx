import React from 'react';

const LayoutTest: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '20px' }}>
      <h1>LAYOUT TEST</h1>
      <p>This should show if the layout is working</p>
      <p>Background should be RED if this component is rendering</p>
    </div>
  );
};

export default LayoutTest;