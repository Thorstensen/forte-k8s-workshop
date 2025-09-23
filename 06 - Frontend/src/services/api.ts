import axios from 'axios';

// Service base URLs - using Kubernetes Core DNS for cluster communication
const SERVICES = {
  TEAM_GENERATOR: import.meta.env.VITE_TEAM_GENERATOR_URL || 'http://teamgenerator.teamgenerator.svc.cluster.local:8080',
  BETTING_SERVICE: import.meta.env.VITE_BETTING_SERVICE_URL || 'http://bettingservice.bettingservice.svc.cluster.local:8080',
  MATCH_SCHEDULER: import.meta.env.VITE_MATCH_SCHEDULER_URL || 'http://matchscheduler.matchscheduler.svc.cluster.local:3000',
  STATS_AGGREGATOR: import.meta.env.VITE_STATS_AGGREGATOR_URL || 'http://statsaggregator.statsaggregator.svc.cluster.local:8080',
  NOTIFICATION_CENTER: import.meta.env.VITE_NOTIFICATION_CENTER_URL || 'http://notificationcenter.notificationcenter.svc.cluster.local:8080',
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