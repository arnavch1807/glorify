# Chotify Security Specification
**Version:** 1.0.0  
**Status:** Security Architecture Blueprint  
**Standard Compliance:** OWASP Top 10 / GDPR Readiness  

---

## 1. Authentication & Session Management

### JWT Token Lifecycles
*   **Access Token:** JSON Web Token (JWT) signed using RS256 algorithm. Expired after `15 minutes`. Sent via HTTP `Authorization: Bearer` headers.
*   **Refresh Token:** Secure cryptographically random token stored in database. Expired after `7 days`. Distributed to the client via an HTTP-Only, Secure, SameSite=Strict cookie to prevent Cross-Site Scripting (XSS) extraction.

### Session Lifecycle Management
*   **Token Rotation:** On every refresh request, the backend invalidates the previous refresh token and issues a new pair (Refresh Token Rotation) to mitigate token theft.
*   **Active Revocation:** User logout requests delete the refresh token from the database, clearing the client cookie.

---

## 2. Secrets & API Key Encryption

We implement the zero-exposure key proxy architecture defined in [trd.md#11-ai-provider-security-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/trd.md#11-ai-provider-security-architecture).

*   **Encryption Spec:** User API keys are encrypted at rest using AES-256-GCM.
*   **Secrets Storage:** Master encryption keys and API endpoints are loaded at runtime from environment variables, managed securely in production by HashiCorp Vault or AWS Secrets Manager.
*   **Database Hashing:** Password credentials are hashed using `bcrypt` with `12` salt rounds before database insertion.

---

## 3. OWASP Top 10 Protections

### Injection Prevention
All inputs are validated using Mongoose schemas and `Zod` validation middleware before execution. This prevents SQL, NoSQL, and command injection attacks.

### Cross-Site Scripting (XSS)
*   **Helmet headers:** Express servers mount the `Helmet` middleware to configure robust Content Security Policies (CSP), preventing inline script execution.
*   **Sanitization:** Text strings are sanitized via `DOMPurify` before rendering to block HTML injection.

### CSRF Protection
SameSite cookie policies are set to `Strict` on auth refresh routes, preventing unauthorized form actions from external domains.

---

## 4. Cloudinary & Storage Security
To prevent unauthorized downloads of public and generative tracks:
*   All audio file uploads use **Signed Upload Presets**, requiring a server-generated cryptographic signature.
*   Private user synthesis stems use **Cloudinary Private Delivery Profiles**, generating short-lived signed URLs (expiry: 1 hour) for streaming.

---

## 5. GDPR Readiness & Privacy
To comply with global privacy standards, Chotify includes two dedicated user workflows:
1.  **Right to Portability:** Users can download a JSON file of their account metadata, prompt history, and liked song history in Settings.
2.  **Right to be Forgotten:** A profile deletion request removes the user's records from the database, deletes their encrypted API keys, and schedules their generated audio files on Cloudinary for immediate deletion.
