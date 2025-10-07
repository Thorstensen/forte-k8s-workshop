# Forte K8s Workshop Session 3 Setup Guide

## Prerequisites

### Required Software

1. **Docker Desktop** (Windows/Mac) or **Docker** (Linux)
   - Windows/Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Linux: Install via package manager

2. **kubectl** - Kubernetes command-line tool

   **Windows (PowerShell):**
   ```powershell
   choco install kubernetes-cli
   # or
   scoop install kubectl
   ```

   **Mac:**
   ```bash
   brew install kubectl
   ```

3. **kind** - Kubernetes in Docker

   **Windows (PowerShell):**
   ```powershell
   choco install kind
   # or
   scoop install kind
   ```

   **Mac:**
   ```bash
   brew install kind
   ```

4. **Helm 3** - Kubernetes package manager

   **Windows (PowerShell):**
   ```powershell
   choco install kubernetes-helm
   # or
   scoop install helm
   ```

   **Mac:**
   ```bash
   brew install helm
   ```

### Verify Installation

```bash
docker --version
kubectl version --client
kind version
helm version
```

## Cluster Setup

### 1. Create kind Cluster

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/Thorstensen/forte-k8s-workshop.git
cd forte-k8s-workshop/session3

# Create cluster with ingress support
# Linux/Mac:
kind create cluster --config kind-config.yaml

# Windows (if port 80/443 are blocked):
kind create cluster --config kind-config-windows.yaml

# Verify cluster is running
kubectl cluster-info
kubectl get nodes
```

**Windows Note**: If you get an error about port 80 being unavailable, use `kind-config-windows.yaml` which maps to ports 8080/8443 instead. You'll then access services at `http://127.0.0.1.nip.io:8080` instead of `http://127.0.0.1.nip.io`.

**Expected output:**
```
Creating cluster "forte-workshop" ...
 ✓ Ensuring node image (kindest/node:v1.31.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-forte-workshop"
```

### 2. Install NGINX Ingress Controller

```bash
# Install ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

**Verify ingress is running:**
```bash
kubectl get pods -n ingress-nginx
```

You should see the ingress-nginx-controller pod in `Running` state.

### 3. Deploy Workshop Services

Navigate to the Helm chart directory:

```bash
cd k8s-manifests/helm-chart/forte-workshop
```

**Option A: Quick deploy with default values**
```bash
# Linux/Mac (using port 80):
helm install forte-workshop .

# Windows (using port 8080):
# First, edit values.yaml and set: ingress.hostPort: "8080"
# Then:
helm install forte-workshop .
```

**Option B: Customize for your environment**

1. Copy the example values:
   ```bash
   cp values-example.yaml my-values.yaml
   ```

2. Edit `my-values.yaml`:
   ```yaml
   ingress:
     # For Windows users who used kind-config-windows.yaml, set hostPort to "8080"
     # For Linux/Mac, leave as "" (empty string)
     hostPort: ""  # or "8080" for Windows
     hosts:
       frontend: 127.0.0.1.nip.io
       teamGenerator: team.127.0.0.1.nip.io
       # ... etc
   ```

3. Install with custom values:
   ```bash
   helm install forte-workshop . -f my-values.yaml
   ```

**Windows Port Configuration Note**: If you used `kind-config-windows.yaml` (ports 8080/8443), you **must** set `ingress.hostPort: "8080"` in your values file. This ensures the frontend can correctly connect to all backend services.

### 4. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n workshop

# Check services
kubectl get svc -n workshop

# Check ingress
kubectl get ingress -n workshop
```

Wait for all pods to show `Running` and `Ready 1/1`:

```bash
# Watch pods until ready
kubectl get pods -n workshop -w
```

### 5. Access the Application

Open your browser and navigate to:

**Linux/Mac (port 80):**
- **Frontend**: http://127.0.0.1.nip.io
- **Team Generator API**: http://team.127.0.0.1.nip.io/swagger
- **Betting Service API**: http://bet.127.0.0.1.nip.io/api/docs
- **Match Scheduler API**: http://schedule.127.0.0.1.nip.io/api/docs
- **Stats Aggregator API**: http://stats.127.0.0.1.nip.io/api/docs
- **Notification Center API**: http://notify.127.0.0.1.nip.io/api/docs/index.html
- **Match Event Logger API**: http://logger.127.0.0.1.nip.io/api/docs

**Windows (port 8080):**
- **Frontend**: http://127.0.0.1.nip.io:8080
- **Team Generator API**: http://team.127.0.0.1.nip.io:8080/swagger
- **Betting Service API**: http://bet.127.0.0.1.nip.io:8080/api/docs
- **Match Scheduler API**: http://schedule.127.0.0.1.nip.io:8080/api/docs
- **Stats Aggregator API**: http://stats.127.0.0.1.nip.io:8080/api/docs
- **Notification Center API**: http://notify.127.0.0.1.nip.io:8080/api/docs/index.html
- **Match Event Logger API**: http://logger.127.0.0.1.nip.io:8080/api/docs

## Troubleshooting

### Port 80 Already in Use

If you get an error about port 80 being in use:

**Windows/Mac:**
- Stop any web servers (IIS, Apache, nginx)
- Stop Docker Desktop and restart

**Linux:**
- Check what's using port 80: `sudo lsof -i :80`
- Stop the service or use a different port mapping

### Pods Stuck in Pending

```bash
# Check pod details
kubectl describe pod <pod-name> -n workshop

# Common causes:
# - Insufficient resources (increase Docker Desktop memory to 4GB+)
# - PVC not binding (check with: kubectl get pvc -n workshop)
```

### Ingress Not Working

```bash
# Check ingress controller is running
kubectl get pods -n ingress-nginx

# Check ingress configuration
kubectl describe ingress -n workshop

# Test direct service access (bypass ingress)
kubectl port-forward -n workshop svc/frontend 8080:80
# Then open: http://localhost:8080
```

### Images Not Pulling

```bash
# Check image pull status
kubectl describe pod <pod-name> -n workshop

# Verify Docker is running and has internet access
docker pull ghcr.io/thorstensen/forte-k8s-workshop/frontend:latest
```

### DNS Not Resolving (.nip.io)

If `127.0.0.1.nip.io` doesn't work:

**Option 1: Use localhost with port forwarding**
```bash
kubectl port-forward -n workshop svc/frontend 3001:80
# Access at: http://localhost:3001
```

**Option 2: Edit hosts file**

Add to `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 forte.local team.forte.local bet.forte.local schedule.forte.local stats.forte.local notify.forte.local logger.forte.local
```

Then update Helm values to use `*.forte.local` domains.

## Clean Up

When you're done with the workshop:

```bash
# Delete the Helm release
helm uninstall forte-workshop

# Delete the namespace
kubectl delete namespace workshop

# Delete the kind cluster
kind delete cluster --name forte-workshop
```

## Getting Help

- Check pod logs: `kubectl logs -n workshop <pod-name>`
- Check pod events: `kubectl describe pod -n workshop <pod-name>`
- Check service status: `kubectl get all -n workshop`
- View Helm values: `helm get values forte-workshop`

## Additional Resources

- [kind Documentation](https://kind.sigs.k8s.io/)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
