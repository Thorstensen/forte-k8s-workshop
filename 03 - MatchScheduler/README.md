# Match Scheduler Service

A TypeScript/Express API service for scheduling football matches between teams. This service provides match scheduling capabilities with conflict detection and validation.

## Features

- **Match Scheduling**: Schedule matches between teams with validation
- **Conflict Detection**: Prevents scheduling conflicts and self-matches  
- **Match Management**: List, retrieve, and cancel matches
- **Strict Validation**: Business rule enforcement (future dates, unique teams)
- **TypeScript**: Full type safety with strict configuration
- **Production Ready**: Includes security, rate limiting, and monitoring

## API Endpoints

### Matches
- `POST /api/matches/list` - Get all matches (body: `{ upcoming?: boolean, teamId?: string }`)
- `POST /api/matches/details` - Get a specific match by ID (body: `{ id: string }`)
- `POST /api/matches` - Schedule a new match
- `POST /api/matches/cancel` - Cancel a scheduled match (body: `{ id: string }`)

### Utility
- `GET /health` - Health check endpoint
- `GET /` - API documentation and service information

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Access the API:
- API Documentation: http://localhost:3000/
- Health Check: http://localhost:3000/health
- Schedule Match: http://localhost:3000/api/matches (POST)
