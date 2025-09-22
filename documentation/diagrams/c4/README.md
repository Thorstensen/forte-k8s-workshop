# C4 Model Architecture Diagrams

This directory contains C4 Model architecture diagrams for the Forte K8s Workshop project. The C4 model provides a hierarchical way to visualize software architecture at different levels of detail.

## Diagrams

### Level 1: System Context
- **File**: `context.puml`
- **Description**: Shows how the Forte Football Platform fits into the broader ecosystem
- **Audience**: Non-technical stakeholders, project managers

### Level 2: Container Diagram
- **File**: `container.puml`
- **Description**: Shows the microservices architecture and how containers interact
- **Audience**: Software architects, technical leads

### Level 3: Component Diagrams
- **File**: `frontend-components.puml`
- **Description**: Internal structure of the React TypeScript frontend
- **Audience**: Frontend developers

- **File**: `team-generator-components.puml`
- **Description**: Clean Architecture components of the Team Generator service
- **Audience**: Backend developers working on C# services

## Viewing the Diagrams

### Online Viewers
1. **PlantUML Web Server**: http://www.plantuml.com/plantuml/uml/
   - Copy and paste the `.puml` file content
   - Get instant rendering

2. **GitHub**: GitHub automatically renders PlantUML diagrams in markdown
   - View directly in the repository

### Local Tools
1. **Visual Studio Code**: Install the "PlantUML" extension
2. **IntelliJ IDEA**: Built-in PlantUML support
3. **PlantUML JAR**: Download and run locally with Java

### Command Line
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG images
puml generate context.puml
puml generate container.puml
puml generate frontend-components.puml
puml generate team-generator-components.puml
```

## Architecture Principles

### Microservices Design
- **Shared Data Consistency**: Services use shared IDs (team-1 to team-6) without direct communication
- **Technology Diversity**: Each service uses different technology stacks for learning purposes
- **Container-First**: All services are containerized for Kubernetes deployment

### Frontend Architecture
- **API-First**: Frontend communicates with all services via REST APIs
- **Component-Based**: React components for each major feature area
- **Type Safety**: Full TypeScript implementation with shared type definitions

### Clean Architecture (Team Generator)
- **Separation of Concerns**: Clear layers with dependency inversion
- **Domain-Driven Design**: Core business logic in domain layer
- **Testability**: Interfaces and dependency injection for easy testing

## Key Technologies

| Service | Language | Framework | Purpose |
|---------|----------|-----------|---------|
| Frontend | TypeScript | React + Vite | User interface |
| Team Generator | C# | .NET Core | Team management |
| Match Scheduler | TypeScript | Express | Match scheduling |
| Betting Service | Python | FastAPI | Betting odds and placement |
| Stats Aggregator | Rust | Axum | Match statistics |
| Notification Center | Go | Gorilla Mux | Real-time notifications |

## Shared ID Strategy

All services implement consistent entity IDs to enable data correlation without service-to-service communication:

- **Team IDs**: team-1, team-2, team-3, team-4, team-5, team-6
- **Match IDs**: match-1, match-2, match-3, etc.

This approach allows the frontend to correlate data across services while maintaining microservice independence.