import { apiClient } from '../utils/apiClient.js';
export const CloudRepository = {
    async getPlaylists() {
        const response = await apiClient.get('/api/v1/playlists');
        return response.data.data;
    },
    async createPlaylist(name, description, coverImage) {
        const response = await apiClient.post('/api/v1/playlists', { name, description, coverImage });
        return response.data.data;
    },
    async updatePlaylist(id, name, description, coverImage) {
        const response = await apiClient.put(`/api/v1/playlists/${id}`, { name, description, coverImage });
        return response.data.data;
    },
    async deletePlaylist(id) {
        await apiClient.delete(`/api/v1/playlists/${id}`);
    },
    async addTrackToPlaylist(playlistId, trackId) {
        const response = await apiClient.post(`/api/v1/playlists/${playlistId}/tracks`, { trackId });
        return response.data.data;
    },
    async removeTrackFromPlaylist(playlistId, trackId) {
        const response = await apiClient.delete(`/api/v1/playlists/${playlistId}/tracks/${trackId}`);
        return response.data.data;
    },
    async reorderPlaylistTracks(playlistId, startIndex, endIndex) {
        const response = await apiClient.put(`/api/v1/playlists/${playlistId}/tracks/reorder`, { startIndex, endIndex });
        return response.data.data;
    },
    async getFavorites() {
        const response = await apiClient.get('/api/v1/favorites');
        return response.data.data;
    },
    async addFavorite(trackId, type = 'song') {
        await apiClient.post(`/api/v1/favorites/${trackId}?type=${type}`);
    },
    async removeFavorite(trackId, type = 'song') {
        await apiClient.delete(`/api/v1/favorites/${trackId}?type=${type}`);
    },
    async getHistory() {
        const response = await apiClient.get('/api/v1/history');
        return response.data.data;
    },
    async addHistoryEvent(trackId, duration, progress) {
        await apiClient.post('/api/v1/history', { trackId, duration, progress });
    },
    async clearHistory() {
        await apiClient.delete('/api/v1/history');
    },
    async getRecentlyPlayed() {
        const response = await apiClient.get('/api/v1/recently-played');
        return response.data.data;
    },
    async getAPIKeysStatus() {
        const response = await apiClient.get('/api/v1/apikey');
        return response.data.data;
    },
    async saveAPIKeys(sunoKey, udioSecret) {
        const response = await apiClient.post('/api/v1/apikey', { sunoKey, udioSecret });
        return response.data.data;
    },
    async composeTrack(data) {
        const response = await apiClient.post('/api/v1/ai/compose', data);
        return response.data.data;
    },
    async pollTask(taskId) {
        const response = await apiClient.get(`/api/v1/ai/tasks/${taskId}`);
        return response.data.data;
    },
    async exportProfileData() {
        const response = await apiClient.get('/api/v1/user/export');
        return response.data.data;
    },
    async getNotifications() {
        const response = await apiClient.get('/api/v1/notifications');
        return response.data.data;
    },
    async markNotificationRead(id) {
        const response = await apiClient.put(`/api/v1/notifications/${id}/read`);
        return response.data.data;
    },
};
//# sourceMappingURL=cloudRepository.js.map