import { matchSchedulerApi } from './api';
import { Match, ScheduleMatchRequest, ApiResponse } from '../types';

export const matchService = {
  // Get all matches
  getAllMatches: async (): Promise<Match[]> => {
    try {
      const response = await matchSchedulerApi.get<ApiResponse<Match[]>>('/api/matches');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  // Get upcoming matches
  getUpcomingMatches: async (): Promise<Match[]> => {
    try {
      const response = await matchSchedulerApi.get<ApiResponse<Match[]>>('/api/matches?upcoming=true');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  },

  // Schedule a new match
  scheduleMatch: async (matchRequest: ScheduleMatchRequest): Promise<Match> => {
    try {
      const response = await matchSchedulerApi.post<ApiResponse<Match>>('/api/matches', matchRequest);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to schedule match');
    } catch (error) {
      console.error('Error scheduling match:', error);
      throw error;
    }
  },

  // Start a match (update status to IN_PROGRESS)
  startMatch: async (matchId: string): Promise<Match> => {
    try {
      // First check if endpoint exists, if not we'll create one
      const response = await matchSchedulerApi.patch<ApiResponse<Match>>(`/api/matches/${matchId}/start`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to start match');
    } catch (error: any) {
      console.error('Error starting match:', error);
      // If the endpoint doesn't exist, we'll handle this gracefully
      if (error.response?.status === 404) {
        throw new Error('Start match functionality not yet implemented in the backend');
      }
      throw error;
    }
  },

  // Get a specific match
  getMatch: async (matchId: string): Promise<Match | null> => {
    try {
      const response = await matchSchedulerApi.get<ApiResponse<Match>>(`/api/matches/${matchId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  },

  // Cancel a match
  cancelMatch: async (matchId: string): Promise<Match> => {
    try {
      const response = await matchSchedulerApi.delete<ApiResponse<Match>>(`/api/matches/${matchId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to cancel match');
    } catch (error) {
      console.error('Error cancelling match:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await matchSchedulerApi.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Match Scheduler health check failed:', error);
      return false;
    }
  },
};