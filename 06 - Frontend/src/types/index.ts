// Shared types across the Forte K8s Workshop microservices

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  country?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  scheduledDate: string;
  venue: string;
  status: MatchStatus;
  createdAt: string;
  notes?: string;
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

export interface ScheduleMatchRequest {
  homeTeamName: string;
  awayTeamName: string;
  scheduledDate: string;
  venue: string;
  notes?: string;
}

export interface BettingOdds {
  match_id: string;
  bet_type: string;
  options: {
    [key: string]: number;
  };
}

export interface Notification {
  id: string;
  matchId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  priority: string;
  isImportant: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Shared team IDs as per shared-ids.md
export const TEAMS: Team[] = [
  { id: 'team-1', name: 'Manchester United', shortName: 'MUN', country: 'England' },
  { id: 'team-2', name: 'Liverpool', shortName: 'LIV', country: 'England' },
  { id: 'team-3', name: 'Chelsea', shortName: 'CHE', country: 'England' },
  { id: 'team-4', name: 'Arsenal', shortName: 'ARS', country: 'England' },
  { id: 'team-5', name: 'Manchester City', shortName: 'MCI', country: 'England' },
  { id: 'team-6', name: 'Tottenham', shortName: 'TOT', country: 'England' },
];