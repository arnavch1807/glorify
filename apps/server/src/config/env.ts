import dotenv from 'dotenv';
import { z } from 'zod';

// Load variables from .env
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().default('mongodb://127.0.0.1/glorify'),
  REDIS_URI: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().default('glorify-access-key-default-secret-development-only'),
  JWT_REFRESH_SECRET: z.string().default('glorify-refresh-key-default-secret-development-only'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  API_ENCRYPTION_KEY: z.string().default('glorify-api-key-enc-key-32-bytes'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment configuration validation failed:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
