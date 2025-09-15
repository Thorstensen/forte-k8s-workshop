"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const matches_1 = __importDefault(require("./routes/matches"));
const MatchSchedulerService_1 = require("../services/MatchSchedulerService");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging middleware
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    next();
});
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Match Scheduler Service is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// API documentation endpoint
app.get('/', (_req, res) => {
    res.json({
        service: 'Match Scheduler API',
        version: '1.0.0',
        description: 'A TypeScript/Express API service for scheduling football matches between teams',
        endpoints: {
            health: 'GET /health - Health check',
            matches: {
                'GET /api/matches': 'Get all matches (supports ?upcoming=true and ?teamId=<id> filters)',
                'GET /api/matches/:id': 'Get a specific match by ID',
                'POST /api/matches': 'Schedule a new match',
                'DELETE /api/matches/:id': 'Cancel a scheduled match',
            },
            teams: {
                'GET /api/teams': 'Get all teams',
                'GET /api/teams/:id': 'Get a specific team by ID',
            },
        },
        sampleData: {
            teams: MatchSchedulerService_1.matchSchedulerService.getAllTeams().map(team => ({
                id: team.id,
                name: team.name,
                playerCount: team.players.length,
            })),
        },
    });
});
// Teams endpoint (for reference data)
app.get('/api/teams', (_req, res) => {
    try {
        const teams = MatchSchedulerService_1.matchSchedulerService.getAllTeams();
        res.json({
            success: true,
            message: 'Teams retrieved successfully',
            data: teams,
            count: teams.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve teams',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
app.get('/api/teams/:id', (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Team ID is required',
            });
            return;
        }
        const team = MatchSchedulerService_1.matchSchedulerService.getTeamById(id);
        if (!team) {
            res.status(404).json({
                success: false,
                message: `Team with ID "${id}" not found`,
            });
            return;
        }
        res.json({
            success: true,
            message: 'Team retrieved successfully',
            data: team,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve team',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// API routes
app.use('/api/matches', matches_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});
// Global error handler
app.use(
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
(error, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            error: error.message,
            stack: error.stack,
        }),
    });
});
// Start server
const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Match Scheduler Service running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📚 API Documentation available at http://localhost:${PORT}/`);
    // eslint-disable-next-line no-console
    console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    // eslint-disable-next-line no-console
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        // eslint-disable-next-line no-console
        console.log('Process terminated');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        // eslint-disable-next-line no-console
        console.log('Process terminated');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map