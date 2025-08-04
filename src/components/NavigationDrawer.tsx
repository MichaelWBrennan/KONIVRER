import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  navigationItems,
}) => {
  const location = useLocation();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1998,
              cursor: 'pointer',
            }}
            aria-label="Close navigation menu"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(15, 15, 15, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.7)',
              zIndex: 1999,
              paddingBottom: 'env(safe-area-inset-bottom, 20px)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Handle bar */}
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#d4af37',
                borderRadius: '2px',
                margin: '12px auto 20px',
              }}
            />

            {/* Navigation items */}
            <nav
              style={{
                padding: '0 20px 20px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '16px',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                {navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.to;
                  
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px 12px',
                        borderRadius: '12px',
                        backgroundColor: isActive 
                          ? 'rgba(212, 175, 55, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid',
                        borderColor: isActive 
                          ? 'rgba(212, 175, 55, 0.4)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        color: isActive ? '#d4af37' : '#ccc',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        minHeight: '80px',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#d4af37';
                          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#ccc';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        }
                        onClose();
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                        {item.label}
                      </span>
                    </motion.div>
                  );

                  if (item.to && item.to !== '#') {
                    return (
                      <Link 
                        key={item.label} 
                        to={item.to} 
                        style={{ textDecoration: 'none' }}
                        onClick={onClose}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div 
                      key={item.label}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (item.onClick) {
                            item.onClick();
                          }
                          onClose();
                        }
                      }}
                      aria-label={item.label}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationDrawer;