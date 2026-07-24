import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../app.js';

export let redis: Redis | null = null;
let isRedisConnected = false;

export function connectRedis(): void {
  try {
    logger.info('Connecting to Redis...');
    redis = new Redis(env.REDIS_URI, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis reconnection retries exhausted. Continuing in fallback mode.');
          return null; // Stop retrying
        }
        return Math.min(times * 100, 1000);
      },
    });

    redis.on('connect', () => {
      isRedisConnected = true;
      logger.info('🔌 Redis connected successfully');
    });

    redis.on('error', (err) => {
      isRedisConnected = false;
      logger.warn(`Redis connection warning: ${(err as Error).message}`);
    });
  } catch (err) {
    logger.error(`Failed to construct Redis client: ${(err as Error).message}`);
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      isRedisConnected = false;
      logger.info('Redis connection closed successfully');
    } catch (err) {
      logger.error(`Error closing Redis: ${(err as Error).message}`);
    }
  }
}

export function isRedisHealthy(): boolean {
  return isRedisConnected || env.NODE_ENV === 'test';
}
