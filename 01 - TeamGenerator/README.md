# Team Generator Service

A comprehensive C# .NET Core microservice for football team generation and management, built using Clean Architecture principles. This service provides team creation, retrieval, and management capabilities with consistent shared team IDs across the entire microservices ecosystem.

## Features

- **Team Generation**: Create football teams with consistent shared IDs
- **Team Management**: Full CRUD operations for team entities
- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **Shared ID Support**: Implements consistent team IDs (team-1 through team-6) for inter-service communication
- **RESTful API**: Standard HTTP endpoints with proper status codes
- **Swagger Documentation**: Interactive API documentation at `/swagger`
- **Health Monitoring**: Built-in health check endpoint
- **Containerized**: Docker support for easy deployment

## Technology Stack

- **Language**: C# 
- **Framework**: .NET Core
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API layers)
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/{id}` - Get a specific team by ID
- `POST /api/teams` - Create a new team
- `PUT /api/teams/{id}` - Update an existing team
- `DELETE /api/teams/{id}` - Delete a team

### Utility
- `GET /health` - Health check endpoint
- `GET /swagger` - Interactive API documentation

## Quick Start

### Prerequisites
- .NET 8.0 SDK or later
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone and navigate to the service**:
```bash
cd "01 - TeamGenerator"
```

2. **Restore dependencies**:
```bash
dotnet restore
```

3. **Build the solution**:
```bash
dotnet build
```

4. **Run the application**:
```bash
dotnet run --project src/TeamGenerator.Api
```

5. **Access the API**:
- Swagger UI: http://localhost:5000/swagger
- Health Check: http://localhost:5000/health
- API Base: http://localhost:5000/api/teams

### Docker

1. **Build the container**:
```bash
docker build -t team-generator .
```

2. **Run the container**:
```bash
docker run -p 5000:8080 team-generator
```

3. **Access the API at http://localhost:5000/swagger**

## Architecture

The service follows Clean Architecture principles with clear separation of concerns:

```
src/
├── TeamGenerator.Domain/        # Domain entities and business rules
│   ├── Entities/               # Team entity with shared ID mapping
│   └── Interfaces/             # Domain contracts
├── TeamGenerator.Application/   # Application logic and use cases
│   ├── UseCases/               # Business use cases
│   └── Services/               # Application services
├── TeamGenerator.Infrastructure/ # External concerns and data access
│   ├── Persistence/            # Data storage implementation
│   └── Configuration/          # Infrastructure setup
└── TeamGenerator.Api/          # Web API and controllers
    ├── Controllers/            # REST endpoints
    └── Configuration/          # API setup and Swagger
```

### Shared Team IDs

This service implements the shared team ID standard for consistency across all microservices:

| Team Name | Shared ID | Short Name |
|-----------|-----------|------------|
| Manchester United | team-1 | MUN |
| Liverpool | team-2 | LIV |
| Chelsea | team-3 | CHE |
| Arsenal | team-4 | ARS |
| Manchester City | team-5 | MCI |
| Tottenham | team-6 | TOT |

## Development

### Running Tests
```bash
dotnet test
```

### Code Style
The project follows standard C# coding conventions and includes:
- Clean Architecture patterns
- Dependency injection
- Repository pattern
- SOLID principles

### Adding New Features
1. Start with domain entities in `TeamGenerator.Domain`
2. Define use cases in `TeamGenerator.Application`
3. Implement infrastructure in `TeamGenerator.Infrastructure`
4. Add API endpoints in `TeamGenerator.Api`
5. Update this README for significant changes

## Health Monitoring

The service includes a health check endpoint at `/health` that returns:
- Service status
- Current timestamp
- Version information

Perfect for Kubernetes liveness and readiness probes or load balancer health checks.