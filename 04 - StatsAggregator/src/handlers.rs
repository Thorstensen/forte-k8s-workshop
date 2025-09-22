use axum::{Json, response::Json as ResponseJson};
use crate::models::{MatchStatistics, HealthResponse};
use crate::generator::StatsGenerator;
use chrono::Utc;

/// Get random match statistics
///
/// Generates and returns random soccer match statistics including team information,
/// match details, venue information, and comprehensive statistics for both teams.
/// Each call returns different randomized data.
#[utoipa::path(
    get,
    path = "/api/match/stats",
    responses(
        (status = 200, description = "Random match statistics generated successfully", body = MatchStatistics),
        (status = 500, description = "Internal server error")
    ),
    tag = "Statistics"
)]
pub async fn get_match_stats() -> ResponseJson<MatchStatistics> {
    let stats = StatsGenerator::generate_random_match_stats();
    Json(stats)
}

/// Health check endpoint
///
/// Returns the health status of the service along with timestamp and version information.
#[utoipa::path(
    get,
    path = "/api/health",
    responses(
        (status = 200, description = "Service is healthy", body = HealthResponse)
    ),
    tag = "Health"
)]
pub async fn health_check() -> ResponseJson<HealthResponse> {
    let response = HealthResponse {
        status: "healthy".to_string(),
        timestamp: Utc::now(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    };
    Json(response)
}