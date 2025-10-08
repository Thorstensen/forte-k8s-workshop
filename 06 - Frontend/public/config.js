// Runtime configuration for Frontend service
// This file can be overridden by a Kubernetes ConfigMap
// Default values point to localhost for local development
window.ENV = {
  VITE_TEAM_GENERATOR_URL: 'http://localhost:6001',
  VITE_BETTING_SERVICE_URL: 'http://localhost:6002',
  VITE_MATCH_SCHEDULER_URL: 'http://localhost:6003',
  VITE_STATS_AGGREGATOR_URL: 'http://localhost:6004',
  VITE_NOTIFICATION_CENTER_URL: 'http://localhost:6005',
};
