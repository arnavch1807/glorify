# Chotify Engineering Coding Standards
**Version:** 1.0.0  
**Status:** Engineering Standards Guide  
**Language Profiles:** TypeScript (Strict) + React 19 + Node.js (Express)  

---

## 1. TypeScript Rules
*   **Strict Mode:** Enforced in all workspace `tsconfig.json` configurations.
*   **Type Assertions:** We avoid raw type assertions (`as Type`) or the `any` type keyword. Use explicit typings or `unknown` combined with type guard checks instead.
*   **Data Models:** Use TypeScript `interfaces` rather than `type` aliases for extensible data models.
*   *Example:*
    ```typescript
    interface Track {
      id: string;
      title: string;
      artist: string;
      duration: number;
    }
    ```

---

## 2. React Guidelines
*   **Functional Style:** React components must be written as functional components using React Hooks.
*   **Props Management:** Component props must be typed explicitly using TS interface declarations. We avoid inline destructuring of props if it reduces readability.
*   **State Isolation:** Component local state must be scoped to the rendering component. Global states are managed via Zustand stores as documented in [docs/12-State-Management.md#2-store-specifications](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/12-State-Management.md#2-store-specifications).
*   **Absolute Imports:** Resolve import paths using the `@/` prefix, referencing root project sources. Do not use nested relative paths (`../../components`).

---

## 3. Node.js & Express Standards
*   **Architecture Pattern:** Follow the Controller-Service-Repository pattern.
    *   *Controllers:* Handle HTTP requests, parsing parameters and calling services.
    *   *Services:* Run business logic, orchestrating calls to repositories and AI gateway APIs.
    *   *Repositories:* Database read/write queries.
*   **Input Validation:** Request body schemas must be validated using `Zod` schemas before hitting controllers.
*   **Asynchronous Routes:** Express controller actions must use async-wrapper middlewares to catch uncaught promise rejections and pass them to global handlers.

---

## 4. Code Formatting & Linting
*   **Code Formatter:** Code formatting must conform to the project's `.prettierrc` specifications:
    *   `singleQuote: true`
    *   `trailingComma: 'all'`
    *   `tabWidth: 2`
    *   `semi: true`
*   **Linter Rules:** ESLint is configured to run during git commit hooks and build processes. Any lint warnings or errors will block the build.

---

## 5. Comments & Documentation Standards
*   **TSDoc/JSDoc:** Exported helper functions and services must include TSDoc descriptions detailing parameters and return types.
*   **No Code Comments:** We avoid commenting on *what* the code does; write self-documenting code with clear naming. Comments are reserved for explaining *why* a complex implementation decision exists.
