import React, { useEffect, useState } from "react";
import * as s from "./searchBar.css.ts";

interface Props {
  current: string;
  onSearch: (query: string) => void;
  onAdvancedSearch?: (filters: AdvancedSearchFilters) => void;
  onBuildDeck?: () => void;
}

interface AdvancedSearchFilters {
  timeFrame: { start: string; end: string };
  geolocation: { lat: number | null; lng: number | null; maxDistance: number };
  selectedStore: string;
  searchFilters: {
    format: string;
    status: string;
    venueType: string;
    priceRange: { min: number; max: number };
    dateRange: { start: string; end: string };
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export const SearchBar: React.FC<Props> = ({
  current,
  onSearch,
  onAdvancedSearch,
  onBuildDeck,
}) => {
  const [q, setQ] = useState("");
  const [contextOverride, setContextOverride] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [geolocation, setGeolocation] = useState<{
    lat: number | null;
    lng: number | null;
    maxDistance: number;
  }>({
    lat: null,
    lng: null,
    maxDistance: 50,
  });
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchFilters, setSearchFilters] = useState<{
    format: string;
    status: string;
    venueType: string;
    priceRange: { min: number; max: number };
    dateRange: { start: string; end: string };
    sortBy: string;
    sortOrder: "asc" | "desc";
    element?: string;
    type?: string;
    rarity?: string;
    legalOnly?: boolean;
    category?: string;
    timeRange?: string;
    metric?: string;
  }>({
    format: "",
    status: "",
    venueType: "",
    priceRange: { min: 0, max: 1000 },
    dateRange: { start: "", end: "" },
    sortBy: "startAt",
    sortOrder: "asc",
    element: "",
    type: "",
    rarity: "",
    legalOnly: false,
    category: "",
    timeRange: "",
    metric: "",
  });

  useEffect(() => {
    const handler = (e: any) => setContextOverride(e.detail);
    window.addEventListener("search-context", handler);
    return () => window.removeEventListener("search-context", handler);
  }, []);

  // Only get location when advanced search is opened on events page
  useEffect(() => {
    if (showAdvancedSearch && (current === "events" || current === "event-archive")) {
      getCurrentLocation();
    }
  }, [showAdvancedSearch, current]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        (error) => {
          console.warn("Geolocation error:", error);
        },
      );
    }
  };

  const placeholder = (() => {
    const ctx = contextOverride || current;
    switch (current) {
      case "cards":
        return "Search cards by name, type, or element...";
      case "decks":
        return "Search decks by name, format, or creator...";
      case "events":
        if (ctx === "event-archive") return "Search past events...";
        if (ctx === "event-standings")
          return "Search pairings (name or table)...";
        return "Search events by name, format, or location...";
      case "home":
        return "Search everything...";
      case "lore":
        return "Search lore and stories...";
      case "rules":
        return "Search rules and regulations...";
      case "my-decks":
        return "Search your decks...";
      case "analytics":
        return "Search analytics data...";
      default:
        return "Search...";
    }
  })();

  useEffect(() => {
    const h = setTimeout(() => onSearch(q), 300);
    return () => clearTimeout(h);
  }, [q]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(q);
    }
  };

  const handleAdvancedSearch = () => {
    if (onAdvancedSearch) {
      const filters: AdvancedSearchFilters = {
        timeFrame,
        geolocation,
        selectedStore,
        searchFilters,
      };
      onAdvancedSearch(filters);
    }
  };

  const handleTimeFrameChange = (field: "start" | "end", value: string) => {
    setTimeFrame((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderAdvancedSearch = () => {
    if (!showAdvancedSearch) return null;

    const renderContextSpecificFilters = () => {
      switch (current) {
        case "cards":
          return (
            <div className={s.advancedFiltersSection}>
              <h4>Card Filters</h4>
              <div className={s.filtersGrid}>
                <div className={s.filterGroup}>
                  <label htmlFor="elementFilter">Element:</label>
                  <select
                    id="elementFilter"
                    value={searchFilters.element || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        element: e.target.value || "",
                      }))
                    }
                  >
                    <option value="">All Elements</option>
                    <option value="Fire">Fire</option>
                    <option value="Water">Water</option>
                    <option value="Earth">Earth</option>
                    <option value="Air">Air</option>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="typeFilter">Type:</label>
                  <select
                    id="typeFilter"
                    value={searchFilters.type || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        type: e.target.value || "",
                      }))
                    }
                  >
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="rarityFilter">Rarity:</label>
                  <select
                    id="rarityFilter"
                    value={searchFilters.rarity || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        rarity: e.target.value || "",
                      }))
                    }
                  >
                    <option value="">All Rarities</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="legalFilter">
                    <input
                      id="legalFilter"
                      type="checkbox"
                      checked={searchFilters.legalOnly || false}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          legalOnly: e.target.checked,
                        }))
                      }
                    />
                    Tournament Legal Only
                  </label>
                </div>
              </div>
            </div>
          );

        case "decks":
        case "my-decks":
          return (
            <div className={s.advancedFiltersSection}>
              <h4>Deck Filters</h4>
              <div className={s.filtersGrid}>
                <div className={s.filterGroup}>
                  <label htmlFor="formatFilter">Format:</label>
                  <select
                    id="formatFilter"
                    value={searchFilters.format || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        format: e.target.value || "",
                      }))
                    }
                  >
                    <option value="">All Formats</option>
                    <option value="Standard">Standard</option>
                    <option value="Draft">Draft</option>
                    <option value="Sealed">Sealed</option>
                    <option value="Commander">Commander</option>
                    <option value="Pauper">Pauper</option>
                    <option value="Legacy">Legacy</option>
                    <option value="Modern">Modern</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="elementFilter">Main Element:</label>
                  <select
                    id="elementFilter"
                    value={searchFilters.element || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        element: e.target.value || "",
                      }))
                    }
                  >
                    <option value="">All Elements</option>
                    <option value="Fire">Fire</option>
                    <option value="Water">Water</option>
                    <option value="Earth">Earth</option>
                    <option value="Air">Air</option>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="sortByFilter">Sort By:</label>
                  <select
                    id="sortByFilter"
                    value={searchFilters.sortBy || "name"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                  >
                    <option value="name">Name</option>
                    <option value="createdAt">Date Created</option>
                    <option value="updatedAt">Last Updated</option>
                    <option value="winRate">Win Rate</option>
                    <option value="cardCount">Card Count</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="sortOrderFilter">Sort Order:</label>
                  <select
                    id="sortOrderFilter"
                    value={searchFilters.sortOrder || "asc"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sortOrder: e.target.value as "asc" | "desc",
                      }))
                    }
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          );

        case "events":
        case "event-archive":
          return (
            <>
              <div className={s.timeFrameInputs}>
                <div className={s.timeFrameInput}>
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    id="startDate"
                    type="date"
                    value={timeFrame.start}
                    onChange={(e) =>
                      handleTimeFrameChange("start", e.target.value)
                    }
                  />
                </div>
                <div className={s.timeFrameInput}>
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    id="endDate"
                    type="date"
                    value={timeFrame.end}
                    onChange={(e) =>
                      handleTimeFrameChange("end", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={s.geolocationSection}>
                <h4>Location Search</h4>
                <div className={s.geolocationInputs}>
                  <div className={s.geolocationInput}>
                    <label htmlFor="maxDistance">Max Distance (miles):</label>
                    <input
                      id="maxDistance"
                      type="number"
                      min="1"
                      max="500"
                      value={geolocation.maxDistance}
                      onChange={(e) =>
                        setGeolocation((prev) => ({
                          ...prev,
                          maxDistance: parseInt(e.target.value) || 50,
                        }))
                      }
                    />
                  </div>
                  <div className={s.geolocationStatus}>
                    {geolocation.lat && geolocation.lng ? (
                      <span className={s.locationFound}>
                        📍 Location found: {geolocation.lat.toFixed(4)},{" "}
                        {geolocation.lng.toFixed(4)}
                      </span>
                    ) : (
                      <span className={s.locationNotFound}>
                        📍 Location not available
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className={s.refreshLocationButton}
                    >
                      Refresh Location
                    </button>
                  </div>
                </div>
              </div>

              <div className={s.storeSection}>
                <h4>Store Filter</h4>
                <div className={s.storeInput}>
                  <label htmlFor="storeSelect">Filter by Store:</label>
                  <select
                    id="storeSelect"
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                  >
                    <option value="">All Stores</option>
                    <option value="store1">Game Haven</option>
                    <option value="store2">Card Castle</option>
                    <option value="store3">Magic Emporium</option>
                    <option value="store4">Dragon's Den</option>
                  </select>
                </div>
              </div>

              <div className={s.advancedFiltersSection}>
                <h4>Event Filters</h4>
                <div className={s.filtersGrid}>
                  <div className={s.filterGroup}>
                    <label htmlFor="formatFilter">Format:</label>
                    <select
                      id="formatFilter"
                      value={searchFilters.format}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Formats</option>
                      <option value="Standard">Standard</option>
                      <option value="Draft">Draft</option>
                      <option value="Sealed">Sealed</option>
                      <option value="Commander">Commander</option>
                      <option value="Pauper">Pauper</option>
                      <option value="Legacy">Legacy</option>
                      <option value="Modern">Modern</option>
                    </select>
                  </div>

                  <div className={s.filterGroup}>
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                      id="statusFilter"
                      value={searchFilters.status}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Registration Open">
                        Registration Open
                      </option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className={s.filterGroup}>
                    <label htmlFor="venueTypeFilter">Venue Type:</label>
                    <select
                      id="venueTypeFilter"
                      value={searchFilters.venueType}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          venueType: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Venues</option>
                      <option value="online">Online</option>
                      <option value="offline">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className={s.filterGroup}>
                    <label htmlFor="sortByFilter">Sort By:</label>
                    <select
                      id="sortByFilter"
                      value={searchFilters.sortBy}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value,
                        }))
                      }
                    >
                      <option value="startAt">Start Date</option>
                      <option value="name">Event Name</option>
                      <option value="registeredPlayers">Participants</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                  </div>

                  <div className={s.filterGroup}>
                    <label htmlFor="sortOrderFilter">Sort Order:</label>
                    <select
                      id="sortOrderFilter"
                      value={searchFilters.sortOrder}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          sortOrder: e.target.value as "asc" | "desc",
                        }))
                      }
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                <div className={s.priceRangeSection}>
                  <label>Entry Fee Range:</label>
                  <div className={s.priceRangeInputs}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchFilters.priceRange.min}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            min: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchFilters.priceRange.max}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            max: parseInt(e.target.value) || 1000,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          );

        case "lore":
        case "rules":
          return (
            <div className={s.advancedFiltersSection}>
              <h4>Content Filters</h4>
              <div className={s.filtersGrid}>
                <div className={s.filterGroup}>
                  <label htmlFor="categoryFilter">Category:</label>
                  <select
                    id="categoryFilter"
                    value={searchFilters.category || ""}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        category: e.target.value || "",
                      }))
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="history">History</option>
                    <option value="characters">Characters</option>
                    <option value="locations">Locations</option>
                    <option value="events">Events</option>
                    <option value="rules">Rules</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="sortByFilter">Sort By:</label>
                  <select
                    id="sortByFilter"
                    value={searchFilters.sortBy || "relevance"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title">Title</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>
            </div>
          );

        case "analytics":
          return (
            <div className={s.advancedFiltersSection}>
              <h4>Analytics Filters</h4>
              <div className={s.filtersGrid}>
                <div className={s.filterGroup}>
                  <label htmlFor="timeRangeFilter">Time Range:</label>
                  <select
                    id="timeRangeFilter"
                    value={searchFilters.timeRange || "7d"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        timeRange: e.target.value,
                      }))
                    }
                  >
                    <option value="1d">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="metricFilter">Metric:</label>
                  <select
                    id="metricFilter"
                    value={searchFilters.metric || "views"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        metric: e.target.value,
                      }))
                    }
                  >
                    <option value="views">Page Views</option>
                    <option value="searches">Searches</option>
                    <option value="clicks">Clicks</option>
                    <option value="conversions">Conversions</option>
                  </select>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className={s.advancedFiltersSection}>
              <h4>General Filters</h4>
              <div className={s.filtersGrid}>
                <div className={s.filterGroup}>
                  <label htmlFor="sortByFilter">Sort By:</label>
                  <select
                    id="sortByFilter"
                    value={searchFilters.sortBy || "relevance"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                <div className={s.filterGroup}>
                  <label htmlFor="sortOrderFilter">Sort Order:</label>
                  <select
                    id="sortOrderFilter"
                    value={searchFilters.sortOrder || "desc"}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sortOrder: e.target.value as "asc" | "desc",
                      }))
                    }
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className={s.advancedSearchPanel}>
        {renderContextSpecificFilters()}
        <button onClick={handleAdvancedSearch} className={s.applySearchButton}>
          Apply Advanced Search
        </button>
      </div>
    );
  };

  return (
    <div className={s.wrap}>
      <div className={s.mainSearchBar}>
        <input
          className={s.input}
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Advanced Search Toggle and Build Deck Button */}
      <div className={s.advancedSearchToggle}>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className={s.advancedSearchToggleButton}
        >
          <span>Advanced Search</span>
          <span className={s.dropdownArrow}>
            {showAdvancedSearch ? "▲" : "▼"}
          </span>
        </button>
        {(current === "decks" || current === "my-decks") && onBuildDeck && (
          <button
            onClick={onBuildDeck}
            className={s.buildDeckButton}
          >
            Build Deck
          </button>
        )}
      </div>

      {renderAdvancedSearch()}
    </div>
  );
};
