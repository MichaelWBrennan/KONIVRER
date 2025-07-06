import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './components/Layout';
import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
