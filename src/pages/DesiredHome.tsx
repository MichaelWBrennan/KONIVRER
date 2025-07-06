import React from 'react';

const DesiredHome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#000000' }}>
      {/* Empty Home Page */}
      <div className="flex flex-col items-center w-full px-4 py-8">
        <h1 className="text-4xl font-light text-center mb-8 tracking-wide text-white">
          KONIVRER
        </h1>
      </div>
    </div>
  );
};

export default DesiredHome;