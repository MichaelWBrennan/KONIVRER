import React from 'react';
import { Outlet } from 'react-router-dom';
import { BaseComponentProps } from '../types';

interface LayoutProps extends BaseComponentProps {
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  showNavigation = true 
}) => {
  return (
    <div className={`min-h-screen bg-gray-900 text-white ${className}`}>
      {showNavigation && (
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">KONIVRER</h1>
              <div className="flex gap-4">
                <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
                <a href="/cards" className="hover:text-blue-400 transition-colors">Cards</a>
                <a href="/decks" className="hover:text-blue-400 transition-colors">Decks</a>
                <a href="/tournaments" className="hover:text-blue-400 transition-colors">Tournaments</a>
            </div>
        </nav>
      )}
      <main>
        {children || <Outlet />}
    </div>
  );
};

export default Layout;