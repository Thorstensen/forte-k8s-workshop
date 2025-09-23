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
        endpoint: 'localhost:6001',
      };
    } catch (error) {
      return {
        name: 'team-generator',
        displayName: 'Team Generator',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: 'localhost:6001',
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
        endpoint: 'localhost:6002',
      };
    } catch (error) {
      return {
        name: 'betting-service',
        displayName: 'Betting Service',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: 'localhost:6002',
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
        endpoint: 'localhost:6003',
      };
    } catch (error) {
      return {
        name: 'match-scheduler',
        displayName: 'Match Scheduler',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: 'localhost:6003',
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
        endpoint: 'localhost:6004',
      };
    } catch (error) {
      return {
        name: 'stats-aggregator',
        displayName: 'Stats Aggregator',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: 'localhost:6004',
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
        endpoint: 'localhost:6005',
      };
    } catch (error) {
      return {
        name: 'notification-center',
        displayName: 'Notification Center',
        isHealthy: false,
        lastChecked: new Date(),
        endpoint: 'localhost:6005',
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
          endpoint: 'localhost:6001',
        },
        bettingService.status === 'fulfilled' ? bettingService.value : {
          name: 'betting-service',
          displayName: 'Betting Service',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: 'localhost:6002',
        },
        matchScheduler.status === 'fulfilled' ? matchScheduler.value : {
          name: 'match-scheduler',
          displayName: 'Match Scheduler',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: 'localhost:6003',
        },
        statsAggregator.status === 'fulfilled' ? statsAggregator.value : {
          name: 'stats-aggregator',
          displayName: 'Stats Aggregator',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: 'localhost:6004',
        },
        notificationCenter.status === 'fulfilled' ? notificationCenter.value : {
          name: 'notification-center',
          displayName: 'Notification Center',
          isHealthy: false,
          lastChecked: new Date(),
          endpoint: 'localhost:6005',
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
            endpoint: 'localhost:6001',
          },
          {
            name: 'betting-service',
            displayName: 'Betting Service',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: 'localhost:6002',
          },
          {
            name: 'match-scheduler',
            displayName: 'Match Scheduler',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: 'localhost:6003',
          },
          {
            name: 'stats-aggregator',
            displayName: 'Stats Aggregator',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: 'localhost:6004',
          },
          {
            name: 'notification-center',
            displayName: 'Notification Center',
            isHealthy: false,
            lastChecked: new Date(),
            endpoint: 'localhost:6005',
          },
        ],
        healthyCount: 0,
        totalCount: 5,
      };
    }
  },
};