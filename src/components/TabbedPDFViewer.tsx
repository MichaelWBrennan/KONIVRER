import React, { useState } from 'react';
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

  return (
    <div className="tabbed-pdf-viewer">
      <div className="pdf-viewer-header">
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
      </div>

      <div className="pdf-tabs">
        {pdfRules.map(rule => (
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
