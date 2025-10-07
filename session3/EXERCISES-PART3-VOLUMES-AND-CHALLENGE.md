# Forte K8s Workshop - Part 3: Persistent Volumes & DIY Challenge


## Prerequisites

Complete [SETUP.md](SETUP.md), [EXERCISES-PART1-CONFIGMAPS.md](EXERCISES-PART1-CONFIGMAPS.md), and [EXERCISES-PART2-SECRETS.md](EXERCISES-PART2-SECRETS.md) first.

---

## Exercise 4: Persistent Volumes

**Goal**: Learn how to persist data across pod restarts using PersistentVolumeClaims.

### What You'll Do
Verify that the Match Event Logger keeps logs even when the pod is deleted.

### Steps

1. **Check the PersistentVolumeClaim**

   ```bash
   kubectl get pvc -n workshop
   ```

   Look for `match-event-logger-pvc` with status `Bound`.

2. **View PVC details**

   ```bash
   kubectl describe pvc match-event-logger-pvc -n workshop
   ```

   Note the storage size (1Gi) and access mode (ReadWriteOnce).

3. **Log some match events**

   Use curl or your browser to log events. Replace with your actual match IDs:

   ```bash
   curl -X POST http://logger.127.0.0.1.nip.io/api/events \
     -H "Content-Type: application/json" \
     -d '{
       "match_id": "match-001",
       "team_home": "team-1",
       "team_away": "team-2",
       "event_type": "match_start",
       "description": "Test match started"
     }'
   ```

   Log a few different events.

4. **Retrieve the events**

   ```bash
   curl http://logger.127.0.0.1.nip.io/api/events
   ```

   You should see your logged events.

5. **Check the log files in the pod**

   ```bash
   # Get pod name
   kubectl get pods -n workshop -l app=match-event-logger

   # List log files (replace <pod-name>)
   kubectl exec -n workshop <pod-name> -- ls -lh /var/log/match-events

   # View a log file (adjust date to today's date YYYY-MM-DD)
   kubectl exec -n workshop <pod-name> -- cat /var/log/match-events/match-events-2025-10-07.jsonl
   ```

6. **Delete the pod to simulate a crash**

   ```bash
   kubectl delete pod -n workshop -l app=match-event-logger
   ```

   Kubernetes will automatically create a new pod.

7. **Wait for the new pod to start**

   ```bash
   kubectl get pods -n workshop -w
   ```

   Press `Ctrl+C` once the new pod is running.

8. **Verify logs persisted**

   Retrieve the events again using curl (step 4) or check the files in the new pod (step 5).

   **The logs are still there!** The PersistentVolume preserved the data.

9. **(Optional) View volume mount details**

   ```bash
   kubectl get pod -n workshop <new-pod-name> -o yaml | grep -A 10 volumeMounts
   ```

### What You Learned
- ✅ PersistentVolumeClaims request storage
- ✅ Volumes mount into container filesystem
- ✅ Data survives pod deletion/restart
- ✅ ReadWriteOnce = single pod access
- ✅ Essential for stateful applications (databases, logs, etc.)

---

## Exercise 5: DIY Challenge - Add Your Own ConfigMap

**Goal**: Create a ConfigMap from scratch for a service that doesn't have one yet.

### The Challenge

The **Team Generator** service currently has no ConfigMap. Your mission is to add configuration to control its behavior without rebuilding the Docker image.

### What You'll Do

Add a ConfigMap to configure the Team Generator's team generation settings.

### Steps

1. **Investigate what the service can configure**

   First, check what environment variables the Team Generator service accepts. Let's look at the container:

   ```bash
   # Get the pod name
   kubectl get pods -n workshop -l app=team-generator

   # Check the current environment variables (replace <pod-name>)
   kubectl exec -n workshop <pod-name> -- env | sort
   ```

   The service might accept variables like:
   - `MAX_TEAMS` - Maximum teams to generate
   - `TEAM_NAME_PREFIX` - Prefix for generated team names
   - `RANDOM_SEED` - Seed for reproducible generation

   **Note**: For this exercise, let's add these configuration options.

2. **Create a ConfigMap YAML file**

   Create a new file called `team-generator-config.yaml` in the `k8s-manifests/configmaps/` directory:

   ```bash
   # Navigate to configmaps directory
   cd k8s-manifests/configmaps/

   # Create the file (use your preferred editor)
   # Linux/Mac: nano team-generator-config.yaml
   # Windows: notepad team-generator-config.yaml
   ```

   Write your ConfigMap YAML. You'll need to:
   - Set `apiVersion: v1` and `kind: ConfigMap`
   - Name it appropriately
   - Set the namespace to `workshop`
   - Add configuration data

   **Hint**: Look at `match-scheduler-config.yaml` in the same directory for reference.

3. **Apply your ConfigMap**

   ```bash
   kubectl apply -f team-generator-config.yaml
   ```

   Verify it was created:
   ```bash
   kubectl get configmap -n workshop
   kubectl describe configmap <your-configmap-name> -n workshop
   ```

