# KONIVRER Enterprise Platform - MVP Implementation

This repository contains the initial implementation of the enterprise-grade KONIVRER platform, featuring a modern full-stack architecture with scalable backend services and a React-based frontend.

## 🏗️ Architecture Overview

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **API**: REST + GraphQL
- **Documentation**: Swagger/OpenAPI

### Frontend (React)

- **Framework**: React 18 with TypeScript
- **Build**: Vite
- **State Management**: Zustand + React Query
- **Styling**: CSS with CSS Variables

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd KONIVRER-deck-database

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start Development Services

```bash
# Start PostgreSQL and Redis
docker-compose -f docker-compose.dev.yml up -d

# Start backend (in one terminal)
cd backend
npm run start:dev

# Start frontend (in another terminal)
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/v1
- **API Documentation**: http://localhost:3001/api/docs

## 📊 Current Features (MVP)

### ✅ Implemented

- Canonical card database with UUID-based IDs
- Advanced card search with filters (type, element, rarity, cost)
- Pagination and sorting
- Data migration service for existing KONIVRER cards
- REST API with full CRUD operations
- GraphQL API for flexible queries
- React Query for efficient data fetching
- Zustand for client state management
- TypeScript throughout the stack

### 🚧 In Progress

- Authentication system (OAuth2/JWT)
- Deck CRUD operations and analytics
- Tournament system
- WebSocket real-time updates

### 📋 Planned (Future Milestones)

- Judge portal and certification
- Browser-based game client
- Tournament marketplace
- Advanced analytics dashboard
- Mobile-responsive design improvements

## 🎯 API Endpoints

### Cards API

- `GET /api/v1/cards` - Get paginated cards with filters
- `POST /api/v1/cards` - Create new card
- `GET /api/v1/cards/:id` - Get card by ID
- `PUT /api/v1/cards/:id` - Update card
- `DELETE /api/v1/cards/:id` - Delete card
- `GET /api/v1/cards/statistics` - Get card statistics

### Migration API

- `POST /api/v1/migration/seed-konivrer-cards` - Seed database with sample cards

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (to be implemented)
npm test
```

## 🗄️ Database Schema

### Cards Table

- `id` (UUID, Primary Key) - Canonical card identifier
- `name` (String, Unique) - Card name
- `type` (Enum) - Card type (Creature, Spell, Artifact, etc.)
- `element` (Enum) - Card element (Fire, Water, Earth, Air, Light, Dark, Chaos, Neutral)
- `rarity` (Enum) - Card rarity (Common, Uncommon, Rare, Mythic)
- `cost` (Integer) - Mana/Azoth cost
- `power`/`toughness` (Integer, Optional) - Combat stats for creatures
- `description` (Text) - Rules text
- `keywords` (Array) - Special abilities
- `isLegal` (Boolean) - Tournament legality
- `metaRating` (Float) - Performance rating
- Timestamps and metadata

## 🛠️ Development

### Backend Development

```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Run tests
npm test
```

### Frontend Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

- Database connection settings
- Redis configuration
- JWT secrets
- API keys for external services

## 🔧 Configuration

### Backend Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=konivrer
DB_PASSWORD=konivrer_dev
DB_DATABASE=konivrer_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 🎮 KONIVRER Game Features

### Card Types

- **Creatures**: Combat units with power/toughness
- **Spells**: One-time effects
- **Artifacts**: Persistent effects
- **Instants**: Quick-response cards

### Elements System

- **Primary Elements**: Fire, Water, Earth, Air
- **Advanced Elements**: Light, Dark, Chaos, Neutral
- **Elemental Interactions**: Strategic combinations

### Tournament Formats

- **Standard**: Current card pool
- **Classic**: Historical cards included
- **Draft**: Limited format
- **Sealed**: Sealed deck format

## 📚 Technical Decisions

### Why NestJS?

- Enterprise-grade architecture with dependency injection
- Built-in support for GraphQL, REST, and microservices
- Excellent TypeScript integration
- Comprehensive testing utilities

### Why React Query?

- Intelligent caching and background refetching
- Optimistic updates and error handling
- Reduced boilerplate for API calls
- DevTools for debugging

### Why PostgreSQL?

- ACID compliance for tournament data integrity
- Advanced querying capabilities
- JSON support for flexible metadata
- Excellent performance with proper indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**KONIVRER Enterprise Platform** - Built for scalability, performance, and the competitive TCG community.
