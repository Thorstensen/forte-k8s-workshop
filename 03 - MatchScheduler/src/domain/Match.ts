/**
 * Represents a scheduled match between two teams
 */
export interface Match {
  /** Unique identifier for the match */
  readonly id: string;
  /** Home team ID */
  readonly homeTeamId: string;
  /** Away team ID */
  readonly awayTeamId: string;
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
  homeTeamId: string,
  awayTeamId: string,
  scheduledDate: Date,
  venue: string,
  notes?: string | undefined
): Match => {
  // Validate that teams are different
  if (homeTeamId === awayTeamId) {
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

  // Validate team IDs
  if (!homeTeamId.trim()) {
    throw new Error('Home team ID cannot be empty');
  }

  if (!awayTeamId.trim()) {
    throw new Error('Away team ID cannot be empty');
  }

  return {
    id,
    homeTeamId: homeTeamId.trim(),
    awayTeamId: awayTeamId.trim(),
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
  return match.homeTeamId === teamId || match.awayTeamId === teamId;
};

/**
 * Get a user-friendly match description (requires team data from TeamGenerator)
 * Note: This function is commented out as it needs team names from TeamGenerator service
 */
// export const getMatchDescription = (match: Match): string => {
//   const dateStr = match.scheduledDate.toLocaleDateString();
//   const timeStr = match.scheduledDate.toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return `${match.homeTeamId} vs ${match.awayTeamId} on ${dateStr} at ${timeStr} (${match.venue})`;
// };
