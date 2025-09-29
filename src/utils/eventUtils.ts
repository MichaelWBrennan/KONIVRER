/**
 * Event-related utility functions
 */

export interface Event {
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

export interface EventSearchFilters {
  query?: string;
  status?: string;
  format?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    lat: number;
    lng: number;
    maxDistance: number;
  };
}

/**
 * Search events based on filters
 */
export function searchEvents(
  events: Event[],
  filters: EventSearchFilters,
): Event[] {
  return events.filter((event) => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        event.name,
        event.description,
        event.format,
        event.prizePool,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Status filter
    if (filters.status && event.status !== filters.status) {
      return false;
    }

    // Format filter
    if (filters.format && event.format !== filters.format) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const eventDate = new Date(event.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      if (eventDate < startDate || eventDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get event status display text
 */
export function getEventStatusText(status: Event["status"]): string {
  const statusMap: Record<Event["status"], string> = {
    upcoming: "Upcoming",
    live: "Live Now",
    completed: "Completed",
    "registration-open": "Registration Open",
    "registration-closed": "Registration Closed",
  };

  return statusMap[status] || status;
}

/**
 * Check if event registration is available
 */
export function canRegisterForEvent(event: Event): boolean {
  return event.status === "registration-open" || event.status === "upcoming";
}

/**
 * Format event date for display
 */
export function formatEventDate(date: string, time: string): string {
  try {
    const eventDateTime = new Date(`${date}T${time}`);
    return eventDateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${date} at ${time}`;
  }
}

/**
 * Get event priority for sorting
 */
export function getEventPriority(event: Event): number {
  const statusPriority: Record<Event["status"], number> = {
    live: 1,
    "registration-open": 2,
    upcoming: 3,
    "registration-closed": 4,
    completed: 5,
  };

  return statusPriority[event.status] || 999;
}

/**
 * Sort events by priority and date
 */
export function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const priorityA = getEventPriority(a);
    const priorityB = getEventPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // If same priority, sort by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}
