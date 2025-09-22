# Converting Kubernetes YAML to Helm Charts

This directory demonstrates how to convert the existing Kubernetes YAML files in the `deploy/` folders to Helm charts. Each service now has its own Helm chart located in its respective service directory under `helm-chart/`.

## Current Structure vs Helm Approach

### Current YAML Structure

Each service currently has individual YAML files:
```
01 - TeamGenerator/deploy/
├── 01-namespace.yaml      # Creates 'teamgenerator' namespace
├── 02-deployment.yaml     # Creates ReplicaSet (should be Deployment)
└── 03-service.yaml        # Creates ClusterIP service

02 - BettingService/deploy/
├── 01-namespace.yaml      # Creates 'bettingservice' namespace
├── 02-deployment.yaml     # Creates ReplicaSet
└── 03-service.yaml        # Creates ClusterIP service

# ... similar structure for other services
```

### New Helm Structure

Each service now has its own Helm chart:
```
01 - TeamGenerator/helm-chart/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration
└── templates/
    ├── _helpers.tpl         # Template helpers
    ├── namespace.yaml       # Templated namespace
    ├── deployment.yaml      # Templated deployment (not ReplicaSet)
    ├── service.yaml         # Templated service
    └── serviceaccount.yaml  # Service account for security

02 - BettingService/helm-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── _helpers.tpl
    ├── namespace.yaml
    ├── deployment.yaml
    ├── service.yaml
    └── serviceaccount.yaml

# ... and so on for all 6 services
```

### Issues with Current Approach

1. **Duplication**: Each service repeats similar YAML structure
2. **Hard-coded values**: No easy way to change configuration per environment
3. **Manual management**: No versioning or rollback capabilities
4. **ReplicaSets instead of Deployments**: Missing rolling update features
5. **No health checks**: Missing liveness/readiness probes
6. **Resource limits**: No CPU/memory constraints defined

## Helm Chart Solutions

### 1. Individual Service Charts

Each microservice gets its own Helm chart with templated values in its service directory:

```
01 - TeamGenerator/helm-chart/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration
└── templates/
    ├── _helpers.tpl         # Template helpers
    ├── namespace.yaml       # Templated namespace
    ├── deployment.yaml      # Templated deployment (not ReplicaSet)
    ├── service.yaml         # Templated service
    └── serviceaccount.yaml  # Service account for security
```

**Benefits:**
- Environment-specific values files
- Proper Deployments with rolling updates
- Health checks and resource limits
- Version management and rollbacks
- Consistent labeling and naming

### 2. Umbrella Chart Approach

A single chart that manages all microservices:

```
helm-charts/football-scheduling-platform/
├── Chart.yaml              # Main chart with dependencies
├── values.yaml             # Configuration for all services
└── charts/                 # Sub-charts or dependencies
```

**Benefits:**
- Single command deploys entire platform
- Coordinated updates across services
- Shared configuration values
- Dependency management

### 3. Template Library Approach

A reusable template library for microservices:

```
helm-charts/microservice-template/
├── Chart.yaml              # Library chart
└── templates/
    └── _microservice.tpl    # Reusable templates
```

**Benefits:**
- DRY (Don't Repeat Yourself) principles
- Consistent patterns across services
- Centralized template maintenance

## Key Improvements with Helm

### 1. Configuration Management

**Current (hardcoded):**
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: teamgenerator
  namespace: teamgenerator
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: teamgenerator
        image: ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest
        ports:
        - containerPort: 8080
```

**Helm (templated):**
```yaml
apiVersion: apps/v1
kind: Deployment  # Better than ReplicaSet
metadata:
  name: {{ include "team-generator.fullname" . }}
  namespace: {{ .Values.namespace.name }}
  labels:
    {{- include "team-generator.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.app.port }}
        livenessProbe:
          httpGet:
            path: {{ .Values.healthCheck.path }}
            port: http
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

### 2. Environment-Specific Deployments

```bash
# Development
helm install team-generator ./team-generator -f values-dev.yaml

# Staging  
helm install team-generator ./team-generator -f values-staging.yaml

# Production
helm install team-generator ./team-generator -f values-prod.yaml
```

### 3. Easy Updates and Rollbacks

```bash
# Update to new version
helm upgrade team-generator ./team-generator --set image.tag=v2.0.0

# Rollback if issues
helm rollback team-generator 1
```

## Deployment Examples

### Individual Service Deployment

```bash
# Install team-generator service
helm install team-generator ./01\ -\ TeamGenerator/helm-chart

# Install with custom values
helm install team-generator ./01\ -\ TeamGenerator/helm-chart \
  --set replicaCount=3 \
  --set image.tag=v1.2.0 \
  --set resources.limits.cpu=500m
```

### Platform-wide Deployment

```bash
# Install entire platform
helm install football-platform ./helm-charts/football-scheduling-platform

# Install with specific services disabled
helm install football-platform ./helm-charts/football-scheduling-platform \
  --set betting-service.enabled=false \
  --set notification-center.enabled=false
```

### Environment-Specific Values

**values-prod.yaml:**
```yaml
global:
  imageTag: "v1.0.0"
  
team-generator:
  replicaCount: 3
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi

frontend:
  replicaCount: 5
  ingress:
    enabled: true
    hosts:
      - host: forte-football.example.com
```

## Migration Steps

### 1. Create Helm Charts

```bash
# Create individual charts
helm create team-generator
helm create betting-service
# ... etc

# Or use the provided charts in service directories
cd "01 - TeamGenerator/helm-chart"
helm lint .
```

### 2. Extract Values from Existing YAML

Convert hardcoded values to templated values:
- Image repositories and tags
- Replica counts
- Port numbers
- Namespace names
- Resource limits

### 3. Add Missing Features

- Convert ReplicaSets to Deployments
- Add health checks (liveness/readiness probes)
- Add resource limits and requests
- Add proper labels and selectors
- Add service accounts for security

### 4. Test and Deploy

```bash
# Validate charts
helm lint ./team-generator

# Dry run to see generated YAML
helm install --dry-run --debug team-generator ./team-generator

# Deploy
helm install team-generator ./team-generator
```

### 5. Remove Old YAML Files

Once Helm charts are working, the individual YAML files in `deploy/` folders can be removed.

## Advanced Features

### 1. Horizontal Pod Autoscaling

```yaml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

### 2. Ingress Configuration

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.forte-football.com
      paths:
        - path: /teams
          pathType: Prefix
  tls:
    - secretName: forte-tls
      hosts:
        - api.forte-football.com
```

### 3. ConfigMaps and Secrets

```yaml
config:
  database:
    host: postgres.forte.svc.cluster.local
    port: 5432
    
secrets:
  database:
    username: forte_user
    password: secure_password
```

This Helm approach provides much better maintainability, scalability, and operational capabilities compared to the current static YAML files.