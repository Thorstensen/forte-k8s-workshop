# Forte K8s Workshop - Part 1: ConfigMaps

Hands-on exercises to learn about ConfigMaps in Kubernetes.

## Prerequisites

Complete [SETUP.md](SETUP.md) first to have your kind cluster running with all services deployed.

---

## Exercise 1: ConfigMaps - Environment Variables

**Goal**: Learn how ConfigMaps provide configuration to applications without rebuilding Docker images.

### What You'll Do
Modify the Match Scheduler's rate limiting configuration using a ConfigMap.

### Steps

1. **Check current rate limit settings**

   Open the frontend at http://127.0.0.1.nip.io and try scheduling multiple matches quickly. The default allows 100 requests per 15 minutes.

2. **View the current ConfigMap**

   ```bash
   kubectl get configmap match-scheduler-config -n workshop -o yaml
   ```

   You'll see configuration like:
   ```yaml
   data:
     RATE_LIMIT_MAX_REQUESTS: "100"
     RATE_LIMIT_WINDOW_MS: "900000"  # 15 minutes
   ```

3. **Edit the ConfigMap to be more restrictive**

   ```bash
   kubectl edit configmap match-scheduler-config -n workshop
   ```

   Change the rate limit to be ridiculously low 
   ```yaml
   data:
     RATE_LIMIT_MAX_REQUESTS: "2"
     RATE_LIMIT_WINDOW_MS: "240000"  # 4 minutes
   ```

   Save and exit

4. **Restart the deployment to pick up changes**

   ```bash
   kubectl rollout restart deployment/match-scheduler -n workshop
   ```

   Wait for the new pod to be ready:
   ```bash
   kubectl get pods -n workshop -w
   ```

5. **Verify the new configuration in the pod logs**

   ```bash
   # Check the logs to see the rate limit configuration (replace <pod-name>)
   kubectl logs -n workshop -l app=<pod-name>
   ```

6. **Test the new rate limit**

   Go back to the frontend and try scheduling enough matches to break your rate limiting

7. **(Optional) Verify the environment variables in the pod**

   ```bash
   # Check environment variables (replace <pod-name> with actual name)
   kubectl exec -n workshop <pod-name> -- env
   ```

### What You Learned
- ✅ ConfigMaps store configuration data
- ✅ Environment variables can be loaded from ConfigMaps
- ✅ Changes require pod restart (`rollout restart`)
- ✅ No Docker image rebuild needed!

---

## Exercise 2: ConfigMaps - File Mounting

**Goal**: Learn how ConfigMaps can be mounted as files in containers.

### What You'll Do
Examine how the frontend loads its API URLs from a config file provided by a ConfigMap.

### Steps

1. **View the frontend ConfigMap**

   ```bash
   kubectl get configmap frontend-config -n workshop -o yaml
   ```

   This contains a `config.js` file with all the backend API URLs.

2. **Check how it's mounted in the pod**

   ```bash
   # Get pod name
   kubectl get pods -n workshop -l app=frontend

   # View the mounted file (replace <pod-name>)
   kubectl exec -n workshop <pod-name> -- cat /usr/share/nginx/html/config.js
   ```

   You should see the JavaScript configuration object.

3. **Verify the mount in pod spec**

   ```bash
   kubectl get pod -n workshop <pod-name> -o yaml
   ```

   Look for the `configMap` volume and `volumeMount` sections.

4. **(Optional) Try editing the ConfigMap**

   Edit the config and change a comment or add a console.log:
   ```bash
   kubectl edit configmap frontend-config -n workshop
   ```

   Add at the top of the file:
   ```javascript
   console.log('ConfigMap loaded successfully!');
   ```

   Restart and check browser console:
   ```bash
   kubectl rollout restart deployment/frontend -n workshop
   ```

### What You Learned
- ✅ ConfigMaps can be mounted as files
- ✅ Entire file content stored in ConfigMap
- ✅ Files appear in container filesystem
- ✅ Useful for config files, scripts, etc.

---

## Troubleshooting

### ConfigMap changes not applying
- Did you run `kubectl rollout restart deployment/<name> -n workshop`?
- Check pod age - old pods won't have new config

### Pod not starting
```bash
kubectl get pods -n workshop
kubectl describe pod <pod-name> -n workshop
kubectl logs <pod-name> -n workshop
```

### Can't access services
- Check ingress: `kubectl get ingress -n workshop`
- Check ingress controller: `kubectl get pods -n ingress-nginx`
- Try port-forward: `kubectl port-forward -n workshop svc/frontend 8080:80`

---
