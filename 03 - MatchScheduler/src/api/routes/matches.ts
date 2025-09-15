import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { matchSchedulerService } from '../../services/MatchSchedulerService';
import { ScheduleMatchRequest } from '../../domain/Match';

const router = Router();

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req: Request, res: Response, next: Function): void => {
  const errors = validationResult(req);
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
  body('upcoming').optional().isBoolean().withMessage('Upcoming filter must be a boolean'),
  body('teamId').optional().isString().notEmpty().withMessage('Team ID must be a non-empty string'),
], handleValidationErrors, (req: Request, res: Response): void => {
  try {
    const { upcoming, teamId } = req.body as {
      upcoming?: boolean;
      teamId?: string;
    };

    let matches;
    
    if (upcoming === true) {
      matches = matchSchedulerService.getUpcomingMatches();
    } else if (teamId && typeof teamId === 'string') {
      matches = matchSchedulerService.getMatchesForTeam(teamId);
    } else {
      matches = matchSchedulerService.getAllMatches();
    }

    res.json({
      success: true,
      message: 'Matches retrieved successfully',
      data: matches,
      count: matches.length,
    });
  } catch (error) {
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
  body('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req: Request, res: Response): void => {
  try {
    const { id } = req.body as { id: string };
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Match ID is required',
      });
      return;
    }

    const match = matchSchedulerService.getMatchById(id);

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
  } catch (error) {
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
  body('homeTeamId')
    .isString()
    .notEmpty()
    .withMessage('Home team ID is required'),
  body('awayTeamId')
    .isString()
    .notEmpty()
    .withMessage('Away team ID is required'),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date')
    .custom((value: string) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  body('venue')
    .isString()
    .notEmpty()
    .trim()
    .withMessage('Venue is required and cannot be empty'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .withMessage('Notes must be a string if provided'),
], handleValidationErrors, (req: Request, res: Response): void => {
  try {
    const { homeTeamId, awayTeamId, scheduledDate, venue, notes } = req.body as {
      homeTeamId: string;
      awayTeamId: string;
      scheduledDate: string;
      venue: string;
      notes?: string;
    };

    const request: ScheduleMatchRequest = {
      homeTeamId,
      awayTeamId,
      scheduledDate: new Date(scheduledDate),
      venue,
      notes: notes || undefined,
    };

    const result = matchSchedulerService.scheduleMatch(request);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.match,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
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
  body('id').isString().notEmpty().withMessage('Match ID is required'),
], handleValidationErrors, (req: Request, res: Response): void => {
  try {
    const { id } = req.body as { id: string };
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Match ID is required',
      });
      return;
    }

    const result = matchSchedulerService.cancelMatch(id);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.match,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel match',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;