import { notificationApi } from './api';
import { Notification, ApiResponse } from '../types';

export const notificationService = {
  // Get all notifications
  getAllNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await notificationApi.get<ApiResponse<Notification[]>>('/notifications');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Handle direct response format if service doesn't wrap in ApiResponse
      if (Array.isArray(response.data)) {
        return response.data as Notification[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get notifications for a specific match
  getMatchNotifications: async (matchId: string): Promise<Notification[]> => {
    try {
      const response = await notificationApi.get<ApiResponse<Notification[]>>(`/matches/${matchId}/notifications`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Handle direct response format
      if (Array.isArray(response.data)) {
        return response.data as Notification[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching match notifications:', error);
      throw error;
    }
  },

  // Get important notifications only
  getImportantNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await notificationApi.get<ApiResponse<Notification[]>>('/notifications/important');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Handle direct response format
      if (Array.isArray(response.data)) {
        return response.data as Notification[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching important notifications:', error);
      throw error;
    }
  },

  // Generate notifications for a match start (this will be called when starting a match)
  generateMatchStartNotifications: async (matchId: string): Promise<Notification[]> => {
    try {
      // This is a conceptual endpoint - the notification service might auto-generate
      // or we trigger it by calling the get notifications after match starts
      const response = await notificationApi.post<ApiResponse<Notification[]>>(`/matches/${matchId}/start-notifications`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to generate start notifications');
    } catch (error) {
      console.error('Error generating start notifications:', error);
      // If this endpoint doesn't exist, we'll just fetch match notifications
      return await notificationService.getMatchNotifications(matchId);
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await notificationApi.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Notification Center health check failed:', error);
      return false;
    }
  },
};