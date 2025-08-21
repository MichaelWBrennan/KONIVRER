import React, { useState, useEffect } from 'react';
import { Card } from '../data/cards';

interface CardViewerModalProps {
  card: Card | null;
  onClose: () => void;
}

export const CardViewerModal: React.FC<CardViewerModalProps> = ({ card, onClose }) => {
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setIsLoading(true);
      setError(null);

      const imageUrlToUpscale = card.webpUrl || card.imageUrl;
      if (!imageUrlToUpscale) {
        setError('No image available for this card.');
        setIsLoading(false);
        return;
      }

      // Fetch the upscaled image as a blob
      fetch(`/api/images/upscale?imageUrl=${encodeURIComponent(imageUrlToUpscale)}&level=level2`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to upscale image.');
          }
          return res.blob();
        })
        .then(blob => {
          setUpscaledImageUrl(URL.createObjectURL(blob));
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [card]);

  if (!card) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        maxWidth: '80vw',
        maxHeight: '80vh',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '-1rem', right: '-1rem',
          background: 'white', color: 'black',
          border: '2px solid black', borderRadius: '50%',
          width: '32px', height: '32px', cursor: 'pointer',
          fontSize: '1.5rem', lineHeight: '1',
        }}>
          &times;
        </button>

        {isLoading && <div style={{ color: 'white', fontSize: '2rem' }}>Loading...</div>}
        {error && <div style={{ color: 'red', fontSize: '1.5rem' }}>Error: {error}</div>}
        {upscaledImageUrl && (
          <img src={upscaledImageUrl} alt={`Upscaled ${card.name}`} style={{
            width: '100%', height: '100%', objectFit: 'contain'
          }} />
        )}
      </div>
    </div>
  );
};
