import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHomePage from './pages/MobileHomePage';
import Home from './pages/Home';

import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHomePage />} />
      <Route path="/old-home" element={<Home />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
