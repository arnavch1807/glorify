import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { Playlist } from '../models/Playlist.js';
import { Favorite } from '../models/Favorite.js';
import { History } from '../models/History.js';
import { Song } from '../models/Song.js';
import { APIKey } from '../models/APIKey.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { encrypt } from '../utils/crypto.js';
import { APIError, NotFoundError, ValidationError } from '../errors/apiError.js';

// ==========================================
// PLAYLIST CONTROLLERS
// ==========================================

export const getUserPlaylists = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const playlists = await Playlist.find({ userId: req.user._id });
    res.json({
      success: true,
      data: playlists.map(p => ({
        id: p._id,
        userId: p.userId,
        name: p.name,
        description: p.description,
        coverImage: p.coverImage,
        songs: p.songs,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const createPlaylist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, coverImage } = req.body;
    const playlist = await Playlist.create({
      userId: req.user._id,
      name,
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      songs: [],
    });
    res.status(201).json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }
    res.json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updatePlaylist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }

    const { name, description, coverImage } = req.body;
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (coverImage !== undefined) playlist.coverImage = coverImage;

    await playlist.save();

    res.json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlaylist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }

    await Playlist.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      data: { message: 'Playlist deleted successfully' },
    });
  } catch (err) {
    next(err);
  }
};

export const addTrackToPlaylist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }

    const { trackId } = req.body;
    if (!playlist.songs.includes(trackId)) {
      playlist.songs.push(trackId);
      await playlist.save();
    }

    res.json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const removeTrackFromPlaylist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }

    const { trackId } = req.params;
    playlist.songs = playlist.songs.filter(sid => sid !== trackId);
    await playlist.save();

    res.json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const reorderPlaylistTracks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid playlist ID format');
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }
    if (playlist.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Forbidden', 'You do not own this playlist', 'https://glorify.com/errors/forbidden');
    }

    const { startIndex, endIndex } = req.body;
    const result = Array.from(playlist.songs);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    playlist.songs = result;

    await playlist.save();

    res.json({
      success: true,
      data: {
        id: playlist._id,
        userId: playlist.userId,
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// FAVORITES CONTROLLERS
// ==========================================

export const getUserFavorites = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id });
    
    // Group itemIds by type for clean hydration response
    const songs = favorites.filter(f => f.itemType === 'song').map(f => f.itemId);
    const albums = favorites.filter(f => f.itemType === 'album').map(f => f.itemId);
    const artists = favorites.filter(f => f.itemType === 'artist').map(f => f.itemId);

    res.json({
      success: true,
      data: {
        songs,
        albums,
        artists,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackId } = req.params;
    const itemType = ((req.query.type as string) || 'song') as 'song' | 'album' | 'artist';

    await Favorite.updateOne(
      { userId: req.user._id, itemId: trackId, itemType },
      { userId: req.user._id, itemId: trackId, itemType },
      { upsert: true }
    );

    res.json({
      success: true,
      data: { message: 'Item added to favorites' },
    });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackId } = req.params;
    const itemType = ((req.query.type as string) || 'song') as 'song' | 'album' | 'artist';

    await Favorite.deleteOne({ userId: req.user._id, itemId: trackId, itemType });

    res.json({
      success: true,
      data: { message: 'Item removed from favorites' },
    });
  } catch (err) {
    next(err);
  }
};

