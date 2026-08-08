import { apiClient } from '../utils/apiClient.js';
import { Playlist } from '@chotify/types';

export const CloudRepository = {
  async getPlaylists(): Promise<Playlist[]> {
    const response = await apiClient.get('/api/v1/playlists');
    return response.data.data;
  },

  async createPlaylist(name: string, description?: string, coverImage?: string): Promise<Playlist> {
    const response = await apiClient.post('/api/v1/playlists', { name, description, coverImage });
    return response.data.data;
  },

  async updatePlaylist(id: string, name?: string, description?: string, coverImage?: string): Promise<Playlist> {
    const response = await apiClient.put(`/api/v1/playlists/${id}`, { name, description, coverImage });
    return response.data.data;
  },

  async deletePlaylist(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/playlists/${id}`);
  },

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<Playlist> {
    const response = await apiClient.post(`/api/v1/playlists/${playlistId}/tracks`, { trackId });
    return response.data.data;
  },

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<Playlist> {
    const response = await apiClient.delete(`/api/v1/playlists/${playlistId}/tracks/${trackId}`);
    return response.data.data;
  },

  async reorderPlaylistTracks(playlistId: string, startIndex: number, endIndex: number): Promise<Playlist> {
    const response = await apiClient.put(`/api/v1/playlists/${playlistId}/tracks/reorder`, { startIndex, endIndex });
    return response.data.data;
  },

  async getFavorites(): Promise<{ songs: string[]; albums: string[]; artists: string[] }> {
    const response = await apiClient.get('/api/v1/favorites');
    return response.data.data;
  },

  async addFavorite(trackId: string, type: 'song' | 'album' | 'artist' = 'song'): Promise<void> {
    await apiClient.post(`/api/v1/favorites/${trackId}?type=${type}`);
  },

  async removeFavorite(trackId: string, type: 'song' | 'album' | 'artist' = 'song'): Promise<void> {
    await apiClient.delete(`/api/v1/favorites/${trackId}?type=${type}`);
  },

  async getHistory(): Promise<Array<{ trackId: string; playedAt: string; duration?: number; progress?: number }>> {
    const response = await apiClient.get('/api/v1/history');
    return response.data.data;
  },

  async addHistoryEvent(trackId: string, duration?: number, progress?: number): Promise<void> {
    await apiClient.post('/api/v1/history', { trackId, duration, progress });
  },

  async clearHistory(): Promise<void> {
    await apiClient.delete('/api/v1/history');
  },

  async getRecentlyPlayed(): Promise<Array<{ trackId: string; playedAt: string }>> {
    const response = await apiClient.get('/api/v1/recently-played');
    return response.data.data;
  },

  async getAPIKeysStatus(): Promise<{ hasSuno: boolean; hasUdio: boolean; isValidSuno: boolean; isValidUdio: boolean }> {
    const response = await apiClient.get('/api/v1/apikey');
    return response.data.data;
  },

  async saveAPIKeys(sunoKey?: string, udioSecret?: string): Promise<{ hasSuno: boolean; hasUdio: boolean; isValidSuno: boolean; isValidUdio: boolean }> {
    const response = await apiClient.post('/api/v1/apikey', { sunoKey, udioSecret });
    return response.data.data;
  },

  async composeTrack(data: {
    prompt: string;
    bpm: number;
    keySignature: string;
    genre: string;
    provider: 'suno' | 'udio';
    coverImage?: string;
  }): Promise<{ taskId: string; status: string; progress: number }> {
    const response = await apiClient.post('/api/v1/ai/compose', data);
    return response.data.data;
  },

  async pollTask(taskId: string): Promise<{
    taskId: string;
    status: 'queued' | 'processing' | 'mixing' | 'completed' | 'failed';
    progress: number;
    result?: any;
    error?: string;
  }> {
    const response = await apiClient.get(`/api/v1/ai/tasks/${taskId}`);
    return response.data.data;
  },

  async exportProfileData(): Promise<any> {
    const response = await apiClient.get('/api/v1/user/export');
    return response.data.data;
  },

  async getNotifications(): Promise<Array<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; read: boolean; createdAt: string }>> {
    const response = await apiClient.get('/api/v1/notifications');
    return response.data.data;
  },

  async markNotificationRead(id: string): Promise<any> {
    const response = await apiClient.put(`/api/v1/notifications/${id}/read`);
    return response.data.data;
  },
};
