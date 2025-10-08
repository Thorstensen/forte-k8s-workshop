from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
import json
import os
from pathlib import Path

# Create FastAPI app
app = FastAPI(
    title="Match Event Logger API",
    description="""
    A simple logging service for match events with persistent storage.

    ## Features

    * **Event Logging**: Log match events, bets, and schedule changes
    * **Persistent Storage**: Uses PersistentVolume for data persistence
    * **Query Logs**: Retrieve historical logs by date or event type

    Demonstrates Kubernetes PersistentVolumeClaim usage.
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configuration
LOG_DIR = os.getenv("LOG_DIR", "/var/log/match-events")
Path(LOG_DIR).mkdir(parents=True, exist_ok=True)


# Models
class MatchEvent(BaseModel):
    event_type: str  # match_scheduled, match_started, match_ended, bet_placed, etc.
    match_id: Optional[str] = None
    team_home: Optional[str] = None
    team_away: Optional[str] = None
    details: dict = {}
    timestamp: Optional[datetime] = None


class LogEntry(BaseModel):
    id: str
    event_type: str
    match_id: Optional[str]
    timestamp: str
    details: dict


# Helper functions
def get_log_file_path(date: str = None) -> Path:
    """Get log file path for a given date (YYYY-MM-DD)"""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    return Path(LOG_DIR) / f"events-{date}.jsonl"


def append_event_to_log(event: MatchEvent) -> str:
    """Append event to daily log file and return event ID"""
    if event.timestamp is None:
        event.timestamp = datetime.now()

    event_id = f"{event.timestamp.strftime('%Y%m%d%H%M%S')}-{event.event_type}"
    log_entry = {
        "id": event_id,
        "event_type": event.event_type,
        "match_id": event.match_id,
        "team_home": event.team_home,
        "team_away": event.team_away,
        "timestamp": event.timestamp.isoformat(),
        "details": event.details,
    }

    log_file = get_log_file_path()
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

    return event_id


def read_logs(date: str = None, event_type: str = None) -> List[LogEntry]:
    """Read logs from file, optionally filtered by event type"""
    log_file = get_log_file_path(date)

    if not log_file.exists():
        return []

    logs = []
    with open(log_file, "r") as f:
        for line in f:
            if line.strip():
                entry = json.loads(line)
                if event_type is None or entry["event_type"] == event_type:
                    logs.append(LogEntry(**entry))

    return logs


# API Endpoints
@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    """Redirect root URL to Swagger documentation"""
    return RedirectResponse(url="/api/docs")


@app.get("/api/health", tags=["Health Check"])
async def health_check():
    """Health check endpoint"""
    log_dir_exists = Path(LOG_DIR).exists()
    log_dir_writable = os.access(LOG_DIR, os.W_OK)

    return {
        "status": "healthy",
        "service": "match-event-logger",
        "log_directory": LOG_DIR,
        "log_dir_exists": log_dir_exists,
        "log_dir_writable": log_dir_writable,
    }


@app.post("/api/events", tags=["Events"], status_code=status.HTTP_201_CREATED)
async def log_event(event: MatchEvent):
    """
    Log a new match event to persistent storage.

    Event types: match_scheduled, match_started, match_ended,
                 bet_placed, team_created, notification_sent
    """
    try:
        event_id = append_event_to_log(event)
        return {
            "success": True,
            "message": "Event logged successfully",
            "event_id": event_id,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log event: {str(e)}"
        )


@app.get("/api/events", response_model=List[LogEntry], tags=["Events"])
async def get_events(
    date: Optional[str] = None,
    event_type: Optional[str] = None
):
    """
    Retrieve logged events.

    - **date**: Filter by date (YYYY-MM-DD format). Defaults to today.
    - **event_type**: Filter by event type (optional)
    """
    try:
        logs = read_logs(date=date, event_type=event_type)
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read logs: {str(e)}"
        )


@app.get("/api/events/dates", tags=["Events"])
async def get_available_dates():
    """Get list of dates with available log files"""
    log_files = list(Path(LOG_DIR).glob("events-*.jsonl"))
    dates = []
    for log_file in sorted(log_files):
        # Extract date from filename: events-YYYY-MM-DD.jsonl
        date_str = log_file.stem.replace("events-", "")
        dates.append(date_str)

    return {
        "success": True,
        "dates": dates,
        "count": len(dates),
    }


@app.get("/api/events/stats", tags=["Events"])
async def get_event_stats(date: Optional[str] = None):
    """Get statistics about logged events"""
    logs = read_logs(date=date)

    event_counts = {}
    for log in logs:
        event_counts[log.event_type] = event_counts.get(log.event_type, 0) + 1

    return {
        "success": True,
        "date": date or datetime.now().strftime("%Y-%m-%d"),
        "total_events": len(logs),
        "event_counts": event_counts,
    }


if __name__ == "__main__":
    print(f"Match Event Logger starting...")
    print(f"Log directory: {LOG_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=8080)
