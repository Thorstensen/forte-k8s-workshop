from typing import List, Optional, Dict
from datetime import datetime, timedelta
from src.models.betting import Team, Match, BettingOdds, Bet, BetType


class InMemoryStorage:
    def __init__(self):
        self.teams: Dict[str, Team] = {}
        self.matches: Dict[str, Match] = {}
        self.odds: Dict[str, List[BettingOdds]] = {}  # match_id -> list of odds
        self.bets: Dict[str, Bet] = {}
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with sample teams, matches, and odds"""
        # Create sample teams
        team1 = Team(name="Manchester United")
        team2 = Team(name="Liverpool")
        team3 = Team(name="Arsenal")
        team4 = Team(name="Chelsea")
        
        self.teams[team1.id] = team1
        self.teams[team2.id] = team2
        self.teams[team3.id] = team3
        self.teams[team4.id] = team4

        # Create sample matches
        match1 = Match(
            home_team=team1,
            away_team=team2,
            match_date=datetime.utcnow() + timedelta(days=1),
            status="scheduled"
        )
        
        match2 = Match(
            home_team=team3,
            away_team=team4,
            match_date=datetime.utcnow() + timedelta(days=2),
            status="scheduled"
        )

        self.matches[match1.id] = match1
        self.matches[match2.id] = match2

        # Create sample odds
        self._create_odds_for_match(match1)
        self._create_odds_for_match(match2)

    def _create_odds_for_match(self, match: Match):
        """Create comprehensive odds for a match"""
        match_odds = []
        
        # Match winner odds
        match_odds.extend([
            BettingOdds(
                match_id=match.id,
                bet_type=BetType.MATCH_WINNER,
                description=f"{match.home_team.name} to win",
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
                description=f"{match.away_team.name} to win",
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