/**
 * Team data structure from TeamGenerator API
 */
export interface TeamData {
    readonly id: string;
    readonly name: string;
}
/**
 * Player data structure from TeamGenerator API
 */
export interface PlayerData {
    readonly id: string;
    readonly name: string;
    readonly position: string;
    readonly skillLevel: number;
}
/**
 * Match data structure from TeamGenerator API
 */
export interface MatchData {
    readonly id: string;
    readonly homeTeamId: string;
    readonly awayTeamId: string;
    readonly scheduledDate: string;
    readonly venue: string;
    readonly status: string;
    readonly createdAt: string;
    readonly notes?: string;
}
/**
 * Client for communicating with the TeamGenerator service
 */
export declare class TeamGeneratorClient {
    private readonly httpClient;
    constructor(baseUrl?: string);
    /**
     * Get all teams from TeamGenerator
     */
    getAllTeams(): Promise<TeamData[]>;
    /**
     * Get a specific team by ID
     */
    getTeamById(id: string): Promise<TeamData | null>;
    /**
     * Get all players from TeamGenerator
     */
    getAllPlayers(): Promise<PlayerData[]>;
    /**
     * Get a specific player by ID
     */
    getPlayerById(id: string): Promise<PlayerData | null>;
    /**
     * Get all matches from TeamGenerator
     */
    getAllMatches(): Promise<MatchData[]>;
    /**
     * Get a specific match by ID
     */
    getMatchById(id: string): Promise<MatchData | null>;
    /**
     * Get matches for a specific team
     */
    getMatchesForTeam(teamId: string): Promise<MatchData[]>;
}
export declare const teamGeneratorClient: TeamGeneratorClient;
//# sourceMappingURL=TeamGeneratorClient.d.ts.map