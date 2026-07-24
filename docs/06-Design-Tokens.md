# Chotify Design Tokens
**Version:** 1.0.0  
**Status:** Unified Variables Directory  
**Target Platform:** Web / CSS / Tailwind CSS  

---

## 1. Source of Truth
To ensure consistency and prevent architectural duplication, **every visual parameter, design token, color value, and spring physics coefficient is defined exclusively in [docs/03-Design-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md)**. 

No literal values (e.g., hex codes, pixel increments, or millisecond durations) should be defined outside of that file. This document serves as the structural reference index mapping CSS variable names to their definitions.

---

## 2. Token Naming Index & References

All UI styling elements reference CSS custom properties conforming to the scope convention detailed in [docs/03-Design-System.md#30-css-variable-naming-convention](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#30-css-variable-naming-convention).

### Colors Reference Directory
Refer to [docs/03-Design-System.md#4-color-palette](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#4-color-palette) for exact hex codes and semantic parameters.
*   `--chotify-color-sand-50` (Primary Light Background)
*   `--chotify-color-sand-100` (Secondary Light Background)
*   `--chotify-color-white` (Light Surface)
*   `--chotify-color-sand-300` (Primary Light Border)
*   `--chotify-color-sand-200` (Secondary Light Border)
*   `--chotify-color-ink-950` (Primary Light Text)
*   `--chotify-color-ink-600` (Secondary Light Text)
*   `--chotify-color-ink-400` (Muted Light Text)
*   `--chotify-color-carbon-950` (Primary Dark Background)
*   `--chotify-color-carbon-900` (Secondary Dark Background)
*   `--chotify-color-carbon-850` (Dark Surface)
*   `--chotify-color-carbon-800` (Primary Dark Border)
*   `--chotify-color-carbon-700` (Secondary Dark Border)
*   `--chotify-color-platinum-50` (Primary Dark Text)
*   `--chotify-color-platinum-400` (Secondary Dark Text)
*   `--chotify-color-platinum-600` (Muted Dark Text)
*   `--chotify-color-aura-gold` / `--chotify-color-aura-gold-dark` (Core AI Highlights)
*   `--chotify-color-aura-glow` (Glowing Shadows)
*   `--chotify-color-mercury-platinum` (AI Processors)
*   `--chotify-color-success` / `--chotify-color-error` / `--chotify-color-warning` (Semantic Indicators)

### Typography & Fonts Index
Refer to [docs/03-Design-System.md#5-typography](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#5-typography) for font scale steps and line heights.
*   `--chotify-font-headings` (Heading family)
*   `--chotify-font-body` (Body family)
*   `--chotify-font-mono` (Monospace console family)
*   Font sizes: `text-xs`, `text-sm`, `text-base`, `text-md`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`.

### Spacing & Grid Scales
Refer to [docs/03-Design-System.md#6-8pt-spacing-system](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#6-8pt-spacing-system) and [#9-grid-system](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#9-grid-system) for exact layouts.
*   Paddings and Gaps: `--chotify-space-1` (4px) through `--chotify-space-16` (64px).
*   Grip columns and responsive thresholds: `xs` (375px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).

### Border Radii & Border Widths
Refer to [docs/03-Design-System.md#7-border-radius-system](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#7-border-radius-system).
*   Variables: `--chotify-radius-none` (0px) up to `--chotify-radius-xl` (16px) and `--chotify-radius-full` (9999px).
*   `--chotify-border-width-thin` (1px) and `--chotify-border-width-thick` (1.5px).

### Shadows, Elevation & Layering (Z-Index)
Refer to [docs/03-Design-System.md#8-shadows--elevation](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#8-shadows--elevation) and [docs/04-Information-Architecture.md#35-elevation-system](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/04-Information-Architecture.md#35-elevation-system).
*   Shadow bindings: `--chotify-shadow-flat`, `--chotify-shadow-sm`, `--chotify-shadow-md`, `--chotify-shadow-lg`, `--chotify-shadow-glow`.
*   Z-index allocations: `--chotify-z-base` (0) up to `--chotify-z-toast-notification` (70).

### Motion, Durations & Springs
Refer to [docs/03-Design-System.md#14-motion-guidelines](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#14-motion-guidelines) and [docs/08-Animation-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/08-Animation-System.md).
*   Duration bounds: `--chotify-duration-instant` (50ms) up to `--chotify-duration-deliberate` (500ms).
*   Spring configs: `spring-snappy`, `spring-standard`, `spring-heavy`.

---

## 3. Tailwind CSS v4 Theme Integration
To implement the variables in Tailwind CSS v4, refer directly to the CSS `@theme` mapping in [docs/03-Design-System.md#31-tailwind-theme-tokens](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md#31-tailwind-theme-tokens). Do not define configurations in JavaScript `tailwind.config.js` formats.
