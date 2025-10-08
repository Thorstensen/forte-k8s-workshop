# Match Event Logger Service

A simple Python-based logging service for match events with persistent storage support. This service demonstrates Kubernetes PersistentVolume and PersistentVolumeClaim usage.

## Features

- **Event Logging**: Log match events, bets, schedule changes, and other system events
- **Persistent Storage**: Uses PersistentVolume to store logs across pod restarts
- **Daily Log Files**: Events are stored in daily JSONL files for easy analysis
- **Query API**: Retrieve historical logs by date or event type
- **Statistics**: Get event counts and statistics

## Purpose in Workshop

This service demonstrates:
- ✅ **PersistentVolumeClaim**: Mounting persistent storage to pods
- ✅ **Volume Lifecycle**: Data persists across pod restarts
- ✅ **File-based Storage**: Simple file I/O with persistent volumes
- ✅ **Read/Write Operations**: Both writing logs and reading them back

## API Endpoints

### Events
- `POST /api/events` - Log a new event
- `GET /api/events` - Get events (optionally filtered by date and type)
- `GET /api/events/dates` - List available log dates
- `GET /api/events/stats` - Get event statistics

### Utility
- `GET /api/health` - Health check (includes volume mount status)
- `GET /` - Redirects to Swagger documentation
- `GET /api/docs` - Interactive API documentation

## Event Types

Common event types:
- `match_scheduled` - New match scheduled
- `match_started` - Match started
- `match_ended` - Match completed
- `bet_placed` - New bet placed
- `team_created` - New team created
- `notification_sent` - Notification delivered

## Quick Start

### Local Development

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run the application**:
```bash
python main.py
```

3. **Access the API**:
- Swagger UI: http://localhost:8080/api/docs
- Health Check: http://localhost:8080/api/health

### Docker

1. **Build the container**:
```bash
docker build -t match-event-logger .
```

2. **Run with volume**:
```bash
docker run -p 8080:8080 -v $(pwd)/logs:/var/log/match-events match-event-logger
```

## Kubernetes Deployment

### Prerequisites

Create a PersistentVolumeClaim:
```bash
kubectl apply -f ../../k8s-manifests/volumes/match-logs-pvc.yaml
```

### Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: match-event-logger
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: logger
        image: ghcr.io/thorstensen/forte-k8s-workshop/match-event-logger:latest
        volumeMounts:
        - name: logs
          mountPath: /var/log/match-events
      volumes:
      - name: logs
        persistentVolumeClaim:
          claimName: match-logs-pvc
```

## Log File Format

Events are stored as JSONL (JSON Lines) in daily files:

**File naming**: `/var/log/match-events/events-YYYY-MM-DD.jsonl`

**Example entry**:
```json
{
  "id": "20240115143022-match_scheduled",
  "event_type": "match_scheduled",
  "match_id": "match-1",
  "team_home": "Manchester United",
  "team_away": "Liverpool",
  "timestamp": "2024-01-15T14:30:22.123456",
  "details": {
    "venue": "Old Trafford",
    "scheduled_date": "2024-01-20T15:00:00"
  }
}
```

## Example Usage

### Log an Event

```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "match_scheduled",
    "match_id": "match-1",
    "team_home": "Manchester United",
    "team_away": "Liverpool",
    "details": {
      "venue": "Old Trafford",
      "scheduled_date": "2024-01-20T15:00:00"
    }
  }'
```

### Retrieve Events

```bash
# Get today's events
curl http://localhost:8080/api/events

# Get events for a specific date
curl http://localhost:8080/api/events?date=2024-01-15

# Get only match_scheduled events
curl http://localhost:8080/api/events?event_type=match_scheduled
```

### Get Statistics

```bash
curl http://localhost:8080/api/events/stats
```

## Configuration

Environment variables:
- `LOG_DIR` - Directory for log files (default: `/var/log/match-events`)
- `PORT` - Server port (default: `8080`)

## Workshop Use Case

In the workshop, participants will:

1. Create a PersistentVolumeClaim for log storage
2. Deploy the Match Event Logger with the volume mounted
3. Log events from other services (matches, bets, etc.)
4. Verify data persistence by:
   - Logging some events
   - Deleting the pod
   - Checking that logs are still available after pod restart
5. Query historical logs via the API

This demonstrates the key Kubernetes concept that **volumes persist data beyond the pod lifecycle**.
