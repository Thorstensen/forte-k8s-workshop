package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
	_ "notification-center/docs" // Import generated docs
)

// @title NotificationCenter API
// @version 1.0
// @description A service for soccer match notifications
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api

// Team represents a soccer team
type Team struct {
	ID   string `json:"id" example:"team-1"`
	Name string `json:"name" example:"Manchester United"`
}

// Match represents a soccer match
type Match struct {
	ID       string    `json:"id" example:"match-1"`
	HomeTeam Team      `json:"home_team"`
	AwayTeam Team      `json:"away_team"`
	DateTime time.Time `json:"date_time" example:"2024-01-15T15:00:00Z"`
	Status   string    `json:"status" example:"scheduled"`
}

// Notification represents a push notification about a soccer match
type Notification struct {
	ID          string    `json:"id" example:"notif-1"`
	MatchID     string    `json:"match_id" example:"match-1"`
	Type        string    `json:"type" example:"goal"`
	Title       string    `json:"title" example:"GOAL! Manchester United 1-0 Liverpool"`
	Message     string    `json:"message" example:"Bruno Fernandes scores from the penalty spot in the 25th minute"`
	Timestamp   time.Time `json:"timestamp" example:"2024-01-15T15:25:00Z"`
	Priority    string    `json:"priority" example:"high"`
	PlayerName  *string   `json:"player_name,omitempty" example:"Bruno Fernandes"`
	Minute      *int      `json:"minute,omitempty" example:"25"`
	HomeScore   *int      `json:"home_score,omitempty" example:"1"`
	AwayScore   *int      `json:"away_score,omitempty" example:"0"`
	CardType    *string   `json:"card_type,omitempty" example:"yellow"`
	IsImportant bool      `json:"is_important" example:"true"`
}

// HealthResponse represents health check response
type HealthResponse struct {
	Status  string    `json:"status" example:"healthy"`
	Version string    `json:"version" example:"1.0.0"`
	Time    time.Time `json:"time" example:"2024-01-15T15:00:00Z"`
}

// ErrorResponse represents error response
type ErrorResponse struct {
	Error   string `json:"error" example:"Resource not found"`
	Code    int    `json:"code" example:"404"`
	Message string `json:"message" example:"The requested resource was not found"`
}

var (
	teams         []Team
	matches       []Match
	notifications []Notification
)

func init() {
	// Initialize sample data
	teams = []Team{
		{ID: "team-1", Name: "Manchester United"},
		{ID: "team-2", Name: "Liverpool"},
		{ID: "team-3", Name: "Chelsea"},
		{ID: "team-4", Name: "Arsenal"},
		{ID: "team-5", Name: "Manchester City"},
		{ID: "team-6", Name: "Tottenham"},
	}

	matches = []Match{
		{
			ID:       "match-1",
			HomeTeam: teams[0],
			AwayTeam: teams[1],
			DateTime: time.Now().Add(1 * time.Hour),
			Status:   "scheduled",
		},
		{
			ID:       "match-2",
			HomeTeam: teams[2],
			AwayTeam: teams[3],
			DateTime: time.Now().Add(3 * time.Hour),
			Status:   "scheduled",
		},
		{
			ID:       "match-3",
			HomeTeam: teams[4],
			AwayTeam: teams[5],
			DateTime: time.Now().Add(-30 * time.Minute),
			Status:   "live",
		},
	}

	// Generate sample notifications
	generateSampleNotifications()
}

