import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as s from "./events.css.ts";
import { NotificationService } from "../services/notifications";
import { useAuth } from "../hooks/useAuth";
import {
  type Event,
  type EventSearchFilters,
  searchEvents,
  getEventStatusText,
  canRegisterForEvent,
  formatEventDate,
  sortEvents,
} from "../utils/eventUtils";

export const Events: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"my-events" | "create" | "admin">(
    "my-events",
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchFilters, setSearchFilters] = useState<EventSearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    const filters: EventSearchFilters = {
      query: searchQuery,
      ...searchFilters,
    };
    const filtered = searchEvents(events, filters);
    return sortEvents(filtered);
  }, [events, searchQuery, searchFilters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    console.log("Searching events with query:", query);
  }, []);

  const searchPairings = useCallback(
    (query: string) => {
      // Search within selected event's pairings
      console.log(
        "Searching pairings for event",
        selectedEvent?.id,
        "with query:",
        query,
      );
      // This would typically make an API call to search pairings within the selected event
    },
    [selectedEvent?.id],
  );

  const applyAdvancedSearchWithFilters = useCallback(
    (filters: Record<string, unknown>) => {
      // Apply advanced search filters received from the persistent search bar
      console.log("Applying advanced search with filters:", filters);
      setSearchFilters(filters as EventSearchFilters);
    },
    [],
  );

  useEffect(() => {
    loadEvents();
  }, []);

  // Listen for search events from the global search bar
  useEffect(() => {
    const handlePairingsSearch = (e: CustomEvent) => {
      if (selectedEvent) {
        // If an event is selected, search within that event's pairings
        searchPairings(e.detail);
      } else {
        // Otherwise, search events
        handleSearch(e.detail);
      }
    };

    const handleAdvancedSearch = (e: CustomEvent) => {
      const filters = e.detail;
      console.log("Advanced search filters received:", filters);
      // Apply advanced search filters
      applyAdvancedSearchWithFilters(filters);
    };

    window.addEventListener(
      "pairings-search",
      handlePairingsSearch as EventListener,
    );
    window.addEventListener(
      "advanced-search",
      handleAdvancedSearch as EventListener,
    );
    return () => {
      window.removeEventListener(
        "pairings-search",
        handlePairingsSearch as EventListener,
      );
      window.removeEventListener(
        "advanced-search",
        handleAdvancedSearch as EventListener,
      );
    };
  }, [
    selectedEvent,
    applyAdvancedSearchWithFilters,
    searchPairings,
    handleSearch,
  ]);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/events');
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const eventsData = await response.json();
      // setEvents(eventsData);

      // Mock data for now
      const mockEvents: Event[] = [
        {
          id: "1",
          name: "KONIVRER Championship 2024",
          date: "2024-12-15",
          time: "10:00",
          format: "Standard",
          status: "upcoming",
          prizePool: "$10,000",
          participants: "0/64",
          maxParticipants: 64,
          description:
            "The ultimate KONIVRER tournament featuring the best players from around the world.",
          registrationDeadline: "2024-12-10",
        },
        {
          id: "2",
          name: "Weekly Casual Tournament",
          date: "2024-10-05",
          time: "19:00",
          format: "Casual",
          status: "registration-open",
          prizePool: "$500",
          participants: "12/32",
          maxParticipants: 32,
          description:
            "A fun, relaxed tournament for players of all skill levels.",
        },
      ];

      setEvents(mockEvents);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load events";
      setError(errorMessage);
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
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

  const handleEventRegister = async (eventId: string) => {
    try {
      setIsLoading(true);
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
      // const response = await fetch(`/api/events/${eventId}/register`, {
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
      await loadEvents();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register for event";
      setError(errorMessage);
      console.error("Failed to register for event:", error);
    } finally {
      setIsLoading(false);
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
        <div className={s.eventStatus}>{getEventStatusText(event.status)}</div>
      </div>
      <div className={s.eventDetails}>
        <p>
          <strong>Date:</strong> {formatEventDate(event.date, event.time)}
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
        {canRegisterForEvent(event) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEventRegister(event.id);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        )}
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
      </div>

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
        {/* Error Display */}
        {error && (
          <div className={s.error}>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className={s.loading}>
            <p>Loading events...</p>
          </div>
        )}

        {/* Event List View */}
        {!selectedEvent && !isLoading && (
          <div className={s.list}>
            {filteredEvents.length === 0 ? (
              <div className={s.empty}>
                <h3>No Events Available</h3>
                <p>
                  {searchQuery || Object.keys(searchFilters).length > 0
                    ? "No events match your search criteria. Try adjusting your filters."
                    : "Check back later for upcoming tournaments and events."}
                </p>
              </div>
            ) : (
              filteredEvents.map(renderEventCard)
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
