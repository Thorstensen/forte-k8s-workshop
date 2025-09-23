# Health Endpoints Solution

## Problem
The frontend health endpoint calls were failing when running locally because the browser couldn't resolve Kubernetes cluster-internal DNS names like `statsaggregator.statsaggregator.svc.cluster.local:8080`.

## Root Cause
- Frontend makes HTTP requests from the browser to service health endpoints
- In development mode (`npm run dev`), the browser runs outside the Kubernetes cluster
- Kubernetes DNS names are not resolvable from outside the cluster
- No ingress controller was available to expose services externally

## Solution: Development Proxy
Implemented a Vite development server proxy that:

1. **Intercepts health check requests** during development
2. **Proxies them to localhost services** using the correct ports
3. **Maintains production compatibility** by using environment detection

### Technical Implementation

#### 1. Vite Proxy Configuration (`vite.config.ts`)
```typescript
proxy: {
  '^/api/proxy/teamgenerator': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/proxy\/teamgenerator/, ''),
  },
  // ... other services
}
```

#### 2. Environment-Aware API Configuration (`src/services/api.ts`)
```typescript
const isDevelopment = import.meta.env.DEV;

const SERVICES = {
  TEAM_GENERATOR: import.meta.env.VITE_TEAM_GENERATOR_URL || 
    (isDevelopment ? '/api/proxy/teamgenerator' : 'http://teamgenerator.teamgenerator.svc.cluster.local:8080'),
  // ... other services
};
```

#### 3. Dynamic Endpoint Display (`src/services/healthService.ts`)
- Shows actual endpoints being used (proxy URLs in dev, K8s DNS in production)
- Provides clear indication of the connection method

## Service Port Mapping
| Service | Development Port | Proxy Path |
|---------|------------------|------------|
| Team Generator | 5000 | `/api/proxy/teamgenerator` |
| Betting Service | 8080 | `/api/proxy/bettingservice` |
| Match Scheduler | 3000 | `/api/proxy/matchscheduler` |
| Stats Aggregator | 8081 | `/api/proxy/statsaggregator` |
| Notification Center | 8082 | `/api/proxy/notificationcenter` |

## Usage

### Development Mode
1. Start the frontend: `npm run dev`
2. Health checks automatically use proxy endpoints
3. Services are expected to run on their respective localhost ports

### Production Mode
1. Build the frontend: `npm run build`
2. Deploy to Kubernetes cluster
3. Health checks automatically use Kubernetes DNS names

## Benefits
- ✅ **No DNS configuration required**
- ✅ **No ingress controller needed**
- ✅ **Works in both development and production**
- ✅ **Minimal code changes**
- ✅ **Automatic environment detection**
- ✅ **Clear endpoint visibility in health dashboard**

## Testing
The health dashboard now works correctly in development mode, showing:
- Service status (online/offline)
- Actual endpoints being contacted
- Last check timestamps
- Clear error handling when services are unavailable