import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, href, onClick, isActive = false }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
        color: isActive ? '#d4af37' : '#ccc',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        minWidth: '60px',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.color = '#d4af37';
          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.color = '#ccc';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: '20px', marginBottom: '4px' }}>
        {icon}
      </div>
      <span style={{ fontSize: '12px', fontWeight: '500' }}>
        {label}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};

const BottomMenuBar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('home');

  const menuItems: MenuItemProps[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      label: 'Home',
      href: '/',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
        </svg>
      ),
      label: 'Cards',
      href: '/cards',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      label: 'Game',
      href: '/game',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M16 4l-4-4-4 4v2c0 4.42 3.58 8 8 8s8-3.58 8-8V4h-8zm0 10c-2.21 0-4-1.79-4-4V6h8v4c0 2.21-1.79 4-4 4z" />
        </svg>
      ),
      label: 'Deck',
      href: '/deck',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      label: 'Profile',
      href: '/profile',
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.3)',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
      aria-label="Bottom navigation menu"
      role="navigation"
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={item.label}
          {...item}
          isActive={activeItem === item.label.toLowerCase()}
          onClick={() => setActiveItem(item.label.toLowerCase())}
        />
      ))}
    </motion.nav>
  );
};

export default BottomMenuBar;