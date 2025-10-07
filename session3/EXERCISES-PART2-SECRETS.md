# Forte K8s Workshop - Part 2: Secrets

Hands-on exercises to learn about Secrets in Kubernetes.

## Prerequisites

Complete [SETUP.md](SETUP.md) and [EXERCISES-PART1-CONFIGMAPS.md](EXERCISES-PART1-CONFIGMAPS.md) first.

---

## Exercise 3: Secrets

**Goal**: Learn how to securely store sensitive data like API keys.

### What You'll Do
Work with the Stats Aggregator's optional API key stored as a Secret.

### Steps

1. **View available secrets**

   ```bash
   kubectl get secrets -n workshop
   ```

2. **Examine the secret (values are base64 encoded)**

   ```bash
   kubectl get secret stats-aggregator-secret -n workshop -o yaml
   ```

   You'll see something like:
   ```yaml
   data:
     EXTERNAL_API_KEY: ZGVtby1hcGkta2V5LTEyMzQ1
   ```

3. **Decode the secret value**

   **Linux/Mac:**
   ```bash
   kubectl get secret stats-aggregator-secret -n workshop -o jsonpath='{.data.EXTERNAL_API_KEY}' | base64 -d
   ```

   **Windows PowerShell:**
   ```powershell
   $secret = kubectl get secret stats-aggregator-secret -n workshop -o jsonpath='{.data.EXTERNAL_API_KEY}'
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($secret))
   ```

4. **Create your own secret**

   ```bash
   kubectl create secret generic my-test-secret \
     --from-literal=API_KEY='my-super-secret-value-123' \
     --from-literal=DB_PASSWORD='another-secret' \
     --namespace workshop
   ```

5. **View your new secret**

   ```bash
   kubectl get secret my-test-secret -n workshop -o yaml
   ```

6. **Decode your secret**

   Use the same decode commands from step 3, replacing the secret name.

7. **Check how the secret is used in the pod**

   ```bash
   kubectl get deployment stats-aggregator -n workshop -o yaml | grep -A 5 secretKeyRef
   ```

8. **Clean up your test secret**

   ```bash
   kubectl delete secret my-test-secret -n workshop
   ```

### What You Learned
- ✅ Secrets store sensitive data
- ✅ Data is base64 encoded (not encrypted!)
- ✅ Secrets injected as environment variables
- ✅ Never commit secrets to git
- ✅ Use proper secret management in production (Sealed Secrets, Vault, etc.)

---

## Troubleshooting

### Can't decode secret
- Make sure you're using the correct command for your platform (Linux/Mac vs Windows)
- Check the secret name is correct: `kubectl get secrets -n workshop`

### Secret not appearing in pod
- Check the deployment YAML references the correct secret name
- Verify the secret exists in the same namespace as the pod
- Restart the deployment if you created the secret after the pod started

---
