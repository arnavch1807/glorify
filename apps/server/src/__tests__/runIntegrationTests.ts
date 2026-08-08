import { app } from '../app.js';
import { connectDB, disconnectDB } from '../config/database.js';
import http from 'http';
import axios from 'axios';

let server: http.Server;
let port: number;

const TEST_URL = (path: string) => `http://localhost:${port}${path}`;

async function runTests() {
  console.log('🚀 Starting Phase 7 Accounts & Cloud Integration Test Suite...');

  // Start the server on an ephemeral port
  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const address = server.address();
      port = (address as any).port;
      console.log(`📡 Test server listening on port ${port}`);
      resolve();
    });
  });

  const email1 = `test1_${Date.now()}@example.com`;
  const username1 = `testuser1_${Date.now()}`;
  const password = 'Password123!';

  const email2 = `test2_${Date.now()}@example.com`;
  const username2 = `testuser2_${Date.now()}`;

  let token1: string = '';
  let token2: string = '';

  try {
    // -------------------------------------------------------------------
    // 1. REGISTER & LOGIN TEST USERS
    // -------------------------------------------------------------------
    console.log('\n--- 1. User Authentication ---');

    // Register User 1
    console.log(`Registering User 1: ${username1}`);
    const regRes1 = await axios.post(TEST_URL('/api/auth/register'), {
      username: username1,
      email: email1,
      password,
      displayName: 'Test User 1',
    });
    if (regRes1.status !== 201) throw new Error('Failed to register User 1');

    // Login User 1
    console.log(`Logging in User 1`);
    const loginRes1 = await axios.post(TEST_URL('/api/auth/login'), {
      email: email1,
      password,
    });
    token1 = loginRes1.data.data.accessToken;
    const cookie1 = loginRes1.headers['set-cookie'];
    if (!token1) throw new Error('User 1 login failed to return access token');

    // Register User 2
    console.log(`Registering User 2: ${username2}`);
    const regRes2 = await axios.post(TEST_URL('/api/auth/register'), {
      username: username2,
      email: email2,
      password,
      displayName: 'Test User 2',
    });
    if (regRes2.status !== 201) throw new Error('Failed to register User 2');

    // Login User 2
    console.log(`Logging in User 2`);
    const loginRes2 = await axios.post(TEST_URL('/api/auth/login'), {
      email: email2,
      password,
    });
    token2 = loginRes2.data.data.accessToken;
    if (!token2) throw new Error('User 2 login failed to return access token');

    const headers1 = { Authorization: `Bearer ${token1}` };
    const headers2 = { Authorization: `Bearer ${token2}` };

    console.log('✅ Authentication flow successfully verified.');

    // -------------------------------------------------------------------
    // 2. PLAYLIST CRUD & ACCESS CONTROL (OWNERSHIP)
    // -------------------------------------------------------------------
    console.log('\n--- 2. Playlist CRUD and Ownership Validation ---');

    // Create Playlist (User 1)
    console.log('Creating playlist as User 1');
    const createPlaylistRes = await axios.post(
      TEST_URL('/api/v1/playlists'),
      {
        name: 'My Rock Anthems',
        description: 'Best of rock music',
      },
      { headers: headers1 }
    );
    const playlistId = createPlaylistRes.data.data.id;
    if (!playlistId) throw new Error('Playlist creation did not return id');
    console.log(`Created playlist ID: ${playlistId}`);

    // Fetch User 1 Playlists
    const fetchPlaylistsRes = await axios.get(TEST_URL('/api/v1/playlists'), { headers: headers1 });
    const user1Playlists = fetchPlaylistsRes.data.data;
    if (!user1Playlists.some((p: any) => p.id === playlistId)) {
      throw new Error('Created playlist not present in User 1 playlists list');
    }

    // Access Playlist details (User 1)
    console.log('Fetching playlist details as User 1 (Owner)');
    const detailsRes1 = await axios.get(TEST_URL(`/api/v1/playlists/${playlistId}`), { headers: headers1 });
    if (detailsRes1.status !== 200 || detailsRes1.data.data.name !== 'My Rock Anthems') {
      throw new Error('Failed to fetch correct playlist details');
    }

    // Security check: Access playlist details (User 2)
    console.log('Security check: Fetching playlist details as User 2 (Non-Owner, expect 403)');
    try {
      await axios.get(TEST_URL(`/api/v1/playlists/${playlistId}`), { headers: headers2 });
      throw new Error('Security Breach: User 2 was able to fetch User 1 playlist details!');
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log('🛡️ Correctly returned 403 Forbidden.');
      } else {
        throw new Error(`Expected 403 but got ${err.response?.status || err.message}`);
      }
    }

    // Update Playlist details (User 1)
    console.log('Updating playlist details as User 1');
    const updateRes = await axios.put(
      TEST_URL(`/api/v1/playlists/${playlistId}`),
      {
        name: 'Updated Rock Anthems',
        description: 'Best of rock and metal',
      },
      { headers: headers1 }
    );
    if (updateRes.data.data.name !== 'Updated Rock Anthems') {
      throw new Error('Playlist rename failed');
    }

    // Security check: Rename playlist (User 2)
    console.log('Security check: Renaming playlist as User 2 (expect 403)');
    try {
      await axios.put(
        TEST_URL(`/api/v1/playlists/${playlistId}`),
        { name: 'Hacked playlist name' },
        { headers: headers2 }
      );
      throw new Error('Security Breach: User 2 was able to rename User 1 playlist!');
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log('🛡️ Correctly returned 403 Forbidden.');
      } else {
        throw new Error(`Expected 403 but got ${err.response?.status || err.message}`);
      }
    }

    console.log('✅ Playlist CRUD and ownership checks passed.');

    // -------------------------------------------------------------------
    // 3. PLAYLIST TRACKS MANAGEMENT & REORDERING
    // -------------------------------------------------------------------
    console.log('\n--- 3. Playlist Tracks & Reordering ---');

    // Add Track 1
    console.log('Adding track "sample_01" to playlist');
    const addTrackRes1 = await axios.post(
      TEST_URL(`/api/v1/playlists/${playlistId}/tracks`),
      { trackId: 'sample_01' },
      { headers: headers1 }
    );
    if (!addTrackRes1.data.data.songs.includes('sample_01')) {
      throw new Error('Failed to add track "sample_01" to playlist');
    }

    // Add Track 2
    console.log('Adding track "sample_02" to playlist');
    const addTrackRes2 = await axios.post(
      TEST_URL(`/api/v1/playlists/${playlistId}/tracks`),
      { trackId: 'sample_02' },
      { headers: headers1 }
    );
    if (!addTrackRes2.data.data.songs.includes('sample_02')) {
      throw new Error('Failed to add track "sample_02" to playlist');
    }

    // Reorder tracks
    console.log('Reordering tracks: placing index 1 ("sample_02") to index 0');
    const reorderRes = await axios.put(
      TEST_URL(`/api/v1/playlists/${playlistId}/tracks/reorder`),
      { startIndex: 1, endIndex: 0 },
      { headers: headers1 }
    );
    const songsOrder = reorderRes.data.data.songs;
    if (songsOrder[0] !== 'sample_02' || songsOrder[1] !== 'sample_01') {
      throw new Error(`Tracks reordering failed. Order: ${JSON.stringify(songsOrder)}`);
    }

    // Security check: Modify tracks (User 2)
    console.log('Security check: Adding track as User 2 (expect 403)');
    try {
      await axios.post(
        TEST_URL(`/api/v1/playlists/${playlistId}/tracks`),
        { trackId: 'sample_03' },
        { headers: headers2 }
      );
      throw new Error('Security Breach: User 2 was able to add track to User 1 playlist!');
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log('🛡️ Correctly returned 403 Forbidden.');
      } else {
        throw new Error(`Expected 403 but got ${err.response?.status || err.message}`);
      }
    }

    // Remove Track
    console.log('Removing track "sample_01" from playlist');
    const removeTrackRes = await axios.delete(
      TEST_URL(`/api/v1/playlists/${playlistId}/tracks/sample_01`),
      { headers: headers1 }
    );
    if (removeTrackRes.data.data.songs.includes('sample_01')) {
      throw new Error('Failed to remove track from playlist');
    }

    console.log('✅ Playlist track operations and security checks passed.');

    // -------------------------------------------------------------------
    // 4. FAVORITES & IDEMPOTENCY
    // -------------------------------------------------------------------
    console.log('\n--- 4. Favorites & Idempotency ---');

    // Add Favorite
    console.log('Favoriting track "sample_01"');
    const favRes1 = await axios.post(TEST_URL('/api/v1/favorites/sample_01?type=song'), {}, { headers: headers1 });
    if (favRes1.status !== 200) throw new Error('Failed to favorite track');

    // Add Favorite again (Idempotency test)
    console.log('Security check: Favoriting track "sample_01" again (Idempotency test)');
    const favRes2 = await axios.post(TEST_URL('/api/v1/favorites/sample_01?type=song'), {}, { headers: headers1 });
    if (favRes2.status !== 200) throw new Error('Idempotent favorite failed');

    // Fetch favorites
    console.log('Fetching favorites list');
    const getFavsRes1 = await axios.get(TEST_URL('/api/v1/favorites'), { headers: headers1 });
    if (!getFavsRes1.data.data.songs.includes('sample_01')) {
      throw new Error('Track "sample_01" not present in favorites response');
    }

    // Unfavorite
    console.log('Unfavoriting track "sample_01"');
    const unfavRes = await axios.delete(TEST_URL('/api/v1/favorites/sample_01?type=song'), { headers: headers1 });
    if (unfavRes.status !== 200) throw new Error('Unfavoriting failed');

    // Fetch favorites again
    const getFavsRes2 = await axios.get(TEST_URL('/api/v1/favorites'), { headers: headers1 });
    if (getFavsRes2.data.data.songs.includes('sample_01')) {
      throw new Error('Track "sample_01" still present in favorites list after deleting');
    }

    console.log('✅ Favorites functionality and idempotency checks passed.');

    // -------------------------------------------------------------------
    // 5. HISTORY & DERIVED RECENTLY PLAYED
    // -------------------------------------------------------------------
    console.log('\n--- 5. Listening History & Recently Played ---');

    // Log played tracks in order: A (sample_01), B (sample_02), A (sample_01)
    console.log('Playing sample_01');
    await axios.post(TEST_URL('/api/v1/history'), { trackId: 'sample_01', duration: 180, progress: 180 }, { headers: headers1 });
    
    // Brief delay to ensure different timestamps
    await new Promise((r) => setTimeout(r, 100));

    console.log('Playing sample_02');
    await axios.post(TEST_URL('/api/v1/history'), { trackId: 'sample_02', duration: 200, progress: 200 }, { headers: headers1 });

    await new Promise((r) => setTimeout(r, 100));

    console.log('Playing sample_01 again');
    await axios.post(TEST_URL('/api/v1/history'), { trackId: 'sample_01', duration: 180, progress: 180 }, { headers: headers1 });

    // Fetch history
    console.log('Fetching raw listening history (expect 3 total logs, newest first)');
    const histRes = await axios.get(TEST_URL('/api/v1/history'), { headers: headers1 });
    const rawHistory = histRes.data.data;
    if (rawHistory.length !== 3) {
      throw new Error(`Expected 3 history items, got ${rawHistory.length}`);
    }
    if (rawHistory[0].trackId !== 'sample_01' || rawHistory[1].trackId !== 'sample_02') {
      throw new Error('Raw history sorting is incorrect');
    }

    // Fetch recently played (derived unique entries)
    console.log('Fetching derived recently played (expect unique entries: sample_01, then sample_02)');
    const recentRes = await axios.get(TEST_URL('/api/v1/recently-played'), { headers: headers1 });
    const recents = recentRes.data.data;
    
    if (recents.length !== 2) {
      throw new Error(`Expected exactly 2 unique recently played items, got ${recents.length}`);
    }
    if (recents[0].trackId !== 'sample_01' || recents[1].trackId !== 'sample_02') {
      throw new Error('Derived recently played did not sort by latest played timestamp correctly');
    }

    // Security check: Access history as User 2 (expect empty history or separation)
    console.log("Security check: Fetching User 2's history (should be empty and separated)");
    const histRes2 = await axios.get(TEST_URL('/api/v1/history'), { headers: headers2 });
    if (histRes2.data.data.length !== 0) {
      throw new Error('Security Breach: User 2 history is leaking data from User 1!');
    }

    console.log('✅ History and recently played derivation checks passed.');

    // -------------------------------------------------------------------
    // 6. DELETE PLAYLIST CLEANUP & FINALIZE
    // -------------------------------------------------------------------
    console.log('\n--- 6. Deletion Cleanup & Security Validation ---');

    // Security check: Delete playlist (User 2 tries to delete User 1's playlist)
    console.log("Security check: User 2 trying to delete User 1's playlist (expect 403)");
    try {
      await axios.delete(TEST_URL(`/api/v1/playlists/${playlistId}`), { headers: headers2 });
      throw new Error('Security Breach: User 2 was able to delete User 1 playlist!');
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log('🛡️ Correctly returned 403 Forbidden.');
      } else {
        throw new Error(`Expected 403 but got ${err.response?.status || err.message}`);
      }
    }

    // Owner deletes playlist
    console.log("Owner (User 1) deleting their playlist");
    const deleteRes = await axios.delete(TEST_URL(`/api/v1/playlists/${playlistId}`), { headers: headers1 });
    if (deleteRes.status !== 200) throw new Error('Playlist deletion failed');

    // Verify it is gone
    try {
      await axios.get(TEST_URL(`/api/v1/playlists/${playlistId}`), { headers: headers1 });
      throw new Error('Playlist was deleted but still queryable!');
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('🗑️ Correctly returned 404 Not Found after deletion.');
      } else {
        throw new Error(`Expected 404 but got ${err.response?.status || err.message}`);
      }
    }

    console.log('✅ Deletion and final security checks passed.');

    console.log('\n🌟 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🌟');
    process.exit(0);

  } catch (err: any) {
    console.error('\n❌ INTEGRATION TEST FAILED:');
    if (err.response) {
      console.error(`HTTP Status: ${err.response.status}`);
      console.error('Response Body:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
}

// Ensure database connection is active before running integration tests
(async () => {
  try {
    await connectDB();
    await runTests();
  } catch (err) {
    console.error('Failed to boot integration tests:', err);
    process.exit(1);
  }
})();
