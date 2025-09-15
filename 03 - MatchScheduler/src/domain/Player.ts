/**
 * Represents a player in the match scheduling system
 */
export interface Player {
  /** Unique identifier for the player */
  readonly id: string;
  /** Player's full name */
  readonly name: string;
  /** Player's position on the field */
  readonly position: PlayerPosition;
  /** Player's skill level (1-10) */
  readonly skillLevel: number;
  /** Whether the player is currently available for matches */
  readonly isActive: boolean;
}

/**
 * Valid player positions
 */
export enum PlayerPosition {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward',
}

/**
 * Factory function to create a new Player
 */
export const createPlayer = (
  id: string,
  name: string,
  position: PlayerPosition,
  skillLevel: number,
  isActive: boolean = true
): Player => {
  if (skillLevel < 1 || skillLevel > 10) {
    throw new Error('Skill level must be between 1 and 10');
  }

  if (!name.trim()) {
    throw new Error('Player name cannot be empty');
  }

  return {
    id,
    name: name.trim(),
    position,
    skillLevel,
    isActive,
  };
};
