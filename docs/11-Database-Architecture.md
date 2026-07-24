# Chotify Database Architecture
**Version:** 1.0.0  
**Database Engine:** MongoDB Atlas (Document Store) + Redis (Caching Layer)  
**Status:** Production-Ready Blueprint  

---

## 1. Naming & Relationship Conventions
*   **Collections:** CamelCase plural names (e.g., `Users`, `Songs`, `Playlists`).
*   **Fields:** camelCase names (e.g., `passwordHash`, `encryptedKey`).
*   **Relationships:** References are represented using MongoDB `ObjectId` types pointing to target collections.

### Collection Relationship Diagram

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
       ├─ (1:N) ─> [ Playlists ] ── (M:N via ObjectId Array) ──> [ Songs ]
       ├─ (1:N) ─> [ APIKeys ]                                      ▲
       └─ (1:N) ─> [ AIGenerations ] ──────── (Produces) ───────────┘
```

---

## 2. Collection Schemas & Validations

### Users Collection
*   **Schema validation:**
    ```json
    {
      "email": { "type": "String", "required": true, "unique": true },
      "username": { "type": "String", "required": true },
      "passwordHash": { "type": "String", "required": true },
      "theme": { "type": "String", "enum": ["sand", "carbon"], "default": "carbon" }
    }
    ```
*   **Indexes:**
    *   `idx_users_email` (Unique): `{ "email": 1 }`

### Songs Collection
*   **Schema validation:**
    ```json
    {
      "title": { "type": "String", "required": true },
      "artist": { "type": "String", "required": true },
      "audioUrl": { "type": "String", "required": true },
      "isGenerated": { "type": "Boolean", "default": false },
      "prompt": { "type": "String", "required": false },
      "createdBy": { "type": "ObjectId", "ref": "Users", "required": false }
    }
    ```
*   **Indexes:**
    *   `idx_songs_text` (Text Search): `{ "title": "text", "artist": "text", "prompt": "text" }`
    *   `idx_songs_creator`: `{ "createdBy": 1 }`

### APIKeys Collection
This collection maps to the security guidelines specified in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).
*   **Schema validation:**
    ```json
    {
      "userId": { "type": "ObjectId", "ref": "Users", "required": true },
      "provider": { "type": "String", "enum": ["suno", "udio", "openai", "gemini"], "required": true },
      "encryptedKey": { "type": "String", "required": true },
      "status": { "type": "String", "enum": ["active", "invalid"], "default": "active" }
    }
    ```
*   **Indexes:**
    *   `idx_apikeys_lookup` (Unique): `{ "userId": 1, "provider": 1 }`

---

## 3. Data Lifecycle & TTL Settings

To prevent database bloating and ensure compliance with security requirements, we configure Time-to-Live (TTL) indexes on temporary data collections:

*   **System Notifications Collection (`Notifications`):** Expire automatically after 30 days.
    *   *TTL Index:* `{ "createdAt": 1 }` with `expireAfterSeconds: 2592000`
*   **Active AI Tasks Collection (`AITasks`):** Temporary records monitoring synthesis queues. Expire after 24 hours.
    *   *TTL Index:* `{ "createdAt": 1 }` with `expireAfterSeconds: 86400`

---

## 4. Migration & Scalability Strategy

### Migration Strategy
Database migrations are managed programmatically via the `migrate-mongo` Node library:
*   Migration scripts are checked into the `/server/migrations` folder.
*   The CI/CD pipeline runs `migrate-mongo up` during container initialization before the production Express.js servers boot.

### Sharding & Scalability Considerations
When database operations exceed standard scaling boundaries, the database is partitioned using MongoDB Sharded Clusters:
*   `Users` Shard Key: `{ "_id": "hashed" }` - Ensures uniform distribution of user records.
*   `Songs` Shard Key: `{ "genre": 1, "_id": "hashed" }` - Distributes streaming catalog queries based on genre collections.

---

## 5. Backups & Disaster Recovery
*   **Backups:** MongoDB Atlas automatically takes snapshots daily, retaining them for 30 days. Snapshots are stored in geographically isolated AWS zones.
*   **Disaster Recovery (DR) RTO/RPO:**
    *   *Recovery Point Objective (RPO):* Maximum 4 hours of data loss.
    *   *Recovery Time Objective (RTO):* System restored and fully online within 2 hours of primary cloud failure.
