/**
 * Represents a scheduled match between two teams
 */
export interface Match {
  /** Unique identifier for the match */
  readonly id: string;
  /** Home team name */
  readonly homeTeamName: string;
  /** Away team name */
  readonly awayTeamName: string;
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
  /** Name of the home team */
  readonly homeTeamName: string;
  /** Name of the away team */
  readonly awayTeamName: string;
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
  homeTeamName: string,
  awayTeamName: string,
  scheduledDate: Date,
  venue: string,
  notes?: string | undefined
): Match => {
  // Validate that teams are different
  if (homeTeamName === awayTeamName) {
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

  // Validate team names
  if (!homeTeamName.trim()) {
    throw new Error('Home team name cannot be empty');
  }

  if (!awayTeamName.trim()) {
    throw new Error('Away team name cannot be empty');
  }

  return {
    id,
    homeTeamName: homeTeamName.trim(),
    awayTeamName: awayTeamName.trim(),
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
export const matchInvolvestTeam = (match: Match, teamName: string): boolean => {
  return match.homeTeamName === teamName || match.awayTeamName === teamName;
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

  return `${match.homeTeamName} vs ${match.awayTeamName} on ${dateStr} at ${timeStr} (${match.venue})`;
};
