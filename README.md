# 🎵 Chotify — AI-Native Music Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0.0-blue.svg)](#)
[![pnpm](https://img.shields.io/badge/package--manager-pnpm--v9-orange.svg)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/built--with-Turborepo-red.svg)](https://turbo.build/)

Chotify is an AI-native music platform that seamlessly combines high-fidelity music streaming, AI-driven music generation, smart playlist curation, AI remixing, and personalized recommendations into a single, unified experience. 

Unlike traditional streaming services that lock you into specific algorithms, Chotify empowers users by letting them connect their own AI provider API keys (OpenAI, Suno, Udio, Gemini, etc.). This ensures unlimited creative possibilities and full user ownership over generated content, while keeping the application completely future-proof.

---

## ✨ Key Product Philosophy

* **Design First:** Every interaction is crafted to feel premium, tactile, and calm—inspired by the design languages of ColorOS, Apple Music, and modern operating systems. It features a curated **Sand & Carbon** canvas with **Aura Gold** accents.
* **AI-First Integration:** AI is built into the core experience (recommendations, playlist transitions, cover art, and music composition), not just tacked on as an afterthought.
* **User Ownership:** Connect your own API keys for AI music generation, maintaining full control over your generation credits and data.
* **Emotion-Driven UI:** Visualizes the emotional tone of music using fluid motion profiles, adaptive coloring, and elegant typography.

---

## 🏗️ Monorepo Architecture

This project is structured as a monorepo managed with **pnpm workspaces** and **Turborepo** for optimal build caching and developer workspace performance:

```
chotify-monorepo/
├── apps/
│   ├── web/          # React + Vite + TailwindCSS v4 + Framer Motion frontend
│   └── server/       # Node.js + Express + MongoDB backend api server
├── packages/
│   ├── config/       # Shared tooling configurations (ESLint, Prettier, TS config)
│   ├── hooks/        # Shared custom React hooks
│   ├── types/        # Unified TypeScript types & schemas
│   ├── ui/           # Shared premium UI components (buttons, player, sliders, modals)
│   └── utils/        # Shared helper utilities (formatters, calculations, validation)
└── docs/             # Comprehensive technical, architectural, and design docs
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, Framer Motion, Zustand, TanStack Query |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Redis (Caching), JWT Auth |
| **Integrations** | Cloudinary (Audio/Image Asset Hosting), OpenAI, Suno, Udio, Gemini APIs |
| **Tooling** | Turborepo, pnpm workspaces, ESLint, Prettier, commitlint |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** `>= 18.0.0`
- **pnpm** `>= 9.0.0` (Run `npm i -g pnpm` if you don't have it)
- **MongoDB** and **Redis** (running locally or accessible via URI)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arnavch1807/glorify.git
   cd glorify
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Environment Configuration

Create `.env` files for both the frontend and backend applications:

#### Frontend (`apps/web/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (`apps/server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chotify
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Running Locally

To run all applications and packages in development mode simultaneously:

```bash
pnpm dev
```

This runs the React web app and the Express API server concurrently with hot reloading.

### Production Build

To build all apps and packages in the workspace:

```bash
pnpm build
```

---

## 📜 Coding and Design Guidelines

* Detailed specifications for components, animations, database schemas, and API design are located in the [docs/](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs) folder.
* **Coding Standards:** Refer to [docs/21-Coding-Standards.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/21-Coding-Standards.md) for style rules.
* **Design System & Tokens:** Refer to [docs/03-Design-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md) and [docs/06-Design-Tokens.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/06-Design-Tokens.md).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
