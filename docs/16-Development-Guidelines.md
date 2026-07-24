# Chotify Development Guidelines
**Version:** 1.0.0  
**Status:** Engineering Standards Guide  
**Principles:** Clean Code / SOLID / Provider Agnostic Architecture  

---

## 1. Core Architecture Principles
*   **Separation of Concerns:** Business logic belongs in backend services or custom React hooks. React components should focus on rendering layouts, styling, and transitions.
*   **YAGNI (You Aren't Gonna Need It):** Avoid adding abstractions or helper packages until a feature requirement demands them.
*   **Provider Agnostic AI:** AI tools must run through the proxy gateway using generic interfaces, as specified in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).

---

## 2. Code Quality & Standards

### Naming Conventions
*   **Variables/Functions:** camelCase (e.g. `const songQueue = []`).
*   **React Components:** PascalCase (e.g. `const AudioTimelineSlider = () => {}`).
*   **Database Collections:** CamelCase plural names (e.g. `Users`).
*   **Files:** kebab-case for assets and docs, PascalCase for React components, camelCase for helper modules.

### Error Handling
*   **Backend Routes:** Async Express routes must run inside try/catch blocks or use an async handler wrapper. Uncaught exceptions return a standard RFC-7807 error format, as specified in [docs/10-API-Specification.md#error-responses](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/10-API-Specification.md#error-responses).
*   **Frontend UI:** Main views (e.g., AI Studio, Music Player) are wrapped in React `Error Boundary` modules to prevent client crash lockups.

### Structured Logging
*   **Backend:** Log events using the `Pino` structured JSON logger.
*   *Rule:* Sensitive customer data (e.g., API keys, account passwords, prompt inputs) must be scrubbed from logs before write-out.
*   **Frontend:** Log issues to the developer telemetry console, enabled dynamically viaSettings.

---

## 3. Dependency & Code Boundaries
*   **Minimize Dependencies:** Avoid importing helper libraries for tasks that can be solved using standard Web API specifications (e.g. use standard browser `fetch` instead of `axios`).
*   **Import Boundaries:**
    *   Shared UI components (`packages/ui`) must never import files from application folders (`apps/web`).
    *   State stores (`store/`) must never import layout view logic.

---

## 4. Pull Request Expectations
1.  **Scope Control:** Pull requests should focus on a single task, containing fewer than 400 lines of changes.
2.  **Verification:** PR descriptions must document how the changes were verified, including screenshots of UI modifications.
3.  **CI Validation:** PRs are locked from merging until unit, integration, and E2E test suites pass.
4.  **Review Check:** Requires approval from at least one engineer.
