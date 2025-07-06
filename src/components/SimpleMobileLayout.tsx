/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Database,
  Trophy,
  Users,
  BarChart3,
} from 'lucide-react';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const SimpleMobileLayout: React.FC<SimpleMobileLayoutProps> = ({ children, currentPage = 'home' }) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      path: '/',
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: <Database className="w-5 h-5" />,
      path: '/cards',
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: <Trophy className="w-5 h-5" />,
      path: '/tournaments',
    },
    {
      id: 'social',
      label: 'Social',
      icon: <Users className="w-5 h-5" />,
      path: '/social',
    },
    {
      id: 'analytics',
      label: 'Stats',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analytics',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Main Content */}
      <main
        className="pb-20"
        style={{
          background: 'var(--bg-primary)',
          minHeight: 'calc(100vh - 80px)', /* Space for bottom nav */
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex justify-around py-2">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center p-2 rounded-lg transition-colors"
              style={{
                background:
                  currentPage === item.id
                    ? 'var(--gradient-primary)'
                    : 'transparent',
                color:
                  currentPage === item.id
                    ? 'var(--text-primary)'
                    : 'var(--text-tertiary)',
                border:
                  currentPage === item.id
                    ? '1px solid var(--accent-primary)'
                    : 'none',
                boxShadow:
                  currentPage === item.id ? 'var(--shadow-md)' : 'none',
                textShadow:
                  currentPage === item.id
                    ? '0 1px 2px rgba(0, 0, 0, 0.5)'
                    : 'none',
              }}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SimpleMobileLayout;