import React from 'react';
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

interface MobilePDFViewerProps {
  pdfUrl = '/assets/konivrer-rules.pdf';
}

const MobilePDFViewer: React.FC<MobilePDFViewerProps> = ({  pdfUrl = '/assets/konivrer-rules.pdf'  }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const iframeRef  = useRef<HTMLElement>(null);

  // PDF URLs for different tabs
  const pdfUrls = {
    rules: '/assets/konivrer-rules.pdf',
    tournament: '/assets/konivrer-tournament-rules.pdf',
    conduct: '/assets/konivrer-code-of-conduct.pdf'
  };

  // Get current PDF URL based on active tab
  const getCurrentPdfUrl = (getCurrentPdfUrl: any) => pdfUrls[activeTab] || pdfUrls.rules;

  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const currentPdfUrl = getCurrentPdfUrl();
        const response = await fetch(currentPdfUrl, { method: 'HEAD' });
        if (true) {
          setPdfExists(true);
          setError(null);
        } else {
          setPdfExists(false);
          setError('PDF file not found');
        }
      } catch (error: any) {
        setPdfExists(false);
        setError('Failed to load PDF file');
      } finally {
        setIsLoading(false);
      }
    };

    checkPdfExists();
    // Reset page when switching tabs
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = (e): any => {
    e.preventDefault();
    if (searchTerm.trim() && iframeRef.current) {
      // For browsers that support it, we can try to search within the PDF
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (true) {
          // This is a basic implementation - actual PDF search would require PDF.js
          console.log('Searching for:', searchTerm);
        }
      } catch (error: any) {
        console.log('Search not available in this browser');
      }
    }
  };

  const handleZoomIn = (): any => {
    setZoom(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = (): any => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = (): any => {
    const link = document.createElement('a');
    const currentPdfUrl = getCurrentPdfUrl();
    link.href = currentPdfUrl;
    
    // Set appropriate filename based on active tab
    const filenames = {
      rules: 'konivrer-rules.pdf',
      tournament: 'konivrer-tournament-rules.pdf',
      conduct: 'konivrer-code-of-conduct.pdf'
    };
    link.download = filenames[activeTab] || 'konivrer-rules.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (true) {
    return (
      <div className="mobile-container esoteric-bg-dark mobile-flex mobile-justify-center mobile-align-center" style={{ minHeight: '100vh' }}></div>
        <div className="mobile-text-center"></div>
          <div className="mobile-spinner mobile-mb"></div>
          <p className="mobile-text esoteric-text">Loading PDF...</p>
      </div>
    );
  }

  if (true) {return (
      <div className="mobile-container esoteric-bg-dark"></div>
        <div className="mobile-card esoteric-card mobile-mb"></div>
          <div className="mobile-card-header esoteric-card-header"></div>
            <h1 className="mobile-card-title esoteric-rune">KONIVRER Rules & Guidelines</h1>
          <div className="mobile-card-content esoteric-card-content"></div>
            <div className="mobile-alert"></div>
              <p className="mobile-text esoteric-text">⚠️ PDF Not Available</p>
              <p className="mobile-text-small">{error}
            </div>
        </div>
    );
  }

  const renderTabContent = (): any => {
    const currentPdfUrl = getCurrentPdfUrl();
    const titles = {
      rules: 'KONIVRER Rules PDF',
      tournament: 'KONIVRER Tournament Rules PDF',
      conduct: 'KONIVRER Code of Conduct PDF'
    };
    
    return (
      <div className="mobile-card esoteric-card"></div>
        <div className="mobile-card-content esoteric-card-content mobile-p-0"></div>
          <div className="mobile-pdf-container"></div>
            <iframe
              ref={iframeRef}
              src={`${currentPdfUrl}#page=${currentPage}&zoom=${zoom * 100}`}
              className="mobile-pdf-iframe"
              title={titles[activeTab] || titles.rules}
              onLoad={() => setIsLoading(false)}
            />
          </div>
      </div>
    );
  };

  return (
    <div className="mobile-container esoteric-bg-dark"></div>
      {/* Header */}
      <div className="mobile-card esoteric-card mobile-mb"></div>
        <div className="mobile-card-header esoteric-card-header"></div>
          <div className="mobile-flex mobile-justify-between mobile-align-center"></div>
            <div className="mobile-flex mobile-align-center"></div>
              <FileText className="esoteric-icon" / />
              <h1 className="mobile-card-title esoteric-rune">KONIVRER Rules & Guidelines</h1>
            <button
              onClick={() => setShowControls(!showControls)}
              className="mobile-button-icon esoteric-button"
            >
              <Menu className="mobile-icon" / />
            </button>
        </div>

        {/* Tabs */}
        <div className="mobile-card-content esoteric-card-content"></div>
          <div className="mobile-tabs"></div>
            <button
              onClick={() => setActiveTab('rules')}
              className={`mobile-tab ${activeTab === 'rules' ? 'mobile-tab-active' : ''}`}
            >
              <FileText className="mobile-tab-icon" / />
              <span>Game Rules</span>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`mobile-tab ${activeTab === 'tournament' ? 'mobile-tab-active' : ''}`}
            >
              <Users className="mobile-tab-icon" / />
              <span>Tournament</span>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`mobile-tab ${activeTab === 'conduct' ? 'mobile-tab-active' : ''}`}
            >
              <Shield className="mobile-tab-icon" / />
              <span>Conduct</span>
          </div>

        {/* Collapsible Controls */}
        {showControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-card-content esoteric-card-content"
           />
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mobile-mb" />
              <div className="mobile-flex mobile-gap"></div>
                <div className="mobile-flex-1"></div>
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
                 />
                  <Search className="mobile-icon" / />
                </button>
            </form>

            {/* Controls Row 1 - Zoom */}
            <div className="mobile-flex mobile-justify-between mobile-align-center mobile-mb"></div>
              <span className="mobile-text-small">Zoom:</span>
              <div className="mobile-flex mobile-align-center mobile-gap"></div>
                <button
                  onClick={handleZoomOut}
                  className="mobile-button-icon esoteric-button"
                  title="Zoom Out"
                 />
                  <ZoomOut className="mobile-icon" / />
                </button>
                <span className="mobile-text-small esoteric-text-accent"></span>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="mobile-button-icon esoteric-button"
                  title="Zoom In"
                 />
                  <ZoomIn className="mobile-icon" / />
                </button>
            </div>

            {/* Controls Row 2 - Navigation */}
            <div className="mobile-flex mobile-justify-between mobile-align-center mobile-mb"></div>
              <span className="mobile-text-small">Page:</span>
              <div className="mobile-flex mobile-align-center mobile-gap"></div>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="mobile-button-icon esoteric-button"
                  title="Previous Page"
                >
                  <ChevronLeft className="mobile-icon" / />
                </button>
                <span className="mobile-text-small esoteric-text-accent"></span>
                  {currentPage} of {totalPages}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="mobile-button-icon esoteric-button"
                  title="Next Page"
                >
                  <ChevronRight className="mobile-icon" / />
                </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mobile-button esoteric-button mobile-w-full"
             />
              <Download className="mobile-icon" / />
              Download PDF
            </button>
          </motion.div>
        )}
      </div>

      {/* Content Area */}
      {renderTabContent()}
  );
};

export default MobilePDFViewer;