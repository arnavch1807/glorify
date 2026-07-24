import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import { requestLogger } from './middleware/logging.js';
import { errorHandler } from './middleware/errorHandler.js';
import v1Router from './routes/v1.js';
import { NotFoundError } from './errors/apiError.js';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const app: Express = express();

// Secure Headers middleware
app.use(helmet());

// CORS configuration middleware
app.use(cors({
  origin: '*', // Customize for production domains later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
}));

// Compression middleware
app.use(compression());

// Parse requests body middleware
app.use(express.json());

// Request Timing and log correlation middleware
app.use(requestLogger);

// Global API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://chotify.com/errors/rate-limit',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Request threshold exceeded. Please try again later.',
  },
});
app.use(limiter);

// Versioned APIs Router mapping
app.use('/api/v1', v1Router);

// Telemetry compat root health check
app.use('/healthz', (_req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

// Fallback 404 Route handler
app.use((_req, _res, next) => {
  next(new NotFoundError('The requested endpoint resource does not exist.'));
});

// Global Error Parser catches exceptions
app.use(errorHandler);
export default app;
