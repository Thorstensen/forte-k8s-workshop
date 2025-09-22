#!/bin/bash

# Forte K8s Workshop - Helm Deployment Examples
# This script demonstrates various ways to deploy the Forte platform using Helm

set -e

echo "🏟️  Forte Football Platform - Helm Deployment Examples"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_section() {
    echo -e "\n${BLUE}📋 $1${NC}"
    echo "----------------------------------------"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Helm is installed
check_helm() {
    if ! command -v helm &> /dev/null; then
        print_error "Helm is not installed. Please install Helm first."
        echo "Visit: https://helm.sh/docs/intro/install/"
        exit 1
    fi
    print_success "Helm is installed: $(helm version --short)"
}

# Example 1: Deploy individual service
deploy_individual_service() {
    print_section "Example 1: Deploy Individual Service (Team Generator)"
    
    echo "# Install team-generator service"
    echo "helm install team-generator ./01\\ -\\ TeamGenerator/helm-chart"
    echo ""
    echo "# Install with custom values"
    echo "helm install team-generator ./01\\ -\\ TeamGenerator/helm-chart \\"
    echo "  --set replicaCount=3 \\"
    echo "  --set image.tag=v1.2.0 \\"
    echo "  --set resources.limits.cpu=500m"
    echo ""
    echo "# Check deployment status"
    echo "helm status team-generator"
    echo "kubectl get pods -n teamgenerator"
}

# Example 2: Deploy entire platform
deploy_platform() {
    print_section "Example 2: Deploy Entire Platform"
    
    echo "# Install entire platform with default values"
    echo "helm install football-platform ./helm-charts/football-scheduling-platform"
    echo ""
    echo "# Install for development environment"
    echo "helm install football-dev ./helm-charts/football-scheduling-platform \\"
    echo "  -f ./helm-charts/football-scheduling-platform/values-dev.yaml"
    echo ""
    echo "# Install for production environment"
    echo "helm install football-prod ./helm-charts/football-scheduling-platform \\"
    echo "  -f ./helm-charts/football-scheduling-platform/values-prod.yaml"
    echo ""
    echo "# Disable specific services"
    echo "helm install football-platform ./helm-charts/football-scheduling-platform \\"
    echo "  --set betting-service.enabled=false \\"
    echo "  --set notification-center.enabled=false"
}

# Example 3: Environment-specific deployments
environment_deployments() {
    print_section "Example 3: Environment-Specific Deployments"
    
    echo "# Development (lightweight, local testing)"
    echo "helm install football-dev ./helm-charts/football-scheduling-platform \\"
    echo "  -f values-dev.yaml \\"
    echo "  --namespace football-dev \\"
    echo "  --create-namespace"
    echo ""
    echo "# Staging (production-like, testing)"
    echo "helm install football-staging ./helm-charts/football-scheduling-platform \\"
    echo "  -f values-staging.yaml \\"
    echo "  --namespace football-staging \\"
    echo "  --create-namespace"
    echo ""
    echo "# Production (high availability, monitoring)"
    echo "helm install football-prod ./helm-charts/football-scheduling-platform \\"
    echo "  -f values-prod.yaml \\"
    echo "  --namespace football-prod \\"
    echo "  --create-namespace"
}

# Example 4: Updates and rollbacks
updates_rollbacks() {
    print_section "Example 4: Updates and Rollbacks"
    
    echo "# Update to new version"
    echo "helm upgrade football-platform ./helm-charts/football-scheduling-platform \\"
    echo "  --set global.imageTag=v2.0.0"
    echo ""
    echo "# Update specific service"
    echo "helm upgrade football-platform ./helm-charts/football-scheduling-platform \\"
    echo "  --set team-generator.image.tag=v2.1.0 \\"
    echo "  --set team-generator.replicaCount=5"
    echo ""
    echo "# Check rollout status"
    echo "kubectl rollout status deployment/team-generator -n teamgenerator"
    echo ""
    echo "# Rollback if there are issues"
    echo "helm rollback football-platform 1"
    echo ""
    echo "# View revision history"
    echo "helm history football-platform"
}

# Example 5: Debugging and troubleshooting
debugging() {
    print_section "Example 5: Debugging and Troubleshooting"
    
    echo "# Dry run to see generated YAML"
    echo "helm install --dry-run --debug football-platform ./helm-charts/football-scheduling-platform"
    echo ""
    echo "# Validate chart syntax"
    echo "helm lint ./helm-charts/football-scheduling-platform"
    echo ""
    echo "# Template and save to file"
    echo "helm template football-platform ./helm-charts/football-scheduling-platform > generated-manifests.yaml"
    echo ""
    echo "# Check what will be changed in upgrade"
    echo "helm diff upgrade football-platform ./helm-charts/football-scheduling-platform"
    echo ""
    echo "# Get values for deployed release"
    echo "helm get values football-platform"
}

# Example 6: Monitoring and observability
monitoring() {
    print_section "Example 6: Monitoring and Observability"
    
    echo "# Deploy with monitoring enabled"
    echo "helm install football-platform ./helm-charts/football-scheduling-platform \\"
    echo "  --set monitoring.enabled=true \\"
    echo "  --set monitoring.prometheus.enabled=true \\"
    echo "  --set monitoring.grafana.enabled=true"
    echo ""
    echo "# Check all resources"
    echo "kubectl get all --all-namespaces -l app.kubernetes.io/part-of=football-platform"
    echo ""
    echo "# View logs from all services"
    echo "kubectl logs -l app.kubernetes.io/part-of=football-platform --all-containers=true"
}

# Example 7: Cleanup
cleanup() {
    print_section "Example 7: Cleanup"
    
    echo "# Uninstall specific release"
    echo "helm uninstall football-platform"
    echo ""
    echo "# Uninstall and delete persistent data"
    echo "helm uninstall football-platform --cascade=foreground"
    echo ""
    echo "# List all releases"
    echo "helm list --all-namespaces"
    echo ""
    echo "# Cleanup namespaces (if needed)"
    echo "kubectl delete namespace teamgenerator bettingservice matchscheduler statsaggregator notificationcenter frontend"
}

# Main execution
main() {
    check_helm
    
    echo -e "\n${GREEN}🚀 Choose an example to run:${NC}"
    echo "1. Deploy Individual Service"
    echo "2. Deploy Entire Platform"  
    echo "3. Environment-Specific Deployments"
    echo "4. Updates and Rollbacks"
    echo "5. Debugging and Troubleshooting"
    echo "6. Monitoring and Observability"
    echo "7. Cleanup"
    echo "8. Show All Examples"
    
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1) deploy_individual_service ;;
        2) deploy_platform ;;
        3) environment_deployments ;;
        4) updates_rollbacks ;;
        5) debugging ;;
        6) monitoring ;;
        7) cleanup ;;
        8) 
            deploy_individual_service
            deploy_platform
            environment_deployments
            updates_rollbacks
            debugging
            monitoring
            cleanup
            ;;
        *) print_error "Invalid choice. Please run the script again." ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi