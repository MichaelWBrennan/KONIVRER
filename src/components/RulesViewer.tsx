import React from 'react';
import './RulesViewer.css';

interface RulesViewerProps {
  onBack?: () => void;
}

const RulesViewer: React.FC<RulesViewerProps> = ({ onBack }) => {
  const rulesFiles = [
    {
      title: 'Basic Rules',
      filename: 'konivrer-rules.pdf',
      description: 'Learn the fundamental rules of KONIVRER',
    },
    {
      title: 'Tournament Rules',
      filename: 'konivrer-tournament-rules.pdf',
      description: 'Official tournament and competitive play rules',
    },
    {
      title: 'Code of Conduct',
      filename: 'konivrer-code-of-conduct.pdf',
      description: 'Community guidelines and code of conduct',
    },
  ];

  const openPDF = (filename: string) => {
    // Open PDF in the built-in PDF.js viewer
    const pdfUrl = `/pdfjs/web/viewer.html?file=/assets/${filename}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="rules-viewer">
      <div className="rules-header">
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <h2>KONIVRER Rules & Guidelines</h2>
        <p>
          Access official rules, tournament guidelines, and community standards
        </p>
      </div>

      <div className="rules-grid">
        {rulesFiles.map((rule, index) => (
          <div key={index} className="rule-card">
            <div className="rule-icon">📖</div>
            <h3>{rule.title}</h3>
            <p>{rule.description}</p>
            <button
              onClick={() => openPDF(rule.filename)}
              className="view-pdf-button"
            >
              View PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesViewer;
