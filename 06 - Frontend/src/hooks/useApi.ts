import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService } from '../services/matchService';
import { bettingService } from '../services/bettingService';
import { notificationService } from '../services/notificationService';
import { healthService } from '../services/healthService';
import { ScheduleMatchRequest } from '../types';

// Match hooks
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: matchService.getAllMatches,
    staleTime: 30000, // 30 seconds
  });
};

export const useUpcomingMatches = () => {
  return useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: matchService.getUpcomingMatches,
    staleTime: 30000,
  });
};

export const useMatch = (matchId: string) => {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => matchService.getMatch(matchId),
    enabled: !!matchId,
  });
};

export const useScheduleMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (matchRequest: ScheduleMatchRequest) => matchService.scheduleMatch(matchRequest),
    onSuccess: () => {
      // Invalidate and refetch matches
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

export const useStartMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (matchId: string) => matchService.startMatch(matchId),
    onSuccess: (_, matchId) => {
      // Invalidate and refetch matches
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['matches', matchId] });
      // Also invalidate notifications as they might be generated
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Betting hooks
export const useMatchOdds = (matchId: string) => {
  return useQuery({
    queryKey: ['betting', 'odds', matchId],
    queryFn: () => bettingService.getMatchOdds(matchId),
    enabled: !!matchId,
    staleTime: 60000, // 1 minute for odds
  });
};

export const useBettingMatches = () => {
  return useQuery({
    queryKey: ['betting', 'matches'],
    queryFn: bettingService.getMatches,
    staleTime: 30000,
  });
};

export const usePlaceBet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (betData: { match_id: string; bet_type: string; option: string; stake: number }) => 
      bettingService.placeBet(betData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['betting', 'bets'] });
    },
  });
};

// Notification hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAllNotifications,
    staleTime: 10000, // 10 seconds for notifications
  });
};

export const useMatchNotifications = (matchId: string) => {
  return useQuery({
    queryKey: ['notifications', 'match', matchId],
    queryFn: () => notificationService.getMatchNotifications(matchId),
    enabled: !!matchId,
    staleTime: 10000,
  });
};

export const useImportantNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'important'],
    queryFn: notificationService.getImportantNotifications,
    staleTime: 10000,
  });
};

// Health hooks
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: healthService.checkSystemHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
    retry: 1, // Only retry once for health checks
  });
};