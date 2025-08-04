import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface PopoverMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  anchorRef: React.RefObject<HTMLElement>;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  anchorRef,
}) => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Calculate menu position relative to anchor
  const getMenuPosition = () => {
    if (!anchorRef.current) {
      return { bottom: '80px', right: '20px' };
    }

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const menuHeight = 280; // Estimated menu height
    const menuWidth = 180;
    
    // Position above the button with some spacing
    const bottom = window.innerHeight - anchorRect.top + 10;
    const right = window.innerWidth - anchorRect.right;

    return {
      bottom: `${bottom}px`,
      right: `${right}px`,
    };
  };

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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1998,
              cursor: 'pointer',
            }}
            aria-label="Close navigation menu"
          />

          {/* Popover Menu */}
          <motion.div
            ref={menuRef}
            initial={{ 
              opacity: 0, 
              scale: 0.3,
              transformOrigin: 'bottom right',
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transformOrigin: 'bottom right',
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.3,
              transformOrigin: 'bottom right',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            style={{
              position: 'fixed',
              ...getMenuPosition(),
              backgroundColor: 'rgba(15, 15, 15, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              zIndex: 1999,
              minWidth: '180px',
              maxWidth: '220px',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Navigation items */}
            <nav
              style={{
                padding: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.to;
                  
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: isActive 
                          ? 'rgba(212, 175, 55, 0.2)' 
                          : 'transparent',
                        border: '1px solid',
                        borderColor: isActive 
                          ? 'rgba(212, 175, 55, 0.4)' 
                          : 'transparent',
                        color: isActive ? '#d4af37' : '#ccc',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        gap: '12px',
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
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        }
                        onClose();
                      }}
                    >
                      <div style={{ fontSize: '18px', minWidth: '18px' }}>
                        {item.icon}
                      </div>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                      }}>
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

export default PopoverMenu;