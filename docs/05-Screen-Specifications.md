# Chotify Screen Specifications
**Version:** 1.0.0  
**Status:** Production-Ready Screen Bible  
**Target Platform:** Web (Desktop, Mobile, Tablet)  

---

## Introduction & Global Screen Matrix
This document serves as the Screen Bible for Chotify. It specifies the configuration, layout models, state matrix, and API requirements for all 27 distinct viewports. 

All screens are structured on the 1px grid layout system defined in [docs/03-Design-System.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/03-Design-System.md) and conform to the navigation hierarchy in [docs/04-Information-Architecture.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/04-Information-Architecture.md).

---

## 1. Landing Screen
*   **Purpose:** Introduce Chotify's brand mission, showcase the AI-native music synthesis capabilities, and convert visiting traffic to registrations.
*   **Primary Goal:** Drive user signup.
*   **Primary Action:** `Get Started` (Routes to `/register`).
*   **Secondary Actions:** `Login` (Routes to `/login`), `Explore Docs` (Scrolls to feature showcase).
*   **Layout Structure:** Centered single-column hero section with split columns for feature showcase panels. Fixed top navigation bar.
*   **Components:** `HeroHeader`, `FeatureSplitGrid`, `VisualizerWidget`, `CTABox`, `GlobalFooter`.
*   **Navigation Entry:** Root URL (`/`).
*   **Navigation Exit:** `/register` or `/login`.
*   **States:**
    *   *Loading:* Visualizer widget shows static wireframe blueprint.
    *   *Empty / Success / Error / Offline:* N/A (Static informational page).
*   **Animations:** Hero headline reveals with a vertical translation fade over 300ms using `spring-standard`.
*   **Responsive Behaviour:** Grid columns collapse to 1-column stack below 768px (`md`).
*   **Accessibility:** ARIA role `banner` on header, high-contrast headings.
*   **Keyboard Shortcuts:** `Enter` on CTA buttons.
*   **Dependencies:** None.
*   **API Requirements:** None.
*   **Future Expansion:** Embed live generative waveform preview player.
*   **Edge Cases:** Fast viewport sizing causing layout overlap; solved via responsive flex layouts.

---

## 2. Authentication Screen
*   **Path:** `/login` & `/register`.
*   **Purpose:** Authenticate users via JWT and request API provider keys.
*   **Primary Goal:** Verify user session.
*   **Primary Action:** `Authenticate` (Submit credentials).
*   **Secondary Actions:** `Continue as Guest` (Routes to guest mode), `Toggle Form Mode` (Switch between Login/Signup).
*   **Layout Structure:** Centered card form overlay on a solid Sand or Carbon canvas background.
*   **Components:** `AuthFormCard`, `APIKeyInputs`, `OAuthFallbackButtons`.
*   **Navigation Entry:** Top header sign-in buttons or direct URL.
*   **Navigation Exit:** `/home` on successful authentication.
*   **States:**
    *   *Loading:* Submit button transitions to disabled state with monospaced `[...]` progress text.
    *   *Success:* Brief flash of `Sage` border before redirect.
    *   *Error:* Input field border glows Crimson; displays error text (e.g. `Invalid credentials`).
    *   *Offline:* Forms disable; shows toast notification: "Authentication requires connection."
*   **Animations:** Active card shifts vertically by 8px on mode toggle via `spring-snappy`.
*   **Responsive Behaviour:** Card widths adjust to full screen on screens below 480px (`xs`).
*   **Accessibility:** Focus moves from Email to Password to Submit button sequentially.
*   **Keyboard Shortcuts:** `Enter` to submit form.
*   **Dependencies:** JWT Auth API, MongoDB.
*   **API Requirements:** `POST /api/auth/login`, `POST /api/auth/register`.
*   **Future Expansion:** Passkey validation integration.
*   **Edge Cases:** Multiple rapid clicks on submit; solved by locking the form status to `Loading` and disabling further clicks.

---

