use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Team {
    pub id: Uuid,
    pub name: String,
    pub short_name: String,
    pub country: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Venue {
    pub name: String,
    pub city: String,
    pub country: String,
    pub capacity: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MatchResult {
    pub home_score: u8,
    pub away_score: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PlayerStats {
    pub goals: u8,
    pub assists: u8,
    pub yellow_cards: u8,
    pub red_cards: u8,
    pub shots: u8,
    pub shots_on_target: u8,
    pub passes_completed: u16,
    pub passes_attempted: u16,
    pub tackles: u8,
    pub interceptions: u8,
    pub fouls_committed: u8,
    pub distance_covered_km: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct TeamMatchStats {
    pub possession_percentage: f32,
    pub total_shots: u8,
    pub shots_on_target: u8,
    pub shots_off_target: u8,
    pub shots_blocked: u8,
    pub corners: u8,
    pub offsides: u8,
    pub fouls: u8,
    pub yellow_cards: u8,
    pub red_cards: u8,
    pub passes_completed: u16,
    pub passes_attempted: u16,
    pub pass_accuracy: f32,
    pub crosses: u8,
    pub tackles: u8,
    pub interceptions: u8,
    pub clearances: u8,
    pub saves: u8,
    pub expected_goals: f32, // xG
    pub expected_assists: f32, // xA
    pub distance_covered_km: f32,
    pub sprints: u8,
    pub duels_won: u8,
    pub duels_total: u8,
    pub aerial_duels_won: u8,
    pub aerial_duels_total: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct MatchStatistics {
    pub match_id: Uuid,
    pub home_team: Team,
    pub away_team: Team,
    pub venue: Venue,
    pub match_date: DateTime<Utc>,
    pub result: MatchResult,
    pub attendance: u32,
    pub referee: String,
    pub weather: String,
    pub temperature_celsius: i8,
    pub home_team_stats: TeamMatchStats,
    pub away_team_stats: TeamMatchStats,
    pub match_duration_minutes: u16,
    pub added_time_first_half: u8,
    pub added_time_second_half: u8,
    pub total_goals: u8,
    pub total_cards: u8,
    pub total_corners: u8,
    pub ball_in_play_percentage: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: DateTime<Utc>,
    pub version: String,
}