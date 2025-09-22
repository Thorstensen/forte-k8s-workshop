"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchInvolvestTeam = exports.isUpcomingMatch = exports.createMatch = exports.MatchStatus = void 0;
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
const createMatch = (id, homeTeamId, awayTeamId, scheduledDate, venue, notes) => {
    // Validate that teams are different
    if (homeTeamId === awayTeamId) {
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
    // Validate team IDs
    if (!homeTeamId.trim()) {
        throw new Error('Home team ID cannot be empty');
    }
    if (!awayTeamId.trim()) {
        throw new Error('Away team ID cannot be empty');
    }
    return {
        id,
        homeTeamId: homeTeamId.trim(),
        awayTeamId: awayTeamId.trim(),
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
    return match.homeTeamId === teamId || match.awayTeamId === teamId;
};
exports.matchInvolvestTeam = matchInvolvestTeam;
/**
 * Get a user-friendly match description (requires team data from TeamGenerator)
 * Note: This function is commented out as it needs team names from TeamGenerator service
 */
// export const getMatchDescription = (match: Match): string => {
//   const dateStr = match.scheduledDate.toLocaleDateString();
//   const timeStr = match.scheduledDate.toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });
//   return `${match.homeTeamId} vs ${match.awayTeamId} on ${dateStr} at ${timeStr} (${match.venue})`;
// };
//# sourceMappingURL=Match.js.map