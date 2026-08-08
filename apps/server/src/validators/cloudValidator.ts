import { z } from 'zod';

export const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    isPublic: z.boolean().optional(),
  }),
});

export const updatePlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    isPublic: z.boolean().optional(),
  }),
});

export const addTrackSchema = z.object({
  body: z.object({
    trackId: z.string().min(1),
  }),
});

export const reorderTracksSchema = z.object({
  body: z.object({
    startIndex: z.number().int().min(0),
    endIndex: z.number().int().min(0),
  }),
});

export const addHistorySchema = z.object({
  body: z.object({
    trackId: z.string().min(1),
    duration: z.number().optional(),
    progress: z.number().optional(),
  }),
});

export const songsQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    source: z.enum(['all', 'standard', 'ai']).optional(),
    bpm: z.enum(['all', 'slow', 'medium', 'fast']).optional(),
    keySignature: z.string().optional(),
    genre: z.string().optional(),
  }),
});

export const saveAPIKeysSchema = z.object({
  body: z.object({
    sunoKey: z.string().max(200).optional().or(z.literal('')),
    udioSecret: z.string().max(200).optional().or(z.literal('')),
  }),
});
