import { bettingApi } from './api';
import { BettingOdds, Match, ApiResponse } from '../types';

export const bettingService = {
  // Get all available matches for betting
  getMatches: async (): Promise<Match[]> => {
    try {
      const response = await bettingApi.get<ApiResponse<Match[]>>('/api/matches');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching betting matches:', error);
      throw error;
    }
  },

  // Get odds for a specific match
  getMatchOdds: async (matchId: string): Promise<BettingOdds[]> => {
    try {
      const response = await bettingApi.get<ApiResponse<BettingOdds[]>>(`/api/matches/${matchId}/odds`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching match odds:', error);
      throw error;
    }
  },

  // Get odds for a specific bet type
  getBetTypeOdds: async (matchId: string, betType: string): Promise<BettingOdds | null> => {
    try {
      const response = await bettingApi.get<ApiResponse<BettingOdds>>(`/api/matches/${matchId}/odds/${betType}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching bet type odds:', error);
      return null;
    }
  },

  // Place a bet
  placeBet: async (betData: {
    match_id: string;
    bet_type: string;
    option: string;
    stake: number;
  }): Promise<any> => {
    try {
      const response = await bettingApi.post<ApiResponse<any>>('/api/bets', betData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to place bet');
    } catch (error) {
      console.error('Error placing bet:', error);
      throw error;
    }
  },

  // Get all bets
  getAllBets: async (): Promise<any[]> => {
    try {
      const response = await bettingApi.get<ApiResponse<any[]>>('/api/bets');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching bets:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await bettingApi.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Betting Service health check failed:', error);
      return false;
    }
  },
};