func generateSampleNotifications() {
	notificationTypes := []string{"goal", "yellow_card", "red_card", "substitution", "match_start", "match_end", "penalty"}
	priorities := []string{"low", "medium", "high", "critical"}
	
	for i, match := range matches {
		// Match start notification
		notifications = append(notifications, Notification{
			ID:          fmt.Sprintf("notif-%d-start", i+1),
			MatchID:     match.ID,
			Type:        "match_start",
			Title:       fmt.Sprintf("⚽ KICK OFF: %s vs %s", match.HomeTeam.Name, match.AwayTeam.Name),
			Message:     fmt.Sprintf("The match between %s and %s has started!", match.HomeTeam.Name, match.AwayTeam.Name),
			Timestamp:   match.DateTime,
			Priority:    "high",
			IsImportant: true,
		})

		// Random events during the match
		eventCount := rand.Intn(8) + 3 // 3-10 events per match
		for j := 0; j < eventCount; j++ {
			notifType := notificationTypes[rand.Intn(len(notificationTypes))]
			minute := rand.Intn(90) + 1
			
			notification := Notification{
				ID:          fmt.Sprintf("notif-%d-%d", i+1, j+1),
				MatchID:     match.ID,
				Type:        notifType,
				Timestamp:   match.DateTime.Add(time.Duration(minute) * time.Minute),
				Priority:    priorities[rand.Intn(len(priorities))],
				Minute:      &minute,
				IsImportant: notifType == "goal" || notifType == "red_card" || notifType == "penalty",
			}

			switch notifType {
			case "goal":
				homeScore := rand.Intn(4)
				awayScore := rand.Intn(4)
				playerName := getRandomPlayerName()
				notification.Title = fmt.Sprintf("⚽ GOAL! %s %d-%d %s", match.HomeTeam.Name, homeScore, awayScore, match.AwayTeam.Name)
				notification.Message = fmt.Sprintf("%s scores in the %d minute!", playerName, minute)
				notification.PlayerName = &playerName
				notification.HomeScore = &homeScore
				notification.AwayScore = &awayScore
			case "yellow_card":
				playerName := getRandomPlayerName()
				cardType := "yellow"
				notification.Title = fmt.Sprintf("🟨 Yellow Card - %s", match.HomeTeam.Name)
				notification.Message = fmt.Sprintf("%s receives a yellow card in the %d minute", playerName, minute)
				notification.PlayerName = &playerName
				notification.CardType = &cardType
			case "red_card":
				playerName := getRandomPlayerName()
				cardType := "red"
				notification.Title = fmt.Sprintf("🟥 Red Card - %s", match.HomeTeam.Name)
				notification.Message = fmt.Sprintf("%s is sent off with a red card in the %d minute!", playerName, minute)
				notification.PlayerName = &playerName
				notification.CardType = &cardType
			case "substitution":
				playerOut := getRandomPlayerName()
				playerIn := getRandomPlayerName()
				notification.Title = fmt.Sprintf("🔄 Substitution - %s", match.HomeTeam.Name)
				notification.Message = fmt.Sprintf("%s is replaced by %s in the %d minute", playerOut, playerIn, minute)
			case "penalty":
				playerName := getRandomPlayerName()
				notification.Title = fmt.Sprintf("⚽ Penalty Award - %s vs %s", match.HomeTeam.Name, match.AwayTeam.Name)
				notification.Message = fmt.Sprintf("Penalty awarded! %s steps up to take it in the %d minute", playerName, minute)
				notification.PlayerName = &playerName
			case "match_end":
				homeScore := rand.Intn(4)
				awayScore := rand.Intn(4)
				notification.Title = fmt.Sprintf("🏁 FULL TIME: %s %d-%d %s", match.HomeTeam.Name, homeScore, awayScore, match.AwayTeam.Name)
				notification.Message = fmt.Sprintf("Match finished: %s %d-%d %s", match.HomeTeam.Name, homeScore, awayScore, match.AwayTeam.Name)
				notification.HomeScore = &homeScore
				notification.AwayScore = &awayScore
			}

			notifications = append(notifications, notification)
		}
	}
}

func getRandomPlayerName() string {
	players := []string{
		"Bruno Fernandes", "Marcus Rashford", "Mohamed Salah", "Virgil van Dijk",
		"Mason Mount", "Reece James", "Bukayo Saka", "Martin Ødegaard",
		"Kevin De Bruyne", "Erling Haaland", "Harry Kane", "Son Heung-min",
		"Declan Rice", "Gabriel Jesus", "Jack Grealish", "Phil Foden",
	}
	return players[rand.Intn(len(players))]
}

// @Summary Health check
// @Description Get health status of the service
// @Tags Health
// @Accept json
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /api/health [get]
func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:  "healthy",
		Version: "1.0.0",
		Time:    time.Now(),
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// @Summary Get all matches
// @Description Get a list of all soccer matches
// @Tags Matches
// @Accept json
// @Produce json
// @Success 200 {array} Match
// @Router /api/matches [get]
func getMatchesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(matches)
}

// @Summary Get match by ID
// @Description Get a specific match by its ID
// @Tags Matches
// @Accept json
// @Produce json
// @Param id path string true "Match ID"
// @Success 200 {object} Match
// @Failure 404 {object} ErrorResponse
// @Router /api/matches/{id} [get]
func getMatchHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID := vars["id"]

	for _, match := range matches {
		if match.ID == matchID {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(match)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   "Match not found",
		Code:    404,
		Message: fmt.Sprintf("Match with ID %s was not found", matchID),
	})
}

