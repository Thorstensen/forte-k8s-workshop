<div align="center">

# ⚽ Forte K8s Workshop
## Crossbar conspiracy

[![Docker Build](https://github.com/Thorstensen/forte-k8s-workshop/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/Thorstensen/forte-k8s-workshop/actions/workflows/docker-build-push.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Container%20Ready-2496ED.svg)](https://www.docker.com/)

**A comprehensive microservices ecosystem showcasing modern cloud-native development patterns**

*Learn Kubernetes, Docker, and microservices architecture through a real-world football management platform with betting, statistics, and notifications.*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🐳 Docker Images](#-docker-images) • [🏗️ Architecture](#%EF%B8%8F-architecture-overview)

</div>

## 📋 Table of Contents

- [🏗️ Architecture Overview](#%EF%B8%8F-architecture-overview)
- [🚀 Microservices](#-microservices)
- [🐳 Docker Images](#-docker-images)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Troubleshooting](#%EF%B8%8F-troubleshooting)
- [📚 Learning Resources](#-learning-resources)
- [📝 License](#-license)

## 🏗️ Architecture Overview

The platform consists of **6 microservices** built with different technology stacks to showcase polyglot development and Kubernetes orchestration.

### 📊 C4 Model Diagrams

> **📖 View Interactive Diagrams**: The architecture diagrams below use PlantUML format. For the best viewing experience:
> - **GitHub Users**: View this repository on GitHub - the diagrams render automatically
> - **Local Development**: Use VS Code with the PlantUML extension
> - **Online Viewer**: Copy diagram code to [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
> - **Detailed Documentation**: [C4 Model Details](documentation/diagrams/c4/README.md)

#### 🌐 Level 1: System Context
*How the platform fits into the broader ecosystem*

[![System Context](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Thorstensen/forte-k8s-workshop/main/documentation/diagrams/c4/context.puml)](documentation/diagrams/c4/context.puml)

<details>
<summary>📄 View PlantUML Source</summary>

```plantuml
@startuml "Crossbar Conspiracy - System Context"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_TOP_DOWN()

title Crossbar Conspiracy - System Context Diagram

Person(user, "Football Fan", "Wants to view matches, place bets, and receive notifications")
Person(admin, "System Administrator", "Manages teams, schedules matches, and monitors system")

System(forte_system, "Crossbar Conspiracy", "Microservices-based football management platform with betting, statistics, and notifications")

System_Ext(browser, "Web Browser", "User interface for accessing the platform")
System_Ext(kubernetes, "Kubernetes Cluster", "Container orchestration platform hosting all microservices")

Rel(user, forte_system, "Views matches, places bets, receives notifications", "HTTPS")
Rel(admin, forte_system, "Manages teams and matches", "HTTPS")
Rel(forte_system, browser, "Serves web interface", "HTTPS")
Rel(forte_system, kubernetes, "Deployed on", "Container Runtime")

SHOW_LEGEND()
@enduml
```
</details>

#### 🏗️ Level 2: Container Diagram  
*Detailed microservices architecture showing container interactions*

[![Container Diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Thorstensen/forte-k8s-workshop/main/documentation/diagrams/c4/container.puml)](documentation/diagrams/c4/container.puml)

<details>
<summary>📄 View PlantUML Source</summary>

```plantuml
@startuml "Crossbar Conspiracy - Container Diagram"
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_TOP_DOWN()

title Crossbar Conspiracy - Container Diagram (Microservices Architecture)

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
</details>

#### ⚙️ Level 3: Component Diagrams
*Internal structure of key services*

**Frontend Components:**
[![Frontend Components](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Thorstensen/forte-k8s-workshop/main/documentation/diagrams/c4/frontend-components.puml)](documentation/diagrams/c4/frontend-components.puml)

**Team Generator Components (Clean Architecture):**
[![Team Generator Components](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Thorstensen/forte-k8s-workshop/main/documentation/diagrams/c4/team-generator-components.puml)](documentation/diagrams/c4/team-generator-components.puml)

> 💡 **Tip**: Click on any diagram to view the full PlantUML source code and detailed architecture documentation.

## 🚀 Microservices

The platform consists of **6 specialized microservices**, each built with different technology stacks to demonstrate polyglot development:

<div align="center">

| Service | Technology | Local Port | Docker Port | Documentation | API Docs |
|---------|------------|------------|-------------|---------------|----------|
| **Frontend** | React + TypeScript | 3001 | 8080 | [📖 README](06%20-%20Frontend/README.md) | Web UI |
| **Team Generator** | C# .NET Core | 5000 | 8080 | [📖 README](01%20-%20TeamGenerator/README.md) | [🔗 Swagger](http://localhost:5000/swagger) |
| **Betting Service** | Python FastAPI | 8080 | 8080 | [📖 README](02%20-%20BettingService/README.md) | [🔗 Docs](http://localhost:8080/api/docs) |
| **Match Scheduler** | TypeScript Express | 3000 | 3000 | [📖 README](03%20-%20MatchScheduler/README.md) | [🔗 Swagger](http://localhost:3000/api/docs) |
| **Stats Aggregator** | Rust Axum | 8080 | 8080 | [📖 README](04%20-%20StatsAggregator/README.md) | [🔗 Docs](http://localhost:8080/api/docs) |
| **Notification Center** | Go Gorilla Mux | 8080 | 8080 | [📖 README](05%20-%20NotificationCenter/README.md) | [🔗 Swagger](http://localhost:8080/swagger/index.html) |

</div>

### 🎯 Service Details

<details>
<summary><strong>01 - Team Generator (C# .NET Core)</strong></summary>

**🏗️ Architecture**: Clean Architecture with Domain-Driven Design
- ✅ Generate and manage football teams
- ✅ Shared team IDs (team-1 to team-6)
- ✅ RESTful API with comprehensive Swagger documentation
- ✅ Health monitoring and dependency injection
- ✅ In-memory storage with repository pattern

**🔍 Key Features**:
- Team creation with automatic ID mapping
- CRUD operations for team management
- Shared ID consistency across all services
- Production-ready health checks

</details>

<details>
<summary><strong>02 - Betting Service (Python FastAPI)</strong></summary>

**🎯 Purpose**: Comprehensive betting platform with realistic odds
- ✅ Multiple bet types (match winner, goals, cards)
- ✅ Dynamic odds calculation
- ✅ Interactive Swagger UI with live documentation
- ✅ In-memory storage with realistic sample data

**🔍 Key Features**:
- Real-time betting odds
- Multiple betting markets
- Bet placement and tracking
- Statistical betting analytics

</details>

<details>
<summary><strong>03 - Match Scheduler (TypeScript Express)</strong></summary>

**⚙️ Purpose**: Intelligent match scheduling with conflict detection
- ✅ Advanced match scheduling algorithms
- ✅ Team availability conflict detection
- ✅ Match management (CRUD operations)
- ✅ Production-ready security and validation

**🔍 Key Features**:
- Smart scheduling with conflict resolution
- Match lifecycle management
- Team availability tracking
- Comprehensive API validation

</details>

<details>
<summary><strong>04 - Stats Aggregator (Rust Axum)</strong></summary>

**📊 Purpose**: High-performance match statistics generation
- ✅ Realistic match statistics simulation
- ✅ Comprehensive data (possession, shots, cards, xG)
- ✅ OpenAPI 3.0 documentation
- ✅ Ultra-fast async processing

**🔍 Key Features**:
- Advanced statistical modeling
- Real-time match data generation
- Performance-optimized Rust backend
- Detailed match analytics

</details>

<details>
<summary><strong>05 - Notification Center (Go Gorilla Mux)</strong></summary>

**📢 Purpose**: Real-time event notification system
- ✅ Dynamic match event generation
- ✅ Team and match correlation
- ✅ Real-time notification delivery
- ✅ Comprehensive Swagger documentation

**🔍 Key Features**:
- Live match event streaming
- Multi-channel notification delivery
- Event correlation and filtering
- High-performance Go backend

</details>

<details>
<summary><strong>06 - Frontend (React TypeScript)</strong></summary>

**🎨 Purpose**: Modern, responsive web interface
- ✅ Material-UI design system
- ✅ Integration with all microservices
- ✅ Real-time data fetching with React Query
- ✅ Full TypeScript type safety

**🔍 Key Features**:
- Interactive dashboard
- Real-time data updates
- Responsive mobile design
- Comprehensive service integration

</details>

## 🐳 Docker Images

All services are containerized and automatically built using GitHub Actions. Pre-built images are available from GitHub Container Registry (GHCR).

### 📦 Available Images

| Service | Image | Latest | Pull Command |
|---------|-------|--------|--------------|
| **Team Generator** | `ghcr.io/thorstensen/forte-k8s-workshop/team-generator` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest` |
| **Betting Service** | `ghcr.io/thorstensen/forte-k8s-workshop/betting-service` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest` |
| **Match Scheduler** | `ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest` |
| **Stats Aggregator** | `ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest` |
| **Notification Center** | `ghcr.io/thorstensen/forte-k8s-workshop/notification-center` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest` |
| **Frontend** | `ghcr.io/thorstensen/forte-k8s-workshop/frontend` | ![Latest](https://img.shields.io/badge/latest-v1.0-blue) | `docker pull ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest` |

### 🚀 Quick Pull All Images

```bash
# Pull all latest images
docker pull ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest
```

### 🏃‍♂️ Run with Docker

```bash
# Run individual services
docker run -p 5000:5000 ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest
docker run -p 8080:8080 ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest
docker run -p 3000:3000 ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest
docker run -p 8080:8080 ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest
docker run -p 8080:8080 ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest
docker run -p 3001:8080 ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest
```

> 💡 **Note**: The images are automatically built and pushed when changes are made to service directories. See [.github/workflows/docker-build-push.yml](.github/workflows/docker-build-push.yml) for build details.

## 🔧 Technology Stack

<div align="center">

| Layer | Technologies | Purpose |
|-------|-------------|---------|
| **Frontend** | React, TypeScript, Vite, Material-UI, React Query | Modern web interface |
| **API Gateway** | Individual service endpoints | RESTful API design |
| **Microservices** | C# .NET, Python FastAPI, TypeScript, Rust, Go | Polyglot architecture |
| **Containerization** | Docker, Multi-stage builds | Container-first deployment |
| **Orchestration** | Kubernetes, Helm Charts | Cloud-native deployment |
| **CI/CD** | GitHub Actions, GHCR | Automated build & deploy |
| **Documentation** | Swagger/OpenAPI, PlantUML C4 | Comprehensive docs |

</div>

### 🎯 Service Technology Breakdown

| Service | Language | Framework | Local Port | Docker Port | Database | Key Features |
|---------|----------|-----------|------------|-------------|----------|--------------|
| **Frontend** | TypeScript | React + Vite | 3001 | 8080 | N/A | SPA, Real-time UI |
| **Team Generator** | C# | .NET Core 8 | 5000 | 8080 | In-Memory | Clean Architecture |
| **Betting Service** | Python | FastAPI | 8080 | 8080 | In-Memory | Async API |
| **Match Scheduler** | TypeScript | Express.js | 3000 | 3000 | In-Memory | Validation & Security |
| **Stats Aggregator** | Rust | Axum | 8080 | 8080 | In-Memory | High Performance |
| **Notification Center** | Go | Gorilla Mux | 8080 | 8080 | In-Memory | Concurrent Processing |


## 🚀 Quick Start

### 🔧 Prerequisites

<details>
<summary><strong>Development Environment</strong></summary>

**Required:**
- 🐳 **Docker** 20.10+ and **Docker Compose** v2
- ☸️ **Kubernetes** cluster (minikube, kind, or cloud provider)
- 🌐 **Git** for repository management

**Optional (for local development):**
- 📦 **Node.js** 18+ (Frontend & Match Scheduler)
- 🔷 **.NET 8 SDK** (Team Generator)
- 🐍 **Python 3.11+** (Betting Service)
- 🦀 **Rust 1.80+** (Stats Aggregator)
- 🐹 **Go 1.24+** (Notification Center)

</details>

### ⚡ Option 1: Docker Images (Fastest)

Perfect for **testing** and **Kubernetes deployment**:

```bash
# 1. Pull all pre-built images
docker pull ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest
docker pull ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest

# 2. Run services (in separate terminals)
docker run -p 5000:5000 ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest
docker run -p 8001:8080 ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest
docker run -p 3000:3000 ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest
docker run -p 8002:8080 ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest
docker run -p 8003:8080 ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest
docker run -p 3001:8080 ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest

# 3. Access services
echo "🎨 Frontend: http://localhost:3001"
echo "🏈 Team Generator: http://localhost:5000/swagger"
echo "💰 Betting Service: http://localhost:8001/api/docs"
echo "📅 Match Scheduler: http://localhost:3000/api/docs"
echo "📊 Stats Aggregator: http://localhost:8002/api/docs"
echo "📢 Notifications: http://localhost:8003/swagger/index.html"
```

### 🛠️ Option 2: Local Development

Perfect for **learning** and **contributing**:

```bash
# 1. Clone repository
git clone https://github.com/Thorstensen/forte-k8s-workshop.git
cd forte-k8s-workshop

# 2. Start services (each in separate terminal)
# Terminal 1 - Frontend
cd "06 - Frontend"
npm install && npm run dev
# Access: http://localhost:3001

# Terminal 2 - Team Generator
cd "01 - TeamGenerator"
dotnet run --project src/TeamGenerator.Api
# Access: http://localhost:5000/swagger

# Terminal 3 - Betting Service
cd "02 - BettingService"
pip install -r requirements.txt
python main.py
# Access: http://localhost:8080/api/docs

# Terminal 4 - Match Scheduler
cd "03 - MatchScheduler"
npm install && npm run dev
# Access: http://localhost:3000/api/docs

# Terminal 5 - Stats Aggregator
cd "04 - StatsAggregator"
cargo run
# Access: http://localhost:8080/api/docs

# Terminal 6 - Notification Center
cd "05 - NotificationCenter"
go run main.go
# Access: http://localhost:8080/swagger/index.html
```

### 🏗️ Option 3: Build Your Own Images

Perfect for **customization** and **CI/CD understanding**:

```bash
# Build all services locally
docker build -t team-generator ./01\ -\ TeamGenerator/
docker build -t betting-service ./02\ -\ BettingService/
docker build -t match-scheduler ./03\ -\ MatchScheduler/
docker build -t stats-aggregator ./04\ -\ StatsAggregator/
docker build -t notification-center ./05\ -\ NotificationCenter/
docker build -t forte-frontend ./06\ -\ Frontend/

# Run your custom builds
docker run -p 5000:5000 team-generator
docker run -p 8080:8080 betting-service
# ... etc
```

### ✅ Verify Setup

Check that all services are running:

```bash
# Health check script
curl -f http://localhost:5000/api/health || echo "❌ Team Generator down"
curl -f http://localhost:8080/api/health || echo "❌ Betting Service down"  
curl -f http://localhost:3000/api/health || echo "❌ Match Scheduler down"
curl -f http://localhost:8080/api/health || echo "❌ Stats Aggregator down"
curl -f http://localhost:8080/api/health || echo "❌ Notification Center down"
curl -f http://localhost:3001 || echo "❌ Frontend down"

echo "✅ All services running! Visit http://localhost:3001"
```





## 🛠️ Troubleshooting

### 🔧 Common Issues

<details>
<summary><strong>🐳 Docker Issues</strong></summary>

**Problem**: Docker build fails with "architecture not supported"
```bash
# Solution: Use multi-platform builds
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t myimage .
```

**Problem**: Container exits immediately
```bash
# Check logs
docker logs <container-id>

# Run interactively for debugging
docker run -it --entrypoint /bin/sh <image-name>
```

</details>

<details>
<summary><strong>☸️ Kubernetes Issues</strong></summary>

**Problem**: Pods stuck in Pending state
```bash
# Check node resources
kubectl describe nodes

# Check pod events
kubectl describe pod <pod-name> -n forte-workshop
```

**Problem**: Service not accessible
```bash
# Check service endpoints
kubectl get endpoints -n forte-workshop

# Test internal connectivity
kubectl run debug --image=busybox --rm -it -- nslookup <service-name>
```

</details>

<details>
<summary><strong>🌐 Network Issues</strong></summary>

**Problem**: Services can't communicate
```bash
# Check service discovery
kubectl get svc -n forte-workshop

# Test connectivity between pods
kubectl exec -it <pod-name> -- curl http://<service-name>:port/health
```

**Problem**: Frontend can't reach APIs
```bash
# Check CORS configuration
# Verify API endpoints are accessible
curl -i http://localhost:5000/api/health
```

</details>

### 📋 Health Check Endpoints

All services provide health check endpoints:

| Service | Health Endpoint | Expected Response |
|---------|----------------|-------------------|
| Team Generator | `GET /api/health` | `{"status": "healthy"}` |
| Betting Service | `GET /api/health` | `{"status": "ok"}` |
| Match Scheduler | `GET /api/health` | `{"success": true}` |
| Stats Aggregator | `GET /api/health` | `{"status": "healthy"}` |
| Notification Center | `GET /api/health` | `{"status": "ok"}` |
| Frontend | `GET /health` | `200 OK` |

## 📚 Learning Resources

### 🎓 Recommended Learning Path

<div align="center">

| Phase | Topic | Resources | Duration |
|-------|-------|-----------|----------|
| **1** | **Container Basics** | [Docker Documentation](https://docs.docker.com/) | 1-2 weeks |
| **2** | **Kubernetes Core** | [Kubernetes.io Tutorials](https://kubernetes.io/docs/tutorials/) | 2-3 weeks |
| **3** | **Microservices** | [Microservices.io](https://microservices.io/) | 2-4 weeks |
| **4** | **Observability** | [CNCF Landscape](https://landscape.cncf.io/) | 1-2 weeks |
| **5** | **Advanced Topics** | Service Mesh, GitOps | Ongoing |

</div>

### 🔗 External Resources

<details>
<summary><strong>📖 Documentation & Tutorials</strong></summary>

**Kubernetes:**
- [Official Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes by Example](https://kubernetesbyexample.com/)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

**Docker & Containers:**
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Container Best Practices](https://cloud.google.com/architecture/best-practices-for-building-containers)

**Microservices Architecture:**
- [Building Microservices (O'Reilly)](https://www.oreilly.com/library/view/building-microservices/9781491950340/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [API Design Guide](https://cloud.google.com/apis/design)

</details>

<details>
<summary><strong>🛠️ Tools & Platforms</strong></summary>

**Development:**
- [Visual Studio Code](https://code.visualstudio.com/) with Kubernetes extension
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

**Local Kubernetes:**
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Kind](https://kind.sigs.k8s.io/)
- [k3s](https://k3s.io/)

**Cloud Providers:**
- [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine)
- [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)
- [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/)

</details>

<details>
<summary><strong>🎥 Videos & Courses</strong></summary>

**YouTube Channels:**
- [TechWorld with Nana](https://www.youtube.com/c/TechWorldwithNana)
- [That DevOps Guy](https://www.youtube.com/c/MarcelDempers)
- [CNCF](https://www.youtube.com/c/CloudNativeComputingFoundation)

**Online Courses:**
- [Kubernetes for Developers (Linux Foundation)](https://training.linuxfoundation.org/training/kubernetes-for-developers/)
- [Docker and Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/)

</details>

### 🏗️ Architecture Deep Dives

- **📊 C4 Model**: [Detailed Architecture Documentation](documentation/diagrams/c4/README.md)
- **🔄 Service Integration Patterns**: See individual service README files

---

<div align="center">

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**🎓 Educational Use**: This project is designed for educational purposes as part of the Forte K8s Workshop. Feel free to use, modify, and distribute for learning and teaching.

---

[⬆️ Back to Top](#-forte-k8s-workshop)

</div>