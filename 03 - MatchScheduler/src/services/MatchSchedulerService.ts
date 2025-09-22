import { v4 as uuidv4 } from 'uuid';
import {
  Match,
  ScheduleMatchRequest,
  createMatch,
  MatchStatus,
  isUpcomingMatch,
  matchInvolvestTeam,
} from '../domain/Match';
import { teamGeneratorClient, TeamData } from '../clients/TeamGeneratorClient';

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
export class MatchSchedulerService {
  private readonly matches: Map<string, Match> = new Map();
  private teamsCache: Map<string, TeamData> = new Map();
  private lastTeamCacheUpdate: Date = new Date(0);
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Initialize by loading existing matches from TeamGenerator
    this.initializeFromTeamGenerator();
  }

  /**
   * Initialize service by loading data from TeamGenerator
   */
  private async initializeFromTeamGenerator(): Promise<void> {
    try {
      // Load existing matches from TeamGenerator
      const existingMatches = await teamGeneratorClient.getAllMatches();
      for (const matchData of existingMatches) {
        const match: Match = {
          id: matchData.id,
          homeTeamId: matchData.homeTeamId,
          awayTeamId: matchData.awayTeamId,
          scheduledDate: new Date(matchData.scheduledDate),
          venue: matchData.venue,
          status: matchData.status as MatchStatus,
          createdAt: new Date(matchData.createdAt),
          notes: matchData.notes,
        };
        this.matches.set(match.id, match);
      }
      
      // Load teams for validation
      await this.refreshTeamsCache();
      
      console.log(`Initialized MatchScheduler with ${this.matches.size} existing matches`);
    } catch (error) {
      console.error('Failed to initialize from TeamGenerator:', error);
      // Continue with empty state if TeamGenerator is not available
    }
  }

  /**
   * Refresh teams cache from TeamGenerator
   */
  private async refreshTeamsCache(): Promise<void> {
    try {
      const teams = await teamGeneratorClient.getAllTeams();
      this.teamsCache.clear();
      for (const team of teams) {
        this.teamsCache.set(team.id, team);
      }
      this.lastTeamCacheUpdate = new Date();
    } catch (error) {
      console.error('Failed to refresh teams cache:', error);
      throw new Error('Unable to fetch teams from TeamGenerator service');
    }
  }

  /**
   * Ensure teams cache is fresh
   */
  private async ensureTeamsCacheIsFresh(): Promise<void> {
    const now = new Date();
    if (now.getTime() - this.lastTeamCacheUpdate.getTime() > this.CACHE_DURATION_MS) {
      await this.refreshTeamsCache();
    }
  }

  /**
   * Validate that team IDs exist in TeamGenerator
   */
  private async validateTeamIds(homeTeamId: string, awayTeamId: string): Promise<{ valid: boolean; message?: string }> {
    await this.ensureTeamsCacheIsFresh();
    
    const homeTeam = this.teamsCache.get(homeTeamId);
    const awayTeam = this.teamsCache.get(awayTeamId);
    
    if (!homeTeam) {
      return { valid: false, message: `Home team with ID '${homeTeamId}' not found in TeamGenerator` };
    }
    
    if (!awayTeam) {
      return { valid: false, message: `Away team with ID '${awayTeamId}' not found in TeamGenerator` };
    }
    
    return { valid: true };
  }

  /**
   * Schedule a new match between two teams
   */
  public async scheduleMatch(request: ScheduleMatchRequest): Promise<ScheduleResponse> {
    try {
      // Validate team IDs exist in TeamGenerator
      const teamValidation = await this.validateTeamIds(request.homeTeamId, request.awayTeamId);
      if (!teamValidation.valid) {
        return {
          success: false,
          message: teamValidation.message!,
        };
      }

      // Check for scheduling conflicts
      const conflictingMatch = this.findTeamConflict(
        request.homeTeamId,
        request.awayTeamId,
        request.scheduledDate
      );

      if (conflictingMatch) {
        return {
          success: false,
          message: `Scheduling conflict detected. One or both teams already have a match scheduled around this time.`,
        };
      }

      // Create the match
      const matchId = uuidv4();
      const match = createMatch(
        matchId,
        request.homeTeamId,
        request.awayTeamId,
        request.scheduledDate,
        request.venue,
        request.notes
      );

      // Store the match
      this.matches.set(match.id, match);

      return {
        success: true,
        message: 'Match scheduled successfully',
        match,
      };
    } catch (error) {
      console.error('Error scheduling match:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all scheduled matches
   */
  public getAllMatches(): readonly Match[] {
    return Array.from(this.matches.values());
  }

  /**
   * Get upcoming matches only
   */
  public getUpcomingMatches(): readonly Match[] {
    return Array.from(this.matches.values()).filter(isUpcomingMatch);
  }

  /**
   * Get a specific match by ID
   */
  public getMatchById(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }

  /**
   * Get all matches for a specific team
   */
  public getMatchesForTeam(teamId: string): readonly Match[] {
    return Array.from(this.matches.values()).filter(match =>
      matchInvolvestTeam(match, teamId)
    );
  }

  /**
   * Cancel a scheduled match
   */
  public cancelMatch(matchId: string): ScheduleResponse {
    const match = this.matches.get(matchId);

    if (!match) {
      return {
        success: false,
        message: `Match with ID "${matchId}" not found`,
      };
    }

    if (match.status !== MatchStatus.SCHEDULED) {
      return {
        success: false,
        message: `Cannot cancel match with status "${match.status}"`,
      };
    }

    // Create updated match with cancelled status
    const cancelledMatch: Match = {
      ...match,
      status: MatchStatus.CANCELLED,
    };

    this.matches.set(matchId, cancelledMatch);

    return {
      success: true,
      message: 'Match cancelled successfully',
      match: cancelledMatch,
    };
  }

  /**
   * Check for scheduling conflicts for teams around a specific date
   * Returns conflicting match if found, undefined otherwise
   */
  private findTeamConflict(
    homeTeamId: string,
    awayTeamId: string,
    scheduledDate: Date
  ): Match | undefined {
    const conflictWindowHours = 3; // Don't allow matches within 3 hours of each other
    const conflictWindowMs = conflictWindowHours * 60 * 60 * 1000;

    return Array.from(this.matches.values()).find(existingMatch => {
      // Skip cancelled matches
      if (existingMatch.status === MatchStatus.CANCELLED) {
        return false;
      }

      // Check if either team is involved
      const isTeamInvolved =
        matchInvolvestTeam(existingMatch, homeTeamId) ||
        matchInvolvestTeam(existingMatch, awayTeamId);

      if (!isTeamInvolved) {
        return false;
      }

      // Check time conflict
      const timeDifference = Math.abs(
        existingMatch.scheduledDate.getTime() - scheduledDate.getTime()
      );

      return timeDifference < conflictWindowMs;
    });
  }
}

// Singleton instance
export const matchSchedulerService = new MatchSchedulerService();
