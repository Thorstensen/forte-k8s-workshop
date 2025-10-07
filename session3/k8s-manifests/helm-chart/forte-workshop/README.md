# Forte Workshop Helm Chart

A Helm chart for deploying the Forte K8s Workshop microservices platform to Kubernetes.

## Prerequisites

- Kubernetes cluster (k3s recommended for workshop)
- Helm 3.x installed
- kubectl configured to access your cluster

## Installing Helm

### Linux/Mac
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Windows (PowerShell)
```powershell
choco install kubernetes-helm
# or
scoop install helm
```

## Quick Start

### 1. Customize Values

Edit `values.yaml` to match your environment:

```yaml
ingress:
  hosts:
    frontend: 127.0.0.1.nip.io              # Change to your domain
    teamGenerator: team.127.0.0.1.nip.io
    # ... update all hosts
```

### 2. Install the Chart

**Using k3s kubectl:**
```bash
# Set Helm to use k3s kubectl
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Install the chart
helm install forte-workshop ./forte-workshop
```

**Using regular kubectl:**
```bash
helm install forte-workshop ./forte-workshop
```

### 3. Verify Installation

```bash
# Check all resources
kubectl get all -n workshop

# Check pods are running
kubectl get pods -n workshop

# Check ingress
kubectl get ingress -n workshop
```

## Configuration

The following table lists the configurable parameters of the chart and their default values.

### Global Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `namespace` | Kubernetes namespace | `workshop` |
| `image.registry` | Docker image registry | `ghcr.io/thorstensen/forte-k8s-workshop` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |

### Ingress Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `traefik` |
| `ingress.hosts.frontend` | Frontend hostname | `127.0.0.1.nip.io` |
| `ingress.hosts.teamGenerator` | Team Generator hostname | `team.127.0.0.1.nip.io` |
| ... | Other service hosts | ... |

### Service Configuration

Each service has the following configurable parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `<service>.enabled` | Enable this service | `true` |
| `<service>.replicaCount` | Number of replicas | `1` |
| `<service>.image.repository` | Image repository name | Service name |
| `<service>.image.tag` | Image tag | `latest` |
| `<service>.resources.requests` | Resource requests | Varies |
| `<service>.resources.limits` | Resource limits | Varies |

## Workshop Features

### ConfigMaps

The chart demonstrates ConfigMap usage in two ways:

1. **Frontend** - File mount:
   ```yaml
   frontend:
     config:
       # URLs auto-generated from ingress.hosts
   ```

2. **Match Scheduler** - Environment variables:
   ```yaml
   matchScheduler:
     config:
       port: "3000"
       allowedOrigins: "..."
   ```

### Secrets

Optional secret for Stats Aggregator:

```yaml
statsAggregator:
  secret:
    enabled: true
    externalApiKey: "your-api-key"  # Will be base64 encoded
```

### Persistent Volumes

Match Event Logger uses a PVC for persistent logs:

```yaml
matchEventLogger:
  persistence:
    enabled: true
    size: 1Gi
    accessMode: ReadWriteOnce
```

## Common Operations

### Update Configuration

```bash
# Edit values
nano values.yaml

# Upgrade release
helm upgrade forte-workshop ./forte-workshop
```

### Update Single Service

```bash
# Update specific image
helm upgrade forte-workshop ./forte-workshop \
  --set frontend.image.tag=v2.0

# Or edit values and upgrade
helm upgrade forte-workshop ./forte-workshop
```

### Rollback

```bash
# View release history
helm history forte-workshop

# Rollback to previous version
helm rollback forte-workshop

# Rollback to specific revision
helm rollback forte-workshop 2
```

### Scale Services

```bash
# Scale via Helm
helm upgrade forte-workshop ./forte-workshop \
  --set frontend.replicaCount=3

# Or scale directly with kubectl
kubectl scale deployment/frontend --replicas=3 -n workshop
```

## Uninstall

```bash
# Uninstall the release
helm uninstall forte-workshop

# Clean up namespace (if needed)
kubectl delete namespace workshop
```

## Troubleshooting

### Check Helm Release Status

```bash
helm status forte-workshop
helm list
```

### View Generated Manifests

```bash
# Preview what Helm will create (dry-run)
helm install forte-workshop ./forte-workshop --dry-run --debug
```

### Check Pod Issues

```bash
kubectl get pods -n workshop
kubectl describe pod <pod-name> -n workshop
kubectl logs <pod-name> -n workshop
```

### Ingress Not Working

1. Verify ingress is created:
   ```bash
   kubectl get ingress -n workshop
   kubectl describe ingress forte-workshop-ingress -n workshop
   ```

2. Check if ingress controller is running (k3s uses Traefik):
   ```bash
   kubectl get pods -n kube-system | grep traefik
   ```

3. Test service directly:
   ```bash
   kubectl port-forward -n workshop svc/frontend 8080:80
   # Access http://localhost:8080
   ```

### ConfigMap Changes Not Reflecting

ConfigMap changes require pod restart:

```bash
kubectl rollout restart deployment/frontend -n workshop
```

### PVC Not Binding

```bash
# Check PVC status
kubectl get pvc -n workshop

# Describe PVC for events
kubectl describe pvc match-event-logger-pvc -n workshop

# Check storage classes
kubectl get storageclass
```

## Development

### Testing Chart Changes

```bash
# Lint the chart
helm lint ./forte-workshop

# Template and review output
helm template forte-workshop ./forte-workshop > output.yaml

# Dry-run install
helm install forte-workshop ./forte-workshop --dry-run --debug
```

### Package Chart

```bash
# Package the chart
helm package ./forte-workshop

# This creates forte-workshop-1.0.0.tgz
```

## Workshop Exercises

### Exercise 1: ConfigMap Updates

1. Update frontend URLs in `values.yaml`
2. Upgrade the Helm release
3. Restart frontend pod
4. Verify new URLs are loaded

### Exercise 2: Secret Management

1. Enable stats aggregator secret
2. Add your API key to `values.yaml`
3. Upgrade release
4. Verify secret is mounted

### Exercise 3: Volume Persistence

1. Deploy match-event-logger
2. Log some events via API
3. Delete the pod
4. Verify data persists after restart

## Additional Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)
- [k3s Documentation](https://docs.k3s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
