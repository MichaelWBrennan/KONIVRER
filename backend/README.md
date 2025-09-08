## Progression (Tournament Profiles) Schema Migration

In development, TypeORM `synchronize` is enabled (see `AppModule`), so the new entities are auto-created:

- `tournament_profiles`
- `point_history`

For production, apply SQL migrations using your existing database migration tool. Example SQL:

```sql
CREATE TABLE IF NOT EXISTS tournament_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_points INT DEFAULT 0,
  regional_points INT DEFAULT 0,
  global_points INT DEFAULT 0,
  format_specific_points JSONB DEFAULT '{}',
  qualification_status JSONB DEFAULT '{}',
  last_point_update TIMESTAMP DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_profiles_user_id ON tournament_profiles(user_id);

CREATE TABLE IF NOT EXISTS point_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_id UUID NULL,
  points_earned INT NOT NULL,
  point_type VARCHAR(32) NOT NULL,
  placement INT NULL,
  total_participants INT NULL,
  event_date TIMESTAMP NOT NULL,
  decay_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_history_user_event_date ON point_history(user_id, event_date);
```

## New APIs

- `GET /api/v1/progression/:userId/profile`
- `PUT /api/v1/progression/:userId/preferences`
- `POST /api/v1/progression/points/update`

## Notes

- Tournament discovery added: `GET /api/v1/tournaments/discover`.
- Matchmaking additions: `POST /matchmaking/tournament-prep`, `POST /matchmaking/qualification-prep`.
