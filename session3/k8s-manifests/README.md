# Kubernetes Manifests

This directory contains the Helm chart and plain YAML manifests for deploying the Forte K8s Workshop services.

## Quick Links

- **Setup Guide**: [../SETUP.md](../SETUP.md) - Get your kind cluster running
- **Workshop Exercises**:
  - [Part 1: ConfigMaps](../EXERCISES-PART1-CONFIGMAPS.md)
  - [Part 2: Secrets](../EXERCISES-PART2-SECRETS.md)
  - [Part 3: Persistent Volumes](../EXERCISES-PART3-VOLUMES-AND-CHALLENGE.md)

## Directory Structure

```
k8s-manifests/
├── helm-chart/          # Helm chart (RECOMMENDED)
│   └── forte-workshop/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-local.yaml
│       ├── templates/
│       └── README.md
├── configmaps/          # Example ConfigMap manifests
├── secrets/             # Example Secret manifests
├── volumes/             # Example PVC manifests
└── deployments/         # Example Deployment manifests
```

## Deployment with Helm (Recommended)

### Quick Start

```bash
# Navigate to Helm chart
cd k8s-manifests/helm-chart/forte-workshop

# Install with kind-optimized values
helm install forte-workshop .

# Check status
kubectl get pods -n workshop
```

### Customizing Values

Create your own values file:

```bash
cp values.yaml my-values.yaml
# Edit my-values.yaml with your preferred settings
helm install forte-workshop . -f my-values.yaml
```

### Upgrading

```bash
# After making changes to values or templates
helm upgrade forte-workshop . -f values.yaml

# Or update specific values
helm upgrade forte-workshop . --set frontend.replicaCount=2 --reuse-values
```

### Uninstalling

```bash
helm uninstall forte-workshop
kubectl delete namespace workshop
```

## Plain YAML Manifests

The `configmaps/`, `secrets/`, `volumes/`, and `deployments/` directories contain example YAML manifests for learning purposes.

**Note**: These are primarily for educational reference. The Helm chart is the recommended deployment method as it handles templating and dependencies.

### Deploying with Plain YAML

```bash
# Create namespace
kubectl create namespace workshop

# Apply in order
kubectl apply -f volumes/
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/

# Check status
kubectl get all -n workshop
```

## What's Deployed

When you install the Helm chart, you get:

### Services
- **Frontend** (React) - Main web interface
- **Team Generator** (C#) - Generates football teams
- **Betting Service** (Python) - Handles betting
- **Match Scheduler** (Node.js) - Schedules matches
- **Stats Aggregator** (Rust) - Aggregates statistics
- **Notification Center** (Go) - Sends notifications
- **Match Event Logger** (Python) - Logs match events with persistent storage

### Kubernetes Resources
- **Namespace**: `workshop`
- **Deployments**: One per service (7 total)
- **Services**: ClusterIP services for internal communication
- **Ingress**: Single ingress with routes to all services
- **ConfigMaps**:
  - `frontend-config` - API URLs (mounted as file)
  - `match-scheduler-config` - Environment variables
- **Secret**: `stats-aggregator-secret` - Example API key
- **PersistentVolumeClaim**: `match-event-logger-pvc` - 1Gi storage for logs

## Accessing Services

After deployment, access services via ingress:

- **Frontend**: http://127.0.0.1.nip.io
- **Team Generator**: http://team.127.0.0.1.nip.io/swagger
- **Betting Service**: http://bet.127.0.0.1.nip.io/api/docs
- **Match Scheduler**: http://schedule.127.0.0.1.nip.io/api/docs
- **Stats Aggregator**: http://stats.127.0.0.1.nip.io/api/docs
- **Notification Center**: http://notify.127.0.0.1.nip.io/swagger/index.html
- **Match Event Logger**: http://logger.127.0.0.1.nip.io/api/docs

## Workshop Learning Features

This deployment demonstrates key Kubernetes concepts:

### 1. ConfigMaps
- **File mount**: Frontend `config.js` for API URLs
- **Environment variables**: Match Scheduler configuration
- **Use case**: Runtime configuration without image rebuilds

### 2. Secrets
- **Stats Aggregator**: Optional API key (base64 encoded)
- **Use case**: Sensitive data storage

### 3. Persistent Volumes
- **Match Event Logger**: Daily log files persisted to PVC
- **Use case**: Data persistence across pod restarts

See [the workshop exercises](../EXERCISES-PART1-CONFIGMAPS.md) for hands-on exercises with these concepts.

## Helm Chart Details

### Template Organization

```
templates/
├── namespace.yaml           # Workshop namespace
├── _helpers.tpl            # Template functions
├── configmap-*.yaml        # ConfigMaps for each service
├── secret-*.yaml           # Secrets
├── pvc-*.yaml              # PersistentVolumeClaims
├── deployment-*.yaml       # Deployments and Services
└── ingress.yaml            # Single ingress for all services
```

### Key Template Functions

Defined in `_helpers.tpl`:

- `forte-workshop.image` - Constructs full image path
- `forte-workshop.labels` - Standard labels for all resources
- `forte-workshop.selectorLabels` - Pod selector labels

### Values Structure

See `values.yaml` for defaults and `values.yaml` for kind-specific overrides.

Key sections:
- `namespace` - Target namespace
- `image` - Global image registry and pull policy
- `ingress` - Ingress configuration and hostnames
- `<service>` - Per-service configuration (image, resources, config)
- `healthProbes` - Default health check settings

## Troubleshooting

### Pods not starting

```bash
kubectl get pods -n workshop
kubectl describe pod <pod-name> -n workshop
kubectl logs <pod-name> -n workshop
```

### Image pull errors

Check image configuration:
```bash
kubectl get pod <pod-name> -n workshop -o jsonpath='{.spec.containers[0].image}'
```

For local testing with registry, ensure:
1. Registry container is running: `docker ps | grep registry`
2. Registry connected to kind network: `docker network connect kind registry`
3. kind cluster has containerd config for insecure registry (see kind-config.yaml)

### ConfigMap not updating

After editing a ConfigMap, restart the deployment:
```bash
kubectl rollout restart deployment/<name> -n workshop
```

### Ingress not working

Check ingress controller:
```bash
kubectl get pods -n ingress-nginx
kubectl get ingress -n workshop
```

Test service directly:
```bash
kubectl port-forward -n workshop svc/<service-name> 8080:80
# Access at http://localhost:8080
```

### PVC not binding

Check storage class and PVC status:
```bash
kubectl get storageclass
kubectl get pvc -n workshop
kubectl describe pvc <pvc-name> -n workshop
```

## Additional Resources

- [Helm Chart README](helm-chart/forte-workshop/README.md) - Detailed Helm documentation
- [Setup Guide](../SETUP.md) - Installation instructions
- [Workshop Exercises](../EXERCISES.md) - Hands-on learning
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