4. **Update the Helm chart to use your ConfigMap**

   Now you need to modify the team-generator deployment to load these environment variables. You have two options:

   **Option A: Edit Helm values** (Recommended)

   Edit `k8s-manifests/helm-chart/forte-workshop/values.yaml`:

   ```yaml
   teamGenerator:
     enabled: true
     # ... existing config ...
     config:  # Add this section
       maxTeams: "20"
       teamNamePrefix: "FC"
       randomSeed: "12345"
   ```

   **Option B: Edit the deployment template directly**

   Edit `k8s-manifests/helm-chart/forte-workshop/templates/deployment-team-generator.yaml` to add an `envFrom` section referencing your ConfigMap.

5. **Upgrade the Helm release**

   ```bash
   cd k8s-manifests/helm-chart/forte-workshop
   helm upgrade forte-workshop .
   ```

   Or if you chose Option B and edited the template directly:
   ```bash
   kubectl rollout restart deployment/team-generator -n workshop
   ```

6. **Verify the environment variables are loaded**

   ```bash
   # Get new pod name
   kubectl get pods -n workshop -l app=team-generator

   # Check environment variables (replace <pod-name>)
   kubectl exec -n workshop <pod-name> -- env | grep -E '(MAX_TEAMS|TEAM_NAME_PREFIX|RANDOM_SEED)'
   ```

7. **Test it works**

   Visit the Team Generator API documentation:
   ```
   http://team.127.0.0.1.nip.io/swagger
   ```

   Generate some teams and see if your configuration is being applied!

### Success Criteria

- ✅ ConfigMap created and applied
- ✅ Deployment updated to use ConfigMap
- ✅ Environment variables visible in pod
- ✅ Service behavior reflects your configuration

### Troubleshooting Hints

<details>
<summary>ConfigMap YAML structure</summary>

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: team-generator-config
  namespace: workshop
data:
  MAX_TEAMS: "20"
  TEAM_NAME_PREFIX: "FC"
  RANDOM_SEED: "12345"
```
</details>

<details>
<summary>How to reference ConfigMap in deployment</summary>

Add this to the container spec in the deployment template:

```yaml
envFrom:
  - configMapRef:
      name: team-generator-config
```
</details>

<details>
<summary>Alternative: Individual environment variables</summary>

Instead of `envFrom`, you can load specific values:

```yaml
env:
  - name: MAX_TEAMS
    valueFrom:
      configMapKeyRef:
        name: team-generator-config
        key: MAX_TEAMS
```
</details>

### What You Learned

- ✅ Created a ConfigMap from scratch
- ✅ Modified Kubernetes deployments to use ConfigMaps
- ✅ Updated Helm charts with new configuration
- ✅ End-to-end configuration management workflow
- ✅ Problem-solving and documentation reading skills

---

## Exercise 6: Helm Values (Bonus)

**Goal**: Understand how Helm manages configuration across all resources.

### What You'll Do
Explore how Helm templates generate Kubernetes manifests from values.

### Steps

1. **View current Helm values**

   ```bash
   helm get values forte-workshop -n default
   ```

2. **View all computed values (including defaults)**

   ```bash
   helm get values forte-workshop -n default --all
   ```

3. **View generated manifests**

   ```bash
   helm get manifest forte-workshop -n default | less
   ```

   Press `q` to exit. Notice how Helm generated all the Kubernetes YAML.

4. **Update a value using Helm**

   Let's change the frontend replica count:

   ```bash
   helm upgrade forte-workshop ./k8s-manifests/helm-chart/forte-workshop \
     --set frontend.replicaCount=2 \
     --reuse-values
   ```

5. **Verify the change**

   ```bash
   kubectl get deployment frontend -n workshop
   ```

   You should see 2/2 replicas.

6. **Scale back to 1**

   ```bash
   helm upgrade forte-workshop ./k8s-manifests/helm-chart/forte-workshop \
     --set frontend.replicaCount=1 \
     --reuse-values
   ```

### What You Learned
- ✅ Helm packages Kubernetes manifests
- ✅ Values control templated configurations
- ✅ `helm upgrade` updates running deployments
- ✅ DRY principle - configure once, apply everywhere
- ✅ Helm manages releases and rollbacks

---

## Troubleshooting Tips

### Pod not starting
```bash
kubectl get pods -n workshop
kubectl describe pod <pod-name> -n workshop
kubectl logs <pod-name> -n workshop
```

### PVC not binding
- Check storage class: `kubectl get storageclass`
- kind uses `standard` storage class
- Check PVC events: `kubectl describe pvc <pvc-name> -n workshop`

---

## Clean Up

When you're done with the exercises:

```bash
# Uninstall Helm release
helm uninstall forte-workshop

# Delete namespace
kubectl delete namespace workshop

# (Optional) Delete kind cluster
kind delete cluster --name forte-workshop
```

---

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [kind Documentation](https://kind.sigs.k8s.io/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
