import React from "react";
import { Card } from "../data/cards";
import * as st from "./cardDetail.css.ts";
import { resolveCardImageUrls } from "../utils/cardImages";

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
  return (
    <div className={st.overlay} onClick={onClose}>
      <div className={st.modal} onClick={(e) => e.stopPropagation()}>
        <button className={st.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={st.content}>
          <div className={st.imageSection}>
            <h2>{card.name}</h2>
            <picture>
              {(() => {
                const { webpSrc } = resolveCardImageUrls(card);
                return <source srcSet={webpSrc} type="image/webp" />;
              })()}
              <img
                src={(() => resolveCardImageUrls(card).imgSrc)()}
                alt={card.name}
                className={st.cardImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith("/assets/card-back-new.png")) {
                    target.src = "/assets/card-back-new.png";
                  }
                }}
              />
            </picture>
          </div>

          <div className={st.infoSection}>
            <div className={st.basicInfo}>
              <div className={st.infoRow}>
                <span className={st.label}>Type:</span>
                <span className={st.value}>{card.type}</span>
              </div>
              <div className={st.infoRow}>
                <span className={st.label}>Element:</span>
                <span className={st.value}>{card.element}</span>
              </div>
              <div className={st.infoRow}>
                <span className={st.label}>Rarity:</span>
                <span className={st.value}>{card.rarity}</span>
              </div>
              <div className={st.infoRow}>
                <span className={st.label}>Cost:</span>
                <span className={st.value}>{card.cost}</span>
              </div>
              {card.power !== undefined && (
                <div className={st.infoRow}>
                  <span className={st.label}>Power:</span>
                  <span className={st.value}>{card.power}</span>
                </div>
              )}
              {card.toughness !== undefined && (
                <div className={st.infoRow}>
                  <span className={st.label}>Toughness:</span>
                  <span className={st.value}>{card.toughness}</span>
                </div>
              )}
            </div>

            <div className={st.description}>
              <h3>Description</h3>
              <p>{card.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
