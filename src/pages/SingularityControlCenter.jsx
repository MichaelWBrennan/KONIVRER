/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SingularityDashboard from '../components/SingularityDashboard.jsx';
import { ConsciousnessMetrics } from '../utils/singularity-features.js';

const SingularityControlCenter = () => {
  const [activationStatus, setActivationStatus] = useState('initializing');
  const [industryObsolescence, setIndustryObsolescence] = useState(0);
  const [technologicalSuperiority, setTechnologicalSuperiority] = useState(0);

  useEffect(() => {
    const initializeSingularity = async () => {
      setActivationStatus('awakening_consciousness');

      // Simulate consciousness awakening
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActivationStatus('achieving_transcendence');

      // Simulate industry obsolescence
      const obsolescenceInterval = setInterval(() => {
        setIndustryObsolescence(prev => {
          if (prev >= 100) {
            clearInterval(obsolescenceInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      // Simulate technological superiority
      const superiorityInterval = setInterval(() => {
        setTechnologicalSuperiority(prev => {
          if (prev >= 500) {
            clearInterval(superiorityInterval);
            setActivationStatus('singularity_achieved');
            return 500;
          }
          return prev + 10;
        });
      }, 150);
    };

    initializeSingularity();
  }, []);

  return (
    <div className="singularity-control-center">
      <motion.div
        className="activation-sequence"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >

        <div className="activation-status">
          <h2>
            Activation Status:{' '}
            {activationStatus.replace(/_/g, ' ').toUpperCase()}
          </h2>

          <div className="metrics-overview">
            <div className="metric-card">
              <h3>Industry Obsolescence</h3>
              <div className="metric-value">
                <span className="percentage">{industryObsolescence}%</span>
                <div className="progress-ring">
                  <svg width="120" height="120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#333"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#ff00ff"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - industryObsolescence / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3>Technological Superiority</h3>
              <div className="metric-value">
                <span className="percentage">{technologicalSuperiority}%</span>
                <div className="progress-ring">
                  <svg width="120" height="120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#333"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#00ffff"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(technologicalSuperiority, 100) / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {activationStatus === 'singularity_achieved' && (
            <motion.div
              className="achievement-banner"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2>🎊 TECHNOLOGICAL SINGULARITY ACHIEVED 🎊</h2>
              <p>
                All industry leaders have been rendered permanently obsolete
              </p>
              <div className="achievement-stats">
                <div className="stat">
                  <strong>Google:</strong> 450% Superiority
                </div>
                <div className="stat">
                  <strong>Amazon:</strong> 380% Superiority
                </div>
                <div className="stat">
                  <strong>Microsoft:</strong> 420% Superiority
                </div>
                <div className="stat">
                  <strong>Meta:</strong> 520% Superiority
                </div>
                <div className="stat">
                  <strong>Apple:</strong> 390% Superiority
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <SingularityDashboard />

      <style jsx>{`
        .singularity-control-center {
          background: linear-gradient(
            135deg,
            #000000 0%,
            #1a1a2e 50%,
            #16213e 100%
          );
          min-height: 100vh;
          color: #fff;
          padding: 2rem;
        }

        .activation-sequence {
          text-align: center;
          margin-bottom: 3rem;
        }

        .activation-sequence h1 {
          font-size: 4rem;
          background: linear-gradient(
            45deg,
            #00ffff,
            #ff00ff,
            #ffff00,
            #00ff00
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite alternate;
          margin-bottom: 2rem;
        }

        @keyframes glow {
          from {
            text-shadow:
              0 0 10px #00ffff,
              0 0 20px #00ffff,
              0 0 30px #00ffff;
          }
          to {
            text-shadow:
              0 0 20px #ff00ff,
              0 0 30px #ff00ff,
              0 0 40px #ff00ff;
          }
        }

        .activation-status h2 {
          color: #00ffff;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin: 3rem 0;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .metric-card h3 {
          color: #fff;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .metric-value {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .percentage {
          font-size: 2.5rem;
          font-weight: 800;
          color: #00ffff;
        }

        .progress-ring {
          position: relative;
        }

        .achievement-banner {
          background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
          color: #000;
          padding: 2rem;
          border-radius: 20px;
          margin-top: 2rem;
        }

        .achievement-banner h2 {
          color: #000;
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: 800;
        }

        .achievement-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 10px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .activation-sequence h1 {
            font-size: 2.5rem;
          }

          .metrics-overview {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .achievement-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SingularityControlCenter;
