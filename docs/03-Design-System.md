# Chotify Design System
**Version:** 1.0.0  
**Status:** Production-Ready / Single Source of Truth  
**Target Platform:** AI-Native Premium Audio Platform  

---

## 1. Design Philosophy
Chotify's visual identity rejects standard modern UI tropes: we avoid generic glassmorphism, neon purple AI gradients, and overly rounded "blobby" shapes. Instead, Chotify embraces **Tactile Digitalism** and **Restrained Premium Minimalism**. 

The design is a collision of high-end mechanical audio equipment (such as vintage Hi-Fi amplifiers and Nothing OS hardware) with the ultra-clean, structured workspace layouts of Linear and Arc Browser. It establishes a sense of absolute precision while retaining a warm, human, and calm soul.

### Key Tenets:
*   **The Grid as Structure:** Every element is locked to a strict grid. Containers are defined by sharp, 1px borders rather than heavy dropshadows or floating color blobs.
*   **Analog Tactility:** Virtual controls (sliders, dials, toggle switches) mimic physical micro-mechanics. Interactive states respond with physical resistance and inertia.
*   **Monochromatic Foundations with Aura Accents:** The canvas is calm and monochromatic. AI features are not represented by purple neon swirls, but by a soft, glowing, high-temperature "Aura Gold" that feels like a vacuum tube warming up.
*   **Dynamic Utility:** Layouts adapt organically to workflow state. Sidebars act as sliding drawers, and workspaces morph seamlessly when changing from listening to generation mode.

---

## 2. Brand Personality
Chotify's brand voice and visual representation are defined by three core personality pillars:

| Pillar | Description | Visual Translation |
| :--- | :--- | :--- |
| **Soulful Precision** | High-end hardware engineering meeting organic acoustic beauty. | Sharp 1px borders (`Stone-200` / `Carbon-800`), strict monospace data layouts, and high-fidelity typography contrasted with fluid waveforms. |
| **Intentional Restraint** | Never showing more than what is needed. Eliminating cognitive clutter. | Generous white space, hidden controls that reveal themselves on hover, and strict monochrome bases. |
| **Tactile Digitalism** | Software that feels like physical objects you can touch, slide, and rotate. | Knobs with rotation indicators, sliders that expand under the cursor, and spring-loaded panel animations. |

---

## 3. Emotional Design Principles
We design specifically to elicit distinct emotional states as users interact with their music and the generative AI studio:

*   **Focus & Flow (Calmness):** When generating or listening to music, the UI recedes. Backgrounds use warm-tinted off-whites or deep ink charcoals that reduce eye strain. Text transitions are slow and smooth.
*   **Agency & Empowerment:** The user should feel like an expert audio engineer, not an amateur clicking a "magic generate" button. Controls are granular (knobs, sliders, step-sequencers) and visually responsive.
*   **Delight through Micro-feedback:** Clicking a button feels like pressing a physical key switch. Dragging a playhead has a subtle inertia, and the waveform lights up like a light-emitting diode (LED) indicator.

---

## 4. Color Palette
The color system is divided into Light and Dark themes, semantic utility colors, and a specialized AI Accent range. The foundation is warm-toned and structural, shifting away from stark blue-whites and cool greys.

### Light Theme (Sand Canvas)
Designed to mimic high-end cream-colored audio equipment and matte paper.
*   **Primary Background:** `Sand-50` (`#FAF9F6`) - A warm, organic off-white.
*   **Secondary Background:** `Sand-100` (`#F4F1EA`) - For sidebar panels and nested containers.
*   **Surface:** `White` (`#FFFFFF`) - Elevated card surfaces and active workspace sheets.
*   **Border Primary:** `Sand-300` (`#E6E1D6`) - Crisp, structural dividing lines.
*   **Border Secondary:** `Sand-200` (`#F0EDE6`) - Subtle internal list item borders.
*   **Text Primary:** `Ink-950` (`#121110`) - Dark charcoal black (not pure black).
*   **Text Secondary:** `Ink-600` (`#5A5651`) - Warm slate grey for body copy and inactive elements.
*   **Text Muted:** `Ink-400` (`#969087`) - For metadata, timestamps, and placeholder text.

### Dark Theme (Carbon Canvas)
Designed to mimic matte-black anodized aluminum, dark studios, and precision equipment.
*   **Primary Background:** `Carbon-950` (`#0B0B0A`) - Near-black, warm-tinted charcoal.
*   **Secondary Background:** `Carbon-900` (`#131312`) - For sidebar panels and nested containers.
*   **Surface:** `Carbon-850` (`#1C1C1A`) - Elevated card surfaces and active workspace sheets.
*   **Border Primary:** `Carbon-800` (`#2A2A28`) - Crisp, structural dividing lines.
*   **Border Secondary:** `Carbon-700` (`#363634`) - Subtle internal list item borders.
*   **Text Primary:** `Platinum-50` (`#FAFAFA`) - Soft off-white (not pure white).
*   **Text Secondary:** `Platinum-400` (`#A3A3A1`) - Muted metallic grey for body copy and inactive elements.
*   **Text Muted:** `Platinum-600` (`#646462`) - For metadata, timestamps, and placeholder text.