## 3. Home Screen
*   **Path:** `/home`.
*   **Purpose:** Provide the user with their personalized dashboard, showcasing recently played lists, curated recommendations, and prompt templates.
*   **Primary Goal:** Start an audio playback session.
*   **Primary Action:** `Play Curated Mix` (Aura Gold primary button).
*   **Secondary Actions:** `Open AI Studio`, `Explore Playlists`, `Go to Profile`.
*   **Layout Structure:** Standard dashboard grid. Left sidebar, sticky top header, central content area divided into rows, persistent bottom player.
*   **Components:** `RecommendedGrid`, `RecentPlaybacksRow`, `AIPromptsBanner`.
*   **Navigation Entry:** Sidebar `Home` link.
*   **Navigation Exit:** Album pages, artist profiles, or player modals.
*   **States:**
    *   *Loading:* Displays layout skeletons in place of track cards.
    *   *Empty:* Shows generic fallback recommendations (e.g., standard trending playlists).
    *   *Success:* Dynamic grids populate with user data.
    *   *Error:* Replaces grid rows with inline warning tiles.
    *   *Offline:* Content displays local downloaded playlists only.
*   **Animations:** Grid items fade and scale in sequence using a staggered 15ms delay.
*   **Responsive Behaviour:** Grid layouts reflow from 6 columns on desktop to 2 columns on mobile.
*   **Accessibility:** Screen reader reads track titles, artist names, and play actions.
*   **Keyboard Shortcuts:** `Space` to play/pause, `Cmd + K` for search.
*   **Dependencies:** Recents database, recommendations engine.
*   **API Requirements:** `GET /api/user/recommendations`, `GET /api/user/recents`.
*   **Edge Cases:** No listening history (new user); resolved by displaying standard onboarding collections.

---

## 4. Explore Screen
*   **Path:** `/explore`.
*   **Purpose:** Catalog browsing directory for standard audio and community-generated tracks.
*   **Primary Goal:** Discover new music.
*   **Primary Action:** `Play New Releases` (Standard primary button).
*   **Secondary Actions:** `Browse Genre Tags`, `Select Mood Playlist`.
*   **Layout Structure:** Grid directory layout. Category tabs at the top, scrollable grid below.
*   **Components:** `GenrePillsRow`, `NewReleasesGrid`, `MoodPlaylistsGrid`.
*   **Navigation Entry:** Sidebar `Explore` link.
*   **Navigation Exit:** Playlist detail, artist page.
*   **States:** Refer to Section 3 (Home Screen).
*   **Animations:** Hovering a category pill shifts its border highlight smoothly.
*   **Responsive Behaviour:** Tab headers wrap on narrow screens.
*   **Accessibility:** Focus states outline genre pills using the Aura Gold color.
*   **Keyboard Shortcuts:** `Tab` key loops through categories.
*   **Dependencies:** Catalog database.
*   **API Requirements:** `GET /api/catalog/new-releases`, `GET /api/catalog/genres`.

---

## 5. Search Screen
*   **Path:** `/search`.
*   **Purpose:** Unified search engine supporting instant search, keyword tags, and prompt filtering.
*   **Primary Goal:** Locate specific tracks or prompt seeds.
*   **Primary Action:** Input text into the search bar.
*   **Secondary Actions:** `Clear Recent Queries`, `Toggle Search Source (Standard vs. AI)`.
*   **Layout Structure:** Sticky input box at the top, split results panel below.
*   **Components:** `SearchInput`, `RecentSearchTags`, `SearchResultsSplitPanel`.
*   **Navigation Entry:** Sidebar `Search` link, top search bar, or shortcut `Cmd/Ctrl + K`.
*   **Navigation Exit:** Selected track player, artist page, or playlist page.
*   **States:**
    *   *Loading:* Dot-matrix progress line runs under search bar.
    *   *Empty:* Shows recent queries and popular category tags.
    *   *Success:* Results group dynamically as the user types.
    *   *Error:* Displays: "No results matched. Check spelling."
    *   *Offline:* Search triggers queries against the local downloaded database index.
*   **Animations:** Dropdown result sheets open vertically using `spring-snappy`.
*   **Responsive Behaviour:** Grid split layout transforms to single-column results scroll on mobile.
*   **Accessibility:** Input field has an `aria-label="Search tracks, artists, or prompts"`.
*   **Keyboard Shortcuts:** `/` focuses search input immediately.
*   **Dependencies:** ElasticSearch service index.
*   **API Requirements:** `GET /api/search?q=query&filters=source`.
*   **Future Expansion:** Semantic AI search (locate tracks using prompt descriptions).
*   **Edge Cases:** Query character limit reached; solved by truncating inputs to 128 characters.

