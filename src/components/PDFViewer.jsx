/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Users, Shield } from 'lucide-react';

const PDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf' }) => {
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

  }, [activeTab]);



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
    
    // Use PDF.js viewer URL for full functionality
    const pdfViewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(currentPdfUrl)}`;
    
    console.log('PDF Viewer URL:', pdfViewerUrl);
    console.log('Current PDF URL:', currentPdfUrl);
    
    return (
      <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
        {/* Debug and fallback options */}
        <div className="p-3 bg-gray-50 text-sm border-b">
          <div className="mb-2">
            <strong>PDF.js Viewer:</strong> 
            <a 
              href={pdfViewerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Open in new tab
            </a>
          </div>
          <div className="text-xs text-gray-600">
            URL: {pdfViewerUrl}
          </div>
        </div>
        
        {/* Try iframe first */}
        <iframe
          ref={iframeRef}
          src={pdfViewerUrl}
          className="w-full border-0"
          style={{ backgroundColor: '#ffffff', height: 'calc(100% - 60px)' }}
          title={titles[activeTab] || titles.rules}
          onLoad={() => {
            console.log('PDF iframe loaded successfully');
            setIsLoading(false);
          }}
          onError={(e) => {
            console.error('PDF iframe failed to load:', e);
            setError('Failed to load PDF viewer');
          }}
          allow="fullscreen"
        />
        
        {/* Fallback message if iframe doesn't work */}
        {error && (
          <div className="p-4 bg-yellow-50 border-t">
            <p className="text-yellow-800 mb-2">PDF.js viewer failed to load in iframe.</p>
            <a 
              href={pdfViewerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open PDF.js Viewer in New Tab
            </a>
          </div>
        )}
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

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Info Text */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">
                Full PDF functionality: search, zoom, page navigation, and more available in the viewer below
              </span>
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