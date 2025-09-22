"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSchedulerService = exports.MatchSchedulerService = void 0;
const uuid_1 = require("uuid");
const Match_1 = require("../domain/Match");
const TeamGeneratorClient_1 = require("../clients/TeamGeneratorClient");
/**
 * Service for managing match scheduling operations
 */
class MatchSchedulerService {
    matches = new Map();
    teamsCache = new Map();
    lastTeamCacheUpdate = new Date(0);
    CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
    constructor() {
        // Initialize by loading existing matches from TeamGenerator
        this.initializeFromTeamGenerator();
    }
    /**
     * Initialize service by loading data from TeamGenerator
     */
    async initializeFromTeamGenerator() {
        try {
            // Load existing matches from TeamGenerator
            const existingMatches = await TeamGeneratorClient_1.teamGeneratorClient.getAllMatches();
            for (const matchData of existingMatches) {
                const match = {
                    id: matchData.id,
                    homeTeamId: matchData.homeTeamId,
                    awayTeamId: matchData.awayTeamId,
                    scheduledDate: new Date(matchData.scheduledDate),
                    venue: matchData.venue,
                    status: matchData.status,
                    createdAt: new Date(matchData.createdAt),
                    notes: matchData.notes,
                };
                this.matches.set(match.id, match);
            }
            // Load teams for validation
            await this.refreshTeamsCache();
            console.log(`Initialized MatchScheduler with ${this.matches.size} existing matches`);
        }
        catch (error) {
            console.error('Failed to initialize from TeamGenerator:', error);
            // Continue with empty state if TeamGenerator is not available
        }
    }
    /**
     * Refresh teams cache from TeamGenerator
     */
    async refreshTeamsCache() {
        try {
            const teams = await TeamGeneratorClient_1.teamGeneratorClient.getAllTeams();
            this.teamsCache.clear();
            for (const team of teams) {
                this.teamsCache.set(team.id, team);
            }
            this.lastTeamCacheUpdate = new Date();
        }
        catch (error) {
            console.error('Failed to refresh teams cache:', error);
            throw new Error('Unable to fetch teams from TeamGenerator service');
        }
    }
    /**
     * Ensure teams cache is fresh
     */
    async ensureTeamsCacheIsFresh() {
        const now = new Date();
        if (now.getTime() - this.lastTeamCacheUpdate.getTime() > this.CACHE_DURATION_MS) {
            await this.refreshTeamsCache();
        }
    }
    /**
     * Validate that team IDs exist in TeamGenerator
     */
    async validateTeamIds(homeTeamId, awayTeamId) {
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
    async scheduleMatch(request) {
        try {
            // Validate team IDs exist in TeamGenerator
            const teamValidation = await this.validateTeamIds(request.homeTeamId, request.awayTeamId);
            if (!teamValidation.valid) {
                return {
                    success: false,
                    message: teamValidation.message,
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
            const match = (0, Match_1.createMatch)(matchId, request.homeTeamId, request.awayTeamId, request.scheduledDate, request.venue, request.notes);
            // Store the match
            this.matches.set(match.id, match);
            return {
                success: true,
                message: 'Match scheduled successfully',
                match,
            };
        }
        catch (error) {
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