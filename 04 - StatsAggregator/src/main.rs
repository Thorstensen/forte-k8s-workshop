mod models;
mod generator;
mod handlers;

use axum::{
    routing::get,
    Router,
};
use tower_http::cors::CorsLayer;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use std::net::SocketAddr;

#[derive(OpenApi)]
#[openapi(
    paths(
        handlers::get_match_stats,
        handlers::health_check,
    ),
    components(
        schemas(
            models::MatchStatistics,
            models::Team,
            models::Venue,
            models::MatchResult,
            models::TeamMatchStats,
            models::HealthResponse,
        )
    ),
    tags(
        (name = "Statistics", description = "Soccer match statistics API"),
        (name = "Health", description = "Service health endpoints")
    ),
    info(
        title = "Soccer Stats Aggregator API",
        version = "1.0.0",
        description = "A service that generates random soccer match statistics including team information, match results, and detailed statistics for both teams.",
        contact(
            name = "Stats Aggregator Service",
            email = "stats@example.com"
        )
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    println!("🚀 Starting Soccer Stats Aggregator Service...");

    let app = Router::new()
        .route("/api/match/stats", get(handlers::get_match_stats))
        .route("/health", get(handlers::health_check))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/", get(|| async { 
            axum::response::Redirect::permanent("/swagger-ui") 
        }))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("📊 Soccer Stats Aggregator Service running on http://{}", addr);
    println!("📖 Swagger UI available at: http://{}/swagger-ui", addr);
    println!("🏥 Health check available at: http://{}/health", addr);
    println!("⚽ Match stats available at: http://{}/api/match/stats", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
