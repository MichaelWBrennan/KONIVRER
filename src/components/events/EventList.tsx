import React, { useState, useEffect } from 'react';
import { 
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
  Alert,
  InputGroup,
} from 'react-bootstrap';
import { 
  Calendar,
  Users,
  MapPin,
  Filter,
  Plus,
  Search,
  Wifi,
  WifiOff,
  Trophy,
  Star,
} from 'lucide-react';
import { NotificationService } from '../../services/notifications';

interface Event {
  id: string;
  name: string;
  description?: string;
  format: string;
  pairingType: string;
  status: string;
  startAt: string;
  endAt?: string;
  venue: {
    type: 'online' | 'offline' | 'hybrid';
    location?: string;
    onlineUrl?: string;
  };
  settings: {
    maxPlayers: number;
    minPlayers: number;
    buyIn?: number;
    currency?: string;
  };
  organizer: {
    username: string;
    displayName: string;
  };
  registeredPlayers: number;
  waitlistedPlayers: number;
  isRegistrationOpen: boolean;
  isFeatured: boolean;
  isSanctioned: boolean;
}

interface EventSearchFilters {
  format?: string;
  status?: string;
  venueType?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  page?: number;
  limit?: number;
}

const EventList: React.FC = () => {
  const [events, setEvents]  = useState<Event[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]  = useState<string | null>(null);
  const [filters, setFilters]  = useState<EventSearchFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters]  = useState(false);
  const [total, setTotal]  = useState(0);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents  = async () => {
    try {
      setLoading(true);
      const queryParams  = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response  = await fetch(`/api/events?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data  = await response.json();
      setEvents(data.events);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange  = (key: keyof EventSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleSearch  = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const handleEventRegister  = async (event: Event) => {
    try {
      // Register for event first
      console.log('Registering for event:', event.id);
      
      // TODO: Implement actual event registration API call
      // const response  = await fetch(`/api/events/${event.id}/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to register for event');
      // }
      
      // After successful registration, request notification permission if not already granted
      const notificationService  = NotificationService.getInstance();
      if (Notification.permission === 'default') {
        const granted  = await notificationService.requestPermission();
        if (granted) {
          // Send a welcome notification to confirm notifications are working
          notificationService.sendNotification(
            'registration_accepted',
            'Registration Successful!',
            `You've successfully registered for ${event.name}. You'll receive notifications about tournament updates.`,
            { eventName: event.name },
            event.id
          );
        } else {
          // Still show success even if notifications aren't enabled
          alert(`Successfully registered for ${event.name}!`);
        }
      } else {
        // User already has granted or denied permission, just show success
        alert(`Successfully registered for ${event.name}!`);
      }
      
      // Refresh events list to update registration status
      fetchEvents();
    } catch (error) {
      console.error('Failed to register for event:', error);
      alert('Failed to register for event. Please try again.');
    }
  };

  const formatDate  = (dateString: string) => {
    const date  = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeVariant  = (status: string) => {
    switch (status) {
      case 'Registration Open': return 'success';
      case 'In Progress': return 'primary';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'danger';
      default: return 'light';
    }
  };

  const getVenueIcon  = (venueType: string) => {
    switch (venueType) {
      case 'online': return <Wifi className="me-1" size={16} />;
      case 'offline': return <MapPin className="me-1" size={16} />;
      case 'hybrid': return <><Wifi className="me-1" size={12} /><WifiOff className="me-1" size={12} /></>;
      default: return <MapPin className="me-1" size={16} />;
    }
  };

  return (
    <Container fluid className="px-2 py-3">
      {/* Mobile-First Header */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Events</h2>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
              </Button>
              <Button variant="primary" size="sm">
                <Plus size={16} className="me-1" />
                Create
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search events..."
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button variant="outline-secondary">
              <Search size={16} />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Collapsible Filters */}
      {showFilters && (
        <Row className="mb-3">
          <Col>
            <Card className="border-0 bg-light">
              <Card.Body className="py-2">
                <Row className="g-2">
                  <Col xs={6} sm={3}>
                    <Form.Select 
                      size="sm"
                      value={filters.format || ''}
                      onChange={(e) => handleFilterChange('format', e.target.value)}
                    >
                      <option value="">All Formats</option>
                      <option value="Standard">Standard</option>
                      <option value="Draft">Draft</option>
                      <option value="Sealed">Sealed</option>
                      <option value="Commander">Commander</option>
                    </Form.Select>
                  </Col>
                  <Col xs={6} sm={3}>
                    <Form.Select 
                      size="sm"
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Registration Open">Open</option>
                      <option value="In Progress">Running</option>
                      <option value="Completed">Finished</option>
                    </Form.Select>
                  </Col>
                  <Col xs={6} sm={3}>
                    <Form.Select 
                      size="sm"
                      value={filters.venueType || ''}
                      onChange={(e) => handleFilterChange('venueType', e.target.value)}
                    >
                      <option value="">All Venues</option>
                      <option value="online">Online</option>
                      <option value="offline">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </Form.Select>
                  </Col>
                  <Col xs={6} sm={3}>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="w-100"
                      onClick={() => setFilters({ page: 1, limit: 10 })}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
          <div className="mt-2">Loading events...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Event List */}
      {!loading && !error && (
        <>
          <Row className="g-3">
            {events.map((event) => (
              <Col xs={12} md={6} lg={4} key={event.id}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="border-0 bg-white pb-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        {event.isFeatured && <Star size={16} className="text-warning me-1" />}
                        {event.isSanctioned && <Trophy size={16} className="text-info me-1" />}
                      </div>
                      <Badge bg={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="pt-0">
                    <h5 className="card-title mb-2 text-truncate">{event.name}</h5>
                    
                    {event.description && (
                      <p className="text-muted small mb-3" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                    )}

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <Calendar size={14} className="text-muted me-2" />
                        <small className="text-muted">
                          {formatDate(event.startAt)}
                        </small>
                      </div>
                      
                      <div className="d-flex align-items-center mb-1">
                        {getVenueIcon(event.venue.type)}
                        <small className="text-muted">
                          {event.venue.type === 'online' ? 'Online Event' : 
                           event.venue.location || 'TBD'}
                        </small>
                      </div>

                      <div className="d-flex align-items-center mb-1">
                        <Users size={14} className="text-muted me-2" />
                        <small className="text-muted">
                          {event.registeredPlayers}/{event.settings.maxPlayers} players
                          {event.waitlistedPlayers > 0 && 
                            ` (+${event.waitlistedPlayers} waitlisted)`}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="light" text="dark" className="me-2">
                        {event.format}
                      </Badge>
                      <Badge bg="light" text="dark">
                        {event.pairingType}
                      </Badge>
                    </div>

                    {event.settings.buyIn && (
                      <div className="mb-2">
                        <small className="text-muted">
                          Entry Fee: {event.settings.currency || '$'}{event.settings.buyIn}
                        </small>
                      </div>
                    )}

                    <small className="text-muted">
                      Organized by {event.organizer.displayName}
                    </small>
                  </Card.Body>

                  <Card.Footer className="border-0 bg-white pt-0">
                    <div className="d-grid gap-2">
                      <Button 
                        variant={event.isRegistrationOpen ? "primary" : "outline-secondary"}
                        size="sm"
                        disabled={!event.isRegistrationOpen}
                        onClick={() => event.isRegistrationOpen ? handleEventRegister(event) : null}
                      >
                        {event.isRegistrationOpen ? 'Register' : 'View Details'}
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {total > filters.limit! && (
            <Row className="mt-4">
              <Col>
                <div className="d-flex justify-content-center">
                  <Button 
                    variant="outline-primary"
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange('page', filters.page! - 1)}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <span className="align-self-center mx-3">
                    Page {filters.page} of {Math.ceil(total / filters.limit!)}
                  </span>
                  <Button 
                    variant="outline-primary"
                    disabled={filters.page! >= Math.ceil(total / filters.limit!)}
                    onClick={() => handleFilterChange('page', filters.page! + 1)}
                  >
                    Next
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-5">
              <Calendar size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No events found</h5>
              <p className="text-muted">
                Try adjusting your filters or check back later for new events.
              </p>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default EventList;