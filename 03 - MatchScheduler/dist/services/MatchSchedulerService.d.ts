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
    private teamsCache;
    private lastTeamCacheUpdate;
    private readonly CACHE_DURATION_MS;
    constructor();
    /**
     * Initialize service by loading data from TeamGenerator
     */
    private initializeFromTeamGenerator;
    /**
     * Refresh teams cache from TeamGenerator
     */
    private refreshTeamsCache;
    /**
     * Ensure teams cache is fresh
     */
    private ensureTeamsCacheIsFresh;
    /**
     * Validate that team IDs exist in TeamGenerator
     */
    private validateTeamIds;
    /**
     * Schedule a new match between two teams
     */
    scheduleMatch(request: ScheduleMatchRequest): Promise<ScheduleResponse>;
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