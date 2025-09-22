# Forte K8s Workshop - Football Microservices Platform

A comprehensive **microservices ecosystem** designed to teach developers the most important aspects of Kubernetes and modern cloud-native development. This project demonstrates a complete football management platform with betting, statistics, notifications, and team management capabilities.

## 🏗️ Architecture Overview

The platform consists of **6 microservices** built with different technology stacks to showcase polyglot development and Kubernetes orchestration:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Team Generator │    │ Match Scheduler │
│ React TypeScript│◄──►│    C# .NET      │◄──►│  TypeScript     │
│     (UI)        │    │   (Teams)       │    │   (Matches)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │              Shared IDs (no direct calls)    │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Betting Service │    │ Stats Aggregator│    │Notification Ctr │
│ Python FastAPI  │    │   Rust Axum     │    │   Go Gorilla    │
│   (Betting)     │    │  (Statistics)   │    │ (Notifications) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📊 C4 Model Diagrams

Comprehensive architecture documentation using the C4 Model:

#### Level 1: System Context
High-level view showing how the Forte Football Platform fits into the broader ecosystem:

```plantuml
@startuml "Forte K8s Workshop - System Context"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_TOP_DOWN()

title Forte K8s Workshop - System Context Diagram

Person(user, "Football Fan", "Wants to view matches, place bets, and receive notifications")
Person(admin, "System Administrator", "Manages teams, schedules matches, and monitors system")

System(forte_system, "Forte Football Platform", "Microservices-based football management platform with betting, statistics, and notifications")

System_Ext(browser, "Web Browser", "User interface for accessing the platform")
System_Ext(kubernetes, "Kubernetes Cluster", "Container orchestration platform hosting all microservices")

Rel(user, forte_system, "Views matches, places bets, receives notifications", "HTTPS")
Rel(admin, forte_system, "Manages teams and matches", "HTTPS")
Rel(forte_system, browser, "Serves web interface", "HTTPS")
Rel(forte_system, kubernetes, "Deployed on", "Container Runtime")

SHOW_LEGEND()
@enduml
```

#### Level 2: Container Diagram
Detailed microservices architecture showing how containers interact:

```plantuml
@startuml "Forte K8s Workshop - Container Diagram"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_TOP_DOWN()

title Forte K8s Workshop - Container Diagram (Microservices Architecture)

Person(user, "Football Fan", "Views matches, places bets, receives notifications")
Person(admin, "Administrator", "Manages teams and schedules matches")

System_Boundary(forte_platform, "Forte Football Platform") {
    Container(frontend, "Frontend", "React TypeScript", "Web interface for users to interact with all services")
    
    Container(team_generator, "Team Generator", "C# .NET Core", "Generates and manages football teams with shared IDs")
    Container(betting_service, "Betting Service", "Python FastAPI", "Manages betting odds and allows users to place bets")
    Container(match_scheduler, "Match Scheduler", "TypeScript Express", "Schedules matches with conflict detection")
    Container(stats_aggregator, "Stats Aggregator", "Rust Axum", "Generates realistic match statistics")
    Container(notification_center, "Notification Center", "Go Gorilla Mux", "Manages real-time match notifications")
}

System_Ext(kubernetes, "Kubernetes", "Container orchestration platform")

' User interactions
Rel(user, frontend, "Uses", "HTTPS")
Rel(admin, frontend, "Uses", "HTTPS")

' Frontend to microservices
Rel(frontend, team_generator, "Gets teams", "REST API")
Rel(frontend, betting_service, "Places bets, gets odds", "REST API")
Rel(frontend, match_scheduler, "Schedules/views matches", "REST API")
Rel(frontend, stats_aggregator, "Gets match statistics", "REST API")
Rel(frontend, notification_center, "Gets notifications", "REST API")

' Service interactions (via shared IDs - no direct calls)
Rel_Back(team_generator, match_scheduler, "Shares team IDs", "Consistent Data")
Rel_Back(match_scheduler, betting_service, "Shares match IDs", "Consistent Data")
Rel_Back(match_scheduler, notification_center, "Shares match/team IDs", "Consistent Data")
Rel_Back(team_generator, stats_aggregator, "Shares team IDs", "Consistent Data")

' Deployment
Rel(forte_platform, kubernetes, "Deployed on", "Docker Containers")

SHOW_LEGEND()
@enduml
```

#### Level 3: Component Diagrams

**Frontend Components** - Internal structure of the React TypeScript frontend:

```plantuml
@startuml "Forte K8s Workshop - Frontend Components"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_TOP_DOWN()

title Frontend Service - Component Diagram

Container_Boundary(frontend, "Frontend - React TypeScript") {
    Component(layout, "Layout Component", "React", "Main application layout with navigation")
    Component(teams_tab, "Teams Tab", "React", "Team creation and viewing interface")
    Component(matches_tab, "Matches Tab", "React", "Match scheduling and management")
    Component(betting_tab, "Betting Tab", "React", "Betting interface with live odds")
    Component(notifications_tab, "Notifications Tab", "React", "Real-time notification feed")
    Component(stats_tab, "Stats Tab", "React", "Match statistics display")
    
    Component(api_service, "API Service", "Axios", "HTTP client configuration for all services")
    Component(team_service, "Team Service Client", "TypeScript", "Team Generator API integration")
    Component(match_service, "Match Service Client", "TypeScript", "Match Scheduler API integration")
    Component(betting_service, "Betting Service Client", "TypeScript", "Betting Service API integration")
    Component(notification_service, "Notification Service Client", "TypeScript", "Notification Center API integration")
    Component(stats_service, "Stats Service Client", "TypeScript", "Stats Aggregator API integration")
    
    Component(react_query, "React Query Hooks", "TanStack Query", "Data fetching and caching hooks")
    Component(types, "TypeScript Types", "TypeScript", "Shared type definitions")
}

Container_Ext(team_generator, "Team Generator", "C# .NET")
Container_Ext(match_scheduler, "Match Scheduler", "TypeScript")
Container_Ext(betting_api, "Betting Service", "Python")
Container_Ext(notification_api, "Notification Center", "Go")
Container_Ext(stats_api, "Stats Aggregator", "Rust")

' UI Component relationships
Rel(layout, teams_tab, "Contains")
Rel(layout, matches_tab, "Contains")
Rel(layout, betting_tab, "Contains")
Rel(layout, notifications_tab, "Contains")
Rel(layout, stats_tab, "Contains")

' Component to service relationships
Rel(teams_tab, team_service, "Uses")
Rel(matches_tab, match_service, "Uses")
Rel(betting_tab, betting_service, "Uses")
Rel(notifications_tab, notification_service, "Uses")
Rel(stats_tab, stats_service, "Uses")

' Service layer relationships
Rel(team_service, api_service, "Uses")
Rel(match_service, api_service, "Uses")
Rel(betting_service, api_service, "Uses")
Rel(notification_service, api_service, "Uses")
Rel(stats_service, api_service, "Uses")

' React Query integration
Rel(team_service, react_query, "Provides hooks")
Rel(match_service, react_query, "Provides hooks")
Rel(betting_service, react_query, "Provides hooks")
Rel(notification_service, react_query, "Provides hooks")
Rel(stats_service, react_query, "Provides hooks")

' Type usage
Rel(teams_tab, types, "Uses")
Rel(matches_tab, types, "Uses")
Rel(betting_tab, types, "Uses")
Rel(notifications_tab, types, "Uses")
Rel(stats_tab, types, "Uses")

' External API calls
Rel(team_service, team_generator, "HTTP REST", "Get teams, create teams")
Rel(match_service, match_scheduler, "HTTP REST", "Schedule matches, get matches")
Rel(betting_service, betting_api, "HTTP REST", "Place bets, get odds")
Rel(notification_service, notification_api, "HTTP REST", "Get notifications")
Rel(stats_service, stats_api, "HTTP REST", "Get match statistics")

SHOW_LEGEND()
@enduml
```

**Team Generator Components** - Clean Architecture implementation of the C# service:

```plantuml
@startuml "Forte K8s Workshop - Team Generator Components"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_TOP_DOWN()

title Team Generator Service - Component Diagram (Clean Architecture)

Container_Boundary(team_generator, "Team Generator - C# .NET Core") {
    
    Component_Boundary(api_layer, "API Layer") {
        Component(controllers, "Team Controller", "ASP.NET Core", "REST API endpoints for team operations")
        Component(swagger, "Swagger Config", "Swashbuckle", "API documentation generation")
        Component(health_check, "Health Check", "ASP.NET Core", "Health monitoring endpoint")
    }
    
    Component_Boundary(application_layer, "Application Layer") {
        Component(team_service, "Team Service", "C#", "Business logic for team operations")
        Component(create_team_usecase, "Create Team Use Case", "C#", "Team creation business rules")
        Component(get_team_usecase, "Get Team Use Case", "C#", "Team retrieval logic")
        Component(update_team_usecase, "Update Team Use Case", "C#", "Team update operations")
        Component(delete_team_usecase, "Delete Team Use Case", "C#", "Team deletion logic")
    }
    
    Component_Boundary(domain_layer, "Domain Layer") {
        Component(team_entity, "Team Entity", "C#", "Core team business entity with shared ID mapping")
        Component(team_repository_interface, "ITeam Repository", "C#", "Repository contract")
        Component(shared_id_mapper, "Shared ID Mapper", "C#", "Maps team names to shared IDs (team-1 to team-6)")
    }
    
    Component_Boundary(infrastructure_layer, "Infrastructure Layer") {
        Component(team_repository, "Team Repository", "C#", "In-memory team data storage implementation")
        Component(dependency_injection, "DI Container", "Microsoft.Extensions.DI", "Dependency injection configuration")
    }
}

Container_Ext(frontend, "Frontend", "React TypeScript")
ContainerDb_Ext(memory_store, "In-Memory Store", "Dictionary<string, Team>", "Runtime team storage")

' API Layer relationships
Rel(controllers, swagger, "Documented by")
Rel(controllers, health_check, "Includes")

' API to Application
Rel(controllers, team_service, "Uses")

' Application Layer relationships
Rel(team_service, create_team_usecase, "Orchestrates")
Rel(team_service, get_team_usecase, "Orchestrates")
Rel(team_service, update_team_usecase, "Orchestrates")
Rel(team_service, delete_team_usecase, "Orchestrates")

' Application to Domain
Rel(create_team_usecase, team_entity, "Creates")
Rel(get_team_usecase, team_repository_interface, "Uses")
Rel(update_team_usecase, team_repository_interface, "Uses")
Rel(delete_team_usecase, team_repository_interface, "Uses")

' Domain relationships
Rel(team_entity, shared_id_mapper, "Uses for ID mapping")

' Infrastructure relationships
Rel(team_repository, team_repository_interface, "Implements")
Rel(team_repository, memory_store, "Stores data in")
Rel(dependency_injection, team_service, "Injects")
Rel(dependency_injection, team_repository, "Injects")

' External relationships
Rel(frontend, controllers, "HTTP REST", "CRUD operations")

SHOW_LEGEND()
@enduml
```

📖 **Additional Documentation**: [C4 Model Details](documentation/diagrams/c4/README.md)

## 🚀 Microservices

### [01 - Team Generator](01%20-%20TeamGenerator/README.md)
**Technology**: C# .NET Core (Clean Architecture)
- ✅ Generate and manage football teams
- ✅ Shared team IDs (team-1 to team-6)
- ✅ RESTful API with Swagger documentation
- ✅ Health monitoring endpoint

### [02 - Betting Service](02%20-%20BettingService/README.md)
**Technology**: Python FastAPI
- ✅ Betting odds and bet placement
- ✅ Multiple bet types (match winner, goals, cards)
- ✅ Interactive Swagger UI
- ✅ In-memory storage with realistic data

### [03 - Match Scheduler](03%20-%20MatchScheduler/README.md)
**Technology**: TypeScript Express
- ✅ Schedule matches with conflict detection
- ✅ Match management (CRUD operations)
- ✅ Strict validation rules
- ✅ Production-ready security features

### [04 - Stats Aggregator](04%20-%20StatsAggregator/README.md)
**Technology**: Rust Axum
- ✅ Generate realistic match statistics
- ✅ Comprehensive data (possession, shots, cards)
- ✅ OpenAPI documentation
- ✅ High-performance async processing

### [05 - Notification Center](05%20-%20NotificationCenter/README.md)
**Technology**: Go Gorilla Mux
- ✅ Real-time match notifications
- ✅ Dynamic event generation
- ✅ Team and match correlation
- ✅ Swagger documentation

### [06 - Frontend](06%20-%20Frontend/README.md)
**Technology**: React TypeScript with Vite
- ✅ Modern responsive web interface
- ✅ Integration with all microservices
- ✅ Real-time data fetching with React Query
- ✅ Material-UI components

## 🔧 Technology Stack

