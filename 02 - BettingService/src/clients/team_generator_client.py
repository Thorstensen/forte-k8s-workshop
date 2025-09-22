import requests
from typing import List, Optional, Dict, Any
import os
from dataclasses import dataclass
from datetime import datetime

@dataclass
class TeamData:
    id: str
    name: str

@dataclass
class PlayerData:
    id: str
    name: str
    position: str
    skill_level: int

@dataclass
class MatchData:
    id: str
    home_team_id: str
    away_team_id: str
    scheduled_date: datetime
    venue: str
    status: str
    created_at: datetime
    notes: Optional[str] = None

class TeamGeneratorClient:
    """Client for communicating with the TeamGenerator service"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv('TEAM_GENERATOR_URL', 'http://localhost:5252')
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.timeout = 5
    
    def get_all_teams(self) -> List[TeamData]:
        """Get all teams from TeamGenerator"""
        try:
            response = self.session.get(f"{self.base_url}/api/TeamsData", timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            return [TeamData(id=team['id'], name=team['name']) for team in data]
        except requests.RequestException as e:
            print(f"Failed to fetch teams from TeamGenerator: {e}")
            raise Exception("Unable to fetch teams from TeamGenerator service")
    
    def get_team_by_id(self, team_id: str) -> Optional[TeamData]:
        """Get a specific team by ID"""
        try:
            response = self.session.get(f"{self.base_url}/api/TeamsData/{team_id}", timeout=self.timeout)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            data = response.json()
            return TeamData(id=data['id'], name=data['name'])
        except requests.RequestException as e:
            print(f"Failed to fetch team {team_id} from TeamGenerator: {e}")
            raise Exception(f"Unable to fetch team {team_id} from TeamGenerator service")
    
    def get_all_matches(self) -> List[MatchData]:
        """Get all matches from TeamGenerator"""
        try:
            response = self.session.get(f"{self.base_url}/api/Matches", timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            matches = []
            for match in data:
                matches.append(MatchData(
                    id=match['id'],
                    home_team_id=match['homeTeamId'],
                    away_team_id=match['awayTeamId'],
                    scheduled_date=datetime.fromisoformat(match['scheduledDate'].replace('Z', '+00:00')),
                    venue=match['venue'],
                    status=match['status'],
                    created_at=datetime.fromisoformat(match['createdAt'].replace('Z', '+00:00')),
                    notes=match.get('notes')
                ))
            return matches
        except requests.RequestException as e:
            print(f"Failed to fetch matches from TeamGenerator: {e}")
            raise Exception("Unable to fetch matches from TeamGenerator service")
    
    def get_match_by_id(self, match_id: str) -> Optional[MatchData]:
        """Get a specific match by ID"""
        try:
            response = self.session.get(f"{self.base_url}/api/Matches/{match_id}", timeout=self.timeout)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            data = response.json()
            return MatchData(
                id=data['id'],
                home_team_id=data['homeTeamId'],
                away_team_id=data['awayTeamId'],
                scheduled_date=datetime.fromisoformat(data['scheduledDate'].replace('Z', '+00:00')),
                venue=data['venue'],
                status=data['status'],
                created_at=datetime.fromisoformat(data['createdAt'].replace('Z', '+00:00')),
                notes=data.get('notes')
            )
        except requests.RequestException as e:
            print(f"Failed to fetch match {match_id} from TeamGenerator: {e}")
            raise Exception(f"Unable to fetch match {match_id} from TeamGenerator service")

# Singleton instance
team_generator_client = TeamGeneratorClient()