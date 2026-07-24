# Chotify Quality Assurance & Testing Strategy
**Version:** 1.0.0  
**Status:** QA Implementation Guide  
**Core Frameworks:** Vitest + React Testing Library + Playwright + Axe  

---

## 1. Testing Framework Matrix

We implement a testing pyramid to verify frontend and backend behaviors before release:

| Test Class | Target Coverage | Framework Choice | Focus Area |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | > 85% functions | `Vitest` | Custom state hooks (Zustand), encryption/decryption keys. |
| **Component Tests**| Core UI components | `React Testing Library` | Button click states, volume sliders, track cards, prompt forms. |
| **Integration Tests**| API Gateway layers | `Supertest` | JWT auth sessions, encrypted proxy calls. |
| **E2E Tests** | Primary user paths | `Playwright` | Authentication redirects, queue list reordering, audio plays. |
| **Accessibility Tests**| WCAG AA compliance | `axe-core` | Keyboard focus order, aria roles. |
| **Visual Regression** | Theme tokens | `Playwright Screenshots` | Sand/Carbon canvas components, pixel alignments. |

---

## 2. Testing Specifications

### Accessibility (Axe Audits)
*   Automated audits are built into the Playwright pipeline using `@axe-core/playwright`.
*   All pages must return zero critical accessibility violations. Focus states and tab indexes are audited during component render tests.

### Visual Regression (Theme Verification)
*   Playwright captures screenshots of components (buttons, input fields, active player) under light and dark mode profiles.
*   Screenshots are compared against verified base images. Layout shifts or rendering changes trigger build warnings.

### E2E Integration (Audio Playback)
*   Playwright tests verify audio playback by tracking timeline values and listening for mock audio load events.
*   Tests check queue behaviors by dragging list elements in the sidebar and checking if the active track updates.

---

## 3. Deployment Release Checklist
A deployment to production requires all checkmarks to be passed:

*   [ ] **Test Suite Success:** All unit, integration, and E2E tests return green checkmarks.
*   [ ] **Accessibility Validation:** AXE score matches 100% compliance.
*   [ ] **Visual Validation:** Zero visual regressions detected.
*   [ ] **Security Audit:** Snyk packages audit check returns zero vulnerabilities.
*   [ ] **Database Migration:** Mongoose migrations have been run and verified.
*   [ ] **Sentry Monitoring Verification:** Sentry DSN configuration is active in the production environment variables.
