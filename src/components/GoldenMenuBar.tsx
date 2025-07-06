/**
 * Golden Menu Bar Component
 * 
 * A horizontal navigation bar with golden/bronze styling matching the provided design
 * Features: Home, Cards, Decks, Tournaments, Play, Login sections
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Database,
  Layers,
  Trophy,
  Play,
  LogIn,
  User
} from 'lucide-react';

interface GoldenMenuBarProps {
  className?: string;
  onLoginClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const GoldenMenuBar: React.FC<GoldenMenuBarProps> = ({
  className = '', 
  onLoginClick 
}) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/'
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: Database,
      path: '/cards'
    },
    {
      id: 'decks',
      label: 'Decks',
      icon: Layers,
      path: '/decks'
    },
    {
      id: 'tournaments',
      label: 'Tourna.',
      path: '/tournaments',
      icon: Trophy
    },
    {
      id: 'play',
      label: 'Play',
      icon: Play,
      path: '/play'
    }
  ];

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else if (onLoginClick) {
      onLoginClick();
    }
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuBarStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    borderBottom: '2px solid #3a3a3a',
    padding: 0,
    position: 'relative',
    overflow: 'hidden'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    position: 'relative',
    zIndex: 1
  };

  const itemsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 0
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 2rem',
    textDecoration: 'none',
    color: '#d4af37',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: '0 0.25rem'
  };

  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    color: '#f4d03f',
    background: 'rgba(212, 175, 55, 0.15)'
  };

  const iconStyle: React.CSSProperties = {
    marginBottom: '0.5rem',
    filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.3))'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    textShadow: '0 0 8px rgba(212, 175, 55, 0.3)'
  };

  return (
    <nav style={menuBarStyle} className={className}>
      <div style={containerStyle}>
        {/* Main navigation items */}
        <div style={itemsStyle}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                style={isActive ? activeItemStyle : itemStyle}
              >
                <div style={iconStyle}>
                  <IconComponent size={24} />
                </div>
                <span style={labelStyle}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Login/Profile section */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <div style={itemStyle} onClick={handleAuthAction}>
                <div style={iconStyle}>
                  <User size={24} />
                </div>
                <span style={labelStyle}>
                  {user?.displayName || 'Profile'}
                </span>
              </div>
            </div>
          ) : (
            <div 
              style={{
                ...itemStyle,
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }} 
              onClick={handleAuthAction}
            >
              <div style={iconStyle}>
                <LogIn size={24} />
              </div>
              <span style={labelStyle}>Login</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GoldenMenuBar;