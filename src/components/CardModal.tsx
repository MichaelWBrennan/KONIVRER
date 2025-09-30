import type { Card } from "../types";
import * as overlay from "../appOverlay.css.ts";

interface CardModalProps {
  card: Card | null;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  if (!card) return null;

  return (
    <div className={overlay.modalMask} onClick={onClose}>
      <div className={overlay.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={overlay.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2>{card.name}</h2>
        <img
          src={card.webpUrl || card.imageUrl || "/assets/card-back-new.webp"}
          alt={card.name}
          className={overlay.modalImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              card.imageUrl || "/assets/card-back-new.webp";
          }}
        />
        <div className={overlay.modalBody}>
          <p>
            <strong>Type:</strong> {card.type || card.lesserType}
          </p>
          <p>
            <strong>Element:</strong>{" "}
            {card.element || card.elements?.join(", ")}
          </p>
          <p>
            <strong>Rarity:</strong> {card.rarity}
          </p>
          <p>
            <strong>Cost:</strong> {card.cost || card.azothCost}
          </p>
          {card.power !== undefined && card.toughness !== undefined && (
            <p>
              <strong>Power/Toughness:</strong> {card.power}/{card.toughness}
            </p>
          )}
          {card.rulesText && (
            <p>
              <strong>Rules Text:</strong> {card.rulesText}
            </p>
          )}
          {card.flavorText && (
            <p>
              <em>{card.flavorText}</em>
            </p>
          )}
          {card.abilities && card.abilities.length > 0 && (
            <p>
              <strong>Abilities:</strong> {card.abilities.join(", ")}
            </p>
          )}
        </div>
        <button className={overlay.modalPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
