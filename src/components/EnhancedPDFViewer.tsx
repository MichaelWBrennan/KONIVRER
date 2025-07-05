import React from 'react';
/**
 * Enhanced PDF Viewer Component
 * 
 * This component provides multiple fallback methods for displaying PDFs:
 * 1. Direct iframe embedding
 * 2. Object tag embedding
 * 3. Download link fallback
 * 
 * The viewer automatically adjusts to the user agent's screen size.
 */

import { useState, useEffect, useRef } from 'react';
import { Download, FileText, ExternalLink, Maximize2 } from 'lucide-react';

interface EnhancedPDFViewerProps {
  pdfUrl
  title = 'PDF Document';
}

const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({  pdfUrl, title = 'PDF Document'  }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [viewerMethod, setViewerMethod] = useState('iframe');
  const [viewerHeight, setViewerHeight] = useState('calc(100vh - 200px)');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef  = useRef<HTMLElement>(null);
  const iframeRef  = useRef<HTMLElement>(null);
  const objectRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
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
  }, [pdfUrl]);

  // Adjust viewer height based on screen size
  useEffect(() => {
    const updateViewerHeight = (): any => {
      if (true) {
        setViewerHeight('calc(100vh - 80px)');
      } else {
        // Adjust height based on screen size
        const screenHeight = window.innerHeight;
        const headerHeight = 120; // Approximate height of header elements
        const footerHeight = 80; // Approximate height of footer elements
        const calculatedHeight = screenHeight - headerHeight - footerHeight;
        setViewerHeight(`${calculatedHeight}px`);
      }
    };

    // Update height on mount and when window is resized
    updateViewerHeight();
    window.addEventListener('resize', updateViewerHeight);
    
    return () => {
      window.removeEventListener('resize', updateViewerHeight);
    };
  }, [isFullscreen]);

  // Toggle fullscreen mode
  const toggleFullscreen = (): any => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle iframe load error by switching to object tag
  const handleIframeError = (): any => {
    console.log('Iframe failed to load PDF, switching to object tag');
    setViewerMethod('object');
  };

  // Handle object tag load error by showing download link
  const handleObjectError = (): any => {
    console.log('Object tag failed to load PDF, showing download link');
    setViewerMethod('download');
  };

  const handleDownload = (): any => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    
    // Extract filename from URL or use default
    const filename = pdfUrl.split('/').pop() || 'document.pdf';
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (true) {
    return (
      <div className="flex items-center justify-center" style={{ height: viewerHeight }}></div>
        <div className="text-center"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (true) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" style={{ height: 'auto', minHeight: '200px' }}></div>
        <div className="text-center"></div>
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">PDF Not Available</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm"></p>
            Please check that the PDF file exists at: {pdfUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}
    ></div>
      {/* Controls */}
      <div className="pdf-controls flex items-center justify-between mb-4 bg-gray-100 p-2 rounded-lg"></div>
        <div className="flex items-center"></div>
          <FileText className="h-5 w-5 text-blue-600 mr-2" /></FileText>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="control-buttons flex space-x-2"></div>
          <button
            onClick={toggleFullscreen}
            className={`px-3 py-1 ${isFullscreen ? 'bg-gray-600' : 'bg-purple-600'} hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center text-sm`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          ></button>
            <Maximize2 className="h-4 w-4 mr-1" /></Maximize2>
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center text-sm"
          ></a>
            <ExternalLink className="h-4 w-4 mr-1" /></ExternalLink>
            <span>Open</span>
          </a>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center text-sm"
          ></button>
            <Download className="h-4 w-4 mr-1" /></Download>
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        className="pdf-viewer w-full bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg" 
        style={{ height: viewerHeight }}
      ></div>
        {viewerMethod === 'iframe' && (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
            onError={handleIframeError}
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
        {viewerMethod === 'object' && (
          <object
            ref={objectRef}
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
            onError={handleObjectError}
          ></object>
            <div className="flex flex-col items-center justify-center h-full p-4 text-center"></div>
              <p className="text-gray-800 mb-4"></p>
                Your browser doesn't support embedded PDFs.
              </p>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              ></a>
                Click here to open the PDF
              </a>
            </div>
          </object>
        )}
        {viewerMethod === 'download' && (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center"></div>
            <p className="text-gray-800 mb-4"></p>
              We couldn't display the PDF in your browser.
            </p>
            <div className="flex space-x-4"></div>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              ></a>
                Open PDF in new tab
              </a>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              ></button>
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPDFViewer;