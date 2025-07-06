import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './components/Layout';

import './App.css';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes as needed */}
      </Routes>
    </Layout>
  );
};

export default App;
