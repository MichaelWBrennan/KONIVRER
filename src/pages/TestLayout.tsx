import React from 'react';

const TestLayout: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>LAYOUT TEST</h1>
      <p>This should show if the layout is working</p>
      <p>Background should be RED if this component is rendering</p>
    </div>
  );
};

export default TestLayout;