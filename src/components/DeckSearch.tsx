import React, { useState, useMemo } from "react";
import * as nav from "../nav.css.ts";
import * as ds from "./deckSearch.css.ts";
import { Deck, cardDatabase } from "../data/cards";
import { DeckBuilderAdvanced } from "../pages/DeckBuilderAdvanced";

interface DeckSearchProps {
  onDeckSelect?: (deck: Deck) => void;
}

export const DeckSearch: React.FC<DeckSearchProps> = ({ onDeckSelect }) => {
  const [activeTab, setActiveTab] = useState<"search" | "builder">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [elementFilter, setElementFilter] = useState("");
  // Removed format filter dropdown and logic

  // Available decks will be loaded from backend
  const availableDecks: Deck[] = [];

  // Get unique values for filters
  const elements = useMemo(
    () => [...new Set(availableDecks.map((deck) => deck.mainElement))].sort(),
    [availableDecks]
  );
  // Removed formats list as format filter is no longer used

  // Filter decks based on search criteria
  const filteredDecks = useMemo(() => {
    return availableDecks.filter((deck) => {
      const matchesSearch =
        searchTerm === "" ||
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesElement =
        elementFilter === "" || deck.mainElement === elementFilter;

      return matchesSearch && matchesElement;
    });
  }, [searchTerm, elementFilter, availableDecks]);

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
      `"${deck.name}" will be imported to your account... (Feature coming soon)`
    );
  };

  const handlePlayInSimulator = (deck: Deck) => {
    console.log("Loading deck in simulator:", deck.name);
    alert(`Loading "${deck.name}" in simulator... (Feature coming soon)`);
  };

  return (
    <div>
      <div className="search-container">
        <div className="view-tabs">
          <button
            className={`btn ${
              activeTab === "search" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
          <button
            className={`btn ${
              activeTab === "builder" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("builder")}
          >
            Deck Builder
          </button>
        </div>
        <h1 className={nav.navTitle}>Decks</h1>
        {activeTab === "search" && (
          <input
            type="text"
            placeholder="Search decks by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}

        {activeTab === "search" && (
          <div className="filters">
            <select
              value={elementFilter}
              onChange={(e) => setElementFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Elements</option>
              {elements.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>

            {/* Removed format filter dropdown */}
          </div>
        )}

        {activeTab === "search" && (
          <div className="results-count">
            {filteredDecks.length} decks found
          </div>
        )}
      </div>

      {activeTab === "search" ? (
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
