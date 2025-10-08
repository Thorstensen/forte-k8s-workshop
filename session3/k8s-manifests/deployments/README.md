# Deployment Manifests

This directory contains Kubernetes Deployment and Service manifests for all microservices in the workshop.

## Available Deployments

| Service | File | Container Port | Image |
|---------|------|----------------|-------|
| Frontend | `frontend-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest` |
| Team Generator | `team-generator-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest` |
| Betting Service | `betting-service-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/betting-service:latest` |
| Match Scheduler | `match-scheduler-deployment.yaml` | 3000 | `ghcr.io/thorstensen/forte-k8s-workshop/match-scheduler:latest` |
| Stats Aggregator | `stats-aggregator-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/stats-aggregator:latest` |
| Notification Center | `notification-center-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/notification-center:latest` |
| Match Event Logger | `match-event-logger-deployment.yaml` | 8080 | `ghcr.io/thorstensen/forte-k8s-workshop/match-event-logger:latest` |

## Quick Deploy All Services

```bash
# Deploy all services at once
kubectl apply -f k8s-manifests/deployments/

# Or deploy individually in order
kubectl apply -f k8s-manifests/deployments/team-generator-deployment.yaml
kubectl apply -f k8s-manifests/deployments/betting-service-deployment.yaml
kubectl apply -f k8s-manifests/deployments/match-scheduler-deployment.yaml
kubectl apply -f k8s-manifests/deployments/stats-aggregator-deployment.yaml
kubectl apply -f k8s-manifests/deployments/notification-center-deployment.yaml
kubectl apply -f k8s-manifests/deployments/match-event-logger-deployment.yaml
kubectl apply -f k8s-manifests/deployments/frontend-deployment.yaml
```

## What's Included

Each deployment manifest includes:

### Deployment
- **Replicas**: 1 (suitable for workshop environment)
- **Labels**: Proper app and tier labels for organization
- **Resource Limits**: CPU and memory requests/limits
- **Health Probes**:
  - Liveness probe: Restarts pod if unhealthy
  - Readiness probe: Controls traffic routing
- **Container Configuration**: Image, ports, environment variables

### Service
- **Type**: ClusterIP (internal cluster access)
- **Port**: 80 (standard HTTP port)
- **Target Port**: Maps to container port (varies by service)
- **Selector**: Routes traffic to matching pods

## Features by Service

### Frontend
- **ConfigMap Mount**: Loads runtime configuration from `frontend-config` ConfigMap
- **Volume Mount**: `/usr/share/nginx/html/config.js`
- **Special**: Requires ConfigMap with ingress URLs before deployment

### Team Generator
- **Language**: C# .NET Core
- **Port**: 8080
- **Health**: `/api/health`

### Betting Service
- **Language**: Python FastAPI
- **Port**: 8080
- **Health**: `/api/health`

### Match Scheduler
- **Language**: TypeScript/Express
- **Port**: 3000
- **ConfigMap**: Environment variables from `match-scheduler-config`
- **Health**: `/api/health`

### Stats Aggregator
- **Language**: Rust/Axum
- **Port**: 8080
- **Secret**: Optional `EXTERNAL_API_KEY` from `stats-aggregator-secret`
- **Health**: `/api/health`

### Notification Center
- **Language**: Go
- **Port**: 8080
- **Health**: `/api/health`

### Match Event Logger
- **Language**: Python FastAPI
- **Port**: 8080
- **Volume**: PersistentVolume mounted at `/var/log/match-events`
- **Special**: Uses PVC for persistent log storage
- **Health**: `/api/health`

## Checking Deployment Status

```bash
# View all deployments
kubectl get deployments -n workshop

# View all pods
kubectl get pods -n workshop

# View all services
kubectl get services -n workshop

# View detailed pod information
kubectl describe pod <pod-name> -n workshop

# View pod logs
kubectl logs <pod-name> -n workshop

# Follow logs in real-time
kubectl logs -f deployment/<deployment-name> -n workshop
```

## Scaling Services

```bash
# Scale a deployment
kubectl scale deployment/frontend --replicas=3 -n workshop

# Note: match-event-logger cannot be scaled beyond 1 replica
# because it uses a ReadWriteOnce PersistentVolumeClaim
```

## Updating Deployments

```bash
# Update image version
kubectl set image deployment/frontend frontend=ghcr.io/thorstensen/forte-k8s-workshop/frontend:v2 -n workshop

# Rollout restart (useful after ConfigMap changes)
kubectl rollout restart deployment/frontend -n workshop

# Check rollout status
kubectl rollout status deployment/frontend -n workshop

# Rollback to previous version
kubectl rollout undo deployment/frontend -n workshop
```

## Troubleshooting

### Pod Won't Start

```bash
# Check pod events
kubectl describe pod <pod-name> -n workshop

# Common issues:
# - ImagePullBackOff: Image doesn't exist or is private
# - CrashLoopBackOff: Container keeps crashing
# - Pending: Not enough resources or PVC not bound
```

### Health Check Failing

```bash
# View logs for errors
kubectl logs <pod-name> -n workshop

# Check if service is listening on correct port
kubectl exec -it <pod-name> -n workshop -- netstat -tulpn

# Test health endpoint manually
kubectl exec -it <pod-name> -n workshop -- wget -O- http://localhost:8080/api/health
```

### Service Not Accessible

```bash
# Verify service endpoints
kubectl get endpoints -n workshop

# Check if pods are ready
kubectl get pods -n workshop

# Test service directly
kubectl run -it --rm debug --image=busybox --restart=Never -n workshop -- wget -O- http://match-scheduler/api/health
```

## Resource Requirements

Total resource requirements for all services:

**Requests (minimum):**
- CPU: ~800m (0.8 cores)
- Memory: ~1.5Gi

**Limits (maximum):**
- CPU: ~2700m (2.7 cores)
- Memory: ~3Gi

Ensure your k3s cluster has sufficient resources.

## Dependencies

Before deploying:
1. ✅ Namespace created: `kubectl create namespace workshop`
2. ✅ ConfigMaps applied: `kubectl apply -f k8s-manifests/configmaps/`
3. ✅ Secrets applied (optional): `kubectl apply -f k8s-manifests/secrets/`
4. ✅ PVC created: `kubectl apply -f k8s-manifests/volumes/`

## Next Steps

After deploying all services:
1. Set up Ingress rules (see your ingress configuration)
2. Update frontend ConfigMap with correct URLs
3. Test each service via ingress
4. Try the workshop exercises
