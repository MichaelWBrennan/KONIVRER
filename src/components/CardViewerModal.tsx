import React, { useState, useEffect } from 'react';
import * as s from './cardViewerModal.css.ts';
import { Card } from '../data/cards';

interface CardViewerModalProps {
  card: Card | null;
  onClose: () => void;
}

export const CardViewerModal: React.FC<CardViewerModalProps> = ({ card, onClose }) => {
  const [upscaledImageUrl, setUpscaledImageUrl]: any = useState<string | null>(null);
  const [isLoading, setIsLoading]: any = useState(false);
  const [error, setError]: any = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setIsLoading(true);
      setError(null);

      const imageUrlToUpscale: any = card.webpUrl || card.imageUrl;
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
    <div className={s.overlay} onClick={onClose}>
      <div className={s.content} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={s.closeBtn}>
          &times;
        </button>

        {isLoading && <div className={s.loading}>Loading...</div>}
        {error && <div className={s.error}>Error: {error}</div>}
        {upscaledImageUrl && (
          <img src={upscaledImageUrl} alt={`Upscaled ${card.name}`} className={s.image} />
        )}
      </div>
    </div>
  );
};
