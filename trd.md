Technical Requirements Document (TRD)
Chotify – AI-Native Music Platform

Version: 1.0
Author: Arnav Chouhan
Status: Planning
Architecture: Full Stack Web Application

1. Purpose

This document defines the complete technical architecture, system design, technology stack, database schema, API architecture, security requirements, deployment strategy, and engineering standards for Chotify.

2. System Architecture
                Internet
                    │
            Cloudflare CDN
                    │
          React Frontend (Vercel)
                    │
      ┌─────────────┴─────────────┐
      │                           │
 Music API                  AI Gateway API
      │                           │
      └─────────────┬─────────────┘
                    │
            Express Backend
                    │
     ┌──────────────┼──────────────┐
     │              │              │
 MongoDB       Cloudinary      Redis Cache
     │              │              │
     └──────────────┼──────────────┘
                    │
             Authentication
                    │
             JWT + Refresh Token
3. Technology Stack
Frontend

Framework

React 19
TypeScript
Vite

Styling

Tailwind CSS v4

Animation

Framer Motion
Motion One

Icons

Lucide React

State Management

Zustand

Server State

TanStack Query

Forms

React Hook Form
Zod Validation

Audio

Howler.js

Charts

Recharts
Backend

Runtime

Node.js

Framework

Express.js

Language

TypeScript

Authentication

JWT

Password Hashing

bcrypt

Validation

Zod

Logging

Pino

File Upload

Multer

Cloud Storage

Cloudinary

Database

MongoDB Atlas

ODM

Mongoose

Caching

Redis

AI Services

Provider Agnostic Architecture

Supported Providers

Suno
Udio
OpenAI
Gemini
Custom Provider
DevOps

Frontend

Vercel

Backend

Railway

or

Render

CI/CD

GitHub Actions

Version Control

Git

4. Folder Structure
chotify/

├── apps/
│   ├── web/
│   └── server/
│
├── packages/
│   ├── ui/
│   ├── hooks/
│   ├── config/
│   ├── utils/
│   ├── types/
│   └── api/
│
├── docs/
│
├── assets/
│
├── scripts/
│
└── docker/
Frontend Structure
src/

components/

pages/

layouts/

hooks/

services/

store/

types/

styles/

animations/

contexts/

routes/

utils/

constants/

assets/
Backend Structure
src/

controllers/

routes/

middleware/

services/

repositories/

models/

config/

utils/

types/

validators/

jobs/

sockets/
5. Functional Modules
Authentication Module

Features

Register

Login

Refresh Token

Logout

Forgot Password

Email Verification

Google Login (Future)

Music Module

Play Song

Pause

Seek

Queue

Shuffle

Repeat

Volume

Crossfade

Playback Speed

Streaming

Caching

Playlist Module

Create Playlist

Edit Playlist

Delete Playlist

Add Songs

Remove Songs

Share Playlist

Collaborative Playlist (Future)

AI Studio Module

AI Composer

AI Remix

AI Playlist

AI Lyrics

AI Cover Art

Generation History

Prompt Templates

Search Module

Instant Search

Recent Searches

Trending Searches

Genre Search

Artist Search

Album Search

Mood Search

Library Module

Liked Songs

Downloads

History

Recently Played

Playlists

AI Songs

Favorites

Profile Module

Profile

Avatar

Theme

Settings

API Keys

Privacy

6. Database Schema
User
_id

username

email

passwordHash

avatar

theme

createdAt

updatedAt
Song
_id

title

artist

album

genre

duration

coverImage

audioUrl

lyrics

isGenerated

createdBy

createdAt
Playlist
_id

userId

name

description

coverImage

songs[]

isPublic

createdAt
AI Generation
_id

userId

provider

prompt

status

audioUrl

duration

tokensUsed

createdAt
API Keys
_id

userId

provider

encryptedKey

status

createdAt
7. API Design
Authentication
POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/profile
Songs
GET /songs

GET /songs/:id

POST /songs

DELETE /songs/:id

PATCH /songs/:id
Playlists
GET /playlists

POST /playlists

PATCH /playlists/:id

DELETE /playlists/:id

POST /playlists/:id/share
AI
POST /ai/compose

POST /ai/remix

POST /ai/playlist

POST /ai/lyrics

POST /ai/cover
Settings
GET /settings

PATCH /settings

POST /apikey

DELETE /apikey
8. Security

JWT Authentication

Refresh Tokens

Encrypted API Keys (AES-256)

HTTPS Only

Rate Limiting

Helmet

CORS

Input Validation

Password Hashing (bcrypt)

XSS Protection

CSRF Protection (where applicable)

Audit Logs

9. Performance Goals

Page Load < 2 seconds

API Response < 300 ms

Search < 150 ms

Music Start < 500 ms

Animation 60 FPS

Lighthouse Score > 95

CLS < 0.05

10. Visual Standards & Tailwind v4 Configuration

Chotify enforces strict visual boundaries using the centralized tokens defined in [docs/03-Design-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md). In the React frontend application, styles are configured using **Tailwind CSS v4** with a CSS-first `@theme` block. Old JavaScript configuration formats are deprecated.

Theme extensions are configured under the CSS `@theme` directive in the primary entry CSS file:

