import React, { useEffect, useState } from "react";
import * as s from "./searchBar.css.ts";

interface Props {
  current: string;
  onSearch: (query: string) => void;
  onAdvancedSearch?: (filters: AdvancedSearchFilters) => void;
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
  }>({
    format: "",
    status: "",
    venueType: "",
    priceRange: { min: 0, max: 1000 },
    dateRange: { start: "", end: "" },
    sortBy: "startAt",
    sortOrder: "asc",
  });

  useEffect(() => {
    const handler = (e: any) => setContextOverride(e.detail);
    window.addEventListener("search-context", handler);
    return () => window.removeEventListener("search-context", handler);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

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

    // Only show advanced search for events and tournaments
    if (current !== "events" && current !== "event-archive") return null;

    return (
      <div className={s.advancedSearchPanel}>
        <div className={s.timeFrameInputs}>
          <div className={s.timeFrameInput}>
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              type="date"
              value={timeFrame.start}
              onChange={(e) => handleTimeFrameChange("start", e.target.value)}
            />
          </div>
          <div className={s.timeFrameInput}>
            <label htmlFor="endDate">End Date:</label>
            <input
              id="endDate"
              type="date"
              value={timeFrame.end}
              onChange={(e) => handleTimeFrameChange("end", e.target.value)}
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
          <h4>Advanced Filters</h4>
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
                <option value="Registration Open">Registration Open</option>
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
        />
        <button className={s.searchButton} onClick={() => onSearch(q)}>
          Search
        </button>
      </div>

      {/* Advanced Search Toggle - only show for events */}
      {(current === "events" || current === "event-archive") && (
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
        </div>
      )}

      {renderAdvancedSearch()}
    </div>
  );
};
