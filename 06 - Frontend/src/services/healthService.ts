import axios from 'axios';

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

// Helper function to get the actual endpoint being used for health checks
const getServiceEndpoint = (serviceName: string): string => {
  // Check if environment variable override is set first
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

  // Use localhost with unique port numbers for health checks
  // This allows port-forwarding each service to a specific localhost port
  const portMapping = {
    'team-generator': 6001,
    'betting-service': 6002,
    'match-scheduler': 6003,
    'stats-aggregator': 6004,
    'notification-center': 6005,
  };

  const port = portMapping[serviceName as keyof typeof portMapping];
  if (port) {
    return `http://localhost:${port}`;
  }

  // This shouldn't happen with the defined services, but fallback to a default port
  throw new Error(`Unknown service: ${serviceName}`);
};

// Helper function to perform health check to a specific endpoint
const performHealthCheck = async (serviceName: string): Promise<boolean> => {
  try {
    const endpoint = getServiceEndpoint(serviceName);
    const healthUrl = `${endpoint}/api/health`;
    
    console.log(`Performing health check for ${serviceName} at ${healthUrl}`);
    
    const response = await axios.get(healthUrl, {
      timeout: 5000, // 5 second timeout for health checks
      validateStatus: (status) => status === 200,
    });
    
    return response.status === 200;
  } catch (error) {
    console.error(`Health check failed for ${serviceName}:`, error);
    return false;
  }
};

export const healthService = {
  // Individual service health checks
  checkTeamGeneratorHealth: async (): Promise<ServiceHealthStatus> => {
    try {
      const isHealthy = await performHealthCheck('team-generator');
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
      const isHealthy = await performHealthCheck('betting-service');
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
      const isHealthy = await performHealthCheck('match-scheduler');
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
      const isHealthy = await performHealthCheck('stats-aggregator');
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
      const isHealthy = await performHealthCheck('notification-center');
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