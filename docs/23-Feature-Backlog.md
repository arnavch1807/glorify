# Chotify Feature Backlog
**Version:** 1.0.0  
**Status:** Backlog Hub  
**Prioritization Framework:** MoSCoW (Must, Should, Could, Won't)  

---

## 1. Feature Prioritization Matrix

We group product features to ensure structured delivery across development sprints:

### Must Have (MVP Phase 1 Core)
*   **Authentication Hub:** JWT register, login, refresh tokens, secure cookies.
*   **Audio Streaming Engine:** Cloud streaming via Cloudinary, Timeline seek controls, persistent player footer.
*   **Playlists Manager:** Create, edit, and populate custom playlists.
*   **API Configuration Panel:** Save and validate API keys for Suno, Udio, Gemini, and OpenAI.
*   **Sand/Carbon Layout System:** Responsive CSS-first framework built to design system standards.

### Should Have (Alpha Phase 2 Generative)
*   **AI Composer Tab:** Text prompt input, parameter sliders (BPM, key, scale), synthesis progress.
*   **Preview Stems Viewer:** Download separate stems from generated audio.
*   **Prompt History Log:** Monospace catalog tracking user parameters and prompts.
*   **Cover Art Generator:** Generative blueprint designs for playlist covers.

### Could Have (Beta Phase 3 Performance)
*   **AI Remix Deck:** Upload source tracks, apply style presets (Synthwave, Lofi), and output modified files.
*   **Offline Caching:** Save tracks dynamically into browser IndexedDB.
*   **Time-Synced Lyrics:** Vertical lyrics panel scrolling in sync with track timelines.
*   **Social Playlist Sharing:** Share custom playlist configurations.

### Won't Have (Post v1.0 Horizon)
*   **Collaborative Sync Sessions:** Real-time synchronized listening rooms using WebSockets (Reserved for v2.0).
*   **Native Wearable Interfaces:** Watch OS and Wear OS extensions (Reserved for Phase 5).
*   **Car Mode Layout:** High-contrast driving interface.

---

## 2. Experimental AI & Plugin Backlog
*   **Semantic Prompt search:** Search track catalogs using natural language descriptions (e.g. "somber synth for a rainy day").
*   **Plugin AI Provider Registry:** Third-party developer API allowing custom local synthesis models to register with Chotify's proxy gateway.
*   **Dynamic Visualizer Widgets:** Canvas widgets reacting to waveform frequencies in real time.