export const getFavoriteStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackId } = req.params;
    const itemType = ((req.query.type as string) || 'song') as 'song' | 'album' | 'artist';

    const fav = await Favorite.findOne({ userId: req.user._id, itemId: trackId, itemType });

    res.json({
      success: true,
      data: { isFavorited: !!fav },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// LISTENING HISTORY CONTROLLERS
// ==========================================

export const getUserHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ playedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: history.map(h => ({
        trackId: h.songId,
        playedAt: h.playedAt,
        duration: h.duration,
        progress: h.progress,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const addHistoryEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackId, duration, progress } = req.body;

    const event = await History.create({
      userId: req.user._id,
      songId: trackId,
      playedAt: new Date(),
      duration,
      progress,
    });

    res.status(201).json({
      success: true,
      data: {
        trackId: event.songId,
        playedAt: event.playedAt,
        duration: event.duration,
        progress: event.progress,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const clearUserHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await History.deleteMany({ userId: req.user._id });
    res.json({
      success: true,
      data: { message: 'History cleared successfully' },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// RECENTLY PLAYED CONTROLLERS (DERIVED)
// ==========================================

export const getRecentlyPlayed = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Group listening history by songId and sort by the latest playedAt date
    const results = await History.aggregate([
      { $match: { userId: req.user._id } },
      { $sort: { playedAt: -1 } },
      {
        $group: {
          _id: '$songId',
          playedAt: { $first: '$playedAt' },
        },
      },
      { $sort: { playedAt: -1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      data: results.map(r => ({
        trackId: r._id,
        playedAt: r.playedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// SONG SEARCH CONTROLLER
// ==========================================

export const getSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, source, bpm, keySignature, genre } = req.query as {
      q?: string;
      source?: 'all' | 'standard' | 'ai';
      bpm?: 'all' | 'slow' | 'medium' | 'fast';
      keySignature?: string;
      genre?: string;
    };

    const filter: any = {};

    // 1. Full-text search / text matching
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: regex },
        { artist: regex },
        { prompt: regex },
        { lyrics: regex },
      ];
    }

    // 2. Source Filter (standard vs AI generated)
    if (source === 'standard') {
      filter.isGenerated = false;
    } else if (source === 'ai') {
      filter.isGenerated = true;
    }

    // 3. BPM (Tempo) Filter
    if (bpm && bpm !== 'all') {
      if (bpm === 'slow') {
        filter.bpm = { $lt: 90 };
      } else if (bpm === 'medium') {
        filter.bpm = { $gte: 90, $lte: 120 };
      } else if (bpm === 'fast') {
        filter.bpm = { $gt: 120 };
      }
    }

    // 4. Key Signature Filter
    if (keySignature && keySignature !== 'all') {
      filter.keySignature = keySignature;
    }

    // 5. Genre Filter
    if (genre && genre.trim()) {
      filter.genre = new RegExp(genre.trim(), 'i');
    }

    const songs = await Song.find(filter);

    res.json({
      success: true,
      data: songs.map(s => ({
        id: s._id,
        title: s.title,
        artist: s.artist,
        album: s.album,
        genre: s.genre,
        duration: s.duration,
        coverImage: s.coverImage,
        audioUrl: s.audioUrl,
        lyrics: s.lyrics,
        isGenerated: s.isGenerated,
        prompt: s.prompt,
        bpm: s.bpm,
        keySignature: s.keySignature,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// API KEY PERSISTENCE CONTROLLERS
// ==========================================

export const getAPIKeys = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const keyRecord = await APIKey.findOne({ userId: req.user._id });
    if (!keyRecord) {
      res.json({
        success: true,
        data: {
          hasSuno: false,
          hasUdio: false,
          isValidSuno: false,
          isValidUdio: false,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        hasSuno: !!keyRecord.sunoKey?.encryptedText,
        hasUdio: !!keyRecord.udioSecret?.encryptedText,
        isValidSuno: keyRecord.isValidSuno,
        isValidUdio: keyRecord.isValidUdio,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const saveAPIKeys = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sunoKey, udioSecret } = req.body;
    let keyRecord = await APIKey.findOne({ userId: req.user._id });
    if (!keyRecord) {
      keyRecord = new APIKey({ userId: req.user._id });
    }

    // 1. Process Suno Key
    if (sunoKey !== undefined) {
      const trimmedSuno = sunoKey.trim();
      if (trimmedSuno === '') {
        keyRecord.sunoKey = undefined;
        keyRecord.isValidSuno = false;
      } else {
        // Validate starts with 'sk-suno-' and is at least 15 characters
        const isValid = trimmedSuno.startsWith('sk-suno-') && trimmedSuno.length >= 15;
        keyRecord.isValidSuno = isValid;
        
        // Encrypt the key
        const encrypted = encrypt(trimmedSuno);
        keyRecord.sunoKey = {
          encryptedText: encrypted.encryptedText,
          iv: encrypted.iv,
          tag: encrypted.tag,
        };
      }
    }

    // 2. Process Udio Secret
    if (udioSecret !== undefined) {
      const trimmedUdio = udioSecret.trim();
      if (trimmedUdio === '') {
        keyRecord.udioSecret = undefined;
        keyRecord.isValidUdio = false;
      } else {
        // Validate starts with 'sk-udio-' and is at least 15 characters
        const isValid = trimmedUdio.startsWith('sk-udio-') && trimmedUdio.length >= 15;
        keyRecord.isValidUdio = isValid;
        
        // Encrypt the secret
        const encrypted = encrypt(trimmedUdio);
        keyRecord.udioSecret = {
          encryptedText: encrypted.encryptedText,
          iv: encrypted.iv,
          tag: encrypted.tag,
        };
      }
    }

    await keyRecord.save();

    // Create system notification
    try {
      let message = 'API credentials updated successfully.';
      if (sunoKey !== undefined && udioSecret !== undefined) {
        message = 'Suno AI and Udio AI credentials updated successfully.';
      } else if (sunoKey !== undefined) {
        message = 'Suno AI credentials updated successfully.';
      } else if (udioSecret !== undefined) {
        message = 'Udio AI credentials updated successfully.';
      }
      await Notification.create({
        userId: req.user._id,
        title: 'API Credentials Configured',
        message,
        type: 'success',
      });
    } catch (notiErr) {
      console.error('Failed to create api keys notification:', notiErr);
    }

    res.json({
      success: true,
      message: 'Credentials updated successfully',
      data: {
        hasSuno: !!keyRecord.sunoKey?.encryptedText,
        hasUdio: !!keyRecord.udioSecret?.encryptedText,
        isValidSuno: keyRecord.isValidSuno,
        isValidUdio: keyRecord.isValidUdio,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// GDPR USER PROFILE EXPORT CONTROLLER
// ==========================================

export const exportUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user._id;

    // Fetch user profile and list items in parallel
    const [userRecord, playlists, favorites, history, apiKeys] = await Promise.all([
      User.findById(userId).select('-passwordHash'),
      Playlist.find({ userId }),
      Favorite.find({ userId }),
      History.find({ userId }),
      APIKey.findOne({ userId }),
    ]);

    if (!userRecord) {
      res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: userRecord._id,
        username: userRecord.username,
        email: userRecord.email,
        displayName: userRecord.displayName,
        avatar: userRecord.avatar,
        bio: userRecord.bio,
        theme: userRecord.theme,
        subscription: userRecord.subscription,
        createdAt: userRecord.createdAt,
      },
      playlists: playlists.map(p => ({
        id: p._id,
        name: p.name,
        description: p.description,
        coverImage: p.coverImage,
        songs: p.songs,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      favorites: favorites.map(f => ({
        itemId: f.itemId,
        itemType: f.itemType,
        createdAt: f.createdAt,
      })),
      history: history.map(h => ({
        trackId: h.songId,
        playedAt: h.playedAt,
        duration: h.duration,
        progress: h.progress,
      })),
      apiKeys: apiKeys ? {
        hasSuno: !!apiKeys.sunoKey?.encryptedText,
        hasUdio: !!apiKeys.udioSecret?.encryptedText,
        isValidSuno: apiKeys.isValidSuno,
        isValidUdio: apiKeys.isValidUdio,
        updatedAt: apiKeys.updatedAt,
      } : null,
    };

    res.json({
      success: true,
      data: exportData,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// USER NOTIFICATION CONTROLLERS
// ==========================================

export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: notifications.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid notification ID format');
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    res.json({
      success: true,
      data: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
