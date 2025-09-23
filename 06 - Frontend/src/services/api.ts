import axios from 'axios';

// Determine the runtime environment
const isDevelopment = import.meta.env.DEV;

console.log('Environment detection:', { 
  isDevelopment, 
  hostname: window.location.hostname,
  port: window.location.port
});

// Service base URLs
// - Development (npm run dev): Use Vite proxy
// - Production (deployed to cluster): Use NGINX proxy paths
// Both scenarios use the same proxy paths, but handled by different servers
const SERVICES = {
  TEAM_GENERATOR: import.meta.env.VITE_TEAM_GENERATOR_URL || '/api/proxy/teamgenerator',
  BETTING_SERVICE: import.meta.env.VITE_BETTING_SERVICE_URL || '/api/proxy/bettingservice', 
  MATCH_SCHEDULER: import.meta.env.VITE_MATCH_SCHEDULER_URL || '/api/proxy/matchscheduler',
  STATS_AGGREGATOR: import.meta.env.VITE_STATS_AGGREGATOR_URL || '/api/proxy/statsaggregator',
  NOTIFICATION_CENTER: import.meta.env.VITE_NOTIFICATION_CENTER_URL || '/api/proxy/notificationcenter',
};

// Create axios instances for each service
export const teamGeneratorApi = axios.create({
  baseURL: SERVICES.TEAM_GENERATOR,
  timeout: 10000,
});

export const bettingApi = axios.create({
  baseURL: SERVICES.BETTING_SERVICE,
  timeout: 10000,
});

export const matchSchedulerApi = axios.create({
  baseURL: SERVICES.MATCH_SCHEDULER,
  timeout: 10000,
});

export const statsApi = axios.create({
  baseURL: SERVICES.STATS_AGGREGATOR,
  timeout: 10000,
});

export const notificationApi = axios.create({
  baseURL: SERVICES.NOTIFICATION_CENTER,
  timeout: 10000,
});

// Add request interceptors for logging
[teamGeneratorApi, bettingApi, matchSchedulerApi, statsApi, notificationApi].forEach(api => {
  api.interceptors.request.use(
    (config) => {
      console.log(`Making request to ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`Response from ${response.config.baseURL}${response.config.url}:`, response.status);
      return response;
    },
    (error) => {
      console.error('Response error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
});