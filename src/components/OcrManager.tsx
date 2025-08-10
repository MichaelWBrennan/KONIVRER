import React, { useState } from 'react';
import { cardDataGenerator } from '../services/cardDataGenerator';
import { Card } from '../data/cards';
import './OcrManager.css';

interface OcrManagerProps {
  onDataUpdated?: (cards: Card[]) => void;
}

export const OcrManager: React.FC<OcrManagerProps> = ({ onDataUpdated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [processedCards, setProcessedCards] = useState<Card[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleStartOcr = async () => {
    setIsProcessing(true);
    setProgress('Starting OCR processing...');
    setProcessedCards([]);
    setShowResults(false);

    try {
      const cards = await cardDataGenerator.generateCardData();
      setProcessedCards(cards);
      setProgress(`Successfully processed ${cards.length} cards`);
      setShowResults(true);
      onDataUpdated?.(cards);
    } catch (error) {
      console.error('OCR processing failed:', error);
      setProgress(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadData = () => {
    if (processedCards.length > 0) {
      cardDataGenerator.downloadCardData(processedCards);
    }
  };

  const handleLoadExistingData = () => {
    const existingData = cardDataGenerator.loadCardData();
    if (existingData) {
      setProcessedCards(existingData);
      setShowResults(true);
      setProgress(`Loaded ${existingData.length} cards from cache`);
      onDataUpdated?.(existingData);
    } else {
      setProgress('No cached OCR data found');
    }
  };

  const formatOcrText = (text?: string) => {
    if (!text) return 'No data';
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  return (
    <div className="ocr-manager">
      <div className="ocr-header">
        <h3>OCR Card Data Manager</h3>
        <p>Extract card data directly from images using OCR technology</p>
      </div>

      <div className="ocr-controls">
        <button
          onClick={handleStartOcr}
          disabled={isProcessing}
          className="btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Start OCR Processing'}
        </button>
        
        <button
          onClick={handleLoadExistingData}
          disabled={isProcessing}
          className="btn-secondary"
        >
          Load Cached Data
        </button>
        
        {processedCards.length > 0 && (
          <button
            onClick={handleDownloadData}
            className="btn-success"
          >
            Download cards.json
          </button>
        )}
      </div>

      {progress && (
        <div className={`progress-message ${isProcessing ? 'processing' : ''}`}>
          {progress}
        </div>
      )}

      {showResults && processedCards.length > 0 && (
        <div className="ocr-results">
          <h4>OCR Results ({processedCards.length} cards)</h4>
          <div className="results-grid">
            {processedCards.slice(0, 6).map((card) => (
              <div key={card.id} className="card-result">
                <div className="card-preview">
                  <img
                    src={card.webpUrl}
                    alt={card.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = card.imageUrl;
                    }}
                  />
                </div>
                <div className="card-info">
                  <h5>{card.name}</h5>
                  <div className="ocr-data">
                    <div className="ocr-field">
                      <label>OCR Name:</label>
                      <span>{card.ocrExtractedName || 'Not detected'}</span>
                    </div>
                    <div className="ocr-field">
                      <label>Cost:</label>
                      <span>{card.ocrCost || 'Not detected'}</span>
                    </div>
                    <div className="ocr-field">
                      <label>Type:</label>
                      <span>{card.ocrTypeLine || 'Not detected'}</span>
                    </div>
                    <div className="ocr-field">
                      <label>Stats:</label>
                      <span>{card.ocrStats || 'Not detected'}</span>
                    </div>
                    <div className="ocr-field">
                      <label>Rules Text:</label>
                      <span>{formatOcrText(card.ocrRulesText)}</span>
                    </div>
                    <div className="ocr-field">
                      <label>Raw OCR:</label>
                      <span className="raw-text">{formatOcrText(card.ocrRawText)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {processedCards.length > 6 && (
            <p className="results-note">
              Showing first 6 results. Download the full data to see all {processedCards.length} cards.
            </p>
          )}
        </div>
      )}
    </div>
  );
};