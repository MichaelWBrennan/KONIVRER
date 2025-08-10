import React from 'react';
import { Card } from '../data/cards';
import './CardDetail.css';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
  return (
    <div className="card-detail-overlay" onClick={onClose}>
      <div className="card-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
        
        <div className="card-detail-content">
          <div className="card-image-section">
            <h2>{card.name}</h2>
            <img
              src={card.webpUrl}
              alt={card.name}
              className="card-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = card.imageUrl;
              }}
            />
          </div>
          
          <div className="card-info-section">
            <div className="card-basic-info">
              <div className="info-row">
                <span className="label">Type:</span>
                <span className="value">{card.type}</span>
              </div>
              <div className="info-row">
                <span className="label">Element:</span>
                <span className="value">{card.element}</span>
              </div>
              <div className="info-row">
                <span className="label">Rarity:</span>
                <span className="value">{card.rarity}</span>
              </div>
              <div className="info-row">
                <span className="label">Cost:</span>
                <span className="value">{card.cost}</span>
              </div>
              {card.power !== undefined && (
                <div className="info-row">
                  <span className="label">Power:</span>
                  <span className="value">{card.power}</span>
                </div>
              )}
              {card.toughness !== undefined && (
                <div className="info-row">
                  <span className="label">Toughness:</span>
                  <span className="value">{card.toughness}</span>
                </div>
              )}
            </div>

            <div className="card-description">
              <h3>Description</h3>
              <p>{card.description}</p>
            </div>

            {/* OCR-extracted data section */}
            {card.ocrRawText && (
              <div className="ocr-data-section">
                <h3>OCR-Extracted Data</h3>
                <div className="ocr-fields">
                  {card.ocrExtractedName && (
                    <div className="ocr-field">
                      <span className="ocr-label">OCR Name:</span>
                      <span className="ocr-value">{card.ocrExtractedName}</span>
                    </div>
                  )}
                  {card.ocrCost && (
                    <div className="ocr-field">
                      <span className="ocr-label">OCR Cost:</span>
                      <span className="ocr-value">{card.ocrCost}</span>
                    </div>
                  )}
                  {card.ocrTypeLine && (
                    <div className="ocr-field">
                      <span className="ocr-label">OCR Type:</span>
                      <span className="ocr-value">{card.ocrTypeLine}</span>
                    </div>
                  )}
                  {card.ocrStats && (
                    <div className="ocr-field">
                      <span className="ocr-label">OCR Stats:</span>
                      <span className="ocr-value">{card.ocrStats}</span>
                    </div>
                  )}
                  {card.ocrSetCode && (
                    <div className="ocr-field">
                      <span className="ocr-label">Set Code:</span>
                      <span className="ocr-value">{card.ocrSetCode}</span>
                    </div>
                  )}
                  {card.ocrRulesText && (
                    <div className="ocr-field rules-text">
                      <span className="ocr-label">OCR Rules Text:</span>
                      <pre className="ocr-value rules-text-content">{card.ocrRulesText}</pre>
                    </div>
                  )}
                </div>
                
                <div className="accessibility-text">
                  <h4>Accessibility-Friendly Text</h4>
                  <div className="accessibility-content">
                    <p><strong>Card Name:</strong> {card.ocrExtractedName || card.name}</p>
                    {card.ocrCost && <p><strong>Cost:</strong> {card.ocrCost}</p>}
                    {card.ocrTypeLine && <p><strong>Type:</strong> {card.ocrTypeLine}</p>}
                    {card.ocrStats && <p><strong>Stats:</strong> {card.ocrStats}</p>}
                    {card.ocrRulesText && (
                      <div>
                        <p><strong>Rules Text:</strong></p>
                        <pre className="accessibility-rules">{card.ocrRulesText}</pre>
                      </div>
                    )}
                    {card.ocrSetCode && <p><strong>Set:</strong> {card.ocrSetCode}</p>}
                  </div>
                </div>

                <details className="raw-ocr-data">
                  <summary>Raw OCR Text (Debug)</summary>
                  <pre className="raw-text">{card.ocrRawText}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};