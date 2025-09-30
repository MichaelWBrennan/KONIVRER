import React, { useState } from "react";
import { useCards } from "../hooks/useCards";
import { useLocalCards } from "../hooks/useLocalCards";
import { useAppStore } from "../stores/appStore";
import { Card } from "../data/cards"; // Use our local Card type
import * as cs from "./cardSearch.css.ts";
import { CardViewerModal } from "./CardViewerModal";
// nav header removed along with redundant filters

interface CardSearchProps {
  onCardSelect?: (card: Card) => void;
}

export const CardSearch: React.FC<CardSearchProps> = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { searchFilters, setSearchFilters } = useAppStore();

  // Using the existing useCards hook from src/hooks/useCards.ts to fetch data from the backend API.
  const { search: searchQuery, ...restFilters } = (searchFilters || {}) as {
    search?: string;
    [key: string]: unknown;
  };
  const {
    cards: remoteCards,
    total: remoteTotal,
    isLoading: remoteLoading,
    error: remoteError,
  } = useCards({ search: searchQuery, filters: restFilters });

  // Local fallback using generated/static data
  const { data: localData } = useLocalCards(searchFilters);
  const localCards = localData?.data ?? [];
  const localTotal = localData?.pagination.totalItems ?? localCards.length;

  const usingFallback = Boolean(remoteError);
  const cards = usingFallback ? localCards : remoteCards;
  const total = usingFallback ? localTotal : remoteTotal;
  const isLoading = remoteLoading;
  const error = remoteError;

  const handlePageChange = (page: number) => {
    setSearchFilters({ page });
  };
  // Do not hard-stop UI on error; we fall back to local data instead.

  const pagination = {
    currentPage: searchFilters.page || 1,
    totalPages: Math.ceil(total / 20),
    total: total,
  };

  return (
    <div>
      {/* The global Advanced Search handles all filtering and headings for cards. */}

      {isLoading && <div className="loading">Loading cards...</div>}

      {pagination && (
        <div className="pagination-info">
          Showing {(pagination.currentPage - 1) * searchFilters.limit! + 1}-
          {Math.min(
            pagination.currentPage * searchFilters.limit!,
            pagination.total,
          )}{" "}
          of {pagination.total} cards
        </div>
      )}

      <div className={cs.cardsGrid}>
        {(Array.isArray(cards) ? cards : cards?.data || []).map(
          (card: Card) => (
            <div
              key={card.id}
              className={`card-item ${cs.cardItem}`}
              onClick={() => setSelectedCard(card)}
            >
              <img
                src={card.webpUrl || card.imageUrl || "/placeholder-card.png"}
                alt={card.name}
                className={cs.cardImg}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/placeholder-card.png") {
                    target.src = card.imageUrl || "/placeholder-card.png";
                  }
                }}
              />
            </div>
          ),
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={cs.pagination}>
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className={cs.pageButton}
          >
            Previous
          </button>

          <span className={cs.paginationInfo}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className={cs.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {(Array.isArray(cards) ? cards : cards?.data || []).length === 0 &&
        !isLoading && (
          <div className={`no-results ${cs.noResults}`}>
            <p>No cards found matching your search criteria.</p>
          </div>
        )}

      <CardViewerModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};
