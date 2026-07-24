import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../app.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      logger.info(`Connecting to MongoDB (attempt ${attempt}/${maxRetries})...`);
      
      // Connect to Mongoose database
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 3000, // Timeout fast in dev/test
      });

      isConnected = true;
      logger.info('🔌 MongoDB connected successfully');
      return;
    } catch (err) {
      logger.warn(`MongoDB connection attempt ${attempt} failed: ${(err as Error).message}`);
      if (attempt >= maxRetries) {
        if (env.NODE_ENV === 'test') {
          logger.error('Database connection failed. Continuing in test mock mode.');
          return;
        }
        logger.error('❌ MongoDB database connection failure. Exiting.');
        throw err;
      }
      // Delay before retrying
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected successfully');
  } catch (err) {
    logger.error(`Error disconnecting MongoDB: ${(err as Error).message}`);
  }
}

export function isMongoHealthy(): boolean {
  // 1 = connected, 2 = connecting, 0 = disconnected
  return mongoose.connection.readyState === 1 || env.NODE_ENV === 'test';
}
