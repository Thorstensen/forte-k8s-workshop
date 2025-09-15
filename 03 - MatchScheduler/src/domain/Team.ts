import { Player } from './Player';

/**
 * Represents a team in the match scheduling system
 */
export interface Team {
  /** Unique identifier for the team */
  readonly id: string;
  /** Team's display name */
  readonly name: string;
  /** List of players in the team */
  readonly players: readonly Player[];
  /** Team's home venue */
  readonly homeVenue: string;
  /** Team coach or manager name */
  readonly coach: string;
  /** When the team was founded/created */
  readonly foundedDate: Date;
  /** Whether the team is currently active */
  readonly isActive: boolean;
}

/**
 * Factory function to create a new Team
 */
export const createTeam = (
  id: string,
  name: string,
  players: readonly Player[],
  homeVenue: string,
  coach: string,
  foundedDate: Date = new Date(),
  isActive: boolean = true
): Team => {
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

/**
 * Get the average skill level of all active players in the team
 */
export const getTeamAverageSkill = (team: Team): number => {
  const activePlayers = team.players.filter(p => p.isActive);
  if (activePlayers.length === 0) {
    return 0;
  }

  const totalSkill = activePlayers.reduce(
    (sum, player) => sum + player.skillLevel,
    0
  );
  return Math.round((totalSkill / activePlayers.length) * 100) / 100; // Round to 2 decimal places
};

/**
 * Get the number of active players in the team
 */
export const getActivePlayerCount = (team: Team): number => {
  return team.players.filter(p => p.isActive).length;
};
