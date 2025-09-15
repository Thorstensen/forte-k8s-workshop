use crate::models::{MatchStatistics, Team, Venue, MatchResult, TeamMatchStats};
use chrono::{Utc, Duration};
use rand::Rng;
use uuid::Uuid;

pub struct StatsGenerator;

impl StatsGenerator {
    pub fn generate_random_match_stats() -> MatchStatistics {
        let mut rng = rand::thread_rng();
        
        let home_team = Self::generate_random_team(&mut rng, true);
        let away_team = Self::generate_random_team(&mut rng, false);
        let venue = Self::generate_random_venue(&mut rng);
        
        let home_score = rng.gen_range(0..=5);
        let away_score = rng.gen_range(0..=5);
        let result = MatchResult { home_score, away_score };
        
        let home_stats = Self::generate_team_stats(&mut rng, home_score, true);
        let away_stats = Self::generate_team_stats(&mut rng, away_score, false);
        
        // Generate a recent match date (within last 30 days)
        let days_ago = rng.gen_range(0..30);
        let match_date = Utc::now() - Duration::days(days_ago);
        
        MatchStatistics {
            match_id: Uuid::new_v4(),
            home_team,
            away_team,
            venue,
            match_date,
            result,
            attendance: rng.gen_range(15000..75000),
            referee: Self::generate_random_referee(&mut rng),
            weather: Self::generate_random_weather(&mut rng),
            temperature_celsius: rng.gen_range(5..30),
            home_team_stats: home_stats.clone(),
            away_team_stats: away_stats.clone(),
            match_duration_minutes: 90,
            added_time_first_half: rng.gen_range(1..6),
            added_time_second_half: rng.gen_range(3..8),
            total_goals: home_score + away_score,
            total_cards: home_stats.yellow_cards + home_stats.red_cards + away_stats.yellow_cards + away_stats.red_cards,
            total_corners: home_stats.corners + away_stats.corners,
            ball_in_play_percentage: rng.gen_range(55.0..70.0),
        }
    }
    
    fn generate_random_team(rng: &mut impl Rng, _is_home: bool) -> Team {
        let teams = vec![
            ("Manchester United", "MUN", "England"),
            ("Real Madrid", "RMA", "Spain"),
            ("Bayern Munich", "BAY", "Germany"),
            ("Barcelona", "BAR", "Spain"),
            ("Liverpool", "LIV", "England"),
            ("Paris Saint-Germain", "PSG", "France"),
            ("Juventus", "JUV", "Italy"),
            ("Arsenal", "ARS", "England"),
            ("Chelsea", "CHE", "England"),
            ("Manchester City", "MCI", "England"),
            ("AC Milan", "MIL", "Italy"),
            ("Inter Milan", "INT", "Italy"),
            ("Borussia Dortmund", "BVB", "Germany"),
            ("Atletico Madrid", "ATM", "Spain"),
            ("Tottenham", "TOT", "England"),
        ];
        
        let (name, short_name, country) = teams[rng.gen_range(0..teams.len())];
        
        Team {
            id: Uuid::new_v4(),
            name: name.to_string(),
            short_name: short_name.to_string(),
            country: country.to_string(),
        }
    }
    
    fn generate_random_venue(rng: &mut impl Rng) -> Venue {
        let venues = vec![
            ("Old Trafford", "Manchester", "England", 74879),
            ("Santiago Bernabéu", "Madrid", "Spain", 81044),
            ("Allianz Arena", "Munich", "Germany", 75000),
            ("Camp Nou", "Barcelona", "Spain", 99354),
            ("Anfield", "Liverpool", "England", 53394),
            ("Parc des Princes", "Paris", "France", 47929),
            ("Allianz Stadium", "Turin", "Italy", 41507),
            ("Emirates Stadium", "London", "England", 60260),
            ("Stamford Bridge", "London", "England", 40834),
            ("Etihad Stadium", "Manchester", "England", 55017),
        ];
        
        let (name, city, country, capacity) = venues[rng.gen_range(0..venues.len())];
        
        Venue {
            name: name.to_string(),
            city: city.to_string(),
            country: country.to_string(),
            capacity,
        }
    }
    
    fn generate_team_stats(rng: &mut impl Rng, goals_scored: u8, is_home: bool) -> TeamMatchStats {
        // Home teams typically have slightly better stats
        let home_advantage = if is_home { 1.1 } else { 1.0 };
        
        let shots_on_target = (goals_scored as f32 * rng.gen_range(1.5..3.0)) as u8;
        let total_shots = shots_on_target + rng.gen_range(3..12);
        let shots_off_target = total_shots - shots_on_target - rng.gen_range(0..3); // Some blocked
        let shots_blocked = total_shots - shots_on_target - shots_off_target;
        
        let passes_attempted = (rng.gen_range(400..700) as f32 * home_advantage) as u16;
        let pass_accuracy = rng.gen_range(75.0..95.0);
        let passes_completed = (passes_attempted as f32 * (pass_accuracy / 100.0)) as u16;
        
        let possession = if is_home {
            rng.gen_range(45.0..65.0)
        } else {
            100.0 - rng.gen_range(45.0..65.0) // Away team gets remaining possession
        };
        
        TeamMatchStats {
            possession_percentage: possession,
            total_shots,
            shots_on_target,
            shots_off_target,
            shots_blocked,
            corners: rng.gen_range(2..12),
            offsides: rng.gen_range(0..8),
            fouls: rng.gen_range(8..20),
            yellow_cards: rng.gen_range(0..5),
            red_cards: rng.gen_range(0..2),
            passes_completed,
            passes_attempted,
            pass_accuracy,
            crosses: rng.gen_range(5..25),
            tackles: rng.gen_range(10..25),
            interceptions: rng.gen_range(5..15),
            clearances: rng.gen_range(10..30),
            saves: rng.gen_range(2..8),
            expected_goals: (goals_scored as f32 * rng.gen_range(0.8..1.5)).min(5.0),
            expected_assists: rng.gen_range(0.0..3.0),
            distance_covered_km: rng.gen_range(105.0..120.0),
            sprints: rng.gen_range(150..255),
            duels_won: rng.gen_range(25..60),
            duels_total: rng.gen_range(50..100),
            aerial_duels_won: rng.gen_range(10..25),
            aerial_duels_total: rng.gen_range(20..40),
        }
    }
    
    fn generate_random_referee(rng: &mut impl Rng) -> String {
        let referees = vec![
            "Michael Oliver", "Anthony Taylor", "Paul Tierney", "Chris Kavanagh",
            "Simon Hooper", "Andre Marriner", "Martin Atkinson", "Mike Dean",
            "Stuart Attwell", "David Coote", "Peter Bankes", "Jarred Gillett",
        ];
        
        referees[rng.gen_range(0..referees.len())].to_string()
    }
    
    fn generate_random_weather(rng: &mut impl Rng) -> String {
        let weather_conditions = vec![
            "Clear", "Partly cloudy", "Cloudy", "Light rain", "Heavy rain",
            "Drizzle", "Fog", "Sunny", "Overcast", "Windy",
        ];
        
        weather_conditions[rng.gen_range(0..weather_conditions.len())].to_string()
    }
}