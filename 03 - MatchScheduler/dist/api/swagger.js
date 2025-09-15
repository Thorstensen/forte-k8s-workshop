"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Match Scheduler API',
            version: '1.0.0',
            description: 'A TypeScript/Express API service for scheduling football matches between teams',
            contact: {
                name: 'MatchScheduler Team',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? '/api'
                    : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Development server',
            },
        ],
        components: {
            schemas: {
                Match: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the match',
                            example: '550e8400-e29b-41d4-a716-446655440000',
                        },
                        homeTeamName: {
                            type: 'string',
                            description: 'Home team name',
                            example: 'Barcelona FC',
                        },
                        awayTeamName: {
                            type: 'string',
                            description: 'Away team name',
                            example: 'Real Madrid',
                        },
                        scheduledDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Scheduled date and time for the match',
                            example: '2024-12-25T15:00:00.000Z',
                        },
                        venue: {
                            type: 'string',
                            description: 'Venue where the match will be played',
                            example: 'Camp Nou',
                        },
                        status: {
                            type: 'string',
                            enum: [
                                'scheduled',
                                'in_progress',
                                'completed',
                                'cancelled',
                                'postponed',
                            ],
                            description: 'Current status of the match',
                            example: 'scheduled',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the match was created/scheduled',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        notes: {
                            type: 'string',
                            description: 'Optional notes about the match',
                            example: 'El Clasico - Special security measures required',
                        },
                    },
                    required: [
                        'id',
                        'homeTeamName',
                        'awayTeamName',
                        'scheduledDate',
                        'venue',
                        'status',
                        'createdAt',
                    ],
                },
                ScheduleMatchRequest: {
                    type: 'object',
                    properties: {
                        homeTeamName: {
                            type: 'string',
                            description: 'Name of the home team',
                            example: 'Barcelona FC',
                        },
                        awayTeamName: {
                            type: 'string',
                            description: 'Name of the away team',
                            example: 'Real Madrid',
                        },
                        scheduledDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Scheduled date and time for the match (must be in the future)',
                            example: '2024-12-25T15:00:00.000Z',
                        },
                        venue: {
                            type: 'string',
                            description: 'Venue where the match will be played',
                            example: 'Camp Nou',
                        },
                        notes: {
                            type: 'string',
                            description: 'Optional notes about the match',
                            example: 'El Clasico - Special security measures required',
                        },
                    },
                    required: ['homeTeamName', 'awayTeamName', 'scheduledDate', 'venue'],
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully',
                        },
                    },
                    required: ['success', 'message'],
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'An error occurred',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                    },
                                    param: {
                                        type: 'string',
                                    },
                                    value: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                    required: ['success', 'message'],
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Match Scheduler Service is healthy',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0',
                        },
                    },
                    required: ['success', 'message', 'timestamp', 'version'],
                },
            },
        },
        paths: {
            '/health': {
                get: {
                    tags: ['Health'],
                    summary: 'Health check endpoint',
                    description: 'Check the health status of the Match Scheduler Service',
                    responses: {
                        '200': {
                            description: 'Service is healthy',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/HealthResponse',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/matches': {
                get: {
                    tags: ['Matches'],
                    summary: 'Get all matches',
                    description: 'Retrieve all matches with optional filtering via query parameters',
                    parameters: [
                        {
                            name: 'upcoming',
                            in: 'query',
                            description: 'Filter to show only upcoming matches',
                            required: false,
                            schema: {
                                type: 'boolean',
                                example: true,
                            },
                        },
                        {
                            name: 'teamName',
                            in: 'query',
                            description: 'Filter matches by team name (home or away)',
                            required: false,
                            schema: {
                                type: 'string',
                                example: 'Barcelona FC',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Matches retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        allOf: [
                                            { $ref: '#/components/schemas/SuccessResponse' },
                                            {
                                                type: 'object',
                                                properties: {
                                                    data: {
                                                        type: 'array',
                                                        items: {
                                                            $ref: '#/components/schemas/Match',
                                                        },
                                                    },
                                                    count: {
                                                        type: 'integer',
                                                        description: 'Number of matches returned',
                                                        example: 5,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Invalid query parameters',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Matches'],
                    summary: 'Schedule a new match',
                    description: 'Create and schedule a new match between two teams',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ScheduleMatchRequest',
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Match scheduled successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        allOf: [
                                            { $ref: '#/components/schemas/SuccessResponse' },
                                            {
                                                type: 'object',
                                                properties: {
                                                    data: {
                                                        $ref: '#/components/schemas/Match',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Invalid request data or validation error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/matches/{id}': {
                get: {
                    tags: ['Matches'],
                    summary: 'Get a specific match by ID',
                    description: 'Retrieve a single match using its unique identifier',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the match',
                            schema: {
                                type: 'string',
                                example: '550e8400-e29b-41d4-a716-446655440000',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Match retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        allOf: [
                                            { $ref: '#/components/schemas/SuccessResponse' },
                                            {
                                                type: 'object',
                                                properties: {
                                                    data: {
                                                        $ref: '#/components/schemas/Match',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Invalid match ID',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                        '404': {
                            description: 'Match not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
                delete: {
                    tags: ['Matches'],
                    summary: 'Cancel a scheduled match',
                    description: 'Cancel a previously scheduled match using its unique identifier',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the match to cancel',
                            schema: {
                                type: 'string',
                                example: '550e8400-e29b-41d4-a716-446655440000',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Match cancelled successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        allOf: [
                                            { $ref: '#/components/schemas/SuccessResponse' },
                                            {
                                                type: 'object',
                                                properties: {
                                                    data: {
                                                        $ref: '#/components/schemas/Match',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Invalid match ID or match cannot be cancelled',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
            {
                name: 'Matches',
                description: 'Match scheduling and management endpoints',
            },
        ],
    },
    apis: [], // We're defining everything in the definition above
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map