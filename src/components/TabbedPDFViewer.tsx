import React, { useState, useRef, useEffect } from 'react';
import './TabbedPDFViewer.css';

interface PDFRule {
  id: string;
  title: string;
  filename: string;
  description: string;
}

interface TabbedPDFViewerProps {
  onBack?: () => void;
}

const TabbedPDFViewer: React.FC<TabbedPDFViewerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('basic-rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pdfRules: PDFRule[] = [
    {
      id: 'basic-rules',
      title: 'Basic Rules',
      filename: 'konivrer-rules.pdf',
      description: 'Learn the fundamental rules of KONIVRER',
    },
    {
      id: 'tournament-rules',
      title: 'Tournament Rules',
      filename: 'konivrer-tournament-rules.pdf',
      description: 'Official tournament and competitive play rules',
    },
    {
      id: 'code-of-conduct',
      title: 'Code of Conduct',
      filename: 'konivrer-code-of-conduct.pdf',
      description: 'Community guidelines and code of conduct',
    },
  ];

  const currentRule = pdfRules.find(rule => rule.id === activeTab);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Get the active iframe and send search command to PDF.js
    const iframe = document.getElementById(`pdf-iframe-${activeTab}`) as HTMLIFrameElement;
    if (iframe) {
      try {
        // Send search command to PDF.js viewer
        iframe.contentWindow?.postMessage({
          type: 'search',
          query: searchTerm,
          highlightAll: true,
          findPrevious: false
        }, '*');
      } catch (error) {
        console.log('Search functionality requires PDF.js integration');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsSearchVisible(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  return (
    <div className="tabbed-pdf-viewer">
      <div className="pdf-viewer-header">
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <h2>KONIVRER Rules & Guidelines</h2>
        <div className="header-controls">
          <button 
            className={`search-toggle ${isSearchVisible ? 'active' : ''}`}
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            title="Search PDFs"
          >
            🔍
          </button>
        </div>
      </div>

      {isSearchVisible && (
        <div className="search-bar">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search within PDFs..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button 
            onClick={() => {
              setIsSearchVisible(false);
              setSearchTerm('');
            }}
            className="search-close"
          >
            ✕
          </button>
        </div>
      )}

      <div className="pdf-tabs">
        {pdfRules.map((rule) => (
          <button
            key={rule.id}
            className={`pdf-tab ${activeTab === rule.id ? 'active' : ''}`}
            onClick={() => setActiveTab(rule.id)}
          >
            <span className="tab-icon">📖</span>
            <span className="tab-title">{rule.title}</span>
          </button>
        ))}
      </div>

      <div className="pdf-content">
        {currentRule && (
          <div className="pdf-container">
            <div className="pdf-header">
              <h3>{currentRule.title}</h3>
              <p>{currentRule.description}</p>
            </div>
            <div className="pdf-frame-container">
              <iframe
                id={`pdf-iframe-${activeTab}`}
                src={`/pdfjs/web/viewer.html?file=/assets/${currentRule.filename}`}
                className="pdf-iframe"
                title={`${currentRule.title} PDF Viewer`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedPDFViewer;