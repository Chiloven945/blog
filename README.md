# Chiloven's Blog

A static, trilingual personal blog built with **Nuxt 4**, **Nuxt UI 4**, and **Nuxt Content 3**.
Typography-first and editorial in tone, with a light/dark theme, per-language content, and a small,
dependency-light runtime.

**Live:** <https://www.chiloven.top>

## Features

- **Trilingual** — Simplified Chinese (default), Traditional Chinese, and English, with
  locale-prefixed routes and a language switcher that marks languages whose translation does not
  exist yet.
- **Content-driven** — posts and pages are Markdown/MDC files managed by Nuxt Content; no database,
  CMS, or auth.
- **Reading experience** — sticky table of contents, reading time, previous / next navigation,
  license, footnotes, and comments.
- **Rich Markdown** — syntax-highlighted code with line numbers and copy, callouts, figures,
  galleries, link cards, Spotify embeds, KaTeX math, and custom anchors.
- **Search** — a `Ctrl/Cmd + K` command palette and a shareable `/search?q=`
  page, scoped to the active language.
- **Sections** — a designed homepage, a blog index with article/novel tabs, an archive timeline,
  friends, and free-form content pages.
- **SEO** — canonical URLs, Open Graph, Twitter cards, hreflang alternates, sitemap, and robots.
- **Comments & feed** — lazy, color-mode/locale-aware Giscus comments and an RSS feed at `/rss.xml`
  (legacy alias `/index.xml`).
- **Accessible motion** — reveal animations are an enhancement and respect
  `prefers-reduced-motion`; content is fully visible without JavaScript.

## Tech stack

