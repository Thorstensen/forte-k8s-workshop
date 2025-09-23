import { teamGeneratorApi } from './api';
import { Team, ApiResponse } from '../types';

export const teamService = {
  // Generate a new team - this would call the TeamGenerator service
  generateTeam: async (teamName: string): Promise<any> => {
    try {
      const response = await teamGeneratorApi.get('/api/teams', {
        params: {
          teamName,
        },
      });
      
      // The TeamGenerator API returns the team data directly, not wrapped in ApiResponse
      if (response.data) {
        return response.data;
      }
      
      throw new Error('Failed to generate team');
    } catch (error) {
      console.error('Error generating team:', error);
      throw error;
    }
  },

  // Get all teams
  getTeams: async (): Promise<Team[]> => {
    try {
      const response = await teamGeneratorApi.get<ApiResponse<Team[]>>('/api/teams');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await teamGeneratorApi.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Team Generator health check failed:', error);
      return false;
    }
  },
};