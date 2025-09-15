"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSchedulerService = exports.MatchSchedulerService = void 0;
const uuid_1 = require("uuid");
const Match_1 = require("../domain/Match");
/**
 * Service for managing match scheduling operations
 */
class MatchSchedulerService {
    matches = new Map();
    constructor() {
        // No initialization of team/player data - this should come from TeamGenerator service
    }
    /**
     * Schedule a new match between two teams
     */
    scheduleMatch(request) {
        try {
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
            const match = (0, Match_1.createMatch)(matchId, request.homeTeamId, request.awayTeamId, request.scheduledDate, request.venue, request.notes);
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
}
exports.MatchSchedulerService = MatchSchedulerService;
// Singleton instance
exports.matchSchedulerService = new MatchSchedulerService();
//# sourceMappingURL=MatchSchedulerService.js.map