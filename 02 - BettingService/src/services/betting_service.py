from typing import List, Optional
from src.models.betting import (
    Match, BettingOdds, Bet, BetType, PlaceBetRequest, 
    BettingOddsResponse, BetResponse
)
from src.storage.memory_storage import storage


class BettingService:
    def __init__(self):
        self.storage = storage

    def get_all_matches(self) -> List[Match]:
        """Get all available matches"""
        return self.storage.get_all_matches()

    def get_match_odds(self, match_id: str) -> Optional[BettingOddsResponse]:
        """Get all odds for a specific match"""
        match = self.storage.get_match(match_id)
        if not match:
            return None
        
        odds = self.storage.get_odds_for_match(match_id)
        return BettingOddsResponse(match=match, odds=odds)

    def get_odds_by_type(self, match_id: str, bet_type: BetType) -> List[BettingOdds]:
        """Get odds for a specific bet type on a match"""
        return self.storage.get_odds_by_type(match_id, bet_type)

    def place_bet(self, bet_request: PlaceBetRequest) -> BetResponse:
        """Place a new bet"""
        # Validate match exists
        match = self.storage.get_match(bet_request.match_id)
        if not match:
            return BetResponse(
                success=False,
                message=f"Match with ID {bet_request.match_id} not found"
            )

        # Validate odds exist for this bet
        odds = self.storage.get_specific_odds(
            bet_request.match_id, 
            bet_request.bet_type, 
            bet_request.option
        )
        if not odds:
            return BetResponse(
                success=False,
                message=f"No odds available for {bet_request.bet_type.value} with option '{bet_request.option}'"
            )

        # Create the bet
        potential_win = bet_request.stake * odds.odds
        bet = Bet(
            match_id=bet_request.match_id,
            bet_type=bet_request.bet_type,
            option=bet_request.option,
            stake=bet_request.stake,
            odds=odds.odds,
            potential_win=potential_win
        )

        # Store the bet
        stored_bet = self.storage.place_bet(bet)
        
        return BetResponse(
            success=True,
            bet=stored_bet,
            message="Bet placed successfully"
        )

    def get_bet(self, bet_id: str) -> Optional[Bet]:
        """Get a specific bet by ID"""
        return self.storage.get_bet(bet_id)

    def get_all_bets(self) -> List[Bet]:
        """Get all placed bets"""
        return self.storage.get_all_bets()

    def get_bets_for_match(self, match_id: str) -> List[Bet]:
        """Get all bets for a specific match"""
        return self.storage.get_bets_for_match(match_id)


# Global service instance
betting_service = BettingService()