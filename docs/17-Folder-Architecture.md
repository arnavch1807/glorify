# Chotify Monorepo Folder Architecture
**Version:** 1.0.0  
**Status:** Repository Structural Directory  
**Repository Pattern:** Monorepo (pnpm Workspaces)  

---

## 1. Monorepo Structural Map

The Chotify codebase is structured as a monorepo to isolate frontend pages, backend APIs, and shared services:

```
chotify/
├── apps/
│   ├── web/                     # React 19 Frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/      # View-specific layout components
│   │   │   ├── pages/           # Route sheets (Home, Explore, AI Studio)
│   │   │   ├── store/           # Zustand store instances
│   │   │   ├── styles/          # Tailwind CSS entry files
│   │   │   └── main.tsx         # Frontend mount file
│   │   └── package.json
│   │
│   └── server/                  # Node.js Express.js Backend
│       ├── src/
│       │   ├── controllers/     # Route logic handlers
│       │   ├── middleware/      # Auth, proxy, validation gateways
│       │   ├── models/          # Mongoose database schemas
│       │   ├── services/        # Third-party API handlers (Suno/Cloudinary)
│       │   └── app.ts           # Server setup file
│       └── package.json
│
├── packages/                    # Shared Node/React Modules
│   ├── ui/                      # Shared component library (Design tokens)
│   ├── hooks/                   # Reusable React hooks
│   ├── config/                  # Shared tooling configurations (ESLint, TS)
│   ├── types/                   # Shared TypeScript interface models
│   └── utils/                   # Shared helper utilities
│
├── docs/                        # Project documentation sets
├── scripts/                     # Deployment and build automation scripts
├── package.json                 # Monorepo root package file
└── pnpm-workspace.yaml          # Monorepo workspace configuration
```

---

## 2. Shared Packages & Core Workspaces

### `packages/ui`
Contains core layout components built according to the specifications in [docs/07-Component-Library.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/07-Component-Library.md). Contains no application business logic or API configurations.

### `packages/hooks`
Shared React hooks.
*   `useAudioPlayer`: Integrates the Howler.js engine, managing timeline states.
*   `useKeyPress`: Standardizes keyboard shortcuts, matching accessibility specifications.

### `packages/types`
Saves standard data definitions, database entities, and API payloads. Shared between `apps/web` and `apps/server` to keep data models aligned.

---

## 3. Workspace Import Boundaries

To prevent dependency loops and build issues:

*   **Rule 1:** Code in `packages/ui` or `packages/hooks` must never import modules from `apps/web` or `apps/server`.
*   **Rule 2:** `apps/web` can import shared configurations and utilities from `packages/ui`, `packages/hooks`, `packages/types`, and `packages/utils`.
*   **Rule 3:** The backend application (`apps/server`) can only import from `packages/types`, `packages/config`, and `packages/utils` (React UI and React hooks are blocked).
