import React from 'react';

const SkipToContent: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-to-content"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;