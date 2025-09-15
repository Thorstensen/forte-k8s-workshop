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
export declare enum MatchStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    POSTPONED = "postponed"
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
export declare const createMatch: (id: string, homeTeamName: string, awayTeamName: string, scheduledDate: Date, venue: string, notes?: string | undefined) => Match;
/**
 * Check if a match is upcoming (scheduled and in the future)
 */
export declare const isUpcomingMatch: (match: Match) => boolean;
/**
 * Check if a match involves a specific team
 */
export declare const matchInvolvestTeam: (match: Match, teamName: string) => boolean;
/**
 * Get a user-friendly match description
 */
export declare const getMatchDescription: (match: Match) => string;
//# sourceMappingURL=Match.d.ts.map