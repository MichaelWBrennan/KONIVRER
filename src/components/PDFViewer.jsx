/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Users, Shield } from 'lucide-react';

const PDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf', showHeader = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const iframeRef = useRef(null);

  // Use the provided PDF URL or default to basic rules
  const getCurrentPdfUrl = () => pdfUrl;

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

  }, [pdfUrl]);



  const handleDownload = () => {
    const link = document.createElement('a');
    const currentPdfUrl = getCurrentPdfUrl();
    link.href = currentPdfUrl;
    
    // Determine filename based on PDF URL
    let filename = 'KONIVRER-Rules.pdf';
    if (currentPdfUrl.includes('tournament-rules')) {
      filename = 'KONIVRER-Tournament-Rules.pdf';
    } else if (currentPdfUrl.includes('code-of-conduct')) {
      filename = 'KONIVRER-Code-of-Conduct.pdf';
    } else if (currentPdfUrl.includes('konivrer-rules')) {
      filename = 'KONIVRER-Basic-Rules.pdf';
    }
    
    link.download = filename;
    
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
    
    // Determine title based on PDF URL
    let title = 'KONIVRER Basic Rules';
    if (currentPdfUrl.includes('tournament-rules')) {
      title = 'KONIVRER Tournament Rules';
    } else if (currentPdfUrl.includes('code-of-conduct')) {
      title = 'KONIVRER Code of Conduct';
    }
    
    // Use PDF.js viewer URL for full functionality
    const pdfViewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(currentPdfUrl)}`;
    
    return (
      <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
        <iframe
          ref={iframeRef}
          src={pdfViewerUrl}
          className="w-full h-full border-0"
          style={{ backgroundColor: '#ffffff' }}
          title={title}
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>
    );
  };

  if (!showHeader) {
    // Simple version without header for use within other components
    return (
      <div className="w-full">
        {/* Controls */}
        <div className="flex items-center justify-end mb-4">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* PDF Content */}
        {renderTabContent()}
      </div>
    );
  }

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

          {/* Rules Info */}
          <div className="bg-blue-500/20 backdrop-blur-md rounded-lg p-4 mb-6 border border-blue-500/30">
            <h2 className="text-lg font-semibold text-white mb-2">KONIVRER Basic Rules</h2>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• No artifacts or sorceries - Everything can be cast at instant speed</p>
              <p>• All familiars have haste and vigilance</p>
              <p>• No graveyard - Only a removed from play zone</p>
              <p>• Power and toughness are combined into one stat called "strength"</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end">
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