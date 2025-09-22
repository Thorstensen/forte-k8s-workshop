"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchDescription = exports.matchInvolvestTeam = exports.isUpcomingMatch = exports.createMatch = exports.getTeamId = exports.MatchStatus = void 0;
/**
 * Possible match statuses
 */
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["SCHEDULED"] = "scheduled";
    MatchStatus["IN_PROGRESS"] = "in_progress";
    MatchStatus["COMPLETED"] = "completed";
    MatchStatus["CANCELLED"] = "cancelled";
    MatchStatus["POSTPONED"] = "postponed";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
/**
 * Shared team ID mapping - consistent across all services
 */
const TEAM_ID_MAP = {
    'Manchester United': 'team-1',
    'Liverpool': 'team-2',
    'Chelsea': 'team-3',
    'Arsenal': 'team-4',
    'Manchester City': 'team-5',
    'Tottenham': 'team-6',
};
/**
 * Get team ID for a team name, or generate a default ID if not found
 */
const getTeamId = (teamName) => {
    return TEAM_ID_MAP[teamName] || `team-${teamName.toLowerCase().replace(/\s+/g, '-')}`;
};
exports.getTeamId = getTeamId;
/**
 * Factory function to create a new Match
 */
const createMatch = (id, homeTeamName, awayTeamName, scheduledDate, venue, notes) => {
    // Validate that teams are different
    if (homeTeamName === awayTeamName) {
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
    // Validate team names
    if (!homeTeamName.trim()) {
        throw new Error('Home team name cannot be empty');
    }
    if (!awayTeamName.trim()) {
        throw new Error('Away team name cannot be empty');
    }
    const homeTeamNameTrimmed = homeTeamName.trim();
    const awayTeamNameTrimmed = awayTeamName.trim();
    return {
        id,
        homeTeamId: (0, exports.getTeamId)(homeTeamNameTrimmed),
        homeTeamName: homeTeamNameTrimmed,
        awayTeamId: (0, exports.getTeamId)(awayTeamNameTrimmed),
        awayTeamName: awayTeamNameTrimmed,
        scheduledDate,
        venue: venue.trim(),
        status: MatchStatus.SCHEDULED,
        createdAt: new Date(),
        notes: notes?.trim(),
    };
};
exports.createMatch = createMatch;
/**
 * Check if a match is upcoming (scheduled and in the future)
 */
const isUpcomingMatch = (match) => {
    return (match.status === MatchStatus.SCHEDULED && match.scheduledDate > new Date());
};
exports.isUpcomingMatch = isUpcomingMatch;
/**
 * Check if a match involves a specific team
 */
const matchInvolvestTeam = (match, teamName) => {
    return match.homeTeamName === teamName || match.awayTeamName === teamName;
};
exports.matchInvolvestTeam = matchInvolvestTeam;
/**
 * Get a user-friendly match description
 */
const getMatchDescription = (match) => {
    const dateStr = match.scheduledDate.toLocaleDateString();
    const timeStr = match.scheduledDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${match.homeTeamName} vs ${match.awayTeamName} on ${dateStr} at ${timeStr} (${match.venue})`;
};
exports.getMatchDescription = getMatchDescription;
//# sourceMappingURL=Match.js.map