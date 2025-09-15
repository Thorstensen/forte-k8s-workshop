"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchDescription = exports.matchInvolvestTeam = exports.isUpcomingMatch = exports.createMatch = exports.MatchStatus = void 0;
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
    return {
        id,
        homeTeamName: homeTeamName.trim(),
        awayTeamName: awayTeamName.trim(),
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