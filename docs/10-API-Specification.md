# Chotify REST API Specification
**Version:** 1.0.0 (v1)  
**Status:** Production-Ready Blueprint  
**Base URL:** `https://api.chotify.com/api/v1`  
**Media Type:** `application/json`  

---

## 1. Global API Standards

### Versioning
All API endpoints are versioned through the URL path prefix `/api/v1`.

### Authentication
Secure routes require a JWT bearer token passed in the HTTP Authorization header:
`Authorization: Bearer <JWT_TOKEN>`  
Session refresh tokens are managed via secure, HttpOnly, SameSite cookies.

### Rate Limiting & Response Headers
Rate limiting is enforced at the backend proxy gateway via Redis, as specified in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).
*   **Standard Routes:** 100 requests per minute per IP.
*   **AI Synthesis Routes:** 5 requests per minute per user.
*   **Headers Returned:**
    *   `X-RateLimit-Limit`: Maximum requests permitted.
    *   `X-RateLimit-Remaining`: Requests remaining in the current window.
    *   `X-RateLimit-Reset`: UTC epoch timestamp indicating when the current window resets.

### Pagination
List endpoints return paginated payloads. We use cursor-based pagination for large audio logs and page-based pagination for static collections:
*   *Parameters:* `limit` (Default: 20, Max: 100), `starting_after` (String cursor ID representing the last evaluated song ID).
*   *Format:*
    ```json
    {
      "data": [],
      "has_more": false,
      "next_cursor": "64f128c9b687"
    }
    ```

### Error Responses
Chotify API returns standard RFC-7807 problem details for error states:
```json
{
  "status": 400,
  "code": "validation_failure",
  "message": "The key signature provided is invalid.",
  "errors": [
    {
      "field": "keySignature",
      "issue": "Must be major or minor musical scale notation."
    }
  ]
}
```

---

## 2. Authentication & Profile Routes

### Register Account
*   **Path:** `POST /auth/register`
*   **Payload:**
    ```json
    {
      "username": "user123",
      "email": "user@chotify.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "userId": "64f128c9b6875b1a80cde9f2",
      "username": "user123",
      "email": "user@chotify.com",
      "accessToken": "eyJhbG..."
    }
    ```

### Login Session
*   **Path:** `POST /auth/login`
*   **Payload:**
    ```json
    {
      "email": "user@chotify.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "userId": "64f128c9b6875b1a80cde9f2",
      "username": "user123",
      "accessToken": "eyJhbG..."
    }
    ```

### Refresh Token Session
*   **Path:** `POST /auth/refresh`
*   **Payload:** None (Reads refresh token from HTTP-Only cookie).
*   **Response (200 OK):**
    ```json
    {
      "accessToken": "eyJhbG_new..."
    }
    ```

### Logout Session
*   **Path:** `POST /auth/logout`
*   **Response (200 OK):** `{"message": "Logged out successfully."}`

---

## 3. Music Catalog & Library Routes

### Search Catalog
*   **Path:** `GET /songs`
*   **Parameters:** `q` (Query string), `filter` (`standard` | `synth`), `genre`, `bpm_min`, `bpm_max`.
*   **Response (200 OK):**
    ```json
    {
      "data": [
        {
          "id": "song_01h89",
          "title": "Desert Winds",
          "artist": "Arnav",
          "album": "Aura",
          "duration": 182,
          "audioUrl": "https://cdn.cloudinary.com/chotify/desert_winds.mp3",
          "isGenerated": true,
          "prompt": "Warm acoustic guitar chords, sand texture"
        }
      ],
      "has_more": false
    }
    ```

### Retrieve Playlist Details
*   **Path:** `GET /playlists/:id`
*   **Response (200 OK):**
    ```json
    {
      "id": "playlist_88",
      "name": "Summer Lo-Fi",
      "description": "Generated study loops",
      "isPublic": true,
      "songs": [
        { "id": "song_01h89", "title": "Desert Winds", "artist": "Arnav" }
      ]
    }
    ```

### Create Playlist
*   **Path:** `POST /playlists`
*   **Payload:**
    ```json
    {
      "name": "Focus Stems",
      "description": "Monochromatic loops",
      "isPublic": false
    }
    ```
*   **Response (201 Created):** Returns the new playlist object.

---

## 4. AI Studio & Gateway Routes

All AI requests execute via the backend proxy model detailed in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).

### Track Synthesis (AI Composer)
*   **Path:** `POST /ai/compose`
*   **Payload:**
    ```json
    {
      "prompt": "Low frequency pad, sand texture, warm hardware synth",
      "genre": "ambient",
      "bpm": 72,
      "scale": "phrygian",
      "key": "A",
      "duration": 120
    }
    ```
*   **Response (202 Accepted):**
    ```json
    {
      "taskId": "task_synth_9982",
      "status": "processing",
      "estimatedDurationSeconds": 45
    }
    ```

### Poll Synthesis Task Status
*   **Path:** `GET /ai/tasks/:taskId`
*   **Response (200 OK):**
    ```json
    {
      "taskId": "task_synth_9982",
      "status": "completed",
      "audioUrl": "https://cdn.cloudinary.com/chotify/synth_9982.mp3",
      "seed": 88471092,
      "tokensUsed": 12
    }
    ```

### Synthesize Style Remix
*   **Path:** `POST /ai/remix`
*   **Payload:**
    ```json
    {
      "sourceAudioUrl": "https://cdn.cloudinary.com/chotify/source_001.mp3",
      "styleModel": "synthwave"
    }
    ```
*   **Response (202 Accepted):** Returns `taskId`.

---

## 5. Security & Configuration Routes

### Save API Provider Keys
*   **Path:** `POST /apikey`
*   **Payload:**
    ```json
    {
      "provider": "suno",
      "apiKey": "sk-suno-12345abcdef"
    }
    ```
*   **Response (200 OK):** `{"message": "API key successfully validated and saved."}`

### Delete API Provider Keys
*   **Path:** `DELETE /apikey`
*   **Payload:** `{"provider": "suno"}`
*   **Response (200 OK):** `{"message": "API key successfully removed."}`