---

## 6. Artist Screen
*   **Path:** `/artist/:id`.
*   **Purpose:** Profile portfolio of a musical artist, showcasing their tracks, albums, and AI synthesis models.
*   **Primary Goal:** Browse discography.
*   **Primary Action:** `Follow Artist`.
*   **Secondary Actions:** `Play Discography Shuffle`, `View Similar Artists`.
*   **Layout Structure:** Hero banner top section, split columns below: top tracks list on the left, albums grid on the right.
*   **Components:** `ArtistHeroHeader`, `TopTracksList`, `DiscographyGrid`.
*   **Navigation Entry:** Click artist name on track metadata.
*   **Navigation Exit:** Album detail page, track player.
*   **States:**
    *   *Loading:* Skeleton banner.
    *   *Error:* Routes back to previous page with error toast: "Artist details unavailable."
*   **Animations:** Scrolling pushes the artist's name to the top header bar, fading the main banner image.
*   **Responsive Behaviour:** Split layout changes to single-column tabs on tablets.
*   **Accessibility:** Banner has descriptive alt tags.
*   **Keyboard Shortcuts:** `Alt + P` plays popular tracks.
*   **Dependencies:** Artist directory database.
*   **API Requirements:** `GET /api/catalog/artist/:id`.

---

## 7. Album Screen
*   **Path:** `/album/:id`.
*   **Purpose:** List and manage tracks within a specific album.
*   **Primary Goal:** Stream a complete compilation.
*   **Primary Action:** `Play Album` (Aura Gold primary button).
*   **Secondary Actions:** `Bookmark Album`, `Share Album Link`.
*   **Layout Structure:** Layout split: Left side shows album details (large art, description), right side scrolls through the tracklist.
*   **Components:** `AlbumDetailsCard`, `TracksTableList`.
*   **Navigation Entry:** Click album art on cards.
*   **Navigation Exit:** Track player.
*   **States:** Refer to Section 6.
*   **Animations:** Album cover art scales up on hover via `spring-standard`.
*   **Responsive Behaviour:** Details move above the tracklist on mobile screens.
*   **Accessibility:** Tracklist uses standard HTML `<table>` roles with custom aria rows.
*   **Dependencies:** Catalog database.
*   **API Requirements:** `GET /api/catalog/album/:id`.

---

## 8. Song Details Screen
*   **Path:** `/song/:id`.
*   **Purpose:** Detail view of a single track, displaying comprehensive metadata, production parameters, and generation seeds (for AI tracks).
*   **Primary Goal:** View stem structures and parameters.
*   **Primary Action:** `Play Song`.
*   **Secondary Actions:** `Copy Prompt Seed` (for AI tracks), `Download Stems`, `View Original Artist`.
*   **Layout Structure:** Split layout. Left displays large track cover art; right shows parameter panels.
*   **Components:** `TrackArtPanel`, `MetadataConsole`, `PromptDetailsBox`.
*   **Navigation Entry:** Three-dot menu option `View Track Details`.
*   **Navigation Exit:** Return to previous page.
*   **States:** Detailed metadata values use monospaced text. Skeletons represent timeline graphs.
*   **Animations:** Prompt detail parameters reveal using a vertical spring drawer.
*   **Responsive Behaviour:** Parameters reflow to the bottom of the layout on screens below 768px (`md`).
*   **Accessibility:** Output values use high-contrast text.
*   **Keyboard Shortcuts:** `C` copies the prompt seed parameters to the clipboard.
*   **Dependencies:** Track database.
*   **API Requirements:** `GET /api/catalog/song/:id`.

---

## 9. Music Player Screen
*   **Path:** Active modal view (`/player`).
*   **Purpose:** Primary workspace for audio control. Displays the current track, playback progress, visual timeline, volume settings, and device output.
*   **Primary Goal:** Control active audio.
*   **Primary Action:** `Play/Pause Toggle`.
*   **Secondary Actions:** `Skip Track`, `Scrub Timeline`, `Adjust Volume`, `Open Lyrics`, `Open Queue`.
*   **Layout Structure:** Screen-overlay modal (desktop) or sliding bottom drawer (mobile).
*   **Components:** `TimelineSlider`, `PlaybackControls`, `VolumeControlPanel`, `LyricsToggle`.
*   **Navigation Entry:** Click the active persistent player dock.
*   **Navigation Exit:** Swipe down on mobile or click backdrop on desktop.
*   **States:**
    *   *Buffering:* Progress bar glows with a slow pulse.
    *   *Offline:* Displays cached indicator: `[ OFFLINE PLAYBACK ]`.
