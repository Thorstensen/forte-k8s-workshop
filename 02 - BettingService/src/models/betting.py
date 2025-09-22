from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum
import uuid


class BetType(str, Enum):
    MATCH_WINNER = "match_winner"
    GOALS_ABOVE_3 = "goals_above_3"
    YELLOW_CARDS = "yellow_cards"
    RED_CARDS = "red_cards"


class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    

class Match(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    home_team_id: str  # Changed from home_team: Team to team ID reference
    away_team_id: str  # Changed from away_team: Team to team ID reference
    match_date: datetime
    status: Literal["scheduled", "live", "finished"] = "scheduled"


class BettingOdds(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    match_id: str
    bet_type: BetType
    description: str
    odds: float = Field(gt=0, description="Decimal odds (e.g., 2.50)")
    option: str  # e.g., "home_win", "away_win", "draw", "yes", "no", "0", "1", "2", etc.


class PlaceBetRequest(BaseModel):
    match_id: str
    bet_type: BetType
    option: str
    stake: float = Field(gt=0, description="Amount to bet")


class Bet(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    match_id: str
    bet_type: BetType
    option: str
    stake: float
    odds: float
    potential_win: float
    placed_at: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["active", "won", "lost", "void"] = "active"


class BettingOddsResponse(BaseModel):
    match: Match
    odds: List[BettingOdds]


class BetResponse(BaseModel):
    success: bool
    bet: Optional[Bet] = None
    message: str