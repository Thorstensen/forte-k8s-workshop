import { Match, ScheduleMatchRequest } from '../domain/Match';
/**
 * Response object for scheduling operations
 */
export interface ScheduleResponse {
    readonly success: boolean;
    readonly message: string;
    readonly match?: Match;
}
/**
 * Service for managing match scheduling operations
 */
export declare class MatchSchedulerService {
    private readonly matches;
    constructor();
    /**
     * Schedule a new match between two teams
     */
    scheduleMatch(request: ScheduleMatchRequest): ScheduleResponse;
    /**
     * Get all scheduled matches
     */
    getAllMatches(): readonly Match[];
    /**
     * Get upcoming matches only
     */
    getUpcomingMatches(): readonly Match[];
    /**
     * Get a specific match by ID
     */
    getMatchById(matchId: string): Match | undefined;
    /**
     * Get all matches for a specific team
     */
    getMatchesForTeam(teamId: string): readonly Match[];
    /**
     * Cancel a scheduled match
     */
    cancelMatch(matchId: string): ScheduleResponse;
    /**
     * Check for scheduling conflicts for teams around a specific date
     * Returns conflicting match if found, undefined otherwise
     */
    private findTeamConflict;
}
export declare const matchSchedulerService: MatchSchedulerService;
//# sourceMappingURL=MatchSchedulerService.d.ts.map