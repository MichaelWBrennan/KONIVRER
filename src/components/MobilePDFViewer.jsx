/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, FileText, Menu } from 'lucide-react';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

const MobilePDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(0.8); // Smaller default zoom for mobile
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [showControls, setShowControls] = useState(false);
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

  return (
    <div className="mobile-container esoteric-bg-dark">
      {/* Header */}
      <div className="mobile-card esoteric-card mobile-mb">
        <div className="mobile-card-header esoteric-card-header">
          <div className="mobile-flex mobile-justify-between mobile-align-center">
            <div className="mobile-flex mobile-align-center">
              <FileText className="esoteric-icon" />
              <h1 className="mobile-card-title esoteric-rune">KONIVRER Rules</h1>
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="mobile-button-icon esoteric-button"
            >
              <Menu className="mobile-icon" />
            </button>
          </div>
        </div>

        {/* Collapsible Controls */}
        {showControls && (
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

      {/* PDF Viewer */}
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

      {/* Instructions */}
      <div className="mobile-card esoteric-card mobile-mt">
        <div className="mobile-card-header esoteric-card-header">
          <h3 className="mobile-card-title esoteric-rune">How to Use</h3>
        </div>
        <div className="mobile-card-content esoteric-card-content">
          <div className="mobile-text-small">
            <p className="mobile-mb">
              <strong>Navigation:</strong> Use the page controls to navigate through the document. Zoom in/out using the zoom controls.
            </p>
            <p className="mobile-mb">
              <strong>Search:</strong> Use the search bar to find specific rules. You can also use your browser's find function (usually Ctrl+F or Cmd+F).
            </p>
            <p>
              <strong>Download:</strong> Download the PDF for offline viewing or to open in your preferred PDF reader.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePDFViewer;