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
- **[System Context](documentation/diagrams/c4/context.puml)** - High-level system overview
- **[Container Diagram](documentation/diagrams/c4/container.puml)** - Microservices architecture
- **[Component Diagrams](documentation/diagrams/c4/)** - Internal service structure

View the diagrams at: [C4 Documentation](documentation/diagrams/c4/README.md)

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

- **Architecture**: [C4 Model Diagrams](documentation/diagrams/c4/)
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