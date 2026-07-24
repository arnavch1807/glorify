import { Router, Request, Response } from 'express';
import { isMongoHealthy } from '../config/database.js';
import { isRedisHealthy } from '../config/redis.js';

const router = Router();

// GET /api/v1/health/liveness
router.get('/health/liveness', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/v1/health/readiness
router.get('/health/readiness', (_req: Request, res: Response) => {
  const mongoOk = isMongoHealthy();
  const redisOk = isRedisHealthy();

  const isHealthy = mongoOk && redisOk;

  const details = {
    database: mongoOk ? 'UP' : 'DOWN',
    cache: redisOk ? 'UP' : 'DOWN',
  };

  if (!isHealthy) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      details,
    });
    return;
  }

  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    details,
  });
});

export default router;
