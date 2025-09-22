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
- `GET /api/matches` - Get all matches (supports query params: `?upcoming=true&teamName=TeamName`)
- `GET /api/matches/:id` - Get a specific match by ID
- `POST /api/matches` - Schedule a new match
- `DELETE /api/matches/:id` - Cancel a scheduled match

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

### Docker

1. **Build the container**:
```bash
docker build -t match-scheduler .
```

2. **Run the container**:
```bash
docker run -p 3000:3000 match-scheduler
```

3. **Access the API at http://localhost:3000/**

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Build Tools**: TypeScript Compiler, ts-node-dev
- **Linting**: ESLint with Prettier

## Data Models

### Match
```typescript
interface Match {
  id: string;              // Format: match-{number}
  homeTeam: string;        // Team name
  awayTeam: string;        // Team name
  homeTeamId: string;      // Shared team ID (team-1 to team-6)
  awayTeamId: string;      // Shared team ID (team-1 to team-6)
  scheduledDate: string;   // ISO 8601 date string
  venue?: string;          // Optional venue information
  status: 'scheduled' | 'cancelled';
}
```

### Shared Team IDs

This service implements the shared team ID standard for consistency across all microservices:

| Team Name | Shared ID |
|-----------|-----------|
| Manchester United | team-1 |
| Liverpool | team-2 |
| Chelsea | team-3 |
| Arsenal | team-4 |
| Manchester City | team-5 |
| Tottenham | team-6 |

## Example Usage

### Schedule a New Match
```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "homeTeam": "Manchester United",
    "awayTeam": "Liverpool",
    "scheduledDate": "2024-12-25T15:00:00Z",
    "venue": "Old Trafford"
  }'
```

### Get All Upcoming Matches
```bash
curl "http://localhost:3000/api/matches?upcoming=true"
```

### Get Matches for a Specific Team
```bash
curl "http://localhost:3000/api/matches?teamName=Manchester United"
```

### Cancel a Match
```bash
curl -X DELETE http://localhost:3000/api/matches/match-1
```

## Architecture

The service follows a clean, modular TypeScript architecture:

```
src/
├── api/
│   ├── index.ts         # Express application entry point
│   └── routes/          # Route handlers
├── models/              # TypeScript interfaces and types
├── services/            # Business logic layer
├── utils/               # Helper functions and utilities
└── middleware/          # Custom Express middleware
```

## Validation Rules

- **Future Dates**: Matches can only be scheduled for future dates
- **Team Conflicts**: A team cannot play against itself
- **Date Format**: Dates must be valid ISO 8601 strings
- **Team Names**: Must match one of the recognized team names

## Development

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Adding New Features
1. Define TypeScript interfaces in `src/models/`
2. Implement business logic in `src/services/`
3. Add route handlers in `src/api/routes/`
4. Update API documentation comments
5. Add validation rules as needed
6. Update this README for significant changes

## Health Monitoring

The service includes a health check endpoint at `/health` that returns:
- Service status
- Current timestamp
- Version information
- Node.js version

Perfect for Kubernetes liveness and readiness probes or load balancer health checks.
