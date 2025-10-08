import axios from 'axios';

// Service base URLs - can be configured at runtime via window.ENV (from config.js)
// Priority: window.ENV (ConfigMap) > build-time env vars > defaults
// This allows ConfigMap to override URLs without rebuilding the Docker image
const SERVICES = {
  TEAM_GENERATOR: (window as any).ENV?.VITE_TEAM_GENERATOR_URL || import.meta.env.VITE_TEAM_GENERATOR_URL || 'http://localhost:6001',
  BETTING_SERVICE: (window as any).ENV?.VITE_BETTING_SERVICE_URL || import.meta.env.VITE_BETTING_SERVICE_URL || 'http://localhost:6002',
  MATCH_SCHEDULER: (window as any).ENV?.VITE_MATCH_SCHEDULER_URL || import.meta.env.VITE_MATCH_SCHEDULER_URL || 'http://localhost:6003',
  STATS_AGGREGATOR: (window as any).ENV?.VITE_STATS_AGGREGATOR_URL || import.meta.env.VITE_STATS_AGGREGATOR_URL || 'http://localhost:6004',
  NOTIFICATION_CENTER: (window as any).ENV?.VITE_NOTIFICATION_CENTER_URL || import.meta.env.VITE_NOTIFICATION_CENTER_URL || 'http://localhost:6005',
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