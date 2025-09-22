# Betting Service

A comprehensive Python-based betting service API built with FastAPI. This service provides betting odds and allows users to place bets on various football match outcomes.

## Features

- **Match Odds**: Get betting odds for upcoming matches
- **Multiple Bet Types**: Support for various betting options:
  - Match Winner (Home/Away/Draw)
  - Goals Above 3 (Yes/No)
  - Yellow Cards (Exact count 0-5)
  - Red Cards (Exact count 0-3)
- **Bet Management**: Place and retrieve bets
- **Swagger Documentation**: Interactive API documentation at root URL
- **In-Memory Storage**: Example data with basic storage (no persistence required)

## API Endpoints

### Matches
- `GET /api/matches` - Get all available matches
- `GET /api/matches/{match_id}/odds` - Get all odds for a specific match
- `GET /api/matches/{match_id}/odds/{bet_type}` - Get odds for a specific bet type

### Betting
- `POST /api/bets` - Place a new bet
- `GET /api/bets` - Get all placed bets
- `GET /api/bets/{bet_id}` - Get a specific bet
- `GET /api/matches/{match_id}/bets` - Get all bets for a specific match

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - Redirects to Swagger documentation

## Quick Start

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python main.py
```

3. Access the API:
- Swagger UI: http://localhost:8080/api/docs
- Health Check: http://localhost:8080/api/health

### Docker

1. Build the container:
```bash
docker build -t betting-service .
```

2. Run the container:
```bash
docker run -p 8080:8080 betting-service
```

3. Access the API at http://localhost:8080/api/docs

## API Documentation

The service provides comprehensive API documentation via Swagger/OpenAPI. Visit `/api/docs` to access the interactive documentation where you can:

- View all available endpoints
- See request/response schemas
- Test endpoints directly from the browser
- View example requests and responses

## Data Models

### Core Models
- **Team**: Represents a football team
- **Match**: Represents a football match between two teams
- **BettingOdds**: Represents odds for a specific betting option
- **Bet**: Represents a placed bet with odds and potential winnings

### Bet Types
- `match_winner`: Home win, Away win, or Draw
- `goals_above_3`: Yes/No on whether total goals will exceed 3
- `yellow_cards`: Exact number of yellow cards (0-5)
- `red_cards`: Exact number of red cards (0-3)

## Example Usage

### Get All Matches
```bash
curl http://localhost:8080/api/matches
```

### Get Odds for Match Winner
```bash
curl http://localhost:8080/api/matches/{match_id}/odds/match_winner
```

### Place a Bet
```bash
curl -X POST http://localhost:8080/api/bets \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": "match-id-here",
    "bet_type": "match_winner",
    "option": "home_win",
    "stake": 10.0
  }'
```

## Architecture

The service follows a clean, modular architecture:

```
src/
├── models/          # Pydantic data models
├── services/        # Business logic layer
└── storage/         # In-memory data storage

main.py              # FastAPI application entry point
```

This structure makes it easy to extend with additional betting types, persistence layers, or external integrations in the future.