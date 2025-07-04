/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, FileText, Users, Shield } from 'lucide-react';

const PDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const iframeRef = useRef(null);

  // PDF URLs for different tabs
  const pdfUrls = {
    rules: '/assets/konivrer-rules.pdf',
    tournament: '/assets/konivrer-tournament-rules.pdf',
    conduct: '/assets/konivrer-code-of-conduct.pdf'
  };

  // Get current PDF URL based on active tab
  const getCurrentPdfUrl = () => pdfUrls[activeTab] || pdfUrls.rules;

  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const currentPdfUrl = getCurrentPdfUrl();
        const response = await fetch(currentPdfUrl, { method: 'HEAD' });
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
    // Reset page when switching tabs
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && iframeRef.current) {
      // For browsers that support it, we can try to search within the PDF
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // This is a basic implementation - actual PDF search would require PDF.js
          console.log('Searching for:', searchTerm);
        }
      } catch (err) {
        console.log('Search not available in this browser');
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">KONIVRER Rules & Guidelines</h1>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-md rounded-lg p-6 border border-red-500/30"
          >
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-white mb-2">PDF Not Available</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <p className="text-gray-400 text-sm">
                Please check that the PDF file exists in the public/assets directory.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const currentPdfUrl = getCurrentPdfUrl();
    const titles = {
      rules: 'KONIVRER Rules PDF',
      tournament: 'KONIVRER Tournament Rules PDF',
      conduct: 'KONIVRER Code of Conduct PDF'
    };
    
    return (
      <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden">
        <object
          ref={iframeRef}
          data={currentPdfUrl}
          type="application/pdf"
          className="w-full h-full border-0"
          title={titles[activeTab] || titles.rules}
          onLoad={() => setIsLoading(false)}
        >
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">PDF cannot be displayed in this browser.</p>
              <a 
                href={currentPdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Open PDF in New Tab
              </a>
            </div>
          </div>
        </object>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">KONIVRER Rules & Guidelines</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Game Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'tournament'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Tournament Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'conduct'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Code of Conduct</span>
            </button>
          </div>

          {/* Search and Controls */}
          <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search rules..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Zoom:</span>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-white text-sm min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Page:</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-white text-sm min-w-[80px] text-center">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* PDF Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default PDFViewer;