| Service | Language | Framework | Purpose | Port |
|---------|----------|-----------|---------|------|
| **Frontend** | TypeScript | React + Vite | User Interface | 3001 |
| **Team Generator** | C# | .NET Core | Team Management | 5000 |
| **Betting Service** | Python | FastAPI | Betting Platform | 8080 |
| **Match Scheduler** | TypeScript | Express | Match Scheduling | 3000 |
| **Stats Aggregator** | Rust | Axum | Statistics Engine | 8080 |
| **Notification Center** | Go | Gorilla Mux | Notifications | 8080 |

## 🆔 Shared Data Strategy

Services maintain consistency through **shared entity IDs** without direct communication:

### Team IDs
| Team Name | Shared ID | Used By |
|-----------|-----------|---------|
| Manchester United | `team-1` | All Services |
| Liverpool | `team-2` | All Services |
| Chelsea | `team-3` | All Services |
| Arsenal | `team-4` | All Services |
| Manchester City | `team-5` | All Services |
| Tottenham | `team-6` | All Services |

### Match IDs
Format: `match-{number}` (e.g., `match-1`, `match-2`)

📖 **Details**: [Shared IDs Documentation](shared-ids.md)

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose**
- **Kubernetes** cluster (minikube, kind, or cloud)
- **Node.js 18+** (for local development)
- **.NET 8** (for Team Generator)
- **Python 3.11+** (for Betting Service)
- **Rust 1.80+** (for Stats Aggregator)
- **Go 1.24+** (for Notification Center)

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/Thorstensen/forte-k8s-workshop.git
cd forte-k8s-workshop
```

2. **Start services** (each in separate terminal):
```bash
# Frontend
cd "06 - Frontend"
npm install && npm run dev
# Access: http://localhost:3001

# Team Generator
cd "01 - TeamGenerator"
dotnet run --project src/TeamGenerator.Api
# Access: http://localhost:5000/swagger

# Betting Service
cd "02 - BettingService"
pip install -r requirements.txt && python main.py
# Access: http://localhost:8080/api/docs

# Match Scheduler
cd "03 - MatchScheduler"
npm install && npm run dev
# Access: http://localhost:3000

# Stats Aggregator
cd "04 - StatsAggregator"
cargo run
# Access: http://localhost:8080/api/docs

# Notification Center
cd "05 - NotificationCenter"
go run main.go
# Access: http://localhost:8080/swagger/index.html
```

### Docker Deployment

Each service includes a `Dockerfile` for containerization:

```bash
# Build all services
docker build -t team-generator ./01\ -\ TeamGenerator/
docker build -t betting-service ./02\ -\ BettingService/
docker build -t match-scheduler ./03\ -\ MatchScheduler/
docker build -t stats-aggregator ./04\ -\ StatsAggregator/
docker build -t notification-center ./05\ -\ NotificationCenter/
docker build -t forte-frontend ./06\ -\ Frontend/
```

## ☸️ Kubernetes Learning Objectives

This workshop demonstrates key Kubernetes concepts:

- **🏗️ Microservices Architecture**: Service decomposition and communication
- **📦 Containerization**: Docker best practices for different technology stacks
- **🔄 Service Discovery**: How services find and communicate with each other
- **⚖️ Load Balancing**: Distributing traffic across service instances
- **📊 Health Checks**: Monitoring service health and readiness
- **🔧 Configuration Management**: Environment-specific settings
- **📈 Scaling**: Horizontal pod autoscaling based on demand
- **🛡️ Security**: RBAC, network policies, and secret management

## 🧪 Testing

### Integration Testing
```bash
# Test shared ID consistency across all services
python3 tests/shared-id-consistency.py
```

### Individual Service Testing
Each service includes its own test suite - see individual README files for details.

## 📚 Learning Resources

- **Architecture**: C4 Model Diagrams (embedded above) & [detailed documentation](documentation/diagrams/c4/)
- **Microservices**: Individual service documentation
- **Kubernetes**: Workshop exercises (coming soon)
- **Best Practices**: Code examples across multiple tech stacks

## 🤝 Contributing

1. **Explore the Architecture**: Review the C4 diagrams and service documentation
2. **Run Locally**: Set up the development environment
3. **Make Changes**: Follow the patterns established in each service
4. **Test**: Ensure shared ID consistency and service functionality
5. **Document**: Update relevant README files

## 📝 License

This project is designed for educational purposes as part of the Forte K8s Workshop.