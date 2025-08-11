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
          </div>
        </div>
      </div>
    </div>
  );
};