### Semantic Colors
Strictly used for feedback, validation, and status messages. They are highly functional and desaturated to prevent visual noise.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  SUCCESS: Sage Green                                                    │
│  [Light: #4A6B53] ─────────────────────── [Dark: #7CB38C]              │
│                                                                        │
│  ERROR: Crimson Red                                                     │
│  [Light: #B91C1C] ─────────────────────── [Dark: #EF4444]              │
│                                                                        │
│  WARNING: Ochre Amber                                                   │
│  [Light: #C2410C] ─────────────────────── [Dark: #F97316]              │
│                                                                        │
│  INFO: Steel Blue                                                      │
│  [Light: #2E5A88] ─────────────────────── [Dark: #60A5FA]              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### AI Accent Colors (Aura & Glow)
Instead of standard AI gradients (pink/purple/blue), Chotify uses a physical-glowing spectrum reminiscent of vacuum tubes and warm gold hardware detailing:
*   **Aura Gold (Core AI Accent):** `#D4AF37` (Light) / `#E8C547` (Dark). A warm, brassy metallic gold that represents generative action, active AI listening, and synthesis.
*   **Aura Glow (Glow Shadow):** `rgba(212, 175, 55, 0.15)`. Used for soft, structural shadows behind active AI panels.
*   **Mercury Platinum (Secondary AI Accent):** `#E5E4E2` (Light) / `#D1D1D1` (Dark). A metallic silver-white representing prompt processing and system calculations.

---

## 5. Typography
Typography is highly structured. Heading sizes use a clean geometric sans-serif to create elegance, while body text uses a standard neo-grotesque for legibility. Monospace formatting is used for all numbers, metrics, prompts, and controls to maintain the " Nothing OS / Linear" developer-aesthetic.

### Font Families
*   **Heading Font:** `Plus Jakarta Sans`, sans-serif (Geometric, modern, medium x-height).
*   **Body Font:** `Inter`, sans-serif (Neutral, clean, highly readable).
*   **Code / UI Data Font:** `JetBrains Mono`, monospace (Strict, technical, highly legible at small sizes).

### Font Scale (1.200 Minor Third Scale)

| Size Class | Pixel Size | Rem Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 11px | 0.6875rem | 16px (1.45) | Monospace metadata, track time, tags, keyboard shortcuts |
| `text-sm` | 13px | 0.8125rem | 18px (1.4) | Standard body, list item titles, descriptions, input text |
| `text-base` | 16px | 1rem | 22px (1.375) | Prompts, card titles, button labels |
| `text-md` | 19px | 1.1875rem | 26px (1.35) | Subheadings, section titles, modal headers |
| `text-lg` | 23px | 1.4375rem | 30px (1.3) | Sidebar category headers, track title in player |
| `text-xl` | 28px | 1.75rem | 36px (1.28) | Detail page titles, primary header blocks |
| `text-2xl` | 34px | 2.125rem | 42px (1.25) | AI Studio main workspace headers |
| `text-3xl` | 41px | 2.5625rem | 50px (1.2) | Large hero typography, focus-mode clock/timer |

### Font Weights
*   `font-light` (300): Large editorial headers only (34px and up).
*   `font-normal` (400): Standard body copy and secondary labels.
*   `font-medium` (500): Buttons, inputs, active states, subheadings.
*   `font-semibold` (600): Navigation headers, main card titles.
*   `font-bold` (700): Strictly reserved for numerical displays, primary headers, and status highlights.

---

## 6. 8pt Spacing System
Chotify uses a strict 8pt grid system. Every layout gap, padding, margin, and size constraint is a multiple of 8px. A 4px step is permitted exclusively for dense UI metadata, borders, and icon paddings.

### Spacing Tokens:
*   `space-1` (4px): Inner item alignment (e.g., text label next to icon).
*   `space-2` (8px): Dense padding (e.g., tags, list items, small buttons).
*   `space-3` (12px): Standard button padding, gap between small text columns.
*   `space-4` (16px): Main card padding, input field padding, layout gaps.
*   `space-6` (24px): Large card padding, section gap offsets.
*   `space-8` (32px): Workspace margins, header-to-content spacing.
*   `space-12` (48px): Grid margins, large section separations.
*   `space-16` (64px): Hero block margins, empty state layouts.

**Reasoning:** Lockstep grids prevent alignment shifting on layout resizing, making frontend code predictable and visual relationships cohesive.

---

## 7. Border Radius System
To maintain an elegant, premium look, we avoid circular "blobs". Radii are geometric and precise.

*   `radius-none` (0px): Outer layout grids, full-bleed screen layouts.
*   `radius-xs` (2px): Checkboxes, small tooltips, progress bar caps.
*   `radius-sm` (4px): Small buttons, tags, system notifications, mini album art.
*   `radius-md` (8px): Default cards, standard buttons, text input fields, dropdown menus.
*   `radius-lg` (12px): Large cards, track lists, AI studio panels, persistent player docks.
*   `radius-xl` (16px): Main modals, side sheets, bottom sheet drawers.
*   `radius-full` (9999px): Toggle pills, sliders, play/pause circular actions.

---

## 8. Shadows & Elevation
Instead of using large, diffuse color dropshadows, Chotify utilizes crisp, multi-layered shadows designed to replicate physical depth, layering light over paper or anodized metal.

### Shadows (Light Theme)
*   **`shadow-flat`:** `1px 1px 0px 0px var(--color-sand-300)` (Inspired by physical hard edges).
*   **`shadow-sm`:** `0 1px 2px rgba(18, 17, 16, 0.05)` (Standard buttons, dropdown items).
*   **`shadow-md`:** `0 4px 12px rgba(18, 17, 16, 0.04), 0 1px 3px rgba(18, 17, 16, 0.02)` (Floating cards, sidebar headers).
*   **`shadow-lg`:** `0 12px 24px rgba(18, 17, 16, 0.06), 0 2px 6px rgba(18, 17, 16, 0.03)` (Modals, main playback control panel).

### Shadows (Dark Theme)
*   **`shadow-flat`:** `1px 1px 0px 0px var(--color-carbon-800)`.
*   **`shadow-sm`:** `0 1px 2px rgba(0, 0, 0, 0.3)`.
*   **`shadow-md`:** `0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)`.
*   **`shadow-lg`:** `0 12px 24px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)`.

### Special Glow (AI Active State)
*   **`shadow-glow`:** `0 0 1px 1px var(--color-aura-gold), 0 4px 20px rgba(212, 175, 55, 0.15)`. Used when the AI generator is dynamically rendering or rendering output.

---

## 9. Grid System
The main screen layout is inspired by the **Arc Browser** and **Linear**—utilizing rigid frames, split columns, and 1px border lines to divide tasks.

```
┌────────────────────────────────────────────────────────┐
│  Sidebar (240px)   │  Main Workspace Area (Flex)       │
│                    ├───────────────────────────────────┤
│  [Logo]            │  [Header Search & Breadcrumbs]    │
│  - Library         ├───────────────────────────────────┤
│  - AI Studio       │  [Grid Content / Studio Board]   │
│  - Playlists       │  12-Column Layout (Desktop)       │
│                    │                                   │
│                    │                                   │
├────────────────────┴───────────────────────────────────┤
│  Persistent Music Player Dock (80px)                   │
└────────────────────────────────────────────────────────┘
```

### Layout Structures:
1.  **Sidebar Width:** Fixed `240px`. Collapsible to `0px` on mobile, sliding out as a sheet.
2.  **Player Dock Height:** Fixed `80px` lockup at the bottom of the screen.
3.  **12-Column Grid (Main Area):**
    *   **Desktop (1200px+):** 12 columns, `24px` gutter, `32px` outer margins.
    *   **Tablet (768px-1023px):** 8 columns, `16px` gutter, `24px` outer margins.
    *   **Mobile (0px-767px):** 4 columns, `12px` gutter, `16px` outer margins.

---

## 10. Responsive Breakpoints
Breakpoints are built mobile-first, ensuring smooth reflowing of complex dashboards:

*   **`xs` (375px):** Compact mobile screens. Stacked cards, full-screen player overlay.
*   **`sm` (640px):** Large mobile screens. 2-column album grid layouts.
*   **`md` (768px):** Tablet. Navigation moves to a bottom tab bar, sidebar collapses, player transitions to sticky bottom dock.
*   **`lg` (1024px):** Small desktop/laptop. Default layout with active sidebar and split AI-studio/waveform panels.
*   **`xl` (1280px):** Large desktop. Full 12-column layout. Workspace panel splits into multi-view dashboard.
*   **`2xl` (1536px):** Ultra-wide screens. Fixed maximum width content container to prevent excessive line lengths.

---

## 11. Iconography Guidelines
Icons are the structural indicators of the application. They must match the precision of the typography.

*   **Style:** Monoline, geometric style. Use `Lucide` or modified `Feather` icons.
*   **Stroke Weight:** Fixed at `1.5px`. Never use solid or filled icons except for states of absolute completion (e.g., a fully checked bookmark or playing icon).
*   **End Caps:** Squared/butt caps, not rounded. Joints should feel geometric.
*   **Sizing Matrix:**
    *   **`icon-sm` (16x16px):** Inside inline text, dense lists, metadata controls.
    *   **`icon-md` (20x20px):** Default size for navigation items, inputs, control buttons.
    *   **`icon-lg` (24x24px):** Primary music player controls, playback/pause, AI dashboard modules.

---

## 12. Illustration Style
We explicitly avoid: cartoon vectors, bubbly 3D clay characters, or colorful hand-drawn styles.
*   **Concept:** Schematic drawings, blueprint wireframes, and architectural layouts.
*   **Execution:** Fine lines, vector coordinates, and dot-matrix patterns.
*   **Palette:** Restricted to the theme's structural colors (e.g., `Sand-300` on `Sand-100` for light theme; `Carbon-800` on `Carbon-900` for dark theme).
*   **Example Application:** When displaying an empty playlist state, show a clean, high-precision layout of a cassette tape or vinyl groove drawn with 1px lines, detailed with monospace labels pointing to different structural features of the player.

---

## 13. Animation Philosophy
Motion is derived from physical hardware: heavy metal dials, springy toggle selectors, and magnetic snaps. We avoid overly slow, dramatic animations. Motion is swift, responsive, and tactile.

### Principles:
*   **No Dead Time:** Animations must feel instantaneous. Visual feedback occurs immediately on input.
*   **Spring Physics:** We avoid static CSS `cubic-bezier(0.4, 0, 0.2, 1)` transitions. We use spring-based physics containing high damping and stiffness to ensure motion has a natural deceleration.
*   **Choreography:** When panels scale or elements load, they enter in sequence, staggering from top-to-bottom and left-to-right in 15ms increments.

---

## 14. Motion Guidelines
CSS parameters for standard animations:

| Motion Profile | Duration | Curve / Spring Spec | Usage |
| :--- | :--- | :--- | :--- |
| **Instant Feedback** | 50ms | `linear` | Button active press scale-down, list item hover opacity |
| **Tactile Spring** | 200ms | `spring(mass: 1, tension: 280, friction: 30)` | Playback slider scrub handle growth, knob rotation, cards scaling on drag |
| **Panel Slide** | 250ms | `spring(mass: 1, tension: 220, friction: 28)` | Sidebar expansion/collapse, drawer entries, AI Workspace popovers |
| **Aura Pulse** | 2000ms | `ease-in-out` (infinite looping) | AI generation processing state - breathing pulse of glow shadow |

### Key CSS Animations:
```css
/* AI Breathing Animation */
@keyframes aura-pulse {
  0% {
    box-shadow: 0 0 1px 1px var(--color-aura-gold), 0 4px 12px rgba(212, 175, 55, 0.1);
  }
  50% {
    box-shadow: 0 0 2px 2px var(--color-aura-gold), 0 4px 24px rgba(212, 175, 55, 0.25);
  }
  100% {
    box-shadow: 0 0 1px 1px var(--color-aura-gold), 0 4px 12px rgba(212, 175, 55, 0.1);
  }
}
```

---

## 15. Component Design Rules
Every component is structured under strict composition laws:
1.  **Padding Integrity:** Elements must not sit closer to their container borders than their padding allocation.
2.  **States Specification:** Every component must support:
    *   **Default:** Base state.
    *   **Hover:** Visual indicator of focus (subtle color shifts or border sharpening).
    *   **Active (Pressed):** Physical movement (e.g., scale-down to `0.98` or border shadow flat shift).
    *   **Focus:** Focused elements show a clear outline (specifically `1.5px` offset outline using Aura Gold).
    *   **Disabled:** Opacity reduced to `0.4`, click events disabled.

---

## 16. Button Variants
Buttons represent core structural physical switches.

### Primary Button
Solid background, high contrast text.
*   **Light Theme:** Background `Ink-950`, Text `Sand-50`. Hover: Background `Ink-800`.
*   **Dark Theme:** Background `Platinum-50`, Text `Carbon-950`. Hover: Background `Platinum-200`.
*   **Details:** Radius `radius-md` (8px), Padding: `10px 16px`. Active: Scale to `0.98`.

### Secondary Button
Muted border button.
*   **Light Theme:** Background transparent, Border `1px solid var(--color-sand-300)`, Text `Ink-950`. Hover: Background `Sand-100`.
*   **Dark Theme:** Background transparent, Border `1px solid var(--color-carbon-800)`, Text `Platinum-50`. Hover: Background `Carbon-900`.

### AI Accent Button
Highlighting generative actions.
*   **Light/Dark:** Background `Aura-Gold`, Text `Carbon-950`. Hover: Box shadow glows with `shadow-glow` pulsing. Active: Flat shadow shift.

---

## 17. Input Fields
Text inputs resemble modern terminals—clean, monospaced details, sharp corners.

```
┌────────────────────────────────────────────────────────┐
│ 🔍 Search tracks, artists, or prompt templates...     │
└────────────────────────────────────────────────────────┘
```
*   **Default State:**
    *   Background: `Sand-100` (Light) / `Carbon-900` (Dark).
    *   Border: `1px solid var(--color-sand-300)` (Light) / `1px solid var(--color-carbon-800)` (Dark).
    *   Font: `Inter`, `font-normal`, `text-sm`.
*   **Focus State:**
    *   Border: `1px solid var(--color-aura-gold)`.
    *   Shadow: Soft inner shadow + Aura Gold glow line.
    *   Font (Input indicator / caret): Aura Gold color.
*   **AI Prompt Textarea:**
    *   Font: `JetBrains Mono` for writing inputs to the generative audio systems, simulating code composition or precise commands.

---

## 18. Cards
Cards are structured modules, not floating shapes.

*   **Structure:** `1px solid` border containing strict paddings.
*   **Interaction State:** On hover, instead of lifting up using huge dropshadows, the border color sharpens (e.g., changes from `Sand-300` to `Ink-950` in light mode, or `Carbon-800` to `Platinum-50` in dark mode) and the shadow transitions to `shadow-flat` with a tactile click-feel.
*   **Track Card Design:** Minimalist layout. Left side: Small album thumbnail with `radius-sm` (4px). Center: Title, Artist metadata. Right side: Interactive action triggers (e.g. dynamic waveform visualizer indicators).

---

## 19. Navigation Components
Designed with inspiration from Arc Browser and Apple Music.

```
┌───────────────────────────────┐
│ Library                       │
│ ├─ Tracks                     │
│ ├─ Playlists                  │
│                               │
│ Studio                        │
│ ├─ Gen-Engine                 │
│ └─ Prompt Library             │
└───────────────────────────────┘
```
*   **Sidebar Navigation:** Vertical navigation layout, using clear categories. Active link uses `Sand-100` (Light) / `Carbon-900` (Dark) pill background with a `2px` left border marker using Aura Gold.
*   **Top Bar (Header Navigation):** Non-intrusive container. Includes breadcrumb hierarchy (e.g., `Studio / Synthesizer-V2`), search input, and profile details.
*   **Mobile Bottom Tab Bar:** A simple, high-density bar containing four icons with text label underneath in `JetBrains Mono` at `text-xs`.

---

## 20. Music Player Styling
The persistent footer player represents high-fidelity hardware controls.

*   **Scrubbing Bar (Progress Slider):** A thin horizontal line (`4px` height). Progress filled in `Ink-950` (Light) or `Platinum-50` (Dark). On hover, a circular grab-handle appears, and the track height expands to `6px`.
*   **Waveform Playback indicator:** Instead of flat lines, a physical bar graphic containing dynamic heights showing the audio compression density. Plays inside an inline canvas.
*   **Hardware Dial Controls:** Digital rotational dials for master volume, spatial depth, and frequency parameters.
    *   **Visual spec:** Circular shape with 1px border. A tick line points to the current active value. The active setting is rendered in monospace text below the knob.

---

## 21. AI Studio Styling
The heart of Chotify is the generative workspace panel. This should look like a specialized audio workbench.

```
┌────────────────────────────────────────────────────────┐
│  AI Studio: Prompt Console                             │
├────────────────────────────────────────────────────────┤
│  [ > Enter Prompt: "Ambient synthesizer drone..." ]    │
│  Generate Engine Options:                              │
│  [  BPM: 120  ]  [  Key: Am  ]  [  Scale: Phrygian  ]   │
│                                                        │
│  Waveform Preview Panel:                               │
│  ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ (Processing...)    │
└────────────────────────────────────────────────────────┘
```
*   **Workspace Canvas:** Deeply structure panels using CSS Grid. Each panel is defined with a `1px` border, containing its own header block.
*   **BPM / Key Selectors:** Pill-shaped selector buttons with tactile toggle indicators, mimicking analog pushbuttons.
*   **The Prompt Console:** Uses a terminal-like window (`JetBrains Mono`, `text-base`). Typing displays code highlight colors. On active generation, the input border glows softly with an `aura-pulse` animation.

---

## 22. Modal Design
Modals pop up centered in the viewport to present critical tasks.

*   **Overlay Backdrop:** Muted tint: `rgba(18, 17, 16, 0.4)` (Light) / `rgba(0, 0, 0, 0.6)` (Dark). We do **not** blur the background. The overlay stays flat to preserve visual hierarchy.
*   **Container Specifications:** `1px solid var(--color-border-primary)` outline, radius `radius-xl` (16px), background matching theme's active surface.
*   **Transitions:** Spring scales upward from `0.95` to `1.0` combined with fade-in over 200ms.

---

## 23. Toast Notifications
Toasts stack in the bottom right corner, using sharp rectangular boxes.

*   **Processing Generation Toast:**
    *   Features a progress bar loop using the AI accent color (Aura Gold) and displays processing status (e.g. `Generating stems (14%)...`).
*   **Notification Design:**
    *   Radius: `radius-sm` (4px).
    *   Border: `1px solid` matching status severity.
    *   Padding: `12px 16px`.

---

## 24. Loading States
To maintain calmness, loading states are subtle. We avoid giant, spinning colorful wheels.

*   **Global Loader:** A 1px high line that runs across the absolute top edge of the viewport. Uses Aura Gold color.
*   **Component Loader:** Pulsating dot-matrix grid elements that fade in and out gently (1200ms loop transition).

---

## 25. Skeleton Loaders
Skeleton layouts show structural footprints of upcoming data components.

*   **Composition:** Match exact dimensions of cards, tracks, or sliders.
*   **Styling:**
    *   Light: Background changes from `Sand-100` to `Sand-200` back to `Sand-100` over a 1500ms cycle.
    *   Dark: Background shifts from `Carbon-900` to `Carbon-800` back to `Carbon-900` over a 1500ms cycle.
*   **Details:** Non-gradient flat shifting. Hard, crisp edges inside elements, matching the structural styling.

---

## 26. Empty States
Empty states guide users to productive creation.

*   **Visual Layout:** Center-aligned, containing a 1px wireframe blueprint drawing of hardware dials or cassette grooves.
*   **Text Hierarchy:** High contrast prompt heading (`text-base`, `font-semibold`), followed by subtext suggestions (`text-sm`, `font-normal`, `Text Secondary`).
*   **Actionable Trigger:** Include one prominent Primary or AI Accent CTA button (e.g., `Start Synthesis`).

---

## 27. Error States
Errors are designed to resolve problems clearly, not just warn users.

*   **Border:** Muted red border surrounding the card/panel interface.
*   **Diagnostic Text block:** A monospace code console block (`JetBrains Mono`, `text-xs`) outputting the exact error return trace, making debugging straightforward.
*   **Fallback Option:** A secondary outline retry button + link to documentation.

---

## 28. Accessibility Rules
We build for AA and AAA compliance:

*   **Text Contrast:** Minimum contrast ratio of `4.5:1` for regular text, and `3:1` for large header text.
*   **Focus Rings:** Interactive elements must show a distinct focus state. Standard outline: `1.5px solid var(--color-aura-gold)` with a `2px` offset.
*   **Keyboard Controls:** Music player play/pause triggerable by spacebar; spatial panels navigate with standard TAB controls.

---

## 29. Design Tokens
Below is the definitive JSON block defining the layout and color specifications.

```json
{
  "theme": {
    "colors": {
      "light": {
        "bg-primary": "#FAF9F6",
        "bg-secondary": "#F4F1EA",
        "surface": "#FFFFFF",
        "border-primary": "#E6E1D6",
        "border-secondary": "#F0EDE6",
        "text-primary": "#121110",
        "text-secondary": "#5A5651",
        "text-muted": "#969087"
      },
      "dark": {
        "bg-primary": "#0B0B0A",
        "bg-secondary": "#131312",
        "surface": "#1C1C1A",
        "border-primary": "#2A2A28",
        "border-secondary": "#363634",
        "text-primary": "#FAFAFA",
        "text-secondary": "#A3A3A1",
        "text-muted": "#646462"
      },
      "ai": {
        "aura-gold": "#D4AF37",
        "aura-gold-dark": "#E8C547",
        "aura-glow": "rgba(212, 175, 55, 0.15)",
        "mercury-platinum": "#E5E4E2"
      },
      "semantic": {
        "success": "#4A6B53",
        "error": "#B91C1C",
        "warning": "#C2410C",
        "info": "#2E5A88"
      }
    },
    "spacing": {
      "space-1": "4px",
      "space-2": "8px",
      "space-3": "12px",
      "space-4": "16px",
      "space-6": "24px",
      "space-8": "32px",
      "space-12": "48px",
      "space-16": "64px"
    },
    "radius": {
      "none": "0px",
      "xs": "2px",
      "sm": "4px",
      "md": "8px",
      "lg": "12px",
      "xl": "16px",
      "full": "9999px"
    }
  }
}
```

---

## 30. CSS Variable Naming Convention
CSS Variables follow a strict scoping hierarchy:

`--chotify-[group]-[component]-[property]-[state]`

### Examples:
*   `--chotify-color-bg-primary` (Canvas background)
*   `--chotify-color-border-secondary` (Internal list divider)
*   `--chotify-color-ai-aura-gold` (AI accent)
*   `--chotify-radius-md` (Button border radius)
*   `--chotify-spacing-space-4` (Standard layout padding)
*   `--chotify-button-primary-bg-hover` (Button-specific state variable)

---

## 31. Tailwind Theme Tokens
To implement this styling inside Tailwind CSS v4 projects, configure variables under the CSS `@theme` directive:

```css
@theme {
  --color-chotify-sand-50: var(--chotify-color-sand-50, #FAF9F6);
  --color-chotify-sand-100: var(--chotify-color-sand-100, #F4F1EA);
  --color-chotify-sand-300: var(--chotify-color-sand-300, #E6E1D6);
  
  --color-chotify-carbon-950: var(--chotify-color-carbon-950, #0B0B0A);
  --color-chotify-carbon-900: var(--chotify-color-carbon-900, #131312);
  --color-chotify-carbon-850: var(--chotify-color-carbon-850, #1C1C1A);
  --color-chotify-carbon-800: var(--chotify-color-carbon-800, #2A2A28);
  
  --color-chotify-aura-gold: var(--chotify-color-aura-gold, #D4AF37);
  --color-chotify-aura-glow: var(--chotify-color-aura-glow, rgba(212, 175, 55, 0.15));
  
  --color-chotify-sage: #4A6B53;
  --color-chotify-sage-dark: #7CB38C;
  
  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --spacing-ch-1: 4px;
  --spacing-ch-2: 8px;
  --spacing-ch-3: 12px;
  --spacing-ch-4: 16px;
  --spacing-ch-6: 24px;
  --spacing-ch-8: 32px;
  
  --radius-ch-xs: 2px;
  --radius-ch-sm: 4px;
  --radius-ch-md: 8px;
  --radius-ch-lg: 12px;
  --radius-ch-xl: 16px;
  
  --shadow-ch-flat: 1px 1px 0px 0px currentColor;
  --shadow-ch-glow: 0 0 1px 1px var(--chotify-color-aura-gold), 0 4px 20px rgba(212, 175, 55, 0.15);
}
```

---

## 32. Do's and Don'ts

### Do's:
1.  **Do** use 1px borders to separate content containers and functional zones.
2.  **Do** set numbers, metric labels, timers, and input commands in `JetBrains Mono`.
3.  **Do** default to monochrome backgrounds (`Sand` and `Carbon`) and use `Aura Gold` solely to highlight AI states and synthesis events.
4.  **Do** utilize spring physical timing for modal entrances, playhead scaling, and page panel expansion.
5.  **Do** allow layouts to collapse and reflow cleanly down to `375px` viewports using flex systems.

### Don'ts:
1.  **Don't** use neon purple or pink colors to label AI triggers or workflows.
2.  **Don't** introduce circular "bubble" borders on key elements (e.g. do not use round pill-style buttons for main actions; use `radius-md` instead).
3.  **Don't** apply heavy fuzzy drop-shadows to mock floating layers; layers are flat, divided cleanly by precise lines.
4.  **Don't** obscure background components behind blur filters; overlays must remain solid sand/carbon tones.
5.  **Don't** add complex, custom loading spinners; use progressive top lines or simple dot-matrix pulsing steps.

---

## 33. Brand Identity

The Chotify brand represents the convergence of high-fidelity acoustic performance and cutting-edge artificial synthesis. It is designed to look and feel like premium physical hardware—honest, calibrated, and permanent.

### Brand Mission
To design an uncompromised, distraction-free environment for deep musical listening and human-in-the-loop audio generation. We exist to make music creation feel like an active, physical craft rather than an automated software output.

### Brand Personality
*   **Precise:** Every gap, line weight, and transition is mathematically calibrated.
*   **Tactile:** Digital controls behave like analog components with real inertia and weight.
*   **Calm:** Monochromatic tones and minimal decoration allow the user's mind to focus.
*   **Sophisticated:** We do not shout or use flashy neon gradients; we speak quietly through premium details.

### Brand Values
1.  **Intentionality:** If an element does not serve a functional purpose or clarify structure, it is removed (YAGNI).
2.  **Restraint:** Expressing complex systems using the simplest possible visual language.
3.  **High-Fidelity:** Emphasizing high resolution in typography, border alignments, layout calculations, and audio presentation.
4.  **Human Agency:** AI is treated as a collaborative musical instrument, not a replacement for human expression. The user remains the conductor.

### Brand Promise
Chotify promises an acoustic and visual sanctuary. By stripping away social-media feed clutter, colorful promotional banners, and chaotic animations, we deliver an immersive workspace where user focus and sound generation are prioritized.

### Brand Voice & Tone of Communication
*   **Voice:** Technical, clear, precise, and objective. We communicate like a professional sound engineer or architectural documenter.
*   **Tone:** Calm, helpful, and direct. We avoid marketing hype, exclamation points, and tech-startup jargon (e.g., "seamless", "magical", "revolutionize"). We refer to features by their functional names (e.g., `Synthesizer Console`, `Aura Input`, `Audio Output Panel`).
*   **Example Naming Conventions:**
    *   *Incorrect:* "Magic Song Maker", "AI DJ Mode", "Smart Feed".
    *   *Correct:* "Generative Engine", "Track Synthesis Console", "Acoustic Queue".

### Logo Philosophy
```
┌───────┐
│  ┌─┐  │
│  └─┘  │
│   ●   │
└───────┘
```
The Chotify logo consists of a strict square container bounding a single solid circle (`●`) positioned on a offset grid coordinate. It represents a needle landing on a vinyl groove or the center-axis dial of a high-end audio pre-amplifier. It symbolizes focal stillness and acoustic centering.

*   **Logo Clear Space:** The logo must always be surrounded by a safety margin equal to 200% of its base dimension. No text or layout border may encroach on this boundary.
*   **App Icon Philosophy:** The app icon is designed to look like a physical component on a mixing console. It utilizes a dark carbon-textured surface, a debossed 1px bounding line, and a tactile, brassy gold metallic dot at the center. It has no app reflections or generic neon gradients.

### Brand Recognition Principles
Chotify is instantly recognizable not by a loud logo or color scheme, but by its distinctive design signatures:
1.  The strict 1px grid layout structure.
2.  The monospaced `JetBrains Mono` values and prompt strings juxtaposed with elegant editorial headlines.
3.  The single, radiant `Aura Gold` accent glowing on dark charcoal backgrounds.

---

## 34. Motion System

Motion in Chotify is structural and physical. Animations are designed to teach the user where panels come from, how containers relate to each other, and when processing states are active. We avoid decorative transitions.

### Motion Philosophy
Every animated transition must mimic the behavior of real physical objects with mass, friction, and spring tension. Elements never fade into existence out of nowhere; they slide from a structural starting position, scale from their physical source container, or morph seamlessly from one frame shape to another.

### Motion Hierarchy
1.  **Primary (Structural Shifts):** Opening panels, expanding workspaces, or switching themes. Uses high-mass, heavily-damped springs to denote weight and importance.
2.  **Secondary (Interaction Feedback):** Clicks, hover transitions, slider scrubs. Uses fast, snappy springs to maximize responsiveness.
3.  **Tertiary (Status Indicators):** Active AI generation, loading progress. Uses continuous, breathing curves to denote active background processing without drawing focus.

### Spring Presets & Specs
We specify motion using physics parameters (Mass, Tension, Friction) rather than arbitrary duration curves, ensuring natural acceleration and deceleration.

| Preset | Mass ($m$) | Tension ($k$) | Friction ($c$) | Behavior | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `spring-heavy` | 1.0 | 180 | 28 | Slow, smooth, no overshoot, heavy inertia. | Main sidebar drawer slide, full-screen player expansion, dashboard morphs. |
| `spring-standard` | 1.0 | 230 | 22 | Balanced, highly natural, tiny organic bounce. | Card expansion, modal popups, playlist queue shifts. |
| `spring-snappy` | 0.8 | 320 | 18 | Crisp, instantaneous, sharp bounce back. | Slider handles, hover translations, button active state scales, toggle shifts. |

### Duration Scale (Fallbacks for Non-Spring Environments)
*   `duration-instant` (50ms): Quick hover states, checkmark appearances.
*   `duration-fast` (120ms): Button click press states, tooltip rollouts.
*   `duration-normal` (200ms): In-page list insertions, tab selections.
*   `duration-slow` (320ms): Modal window entries, sliding sideboards.
*   `duration-deliberate` (500ms): Complex multi-panel AI studio generations.

### Easing Curves (For Basic CSS Transitions)
*   `ease-tactile`: `cubic-bezier(0.16, 1, 0.3, 1)` - Rapid start, smooth decelerated landing.
*   `ease-in-out-breathing`: `cubic-bezier(0.44, 0, 0.56, 1)` - Perfect symmetry for continuous loading loops.

### Transition Hierarchy
```
[Global Layout States] ──> [Panel Morphing / Slide-outs] ──> [Card Scaling & Hover Translate] ──> [Micro-Interactions]
```

### Motion Scenarios
*   **Shared Element & Hero Transitions:** When a user clicks an album card to open the detailed track analyzer, the card container bounds morph directly into the dashboard layout. The cover art scales smoothly from card width to detail page header size while its screen coordinates update along a spring path.
*   **Card Animations:** On hover, cards scale up to `1.01` and their border color transitions to `Platinum-50` (Dark) over 120ms. On click, they scale down to `0.98` instantly, returning to base size with a `spring-snappy` motion profile upon release.
*   **Navigation & Panel Transitions:** Sidebars slide outward along the X-axis. As the sidebar expands, the main workspace panel scales to `0.98` on a spring path to establish visual depth.
*   **Player Expansion Animation:** The persistent footer player dock (80px height) morphs into the full-screen playback screen. The miniature cover art slides to the center, expanding into a large artwork square, while controls rotate 90 degrees as they translate to their central dashboard positions.
*   **AI Synthesis & Playlist Generation:** Generative audio output visualizers use dot-matrix grid transitions. Pixels illuminate in a sequential left-to-right sweep pattern. The waveform outline expands vertically on a spring path as active stems are compiled.
*   **Scroll Animations:** List items fade from `0.6` to `1.0` opacity as they transition past the top/bottom viewport margins. Heavy inertial scrolling has rubber-band limits at content endcaps.
*   **Hover, Drag, & Gesture Interactions:**
    *   *Hover:* Items translate +4px on the X-axis or show a subtle highlight border.
    *   *Drag:* Scrub handles expand from 4px to 12px circular buttons on hover and track the cursor position with zero lag.
    *   *Gesture:* Swiping a song to the right to queue it slides the container on the Y-axis. The item fades out while sibling tracks below spring upward to collapse the layout space.

### When Motion Should NOT Be Used
1.  **Reduced Motion Contexts:** When `prefers-reduced-motion` is active in user browser configurations, all animations must disable scaling, sliding, and springs, defaulting to clean, instant opacity fades.
2.  **Repetitive Data Tasks:** Mass selection, deleting multiple tracks, or fast folder scrolling must never trigger individual item animations to prevent CPU stuttering and keep the interface responsive.
3.  **Low Network/Hardware States:** If the platform detects thread blockages, animations are bypassed to preserve layout performance.

---

## 35. Elevation System

Elevation in Chotify creates visual hierarchy without resorting to heavy, fuzzy drop-shadows that clutter dark interfaces. We establish depth through structured surface colors and sharp 1px borders.

### Surface Levels
We divide depth into five distinct virtual layers:

```
┌────────────────────────────────────────────────────────┐
│ Level 4: Modals, Dialogs, Sheet Drawers (Active Focus) │
│   ┌──────────────────────────────────────────────────┐ │
│   │ Level 3: Dropdowns, Popovers, Active Toasts      │ │
│   │   ┌────────────────────────────────────────────┐ │ │
│   │   │ Level 2: Workspace Cards, Active Surfaces   │ │ │
│   │   │   ┌──────────────────────────────────────┐ │ │ │
│   │   │   │ Level 1: Sidebar, Nested Panel Trays │ │ │ │
│   │   │   │   ┌────────────────────────────────┐ │ │ │ │
│   │   │   │   │ Level 0: Main Canvas Background│ │ │ │ │
│   │   │   │   └────────────────────────────────┘ │ │ │ │
│   │   │   └──────────────────────────────────────┘ │ │ │
│   │   └────────────────────────────────────────────┘ │ │
│   └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Elevation & Shadow Hierarchy

| Level | Surface Token (Light / Dark) | Border Token (Light / Dark) | Shadow Token (Light / Dark) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **`level-0` (Canvas)** | `#FAF9F6` / `#0B0B0A` | None | None | Primary app canvas background. |
| **`level-1` (Panels)** | `#F4F1EA` / `#131312` | `Sand-300` / `Carbon-800` | None | Structural sidebars, nested parameter boxes, bottom docks. |
| **`level-2` (Cards)** | `#FFFFFF` / `#1C1C1A` | `Sand-200` / `Carbon-700` | `shadow-flat-light` / `shadow-flat-dark` | Standard list items, album grid elements, active parameter widgets. |
| **`level-3` (Overlays)**| `#FFFFFF` / `#1C1C1A` | `Sand-300` / `Carbon-800` | `shadow-sm` (Light/Dark) | Context menus, active volume controls, notifications. |
| **`level-4` (Modals)** | `#FFFFFF` / `#1C1C1A` | `Sand-300` / `Aura-Gold` | `shadow-md` / `shadow-glow-dark` | Full screen popups, AI Studio preset drawers, critical confirmations. |

### Transparency & Glass Rules
We reject standard modern CSS glassmorphism (`backdrop-filter: blur`). Blur shaders cause CPU/GPU lag, especially in canvas environments with active audio waveforms.
*   **The Alpha Rule:** Transparency is only permitted on the dark backdrop screen overlay behind modals, configured as solid `rgba(0, 0, 0, 0.4)` (Light mode) or `rgba(0, 0, 0, 0.7)` (Dark mode).
*   **Container Opacity:** In-app panels, sidebars, and cards must remain 100% opaque to guarantee clear text contrast and prevent text overlap when scrolling.

### Layer Ordering & Z-Index Philosophy
Z-indices are locked to structural ranges to prevent stacking order conflicts in React portals.

```css
:root {
  --z-base: 0;
  --z-panel-content: 10;
  --z-sticky-bar: 20;
  --z-navigation-bar: 30;
  --z-dropdown-popover: 40;
  --z-backdrop: 50;
  --z-modal-frame: 60;
  --z-toast-notification: 70;
}
```

---

## 36. Iconography System

Icons are structural signposts in the interface. They are treated with the same geometric precision as the typography.

### Stroke Weights & Corner Radii
*   **Stroke Weight:** Kept at a uniform `1.5px` stroke across all base components. Large action icons (e.g., 24px and up) use `1px` to maintain a light visual weight. Tiny icons (e.g., status flags under 12px) use `2px` to preserve legibility.
*   **Joints & Terminal Caps:** We use square or butt stroke caps and sharp 90-degree corner joins. We avoid rounded joints, giving icons an engineered, mechanical appearance.

### Interactive States

```
[Default Outline] ──(Hover)──> [Color Contrast Shifts] ──(Press)──> [Scale down to 0.90] ──(Active)──> [Filled Icon Geometry]
```

*   **Default State:** Outline style. Muted colors (`Ink-400` / `Platinum-600`).
*   **Hover State:** Color shifts to `Ink-950` (Light) / `Platinum-50` (Dark) over 120ms.
*   **Pressed State:** Scales down to `0.9` instantly on active mouse click/press.
*   **Active/Selected State:** Morph transition to filled-icon styling where applicable.
*   **Disabled State:** Opacity locked to `0.3` with click events set to `none`.

### Icon Sizing Scale
*   `size-sm` (16x16px): Embedded inside text fields, tags, and detail metadata.
*   `size-md` (20x20px): Sidebar buttons, track lists, utility controllers.
*   `size-lg` (24x24px): Primary playback controls, AI Synth Console tabs.

### Do's and Don'ts
*   **Do** align all icon vector assets to a 24px grid with a 2px safe inner margin.
*   **Do** ensure line strokes sit exactly on decimal pixel coordinates to prevent screen rendering blur.
*   **Don't** use colored gradients inside icons; color must remain flat.
*   **Don't** mix filled style icons with outline style icons within the same control group.

---

## 37. Sound Design

Chotify integrates subtle sound feedback to reinforce digital interactions. Audio cues use natural, organic recordings and low-frequency tones rather than synthesized electronic chirps.

### Sound Philosophy
*   **Acoustic Origin:** Sounds are modeled on organic physical materials: dry wood, high-density plastics, brass bars, and soft mallets.
*   **Restraint & Volumetrics:** UI sounds must remain secondary to the music. Volume is calibrated at `-22 LUFS` to prevent sudden auditory shocks. Sounds default to off, requiring explicit user activation.

### Interaction Sound Library

| Action | Audio Signature | Sound Specs | Rationale |
| :--- | :--- | :--- | :--- |
| **Button Click** | Tactile Key-switch | Dry, plastic click. Frequency: 180Hz. Duration: 12ms. | Confirms action execution without cluttering the music space. |
| **Notification** | Wooden Mallet Strike | Soft double-tap on a wooden marimba. Frequencies: 330Hz, 440Hz. | Informs the user of system updates in a warm tone. |
| **Success / Finish** | String Pluck | Soft, resonant string pluck. Frequency: 587Hz. | Delivers a sense of human craft on task completion. |
| **AI Processing Complete** | Vacuum Tube Swell | Warm tube synth chord (F# Major) swelling over 600ms, then fading. | Signals synthesis completion with a warm, analog finish. |
| **Playlist Created** | Paper Shuffling | Soft sound of card sheets being sorted. Duration: 240ms. | Connects digital lists to physical sorting. |
| **Music Generation Init** | Heartbeat Thump | Low frequency organic heartbeat strike. Frequency: 55Hz. | Denotes the birth of a new composition. |
| **System Error** | Mechanical Catch | Dual low-frequency wooden clicks with a flat decay. Duration: 80ms. | Mimics a physical gear wheel locking in place. |

---

## 38. Haptic Feedback (Future)

To prepare for mobile deployments, Chotify maps critical digital controls to physical haptic sensations. Haptic design replicates the mechanical feedback of tactile knobs and switches.

### Haptic Profiles
1.  **Light Tap (Micro-Tick):** 8ms impulse. Feels like rotating a dial past a notch.
    *   *Usage:* Scrubbing track time, rotating virtual EQ parameters, list indexing.
2.  **Medium Tap (Key Switch):** 18ms impulse. Feels like pressing a mechanical key.
    *   *Usage:* Toggling play/pause, selecting items in a menu.
3.  **Heavy Tap (Impact):** 30ms impulse. Feels like closing a lid.
    *   *Usage:* Deleting playlists, canceling generation queues.

### Feedback Patterns
*   **Success Confirmation:** Two light taps separated by a 40ms interval (Tick-Tick).
*   **Error / Constraint Warning:** A rapid three-strike vibration pattern with diminishing force (Thump-tick-tick).
*   **Selection Scrub:** Continual micro-ticks as index coordinates change, providing tactile structure to sliders.
*   **Music Timeline Drag:** Subtle continuous haptic vibration that increases in intensity as the user drags closer to transition markers.

---

## 39. Component State Matrix

Every interactive component must support these states. This matrix serves as the template for developer validation.

| Component | Default | Hover | Focus | Pressed | Selected | Loading | Success | Error | Disabled | Skeleton |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `Sand-50` text, `Ink-950` bg. | Bg shifts to `Ink-800`. | 1.5px Aura outline, 2px offset. | Scale down to `0.98`, bg `Ink-950`. | N/A | Monospace "..." label, pulsing. | Accent color change to `Sage`. | Muted crimson flash on border. | Opacity `0.4`, click events `none`. | Shimmer block matching bounds. |
| **Text Input** | 1px `Sand-300` border, `Sand-100` bg. | Border color sharpens to `Ink-950`. | Border turns `Aura Gold`, inner shadow. | N/A | N/A | Inline processing dot-matrix spinner. | 1px `Sage` outline. | 1px `Crimson` outline, monospace details. | Opacity `0.3`, keyboard locked. | Shimmer block matching bounds. |
| **Sidebar Item** | `Ink-600` text, transparent bg. | Text turns `Ink-950`, bg `Sand-100`. | 1.5px Aura outline, 2px offset. | Bg turns `Sand-200`. | `Ink-950` text, 2px Aura indicator bar. | Spin circle next to label. | Checkmark flash on indicator. | Red alert indicator next to label. | Opacity `0.3`, click disabled. | Monospace character line. |
| **Card Surface** | 1px `Sand-200` border, `White` surface. | Border turns `Sand-300`, scale `1.01`. | 1.5px Aura outline. | Scale `0.98`, `shadow-flat` shifts. | 1px `Aura-Gold` border. | Shimmer screen overlay. | Muted green highlight strip. | Muted red highlight strip. | Opacity `0.4`, click disabled. | Blank shape with 1px border. |

---

## 40. Animation Library

Use this library of transitions to build cohesive animations across all app features.

### Core Transition Specs
*   **Fade (Tooltip & Toast Exit):** `transition: opacity 120ms linear`.
*   **Slide (Toast Entry):** Translate Y from `20px` to `0px` via `spring-snappy`.
*   **Scale (Card Hover):** Scale `1.0` to `1.01` via `spring-standard`.
*   **Morph (Player Dock):** Coordinate transformation using layout animations, interpolating border radius from `12px` to `0px` over 320ms.
*   **Tactile Edge Ripple:** A 1px gold border expand line that radiates outward from the click target and fades out.
*   **Elastic EQ Springs:** Parameter sliders use damped elastic behavior when they hit maximum/minimum limits, rebounding slightly.

### Component-Specific Animations
*   **Modals:** Scale up from `0.95` to `1.0` and fade from `0` to `1` opacity over 200ms using a `spring-standard` curve.
*   **Toasts:** Slide upward from the bottom right corner of the screen, stay static for 3000ms, and slide out horizontally to the right on close.
*   **AI Synthesizer Panel:** Slides in from the right edge on a `spring-heavy` path, while the primary playlist panel slides left by 40px to accommodate the space.

---

## 41. Illustration System

Illustrations in Chotify are designed to feel like engineering documents, blueprint wireframes, or high-fidelity technical diagrams. We avoid generic vector shapes and cartoon illustrations.

### Illustration Guidelines
*   **Style:** Technical orthographic line drawings, blueprints, and schematic layouts.
*   **Perspective:** Isometric or top-down orthographic viewports.
*   **Texture & Shading:** 1px parallel line hatching (etching) is used instead of solid color fills. A subtle 5% photographic film grain texture overlays the graphics.
*   **Color Palette:** Monochrome bases (`Sand-300` / `Carbon-800`). Aura Gold is reserved for highlighting the central functional component of the drawing (e.g., the needle on a record groove).
*   **Corner Radii:** Sharp angles. Internal elements use a maximum border radius of `2px`.
*   **Subject Matter:** Focuses on physical audio machinery, turntable arms, magnetic cassette tape structures, acoustic waves, and studio controls. No human characters or faces are depicted.

### Music & AI Cover Art Styling
For playlists or albums without custom artwork, Chotify renders generative artwork:
*   **Generative Art Specs:** Mathematical patterns (e.g., Lissajous curves, Mandelbrot fractals, geometric sound waves) generated algorithmically using seed coordinates.
*   **Color Range:** Monochrome sand/carbon with a single gold frequency line.

---

## 42. AI Visual Language

Generative AI features must have a clear visual identity so users instantly understand when they are interacting with synthesis systems.

### AI Design Signatures

```
┌────────────────────────────────────────────────────────┐
│  ✦ Ambient Synthesizer generator            [ AI ]     │
├────────────────────────────────────────────────────────┤
│  Prompt: "Low frequency pad, sand texture..."          │
│  Stems: █ █ ░ ░ (Processing)   [ Synthesized Stamp ]   │
└────────────────────────────────────────────────────────┘
```

*   **AI Badge:** A small, uppercase monospaced pill `[ AI ]` with an `Aura-Gold` outline and text.
*   **AI Icon:** A four-point spark icon (`✦`) modified to use sharp corners and a 1.5px stroke weight.
*   **AI Gradients:** Subtle metallic transitions (`Aura-Gold` `#D4AF37` fading to `Sand-100` `#F4F1EA`).
*   **AI Loading Indicators:** Dot-matrix grids where pixels light up in sequence to represent data synthesis.
*   **AI Cards:** Dark backgrounds, a 1px Aura Gold border, and a soft, glowing gold shadow (`shadow-glow`).
*   **AI Labels/Chips:** Monospace metadata tags detailing parameters (e.g., `synthesis-ratio: 0.72` or `entropy-seed: #88F9`).
*   **AI Backgrounds:** Deep charcoal canvases featuring a soft, warm radial gold glow behind layout panels.
*   **AI Generated Stamps:** Metadata stamps marked as `[ SYNTH ]` to clearly distinguish synthetic recordings from standard audio files.

---

## 43. Empty State Philosophy

Empty states are designed to encourage creation, turning blank screens into invitations to write prompts or generate new audio.

### Empty State Designs

| Screen | Target Purpose | Visual Blueprint Illustration | Primary CTA (Aura Gold) | Secondary CTA (Outline) |
| :--- | :--- | :--- | :--- | :--- |
| **No Playlists** | Encourage the user to create a new folder structure. | A technical drawing of an empty storage box with coordinate markings. | `Create Playlist` | `Import Stems` |
| **No Downloads** | Guide the user on how to save offline files. | An isometric diagram of a cassette tape missing its tape spools. | `Explore Library` | `Offline Settings` |
| **No History** | Get the user to start listening. | An orthographic drawing of an unplayed vinyl record grooveless surface. | `Listen Now` | `Explore Prompts` |
| **No Liked Songs** | Show how bookmarking tracks works. | A schematic drawing of an unlatched mechanical lock. | `Browse Tracks` | N/A |
| **No AI Syntheses** | Encourage the user to write their first prompt. | A blueprint layout of an analog synthesizer console with no cables patched. | `Open Generator` | `Load Prompt Template` |
| **No Search Results** | Handle search query misses gracefully. | A radar grid template scanning empty space. | `Clear Filters` | `Try "Ambient Soundscapes"` |
| **Offline State** | Handle lack of internet connection without errors. | A physical antenna tower layout with a broken connection path. | `Retry Connection` | `Play Offline Downloads` |

---

## 44. Design Constraints

To maintain visual discipline and consistency, every component must adhere to these strict limits:

1.  **Maximum Navigation Depth:** Three nested steps (e.g., `Library -> Playlist -> Track Detail`). Beyond this, breadcrumbs must collapse or reset the root.
2.  **Maximum Card Nesting:** Two levels deep. Standard cards can contain metadata tags, but never nested sub-cards.
3.  **Maximum Active Accent Colors:** Only one accent color (`Aura Gold`) is active at a time. All secondary hierarchy must be defined by monochromatic shades.
4.  **Maximum Animation Duration:** 450ms. Any transition exceeding this limit is rejected for causing interface lag.
5.  **Minimum Touch Target Dimension:** `44px` x `44px` on mobile, `32px` x `32px` on desktop layouts.
6.  **Minimum Color Contrast Ratio:** `4.5:1` for body text copy, `7:1` for critical metadata text.
7.  **Spacing Requirements:** Gaps and paddings must align to multiples of 8px (with 4px permitted for compact metadata layouts).

---

## 45. Design Review Checklist

Before implementing any layout in frontend code, designers and developers must verify the screen against this checklist:

*   [ ] **Accessibility:** Does the screen meet contrast ratios? Are focus rings visible on keyboard navigation?
*   [ ] **Spacing:** Are all margins, paddings, and gaps multiples of 8px?
*   [ ] **Grid Alignment:** Are borders aligned to the 1px grid structure?
*   [ ] **Typography Hierarchy:** Are headings set in `Jakarta Sans`, body text in `Inter`, and status metrics/prompts in `JetBrains Mono`?
*   [ ] **Colors:** Is the color scheme restricted to Sand/Carbon neutrals with Aura Gold as the sole AI accent?
*   [ ] **Interactive States:** Do buttons and inputs support Hover, Pressed, Focus, and Disabled states?
*   [ ] **Motion Constraints:** Are animations configured with spring physics rather than arbitrary ease curves?
*   [ ] **Performance Check:** Do loading states use simple top progress lines or dot-matrix pulsing grids instead of heavy GIFs or video loads?
*   [ ] **Empty States:** Are empty screen views configured with a technical blueprint drawing and a primary call to action?
*   [ ] **Error States:** Do error states provide technical, monospace error logs with clear recovery steps?
*   [ ] **Reduced Motion Support:** Does the view transition to static layout sheets when reduced-motion preferences are enabled?
*   [ ] **Mobile Reflow:** Does the desktop layout reflow to a single-column layout with a bottom tab bar on mobile viewports?

---

## 46. Experience Principles

These principles define the emotional quality of the Chotify experience:

1.  **The Interface Disappears:** Visual elements are secondary to the sound. Layout borders, background tones, and text sizes are designed to recede once music playback starts.
2.  **Analog Honesty:** Digital parameters act like real components. Knobs do not jump values; they rotate, volume sliders decelerate naturally, and visual waveforms display actual audio data.
3.  **AI Transparency:** We show generative parameters clearly. User controls avoid "magic wand" buttons, displaying exact values for seeds, entropy weights, and track durations to make generation feel like a repeatable craft.
4.  **No Unnecessary Interactions (YAGNI):** Every click must be necessary. If a task can be solved using keyboard shortcuts or clear layouts, we remove the extra steps.
5.  **Handcrafted Quality:** The interface should feel constructed by a team of human artisans rather than assembled from generic templates. Every border join, font size choice, and spring animation is intentional.

---

## 47. Future Expansion Guidelines

To preserve visual consistency as the platform expands, new features must follow these layout rules:

### System & Layout Adaptations
*   **Widgets:** Desktop widgets use a dense, 2x2 grid layout showing track cover art, playback controls, and real-time miniature waveforms.
*   **Desktop & Web Layouts:** Maximize screen real estate using Arc-style panels, vertical metadata columns, and collapsible sideboards.
*   **Mobile & Tablet Viewports:** Navigations move to bottom navigation blocks, sidebars transform to drawer sheets, and touch targets expand to `48px`.
*   **Smart Watch viewports:** UI elements scale down to a single dial control wheel. Text is limited to a single title and timestamp in `JetBrains Mono`.
*   **TV & Large Screen Display interfaces:** High contrast interfaces with dark modes, large cover art displays, and grid controls navigable via d-pad controllers.
*   **AR/VR Considerations:** Interfaces are rendered as flat, matte-black floating boards in virtual space, using Aura Gold hover highlights. We avoid 3D glass widgets to prevent eye strain.

### Third-Party Plugins & Integrations
*   **Plugin Systems:** External modules must mount within standard 1px border container blocks. They are limited to using the app's CSS variables, ensuring styling matches the host app.
*   **AI Engine Providers:** Generative panels must share the unified `Prompt Console` terminal layout. Different algorithms are represented by monospace tags (e.g., `model-source: stable-audio-v2`), avoiding custom background graphics or provider branding.
*   **Feature Expansion Rules:** New functions must fit onto the existing 1px grid layout. If a feature requires introducing gradients or circular elements that break grid rules, it is rejected.

