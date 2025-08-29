import React, { useState, useMemo } from 'react';
import { 
  getAllRulesAsJSON,
  searchWithSynonyms,
  keywordAbilities,
  phaseDescriptions 
} from '../services/rulesParser';

interface JudgePortalProps {
  className?: string;
}

export const JudgePortal: React.FC<JudgePortalProps> : any = ({ className }) => {
  const [searchQuery, setSearchQuery]: any : any = useState('');
  const [selectedSection, setSelectedSection]: any : any = useState<string>('');
  const [activeTab, setActiveTab]: any : any = useState<'search' | 'sections' | 'keywords' | 'phases'>('search');
  
  // Search results
  const searchResults: any : any = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchWithSynonyms(searchQuery.trim());
  }, [searchQuery]);
  
  // Get all rules for section browsing
  const allRules: any : any = useMemo(() => getAllRulesAsJSON(), []);
  
  // Render search results
  const renderSearchResults: any : any = () => {
    if (!searchQuery.trim()) {
      return (
        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          <p>Enter a search term to find relevant rules.</p>
          <p>Try searching for: "deck construction", "combat", "azoth", "life cards"</p>
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          <p>No rules found for "{searchQuery}"</p>
          <p>Try a different search term or browse by section.</p>
        </div>
      );
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {searchResults.map((rule, index) => (
          <div
            key={`${rule.section}-${index}`}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
              Section {rule.section}: {rule.title}
            </h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {rule.content}
            </div>
            {rule.keywords.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#666' }}>
                <strong>Keywords:</strong> {rule.keywords.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Render rule sections
  const renderSections: any : any = () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {allRules.rules.map(rule => (
        <div
          key={rule.section}
          style={{
            padding: '1rem',
            border: selectedSection === rule.section ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: selectedSection === rule.section ? '#f0f8ff' : '#f9f9f9',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedSection(selectedSection === rule.section ? '' : rule.section)}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
            Section {rule.section}: {rule.title}
          </h3>
          {selectedSection === rule.section ? (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginTop: '1rem' }}>
              {rule.content}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#666' }}>
              {rule.content.substring(0, 100)}...
            </p>
          )}
        </div>
      ))}
    </div>
  );
  
  // Render keywords
  const renderKeywords: any : any = () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      {Object.entries(keywordAbilities).map(([keyword, definition]) => (
        <div
          key={keyword}
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', textTransform: 'capitalize' }}>
            {keyword}
          </h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            {definition}
          </p>
        </div>
      ))}
    </div>
  );
  
  // Render phases
  const renderPhases: any : any = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Object.entries(phaseDescriptions).map(([phase, description]) => (
        <div
          key={phase}
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', textTransform: 'capitalize' }}>
            {phase.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            {description}
          </p>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={className} style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>KONIVRER Judge Portal</h1>
        <p style={{ color: '#666' }}>
          Official rules reference and search system for KONIVRER Azoth TCG
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #ddd', 
        marginBottom: '1rem',
        gap: '1px'
      }}>
        {[
          { key: 'search', label: 'Rule Search' },
          { key: 'sections', label: 'Browse Sections' },
          { key: 'keywords', label: 'Keyword Glossary' },
          { key: 'phases', label: 'Phase Tracker' }
        ].map(tab => (
          <button
            key={tab.key}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #007bff' : '3px solid transparent',
              backgroundColor: activeTab === tab.key ? '#f0f8ff' : 'transparent',
              color: activeTab === tab.key ? '#007bff' : '#666',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Search Tab */}
      {activeTab === 'search' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search KONIVRER rules (e.g., 'deck construction', 'combat phase', 'azoth')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          {renderSearchResults()}
        </div>
      )}
      
      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Click on any section to view the complete rule text.
          </p>
          {renderSections()}
        </div>
      )}
      
      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Complete glossary of KONIVRER keyword abilities.
          </p>
          {renderKeywords()}
        </div>
      )}
      
      {/* Phases Tab */}
      {activeTab === 'phases' && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Detailed descriptions of each game phase in turn order.
          </p>
          {renderPhases()}
        </div>
      )}
      
      {/* Footer */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '1rem', 
        borderTop: '1px solid #ddd', 
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>
          KONIVRER Judge Portal • Official Rules Reference • 
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: '0.5rem'
            }}
            onClick={() => {
              const json: any : any = JSON.stringify(getAllRulesAsJSON(), null, 2);
              const blob: any : any = new Blob([json], { type: 'application/json' });
              const url: any : any = URL.createObjectURL(blob);
              const a: any : any = document.createElement('a');
              a.href = url;
              a.download = 'konivrer-rules.json';
              a.click();
            }}
          >
            Export Rules as JSON
          </button>
        </p>
      </div>
    </div>
  );
};

export default JudgePortal;