*   **Animations:** Expanding the player drawer scales the cover art and rotates control icons into position via `spring-heavy`.
*   **Responsive Behaviour:** Volume slider hides on compact mobile screens, replaced by the device's hardware buttons.
*   **Accessibility:** Focus states highlight control buttons.
*   **Keyboard Shortcuts:** `Space` toggles play, `Right/Left arrow` scrubs timeline.
*   **Dependencies:** Audio Engine.
*   **API Requirements:** `POST /api/user/analytics/playback-log`.

---

## 10. Queue Screen
*   **Path:** Active modal sidebar drawer (`/queue`).
*   **Purpose:** Manage the upcoming list of playback audio files.
*   **Primary Goal:** Reorder upcoming songs.
*   **Primary Action:** Drag-to-reorder list item.
*   **Secondary Actions:** `Clear Queue`, `Add Next Track`.
*   **Layout Structure:** Right sidebar drawer (desktop) or vertical full-screen overlay sheet (mobile).
*   **Components:** `ActiveTrackCard`, `QueueListItems`, `DragHandleWidget`.
*   **Navigation Entry:** Click Queue icon in player.
*   **Navigation Exit:** Close sidebar.
*   **States:** Empty queue state displays: "Queue is empty. Add tracks to queue."
*   **Animations:** Dragging items displays a spring-loaded drag highlight. Sibling items shift dynamically to accommodate list changes.
*   **Responsive Behaviour:** Mobile view displays full-screen.
*   **Accessibility:** Alt tags describe drag action controls.
*   **Keyboard Shortcuts:** `Esc` closes drawer.
*   **Dependencies:** Zustand queue store.

---

## 11. Lyrics Screen
*   **Path:** Active modal side panel (`/lyrics`).
*   **Purpose:** Display time-synced lyrics for the playing track.
*   **Primary Goal:** Read lyrics in sync with the song.
*   **Primary Action:** Scroll to current line.
*   **Secondary Actions:** `Toggle Lyric Translation`, `Share Lyric Snippet`.
*   **Layout Structure:** Vertical scrolling layout. Subtitle lines display in large type sizes.
*   **Components:** `ScrollingLyricsContainer`, `LyricSnippetSelector`.
*   **Navigation Entry:** Click Lyrics icon in player.
*   **Navigation Exit:** Close sidebar.
*   **States:** Active lyric lines are highlighted in white; inactive lines are muted gray.
*   **Animations:** The text container scrolls smoothly as each line is played, matching the song progress.
*   **Responsive Behaviour:** Text sizes down on mobile screens to prevent truncation.
*   **Accessibility:** High-contrast text matches AA standards.
*   **Keyboard Shortcuts:** `Esc` closes lyrics panel.
*   **Dependencies:** Lyrics synchronization API.
*   **API Requirements:** `GET /api/catalog/song/:id/lyrics`.

---

## 12. Library Screen
*   **Path:** `/library`.
*   **Purpose:** Root container for all user assets: liked playlists, downloads, and custom prompt synthesis history.
*   **Primary Goal:** Access saved tracks.
*   **Primary Action:** Open `Liked Songs` playlist.
*   **Secondary Actions:** `Create New Playlist`, `Import Stems`.
*   **Layout Structure:** Grid directory. Split panel tabs on the left, content area on the right.
*   **Components:** `LibrarySidebarTabs`, `PlaylistsGrid`, `GenerationsGrid`.
*   **Navigation Entry:** Sidebar `Library` link.
*   **Navigation Exit:** Playlist detail, AI Composer.
*   **States:** Refer to Section 3.
*   **Animations:** Content panels fade and slide during layout changes.
*   **Responsive Behaviour:** Split sidebar tabs transform to a top navigation bar on mobile screen sizes.
*   **Accessibility:** Focus states highlight library directories.
*   **Keyboard Shortcuts:** `Alt + L` goes to Library.
*   **Dependencies:** User library database.
*   **API Requirements:** `GET /api/user/library`.

