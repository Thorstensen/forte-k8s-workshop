from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import List, Optional
import uvicorn

from src.models.betting import (
    Match, BettingOdds, Bet, BetType, PlaceBetRequest,
    BettingOddsResponse, BetResponse
)
from src.services.betting_service import betting_service

# Create FastAPI app with metadata for automatic documentation
app = FastAPI(
    title="Betting Service API",
    description="""
    A comprehensive betting service API for football matches.
    
    ## Features
    
    * **Match Odds**: Get betting odds for upcoming matches
    * **Place Bets**: Place bets on various outcomes
    * **Bet Management**: Retrieve and manage placed bets
    
    ## Betting Types Supported
    
    * **Match Winner**: Home win, Away win, Draw
    * **Goals Above 3**: Yes/No betting on total goals exceeding 3
    * **Yellow Cards**: Bet on exact number of yellow cards (0-5)
    * **Red Cards**: Bet on exact number of red cards (0-3)
    
    This API provides Swagger documentation at /api/docs for easy testing and exploration.
    """,
    version="1.0.0",
    contact={
        "name": "Betting Service Team",
        "email": "betting@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)


@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    """Redirect root URL to Swagger documentation"""
    return RedirectResponse(url="/api/docs")


@app.get("/api/health", tags=["Health Check"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "betting-service"}


# Match Endpoints
@app.get("/api/matches", response_model=List[Match], tags=["Matches"])
async def get_matches():
    """
    Get all available matches for betting.
    
    Returns a list of all scheduled and live matches.
    """
    return betting_service.get_all_matches()


@app.get("/api/matches/{match_id}/odds", response_model=BettingOddsResponse, tags=["Odds"])
async def get_match_odds(match_id: str):
    """
    Get all betting odds for a specific match.
    
    - **match_id**: The unique identifier of the match
    """
    odds_response = betting_service.get_match_odds(match_id)
    if not odds_response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found"
        )
    return odds_response


@app.get("/api/matches/{match_id}/odds/{bet_type}", response_model=List[BettingOdds], tags=["Odds"])
async def get_odds_by_type(match_id: str, bet_type: BetType):
    """
    Get betting odds for a specific bet type on a match.
    
    - **match_id**: The unique identifier of the match
    - **bet_type**: The type of bet (match_winner, goals_above_3, yellow_cards, red_cards)
    """
    # First check if match exists
    match_odds = betting_service.get_match_odds(match_id)
    if not match_odds:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found"
        )
    
    odds = betting_service.get_odds_by_type(match_id, bet_type)
    return odds


# Betting Endpoints
@app.post("/api/bets", response_model=BetResponse, tags=["Bets"])
async def place_bet(bet_request: PlaceBetRequest):
    """
    Place a new bet on a match.
    
    - **match_id**: The unique identifier of the match
    - **bet_type**: The type of bet (match_winner, goals_above_3, yellow_cards, red_cards)
    - **option**: The specific option to bet on (e.g., "home_win", "yes", "2")
    - **stake**: The amount of money to bet (must be positive)
    
    Returns the placed bet with calculated potential winnings.
    """
    bet_response = betting_service.place_bet(bet_request)
    
    if not bet_response.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=bet_response.message
        )
    
    return bet_response


@app.get("/api/bets", response_model=List[Bet], tags=["Bets"])
async def get_all_bets():
    """
    Get all placed bets.
    
    Returns a list of all bets that have been placed in the system.
    """
    return betting_service.get_all_bets()


@app.get("/api/bets/{bet_id}", response_model=Bet, tags=["Bets"])
async def get_bet(bet_id: str):
    """
    Get a specific bet by its ID.
    
    - **bet_id**: The unique identifier of the bet
    """
    bet = betting_service.get_bet(bet_id)
    if not bet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bet with ID {bet_id} not found"
        )
    return bet


@app.get("/api/matches/{match_id}/bets", response_model=List[Bet], tags=["Bets"])
async def get_bets_for_match(match_id: str):
    """
    Get all bets placed on a specific match.
    
    - **match_id**: The unique identifier of the match
    """
    # First check if match exists
    match_odds = betting_service.get_match_odds(match_id)
    if not match_odds:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found"
        )
    
    return betting_service.get_bets_for_match(match_id)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)