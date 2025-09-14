# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files
COPY src/TeamGenerator.Api/TeamGenerator.Api.csproj ./src/TeamGenerator.Api/
COPY src/TeamGenerator.Application/TeamGenerator.Application.csproj ./src/TeamGenerator.Application/
COPY src/TeamGenerator.Domain/TeamGenerator.Domain.csproj ./src/TeamGenerator.Domain/
COPY src/TeamGenerator.Infrastructure/TeamGenerator.Infrastructure.csproj ./src/TeamGenerator.Infrastructure/

# Restore packages with retry mechanism
RUN dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel || \
    dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel || \
    dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel

# Copy source code
COPY src/ ./src/

# Build and publish
RUN dotnet publish src/TeamGenerator.Api/TeamGenerator.Api.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

# Expose port 8080 (standard for ASP.NET Core in containers)
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["dotnet", "TeamGenerator.Api.dll"]