---

## 13. Playlist Screen
*   **Path:** `/playlist/:id`.
*   **Purpose:** Detail view for standard user-curated and AI-synthesized playlists.
*   **Primary Goal:** Manage playlist tracks.
*   **Primary Action:** `Play Playlist` (Aura Gold primary button).
*   **Secondary Actions:** `Remove Track`, `Reorder Tracks`, `Share Playlist Link`.
*   **Layout Structure:** Split layout. Left displays large cover art and description; right scrolls through the tracklist.
*   **Components:** `PlaylistDetailsCard`, `TracksTableList`.
*   **Navigation Entry:** Click playlist card.
*   **Navigation Exit:** Track player.
*   **States:**
    *   *Empty:* Displays empty state blueprint.
*   **Animations:** Deleting an item scales the container down, and the tracks below spring upward to fill the layout.
*   **Responsive Behaviour:** Sidebar detail moves above the tracklist on mobile.
*   **Accessibility:** Table has clear row structures for screen readers.
*   **Keyboard Shortcuts:** `Alt + P` plays popular tracks.
*   **Dependencies:** Playlists database.
*   **API Requirements:** `GET /api/user/playlist/:id`.

---

## 14. AI Studio Screen
*   **Path:** `/studio`.
*   **Purpose:** Central workspace console for all generative audio utilities.
*   **Primary Goal:** Launch a synthesis tool.
*   **Primary Action:** Open `AI Composer`.
*   **Secondary Actions:** `Open Remix Deck`, `Explore Prompt Library`, `Configure Provider API Keys`.
*   **Layout Structure:** Dashboard split. Left shows workspace categories; right shows output logs.
*   **Components:** `StudioModulesGrid`, `RecentGenerationsLog`.
*   **Navigation Entry:** Sidebar `AI Studio` link.
*   **Navigation Exit:** Composer, Remix, Settings.
*   **States:**
    *   *Disabled:* AI tools show locked overlay if API keys are missing.
*   **Animations:** Workspace widgets scale up on hover via `spring-standard`.
*   **Responsive Behaviour:** Dashboard layout transforms to a single-column layout on mobile viewports.
*   **Accessibility:** High contrast icons identify each AI module.
*   **Keyboard Shortcuts:** `Cmd/Ctrl + G` opens AI Studio.
*   **Dependencies:** AI Configuration store.
*   **API Requirements:** `GET /api/ai/studio/status`.

---

## 15. AI Composer Screen
*   **Path:** `/studio/composer`.
*   **Purpose:** Workspace to write prompts and generate tracks using Suno/Udio engines.
*   **Primary Goal:** Synthesize audio.
*   **Primary Action:** `Synthesize` (Aura Gold primary button).
*   **Secondary Actions:** `Reset Parameters`, `Load Prompt Template`, `Download Preview Stems`.
*   **Layout Structure:** Workspace split-pane. Left displays parameter sliders; right displays the prompt console and output log.
*   **Components:** `PromptEditor`, `ParametersPanel`, `WaveformProgressWidget`.
*   **Navigation Entry:** AI Studio dashboard.
*   **Navigation Exit:** `/library/generations`.
*   **States:**
    *   *Loading:* Prompt console glows with `aura-pulse` animation; displays rendering logs.
*   **Animations:** Waveforms expand on generation start.
*   **Responsive Behaviour:** Mobile collapses to a single-column layout with parameters tucked into an overlay drawer.
*   **Accessibility:** Focus states highlight parameter sliders.
*   **Keyboard Shortcuts:** `Enter` on prompt triggers synthesis.
*   **Dependencies:** AI Gateway.
*   **API Requirements:** `POST /api/ai/composer/synthesize`.
*   **Future Expansion:** Multitrack generation workspace.
*   **Edge Cases:** API timeout; handled by restoring the prompt string and showing a retry button.

---

