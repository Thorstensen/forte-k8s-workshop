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
const createMatch = (id, homeTeam, awayTeam, scheduledDate, venue, notes) => {
    // Validate that teams are different
    if (homeTeam.id === awayTeam.id) {
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
    // Validate that both teams are active
    if (!homeTeam.isActive) {
        throw new Error(`Home team "${homeTeam.name}" is not active`);
    }
    if (!awayTeam.isActive) {
        throw new Error(`Away team "${awayTeam.name}" is not active`);
    }
    return {
        id,
        homeTeam,
        awayTeam,
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
const matchInvolvestTeam = (match, teamId) => {
    return match.homeTeam.id === teamId || match.awayTeam.id === teamId;
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
    return `${match.homeTeam.name} vs ${match.awayTeam.name} on ${dateStr} at ${timeStr} (${match.venue})`;
};
exports.getMatchDescription = getMatchDescription;
//# sourceMappingURL=Match.js.map