# NotificationCenter

A comprehensive Go-based notification service API for soccer match events. This service provides push notification data about soccer matches with full OpenAPI/Swagger documentation.

## Features

- **Match Notifications**: Various types of soccer match events
  - Match start/end notifications
  - Goal notifications with player details and score updates
  - Yellow and red card notifications
  - Substitution notifications
  - Penalty notifications
- **RESTful API**: Clean REST endpoints with proper HTTP status codes
- **OpenAPI 3.0**: Comprehensive API documentation with Swagger UI
- **Filtering**: Filter notifications by match, type, priority, or importance
- **Health Check**: Service health monitoring endpoint
- **Dockerized**: Ready for containerized deployment
- **In-Memory Storage**: Fast access to notification data (no persistence required)

## API Endpoints

### Health
- `GET /health` - Health check endpoint

### Matches
- `GET /matches` - Get all available matches
- `GET /matches/{id}` - Get a specific match by ID
- `GET /matches/{id}/notifications` - Get all notifications for a specific match

### Notifications
- `GET /notifications` - Get all notifications (with optional filtering)
- `GET /notifications/{id}` - Get a specific notification by ID
- `GET /notifications/important` - Get only important notifications (goals, red cards, penalties)

### Query Parameters
- `match_id` - Filter notifications by match ID
- `type` - Filter by notification type (goal, yellow_card, red_card, substitution, match_start, match_end, penalty)
- `priority` - Filter by priority (low, medium, high, critical)
- `limit` - Limit number of results (default: 50 for notifications, 20 for important)

## Notification Types

### Match Events
- **match_start**: Match kick-off notifications
- **match_end**: Full-time result notifications
- **goal**: Goal scored with player, minute, and updated score
- **penalty**: Penalty awarded notifications
- **yellow_card**: Yellow card disciplinary actions
- **red_card**: Red card dismissals
- **substitution**: Player substitutions

### Priority Levels
- **critical**: Critical match events (red cards, important goals)
- **high**: Important events (goals, match start/end)
- **medium**: Notable events (yellow cards, substitutions)
- **low**: Minor updates and information

## Quick Start

### Local Development

1. **Prerequisites**:
   ```bash
   # Ensure Go 1.24+ is installed
   go version
   ```

2. **Clone and setup**:
   ```bash
   cd "05 - NotificationCenter"
   go mod download
   ```

3. **Generate Swagger docs** (if not already generated):
   ```bash
   go run github.com/swaggo/swag/cmd/swag init
   ```

4. **Run the application**:
   ```bash
   go run main.go
   ```

5. **Access the API**:
   - Swagger UI: http://localhost:8080/swagger/index.html
   - Health Check: http://localhost:8080/health
   - API Root: http://localhost:8080/ (redirects to Swagger)

### Docker

1. **Build the container**:
   ```bash
   docker build -t notification-center .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 notification-center
   ```

3. **Access the API at**: http://localhost:8080/

> **Note**: The Dockerfile uses a multi-stage build that compiles the Go application inside the container, so you don't need to build the binary locally.

## API Documentation

The service provides comprehensive API documentation via Swagger/OpenAPI. Visit the root URL (`/`) or `/swagger/index.html` to access the interactive documentation where you can:

- View all available endpoints and their parameters
- See detailed request/response schemas with examples
- Test endpoints directly from the browser
- Download the OpenAPI specification

## Sample Data

The service includes realistic sample data:

### Teams
- Manchester United, Liverpool, Chelsea, Arsenal, Manchester City, Tottenham

### Matches
- Live and scheduled matches between the sample teams
- Realistic match times and statuses

### Notifications
- Dynamically generated match events with realistic timing
- Player names from actual Premier League squads
- Varied notification types and priorities
- Authentic soccer match progression

## Example Usage

### Get All Notifications
```bash
curl http://localhost:8080/notifications
```

### Get Goal Notifications Only
```bash
curl "http://localhost:8080/notifications?type=goal"
```

### Get Notifications for a Specific Match
```bash
curl http://localhost:8080/matches/match-1/notifications
```

### Get Important Notifications
```bash
curl http://localhost:8080/notifications/important
```

### Get High Priority Notifications (Limited)
```bash
curl "http://localhost:8080/notifications?priority=high&limit=10"
```

## Response Examples

### Goal Notification
```json
{
  "id": "notif-1-2",
  "match_id": "match-1",
  "type": "goal",
  "title": "⚽ GOAL! Manchester United 1-0 Liverpool",
  "message": "Bruno Fernandes scores in the 25 minute!",
  "timestamp": "2024-01-15T15:25:00Z",
  "priority": "high",
  "player_name": "Bruno Fernandes",
  "minute": 25,
  "home_score": 1,
  "away_score": 0,
  "is_important": true
}
```

### Match Start Notification
```json
{
  "id": "notif-1-start",
  "match_id": "match-1",
  "type": "match_start",
  "title": "⚽ KICK OFF: Manchester United vs Liverpool",
  "message": "The match between Manchester United and Liverpool has started!",
  "timestamp": "2024-01-15T15:00:00Z",
  "priority": "high",
  "is_important": true
}
```

## Architecture

The service follows a clean, simple architecture suitable for microservices:

```
.
├── main.go              # Main application with all handlers and logic
├── go.mod              # Go module dependencies
├── go.sum              # Dependency checksums
├── Dockerfile          # Multi-stage Docker build
├── docs/               # Generated Swagger documentation
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
└── README.md           # This documentation
```

## Development

### Adding New Notification Types
1. Add the new type to the `notificationTypes` slice in `generateSampleNotifications()`
2. Add a case in the switch statement to handle the new type
3. Update the API documentation comments if needed
4. Regenerate Swagger docs: `go run github.com/swaggo/swag/cmd/swag init`

### Extending the API
- Follow the existing pattern for new endpoints
- Add appropriate Swagger annotations
- Maintain consistent error handling and response formats
- Update this README with new endpoint documentation

## Health Monitoring

The service includes a health check endpoint at `/health` that returns:
- Service status
- Version information  
- Current timestamp

Perfect for Kubernetes liveness and readiness probes or load balancer health checks.