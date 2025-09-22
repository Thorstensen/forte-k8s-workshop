# Forte Football Manager Frontend

A modern React TypeScript frontend for the Forte K8s Workshop microservices ecosystem. This service provides a beautiful, responsive web interface to interact with all the microservices in the system.

## Features

- **🏈 Match Management**: Schedule new matches, view upcoming games, and start matches with a single click
- **👥 Team Management**: View available teams and create new ones via the TeamGenerator service
- **💰 Betting Integration**: View live odds from the BettingService and place bets on matches
- **🔔 Real-time Notifications**: Monitor match events and notifications from the NotificationCenter
- **📱 Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **⚡ Modern Stack**: React 19, TypeScript, Vite, TanStack Query for optimal performance

## Architecture

```
06 - Frontend/
├── src/
│   ├── components/        # React components for each major feature
│   │   ├── Layout.tsx     # Main application layout and navigation
│   │   ├── MatchesTab.tsx # Match scheduling and management
│   │   ├── TeamsTab.tsx   # Team creation and viewing
│   │   ├── BettingTab.tsx # Betting interface with live odds
│   │   └── NotificationsTab.tsx # Real-time notification feed
│   ├── services/          # API integration layer
│   │   ├── api.ts         # Axios configuration for all services
│   │   ├── matchService.ts
│   │   ├── bettingService.ts
│   │   └── notificationService.ts
│   ├── hooks/             # React Query hooks for data fetching
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helper functions and utilities
├── Dockerfile             # Multi-stage Docker build
├── nginx.conf            # Production nginx configuration
└── package.json          # Dependencies and scripts
```

## Quick Start

### Local Development

1. **Prerequisites**:
   ```bash
   # Ensure Node.js 18+ is installed
   node --version
   npm --version
   ```

2. **Install dependencies**:
   ```bash
   cd "06 - Frontend"
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your service URLs
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3001
   - Hot reload enabled for development

### Docker Deployment

1. **Build the container**:
   ```bash
   docker build -t forte-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3001:3001 forte-frontend
   ```

3. **Access the application**: http://localhost:3001

## Service Integration

### API Endpoints Used

The frontend integrates with the following microservices:

#### Match Scheduler (Port 3000)
- `GET /api/matches` - Fetch all matches
- `POST /api/matches` - Schedule new match
- `PATCH /api/matches/:id/start` - Start a match (custom endpoint)

#### Betting Service (Port 8080)
- `GET /api/matches` - Available betting matches
- `GET /api/matches/:id/odds` - Get odds for match
- `POST /api/bets` - Place a bet

#### Notification Center (Port 8082)
- `GET /notifications` - All notifications
- `GET /notifications/important` - Important notifications only
- `GET /matches/:id/notifications` - Match-specific notifications

#### Team Generator (Port 5000)
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Generate new team

### Key Features Implementation

#### Match Management
- **Schedule Matches**: Select teams from dropdown, set date/time and venue
- **Start Matches**: Click "Start Match Now" button for scheduled matches
- **Real-time Updates**: Automatic refresh of match status and data

#### Betting Integration
- **Live Odds**: Fetches real-time betting odds when match is selected
- **Multiple Bet Types**: Support for match winner, goals, cards, etc.
- **Bet Placement**: Calculate payouts and place bets with validation

#### Notification System
- **Match Events**: Automatic notifications when matches start
- **Priority Filtering**: Separate view for important notifications
- **Real-time Updates**: Notifications refresh automatically

## Technology Stack

### Frontend
- **React 19**: Latest React with modern features
- **TypeScript**: Full type safety and better DX
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling framework

### State Management
- **TanStack Query**: Server state management and caching
- **React Hooks**: Local component state

### HTTP Client
- **Axios**: HTTP client with interceptors for logging
- **Request/Response Interceptors**: Automatic error handling

### UI Components
- **Headless UI**: Accessible React components
- **Heroicons**: Beautiful SVG icons
- **Lucide React**: Additional modern icons

### Build & Deployment
- **Vite**: Production builds with code splitting
- **Nginx**: Production web server
- **Docker**: Multi-stage containerized deployment

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production preview
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Service Integration**:
   - Add service configuration to `src/services/api.ts`
   - Create service-specific client in `src/services/`
   - Add React Query hooks in `src/hooks/useApi.ts`

2. **New UI Components**:
   - Create component in `src/components/`
   - Add to main navigation in `Layout.tsx`
   - Update `App.tsx` routing

3. **New Types**:
   - Add TypeScript interfaces to `src/types/index.ts`
   - Ensure consistency with backend service models

## Environment Variables

```bash
# Service URLs (configured for local development)
VITE_TEAM_GENERATOR_URL=http://localhost:5000
VITE_BETTING_SERVICE_URL=http://localhost:8080  
VITE_MATCH_SCHEDULER_URL=http://localhost:3000
VITE_STATS_AGGREGATOR_URL=http://localhost:8081
VITE_NOTIFICATION_CENTER_URL=http://localhost:8082
```

## Health Monitoring

The frontend includes a health check endpoint at `/health` that returns:
- Service status
- Application name

Perfect for Kubernetes liveness and readiness probes.

## Future Enhancements

- **Real-time WebSocket connections** for live match updates
- **User authentication and profiles**
- **Match statistics integration** with StatsAggregator service
- **Push notifications** for important match events
- **Mobile app** using React Native
- **Admin dashboard** for system monitoring

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling for API calls
4. Ensure responsive design for all new components
5. Update this README for significant changes