| Concern                   | Choice                                                   |
|---------------------------|----------------------------------------------------------|
| Runtime / package manager | [Bun](https://bun.sh) 1.4.2                              |
| Framework                 | [Nuxt 4](https://nuxt.com)                               |
| UI primitives             | [Nuxt UI 4](https://ui.nuxt.com)                         |
| Content                   | [Nuxt Content 3](https://content.nuxt.com) + MDC         |
| Images / Fonts            | `@nuxt/image`, `@nuxt/fonts`, self-hosted HarmonyOS Sans |
| i18n                      | `@nuxtjs/i18n` (`zh-cn`, `zh-tw`, `en`)                  |
| SEO                       | `@nuxtjs/sitemap`, `@nuxtjs/robots`                      |
| Comments                  | Giscus                                                   |
| Testing                   | Vitest (unit), Playwright (end-to-end)                   |
| Linting                   | ESLint (`@nuxt/eslint`)                                  |

## Requirements

- **Bun 1.4+** (the project pins `bun@1.4.2` via `packageManager`).
- **Playwright browsers** for the end-to-end suite (see [Testing](#testing)).

## Getting started

```bash
bun install
bun run dev
```

The dev server runs at <http://localhost:3000>.

## Project structure

```text
app/
  assets/css/     theme, typography, motion, and utility layers
  components/     app shell, home, blog, post, search, archives, friends, content
  composables/    content selection, search, archives, navigation, motion, SEO
  layouts/        default, home, post
  pages/          home, blog, search, archives, friends, custom pages, posts
  utils/          date, post, search, locale, and content helpers
content/
  posts/<locale>/    Markdown posts
  pages/<locale>/    custom pages
  data/home/         homepage copy per locale
  data/friends.yml   friend links
i18n/locales/     UI strings per locale
public/           fonts, images, and other static assets
server/           RSS feed routes
shared/           site/post-type configuration and shared types
tests/            unit (Vitest) and e2e (Playwright) tests
tools/            content validation and the Hugo migration script
```

`/dev/style` is an unlisted, `noindex` reference page for design tokens, components, prose, math,
and footnotes. It is excluded from the sitemap and is useful when debugging the theme or MDC
rendering.

## Content

Posts live in `content/posts/<locale>/<slug>.md`, where `<slug>` is both the filename and the URL
segment (`/p/<slug>`). The same slug is used across locales so a post can be switched between
languages.

```yaml
---
title: My post
description: A short summary.
date: "2026-09-11"
type: article        # article | novel
categories: [ Java ]
tags: [ JEP ]
cover: /images/posts/my-post/cover.png
comments: true
toc: true
draft: false
---
```

| Field        | Default      | Notes                                         |
|--------------|--------------|-----------------------------------------------|
| `date`       | required     | `YYYY-MM-DD` or an ISO timestamp              |
| `type`       | `article`    | `article` or `novel`; drives the card style   |
| `categories` | `[]`         |                                               |
| `tags`       | `[]`         |                                               |
| `cover`      | –            | Path under `public/`                          |
| `license`    | site default | `CC BY-NC-SA 4.0` unless overridden           |
| `comments`   | `true`       | Set to `false` to hide Giscus                 |
| `toc`        | `true`       | Novels default to `false`                     |
| `draft`      | `false`      | Drafts are excluded from the production build |
| `featured`   | `false`      |                                               |

Custom pages live in `content/pages/<locale>/<slug>.md` and can join the navigation through
frontmatter:

```yaml
---
title: Links
navigation:
  title: Links
  icon: i-lucide-link
  order: 60
---
```

Homepage copy is stored per locale in `content/data/home/<locale>.yml`, and friend links are
collected in `content/data/friends.yml`.

Before publishing, validate everything:

```bash
bun run content:check
```

This checks the frontmatter schema, post types, slug format, duplicate slugs, ISO dates, cover
images, and missing translations.

## Internationalization

The site ships **Simplified Chinese** (`zh-cn`, default), **Traditional Chinese** (`zh-tw`), and
**English** (`en`) using the `prefix_except_default`
strategy:

| Content     | zh-cn       | zh-tw             | en             |
|-------------|-------------|-------------------|----------------|
| Post        | `/p/<slug>` | `/zh-tw/p/<slug>` | `/en/p/<slug>` |
| Custom page | `/<slug>`   | `/zh-tw/<slug>`   | `/en/<slug>`   |

UI copy lives in `i18n/locales/`; long-form content lives under `content/`.

## Scripts

| Script                  | Description                              |
|-------------------------|------------------------------------------|
| `bun run dev`           | Start the dev server                     |
| `bun run build`         | Build for production                     |
| `bun run generate`      | Static-generate to `.output/public`      |
| `bun run preview`       | Preview the build                        |
| `bun run typecheck`     | Run Nuxt type checking                   |
| `bun run lint`          | Run ESLint                               |
| `bun run test`          | Run unit tests (Vitest)                  |
| `bun run test:e2e`      | Run end-to-end tests (Playwright)        |
| `bun run content:check` | Validate content                         |
| `bun run migrate:hugo`  | Import content from the legacy Hugo site |

## Testing

Unit tests cover the date, reading-time, search-scoring, archive-grouping, and locale/collection
helpers, plus i18n key parity:

```bash
bun run test
```

End-to-end tests build the static site and serve `.output/public` with a clean-URL server, then
check pages across all three locales, responsive widths from 360px to 1440px, light and dark themes,
reduced motion, no-JavaScript rendering, keyboard navigation, screen-reader landmarks, internal
links, RSS, and the sitemap:

```bash
bunx playwright install          # Chromium, Firefox, WebKit
bun run test:e2e
```

The suite runs on Chromium, Firefox, and WebKit. On systems where Playwright cannot manage its own
Chromium, point it at a system build:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium bun run test:e2e
```

## Deployment

`bun run generate` writes a fully static site to `.output/public` that can be served from any host.
Production runs on GitHub Pages at
<https://www.chiloven.top> (custom domain, root base path).

## License

Written content is licensed under **CC BY-NC-SA 4.0** unless a post overrides its `license` field;
novels are All Rights Reserved. The source code is available in this repository.
