import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import { requestLogger } from './middleware/logging.js';
import { errorHandler } from './middleware/errorHandler.js';
import v1Router from './routes/v1.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { NotFoundError } from './errors/apiError.js';
import { env } from './config/env.js';
import { isMongoHealthy } from './config/database.js';
import { isRedisHealthy } from './config/redis.js';

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
  origin: env.CORS_ORIGIN.includes(',') ? env.CORS_ORIGIN.split(',').map(o => o.trim()) : env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
}));

// Compression middleware
app.use(compression());

// Parse requests body middleware
app.use(express.json());
app.use(cookieParser());

// Request Timing and log correlation middleware
app.use(requestLogger);

// Global API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://glorify.com/errors/rate-limit',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Request threshold exceeded. Please try again later.',
  },
});
app.use(limiter);

// Versioned APIs Router mapping
app.use('/api/v1', v1Router);
app.use('/api/auth', authRouter);

// Telemetry compat root health check
app.use('/healthz', (_req, res) => {
  const mongoOk = isMongoHealthy();
  const redisOk = isRedisHealthy();
  const allOk = mongoOk && redisOk;

  const checks = {
    database: mongoOk ? 'healthy' : 'unhealthy',
    cache: redisOk ? 'healthy' : 'unhealthy',
  };

  if (!allOk) {
    res.status(503).json({
      status: 'unhealthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      checks,
    });
    return;
  }

  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    checks,
  });
});

// Fallback 404 Route handler
app.use((_req, _res, next) => {
  next(new NotFoundError('The requested endpoint resource does not exist.'));
});

// Global Error Parser catches exceptions
app.use(errorHandler);
export default app;
