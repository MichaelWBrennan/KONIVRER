/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, FileText, Menu, Users, Shield } from 'lucide-react';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

// Mobile Tournament Rules Component
const MobileTournamentRules = () => {
  return (
    <div className="mobile-card-content esoteric-card-content">
      <div className="mobile-text">
        <h2 className="mobile-heading esoteric-heading mobile-mb">KONIVRER Tournament Rules</h2>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Tournament Structure</h3>
        <p className="mobile-p mobile-mb"><strong>Casual Events:</strong> Local store tournaments with relaxed enforcement and learning focus.</p>
        <p className="mobile-p mobile-mb"><strong>Competitive Events:</strong> Regional qualifiers with strict rule enforcement and professional judging.</p>
        <p className="mobile-p mobile-mb"><strong>Professional Events:</strong> Premier tournaments with highest level of competition and prizes.</p>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Match Structure</h3>
        <ul className="mobile-list esoteric-list mobile-mb">
          <li className="mobile-list-item esoteric-list-item">Best of 3 games with optional sideboarding</li>
          <li className="mobile-list-item esoteric-list-item">First player determined randomly for game 1</li>
          <li className="mobile-list-item esoteric-list-item">Match winner determined by first to win 2 games</li>
        </ul>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Time Limits</h3>
        <ul className="mobile-list esoteric-list mobile-mb">
          <li className="mobile-list-item esoteric-list-item"><strong>Swiss rounds:</strong> 50 minutes per match</li>
          <li className="mobile-list-item esoteric-list-item"><strong>Playoff rounds:</strong> 70-90 minutes</li>
          <li className="mobile-list-item esoteric-list-item"><strong>Deck construction:</strong> 30 minutes for sealed</li>
        </ul>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Tournament Roles</h3>
        <p className="mobile-p mobile-mb"><strong>Tournament Organizer:</strong> Overall event management and logistics.</p>
        <p className="mobile-p mobile-mb"><strong>Head Judge:</strong> Final authority on rules interpretations and penalties.</p>
        <p className="mobile-p mobile-mb"><strong>Floor Judges:</strong> Monitor matches and provide rules assistance.</p>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Deck Construction</h3>
        <ul className="mobile-list esoteric-list mobile-mb">
          <li className="mobile-list-item esoteric-list-item">Constructed decks must contain exactly 40 cards</li>
          <li className="mobile-list-item esoteric-list-item">Sideboard of up to 15 cards allowed</li>
          <li className="mobile-list-item esoteric-list-item">All cards must be legal for tournament format</li>
        </ul>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Penalties</h3>
        <p className="mobile-p mobile-mb"><strong>Warning:</strong> Minor procedural errors or first-time infractions.</p>
        <p className="mobile-p mobile-mb"><strong>Game Loss:</strong> Significant rule violations or repeated infractions.</p>
        <p className="mobile-p mobile-mb"><strong>Disqualification:</strong> Cheating or severe rule violations.</p>
      </div>
    </div>
  );
};

// Mobile Code of Conduct Component
const MobileCodeOfConduct = () => {
  return (
    <div className="mobile-card-content esoteric-card-content">
      <div className="mobile-text">
        <h2 className="mobile-heading esoteric-heading mobile-mb">KONIVRER Code of Conduct</h2>
        
        <div className="mobile-alert mobile-mb">
          <p className="mobile-text-small">KONIVRER is dedicated to creating inclusive play experiences for all participants.</p>
        </div>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Core Principles</h3>
        <p className="mobile-p mobile-mb"><strong>Respect and Inclusion:</strong> Treat all participants with respect and courtesy.</p>
        <p className="mobile-p mobile-mb"><strong>Fair Play:</strong> Compete honestly and follow all rules and procedures.</p>
        <p className="mobile-p mobile-mb"><strong>Sportsmanship:</strong> Be gracious in victory and defeat.</p>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Prohibited Behavior</h3>
        <p className="mobile-p mobile-mb"><strong>Harassment:</strong> Hate speech, discrimination, bullying, or threatening behavior.</p>
        <p className="mobile-p mobile-mb"><strong>Unsporting Conduct:</strong> Excessive arguing, slow play, or disruptive behavior.</p>
        <p className="mobile-p mobile-mb"><strong>Cheating:</strong> Misrepresenting game state, marked cards, or collusion.</p>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Player Responsibilities</h3>
        <ul className="mobile-list esoteric-list mobile-mb">
          <li className="mobile-list-item esoteric-list-item">Greet opponents at start and end of matches</li>
          <li className="mobile-list-item esoteric-list-item">Clearly announce actions and card effects</li>
          <li className="mobile-list-item esoteric-list-item">Keep play area organized and tidy</li>
          <li className="mobile-list-item esoteric-list-item">Handle opponent's cards with care</li>
        </ul>
        
        <h3 className="mobile-heading esoteric-heading mobile-mb">Enforcement</h3>
        <p className="mobile-p mobile-mb">Violations may result in warnings, game losses, match losses, disqualification, or suspension from future events.</p>
        
        <p className="mobile-p mobile-mb">Report violations immediately to a judge or tournament official.</p>
        
        <div className="mobile-alert mobile-mb">
          <p className="mobile-text-small">Remember: We're all here to enjoy KONIVRER together. Following these guidelines creates a welcoming environment for everyone.</p>
        </div>
      </div>
    </div>
  );
};

const MobilePDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(0.8); // Smaller default zoom for mobile
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const iframeRef = useRef(null);

  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (response.ok) {
          setPdfExists(true);
          setError(null);
        } else {
          setPdfExists(false);
          setError('PDF file not found');
        }
      } catch (err) {
        setPdfExists(false);
        setError('Failed to load PDF file');
      } finally {
        setIsLoading(false);
      }
    };

    checkPdfExists();
  }, [pdfUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          console.log('Searching for:', searchTerm);
        }
      } catch (err) {
        console.log('Search not available in this browser');
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.4));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'konivrer-rules.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-loading">
          <div className="esoteric-loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfExists) {
    return (
      <div className="mobile-container esoteric-bg-dark">
        {/* Header */}
        <div className="mobile-card esoteric-card mobile-mb">
          <div className="mobile-card-header esoteric-card-header">
            <div className="mobile-flex mobile-align-center">
              <FileText className="esoteric-icon" />
              <h1 className="mobile-card-title esoteric-rune">KONIVRER Rules</h1>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mobile-card esoteric-card">
          <div className="mobile-card-content esoteric-card-content mobile-text-center">
            <FileText className="esoteric-icon-large mobile-mb" />
            <h2 className="mobile-heading esoteric-heading mobile-mb">
              PDF Rules Document Not Available
            </h2>
            <p className="mobile-text mobile-mb">
              The KONIVRER rules PDF file is not currently available. Please contact the administrator to upload the rules document.
            </p>
            <div className="mobile-alert mobile-mb">
              <p className="mobile-text-small">
                <strong>For Administrators:</strong> Upload the rules PDF file to <code>/public/assets/konivrer-rules.pdf</code>
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="mobile-button esoteric-button"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <div className="mobile-card esoteric-card">
            <div className="mobile-card-content esoteric-card-content mobile-p-0">
              <div className="mobile-pdf-container">
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#page=${currentPage}&zoom=${zoom * 100}`}
                  className="mobile-pdf-iframe"
                  title="KONIVRER Rules PDF"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
          </div>
        );
      case 'tournament':
        return <MobileTournamentRules />;
      case 'conduct':
        return <MobileCodeOfConduct />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container esoteric-bg-dark">
      {/* Header */}
      <div className="mobile-card esoteric-card mobile-mb">
        <div className="mobile-card-header esoteric-card-header">
          <div className="mobile-flex mobile-justify-between mobile-align-center">
            <div className="mobile-flex mobile-align-center">
              <FileText className="esoteric-icon" />
              <h1 className="mobile-card-title esoteric-rune">KONIVRER Rules & Guidelines</h1>
            </div>
            {activeTab === 'rules' && (
              <button
                onClick={() => setShowControls(!showControls)}
                className="mobile-button-icon esoteric-button"
              >
                <Menu className="mobile-icon" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mobile-card-content esoteric-card-content">
          <div className="mobile-tabs">
            <button
              onClick={() => setActiveTab('rules')}
              className={`mobile-tab ${activeTab === 'rules' ? 'mobile-tab-active' : ''}`}
            >
              <FileText className="mobile-tab-icon" />
              <span>Game Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`mobile-tab ${activeTab === 'tournament' ? 'mobile-tab-active' : ''}`}
            >
              <Users className="mobile-tab-icon" />
              <span>Tournament</span>
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`mobile-tab ${activeTab === 'conduct' ? 'mobile-tab-active' : ''}`}
            >
              <Shield className="mobile-tab-icon" />
              <span>Conduct</span>
            </button>
          </div>
        </div>

        {/* Collapsible Controls - Only for rules tab */}
        {activeTab === 'rules' && showControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-card-content esoteric-card-content"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mobile-mb">
              <div className="mobile-flex mobile-gap">
                <div className="mobile-flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search rules..."
                    className="mobile-input esoteric-input"
                  />
                </div>
                <button
                  type="submit"
                  className="mobile-button esoteric-button"
                >
                  <Search className="mobile-icon" />
                </button>
              </div>
            </form>

            {/* Controls Row 1 - Zoom */}
            <div className="mobile-flex mobile-justify-between mobile-align-center mobile-mb">
              <span className="mobile-text-small">Zoom:</span>
              <div className="mobile-flex mobile-align-center mobile-gap">
                <button
                  onClick={handleZoomOut}
                  className="mobile-button-icon esoteric-button"
                  title="Zoom Out"
                >
                  <ZoomOut className="mobile-icon" />
                </button>
                <span className="mobile-text-small esoteric-text-accent">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="mobile-button-icon esoteric-button"
                  title="Zoom In"
                >
                  <ZoomIn className="mobile-icon" />
                </button>
              </div>
            </div>

            {/* Controls Row 2 - Navigation */}
            <div className="mobile-flex mobile-justify-between mobile-align-center mobile-mb">
              <span className="mobile-text-small">Page:</span>
              <div className="mobile-flex mobile-align-center mobile-gap">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="mobile-button-icon esoteric-button"
                  title="Previous Page"
                >
                  <ChevronLeft className="mobile-icon" />
                </button>
                <span className="mobile-text-small esoteric-text-accent">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="mobile-button-icon esoteric-button"
                  title="Next Page"
                >
                  <ChevronRight className="mobile-icon" />
                </button>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mobile-button esoteric-button mobile-w-full"
            >
              <Download className="mobile-icon" />
              Download PDF
            </button>
          </motion.div>
        )}
      </div>

      {/* Content Area */}
      {renderTabContent()}
    </div>
  );
};

export default MobilePDFViewer;