# Health Endpoints Solution - Port-Forward Compatible

## Problem
The frontend health endpoint calls were failing when running locally or when accessing a Kubernetes-deployed frontend via port-forwarding because the browser couldn't resolve Kubernetes cluster-internal DNS names.

## Root Cause
- Frontend makes HTTP requests from the browser to service health endpoints
- In development mode (`npm run dev`), the browser runs outside the Kubernetes cluster
- **When port-forwarding from cluster**, the frontend is deployed in the cluster but accessed via `kubectl port-forward`, so browser requests still come from outside the cluster
- Kubernetes DNS names are not resolvable from outside the cluster
- No ingress controller was available to expose services externally

## Solution: Dual Proxy Architecture

Implemented a dual proxy solution that works in both development and port-forwarded scenarios:

1. **Development Mode**: Vite dev server proxy routes requests to localhost services
2. **Production Mode**: NGINX proxy routes requests to Kubernetes services within the cluster

### Technical Implementation

#### 1. Vite Proxy Configuration (`vite.config.ts`) - Development Only
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

#### 2. NGINX Proxy Configuration (`nginx.conf`) - Production & Port-Forward
```nginx
location /api/proxy/teamgenerator/ {
  proxy_pass http://teamgenerator.teamgenerator.svc.cluster.local:8080/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### 3. Simplified API Configuration (`src/services/api.ts`)
```typescript
// All environments use the same proxy paths
const SERVICES = {
  TEAM_GENERATOR: import.meta.env.VITE_TEAM_GENERATOR_URL || '/api/proxy/teamgenerator',
  // ... other services
};
```

#### 4. Environment-Aware Health Display (`src/services/healthService.ts`)
- Shows proxy path with context: "(Vite dev proxy)" or "(NGINX cluster proxy)"
- Respects environment variable overrides
- Provides clear indication of the connection method

## Deployment Scenarios

| Scenario | Proxy Handler | Browser Access | Backend Access |
|----------|---------------|----------------|----------------|
| `npm run dev` | Vite | localhost:3001 | localhost:5000, 8080, etc. |
| `kubectl port-forward` | NGINX | localhost:8080 | cluster DNS |
| Direct cluster access | NGINX | cluster IP | cluster DNS |

## Service Port Mapping
| Service | Development Port | Cluster Port | Proxy Path |
|---------|------------------|--------------|------------|
| Team Generator | 5000 | 8080 | `/api/proxy/teamgenerator` |
| Betting Service | 8080 | 8080 | `/api/proxy/bettingservice` |
| Match Scheduler | 3000 | 3000 | `/api/proxy/matchscheduler` |
| Stats Aggregator | 8081 | 8080 | `/api/proxy/statsaggregator` |
| Notification Center | 8082 | 8080 | `/api/proxy/notificationcenter` |

## Usage

### Development Mode
1. Start the frontend: `npm run dev`
2. Health checks route through Vite proxy to localhost services
3. Services expected to run on their respective localhost ports

### Port-Forward Mode (Kubernetes)
1. Build and deploy frontend to cluster
2. Port-forward frontend: `kubectl port-forward service/frontend 8080:8080`
3. Access via `http://localhost:8080`
4. Health checks route through NGINX proxy to cluster services

### Direct Cluster Access
1. Deploy frontend to cluster
2. Access via cluster IP or service
3. Health checks route through NGINX proxy to cluster services

## Benefits
- ✅ **Works with port-forwarding** - The key requirement from @Thorstensen
- ✅ **No DNS configuration required**
- ✅ **No ingress controller needed** 
- ✅ **Unified proxy path approach** - Same paths work in all environments
- ✅ **Clear debugging** - Health dashboard shows actual proxy method being used
- ✅ **Production compatible** - Zero changes needed for cluster deployment

## Testing
The health dashboard now works correctly in all scenarios:
- Development mode with Vite proxy
- Port-forwarded access with NGINX proxy
- Direct cluster access with NGINX proxy

All scenarios show proper service status indicators and handle offline services gracefully.