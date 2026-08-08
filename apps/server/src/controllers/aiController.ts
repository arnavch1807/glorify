import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { APIKey } from '../models/APIKey.js';
import { Song } from '../models/Song.js';
import { Notification } from '../models/Notification.js';
import { decrypt } from '../utils/crypto.js';

interface AITask {
  id: string;
  userId: string;
  progress: number;
  status: 'queued' | 'processing' | 'mixing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: number;
}

const activeTasks = new Map<string, AITask>();

export const composeTrack = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt, bpm, keySignature, genre, provider, coverImage } = req.body;

    // 1. Retrieve encrypted API credentials
    const keyRecord = await APIKey.findOne({ userId: req.user._id });
    const isSuno = provider === 'suno';
    const credential = isSuno ? keyRecord?.sunoKey : keyRecord?.udioSecret;

    // 2. Validate credential existence
    if (!credential || !credential.encryptedText) {
      res.status(400).json({
        success: false,
        message: `API Key for ${isSuno ? 'Suno AI' : 'Udio AI'} is not configured. Please add it in Settings first.`,
      });
      return;
    }

    // 3. Decrypt credentials in-memory and validate format
    try {
      const decryptedKey = decrypt(credential.encryptedText, credential.iv, credential.tag);
      const expectedPrefix = isSuno ? 'sk-suno-' : 'sk-udio-';
      if (!decryptedKey.startsWith(expectedPrefix)) {
        res.status(400).json({
          success: false,
          message: `The configured key for ${isSuno ? 'Suno AI' : 'Udio AI'} has an invalid prefix. Please re-enter it in Settings.`,
        });
        return;
      }
    } catch (decryptErr) {
      res.status(400).json({
        success: false,
        message: 'Failed to decrypt provider credentials. Please re-save them in Settings.',
      });
      return;
    }

    // 4. Create and register task
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTask: AITask = {
      id: taskId,
      userId: req.user._id.toString(),
      progress: 10,
      status: 'queued',
      createdAt: Date.now(),
    };
    activeTasks.set(taskId, newTask);

    // 5. Simulate asynchronous generation phases in background
    const intervalId = setInterval(async () => {
      const task = activeTasks.get(taskId);
      if (!task) {
        clearInterval(intervalId);
        return;
      }

      if (task.progress < 45) {
        task.progress = 45;
        task.status = 'processing';
      } else if (task.progress < 80) {
        task.progress = 80;
        task.status = 'mixing';
      } else {
        clearInterval(intervalId);
        try {
          // Select mock track details
          const title = prompt.length > 25 ? `${prompt.substring(0, 22)}...` : prompt;
          const randomNum = Math.floor(1 + Math.random() * 6);
          const mockAudioUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${randomNum}.mp3`;

          // Persist generated song to MongoDB
          const newSong = await Song.create({
            title: title || 'AI Synthesized Jam',
            artist: isSuno ? 'Suno AI Studio' : 'Udio AI Studio',
            album: 'AI Generator Sessions',
            genre: genre.toLowerCase(),
            duration: 180 + Math.floor(Math.random() * 90),
            coverImage: coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
            audioUrl: mockAudioUrl,
            isGenerated: true,
            prompt: prompt,
            bpm: bpm,
            keySignature: keySignature,
            createdBy: new mongoose.Types.ObjectId(task.userId),
          });

          // Create synthesis notification
          try {
            await Notification.create({
              userId: new mongoose.Types.ObjectId(task.userId),
              title: 'AI Track Synthesized',
              message: `Your AI composition "${newSong.title}" is ready and added to your catalog.`,
              type: 'success',
            });
          } catch (notiErr) {
            console.error('Failed to create synthesis notification:', notiErr);
          }

          task.progress = 100;
          task.status = 'completed';
          task.result = {
            id: newSong._id,
            title: newSong.title,
            artist: newSong.artist,
            album: newSong.album,
            genre: newSong.genre,
            duration: newSong.duration,
            coverImage: newSong.coverImage,
            audioUrl: newSong.audioUrl,
            isGenerated: newSong.isGenerated,
            prompt: newSong.prompt,
            bpm: newSong.bpm,
            keySignature: newSong.keySignature,
          };
        } catch (err: any) {
          task.status = 'failed';
          task.error = err.message || 'Failed to save generated composition track';
        }
      }
      activeTasks.set(taskId, task);
    }, 1500);

    res.status(202).json({
      success: true,
      data: {
        taskId,
        status: 'queued',
        progress: 10,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const pollTaskStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = activeTasks.get(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Synthesis task not found',
      });
      return;
    }

    if (task.userId !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this synthesis session',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        taskId: task.id,
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error,
      },
    });
  } catch (err) {
    next(err);
  }
};
