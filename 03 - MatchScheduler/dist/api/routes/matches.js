"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const MatchSchedulerService_1 = require("../../services/MatchSchedulerService");
const router = (0, express_1.Router)();
/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
        return;
    }
    next();
};
/**
 * GET /matches
 * Get all matches with optional filtering via query parameters
 */
router.get('/', [
    (0, express_validator_1.query)('upcoming').optional().isBoolean().withMessage('Upcoming filter must be a boolean'),
    (0, express_validator_1.query)('teamName').optional().isString().notEmpty().withMessage('Team name must be a non-empty string'),
], handleValidationErrors, (req, res) => {
    try {
        const { upcoming, teamName } = req.query;
        let matches;
        if (upcoming === 'true') {
            matches = MatchSchedulerService_1.matchSchedulerService.getUpcomingMatches();
        }
        else if (teamName && typeof teamName === 'string') {
            matches = MatchSchedulerService_1.matchSchedulerService.getMatchesForTeam(teamName);
        }
        else {
            matches = MatchSchedulerService_1.matchSchedulerService.getAllMatches();
        }
        res.json({
            success: true,
            message: 'Matches retrieved successfully',
            data: matches,
            count: matches.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve matches',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * GET /matches/:id
 * Get a specific match by ID
 */
router.get('/:id', [
    (0, express_validator_1.param)('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Match ID is required',
            });
            return;
        }
        const match = MatchSchedulerService_1.matchSchedulerService.getMatchById(id);
        if (!match) {
            res.status(404).json({
                success: false,
                message: `Match with ID "${id}" not found`,
            });
            return;
        }
        res.json({
            success: true,
            message: 'Match retrieved successfully',
            data: match,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve match',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * POST /matches
 * Schedule a new match
 */
router.post('/', [
    (0, express_validator_1.body)('homeTeamName')
        .isString()
        .notEmpty()
        .withMessage('Home team name is required'),
    (0, express_validator_1.body)('awayTeamName')
        .isString()
        .notEmpty()
        .withMessage('Away team name is required'),
    (0, express_validator_1.body)('scheduledDate')
        .isISO8601()
        .withMessage('Scheduled date must be a valid ISO 8601 date')
        .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        if (date <= now) {
            throw new Error('Scheduled date must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('venue')
        .isString()
        .notEmpty()
        .trim()
        .withMessage('Venue is required and cannot be empty'),
    (0, express_validator_1.body)('notes')
        .optional()
        .isString()
        .trim()
        .withMessage('Notes must be a string if provided'),
], handleValidationErrors, (req, res) => {
    try {
        const { homeTeamName, awayTeamName, scheduledDate, venue, notes } = req.body;
        const request = {
            homeTeamName,
            awayTeamName,
            scheduledDate: new Date(scheduledDate),
            venue,
            notes: notes || undefined,
        };
        const result = MatchSchedulerService_1.matchSchedulerService.scheduleMatch(request);
        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.match,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to schedule match',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * DELETE /matches/:id
 * Cancel a scheduled match
 */
router.delete('/:id', [
    (0, express_validator_1.param)('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Match ID is required',
            });
            return;
        }
        const result = MatchSchedulerService_1.matchSchedulerService.cancelMatch(id);
        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                data: result.match,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel match',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=matches.js.map