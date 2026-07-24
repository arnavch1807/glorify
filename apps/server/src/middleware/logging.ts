import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../app.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Inject Request ID
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1e9 + diff[1]) / 1e6; // Milliseconds duration
    
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: parseFloat(timeMs.toFixed(2)),
      requestId,
    }, 'Incoming request');
  });

  next();
}
