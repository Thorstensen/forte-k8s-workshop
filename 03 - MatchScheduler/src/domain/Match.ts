import { Team } from './Team';

/**
 * Represents a scheduled match between two teams
 */
export interface Match {
  /** Unique identifier for the match */
  readonly id: string;
  /** Home team */
  readonly homeTeam: Team;
  /** Away team */
  readonly awayTeam: Team;
  /** Scheduled date and time for the match */
  readonly scheduledDate: Date;
  /** Venue where the match will be played */
  readonly venue: string;
  /** Current status of the match */
  readonly status: MatchStatus;
  /** When the match was created/scheduled */
  readonly createdAt: Date;
  /** Optional notes about the match */
  readonly notes?: string | undefined;
}

/**
 * Possible match statuses
 */
export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

/**
 * Optional notes about the match
 */
export interface ScheduleMatchRequest {
  /** ID of the home team */
  readonly homeTeamId: string;
  /** ID of the away team */
  readonly awayTeamId: string;
  /** Scheduled date and time for the match */
  readonly scheduledDate: Date;
  /** Venue where the match will be played */
  readonly venue: string;
  /** Optional notes about the match */
  readonly notes?: string | undefined;
}

/**
 * Factory function to create a new Match
 */
export const createMatch = (
  id: string,
  homeTeam: Team,
  awayTeam: Team,
  scheduledDate: Date,
  venue: string,
  notes?: string | undefined
): Match => {
  // Validate that teams are different
  if (homeTeam.id === awayTeam.id) {
    throw new Error('A team cannot play against itself');
  }

  // Validate that the scheduled date is in the future
  const now = new Date();
  if (scheduledDate <= now) {
    throw new Error('Match must be scheduled for a future date');
  }

  // Validate venue
  if (!venue.trim()) {
    throw new Error('Venue cannot be empty');
  }

  // Validate that both teams are active
  if (!homeTeam.isActive) {
    throw new Error(`Home team "${homeTeam.name}" is not active`);
  }

  if (!awayTeam.isActive) {
    throw new Error(`Away team "${awayTeam.name}" is not active`);
  }

  return {
    id,
    homeTeam,
    awayTeam,
    scheduledDate,
    venue: venue.trim(),
    status: MatchStatus.SCHEDULED,
    createdAt: new Date(),
    notes: notes?.trim(),
  };
};

/**
 * Check if a match is upcoming (scheduled and in the future)
 */
export const isUpcomingMatch = (match: Match): boolean => {
  return (
    match.status === MatchStatus.SCHEDULED && match.scheduledDate > new Date()
  );
};

/**
 * Check if a match involves a specific team
 */
export const matchInvolvestTeam = (match: Match, teamId: string): boolean => {
  return match.homeTeam.id === teamId || match.awayTeam.id === teamId;
};

/**
 * Get a user-friendly match description
 */
export const getMatchDescription = (match: Match): string => {
  const dateStr = match.scheduledDate.toLocaleDateString();
  const timeStr = match.scheduledDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${match.homeTeam.name} vs ${match.awayTeam.name} on ${dateStr} at ${timeStr} (${match.venue})`;
};
