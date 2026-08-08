import { z } from 'zod';

export const composeSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(500),
    bpm: z.number().int().min(60).max(180),
    keySignature: z.string().min(1).max(50),
    genre: z.string().min(1).max(50),
    provider: z.enum(['suno', 'udio']),
    coverImage: z.string().optional(),
  }),
});
