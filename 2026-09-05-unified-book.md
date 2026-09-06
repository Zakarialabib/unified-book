# Unified Book Platform — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge The Astro Ecosystem, Reactivity with Svelte, and Systems Programming in Rust into one unified book platform with Svelte interactive components, enhanced TTS, syntax highlighting with code copy, theming, and client documentation generation.

**Architecture:** Astro 5 + MDX as the content backbone, Svelte 5 components embedded as Astro islands for interactive code examples, a unified theming system with CSS custom properties and a component library, enhanced TTS via the TTS skill (z-ai-web-dev-sdk), and a client doc generation pipeline.

**Tech Stack:** Astro 5, MDX, Svelte 5 (runes), TypeScript, Tailwind CSS, Shiki (syntax highlighting), z-ai-web-dev-sdk (TTS/ASR), localStorage for persistence, Vite.

---

## Project Structure

```
unified-book/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── favicon.svg
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── astro/
│   │   │   └── chapters/  (9 .mdx files)
│   │   ├── svelte/
│   │   │   └── chapters/  (9 .mdx files)
│   │   └── rust/
│   │       └── chapters/  (9 .mdx files)
│   ├── components/
│   │   ├── TopBar.astro
│   │   ├── ThemeToggle.astro
│   │   ├── CodeBlock.astro          # syntax highlight + copy
│   │   ├── CodeExample.astro        # src → output display
│   │   ├── InteractiveDemo.astro    # Svelte island component
│   │   ├── VoicePlayer.astro        # enhanced TTS controls
│   │   ├── ThemeLibrary.astro       # theming component library
│   │   └── DocGenerator.astro       # client docs generation
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── ChapterLayout.astro
│   ├── pages/
│   │   ├── index.astro              # unified cover + TOC
│   │   ├── chapters/
│   │   │   └── [slug].astro
│   │   └── docs/
│   │       └── generate.astro       # client doc generation
│   ├── scripts/
│   │   ├── chapter.ts               # unified interactivity
│   │   └── voice.ts                 # enhanced TTS engine
│   ├── styles/
│   │   └── book.css                 # unified theming system
│   └── lib/
│       ├── themes.ts                # theme definitions
│       └── doc-template.ts          # doc generation templates
└── components-library/              # reusable Svelte component library
    ├── src/
    │   ├── lib/
    │   │   ├── CodeMirror.svelte
    │   │   ├── ThemeProvider.svelte
    │   │   ├── VoiceControl.svelte
    │   │   └── DocExport.svelte
    │   └── index.ts
```

---

### Task 1: Project Foundation

**Files:**

- Create: `unified-book/package.json`
- Create: `unified-book/astro.config.mjs`
- Create: `unified-book/tsconfig.json`

**Step 1:** Create `package.json` with all dependencies

```json
{
  "name": "unified-book-platform",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.3.0",
    "@astrojs/svelte": "^5.0.0",
    "astro": "^5.12.0",
    "svelte": "^5.0.0",
    "shiki": "^1.0.0",
    "z-ai-web-dev-sdk": "^1.0.0"
  }
}
```

**Step 2:** Create `astro.config.mjs` with MDX + Svelte integrations

**Step 3:** Create `tsconfig.json`

---

### Task 2: Content Collections — Merged 27 Chapters

**Files:**

- Create: `unified-book/src/content.config.ts`
- Create: `unified-book/src/content/astro/chapters/*.mdx` (9 files)
- Create: `unified-book/src/content/svelte/chapters/*.mdx` (9 files)
- Create: `unified-book/src/content/rust/chapters/*.mdx` (9 files)

**Step 1:** Define three content collections (astro, svelte, rust) in `content.config.ts`

**Step 2:** Copy all 27 chapter MDX files from the three source projects

**Step 3:** Each collection has schema: order, title, subtitle, description, level, series

---

### Task 3: Unified Theming System

**Files:**

- Create: `unified-book/src/styles/book.css`
- Create: `unified-book/src/lib/themes.ts`
- Create: `unified-book/src/components/ThemeLibrary.astro`

