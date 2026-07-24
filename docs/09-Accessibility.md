# Chotify Accessibility Guide
**Version:** 1.0.0  
**Status:** WCAG AA Compliance Specification  
**Target Platform:** Web (Desktop, Mobile, Tablet)  

---

## 1. Introduction
Chotify is designed to be accessible to all users, conforming to the Web Content Accessibility Guidelines (WCAG) 2.1 AA standards. This document specifies keyboard interactions, screen reader semantics, focus configurations, and visual guidelines.

---

## 2. Keyboard Navigation

### General Navigation Sequence
*   All interactive elements must be accessible via the standard `Tab` key (forward) and `Shift + Tab` (backward).
*   The focus order must follow a logical reading pattern: 
    ```
    Sidebar Navigation ──> Header Search ──> Main Content Grid ──> Audio Player Dock
    ```

### Focus State Design
*   We never disable focus states. Focused elements must display a clear, high-contrast outline: `1.5px solid var(--chotify-color-aura-gold)` with a `2px` offset.

### Custom Keyboard Shortcuts

| Component | Key Shortcut | Triggered Action |
| :--- | :--- | :--- |
| **Global Player** | `Spacebar` | Toggle play and pause states. |
| | `Right Arrow` | Skip forward 5 seconds on the active audio timeline. |
| | `Left Arrow` | Skip backward 5 seconds on the active audio timeline. |
| | `Up Arrow` | Increase volume levels by 10%. |
| | `Down Arrow` | Decrease volume levels by 10%. |
| | `L` | Save/bookmark the active song. |
| **Global Search** | `/` or `Cmd/Ctrl + K` | Focus the search input field. |
| **AI Studio** | `Cmd/Ctrl + G` | Redirect to the AI Composer workspace. |
| **Modals / Dialogs**| `Escape` | Dismiss the modal or active overlay. |

---

## 3. Screen Reader Semantics & ARIA

### Semantic HTML Layout
Developers must use appropriate HTML5 semantic elements rather than generic `<div>` wrappers:
*   `<nav>`: Main sidebar menus, tab bars.
*   `<main>`: Primary content area.
*   `<header>`: Top navigation bar.
*   `<footer>`: Persistent music player dock.
*   `<article>`: Track lists, album cards.

### ARIA Attributes

```
[Visual Play Button] ──> aria-label="Play track: Sand Dunes by Arnav"
[Waveform Visualizer] ──> aria-label="Active track waveform visualizer"
```

*   **Action Elements:** Non-text button icons (like play, pause, queue toggles) must include descriptive labels: `aria-label="Play track: [Song Title]"`.
*   **Live Regions (`aria-live`):** Generative progress statuses (e.g., active synthesis updates) must use live regions to inform the user of updates:
    *   `<div aria-live="polite">` updates the user once synthesis finishes.
    *   `<div aria-live="assertive">` announces connection failures immediately.
*   **States:** Use `aria-expanded="true/false"` on collapsible folders and drawers.

---

## 4. Focus Management

### Modal Focus Traps
*   When a modal window or configuration sheet opens, keyboard focus must move immediately to the primary element in the modal.
*   Focus must remain trapped inside the modal container during navigation; pressing `Tab` at the end of the modal loops focus back to the first element.
*   When the modal closes, focus must return to the element that triggered it.

### Preventing Focus Loops
*   Hidden or collapsed elements must be removed from the tab sequence using `tabindex="-1"` or `display: none` to prevent keyboard focus from getting trapped on invisible components.

---

## 5. Contrast & Visual Accessibility

### Contrast Ratios
We maintain high contrast ratios to ensure legibility across all layouts:
*   **Body Text Copy:** Minimum contrast ratio of `4.5:1` against background layers.
*   **Large Heading Texts (24px+):** Minimum contrast ratio of `3:1`.
*   **Critical Alerts:** Critical notifications and validation warnings maintain a contrast ratio of `7:1` (AAA standard).

### Scalable Typography
*   We avoid using fixed pixel sizing for text elements. Font sizes are defined using relative `rem` units, allowing the layout to adjust to user font size configurations.

### Color Blind Support
*   Color must never be the only indicator of a state or action.
*   *Validation Warnings:* Form error fields display a warning icon and descriptive error message next to the red border.
*   *Active Playback:* Currently playing items display an active visual equalizer icon next to the song title, rather than relying on color shifts alone.

---

## 6. Sizing & Targets

### Touch Targets
*   **Mobile Screen Layouts:** Interactive targets maintain a minimum size of `44px` x `44px` to prevent accidental clicks.
*   **Desktop Layouts:** Interactive elements maintain a minimum size of `32px` x `32px`.
*   **Target Spacing:** Adjacent interactive elements must be separated by at least 8px to prevent overlapping targets.

---

## 7. Voice Navigation & Device Support
*   Form inputs and slider elements use descriptive labels that map to common voice controls (e.g. "Select BPM", "Submit Prompt").
*   On screen readers, sliders display current values using `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` parameters.

---

## 8. Accessibility Testing Checklist

Developers must verify screens against this checklist before release:

*   [ ] **No-Mouse Walkthrough:** Can the screen be fully navigated and operated using only the `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape` keys?
*   [ ] **Focus Indicator Visibility:** Is the focus ring visible on every interactive element during keyboard navigation?
*   [ ] **Focus Trap Verification:** Does focus remain trapped inside modals until they are closed?
*   [ ] **Screen Reader Labels:** Do all image banners and button icons have descriptive alt tags or aria-labels?
*   [ ] **Live Alerts:** Do background status updates (like track generation updates) use `aria-live` containers?
*   [ ] **Color Shift Check:** Are error messages, active playing states, and selected items identifiable without color?
*   [ ] **Contrast Ratios:** Do text values meet WCAG AA contrast standards?
*   [ ] **Touch Targets:** Do mobile buttons and controls meet the minimum `44px` size requirement?
*   [ ] **Scalable Layouts:** Does the interface scale clean when the browser text size is increased to 200%?
*   [ ] **Reduced Motion check:** Do sliding panels and transitions fall back to instant layouts or simple fades when reduced-motion preferences are enabled?
