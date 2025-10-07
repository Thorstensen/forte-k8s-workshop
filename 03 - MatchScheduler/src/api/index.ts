import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import matchesRouter from './routes/matches';
import { swaggerSpec } from './swagger';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - needed for rate limiting behind ingress/load balancer
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - configurable via environment variables
// Only applied to /api/matches routes (not health checks)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // Default: 100 requests
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint - NO rate limiting
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Match Scheduler Service is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

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

// Swagger UI setup
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Match Scheduler API Documentation',
  customfavIcon: '/assets/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
  },
};

// Serve Swagger UI at /api/docs
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(swaggerSpec, swaggerOptions));

// Root redirect to swagger documentation
app.get('/', (_req: Request, res: Response): void => {
  res.redirect('/api/docs');
});

// Alternative endpoint for the OpenAPI JSON spec
app.get('/api/openapi.json', (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes - apply rate limiting only to matches endpoints
app.use('/api/matches', limiter, matchesRouter);

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
  console.log(
    `📚 OpenAPI Documentation (Swagger UI) available at http://localhost:${PORT}/api/docs`
  );
  // eslint-disable-next-line no-console
  console.log(
    `📄 OpenAPI JSON specification available at http://localhost:${PORT}/api/openapi.json`
  );
  // eslint-disable-next-line no-console
  console.log(`❤️  Health check available at http://localhost:${PORT}/api/health`);
  // eslint-disable-next-line no-console
  console.log(`⏱️  Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || '100'} requests per ${parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) / 60000} minutes`);
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
