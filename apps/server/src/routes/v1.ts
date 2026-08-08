import { Router, Request, Response } from 'express';
import { isMongoHealthy } from '../config/database.js';
import { isRedisHealthy } from '../config/redis.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  addTrackSchema,
  reorderTracksSchema,
  addHistorySchema,
  songsQuerySchema,
  saveAPIKeysSchema,
} from '../validators/cloudValidator.js';
import {
  getUserPlaylists,
  createPlaylist,
  getPlaylistDetails,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  reorderPlaylistTracks,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteStatus,
  getUserHistory,
  addHistoryEvent,
  clearUserHistory,
  getRecentlyPlayed,
  getSongs,
  getAPIKeys,
  saveAPIKeys,
  exportUserProfile,
  getNotifications,
  markNotificationRead,
} from '../controllers/cloudController.js';
import { composeSchema } from '../validators/aiValidator.js';
import { composeTrack, pollTaskStatus } from '../controllers/aiController.js';

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

// ==========================================
// PHASE 7 - ACCOUNTS & CLOUD ROUTES
// ==========================================

// Playlists
router.get('/playlists', authenticate as any, getUserPlaylists);
router.post('/playlists', authenticate as any, validate(createPlaylistSchema), createPlaylist);
router.get('/playlists/:id', authenticate as any, getPlaylistDetails);
router.put('/playlists/:id', authenticate as any, validate(updatePlaylistSchema), updatePlaylist);
router.delete('/playlists/:id', authenticate as any, deletePlaylist);

// Playlist Tracks
router.post('/playlists/:id/tracks', authenticate as any, validate(addTrackSchema), addTrackToPlaylist);
router.delete('/playlists/:id/tracks/:trackId', authenticate as any, removeTrackFromPlaylist);
router.put('/playlists/:id/tracks/reorder', authenticate as any, validate(reorderTracksSchema), reorderPlaylistTracks);

// Favorites
router.get('/favorites', authenticate as any, getUserFavorites);
router.post('/favorites/:trackId', authenticate as any, addFavorite);
router.delete('/favorites/:trackId', authenticate as any, removeFavorite);
router.get('/favorites/:trackId/status', authenticate as any, getFavoriteStatus);

// History
router.get('/history', authenticate as any, getUserHistory);
router.post('/history', authenticate as any, validate(addHistorySchema), addHistoryEvent);
router.delete('/history', authenticate as any, clearUserHistory);

// Recently Played
router.get('/recently-played', authenticate as any, getRecentlyPlayed);

// Songs Search & Filter
router.get('/songs', authenticate as any, validate(songsQuerySchema), getSongs);

// API Credentials Management
router.get('/apikey', authenticate as any, getAPIKeys);
router.post('/apikey', authenticate as any, validate(saveAPIKeysSchema), saveAPIKeys);

// AI Studio Composition
router.post('/ai/compose', authenticate as any, validate(composeSchema), composeTrack as any);
router.get('/ai/tasks/:taskId', authenticate as any, pollTaskStatus as any);

// GDPR Compliance Export
router.get('/user/export', authenticate as any, exportUserProfile);

// User Notifications
router.get('/notifications', authenticate as any, getNotifications);
router.put('/notifications/:id/read', authenticate as any, markNotificationRead);

export default router;
