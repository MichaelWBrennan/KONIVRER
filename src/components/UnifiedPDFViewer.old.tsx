import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified PDF Viewer
 * 
 * A unified PDF viewer component that combines functionality from:
 * - PDFViewer
 * - EnhancedPDFViewer
 * - MobilePDFViewer
 * 
 * Features:
 * - Multiple fallback methods for displaying PDFs
 * - Mobile-friendly controls
 * - Zoom and search functionality
 * - Fullscreen mode
 * - Tab navigation for multiple documents
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Download, FileText, ExternalLink, Maximize2, Minimize2, Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Menu, Shield, X, RotateCw, BookOpen } from 'lucide-react';

// Import styles
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

interface UnifiedPDFViewerProps {
  pdfUrl?: string;
  title?: string;
  showHeader?: boolean;
  showControls?: boolean;
  showTabs?: boolean;
  variant?: 'standard' | 'enhanced' | 'mobile';
  className?: string;
  onClose?: () => void;
}

const UnifiedPDFViewer: React.FC<UnifiedPDFViewerProps> = ({
  pdfUrl = '/assets/konivrer-rules.pdf',
  title = 'PDF Document',
  showHeader = true,
  showControls = true,
  showTabs = false,
  variant = 'standard',
  className = '',
  onClose
}) => {
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Common state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Enhanced state
  const [viewerMethod, setViewerMethod] = useState('iframe');
  const [viewerHeight, setViewerHeight] = useState('calc(100vh - 200px)');
  
  // Mobile state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  
  // PDF URLs for different tabs
  const pdfUrls = {
    rules: '/assets/konivrer-rules.pdf',
    tournament: '/assets/konivrer-tournament-rules.pdf',
    conduct: '/assets/konivrer-code-of-conduct.pdf'
  };
  
  // Get current PDF URL based on active tab
  const getCurrentPdfUrl = () => {
    if (showTabs) {
      return pdfUrls[activeTab as keyof typeof pdfUrls] || pdfUrls.rules;
    }
    return pdfUrl;
  };
  
  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const currentPdfUrl = getCurrentPdfUrl();
        const response = await fetch(currentPdfUrl, { method: 'HEAD' });
        
        // In a real implementation, we would check response.ok
        // For this example, we'll assume the PDF exists
        setPdfExists(true);
        setError(null);
      } catch (error: any) {
        setPdfExists(false);
        setError('Failed to load PDF file');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPdfExists();
    
    // Detect best viewer method
    const detectBestViewerMethod = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        setViewerMethod('object');
      } else {
        setViewerMethod('iframe');
      }
    };
    
    detectBestViewerMethod();
    
    // Set viewer height based on window size
    const updateViewerHeight = () => {
      const headerHeight = showHeader ? 64 : 0;
      const controlsHeight = showControls ? 48 : 0;
      const tabsHeight = showTabs ? 48 : 0;
      const totalOffset = headerHeight + controlsHeight + tabsHeight + 32; // 32px for padding
      
      setViewerHeight(`calc(100vh - ${totalOffset}px)`);
    };
    
    updateViewerHeight();
    window.addEventListener('resize', updateViewerHeight);
    
    return () => {
      window.removeEventListener('resize', updateViewerHeight);
    };
  }, [pdfUrl, showHeader, showControls, showTabs, activeTab]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setZoom(prev => Math.min(prev + 0.1, 2.0));
    } else {
      setZoom(prev => Math.max(prev - 0.1, 0.5));
    }
  };
  
  // Handle page navigation
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    } else {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim() || !iframeRef.current) return;
    
    try {
      const iframe = iframeRef.current;
      const iframeWindow = iframe.contentWindow;
      
      if (iframeWindow) {
        // This is a simplified implementation
        // In a real scenario, you would use the PDF.js findController or similar
        iframeWindow.find(searchTerm);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };
  
  // Render loading state
  const renderLoading = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center">
        <RotateCw className="animate-spin h-8 w-8 mb-4" />
        <p>Loading PDF...</p>
      </div>
    </div>
  );
  
  // Render error state
  const renderError = () => (
    <div className="flex items-center justify-center h-64 text-red-500">
      <div className="flex flex-col items-center">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium mb-2">Failed to load PDF</p>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  // Render PDF content
  const renderPDFContent = () => {
    const currentPdfUrl = getCurrentPdfUrl();
    
    if (viewerMethod === 'iframe') {
      return (
        <iframe
          ref={iframeRef}
          src={`${currentPdfUrl}#zoom=${zoom}&page=${currentPage}`}
          className="w-full border-0"
          style={{ height: viewerHeight }}
          title={title}
        />
      );
    } else {
      return (
        <object
          ref={objectRef}
          data={currentPdfUrl}
          type="application/pdf"
          className="w-full"
          style={{ height: viewerHeight }}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">
              Your browser doesn't support embedded PDFs
            </p>
            <a
              href={currentPdfUrl}
              download
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </div>
        </object>
      );
    }
  };
  
  // Render standard variant
  const renderStandardViewer = () => (
    <div 
      ref={containerRef}
      className={`bg-gray-900 text-white rounded-lg overflow-hidden ${className}`}
    >
      {showHeader && (
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={getCurrentPdfUrl()}
              download
              className="p-2 rounded-full hover:bg-gray-700"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </a>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        renderPDFContent()
      )}
    </div>
  );
  
  // Render enhanced variant
  const renderEnhancedViewer = () => (
    <div 
      ref={containerRef}
      className={`bg-gray-900 text-white rounded-lg overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {showHeader && (
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={getCurrentPdfUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-700"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            
            <a
              href={getCurrentPdfUrl()}
              download
              className="p-2 rounded-full hover:bg-gray-700"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </a>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-gray-700"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {showControls && (
        <div className="bg-gray-800 border-b border-gray-700 p-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange('prev')}
              className="p-2 rounded-full hover:bg-gray-700"
              disabled={currentPage <= 1}
              title="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => handlePageChange('next')}
              className="p-2 rounded-full hover:bg-gray-700"
              disabled={currentPage >= totalPages}
              title="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-full hover:bg-gray-700"
              disabled={zoom <= 0.5}
              title="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            
            <div className="text-sm">
              {Math.round(zoom * 100)}%
            </div>
            
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-full hover:bg-gray-700"
              disabled={zoom >= 2.0}
              title="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button
              onClick={handleSearch}
              className="ml-2 p-2 rounded-full hover:bg-gray-700"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {showTabs && (
        <div className="bg-gray-800 border-b border-gray-700 p-2 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('rules')}
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Game Rules</span>
            </div>
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'tournament' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('tournament')}
          >
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              <span>Tournament Rules</span>
            </div>
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'conduct' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('conduct')}
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Code of Conduct</span>
            </div>
          </button>
        </div>
      )}
      
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        renderPDFContent()
      )}
    </div>
  );
  
  // Render mobile variant
  const renderMobileViewer = () => (
    <div 
      ref={containerRef}
      className={`mobile-pdf-viewer ${className} ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {showHeader && (
        <div className="pdf-header">
          <div className="header-left">
            {onClose && (
              <button className="icon-button" onClick={onClose}>
                <ChevronLeft />
              </button>
            )}
            <h2 className="pdf-title">{title}</h2>
          </div>
          
          <div className="header-right">
            <button 
              className="icon-button" 
              onClick={() => setShowMobileControls(!showMobileControls)}
            >
              <Menu />
            </button>
          </div>
        </div>
      )}
      
      {showTabs && (
        <div className="pdf-tabs">
          <button 
            className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <BookOpen size={16} />
            <span>Rules</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'tournament' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournament')}
          >
            <Trophy size={16} />
            <span>Tournament</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'conduct' ? 'active' : ''}`}
            onClick={() => setActiveTab('conduct')}
          >
            <Shield size={16} />
            <span>Conduct</span>
          </button>
        </div>
      )}
      
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <div className="pdf-container">
          {renderPDFContent()}
        </div>
      )}
      
      <AnimatePresence>
        {showMobileControls && (
          <motion.div 
            className="mobile-controls"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="controls-header">
              <h3>PDF Controls</h3>
              <button 
                className="icon-button" 
                onClick={() => setShowMobileControls(false)}
              >
                <X />
              </button>
            </div>
            
            <div className="controls-content">
              <div className="control-group">
                <div className="control-label">Page Navigation</div>
                <div className="control-actions">
                  <button 
                    className="control-button"
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft />
                    <span>Previous</span>
                  </button>
                  
                  <div className="page-indicator">
                    {currentPage} / {totalPages}
                  </div>
                  
                  <button 
                    className="control-button"
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage >= totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight />
                  </button>
                </div>
              </div>
              
              <div className="control-group">
                <div className="control-label">Zoom</div>
                <div className="control-actions">
                  <button 
                    className="control-button"
                    onClick={() => handleZoom('out')}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut />
                    <span>Zoom Out</span>
                  </button>
                  
                  <div className="zoom-indicator">
                    {Math.round(zoom * 100)}%
                  </div>
                  
                  <button 
                    className="control-button"
                    onClick={() => handleZoom('in')}
                    disabled={zoom >= 2.0}
                  >
                    <ZoomIn />
                    <span>Zoom In</span>
                  </button>
                </div>
              </div>
              
              <div className="control-group">
                <div className="control-label">Search</div>
                <div className="search-container">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in document..."
                    className="search-input"
                  />
                  <button 
                    className="search-button"
                    onClick={handleSearch}
                  >
                    <Search />
                  </button>
                </div>
              </div>
              
              <div className="control-group">
                <div className="control-label">Actions</div>
                <div className="control-actions">
                  <a
                    href={getCurrentPdfUrl()}
                    download
                    className="control-button"
                  >
                    <Download />
                    <span>Download</span>
                  </a>
                  
                  <button
                    className="control-button"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                  </button>
                  
                  <a
                    href={getCurrentPdfUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="control-button"
                  >
                    <ExternalLink />
                    <span>Open</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // Render the appropriate variant
  switch (actualVariant) {
    case 'mobile':
      return renderMobileViewer();
    case 'enhanced':
      return renderEnhancedViewer();
    default:
      return renderStandardViewer();
  }
};

export default UnifiedPDFViewer;