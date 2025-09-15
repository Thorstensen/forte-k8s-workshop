"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivePlayerCount = exports.getTeamAverageSkill = exports.createTeam = void 0;
/**
 * Factory function to create a new Team
 */
const createTeam = (id, name, players, homeVenue, coach, foundedDate = new Date(), isActive = true) => {
    if (!name.trim()) {
        throw new Error('Team name cannot be empty');
    }
    if (!homeVenue.trim()) {
        throw new Error('Home venue cannot be empty');
    }
    if (!coach.trim()) {
        throw new Error('Coach name cannot be empty');
    }
    if (players.length === 0) {
        throw new Error('Team must have at least one player');
    }
    // Check for duplicate player IDs
    const playerIds = players.map(p => p.id);
    const uniquePlayerIds = new Set(playerIds);
    if (playerIds.length !== uniquePlayerIds.size) {
        throw new Error('Team cannot have duplicate players');
    }
    return {
        id,
        name: name.trim(),
        players,
        homeVenue: homeVenue.trim(),
        coach: coach.trim(),
        foundedDate,
        isActive,
    };
};
exports.createTeam = createTeam;
/**
 * Get the average skill level of all active players in the team
 */
const getTeamAverageSkill = (team) => {
    const activePlayers = team.players.filter(p => p.isActive);
    if (activePlayers.length === 0) {
        return 0;
    }
    const totalSkill = activePlayers.reduce((sum, player) => sum + player.skillLevel, 0);
    return Math.round((totalSkill / activePlayers.length) * 100) / 100; // Round to 2 decimal places
};
exports.getTeamAverageSkill = getTeamAverageSkill;
/**
 * Get the number of active players in the team
 */
const getActivePlayerCount = (team) => {
    return team.players.filter(p => p.isActive).length;
};
exports.getActivePlayerCount = getActivePlayerCount;
//# sourceMappingURL=Team.js.map