## 16. AI Playlist Screen
*   **Path:** `/studio/playlist-gen`.
*   **Purpose:** Generative playlist workspace. Outputs custom lists based on prompt inputs (mood, weather, etc.).
*   **Primary Goal:** Generate custom playlists.
*   **Primary Action:** `Generate Playlist`.
*   **Secondary Actions:** `Toggle History Context`, `Save Playlist Output`.
*   **Layout Structure:** Centered console input panel, horizontal results scroll below.
*   **Components:** `ContextFormInputs`, `GeneratedTrackCarousel`.
*   **Navigation Entry:** AI Studio dashboard.
*   **Navigation Exit:** Playlist detail page.
*   **States:**
    *   *Loading:* Carousel displays animated shimmer skeletons.
*   **Animations:** Tracks enter sequentially in a staggered spring slide.
*   **Responsive Behaviour:** Input fields stack vertically on mobile.
*   **Accessibility:** Form fields use explicit labels.
*   **Keyboard Shortcuts:** `Enter` to generate.
*   **Dependencies:** Recommendations Engine.
*   **API Requirements:** `POST /api/ai/playlist/generate`.

---

## 17. AI Remix Screen
*   **Path:** `/studio/remix`.
*   **Purpose:** Modify uploaded tracks using style models (Lofi, Synthwave, Jazz).
*   **Primary Goal:** Generate a remixed track.
*   **Primary Action:** `Generate Remix`.
*   **Secondary Actions:** `Upload Source MP3`, `Select Style Profile`.
*   **Layout Structure:** Split layout. Left displays file upload dropzone; right displays style models.
*   **Components:** `AudioDropzone`, `StyleSelectorCards`, `SynthesisProgress`.
*   **Navigation Entry:** AI Studio dashboard.
*   **Navigation Exit:** `/library/generations`.
*   **States:**
    *   *Error:* Show red dropzone borders if the uploaded file format is invalid.
*   **Animations:** Dropzone glows with a subtle highlight on file hover.
*   **Responsive Behaviour:** Styles cards reflow to a scrollable row on mobile screens.
*   **Accessibility:** Dropzone is fully accessible via keyboard triggers.
*   **Keyboard Shortcuts:** `Esc` cancels active file uploads.
*   **Dependencies:** Storage API, AI Gateway.
*   **API Requirements:** `POST /api/ai/remix/upload`, `POST /api/ai/remix/synthesize`.

---

## 18. AI Lyrics Screen
*   **Path:** `/studio/lyrics-gen`.
*   **Purpose:** Generate lyrics using prompt parameters.
*   **Primary Goal:** Synthesize lyrics.
*   **Primary Action:** `Generate Lyrics`.
*   **Secondary Actions:** `Copy Output Lyrics`, `Save Lyrics to Prompt`.
*   **Layout Structure:** Left panel displays prompt options; right panel displays scrolling terminal-like output window.
*   **Components:** `LyricsPromptForm`, `OutputTerminalConsole`.
*   **Navigation Entry:** AI Studio dashboard.
*   **Navigation Exit:** AI Studio.
*   **States:** Output displays dynamically line-by-line as it's generated.
*   **Animations:** Output scrolls smoothly as text is added.
*   **Responsive Behaviour:** Left/right split changes to top/bottom layout on mobile.
*   **Accessibility:** High contrast colors ensure terminal text is legible.
*   **Keyboard Shortcuts:** `Ctrl + L` triggers generation.
*   **Dependencies:** OpenAI/Gemini client gateway.
*   **API Requirements:** `POST /api/ai/lyrics/generate`.

---

## 19. AI Cover Art Screen
*   **Path:** `/studio/cover-art`.
*   **Purpose:** Generate album cover art based on seed prompts.
*   **Primary Goal:** Synthesize cover art.
*   **Primary Action:** `Generate Cover Art`.
*   **Secondary Actions:** `Download Image`, `Apply Cover to Playlist`.
*   **Layout Structure:** Left panel displays parameters; right panel displays the rendering canvas.
*   **Components:** `ArtParametersForm`, `ImageCanvasRenderer`.
*   **Navigation Entry:** AI Studio dashboard.
*   **Navigation Exit:** AI Studio.
*   **States:** Loading states display animated skeleton shapes matching the canvas dimensions.
*   **Animations:** Rendered art reveals with a linear cross-fade animation.
*   **Responsive Behaviour:** Canvas matches viewport widths on mobile.
*   **Accessibility:** Alternative text fields permit adding description metadata to generated images.
*   **Keyboard Shortcuts:** `S` saves the image.
*   **Dependencies:** Image generation API.
*   **API Requirements:** `POST /api/ai/cover-art/generate`.

