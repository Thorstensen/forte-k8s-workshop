import axios, { AxiosInstance } from 'axios';

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
export class TeamGeneratorClient {
  private readonly httpClient: AxiosInstance;

  constructor(baseUrl: string = process.env.TEAM_GENERATOR_URL || 'http://localhost:5252') {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get all teams from TeamGenerator
   */
  async getAllTeams(): Promise<TeamData[]> {
    try {
      const response = await this.httpClient.get<TeamData[]>('/api/TeamsData');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teams from TeamGenerator:', error);
      throw new Error('Unable to fetch teams from TeamGenerator service');
    }
  }

  /**
   * Get a specific team by ID
   */
  async getTeamById(id: string): Promise<TeamData | null> {
    try {
      const response = await this.httpClient.get<TeamData>(`/api/TeamsData/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Failed to fetch team ${id} from TeamGenerator:`, error);
      throw new Error(`Unable to fetch team ${id} from TeamGenerator service`);
    }
  }

  /**
   * Get all players from TeamGenerator
   */
  async getAllPlayers(): Promise<PlayerData[]> {
    try {
      const response = await this.httpClient.get<PlayerData[]>('/api/Players');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch players from TeamGenerator:', error);
      throw new Error('Unable to fetch players from TeamGenerator service');
    }
  }

  /**
   * Get a specific player by ID
   */
  async getPlayerById(id: string): Promise<PlayerData | null> {
    try {
      const response = await this.httpClient.get<PlayerData>(`/api/Players/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Failed to fetch player ${id} from TeamGenerator:`, error);
      throw new Error(`Unable to fetch player ${id} from TeamGenerator service`);
    }
  }

  /**
   * Get all matches from TeamGenerator
   */
  async getAllMatches(): Promise<MatchData[]> {
    try {
      const response = await this.httpClient.get<MatchData[]>('/api/Matches');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch matches from TeamGenerator:', error);
      throw new Error('Unable to fetch matches from TeamGenerator service');
    }
  }

  /**
   * Get a specific match by ID
   */
  async getMatchById(id: string): Promise<MatchData | null> {
    try {
      const response = await this.httpClient.get<MatchData>(`/api/Matches/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Failed to fetch match ${id} from TeamGenerator:`, error);
      throw new Error(`Unable to fetch match ${id} from TeamGenerator service`);
    }
  }

  /**
   * Get matches for a specific team
   */
  async getMatchesForTeam(teamId: string): Promise<MatchData[]> {
    try {
      const response = await this.httpClient.get<MatchData[]>(`/api/Matches/team/${teamId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error(`Failed to fetch matches for team ${teamId} from TeamGenerator:`, error);
      throw new Error(`Unable to fetch matches for team ${teamId} from TeamGenerator service`);
    }
  }
}

// Singleton instance
export const teamGeneratorClient = new TeamGeneratorClient();