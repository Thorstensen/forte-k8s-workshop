# Comparison: Current YAML vs Helm Charts

## Current Deployment Structure

The repository currently has YAML files in each service's `deploy/` folder:

```
📁 01 - TeamGenerator/deploy/
├── 01-namespace.yaml
├── 02-deployment.yaml  
└── 03-service.yaml

📁 02 - BettingService/deploy/
├── 01-namespace.yaml
├── 02-deployment.yaml
└── 03-service.yaml

📁 03 - MatchScheduler/deploy/
├── 01-namespace.yaml
├── 02-deployment.yaml
└── 03-service.yaml

# ... and so on for all 6 services
```

## Side-by-Side Comparison

| Aspect | Current YAML Files | Helm Charts |
|--------|-------------------|-------------|
| **Configuration** | Hard-coded values | Templated with variables |
| **Environment Support** | Manual file editing | Values files per environment |
| **Deployment Type** | ReplicaSet | Deployment (with rolling updates) |
| **Health Checks** | None | Liveness/readiness probes |
| **Resource Limits** | None | CPU/memory limits defined |
| **Versioning** | None | Chart versioning + app versioning |
| **Rollbacks** | Manual | `helm rollback` command |
| **Updates** | `kubectl apply` | `helm upgrade` with diff |
| **Consistency** | Manual maintenance | Templates ensure consistency |
| **Secrets Management** | Manual | Integrated with values |
| **Dependency Management** | None | Chart dependencies |
| **Validation** | `kubectl apply --dry-run` | `helm lint` + `helm template` |

## Detailed Comparison Examples

### 1. Configuration Management

**Current (TeamGenerator namespace.yaml):**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: teamgenerator  # Hard-coded
```

**Helm (templated):**
```yaml
{{- if .Values.namespace.create }}
apiVersion: v1
kind: Namespace
metadata:
  name: {{ .Values.namespace.name }}  # Configurable
  labels:
    {{- include "team-generator.labels" . | nindent 4 }}
{{- end }}
```

### 2. Deployment Configuration

**Current (TeamGenerator deployment.yaml):**
```yaml
apiVersion: apps/v1
kind: ReplicaSet  # Limited features
metadata:
  name: teamgenerator  # Hard-coded
  namespace: teamgenerator  # Hard-coded
  labels:
    app: teamgenerator
spec:
  replicas: 1  # Fixed
  selector:
    matchLabels:
      app: teamgenerator
  template:
    metadata:
      labels:
        app: teamgenerator
    spec:
      containers:
      - name: teamgenerator
        image: ghcr.io/thorstensen/forte-k8s-workshop/team-generator:latest  # Fixed tag
        ports:
        - containerPort: 8080
        # No health checks
        # No resource limits
```

**Helm (templated deployment.yaml):**
```yaml
apiVersion: apps/v1
kind: Deployment  # Better than ReplicaSet
metadata:
  name: {{ include "team-generator.fullname" . }}  # Generated name
  namespace: {{ .Values.namespace.name }}  # Configurable
  labels:
    {{- include "team-generator.labels" . | nindent 4 }}  # Consistent labels
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}  # Configurable
  {{- end }}
  selector:
    matchLabels:
      {{- include "team-generator.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "team-generator.selectorLabels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "team-generator.serviceAccountName" . }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"  # Configurable
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.app.port }}  # Configurable
              protocol: TCP
          {{- if .Values.healthCheck.enabled }}
          livenessProbe:  # Health checks included
            httpGet:
              path: {{ .Values.healthCheck.path }}
              port: http
            initialDelaySeconds: {{ .Values.healthCheck.initialDelaySeconds }}
            periodSeconds: {{ .Values.healthCheck.periodSeconds }}
          readinessProbe:
            httpGet:
              path: {{ .Values.healthCheck.path }}
              port: http
            initialDelaySeconds: {{ .Values.healthCheck.initialDelaySeconds }}
            periodSeconds: {{ .Values.healthCheck.periodSeconds }}
          {{- end }}
          resources:  # Resource limits included
            {{- toYaml .Values.resources | nindent 12 }}
```

### 3. Environment-Specific Configuration

**Current Approach:**
- Manual editing of YAML files for each environment
- Risk of configuration drift
- No easy way to see differences between environments

**Helm Approach:**
Different values files for each environment:

**values-dev.yaml:**
```yaml
replicaCount: 1
image:
  tag: "dev"
resources:
  limits:
    cpu: 100m
    memory: 128Mi
```

**values-prod.yaml:**
```yaml
replicaCount: 3
image:
  tag: "v1.0.0"
resources:
  limits:
    cpu: 500m
    memory: 512Mi
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
```

### 4. Deployment Commands

**Current Approach:**
```bash
# Deploy all services manually
kubectl apply -f "01 - TeamGenerator/deploy/"
kubectl apply -f "02 - BettingService/deploy/"
kubectl apply -f "03 - MatchScheduler/deploy/"
kubectl apply -f "04 - StatsAggregator/deploy/"
kubectl apply -f "05 - NotificationCenter/deploy/"
kubectl apply -f "06 - Frontend/deploy/"

# Update - need to edit files manually first
kubectl apply -f "01 - TeamGenerator/deploy/"

# No easy rollback
```

**Helm Approach:**
```bash
# Deploy entire platform
helm install forte-platform ./helm-charts/forte-platform

# Deploy specific environment
helm install forte-dev ./helm-charts/forte-platform -f values-dev.yaml

# Update with new image tag
helm upgrade forte-platform ./helm-charts/forte-platform --set global.imageTag=v2.0.0

# Easy rollback
helm rollback forte-platform 1

# View history
helm history forte-platform
```

## Migration Benefits

### Immediate Benefits
1. **Proper Deployments**: Rolling updates instead of ReplicaSets
2. **Health Checks**: Built-in liveness and readiness probes
3. **Resource Management**: CPU and memory limits/requests
4. **Consistent Labeling**: Proper Kubernetes labels and selectors
5. **Service Accounts**: Better security practices

### Operational Benefits
1. **Environment Management**: Easy dev/staging/prod deployments
2. **Version Control**: Track chart versions and app versions
3. **Rollback Capability**: Quick rollback to previous versions
4. **Configuration Management**: Centralized values management
5. **Dependency Tracking**: Manage service dependencies

### Development Benefits
1. **DRY Principle**: Reusable templates reduce duplication
2. **Validation**: Built-in linting and template validation
3. **Documentation**: Self-documenting through values.yaml
4. **Testing**: Dry-run capabilities before deployment
5. **Consistency**: Templates ensure all services follow best practices

## Migration Path

1. **Phase 1**: Create Helm charts alongside existing YAML
2. **Phase 2**: Test Helm deployments in development
3. **Phase 3**: Migrate staging environments to Helm
4. **Phase 4**: Migrate production to Helm
5. **Phase 5**: Remove old YAML files

This approach provides a safe migration path while gaining all the benefits of Helm's package management and templating capabilities.