```css
@theme {
  --color-chotify-sand-50: var(--chotify-color-sand-50, #FAF9F6);
  --color-chotify-sand-100: var(--chotify-color-sand-100, #F4F1EA);
  --color-chotify-sand-300: var(--chotify-color-sand-300, #E6E1D6);
  
  --color-chotify-carbon-950: var(--chotify-color-carbon-950, #0B0B0A);
  --color-chotify-carbon-900: var(--chotify-color-carbon-900, #131312);
  --color-chotify-carbon-850: var(--chotify-color-carbon-850, #1C1C1A);
  --color-chotify-carbon-800: var(--chotify-color-carbon-800, #2A2A28);
  
  --color-chotify-aura-gold: var(--chotify-color-aura-gold, #D4AF37);
  --color-chotify-aura-glow: var(--chotify-color-aura-glow, rgba(212, 175, 55, 0.15));
  
  --color-chotify-sage: #4A6B53;
  --color-chotify-sage-dark: #7CB38C;
  
  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --spacing-ch-1: 4px;
  --spacing-ch-2: 8px;
  --spacing-ch-3: 12px;
  --spacing-ch-4: 16px;
  --spacing-ch-6: 24px;
  --spacing-ch-8: 32px;
  
  --radius-ch-xs: 2px;
  --radius-ch-sm: 4px;
  --radius-ch-md: 8px;
  --radius-ch-lg: 12px;
  --radius-ch-xl: 16px;
  
  --shadow-ch-flat: 1px 1px 0px 0px currentColor;
  --shadow-ch-glow: 0 0 1px 1px var(--chotify-color-aura-gold), 0 4px 20px rgba(212, 175, 55, 0.15);
}
```

11. AI Provider Security Architecture

To protect user credentials and prevent security vulnerabilities, all integrations with external AI audio synthesis platforms (Suno, Udio, OpenAI, Gemini) follow a strict zero-exposure security model.

### API Key Storage & Encryption
*   **Secrets Storage Management:** Encryption keys are injected into the Express.js runtime environment via secure environment variables managed by Vercel/Railway secrets manager. They are never committed to the version control repository.
*   **Encryption Spec:** Keys are encrypted using the AES-256-GCM symmetric encryption standard before being saved to the database. The initialization vector (IV) and authentication tag are stored alongside the encrypted key buffer to prevent replay attacks.
*   **Database Record:** Stored in the `API Keys` collection (MongoDB) as documented in Section 6.

### Secure Backend Proxy Gateway
*   **No Direct Client Requests:** The React client application never makes API calls directly to external AI services. All operations are routed through the Chotify backend API gateway (e.g. `POST /api/ai/compose`).
*   **Decryption-in-Memory:** The backend proxy gateway fetches the encrypted user key from the database at request time, decrypts it in-memory, appends the authorization header to the proxied outgoing request, and executes the synthesis call.
*   **Header Sanitization:** Once the request is resolved, the gateway strips all authorization headers from the payload before returning the audio preview stream or metadata to the client.

### Lifecycle & Validation Processes
*   **Handshake Validation:** When a user enters an API key in settings, the gateway executes a test connection request to the provider's billing endpoint. The key is only encrypted and saved if the test returns `200 OK`.
*   **Rotation:** Users can rotate their API key by submitting a new key. The server overwrites the old database record and invalidates the previous encryption buffer immediately.
*   **Revocation:** If external calls return `401 Unauthorized` or connection failures exceed three consecutive attempts, the server automatically changes the key status to `Invalid` and alerts the user.

### Rate Limiting & Audit Logging
*   **Rate Limits:** Redis coordinates token-bucket rate limits on all proxy routes. Requests are capped at 5 generations per minute per user to prevent API key abuse.
*   **Audit Trails:** The `Pino` logging module records transaction metadata (timestamp, user ID, API endpoint, status code, latency, and tokens consumed). Prompt texts and raw API key tokens are strictly scrubbed from logs to preserve privacy.

12. Motion Guidelines
Refer to [docs/08-Animation-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/08-Animation-System.md) for the complete motion guidelines, physics parameters, and responsive transition profiles. All runtime code must conform to those specifications. Respect `prefers-reduced-motion` settings.

13. Deployment
Frontend

Vercel

Backend

Railway

Database

MongoDB Atlas

Storage

Cloudinary

CDN

Cloudflare

14. Testing Strategy

Unit Tests

Vitest
Jest

Component Tests

React Testing Library

API Tests

Supertest

End-to-End Tests

Playwright

Performance Tests

Lighthouse CI
15. Monitoring & Analytics

Error Tracking

Sentry

Performance

Vercel Analytics

Logs

Pino + Better Stack

Database Monitoring

MongoDB Atlas Metrics
16. Future Scalability
Microservice-ready architecture
WebSocket support for live listening sessions
Plugin-based AI provider system
Offline-first support with Service Workers
Progressive Web App (PWA)
Native Android/iOS apps via React Native or Flutter
Electron desktop application
Multi-language (i18n) support
AI recommendation engine using user embeddings
Collaborative playlists and real-time synchronization
17. Engineering Principles
Performance First: Optimize perceived speed before adding features.
Accessibility by Default: Build to WCAG AA standards from the start.
Composable Architecture: Small, reusable components and services.
Provider Agnostic AI: Never tie the app to a single AI vendor.
Privacy by Design: Encrypt sensitive data and minimize collection.
Mobile-First, Desktop-Perfect: Design for phones first, then enhance for larger screens.
Delight Through Motion: Every animation should improve understanding, not distract.
Recommended Next Documents

To make Chotify feel like a real startup product, I'd create these documents next, in order:

Software Requirements Specification (SRS) – Formal functional and non-functional requirements.
UI/UX Design System – Colors, typography, spacing, components, iconography, motion, and accessibility rules.
Information Architecture (IA) – User flows, navigation hierarchy, and sitemap.
Database Design Document (DDD) – ER diagrams, collection relationships, indexing strategy, and data lifecycle.
API Specification – OpenAPI/Swagger documentation for every endpoint.
Development Roadmap – Milestones, sprint planning, feature priorities, and release phases.

Together, these documents would give you a professional-level foundation before writing a significant amount of code.