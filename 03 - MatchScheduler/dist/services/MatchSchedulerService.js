"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSchedulerService = exports.MatchSchedulerService = void 0;
const uuid_1 = require("uuid");
const Team_1 = require("../domain/Team");
const Match_1 = require("../domain/Match");
const Player_1 = require("../domain/Player");
/**
 * Service for managing match scheduling operations
 */
class MatchSchedulerService {
    matches = new Map();
    teams = new Map();
    constructor() {
        this.initializeSampleData();
    }
    /**
     * Schedule a new match between two teams
     */
    scheduleMatch(request) {
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
            const homePlayerCount = (0, Team_1.getActivePlayerCount)(homeTeam);
            const awayPlayerCount = (0, Team_1.getActivePlayerCount)(awayTeam);
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
            const conflictingMatch = this.findTeamConflict(request.homeTeamId, request.awayTeamId, request.scheduledDate);
            if (conflictingMatch) {
                return {
                    success: false,
                    message: `Scheduling conflict detected. One or both teams already have a match scheduled around this time.`,
                };
            }
            // Create the match
            const matchId = (0, uuid_1.v4)();
            const match = (0, Match_1.createMatch)(matchId, homeTeam, awayTeam, request.scheduledDate, request.venue, request.notes);
            this.matches.set(matchId, match);
            return {
                success: true,
                message: 'Match scheduled successfully',
                match,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }
    /**
     * Get all scheduled matches
     */
    getAllMatches() {
        return Array.from(this.matches.values());
    }
    /**
     * Get upcoming matches only
     */
    getUpcomingMatches() {
        return Array.from(this.matches.values()).filter(Match_1.isUpcomingMatch);
    }
    /**
     * Get a specific match by ID
     */
    getMatchById(matchId) {
        return this.matches.get(matchId);
    }
    /**
     * Get all matches for a specific team
     */
    getMatchesForTeam(teamId) {
        return Array.from(this.matches.values()).filter(match => (0, Match_1.matchInvolvestTeam)(match, teamId));
    }
    /**
     * Get all teams
     */
    getAllTeams() {
        return Array.from(this.teams.values());
    }
    /**
     * Get a specific team by ID
     */
    getTeamById(teamId) {
        return this.teams.get(teamId);
    }
    /**
     * Cancel a scheduled match
     */
    cancelMatch(matchId) {
        const match = this.matches.get(matchId);
        if (!match) {
            return {
                success: false,
                message: `Match with ID "${matchId}" not found`,
            };
        }
        if (match.status !== Match_1.MatchStatus.SCHEDULED) {
            return {
                success: false,
                message: `Cannot cancel match with status "${match.status}"`,
            };
        }
        // Create updated match with cancelled status
        const cancelledMatch = {
            ...match,
            status: Match_1.MatchStatus.CANCELLED,
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
    findTeamConflict(homeTeamId, awayTeamId, scheduledDate) {
        const conflictWindowHours = 3; // Don't allow matches within 3 hours of each other
        const conflictWindowMs = conflictWindowHours * 60 * 60 * 1000;
        return Array.from(this.matches.values()).find(existingMatch => {
            // Skip cancelled matches
            if (existingMatch.status === Match_1.MatchStatus.CANCELLED) {
                return false;
            }
            // Check if either team is involved
            const isTeamInvolved = (0, Match_1.matchInvolvestTeam)(existingMatch, homeTeamId) ||
                (0, Match_1.matchInvolvestTeam)(existingMatch, awayTeamId);
            if (!isTeamInvolved) {
                return false;
            }
            // Check time conflict
            const timeDifference = Math.abs(existingMatch.scheduledDate.getTime() - scheduledDate.getTime());
            return timeDifference < conflictWindowMs;
        });
    }
    /**
     * Initialize sample data for demonstration
     */
    initializeSampleData() {
        // Create sample players
        const players1 = [
            (0, Player_1.createPlayer)('p1', 'John Goalkeeper', Player_1.PlayerPosition.GOALKEEPER, 8),
            (0, Player_1.createPlayer)('p2', 'Mike Defender', Player_1.PlayerPosition.DEFENDER, 7),
            (0, Player_1.createPlayer)('p3', 'Sarah Defender', Player_1.PlayerPosition.DEFENDER, 8),
            (0, Player_1.createPlayer)('p4', 'Tom Defender', Player_1.PlayerPosition.DEFENDER, 6),
            (0, Player_1.createPlayer)('p5', 'Lisa Defender', Player_1.PlayerPosition.DEFENDER, 7),
            (0, Player_1.createPlayer)('p6', 'Chris Midfielder', Player_1.PlayerPosition.MIDFIELDER, 9),
            (0, Player_1.createPlayer)('p7', 'Anna Midfielder', Player_1.PlayerPosition.MIDFIELDER, 8),
            (0, Player_1.createPlayer)('p8', 'Dave Midfielder', Player_1.PlayerPosition.MIDFIELDER, 7),
            (0, Player_1.createPlayer)('p9', 'Emma Midfielder', Player_1.PlayerPosition.MIDFIELDER, 8),
            (0, Player_1.createPlayer)('p10', 'Ryan Forward', Player_1.PlayerPosition.FORWARD, 9),
            (0, Player_1.createPlayer)('p11', 'Sophie Forward', Player_1.PlayerPosition.FORWARD, 8),
        ];
        const players2 = [
            (0, Player_1.createPlayer)('p12', 'Alex Keeper', Player_1.PlayerPosition.GOALKEEPER, 7),
            (0, Player_1.createPlayer)('p13', 'Ben Defense', Player_1.PlayerPosition.DEFENDER, 8),
            (0, Player_1.createPlayer)('p14', 'Chloe Defense', Player_1.PlayerPosition.DEFENDER, 7),
            (0, Player_1.createPlayer)('p15', 'Dan Defense', Player_1.PlayerPosition.DEFENDER, 9),
            (0, Player_1.createPlayer)('p16', 'Eve Defense', Player_1.PlayerPosition.DEFENDER, 6),
            (0, Player_1.createPlayer)('p17', 'Frank Midfield', Player_1.PlayerPosition.MIDFIELDER, 8),
            (0, Player_1.createPlayer)('p18', 'Grace Midfield', Player_1.PlayerPosition.MIDFIELDER, 9),
            (0, Player_1.createPlayer)('p19', 'Henry Midfield', Player_1.PlayerPosition.MIDFIELDER, 7),
            (0, Player_1.createPlayer)('p20', 'Ivy Midfield', Player_1.PlayerPosition.MIDFIELDER, 8),
            (0, Player_1.createPlayer)('p21', 'Jack Attack', Player_1.PlayerPosition.FORWARD, 10),
            (0, Player_1.createPlayer)('p22', 'Kate Attack', Player_1.PlayerPosition.FORWARD, 9),
        ];
        // Create sample teams
        const team1 = (0, Team_1.createTeam)('team1', 'Thunder Hawks', players1, 'Thunder Stadium', 'Coach Johnson', new Date('2020-01-15'));
        const team2 = (0, Team_1.createTeam)('team2', 'Lightning Bolts', players2, 'Lightning Arena', 'Coach Martinez', new Date('2019-08-22'));
        this.teams.set(team1.id, team1);
        this.teams.set(team2.id, team2);
        // Create a sample scheduled match
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // One week from now
        futureDate.setHours(15, 0, 0, 0); // 3 PM
        const sampleMatch = (0, Match_1.createMatch)('match1', team1, team2, futureDate, 'Central Stadium', 'Season opener - championship match');
        this.matches.set(sampleMatch.id, sampleMatch);
    }
}
exports.MatchSchedulerService = MatchSchedulerService;
// Singleton instance
exports.matchSchedulerService = new MatchSchedulerService();
//# sourceMappingURL=MatchSchedulerService.js.map