"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamGeneratorClient = exports.TeamGeneratorClient = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Client for communicating with the TeamGenerator service
 */
class TeamGeneratorClient {
    httpClient;
    constructor(baseUrl = process.env.TEAM_GENERATOR_URL || 'http://localhost:5252') {
        this.httpClient = axios_1.default.create({
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
    async getAllTeams() {
        try {
            const response = await this.httpClient.get('/api/TeamsData');
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch teams from TeamGenerator:', error);
            throw new Error('Unable to fetch teams from TeamGenerator service');
        }
    }
    /**
     * Get a specific team by ID
     */
    async getTeamById(id) {
        try {
            const response = await this.httpClient.get(`/api/TeamsData/${id}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error(`Failed to fetch team ${id} from TeamGenerator:`, error);
            throw new Error(`Unable to fetch team ${id} from TeamGenerator service`);
        }
    }
    /**
     * Get all players from TeamGenerator
     */
    async getAllPlayers() {
        try {
            const response = await this.httpClient.get('/api/Players');
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch players from TeamGenerator:', error);
            throw new Error('Unable to fetch players from TeamGenerator service');
        }
    }
    /**
     * Get a specific player by ID
     */
    async getPlayerById(id) {
        try {
            const response = await this.httpClient.get(`/api/Players/${id}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error(`Failed to fetch player ${id} from TeamGenerator:`, error);
            throw new Error(`Unable to fetch player ${id} from TeamGenerator service`);
        }
    }
    /**
     * Get all matches from TeamGenerator
     */
    async getAllMatches() {
        try {
            const response = await this.httpClient.get('/api/Matches');
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch matches from TeamGenerator:', error);
            throw new Error('Unable to fetch matches from TeamGenerator service');
        }
    }
    /**
     * Get a specific match by ID
     */
    async getMatchById(id) {
        try {
            const response = await this.httpClient.get(`/api/Matches/${id}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error(`Failed to fetch match ${id} from TeamGenerator:`, error);
            throw new Error(`Unable to fetch match ${id} from TeamGenerator service`);
        }
    }
    /**
     * Get matches for a specific team
     */
    async getMatchesForTeam(teamId) {
        try {
            const response = await this.httpClient.get(`/api/Matches/team/${teamId}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return [];
            }
            console.error(`Failed to fetch matches for team ${teamId} from TeamGenerator:`, error);
            throw new Error(`Unable to fetch matches for team ${teamId} from TeamGenerator service`);
        }
    }
}
exports.TeamGeneratorClient = TeamGeneratorClient;
// Singleton instance
exports.teamGeneratorClient = new TeamGeneratorClient();
//# sourceMappingURL=TeamGeneratorClient.js.map