**Step 1:** Define theme tokens for all three series (violet Ae, orange-red Sv, oxblood Fe) plus mixed themes

**Step 2:** Create CSS custom property system with `[data-theme]` selectors

**Step 3:** Build ThemeToggle component with theme switching

**Step 4:** Create ThemeLibrary component showing all available themes

---

### Task 4: Syntax Highlighting + Code Copy

**Files:**

- Create: `unified-book/src/components/CodeBlock.astro`
- Create: `unified-book/src/components/CodeExample.astro`

**Step 1:** Build CodeBlock component using Shiki for syntax highlighting

**Step 2:** Add copy-to-clipboard button

**Step 3:** Build CodeExample component showing src code alongside generated output

---

### Task 5: Enhanced TTS System

**Files:**

- Create: `unified-book/src/components/VoicePlayer.astro`
- Create: `unified-book/src/scripts/voice.ts`

**Step 1:** Load TTS skill and integrate z-ai-web-dev-sdk for better voice

**Step 2:** Build VoicePlayer component with voice selection, speed control

**Step 3:** Add text-to-speech with highlight synchronization

---

### Task 6: Svelte Interactive Components

**Files:**

- Create: `unified-book/src/components/InteractiveDemo.astro`
- Create: `unified-book/components-library/src/lib/*.svelte`

**Step 1:** Create Svelte island components for interactive code demos

**Step 2:** Build CodeMirror.svelte for editable code examples

**Step 3:** Build ThemeProvider.svelte for runtime theme switching

**Step 4:** Build VoiceControl.svelte for TTS controls

**Step 5:** Build DocExport.svelte for client documentation export

---

### Task 7: Client Documentation Generation

**Files:**

- Create: `unified-book/src/pages/docs/generate.astro`
- Create: `unified-book/src/lib/doc-template.ts`
- Create: `unified-book/src/components/DocGenerator.astro`

**Step 1:** Build doc generation pipeline that reads content collections

**Step 2:** Create template system for educational/promotional docs

**Step 3:** Add export functionality (HTML, PDF-ready)

---

### Task 8: Unified Layouts & Pages

**Files:**

- Create: `unified-book/src/layouts/Base.astro`
- Create: `unified-book/src/layouts/ChapterLayout.astro`
- Create: `unified-book/src/pages/index.astro`
- Create: `unified-book/src/pages/chapters/[slug].astro`

**Step 1:** Build unified Base layout with theme support

**Step 2:** Build ChapterLayout with navigation, TOC, TTS bar

**Step 3:** Build unified index page with all three series

**Step 4:** Build [slug].astro with collection-aware routing

---

### Task 9: Integration & Build

**Step 1:** Install dependencies
**Step 2:** Run dev server and verify all chapters
**Step 3:** Test TTS, theming, code copy, Svelte islands
**Step 4:** Build and verify output
**Step 5:** Commit

---

## Theme Color Library

| Series                           | Accent            | CSS Variable | Description         |
| -------------------------------- | ----------------- | ------------ | ------------------- |
| Astro Ecosystem (Ae)             | #5628b4           | `--accent`   | Violet              |
| Reactivity with Svelte (Sv)      | #c92907           | `--accent`   | Orange-red          |
| Systems Programming in Rust (Fe) | #c92907           | `--accent`   | Oxblood             |
| Mixed (Ae+Sv)                    | #5628b4 + #c92907 | `--accent`   | Violet-Orange blend |
| Mixed (Sv+Fe)                    | #c92907 + #c92907 | `--accent`   | Warm blend          |
| Mixed (All)                      | #5628b4           | `--accent`   | Unified violet      |

---

## Acceptance Criteria

1. All 27 chapters accessible from one unified site
2. Svelte components render as interactive islands within Astro pages
3. Code blocks have syntax highlighting + copy button
4. TTS works with enhanced voices (not just Web Speech API)
5. Theme switching works across all three series
6. Code Example component shows src → generated output
7. Client documentation can be generated from content
8. Build succeeds with `astro build`
9. All interactive features work without errors
