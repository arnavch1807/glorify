# Chotify Performance Specifications
**Version:** 1.0.0  
**Status:** Engineering Performance Blueprint  
**Performance Budget Target:** Web Vitals Green Zone  

---

## 1. Core Performance Budgets
We enforce strict performance thresholds to ensure the interface remains responsive during audio streaming and rendering operations:

| Metric | Target Budget | Measurement Condition |
| :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | < 1.0 seconds | High-speed 3G connection |
| **Time to Interactive (TTI)** | < 2.0 seconds | Desktop & standard mobile |
| **First Input Delay (FID)** | < 100 milliseconds | Desktop & standard mobile |
| **Cumulative Layout Shift (CLS)** | < 0.05 | Layout changes, loading states |
| **Audio Start Time (Time-to-Play)** | < 500 milliseconds | Stream start on play trigger |

---

## 2. Audio Streaming & Buffering Spec
Audio streams are processed dynamically to ensure uninterrupted playback:
*   **Chunked Audio Streaming:** Audio files are hosted on Cloudinary and delivered in `128KB` chunk increments using HTTP range requests (`Accept-Ranges: bytes`).
*   **Howler.js configuration:** Playback instances must use the `html5: true` flag. This enables HTML5 Audio streams, allowing the browser to begin playing the audio chunks before the file download finishes, avoiding buffering delays.
*   **Dynamic Bitrate Adjustment:** If buffer warning events trigger (buffer empty duration exceeds 1.5 seconds), the engine reduces the request target format from 320kbps to 128kbps for the remaining stream.

---

## 3. Asset Optimization & Lazy Loading

### Image Delivery
*   Album cover art and user profile headshots are resized dynamically using Cloudinary transform URLs.
*   *Format:* Deliver images in modern formats (`webp` or `avif`), matching exact responsive grid dimensions.

### Code & Bundle Splitting
*   **Dynamic Imports:** Heavy dashboard panels, such as the AI Studio and parameter EQ consoles, are lazy loaded using `React.lazy()` or Vite dynamic imports.
*   **Asset Cache Headers:** Static files (CSS, JS, WebP icons) include caching headers: `Cache-Control: public, max-age=31536000, immutable`.

### List Virtualization
Tracklists or generation logs that exceed 100 items must use virtualized list rendering (e.g. `react-window` or `react-virtualized`). This keeps only visible track rows mounted in the DOM, preventing memory leaks and scroll stuttering.

---

## 4. Memory Management
To prevent memory leaks during extended listening sessions:
*   Active Howler.js audio instances must be unmounted and destroyed (`sound.unload()`) during component unmount cycles.
*   Blob URLs created for offline audio playback must be revoked immediately using `URL.revokeObjectURL()` once the audio stream is loaded into the engine.
