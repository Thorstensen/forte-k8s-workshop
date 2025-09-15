import { v4 as uuidv4 } from 'uuid';
import {
  Match,
  ScheduleMatchRequest,
  createMatch,
  MatchStatus,
  isUpcomingMatch,
  matchInvolvestTeam,
} from '../domain/Match';

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

  constructor() {
    // No initialization of team/player data - this should come from TeamGenerator service
  }

  /**
   * Schedule a new match between two teams
   */
  public scheduleMatch(request: ScheduleMatchRequest): ScheduleResponse {
    try {
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

      this.matches.set(matchId, match);

      return {
        success: true,
        message: 'Match scheduled successfully',
        match,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
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
