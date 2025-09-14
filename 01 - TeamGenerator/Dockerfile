

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the whole repo so restore sees solution-level files too
COPY . .

# Restore with a simple retry
RUN dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel || \
    dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel || \
    dotnet restore src/TeamGenerator.Api/TeamGenerator.Api.csproj --disable-parallel

# Build and publish
RUN dotnet publish src/TeamGenerator.Api/TeamGenerator.Api.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "TeamGenerator.Api.dll"]