---

## 20. Prompt Library Screen
*   **Path:** `/studio/prompts`.
*   **Purpose:** Repository of the user's saved prompt templates.
*   **Primary Goal:** Load a saved prompt.
*   **Primary Action:** `Apply Prompt to Composer`.
*   **Secondary Actions:** `Delete Prompt`, `Share Prompt Code`.
*   **Layout Structure:** Standard grid panel. Left sidebar directory, central grid cards.
*   **Components:** `PromptsCategoryTabs`, `PromptTemplateCard`.
*   **Navigation Entry:** AI Studio navigation.
*   **Navigation Exit:** AI Composer.
*   **States:** Refer to Section 3.
*   **Animations:** Cards expand slightly on hover.
*   **Responsive Behaviour:** Grid adjusts column numbers dynamically.
*   **Accessibility:** Aria tables detail prompt parameters.
*   **Keyboard Shortcuts:** `Enter` on template card applies prompt.
*   **Dependencies:** Prompts database.
*   **API Requirements:** `GET /api/user/prompts`.

---

## 21. History Screen
*   **Path:** `/library/history`.
*   **Purpose:** Scrollable directory of user playbacks and AI generation logs.
*   **Primary Goal:** Replay a previously listened track.
*   **Primary Action:** Click list item to play.
*   **Secondary Actions:** `Clear History Log`, `Filter Log by Date`.
*   **Layout Structure:** Vertical list layout. Divided by 1px borders.
*   **Components:** `HistoryListContainer`, `HistoryItemRow`.
*   **Navigation Entry:** Library menu directory.
*   **Navigation Exit:** Track player.
*   **States:** Refer to Section 3.
*   **Animations:** Rows fade and slide in sequence on load.
*   **Responsive Behaviour:** Details hide on compact mobile viewports.
*   **Accessibility:** Focus moves down list items sequentially.
*   **Keyboard Shortcuts:** `Esc` returns to Library.
*   **Dependencies:** Recents database.
*   **API Requirements:** `GET /api/user/history`.

---

## 22. Notifications Screen
*   **Path:** `/notifications`.
*   **Purpose:** Display system alerts, shared track links, and AI generation statuses.
*   **Primary Goal:** View and action notifications.
*   **Primary Action:** Click notification to open reference page.
*   **Secondary Actions:** `Mark All as Read`, `Delete Notification`.
*   **Layout Structure:** Scrollable vertical list centered in the viewport.
*   **Components:** `NotificationsHeader`, `NotificationItemCard`.
*   **Navigation Entry:** Header notification bell icon.
*   **Navigation Exit:** Target page reference.
*   **States:**
    *   *Empty:* Shows "No notifications."
*   **Animations:** Items fade out horizontally on deletion.
*   **Responsive Behaviour:** Adjusts to full screen layout on mobile devices.
*   **Accessibility:** Aria alert roles read new notification texts.
*   **Keyboard Shortcuts:** `Esc` closes screen.
*   **Dependencies:** Notifications service.
*   **API Requirements:** `GET /api/user/notifications`.

---

## 23. Profile Screen
*   **Path:** `/profile`.
*   **Purpose:** Display user detail records, preferences, and public playlists.
*   **Primary Goal:** View user account summary.
*   **Primary Action:** `Edit Profile Details`.
*   **Secondary Actions:** `Log Out`, `View Public Playlists`.
*   **Layout Structure:** Centered column layout, split rows for playlist display.
*   **Components:** `UserProfileCard`, `PublicPlaylistsGrid`.
*   **Navigation Entry:** Header avatar dropdown.
*   **Navigation Exit:** `/login` on logout.
*   **States:** Refer to Section 3.
*   **Animations:** Layout elements slide up on load.
*   **Responsive Behaviour:** Avatar scales down on small mobile screens.
*   **Accessibility:** Focus loops through details card actions.
*   **Keyboard Shortcuts:** `Esc` returns to Home.
*   **Dependencies:** User database.
*   **API Requirements:** `GET /api/user/profile`.

---

