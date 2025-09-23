import { teamService } from './teamService';
import { bettingService } from './bettingService';
import { matchService } from './matchService';
import { statsService } from './statsService';
import { notificationService } from './notificationService';

export interface ServiceHealthStatus {
  name: string;
  displayName: string;
  isHealthy: boolean;
  lastChecked: Date;
  endpoint: string;
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealthStatus[];
  healthyCount: number;
  totalCount: number;
}

// Helper function to get the actual endpoint being used
const getServiceEndpoint = (serviceName: string): string => {
  const isDevelopment = import.meta.env.DEV;
  
  // Check if environment variable override is set
  const envOverride = (() => {
    switch (serviceName) {
      case 'team-generator':
        return import.meta.env.VITE_TEAM_GENERATOR_URL;
      case 'betting-service':
        return import.meta.env.VITE_BETTING_SERVICE_URL;
      case 'match-scheduler':
        return import.meta.env.VITE_MATCH_SCHEDULER_URL;
      case 'stats-aggregator':
        return import.meta.env.VITE_STATS_AGGREGATOR_URL;
      case 'notification-center':
        return import.meta.env.VITE_NOTIFICATION_CENTER_URL;
      default:
        return null;
    }
  })();

  if (envOverride) {
    return envOverride;
  }

  // Show the proxy path with context about how it's handled
  const proxyPath = `/api/proxy/${serviceName.replace('-', '')}`;
  if (isDevelopment) {
    return `${proxyPath} (Vite dev proxy)`;
  } else {
    return `${proxyPath} (NGINX cluster proxy)`;
  }
};

export const healthService = {
  // Individual service health checks
  checkTeamGeneratorHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await teamService.healthCheck();
      return {
        name: 'team-generator',
        displayName: 'Team Generator',
        isHealthy,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('team-generator'),
      };
    } catch (error) {
      return {
        name: 'team-generator',
        displayName: 'Team Generator',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('team-generator'),
      };
    }
  },

  checkBettingServiceHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await bettingService.healthCheck();
      return {
        name: 'betting-service',
        displayName: 'Betting Service',
        isHealthy,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('betting-service'),
      };
    } catch (error) {
      return {
        name: 'betting-service',
        displayName: 'Betting Service',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('betting-service'),
      };
    }
  },

  checkMatchSchedulerHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await matchService.healthCheck();
      return {
        name: 'match-scheduler',
        displayName: 'Match Scheduler',
        isHealthy,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('match-scheduler'),
      };
    } catch (error) {
      return {
        name: 'match-scheduler',
        displayName: 'Match Scheduler',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('match-scheduler'),
      };
    }
  },

  checkStatsAggregatorHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await statsService.healthCheck();
      return {
        name: 'stats-aggregator',
        displayName: 'Stats Aggregator',
        isHealthy,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('stats-aggregator'),
      };
    } catch (error) {
      return {
        name: 'stats-aggregator',
        displayName: 'Stats Aggregator',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('stats-aggregator'),
      };
    }
  },

  checkNotificationCenterHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await notificationService.healthCheck();
      return {
        name: 'notification-center',
        displayName: 'Notification Center',
        isHealthy,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('notification-center'),
      };
    } catch (error) {
      return {
        name: 'notification-center',
        displayName: 'Notification Center',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: getServiceEndpoint('notification-center'),
      };
    }
  },

  // Comprehensive system health check
  checkSystemHealth: async (): Promise<SystemHealth> => {
    console.log('Starting system health check...');
    
    try {
      // Run all health checks in parallel for better performance
      const [
        teamGenerator,
        bettingService,
        matchScheduler,
        statsAggregator,
        notificationCenter,
      ] = await Promise.allSettled([
        healthService.checkTeamGeneratorHealth(),
        healthService.checkBettingServiceHealth(),
        healthService.checkMatchSchedulerHealth(),
        healthService.checkStatsAggregatorHealth(),
        healthService.checkNotificationCenterHealth(),
      ]);

      // Extract results, handling any rejections
      const services: ServiceHealthStatus[] = [
        teamGenerator.status === 'fulfilled' ? teamGenerator.value : {
          name: 'team-generator',
          displayName: 'Team Generator',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: getServiceEndpoint('team-generator'),
        },
        bettingService.status === 'fulfilled' ? bettingService.value : {
          name: 'betting-service',
          displayName: 'Betting Service',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: getServiceEndpoint('betting-service'),
        },
        matchScheduler.status === 'fulfilled' ? matchScheduler.value : {
          name: 'match-scheduler',
          displayName: 'Match Scheduler',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: getServiceEndpoint('match-scheduler'),
        },
        statsAggregator.status === 'fulfilled' ? statsAggregator.value : {
          name: 'stats-aggregator',
          displayName: 'Stats Aggregator',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: getServiceEndpoint('stats-aggregator'),
        },
        notificationCenter.status === 'fulfilled' ? notificationCenter.value : {
          name: 'notification-center',
          displayName: 'Notification Center',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: getServiceEndpoint('notification-center'),
        },
      ];

      const healthyCount = services.filter(service => service.isHealthy).length;
      const totalCount = services.length;

      let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyCount === totalCount) {
        overallStatus = 'healthy';
      } else if (healthyCount > 0) {
        overallStatus = 'degraded';
      } else {
        overallStatus = 'unhealthy';
      }

      const systemHealth: SystemHealth = {
        overallStatus,
        services,
        healthyCount,
        totalCount,
      };

      console.log('System health check completed:', systemHealth);
      return systemHealth;
    } catch (error) {
      console.error('Error during system health check:', error);
      
      // Return default unhealthy state
      return {
        overallStatus: 'unhealthy',
        services: [
          {
            name: 'team-generator',
            displayName: 'Team Generator',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: getServiceEndpoint('team-generator'),
          },
          {
            name: 'betting-service',
            displayName: 'Betting Service',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: getServiceEndpoint('betting-service'),
          },
          {
            name: 'match-scheduler',
            displayName: 'Match Scheduler',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: getServiceEndpoint('match-scheduler'),
          },
          {
            name: 'stats-aggregator',
            displayName: 'Stats Aggregator',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: getServiceEndpoint('stats-aggregator'),
          },
          {
            name: 'notification-center',
            displayName: 'Notification Center',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: getServiceEndpoint('notification-center'),
          },
        ],
        healthyCount: 0,
        totalCount: 5,
      };
    }
  },
};