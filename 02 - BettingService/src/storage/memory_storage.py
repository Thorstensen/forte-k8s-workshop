from typing import List, Optional, Dict
from datetime import datetime, timedelta
from src.models.betting import Team, Match, BettingOdds, Bet, BetType
from src.clients.team_generator_client import team_generator_client, TeamData, MatchData


class InMemoryStorage:
    def __init__(self):
        self.teams: Dict[str, Team] = {}
        self.matches: Dict[str, Match] = {}
        self.odds: Dict[str, List[BettingOdds]] = {}  # match_id -> list of odds
        self.bets: Dict[str, Bet] = {}
        self._teams_cache: Dict[str, TeamData] = {}
        self._last_cache_update = datetime.min
        self._cache_duration = timedelta(minutes=5)
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with data from TeamGenerator service"""
        try:
            # Load teams and matches from TeamGenerator
            self._refresh_teams_cache()
            self._load_matches_from_team_generator()
            
            # Create odds for all matches
            for match in self.matches.values():
                self._create_odds_for_match(match)
                
            print(f"Initialized BettingService with {len(self.teams)} teams and {len(self.matches)} matches")
        except Exception as e:
            print(f"Failed to initialize from TeamGenerator: {e}")
            # Fall back to empty state if TeamGenerator is not available
            
    def _refresh_teams_cache(self):
        """Refresh teams cache from TeamGenerator"""
        try:
            teams_data = team_generator_client.get_all_teams()
            self._teams_cache.clear()
            self.teams.clear()
            
            for team_data in teams_data:
                self._teams_cache[team_data.id] = team_data
                self.teams[team_data.id] = Team(id=team_data.id, name=team_data.name)
                
            self._last_cache_update = datetime.now()
        except Exception as e:
            print(f"Failed to refresh teams cache: {e}")
            raise
            
    def _load_matches_from_team_generator(self):
        """Load matches from TeamGenerator"""
        try:
            matches_data = team_generator_client.get_all_matches()
            self.matches.clear()
            
            for match_data in matches_data:
                # Validate that both teams exist in our cache
                if match_data.home_team_id in self._teams_cache and match_data.away_team_id in self._teams_cache:
                    match = Match(
                        id=match_data.id,
                        home_team_id=match_data.home_team_id,
                        away_team_id=match_data.away_team_id,
                        match_date=match_data.scheduled_date,
                        status="scheduled"  # Map from TeamGenerator status if needed
                    )
                    self.matches[match.id] = match
        except Exception as e:
            print(f"Failed to load matches from TeamGenerator: {e}")
            raise
            
    def _ensure_teams_cache_fresh(self):
        """Ensure teams cache is fresh"""
        if datetime.now() - self._last_cache_update > self._cache_duration:
            self._refresh_teams_cache()

    def _create_odds_for_match(self, match: Match):
        """Create comprehensive odds for a match"""
        match_odds = []
        
        # Get team names for descriptions
        home_team_name = self._teams_cache.get(match.home_team_id, {}).name if match.home_team_id in self._teams_cache else f"Team {match.home_team_id}"
        away_team_name = self._teams_cache.get(match.away_team_id, {}).name if match.away_team_id in self._teams_cache else f"Team {match.away_team_id}"
        
        # Match winner odds
        match_odds.extend([
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.MATCH_WINNER,
                description=f"{home_team_name} to win",
                odds=2.10,
                option="home_win"
            ),
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.MATCH_WINNER,
                description="Draw",
                odds=3.20,
                option="draw"
            ),
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.MATCH_WINNER,
                description=f"{away_team_name} to win",
                odds=3.50,
                option="away_win"
            )
        ])

        # Goals above 3 odds
        match_odds.extend([
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.GOALS_ABOVE_3,
                description="More than 3 goals in match",
                odds=2.75,
                option="yes"
            ),
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.GOALS_ABOVE_3,
                description="3 goals or fewer in match",
                odds=1.45,
                option="no"
            )
        ])

        # Yellow cards odds
        for i in range(6):
            match_odds.append(
                BettingOdds(
                    match_id=match.id,
                    bet_type=BetType.YELLOW_CARDS,
                    description=f"Exactly {i} yellow cards",
                    odds=3.0 + (i * 0.5),
                    option=str(i)
                )
            )

        # Red cards odds
        for i in range(4):
            match_odds.append(
                BettingOdds(
                    match_id=match.id,
                    bet_type=BetType.RED_CARDS,
                    description=f"Exactly {i} red cards",
                    odds=2.0 + (i * 1.5),
                    option=str(i)
                )
            )

        self.odds[match.id] = match_odds

    def get_all_matches(self) -> List[Match]:
        return list(self.matches.values())

    def get_match(self, match_id: str) -> Optional[Match]:
        return self.matches.get(match_id)
    
    def get_team(self, team_id: str) -> Optional[Team]:
        """Get team by ID, refresh cache if needed"""
        self._ensure_teams_cache_fresh()
        return self.teams.get(team_id)
    
    def get_all_teams(self) -> List[Team]:
        """Get all teams, refresh cache if needed"""
        self._ensure_teams_cache_fresh()
        return list(self.teams.values())
    
    def get_team_name(self, team_id: str) -> str:
        """Get team name by ID"""
        team_data = self._teams_cache.get(team_id)
        return team_data.name if team_data else f"Team {team_id}"

    def get_odds_for_match(self, match_id: str) -> List[BettingOdds]:
        return self.odds.get(match_id, [])

    def get_odds_by_type(self, match_id: str, bet_type: BetType) -> List[BettingOdds]:
        all_odds = self.get_odds_for_match(match_id)
        return [odds for odds in all_odds if odds.bet_type == bet_type]

    def get_specific_odds(self, match_id: str, bet_type: BetType, option: str) -> Optional[BettingOdds]:
        odds_list = self.get_odds_by_type(match_id, bet_type)
        for odds in odds_list:
            if odds.option == option:
                return odds
        return None

    def place_bet(self, bet: Bet) -> Bet:
        self.bets[bet.id] = bet
        return bet

    def get_bet(self, bet_id: str) -> Optional[Bet]:
        return self.bets.get(bet_id)

    def get_all_bets(self) -> List[Bet]:
        return list(self.bets.values())

    def get_bets_for_match(self, match_id: str) -> List[Bet]:
        return [bet for bet in self.bets.values() if bet.match_id == match_id]


# Global storage instance
storage = InMemoryStorage()