import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import matchesRouter from './routes/matches';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Match Scheduler Service is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation endpoint
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    service: 'Match Scheduler API',
    version: '1.0.0',
    description:
      'A TypeScript/Express API service for scheduling football matches between teams',
    endpoints: {
      health: 'GET /health - Health check',
      matches: {
        'GET /api/matches':
          'Get all matches (supports query params: ?upcoming=true&teamName=TeamName)',
        'GET /api/matches/:id': 'Get a specific match by ID',
        'POST /api/matches': 'Schedule a new match',
        'DELETE /api/matches/:id': 'Cancel a scheduled match',
      },
    },
  });
});

// API routes
app.use('/api/matches', matchesRouter);

// 404 handler
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
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
  }
);

// Start server
const server = app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Match Scheduler Service running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📚 API Documentation available at http://localhost:${PORT}/`);
  // eslint-disable-next-line no-console
  console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', (): void => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received, shutting down gracefully');
  server.close((): void => {
    // eslint-disable-next-line no-console
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', (): void => {
  // eslint-disable-next-line no-console
  console.log('SIGINT received, shutting down gracefully');
  server.close((): void => {
    // eslint-disable-next-line no-console
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
