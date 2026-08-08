import app, { logger } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { Song } from './models/Song.js';

let server: any = null;

async function bootstrap() {
  try {
    logger.info('Starting Glorify backend foundation services...');
    
    // Connect to external storage databases
    await connectDB();
    connectRedis();

    // Seed standard catalog tracks if the database is empty
    try {
      const songCount = await Song.countDocuments();
      if (songCount === 0) {
        logger.info('Database empty. Seeding catalog tracks...');
        await Song.create([
          {
            title: 'SoundHelix Song 1 (Lofi Remix)',
            artist: 'SoundHelix Composer',
            album: 'Helix Test Stems',
            genre: 'lofi',
            duration: 372,
            audioUrl: '/sample.mp3',
            coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
            isGenerated: true,
            prompt: 'Lofi piano keys with ambient record static clicks and warm sub-bass loops',
            bpm: 72,
            keySignature: 'A Min',
          },
          {
            title: 'SoundHelix Song 2 (Ambient Drift)',
            artist: 'SoundHelix Composer',
            album: 'Helix Test Stems',
            genre: 'ambient',
            duration: 423,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            coverImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80',
            isGenerated: true,
            prompt: 'Washed out ambient pads, slow granular cloud textures',
            bpm: 65,
            keySignature: 'D Maj',
          },
          {
            title: 'SoundHelix Song 3 (Monochrome Loop)',
            artist: 'Aura Synthesizer',
            album: 'Aura Curations',
            genre: 'synthwave',
            duration: 302,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
            isGenerated: true,
            prompt: 'Retrowave driving bassline, retro drum machine snaps',
            bpm: 115,
            keySignature: 'F# Min',
          },
          {
            title: 'SoundHelix Song 4 (Glitch Stems)',
            artist: 'Aura Synthesizer',
            album: 'Aura Curations',
            genre: 'glitch',
            duration: 302,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
            isGenerated: true,
            prompt: 'Glitch hop synth stabs, fragmented percussions and bass skips',
            bpm: 140,
            keySignature: 'G Maj',
          },
        ]);
        logger.info('✓ Catalog tracks seeded successfully');
      }
    } catch (seedErr: any) {
      logger.warn(`Failed to seed catalog tracks: ${seedErr.message}`);
    }

    // Start listening on port
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Glorify backend listener starting on http://localhost:${env.PORT}`);
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