// @Summary Get all notifications
// @Description Get all notifications, optionally filtered by match ID, type, or priority
// @Tags Notifications
// @Accept json
// @Produce json
// @Param match_id query string false "Filter by match ID"
// @Param type query string false "Filter by notification type"
// @Param priority query string false "Filter by priority"
// @Param limit query int false "Limit number of results" default(50)
// @Success 200 {array} Notification
// @Router /api/notifications [get]
func getNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	matchID := r.URL.Query().Get("match_id")
	notifType := r.URL.Query().Get("type")
	priority := r.URL.Query().Get("priority")
	limitStr := r.URL.Query().Get("limit")
	
	limit := 50 // default limit
	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	var filteredNotifications []Notification
	for _, notification := range notifications {
		if matchID != "" && notification.MatchID != matchID {
			continue
		}
		if notifType != "" && notification.Type != notifType {
			continue
		}
		if priority != "" && notification.Priority != priority {
			continue
		}
		filteredNotifications = append(filteredNotifications, notification)
		
		if len(filteredNotifications) >= limit {
			break
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filteredNotifications)
}

// @Summary Get notification by ID
// @Description Get a specific notification by its ID
// @Tags Notifications
// @Accept json
// @Produce json
// @Param id path string true "Notification ID"
// @Success 200 {object} Notification
// @Failure 404 {object} ErrorResponse
// @Router /api/notifications/{id} [get]
func getNotificationHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	notificationID := vars["id"]

	for _, notification := range notifications {
		if notification.ID == notificationID {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(notification)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   "Notification not found",
		Code:    404,
		Message: fmt.Sprintf("Notification with ID %s was not found", notificationID),
	})
}

// @Summary Get notifications for a match
// @Description Get all notifications for a specific match
// @Tags Notifications
// @Accept json
// @Produce json
// @Param id path string true "Match ID"
// @Param type query string false "Filter by notification type"
// @Param priority query string false "Filter by priority"
// @Success 200 {array} Notification
// @Failure 404 {object} ErrorResponse
// @Router /api/matches/{id}/notifications [get]
func getMatchNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID := vars["id"]
	notifType := r.URL.Query().Get("type")
	priority := r.URL.Query().Get("priority")

	// Check if match exists
	matchExists := false
	for _, match := range matches {
		if match.ID == matchID {
			matchExists = true
			break
		}
	}

	if !matchExists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "Match not found",
			Code:    404,
			Message: fmt.Sprintf("Match with ID %s was not found", matchID),
		})
		return
	}

	var matchNotifications []Notification
	for _, notification := range notifications {
		if notification.MatchID != matchID {
			continue
		}
		if notifType != "" && notification.Type != notifType {
			continue
		}
		if priority != "" && notification.Priority != priority {
			continue
		}
		matchNotifications = append(matchNotifications, notification)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(matchNotifications)
}

// @Summary Get important notifications
// @Description Get all notifications marked as important
// @Tags Notifications
// @Accept json
// @Produce json
// @Param limit query int false "Limit number of results" default(20)
// @Success 200 {array} Notification
// @Router /api/notifications/important [get]
func getImportantNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 20 // default limit
	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	var importantNotifications []Notification
	for _, notification := range notifications {
		if notification.IsImportant {
			importantNotifications = append(importantNotifications, notification)
			if len(importantNotifications) >= limit {
				break
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(importantNotifications)
}

// Redirect root to swagger documentation
func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/api/docs", http.StatusMovedPermanently)
}

func main() {
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/", rootHandler).Methods("GET")
	r.HandleFunc("/api/health", healthHandler).Methods("GET")
	
	// Match routes
	r.HandleFunc("/api/matches", getMatchesHandler).Methods("GET")
	r.HandleFunc("/api/matches/{id}", getMatchHandler).Methods("GET")
	r.HandleFunc("/api/matches/{id}/notifications", getMatchNotificationsHandler).Methods("GET")
	
	// Notification routes
	r.HandleFunc("/api/notifications", getNotificationsHandler).Methods("GET")
	r.HandleFunc("/api/notifications/{id}", getNotificationHandler).Methods("GET")
	r.HandleFunc("/api/notifications/important", getImportantNotificationsHandler).Methods("GET")

	// Add redirect for /api/docs to /api/docs/index.html
	r.HandleFunc("/api/docs", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/api/docs/index.html", http.StatusMovedPermanently)
	}).Methods("GET")

	// Swagger documentation
	r.PathPrefix("/api/docs/").Handler(httpSwagger.WrapHandler)

	fmt.Println("🚀 NotificationCenter service starting on port 8080")
	fmt.Println("📖 Swagger documentation available at: http://localhost:8080/api/docs")
	fmt.Println("❤️  Health check available at: http://localhost:8080/api/health")
	
	log.Fatal(http.ListenAndServe(":8080", r))
}