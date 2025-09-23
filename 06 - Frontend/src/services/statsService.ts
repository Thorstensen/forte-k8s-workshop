import { statsApi } from './api';
import { ApiResponse } from '../types';

export const statsService = {
  // Get match statistics
  getMatchStats: async (): Promise<any> => {
    try {
      const response = await statsApi.get<ApiResponse<any>>('/api/match/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Handle direct response format if service doesn't wrap in ApiResponse
      return response.data;
    } catch (error) {
      console.error('Error fetching match stats:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await statsApi.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Stats Aggregator health check failed:', error);
      return false;
    }
  },
};