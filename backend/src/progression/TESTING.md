## Progression Module Testing

### Unit tests (suggested)

- ProgressionService
  - getOrCreateProfile creates default profile
  - updatePreferences merges preferences
  - applyPointUpdate updates proper fields and writes PointHistory
  - decayExpiredPoints handles no-ops gracefully

### Integration tests (suggested)

- POST /api/v1/progression/points/update increases totals
- GET /api/v1/progression/:userId/profile returns updated values

### Setup

- Use an in-memory Postgres or a test DB schema
- Seed a user record and exercise the endpoints
