import React, { useState, useEffect } from "react";
import * as s from "./events.css.ts";
import { NotificationService } from "../services/notifications";
import { useAuth } from "../hooks/useAuth";

// Types
interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  format: string;
  status:
    | "upcoming"
    | "live"
    | "completed"
    | "registration-open"
    | "registration-closed";
  prizePool: string;
  participants: string;
  maxParticipants?: number;
  description: string;
  currentRound?: number;
  totalRounds?: number;
  viewers?: number;
  topPlayers?: string[];
  winner?: string;
  registrationDeadline?: string;
}

export const Events: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"my-events" | "create" | "admin">(
    "my-events",
  );
  const [viewMode, setViewMode] = useState<"upcoming" | "live" | "past">(
    "upcoming",
  );
  const [events] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<{
    start: string;
    end: string;
  }>({
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadEvents();
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

  // Listen for search events from the global search bar
  useEffect(() => {
    const handlePairingsSearch = (e: CustomEvent) => {
      if (selectedEvent) {
        // If an event is selected, search within that event's pairings
        searchPairings(e.detail);
      } else {
        // Otherwise, search events
        setSearchQuery(e.detail);
        searchEvents(e.detail);
      }
    };

    window.addEventListener(
      "pairings-search",
      handlePairingsSearch as EventListener,
    );
    return () => {
      window.removeEventListener(
        "pairings-search",
        handlePairingsSearch as EventListener,
      );
    };
  }, [selectedEvent]);

  const loadEvents = async () => {
    // Load events from API
    try {
      // const response  = await fetch('/api/events');
      // const eventsData  = await response.json();
      // setEvents(eventsData);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const searchEvents = (query: string) => {
    // Filter events based on search query
    // This would typically make an API call with search parameters
    console.log("Searching events with query:", query);
    // For now, we'll just log the search - in a real implementation,
    // this would filter the events state or make an API call
  };

  const searchPairings = (query: string) => {
    // Search within selected event's pairings
    console.log(
      "Searching pairings for event",
      selectedEvent?.id,
      "with query:",
      query,
    );
    // This would typically make an API call to search pairings within the selected event
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    // Update search context to indicate we're now searching within this event
    window.dispatchEvent(
      new CustomEvent("search-context", { detail: "event-standings" }),
    );
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    // Reset search context to events
    window.dispatchEvent(
      new CustomEvent("search-context", { detail: "events" }),
    );
  };

  const handleTimeFrameChange = (field: "start" | "end", value: string) => {
    setTimeFrame((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyAdvancedSearch = () => {
    // Apply all filters including time frame, geolocation, store filter, and advanced filters
    const searchParams = {
      timeFrame,
      geolocation,
      selectedStore,
      searchQuery,
      searchFilters,
    };

    console.log("Applying advanced search with:", searchParams);

    // This would typically make an API call with all the search parameters
    // The API call would include:
    // - userLat, userLng, maxDistance for geolocation
    // - storeId for store filtering
    // - format, status, venueType for advanced filters
    // - priceRange for entry fee filtering
    // - sortBy, sortOrder for sorting
    // - startDateFrom, startDateTo for date filtering

    searchEvents(searchQuery);
  };

  const handleEventRegister = async (eventId: string) => {
    try {
      // Register for event first
      console.log("Register for event:", eventId);

      // After successful registration, request notification permission if not already granted
      const notificationService = NotificationService.getInstance();
      if (Notification.permission === "default") {
        const granted = await notificationService.requestPermission();
        if (granted) {
          // Send a welcome notification to confirm notifications are working
          notificationService.sendNotification(
            "system",
            "Notifications Enabled",
            "You'll receive notifications about tournament updates and round starts.",
            {},
            eventId,
          );
        } else {
          console.log("User declined notification permission");
        }
      }

      // TODO: Implement actual event registration API call
      // const response  = await fetch(`/api/events/${eventId}/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to register for event');
      // }

      // Refresh events list to update registration status
      loadEvents();
    } catch (error) {
      console.error("Failed to register for event:", error);
      // Show error notification
      alert("Failed to register for event. Please try again.");
    }
  };

  const renderEventCard = (event: Event) => (
    <div
      key={event.id}
      className={s.eventCard}
      onClick={() => handleEventClick(event)}
    >
      <div className={s.eventHeader}>
        <h3 className={s.eventName}>{event.name}</h3>
        <div className={s.eventStatus}>{event.status}</div>
      </div>
      <div className={s.eventDetails}>
        <p>
          <strong>Date:</strong> {event.date} at {event.time}
        </p>
        <p>
          <strong>Format:</strong> {event.format}
        </p>
        <p>
          <strong>Prize Pool:</strong> {event.prizePool}
        </p>
        <p>
          <strong>Participants:</strong> {event.participants}
        </p>
        <p>{event.description}</p>
      </div>
      <div className={s.actions}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEventRegister(event.id);
          }}
        >
          Register
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEventClick(event);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Tournament Events</h1>
        <p>Discover and participate in competitive KONIVRER tournaments</p>

        {/* Quick Search Bar */}
        <div className={s.quickSearchSection}>
          <div className={s.quickSearchBar}>
            <input
              type="text"
              placeholder="Search events by name, format, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.quickSearchInput}
            />
            <button
              onClick={() => searchEvents(searchQuery)}
              className={s.quickSearchButton}
            >
              Search
            </button>
          </div>
          <div className={s.quickFilters}>
            <button
              className={s.quickFilterButton}
              onClick={() =>
                setSearchFilters((prev) => ({
                  ...prev,
                  status: "Registration Open",
                }))
              }
            >
              Open Registration
            </button>
            <button
              className={s.quickFilterButton}
              onClick={() =>
                setSearchFilters((prev) => ({ ...prev, venueType: "offline" }))
              }
            >
              In-Person
            </button>
            <button
              className={s.quickFilterButton}
              onClick={() =>
                setSearchFilters((prev) => ({ ...prev, venueType: "online" }))
              }
            >
              Online
            </button>
            <button
              className={s.quickFilterButton}
              onClick={() =>
                setSearchFilters((prev) => ({ ...prev, format: "Commander" }))
              }
            >
              Commander
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <div className={s.advancedSearchToggle}>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className={s.advancedSearchButton}
        >
          {showAdvancedSearch ? "Hide" : "Show"} Advanced Search
        </button>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
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

          {/* Geolocation Search */}
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

          {/* Store Filter */}
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

          {/* Advanced Filters */}
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

          <button onClick={applyAdvancedSearch} className={s.applySearchButton}>
            Apply Search
          </button>
        </div>
      )}

      <div className={s.nav}>
        <div className={s.navTabs}>
          {/* Only show My Events if user is authenticated */}
          {isAuthenticated && (
            <button
              className={activeTab === "my-events" ? "active" : ""}
              onClick={() => setActiveTab("my-events")}
            >
              My Events
            </button>
          )}
          {user?.role === "tournament_organizer" || user?.role === "admin" ? (
            <button
              className={activeTab === "create" ? "active" : ""}
              onClick={() => setActiveTab("create")}
            >
              Create Event
            </button>
          ) : null}
          {user?.role === "admin" ? (
            <button
              className={activeTab === "admin" ? "active" : ""}
              onClick={() => setActiveTab("admin")}
            >
              Admin
            </button>
          ) : null}
        </div>
      </div>

      <div className={s.content}>
        {/* Event List View */}
        {!selectedEvent && (
          <div className={s.list}>
            {events.length === 0 ? (
              <div className={s.empty}>
                <h3>No Events Available</h3>
                <p>Check back later for upcoming tournaments and events.</p>
              </div>
            ) : (
              events.map(renderEventCard)
            )}
          </div>
        )}

        {/* Selected Event View - for searching pairings */}
        {selectedEvent && (
          <div className={s.selectedEventView}>
            <div className={s.selectedEventHeader}>
              <button onClick={handleBackToEvents} className={s.backButton}>
                ← Back to Events
              </button>
              <h2>{selectedEvent.name}</h2>
            </div>
            <div className={s.eventPairings}>
              <p>
                Search pairings within this event using the search bar above.
              </p>
              {/* Pairings would be displayed here based on search results */}
            </div>
          </div>
        )}

        {activeTab === "my-events" && (
          <div className="my-events">
            <h2>My Registered Events</h2>
            {isAuthenticated ? (
              <p>You haven't registered for any events yet.</p>
            ) : (
              <p>You haven't registered for any events yet.</p>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className="create-event">
            <h2>Create New Event</h2>
            <p>Event creation functionality coming soon.</p>
          </div>
        )}

        {activeTab === "admin" && (
          <div className="admin-panel">
            <h2>Event Administration</h2>
            <p>Admin features coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};
