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
 * POST /matches/list
 * Get all matches with optional filtering
 */
router.post('/list', [
    (0, express_validator_1.body)('upcoming').optional().isBoolean().withMessage('Upcoming filter must be a boolean'),
    (0, express_validator_1.body)('teamId').optional().isString().notEmpty().withMessage('Team ID must be a non-empty string'),
], handleValidationErrors, (req, res) => {
    try {
        const { upcoming, teamId } = req.body;
        let matches;
        if (upcoming === true) {
            matches = MatchSchedulerService_1.matchSchedulerService.getUpcomingMatches();
        }
        else if (teamId && typeof teamId === 'string') {
            matches = MatchSchedulerService_1.matchSchedulerService.getMatchesForTeam(teamId);
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
 * POST /matches/details
 * Get a specific match by ID
 */
router.post('/details', [
    (0, express_validator_1.body)('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req, res) => {
    try {
        const { id } = req.body;
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
    (0, express_validator_1.body)('homeTeamId')
        .isString()
        .notEmpty()
        .withMessage('Home team ID is required'),
    (0, express_validator_1.body)('awayTeamId')
        .isString()
        .notEmpty()
        .withMessage('Away team ID is required'),
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
        const { homeTeamId, awayTeamId, scheduledDate, venue, notes } = req.body;
        const request = {
            homeTeamId,
            awayTeamId,
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
 * POST /matches/cancel
 * Cancel a scheduled match
 */
router.post('/cancel', [
    (0, express_validator_1.body)('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req, res) => {
    try {
        const { id } = req.body;
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