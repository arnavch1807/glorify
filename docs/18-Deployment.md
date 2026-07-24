# Chotify Deployment & Infrastructure Specification
**Version:** 1.0.0  
**Status:** DevOps Deployment Blueprint  
**Target Cloud Architecture:** Vercel (Web) + Railway (Server) + MongoDB Atlas + Cloudflare (CDN)  

---

## 1. Environments Schema
We maintain four isolated environments to coordinate development and release cycles:

| Environment | Host Platform | Database Source | Purpose |
| :--- | :--- | :--- | :--- |
| **Development** | Localhost | Local MongoDB / Redis | Active coding, local component styling. |
| **Preview** | Vercel (Auto) | Staging Sandbox Atlas | Auto-deploys GitHub pull requests for visual review. |
| **Staging** | Railway Sandbox | Staging Sandbox Atlas | Verifies E2E tests and database migrations before release. |
| **Production** | Vercel / Railway | Production Mongo Cluster | Live public platform serving production traffic. |

---

## 2. CI/CD Deployment Pipeline

Our integration and deployment pipeline is automated via GitHub Actions:

```
[Developer Push / PR]
         │
         ├── Git Hooks Check (Lint, Formatting, Types)
         │
         ├── Run Unit & Component Tests (Vitest)
         │
         ├── Build Frontend & Backend Packages
         │
         ├── Run Integration & E2E Tests (Playwright)
         │
         └── Deploy Build Artifacts
              ├── Frontend to Vercel
              └── Backend to Railway
```

---

## 3. Environment Variables & Secrets Management
Variables are loaded into container environments at runtime. Sensitive values are encrypted:

### Web Application (`apps/web`)
*   `VITE_API_BASE_URL`: Pointer to backend API gateway (e.g. `https://api.chotify.com/api/v1`).
*   `VITE_APP_ENV`: Current environment tag (`production`, `staging`, `development`).

### Backend Application (`apps/server`)
*   `MONGODB_URI`: Database connection string.
*   `REDIS_URI`: Cache storage connection string.
*   `JWT_SECRET_KEY`: Sign validation key for authentication sessions.
*   `CLOUDINARY_URL`: API keys for media uploads, configured as specified in [docs/13-Security.md#4-cloudinary--storage-security](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/13-Security.md#4-cloudinary--storage-security).

---

## 4. Rollback Protocols
If critical issues are detected post-release, rollbacks can be executed immediately:
*   **Web Frontend (Vercel):** Single-click rollback in the Vercel dashboard. Instantly redirects router traffic back to the previous deployment.
*   **Backend Application (Railway):** Rollback to the previous stable release commit tag in the Railway management console, with automatic database migration rollbacks executed using `migrate-mongo down`.
