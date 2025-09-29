import React, { useState, useMemo } from "react";
import * as nav from "../nav.css.ts";
import * as ds from "./deckSearch.css.ts";
import { Deck, cardDatabase } from "../data/cards";
import { DeckBuilderAdvanced } from "../pages/DeckBuilderAdvanced";
import { useAppStore } from "../stores/appStore";

interface DeckSearchProps {
  onDeckSelect?: (deck: Deck) => void;
}

export const DeckSearch: React.FC<DeckSearchProps> = ({ onDeckSelect }) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const { searchFilters } = useAppStore();

  // Listen for build deck event from search bar
  React.useEffect(() => {
    const handleBuildDeck = () => {
      setShowBuilder(true);
    };

    window.addEventListener("build-deck", handleBuildDeck);
    return () => window.removeEventListener("build-deck", handleBuildDeck);
  }, []);

  // Available decks will be loaded from backend
  const availableDecks: Deck[] = useMemo(() => [], []);

  // Get unique values for filters (now handled by global search)

  // Filter decks based on search criteria from global search
  const filteredDecks = useMemo(() => {
    return availableDecks.filter((deck) => {
      const matchesSearch =
        !searchFilters.search ||
        deck.name.toLowerCase().includes(searchFilters.search.toLowerCase()) ||
        deck.description
          .toLowerCase()
          .includes(searchFilters.search.toLowerCase());

      const matchesElement =
        !searchFilters.element || deck.mainElement === searchFilters.element;

      return matchesSearch && matchesElement;
    });
  }, [searchFilters.search, searchFilters.element, availableDecks]);

  const getDeckPreviewCards = (deck: Deck) => {
    // Get first 3 cards from deck for preview
    return deck.cards
      .slice(0, 3)
      .map((cardId) => cardDatabase.find((card) => card.id === cardId))
      .filter(Boolean);
  };

  const handleAddToMyAccount = (deck: Deck) => {
    console.log("Adding deck to my account:", deck.name);
    alert(
      `"${deck.name}" will be imported to your account... (Feature coming soon)`,
    );
  };

  const handlePlayInSimulator = (deck: Deck) => {
    console.log("Loading deck in simulator:", deck.name);
    alert(`Loading "${deck.name}" in simulator... (Feature coming soon)`);
  };

  return (
    <div>
      <div className="search-container">
        {!showBuilder && (
          <div className="filters">
            {/* Filters are now handled by the global advanced search */}
          </div>
        )}
      </div>

      {!showBuilder ? (
        <div className="card-grid">
          {filteredDecks.map((deck) => {
            const previewCards = getDeckPreviewCards(deck);

            return (
              <div key={deck.id} className={`card-item ${ds.cardItem}`}>
                <div className={ds.previewRow}>
                  {previewCards.map((card, index) => (
                    <img
                      key={card?.id}
                      src={card?.webpUrl}
                      alt={card?.name}
                      style={{
                        width: `${100 / previewCards.length}%`,
                        height: "100%",
                        objectFit: "cover",
                        opacity: 1 - index * 0.1,
                      }}
                      className={ds.previewImg}
                      onError={(e) => {
                        // Fallback to PNG if WebP fails
                        if (card) {
                          (e.target as HTMLImageElement).src = card.imageUrl;
                        }
                      }}
                    />
                  ))}
                </div>
                <div className="card-info">
                  <div className="card-name">{deck.name}</div>
                  <div className="card-details">
                    <div>
                      {deck.mainElement} • {deck.format}
                    </div>
                    <div>
                      {deck.cards.length} cards • Win Rate: {""}
                      {(deck.winRate * 100).toFixed(0)}%
                    </div>
                    <div className={ds.desc}>{deck.description}</div>
                    <div className={ds.meta}>
                      Updated: {deck.updatedAt.toLocaleDateString()}
                    </div>
                    <div className={ds.actions}>
                      <button
                        className={`btn btn-primary ${ds.actionBtn}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToMyAccount(deck);
                        }}
                      >
                        + My Account
                      </button>
                      <button
                        className={`btn btn-secondary ${ds.actionBtn}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayInSimulator(deck);
                        }}
                      >
                        🎮 Play
                      </button>
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeckSelect?.(deck);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DeckBuilderAdvanced />
      )}
    </div>
  );
};
