# Chotify Animation System
**Version:** 1.0.0  
**Status:** Motion Specification & Implementation Bible  
**Target Platform:** Web / Framer Motion / CSS Transitions  

---

## 1. Motion Philosophy
Motion in Chotify is treated as a core physical property of the interface. Animations must never exist purely for decoration; their purpose is to establish visual structure, demonstrate spatial relationships, and provide clear feedback on user actions.

Our motion design is inspired by high-end audio engineering gear, where knobs have weight, switches snap into place, and elements respond with natural inertia.

---

## 2. Animation Tokens

All animation token values (durations, spring tension variables, and easing curves) are defined in [docs/03-Design-System.md#14-motion-guidelines](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#14-motion-guidelines) as the single source of truth. Refer to that section for exact physics coefficients.

*   **Duration Scales:** `--chotify-duration-instant`, `--chotify-duration-fast`, `--chotify-duration-normal`, `--chotify-duration-slow`, `--chotify-duration-deliberate`.
*   **Spring Configurations:** `spring-snappy`, `spring-standard`, `spring-heavy`.
*   **Easing Curves:** `ease-tactile` and `ease-in-out-breathing`.

---

## 3. Transition Specifications

### Page Transitions
*   **Behavior:** When switching views, the incoming page translates slightly on the Y-axis (from `20px` to `0px`) and fades in from `0` to `1` opacity.
*   **Curve:** `spring-standard`.
*   **Duration:** 200ms.

### Card Animations
*   **Hover State:** Cards scale up to `1.01` and transition their border colors to `Platinum-50` (Dark Mode) or `Ink-950` (Light Mode).
*   **Pressed State:** Clicks scale the card down to `0.98` instantly. On release, the card springs back to default scale using the `spring-snappy` preset.

### Navigation Panel Animations
*   **Sidebar Slide:** The sidebar slides in from the left on the X-axis (`-100%` to `0%`). As it slides in, the main content area scales down to `0.98` on a spring path to create visual depth.
*   **Curve:** `spring-heavy`.
*   **Mobile Bottom Tabs:** Transitions between bottom tabs use instant opacity crossfades (120ms) to keep navigation feeling fast and responsive.

### Player Expansion
*   **Behavior:** The persistent music player dock at the bottom of the screen expands to full screen. The cover art image scales from `48px` to `320px`, shifting to the center, while playback controls rotate 90 degrees as they move to their primary layouts.
*   **Curve:** `spring-heavy`.

### Shared Element Transitions
*   When a user clicks on an album card, the card container's borders morph directly into the detail page layout. The artwork scales from the card dimensions to the detail page header size while its position coordinates interpolate smoothly along a spring path.

---

## 4. Micro-Interactions & Context Actions

### Lyrics Synchronization
*   **Highlight Active Line:** The current lyric line transitions from a muted gray to bright white (`opacity: 1`), scaling up slightly to 1.05x. Inactive lines fade back to gray.
*   **Auto-Scroll Offset:** The text container scrolls to center the active lyric line in the viewport.
*   **Curve:** `spring-standard`.

### Queue Reordering
*   **Drag State:** Dragging a queue item scales it to `1.02` and updates its shadow to `shadow-md`. Sibling queue items slide dynamically along the Y-axis to clear a path.
*   **Curve:** `spring-snappy`.

### AI Studio Generation Indicators
*   **Prompt Pulse:** Submit buttons trigger the glowing `aura-pulse` animation on the prompt container.
*   **Pulse Curve:** Looping `ease-in-out-breathing` curve with a 2000ms period.
*   **Dot-Matrix Progress:** Loading indicators use dot-matrix sweeps that scan from left to right.

### Skeletons Shimmer
*   **Behavior:** Skeletons pulse their background color between `Sand-100` and `Sand-200` (Light Mode) or `Carbon-900` and `Carbon-800` (Dark Mode).
*   **Animation:** Opacity shifts from `0.4` to `0.8` using a looping `ease-in-out` curve over a 1500ms cycle.

---

## 5. Input & Gesture Animations

### Gestures (Mobile Device Actions)
*   **Queue Swipe:** Swiping a song item to the right translates it along the X-axis. The item fades out, and sibling tracks below spring upward to fill the gap.
*   **Dismiss Drawer:** Swiping down on the active player modal tracks the finger position with zero lag. If the swipe exceeds a 150px threshold, the drawer slides off the screen; otherwise, it snaps back into place.

### Mouse Hover Transitions
*   **Metadata List Rows:** Hovering a song row translates it +4px on the X-axis and reveals the inline play icon.
*   **Control Knobs:** Hovering virtual EQ dials reveals a tick marker that rotates to track cursor inputs.

### Timeline Scroll Decays
*   List containers use inertial scrolling with a rubber-band spring effect at boundaries.

### Progressive Loading Indicators
*   A 1px progress line runs across the top of the viewport during background updates. Uses the Aura Gold color.

---

## 6. Performance & Accessibility Rules

### Performance Safeguards
1.  **CSS Transform Promoted Layers:** Animations must be restricted to CSS properties that don't trigger layout repaints: `transform` (scale, translate, rotate) and `opacity`.
2.  **Separate Playback Threads:** All audio engine calculations run on a separate thread from UI animations to prevent visual stutters during playback.

### Reduced Motion Settings
*   When users enable `prefers-reduced-motion` in their browser preferences, spring movements, rotations, and translations are disabled. The UI falls back to instant layouts or simple fades:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
}
```
