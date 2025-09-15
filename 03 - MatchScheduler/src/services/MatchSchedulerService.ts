import { v4 as uuidv4 } from 'uuid';
import { Team, createTeam, getActivePlayerCount } from '../domain/Team';
import {
  Match,
  ScheduleMatchRequest,
  createMatch,
  MatchStatus,
  isUpcomingMatch,
  matchInvolvestTeam,
} from '../domain/Match';
import { Player, createPlayer, PlayerPosition } from '../domain/Player';

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
  private readonly teams: Map<string, Team> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  /**
   * Schedule a new match between two teams
   */
  public scheduleMatch(request: ScheduleMatchRequest): ScheduleResponse {
    try {
      // Validate teams exist
      const homeTeam = this.teams.get(request.homeTeamId);
      const awayTeam = this.teams.get(request.awayTeamId);

      if (!homeTeam) {
        return {
          success: false,
          message: `Home team with ID "${request.homeTeamId}" not found`,
        };
      }

      if (!awayTeam) {
        return {
          success: false,
          message: `Away team with ID "${request.awayTeamId}" not found`,
        };
      }

      // Check if teams have enough active players
      const minPlayersRequired = 11;
      const homePlayerCount = getActivePlayerCount(homeTeam);
      const awayPlayerCount = getActivePlayerCount(awayTeam);

      if (homePlayerCount < minPlayersRequired) {
        return {
          success: false,
          message: `Home team "${homeTeam.name}" does not have enough active players (${homePlayerCount}/${minPlayersRequired})`,
        };
      }

      if (awayPlayerCount < minPlayersRequired) {
        return {
          success: false,
          message: `Away team "${awayTeam.name}" does not have enough active players (${awayPlayerCount}/${minPlayersRequired})`,
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
        homeTeam,
        awayTeam,
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
   * Get all teams
   */
  public getAllTeams(): readonly Team[] {
    return Array.from(this.teams.values());
  }

  /**
   * Get a specific team by ID
   */
  public getTeamById(teamId: string): Team | undefined {
    return this.teams.get(teamId);
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

  /**
   * Initialize sample data for demonstration
   */
  private initializeSampleData(): void {
    // Create sample players
    const players1: Player[] = [
      createPlayer('p1', 'John Goalkeeper', PlayerPosition.GOALKEEPER, 8),
      createPlayer('p2', 'Mike Defender', PlayerPosition.DEFENDER, 7),
      createPlayer('p3', 'Sarah Defender', PlayerPosition.DEFENDER, 8),
      createPlayer('p4', 'Tom Defender', PlayerPosition.DEFENDER, 6),
      createPlayer('p5', 'Lisa Defender', PlayerPosition.DEFENDER, 7),
      createPlayer('p6', 'Chris Midfielder', PlayerPosition.MIDFIELDER, 9),
      createPlayer('p7', 'Anna Midfielder', PlayerPosition.MIDFIELDER, 8),
      createPlayer('p8', 'Dave Midfielder', PlayerPosition.MIDFIELDER, 7),
      createPlayer('p9', 'Emma Midfielder', PlayerPosition.MIDFIELDER, 8),
      createPlayer('p10', 'Ryan Forward', PlayerPosition.FORWARD, 9),
      createPlayer('p11', 'Sophie Forward', PlayerPosition.FORWARD, 8),
    ];

    const players2: Player[] = [
      createPlayer('p12', 'Alex Keeper', PlayerPosition.GOALKEEPER, 7),
      createPlayer('p13', 'Ben Defense', PlayerPosition.DEFENDER, 8),
      createPlayer('p14', 'Chloe Defense', PlayerPosition.DEFENDER, 7),
      createPlayer('p15', 'Dan Defense', PlayerPosition.DEFENDER, 9),
      createPlayer('p16', 'Eve Defense', PlayerPosition.DEFENDER, 6),
      createPlayer('p17', 'Frank Midfield', PlayerPosition.MIDFIELDER, 8),
      createPlayer('p18', 'Grace Midfield', PlayerPosition.MIDFIELDER, 9),
      createPlayer('p19', 'Henry Midfield', PlayerPosition.MIDFIELDER, 7),
      createPlayer('p20', 'Ivy Midfield', PlayerPosition.MIDFIELDER, 8),
      createPlayer('p21', 'Jack Attack', PlayerPosition.FORWARD, 10),
      createPlayer('p22', 'Kate Attack', PlayerPosition.FORWARD, 9),
    ];

    // Create sample teams
    const team1 = createTeam(
      'team1',
      'Thunder Hawks',
      players1,
      'Thunder Stadium',
      'Coach Johnson',
      new Date('2020-01-15')
    );

    const team2 = createTeam(
      'team2',
      'Lightning Bolts',
      players2,
      'Lightning Arena',
      'Coach Martinez',
      new Date('2019-08-22')
    );

    this.teams.set(team1.id, team1);
    this.teams.set(team2.id, team2);

    // Create a sample scheduled match
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // One week from now
    futureDate.setHours(15, 0, 0, 0); // 3 PM

    const sampleMatch = createMatch(
      'match1',
      team1,
      team2,
      futureDate,
      'Central Stadium',
      'Season opener - championship match'
    );

    this.matches.set(sampleMatch.id, sampleMatch);
  }
}

// Singleton instance
export const matchSchedulerService = new MatchSchedulerService();
