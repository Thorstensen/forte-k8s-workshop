# Soccer Stats Aggregator Service

A comprehensive Rust-based soccer statistics API built with Axum and OpenAPI documentation. This service generates realistic random soccer match statistics including team information, match results, venue details, and comprehensive statistics for both teams.

## Features

- **Random Match Statistics**: Generates realistic soccer match statistics on each API call
- **Comprehensive Data**: Includes team info, venue details, match results, and detailed team statistics
- **OpenAPI Documentation**: Interactive Swagger UI for API exploration and testing
- **Health Monitoring**: Built-in health check endpoint
- **Containerized**: Docker support for easy deployment
- **CORS Enabled**: Cross-origin resource sharing support

## Generated Statistics Include

### Match Metadata
- Teams (name, country, short name)
- Venue information (name, city, capacity)
- Match date and time
- Final score and attendance
- Referee and weather conditions

### Team Statistics
- Possession percentage
- Shots (total, on target, off target, blocked)
- Expected Goals (xG) and Expected Assists (xA)
- Passing statistics (completed, attempted, accuracy)
- Defensive actions (tackles, interceptions, clearances)
- Disciplinary (yellow cards, red cards, fouls)
- Physical metrics (distance covered, sprints)
- Set pieces (corners, crosses)
- Duels (won, total, aerial duels)

## API Endpoints

### Statistics
- `GET /api/match/stats` - Get randomly generated match statistics

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - Redirects to Swagger UI documentation
- `GET /api/docs` - Interactive API documentation

## Quick Start

### Prerequisites
- Rust 1.89+ (for local development)
- Docker (for containerized deployment)

### Local Development

1. Install dependencies and run:
```bash
cargo run
```

2. Access the API:
- Swagger UI: http://localhost:8080/api/docs
- Health Check: http://localhost:8080/api/health
- Match Stats: http://localhost:8080/api/match/stats

### Docker Deployment

1. Build the Rust binary first:
```bash
cargo build --release
```

2. Build the container:
```bash
docker build -t soccer-stats-aggregator .
```

3. Run the container:
```bash
docker run -p 8080:8080 soccer-stats-aggregator
```

4. Access the API at http://localhost:8080/api/docs

## API Documentation

The service provides comprehensive OpenAPI documentation via Swagger UI. Visit `/api/docs` to access the interactive documentation where you can:

- View all available endpoints
- See detailed request/response schemas
- Test endpoints directly from the browser
- View example requests and responses

## Example Response

```json
{
  "match_id": "550e8400-e29b-41d4-a716-446655440000",
  "home_team": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Manchester United",
    "short_name": "MUN",
    "country": "England"
  },
  "away_team": {
    "id": "456e7890-e12b-34d5-a678-426614174111",
    "name": "Liverpool",
    "short_name": "LIV",
    "country": "England"
  },
  "venue": {
    "name": "Old Trafford",
    "city": "Manchester",
    "country": "England",
    "capacity": 74879
  },
  "match_date": "2024-01-15T15:00:00Z",
  "result": {
    "home_score": 2,
    "away_score": 1
  },
  "home_team_stats": {
    "possession_percentage": 58.3,
    "total_shots": 14,
    "shots_on_target": 6,
    "expected_goals": 2.4,
    "passes_completed": 524,
    "passes_attempted": 631,
    "pass_accuracy": 83.0,
    "yellow_cards": 2,
    "red_cards": 0
  }
}
```

## Architecture

The service follows a clean, modular Rust architecture:

```
src/
├── models.rs         # Data structures and schemas
├── generator.rs      # Random statistics generation logic  
├── handlers.rs       # HTTP request handlers
└── main.rs          # Application entry point and routing
```

## Health Monitoring

The service includes a health check endpoint at `/health` that returns:
- Service status
- Current timestamp
- Service version

This endpoint can be used for container health checks and monitoring systems.

## Development

### Building
```bash
cargo build
```

### Running Tests
```bash
cargo test
```

### Running in Development Mode
```bash
cargo run
```

The service will start on `http://localhost:8080` with hot reloading enabled during development.