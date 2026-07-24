# Chotify Architecture Decision Records (ADR)
**Version:** 1.0.0  
**Status:** Unified Technical Log  

---

## ADR-01: React 19 + Vite (Frontend Application Builder)
*   **Status:** Approved.
*   **Context:** Chotify requires a fast, lightweight frontend web builder with hot module replacement (HMR) to support real-time audio components and custom waveforms.
*   **Decision:** Deploy React 19 built via Vite.
*   **Alternatives Considered:** Next.js, standard Webpack config.
*   **Trade-offs & Consequences:** Vite reduces build compile delays to under 200ms. React 19 concurrent features allow background rendering of audio nodes without blocking user inputs. However, we bypass server-side rendering (SSR), which is acceptable since Chotify is a dynamic web dashboard.
*   **Future Review Date:** January 2027.

---

## ADR-02: Tailwind CSS v4 (Styling Engine)
*   **Status:** Approved.
*   **Context:** The visual design matches Nothing OS and Linear. We need to implement design tokens cleanly while keeping CSS bundles small.
*   **Decision:** Adopt Tailwind CSS v4 with a CSS-first `@theme` syntax.
*   **Alternatives Considered:** Tailwind v3 (with JavaScript config exports), CSS Modules.
*   **Trade-offs & Consequences:** Tailwind v4 moves theme overrides into standard CSS, reducing JS parsing time and compiler dependencies. The design system is mapped via CSS custom variables, preventing code duplication.
*   **Future Review Date:** November 2026.

---

## ADR-03: MongoDB Atlas + Mongoose (Primary Database)
*   **Status:** Approved.
*   **Context:** Audio tracks, generated history, and playlists use flexible, nested schemas.
*   **Decision:** MongoDB Atlas as the primary document store, managed via the Mongoose ODM.
*   **Alternatives Considered:** PostgreSQL, MySQL.
*   **Trade-offs & Consequences:** NoSQL documents fit the dynamic track structures of AI-synthesized music. We accept that relational constraints must be validated at the Mongoose application layer rather than the database compiler level.
*   **Future Review Date:** June 2027.

---

## ADR-04: Express.js on Node.js (Backend Framework)
*   **Status:** Approved.
*   **Context:** The backend functions primarily as an API gateway proxy to handle authentication, database queries, and AI provider key handshakes.
*   **Decision:** Express.js running on Node.js.
*   **Alternatives Considered:** NestJS, Fastify.
*   **Trade-offs & Consequences:** Express provides a lightweight router for proxies. We avoid the boilerplate of NestJS.
*   **Future Review Date:** March 2027.

---

## ADR-05: Cloudinary (Media Hosting Engine)
*   **Status:** Approved.
*   **Context:** Audio files, stems, and covers must be stored and served securely with minimal latency.
*   **Decision:** Standardize all cloud uploads on Cloudinary, as specified in [prd.md#25-tech-stack](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/prd.md#25-tech-stack).
*   **Alternatives Considered:** AWS S3 + CloudFront, Firebase Storage (Deprecated).
*   **Trade-offs & Consequences:** Cloudinary dynamically handles audio byte-range requests and image optimizations. We pay a monthly premium, but save engineering hours spent configuring transcoders and CDN parameters.
*   **Future Review Date:** December 2026.

---

## ADR-06: Zustand (Global Client State)
*   **Status:** Approved.
*   **Context:** Real-time playback position, timeline scrubs, volume dials, and track queues require low-overhead state management.
*   **Decision:** Zustand for global client state.
*   **Alternatives Considered:** Redux Toolkit, React Context API.
*   **Trade-offs & Consequences:** Zustand provides a minimal, store-based state system that prevents unnecessary React re-renders. It lacks Redux's advanced developer tools, but is significantly faster to write and compile.
*   **Future Review Date:** October 2026.

---

## ADR-07: TanStack Query / React Query (Server State Cache)
*   **Status:** Approved.
*   **Context:** Database records (songs, user libraries, playlist items) need automated caching, request deduplication, and invalidation rules.
*   **Decision:** TanStack Query for server state management.
*   **Alternatives Considered:** Custom `useEffect` state fetchers.
*   **Trade-offs & Consequences:** Automates database caching, stale-while-revalidate configurations, and mutation invalidation hooks.
*   **Future Review Date:** October 2026.

---

## ADR-08: Provider-Agnostic AI Proxy Architecture (AI Integration)
*   **Status:** Approved.
*   **Context:** Chotify must support multiple AI music models (Suno, Udio, Gemini, OpenAI) and allow users to connect personal API credentials.
*   **Decision:** Implement the zero-exposure key proxy architecture defined in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).
*   **Alternatives Considered:** Direct Suno integration, client-side API calls.
*   **Trade-offs & Consequences:** Secures API credentials and prevents vendor lock-in. However, we must build and maintain custom proxy integrations for each provider API.
*   **Future Review Date:** November 2026.
