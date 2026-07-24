# Chotify Development Checklist
**Version:** 1.0.0  
**Status:** Master Engineering Checklist  

---

## 1. Project Bootstrap & Infrastructure
- [ ] Initialize repository as a pnpm monorepo workspace.
- [ ] Configure `pnpm-workspace.yaml` packages directory.
- [ ] Create apps and packages folders (`apps/web`, `apps/server`, `packages/ui`, `packages/hooks`, `packages/types`).
- [ ] Setup `tsconfig.json` configurations for typescript compiler in workspaces.
- [ ] Setup root `.prettierrc` formatting configs.
- [ ] Setup ESLint configuration profiles.
- [ ] Setup linting commit hooks using `husky` and `lint-staged`.
- [ ] Create GitHub Actions CI build pipelines (`.github/workflows/ci.yml`).

## 2. Database Schema Configuration
- [ ] Deploy Mongoose schema for `Users` collection, including index on `email`.
- [ ] Deploy Mongoose schema for `Songs` collection, including text index on `title`, `artist`, and `prompt`.
- [ ] Deploy Mongoose schema for `Playlists` collection, including `songs` objectId array reference.
- [ ] Deploy Mongoose schema for `APIKeys` collection, including validation status properties.
- [ ] Deploy TTL index on `Notifications` collection (expires in 30 days).
- [ ] Configure `migrate-mongo` configuration files.

## 3. Authentication & User API
- [ ] Deploy JWT signature keys (RS256) environment configurations.
- [ ] Implement password hashing logic using `bcrypt`.
- [ ] Implement signup controller validation scripts (`POST /api/v1/auth/register`).
- [ ] Implement signin controller validation scripts (`POST /api/v1/auth/login`).
- [ ] Implement refresh token rotation middleware with HTTP-Only cookies (`POST /api/v1/auth/refresh`).
- [ ] Implement logout controller removing refresh key records (`POST /api/v1/auth/logout`).
- [ ] Implement profile verification API endpoint (`GET /api/v1/auth/profile`).

## 4. UI Layout & Component Library
- [ ] Install Tailwind CSS v4 in `apps/web`.
- [ ] Set design tokens configuration inside standard styles sheet `@theme` directive, as specified in [docs/03-Design-System.md#31-tailwind-theme-tokens](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#31-tailwind-theme-tokens).
- [ ] Build layout container shell (collapsible sidebar navigation drawer and top header bar).
- [ ] Build button variants (Primary, Secondary, AI Accent highlight, Play/Pause circular).
- [ ] Build inputs components (Standard input text, search filter search bar, Prompt editor textarea).
- [ ] Build card modules (Song card with synth badge, circular Artist card, Album compilation card).

## 5. Music Player Engine (Zustand & Howler)
- [ ] Build global player store `usePlayerStore` (Zustand).
- [ ] Implement Howler.js configuration wrapper, forcing `html5: true` streaming range requests.
- [ ] Implement playback controls (Play, Pause, Skip next, Skip previous).
- [ ] Implement volume slider mapping updates to global player volume states.
- [ ] Implement active timeline scrub progress bar.
- [ ] Build persistent player footer dock UI component.
- [ ] Build expanded player overlay modal container.

## 6. Library, Playlists & Search
- [ ] Implement search query validation controllers (`GET /api/v1/songs`).
- [ ] Build search input filter layout (BPM, key signature, standard vs AI source).
- [ ] Implement playlist creation endpoint (`POST /api/v1/playlists`).
- [ ] Implement playlist retrieval endpoint (`GET /api/v1/playlists/:id`).
- [ ] Build playlist drag-to-reorder widget, updating the queue array layout.
- [ ] Build liked songs list panel.

## 7. AI Studio Module
- [ ] Implement encrypted AES-256-GCM write schemas for provider keys (`POST /api/v1/apikey`).
- [ ] Build Settings Key input panel, including validation status check indicators.
- [ ] Implement backend proxy route decrypting keys in-memory (`POST /api/v1/ai/compose`).
- [ ] Implement task polling controller status checks (`GET /api/v1/ai/tasks/:taskId`).
- [ ] Build AI Composer UI page (Prompt editor panel, parameters knobs).
- [ ] Build AI Cover Art fractal generator canvas.

## 8. Telemetry, Monitoring & Deployment
- [ ] Install `Pino` structured JSON logger on Express backend app.
- [ ] Configure Sentry credentials in Vite frontend build processes.
- [ ] Implement backend `/healthz` check routes monitoring Mongo, Redis, and Cloudinary.
- [ ] Configure GitHub Actions build pipelines verifying tests before deployment.
- [ ] Configure Vercel frontend deployment settings.
- [ ] Configure Railway backend server settings.
- [ ] Build user database profile JSON export workflow.
