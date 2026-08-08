import { Request, Response, NextFunction } from 'express';
import { APIError } from '../errors/apiError.js';
import { logger } from '../app.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // Express error handler needs 4 arguments to be mapped, even if unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] || 'system';

  if (err instanceof APIError) {
    logger.warn({ err, requestId }, `API Error: ${err.message}`);
    res.status(err.status).json({
      success: false,
      message: err.message,
      errors: []
    });
    return;
  }

  // Handle generic Node errors
  logger.error({ err, requestId }, `Unhandled Error: ${err.message}`);
  
  res.status(500).json({
    success: false,
    message: 'An unexpected database or application error occurred.',
    errors: [err.message]
  });
}
