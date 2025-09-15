# Match Scheduler Service

A comprehensive TypeScript/Express API service for scheduling football matches between teams. This service provides match scheduling capabilities with robust validation, conflict detection, and team management.

## Features

- **Match Scheduling**: Schedule matches between teams with validation
- **Conflict Detection**: Prevents scheduling conflicts and self-matches  
- **Team Management**: Manage teams and player rosters
- **Match Management**: List, retrieve, and cancel matches
- **Strict Validation**: Business rule enforcement (future dates, active teams, player counts)
- **TypeScript**: Full type safety with strict configuration
- **Production Ready**: Includes security, rate limiting, and monitoring

## API Endpoints

### Matches
- `GET /api/matches` - Get all matches (supports `?upcoming=true` and `?teamId=<id>` filters)
- `GET /api/matches/:id` - Get a specific match by ID
- `POST /api/matches` - Schedule a new match
- `DELETE /api/matches/:id` - Cancel a scheduled match

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team by ID

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
- Matches: http://localhost:3000/api/matches
