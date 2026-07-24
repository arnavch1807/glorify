import app, { logger } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';

let server: any = null;

async function bootstrap() {
  try {
    logger.info('Starting Chotify backend foundation services...');
    
    // Connect to external storage databases
    await connectDB();
    connectRedis();

    // Start listening on port
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Chotify backend listener starting on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error(`Fatal exception during server boot: ${(err as Error).message}`);
    process.exit(1);
  }
}

// Graceful shutdown strategy
async function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server listener closed.');
    });
  }

  try {
    await disconnectDB();
    await disconnectRedis();
    logger.info('Graceful shutdown completed successfully.');
    process.exit(0);
  } catch (err) {
    logger.error(`Error during graceful shutdown: ${(err as Error).message}`);
    process.exit(1);
  }
}

// Hook process signals
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

bootstrap();
export default server;
