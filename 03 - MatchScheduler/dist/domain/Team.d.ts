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
export declare const createTeam: (id: string, name: string, players: readonly Player[], homeVenue: string, coach: string, foundedDate?: Date, isActive?: boolean) => Team;
/**
 * Get the average skill level of all active players in the team
 */
export declare const getTeamAverageSkill: (team: Team) => number;
/**
 * Get the number of active players in the team
 */
export declare const getActivePlayerCount: (team: Team) => number;
//# sourceMappingURL=Team.d.ts.map