## 24. Settings Screen
*   **Path:** `/settings`.
*   **Purpose:** Configuration hub for accounts, playbacks, layouts, and API keys.
*   **Primary Goal:** Save key configurations.
*   **Primary Action:** `Validate API Key` (Aura Gold primary button).
*   **Secondary Actions:** `Reset Settings`, `Export User Profile JSON`.
*   **Layout Structure:** Left panel displays settings tabs (Account, Playback, Providers); right panel displays active parameters form.
*   **Components:** `SettingsTabsList`, `PlaybackForm`, `ProvidersForm`.
*   **Navigation Entry:** Sidebar, header menu.
*   **Navigation Exit:** Previous active view.
*   **States:**
    *   *Loading:* Validation button displays monospaced check log.
*   **Animations:** Settings panels fade and slide horizontally on tab change.
*   **Responsive Behaviour:** Split layouts collapse to a single-column layout on mobile viewports.
*   **Accessibility:** Focus highlights the active form field.
*   **Keyboard Shortcuts:** `Esc` exits settings.
*   **Dependencies:** Config store.
*   **API Requirements:** `POST /api/user/settings`.

---

## 25. Admin Screen
*   **Path:** `/admin`.
*   **Purpose:** Systems dashboard for staff management (track approvals, analytics, and moderation).
*   **Primary Goal:** Manage catalog assets.
*   **Primary Action:** `Approve Track`.
*   **Secondary Actions:** `Ban User Profile`, `View Live Server Load`.
*   **Layout Structure:** Multi-column dashboard grid.
*   **Components:** `AdminControlBar`, `ModerationList`, `AnalyticsChart`.
*   **Navigation Entry:** Direct URL (Staff credentials required).
*   **Navigation Exit:** `/home`.
*   **States:**
    *   *Error:* Shows error state if guest attempt is detected (Access Denied).
*   **Animations:** Chart lines render with spring path transitions.
*   **Responsive Behaviour:** Layout elements collapse to scrollable vertical lists on mobile.
*   **Accessibility:** High contrast tables document database entities.
*   **Keyboard Shortcuts:** `Ctrl + A` approves active track.
*   **Dependencies:** Admin database client.
*   **API Requirements:** `GET /api/admin/moderation`, `POST /api/admin/action`.

---

## 26. Error Pages
*   **Path:** Dynamic error catch.
*   **Purpose:** Handle unexpected errors (e.g. 404, 500) and help the user return to a working state.
*   **Primary Goal:** Guide user back to safety.
*   **Primary Action:** `Go to Home Page` (Primary button).
*   **Secondary Actions:** `Display Error Log Console`, `Send Report`.
*   **Layout Structure:** Centered single-column error console sheet.
*   **Components:** `ErrorCardConsole`, `DiagnosticDetailsBox`.
*   **Navigation Entry:** Dynamic routing exception triggers.
*   **Navigation Exit:** `/home` or `/login`.
*   **States:** Diagnostic log area displays monospaced debugger trace strings.
*   **Animations:** Error console shifts slightly horizontally on layout mismatch error.
*   **Responsive Behaviour:** Text sizes wrap on compact viewports.
*   **Accessibility:** Aria alerts vocalize error statuses instantly.
*   **Keyboard Shortcuts:** `Enter` runs home redirect action.
*   **Dependencies:** Crash reporting module.
*   **API Requirements:** `POST /api/logger/crash-report`.

---

## 27. Offline Page
*   **Path:** Dynamic network catch.
*   **Purpose:** Manage connection loss without interrupting the app experience.
*   **Primary Goal:** Direct user to offline assets.
*   **Primary Action:** `Open Offline Downloads` (Primary button).
*   **Secondary Actions:** `Retry Connection`.
*   **Layout Structure:** Centered console sheet.
*   **Components:** `OfflineCard`, `RetryIndicator`.
*   **Navigation Entry:** Reconnection failures.
*   **Navigation Exit:** Return to previous page.
*   **States:** Page monitors connection status in the background.
*   **Animations:** Reconnection indicator rotates continuously during retry attempts.
*   **Responsive Behaviour:** Layout scales down on mobile viewports.
*   **Accessibility:** Clean descriptive text outlines current status.
*   **Keyboard Shortcuts:** `Space` runs retry action.
*   **Dependencies:** Network observer service.
*   **API Requirements:** None.
