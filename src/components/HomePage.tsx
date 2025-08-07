import React from 'react';
import { motion } from 'framer-motion';
import '../styles/home-page.css';

interface HomePageProps {
  onNavigate: (view: 'cardSearch' | 'deckBuilder' | 'deckSearch' | 'game') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'cardSearch' as const,
      title: 'Browse Cards',
      description: 'Explore our mystical card collection',
      icon: '🗃️',
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    },
    {
      id: 'deckBuilder' as const,
      title: 'Build Decks',
      description: 'Create powerful deck combinations',
      icon: '🔨',
      gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    },
    {
      id: 'deckSearch' as const,
      title: 'Join Tournaments',
      description: 'Compete in epic tournaments',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #dc2626, #ea580c)',
    },
    {
      id: 'game' as const,
      title: 'Play Now',
      description: 'Battle against other mystics',
      icon: '▶️',
      gradient: 'linear-gradient(135deg, #d4af37, #f59e0b)',
    },
  ];

  return (
    <div className="home-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="home-header"
      >
        <h1 className="home-title">Welcome to KONIVRER</h1>
        <p className="home-subtitle">
          The ultimate mystical trading card game experience
        </p>
      </motion.div>

      <div className="home-bubbles">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            className="home-bubble"
            style={{
              background: feature.gradient,
            }}
            onClick={() => onNavigate(feature.id)}
          >
            <div className="bubble-content">
              <div className="bubble-icon">{feature.icon}</div>
              <h3 className="bubble-title">{feature.title}</h3>
              <p className="bubble-description">{feature.description}</p>
            </div>

            {/* Mystical glow effect */}
            <div className="bubble-glow" />
            
            {/* Interactive particles */}
            <div className="bubble-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`particle particle-${i + 1}`} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background mystical effects */}
      <div className="home-background-effects">
        <div className="mystical-orb orb-1" />
        <div className="mystical-orb orb-2" />
        <div className="mystical-orb orb-3" />
      </div>
    </div>
  );
};

export default HomePage;