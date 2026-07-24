# Chotify Component Library
**Version:** 1.0.0  
**Status:** UI Development Specification  
**Target Platform:** Web / Desktop & Mobile React  

---

## Introduction
This document defines every reusable user interface component in the Chotify application. Frontend developers and designers must follow these specifications to build UI components consistently.

All component layouts, colors, and sizing configurations are locked to the design tokens in [docs/06-Design-Tokens.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/06-Design-Tokens.md) and use the state specifications defined in [docs/04-Information-Architecture.md#21-application-state-architecture](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/04-Information-Architecture.md#21-application-state-architecture).

---

## 1. Action Components (Buttons)

### Reusable Button Component
*   **Purpose:** Allow users to execute primary, secondary, and generative actions.
*   **Variants:**
    1.  `Primary:` Solid high-contrast switch (`Sand-50` text on `Ink-950` background for Light; `Carbon-950` text on `Platinum-50` background for Dark).
    2.  `Secondary:` Minimalist outlined border block (`1px` border matching theme layout tokens).
    3.  `AI Accent:` Active synthesis trigger (`Aura Gold` background with glowing drop shadow).
    4.  `Play/Pause:` Circular control (`radius-full`) with central icon placement.
*   **Properties:**
    *   `disabled` (Boolean) - Reduces opacity to 0.4, locks mouse triggers.
    *   `loading` (Boolean) - Replaces content labels with monospaced progress text `[...]`.
    *   `icon` (ReactNode) - Optional icon block aligned to label on the left.
*   **States:** Default, Hover, Focused, Pressed, Loading, Success, Error, Disabled. Refer to the matrix in [docs/03-Design-System.md#39-component-state-matrix](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#39-component-state-matrix).
*   **Accessibility:** Must support keyboard `Enter` / `Space` execution. Focus outlines are highlighted in Aura Gold.
*   **Animation:** Scales down to `0.98` instantly on press, returning with `spring-snappy` upon release.
*   **Usage Rules:**
    *   *Do* use the `AI Accent` variant exclusively for triggers that initialize audio generation.
    *   *Don't* use multiple `Primary` variant buttons within the same container block.

---

## 2. Input Components

### Text & Search Input
*   **Purpose:** Capturing text queries, user profile edits, and key inputs.
*   **Variants:**
    1.  `Standard Input:` Single line form field.
    2.  `Search Input:` Input with an integrated left search icon and right clear button.
    3.  `AI Prompt Area:` Multi-line text field using `JetBrains Mono` typography.
*   **Properties:**
    *   `placeholder` (String) - Standard hint placeholder text.
    *   `error` (Boolean) - Toggles error layout borders and shows diagnostic logs.
*   **States:** Default, Hover, Focused, Disabled, Error.
*   **Accessibility:** Focus transitions dynamically using the `Tab` sequence. Includes associated `<label>` references.
*   **Animation:** Focus states smoothly transition the border highlights to `Aura-Gold` over 120ms.
*   **Usage Rules:**
    *   *Do* display monospace character counters in `AI Prompt Areas`.
    *   *Don't* use fuzzy shadows on active focus inputs; use a solid 1px border.

---

## 3. Display & Collection Cards

### Content Cards
*   **Purpose:** Display playlists, albums, and songs in structured grids.
*   **Variants:**
    1.  `Song Card:` Displays small cover art, song title, artist, source indicator, and action triggers.
    2.  `Artist Card:` Circular card layout (`radius-full`) displaying artist headshot and follower metrics.
    3.  `Album Card:` Square card displaying album compilation listings.
    4.  `Playlist Card:` Grid box displaying playlist items.
    5.  `Queue Item:` High-density list item row with drag handles.
*   **Properties:**
    *   `source` (Enum: `standard` \| `synth`) - Controls visibility of the `[ SYNTH ]` prompt label.
    *   `active` (Boolean) - Highlights the active track playing in the player.
*   **States:** Default, Hover, Pressed, Active, Disabled, Skeleton.
*   **Accessibility:** Screen readers vocalize card elements: "Song: [Title] by [Artist]. Click to play."
*   **Animation:** Cards scale up by 1.01x on hover using `spring-standard`.
*   **Usage Rules:**
    *   *Do* show prompt seed keys on `synth` variants of `Song Cards`.
    *   *Don't* overlay text descriptions directly on cover art; place text in columns below.

---

## 4. Navigation Components

### Sidebar & Bottom Nav
*   **Purpose:** Main navigation layout controllers.
*   **Variants:**
    1.  `Sidebar Navigation (Desktop):` Vertical list containing group categories.
    2.  `Bottom Navigation Bar (Mobile):` Compact tab bar featuring four primary actions.
    3.  `Breadcrumb Top Nav:` In-page navigation helper path.
*   **States:** Default, Active Link, Hover.
*   **Accessibility:** Sidebar has a landmark role of `navigation`. Tab bar links include explicit button text.
*   **Animation:** Slide panels move along coordinates via `spring-heavy`.
*   **Usage Rules:**
    *   *Do* hide text labels on bottom tabs if the screen sizes down past 320px (`xs`).
    *   *Don't* add dropdown submenus inside the sidebar navigation; layout depth is capped at 3 tiers.

---

## 5. Feedback & Overlay Components

### Modals, Dialogs & Toasts
*   **Purpose:** Focus user attention, confirm tasks, and show status updates.
*   **Variants:**
    1.  `Modal Window:` Centered card overlay block with backdrop layer.
    2.  `Dialog confirmation:` Compact popup demanding prompt verification.
    3.  `Toast notification:` Small status notification alert.
*   **Properties:**
    *   `severity` (Enum: `success` \| `warning` \| `error` \| `info` \| `ai`) - Sets background and border styles.
*   **States:** Default, Entry, Exit.
*   **Accessibility:** Focus traps inside modals, preventing keyboard escape. Backdrop clicks close overlays.
*   **Animation:** Modals scale up from `0.95` to `1.0` combined with fade-in over 200ms.
*   **Usage Rules:**
    *   *Do* auto-close toasts after 4 seconds, except for processing alerts.
    *   *Don't* blur modal backgrounds; keep layouts clean with flat solid overlays.

---

## 6. Media Player & Control Components

### Timeline & Dials
*   **Purpose:** Timeline tracking, EQ tuning, and volume controls.
*   **Components:**
    *   `Timeline Slider:` Progress line (`4px` height) expanding on hover, with a drag handle.
    *   `Volume Dial:` Precision dial showing volume levels.
    *   `Lyrics Sync View:` Time-synced scrolling text area.
*   **States:** Playing, Paused, Buffering, Dragging, Offline.
*   **Accessibility:** Sliders support navigation via `Left / Right arrow keys` in 5-second steps.
*   **Animation:** Drag handles expand on hover using `spring-snappy`.
*   **Usage Rules:**
    *   *Do* show active timeline progress values in `JetBrains Mono`.
    *   *Don't* interrupt audio playback during timeline drag events; audio buffers update on release.

---

## 7. AI Generative Modules

### AI Composer Panels
*   **Purpose:** Input console triggers for generative processes.
*   **Components:**
    *   `Composer Parameters Console:` Sliders adjusting key parameters.
    *   `Remix File Dropzone:` Drag-and-drop file upload target.
    *   `Waveform Progress Indicator:` Dynamic rendering waveform graphic.
*   **States:** Idle, Validating Keys, Synthesizing, Complete, Error.
*   **Animation:** Generation triggers the glowing `aura-pulse` animation on the prompt container.
*   **Usage Rules:**
    *   *Do* display exact parameter inputs next to sliders in monospace typography.
    *   *Don't* display flashy purple colors on buttons; use clean brass gold.

---

## 8. Skeletons & Loaders

### Layout Placeholders
*   **Purpose:** Show structural footprints while data is loading.
*   **Components:**
    *   `List Item Skeleton:` Shimmering layout placeholders.
    *   `Card Skeleton:` Square shapes representing cover art blocks.
    *   `Waveform Skeleton:` Shimmering path segments indicating audio waveforms.
*   **States:** Loading, Complete.
*   **Animation:** Skeletons shift opacity between `0.4` and `0.8` over a 1500ms cycle.
*   **Usage Rules:**
    *   *Do* match skeleton dimensions exactly to their loaded component bounds.
    *   *Don't* use rotating progress circles inside content cards; use static skeleton shimmers.
