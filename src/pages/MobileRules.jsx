/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

const MobileRules = () => {
  const [rulesData, setRulesData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const { user } = useAuth();

  useEffect(() => {
    // Load rules data
    const loadRulesData = async () => {
      try {
        const data = await import('../data/rules.json');
        
        // Check if data is valid
        if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
          console.error('Rules data is empty or invalid');
          setRulesData({
            overview: {
              title: 'Game Overview',
              icon: '📖',
              content: 'Rules data is currently unavailable. Please check back later.',
              keywords: ['overview'],
            },
          });
          return;
        }

        setRulesData(data.default || data);
      } catch (err) {
        console.error('Failed to load rules:', err);
        // Set fallback data
        setRulesData({
          overview: {
            title: 'Game Overview',
            icon: '📖',
            content: 'Rules data is currently unavailable. Please check back later.',
            keywords: ['overview'],
          },
        });
      }
    };

    loadRulesData();
  }, []);

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!rulesData) {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-loading">
          <div className="esoteric-loading-spinner"></div>
          <p>Loading rules...</p>
        </div>
      </div>
    );
  }

  const filteredSections = rulesData
    ? Object.entries(rulesData).filter(([key, section]) => {
        try {
          // Skip metadata fields
          if (key === 'lastUpdated' || key === 'version') return false;

          // If no search term, include all sections
          if (!searchTerm) return true;

          // Search in title and content for any word
          const searchLower = searchTerm.toLowerCase();
          return (
            (section.title && section.title.toLowerCase().includes(searchLower)) ||
            (section.content && section.content.toLowerCase().includes(searchLower))
          );
        } catch (error) {
          console.error(`Error filtering section ${key}:`, error);
          return false;
        }
      })
    : [];

  return (
    <div className="mobile-container esoteric-bg-dark">
      {/* Search */}
      <div className="mobile-p mobile-mb">
        <input
          type="text"
          placeholder="Search rules..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mobile-input esoteric-input"
        />
      </div>

      {/* Rules Sections */}
      <div className="mobile-mb">
        {filteredSections.map(([key, section]) => (
          <div key={key} className="mobile-card esoteric-card mobile-mb">
            {/* Section Header - Clickable */}
            <button
              onClick={() => toggleSection(key)}
              className="mobile-card-header esoteric-card-header"
            >
              <div className="mobile-flex mobile-align-center">
                <span className="esoteric-icon" aria-hidden="true">
                  {section.icon || '📖'}
                </span>
                <h2 className="mobile-card-title esoteric-rune">
                  {section.title || 'Rules Section'}
                </h2>
              </div>
              <div className="esoteric-expand-icon">
                {expandedSections.has(key) ? '▲' : '▼'}
              </div>
            </button>

            {/* Section Content - Collapsible */}
            <AnimatePresence>
              {expandedSections.has(key) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mobile-card-content esoteric-card-content"
                >
                  {section?.content ? (
                    <div className="mobile-text">
                      {section.content.split('\n\n').map((paragraph, index) => {
                        // Skip empty paragraphs
                        if (!paragraph.trim()) return null;
                        
                        // Handle headers (lines that start with #)
                        if (paragraph.startsWith('#')) {
                          const headerLevel = paragraph.match(/^#+/)[0].length;
                          const headerText = paragraph.replace(/^#+\s*/, '');
                          
                          return (
                            <div key={index} className="mobile-heading esoteric-heading">
                              {headerText}
                            </div>
                          );
                        }
                        
                        // Handle lists (lines that start with - or *)
                        if (paragraph.includes('\n-') || paragraph.includes('\n*') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
                          const listItems = paragraph.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
                          if (listItems.length > 0) {
                            return (
                              <ul key={index} className="mobile-list esoteric-list">
                                {listItems.map((item, itemIndex) => (
                                  <li key={itemIndex} className="mobile-list-item esoteric-list-item">
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/^[-*]\s*/, '').replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong class="esoteric-text-accent">$1</strong>'
                                      )
                                    }} />
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                        }
                        
                        // Handle numbered lists
                        if (paragraph.match(/^\d+\./)) {
                          const listItems = paragraph.split('\n').filter(line => line.trim().match(/^\d+\./));
                          if (listItems.length > 0) {
                            return (
                              <ol key={index} className="mobile-list mobile-list-numbered esoteric-list">
                                {listItems.map((item, itemIndex) => (
                                  <li key={itemIndex} className="mobile-list-item esoteric-list-item">
                                    <span dangerouslySetInnerHTML={{
                                      __html: item.replace(/^\d+\.\s*/, '').replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong class="esoteric-text-accent">$1</strong>'
                                      )
                                    }} />
                                  </li>
                                ))}
                              </ol>
                            );
                          }
                        }
                        
                        // Regular paragraphs
                        return (
                          <p key={index} className="mobile-p">
                            <span dangerouslySetInnerHTML={{
                              __html: paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="esoteric-text-accent">$1</strong>'
                              )
                            }} />
                          </p>
                        );
                      }).filter(Boolean)}
                    </div>
                  ) : (
                    <p className="mobile-p">Content for this section is not available.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Version Info */}
      <div className="mobile-text-center mobile-text-small mobile-mb esoteric-text-muted">
        {rulesData.version && (
          <p>Rules v{rulesData.version} • Last updated: {rulesData.lastUpdated}</p>
        )}
      </div>
    </div>
  );
};

export default MobileRules;