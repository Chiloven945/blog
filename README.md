# Chiloven's Blog

A trilingual personal blog and reading site built with **Nuxt 4**, **Nuxt UI 4**, and **Nuxt Content
3**. Typography-first and editorial in tone, with a light/dark theme, per-language content, and a
small, dependency-light runtime.

**Live:** <https://www.chiloven.top>

## Features

- **Trilingual** — English (default), Simplified Chinese, and Traditional Chinese, each with its own
  prefixed canonical route. Unprefixed paths act as language-entry redirectors, choosing the saved
  preference or the browser language and falling back to English; the switcher marks languages whose
  translation does not exist yet.
- **Content-driven** — articles, novels, and pages are Markdown/MDC files managed by Nuxt Content;
  no database, CMS, or auth.
- **Reading experience** — a dedicated article reader with a contents/tools rail (reading progress,
  copy link, back to top), reading time, source notices for translations, license, footnotes, and
  comments; and a separate serif novel reader with a title page, scene breaks, a reading toolbar
  (text size, line spacing, column width, indent), a chrome-free reading mode, and a progress line.
- **Rich Markdown** — syntax-highlighted code with line numbers and copy, callouts, figures,
  galleries, link cards, KaTeX math, and custom anchors.
- **Search** — a `Ctrl/Cmd + K` command palette and a shareable `/search?q=`
  page, scoped to the active language.
- **Sections** — a solid-tone mosaic homepage built from the authored profile (names, facts,
  interests, trying list, stats, tools) with distinct blocks for latest articles and latest fiction,
  plus the full contact/link mosaic; a technical article index with a subtype filter and featured
  entry, a novel library with subtype and status filters and a currently-writing feature, an archive
  timeline, friends, and free-form content pages.
- **Tags** — a `/tags` index with count-tiered blocks and `/tags/:tag` pages that keep article and
  novel results in separate lists; tags are normalized per locale and clickable from the readers.
- **Footnotes & licensing** — an explicit GFM footnote pipeline with per-reader styles and a
  localized notes heading; a license registry covering the full Creative Commons family (CC BY,
  BY-SA, BY-ND, BY-NC, BY-NC-SA, BY-NC-ND), CC0, the Public Domain Mark, and All Rights Reserved,
  rendered as an article license block, a novel colophon, and a footer CC badge.
- **Related content** — deterministic same-kind recommendations scored by series, tags, subtype, and
  recency, shown after each article or novel.
- **Floating navigation** — a desktop left rail, a centered tablet top dock, and a mobile bottom
  dock with a More sheet; keyboard-focusable, with labels revealed on hover/focus and a skip link.
- **SEO** — locale-prefixed canonical URLs, Open Graph, Twitter cards, hreflang alternates, a
  locale-aware sitemap, and robots.
- **Comments & feed** — lazy, color-mode/locale-aware Giscus comments with a single locale-neutral
  discussion key shared by all three locales, and a per-language RSS feed (`/en/rss.xml`,
  `/zh-cn/rss.xml`, `/zh-tw/rss.xml`).
- **Accessible motion** — reveal animations are an enhancement and respect
  `prefers-reduced-motion`; content is fully visible without JavaScript.

## Technologies

| Concern                   | Choice                                                                                                      |
|---------------------------|-------------------------------------------------------------------------------------------------------------|
| Runtime / package manager | [Bun](https://bun.sh) 1.4.2                                                                                 |
| Framework                 | [Nuxt 4](https://nuxt.com)                                                                                  |
| UI primitives             | [Nuxt UI 4](https://ui.nuxt.com)                                                                            |
| Content                   | [Nuxt Content 3](https://content.nuxt.com) + MDC                                                            |
| Images / Fonts            | `@nuxt/image`, `@nuxt/fonts`, self-hosted Source Han / Google Sans Flex / Libre Baskerville / Cascadia Code |
| i18n                      | `@nuxtjs/i18n` (`en`, `zh-cn`, `zh-tw`)                                                                     |
| SEO                       | `@nuxtjs/sitemap`, `@nuxtjs/robots`                                                                         |
| Comments                  | Giscus (locale-neutral discussion key)                                                                      |
| Deployment                | Cloudflare Workers (Nitro server build)                                                                     |
| Testing                   | Vitest (unit), Playwright (end-to-end)                                                                      |
| Linting                   | ESLint (`@nuxt/eslint`)                                                                                     |

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
  assets/css/     theme, typography, motion, home, article, novel, and utility layers
  components/     app shell, home mosaic, article, novel, content, taxonomy, search, archives, friends
  composables/    content selection, search, archives, tags, navigation, motion, SEO
  layouts/        default, home
  pages/          home, articles, novels, tags, archives, friends, search, and custom pages
  utils/          article, novel, search, date, locale, related, fonts, and content helpers
content/
  articles/<locale>/  article Markdown
  novels/<locale>/    novel Markdown
  series/<locale>/    series Markdown
  pages/<locale>/     custom pages
  data/profile/<locale>.yml  homepage profile copy per locale
  data/links.yml      personal links (single source)
  data/friends.yml    friend links
i18n/locales/     UI strings per locale
public/           fonts, images, and other static assets
server/           localized RSS feed routes
shared/           site/kind/subtype config and shared schemas/types
tests/            unit (Vitest) and e2e (Playwright) tests
```

`/dev/style` is an unlisted, `noindex` reference page for design tokens, components, prose, math,
and footnotes. It is excluded from the sitemap and is useful when debugging the theme or MDC
rendering.

## Content

Articles live in `content/articles/<locale>/<slug>.md` and novels in
`content/novels/<locale>/<slug>.md`, where `<slug>` is both the filename and the URL segment
(`/<locale>/articles/<slug>` or `/<locale>/novels/<slug>`). The same slug is used across locales,
and a slug must be unique across articles and novels within a locale. Series descriptions live in
`content/series/<locale>/<slug>.md`.

```yaml
---
title: My article
description: A short summary.
date: "2026-09-11"
subtype: tutorial        # article subtype (shared/config/article-subtypes.ts)
status: published        # article status (shared/config/statuses.ts)
tags: [ Java, JEP ]
cover: /images/posts/my-article/cover.png
comments: true
toc: true
featured: false
---
```

| Field      | Default        | Notes                                               |
|------------|----------------|-----------------------------------------------------|
| `date`     | required       | `YYYY-MM-DD` or an ISO timestamp                    |
| `subtype`  | required       | Article or novel subtype (per collection)           |
| `status`   | `published`    | Articles: `published`; novels default to `complete` |
| `tags`     | `[]`           | Free-form tags, normalized per locale               |
| `cover`    | –              | Path under `public/`                                |
| `license`  | per kind       | Key from `shared/config/licenses.ts`                |
| `comments` | `true`         | Set to `false` to hide Giscus                       |
| `toc`      | `true`/`false` | Articles `true`; novels default to `false`          |
| `series`   | –              | Series slug; set `seriesOrder` alongside it         |
| `featured` | `false`        |                                                     |

Articles default to `license: cc-by-nc-sa-4.0`; novels default to `all-rights-reserved`. Production
hides `status: draft` (develop with `?drafts=1`).

Custom pages live in `content/pages/<locale>/<slug>.md` and render through the catch-all route.
Primary navigation is the fixed floating set (Home / Articles / Novels / Tags / Archives / Friends);
About and Links are homepage sections (`/#about`, `/#links`).

The homepage profile is authored per locale in `content/data/profile/<locale>.yml`, personal links
come from the single `content/data/links.yml` source, and friend links are collected in
`content/data/friends.yml`.

## Internationalization

The site ships **English** (`en`, default), **Simplified Chinese** (`zh-cn`), and **Traditional
Chinese** (`zh-tw`). Every locale carries an explicit URL prefix, so unprefixed paths are
language-entry redirectors only. Entry detection reads the saved locale preference cookie first,
then the browser/system language, and falls back to English:

| Content     | en                    | zh-cn                    | zh-tw                    |
|-------------|-----------------------|--------------------------|--------------------------|
| Article     | `/en/articles/<slug>` | `/zh-cn/articles/<slug>` | `/zh-tw/articles/<slug>` |
| Novel       | `/en/novels/<slug>`   | `/zh-cn/novels/<slug>`   | `/zh-tw/novels/<slug>`   |
| Custom page | `/en/<slug>`          | `/zh-cn/<slug>`          | `/zh-tw/<slug>`          |

UI copy lives in `i18n/locales/`; long-form content lives under `content/`.

## Scripts

| Script              | Description                         |
|---------------------|-------------------------------------|
| `bun run dev`       | Start the dev server                |
| `bun run build`     | Build for production                |
| `bun run generate`  | Static-generate to `.output/public` |
| `bun run preview`   | Preview the build                   |
| `bun run typecheck` | Run Nuxt type checking              |
| `bun run lint`      | Run ESLint                          |
| `bun run test`      | Run unit tests (Vitest)             |
| `bun run test:e2e`  | Run end-to-end tests (Playwright)   |

## Testing

Unit tests cover search scoring, related scoring, taxonomy keys, the Giscus discussion term, and
i18n/content integrity (locale message-key parity and content slug parity):

```bash
bun run test
```

End-to-end tests build the production server (`bun run build`) and run against it, covering the core
pages and readers, navigation, language entry/fallback/switch, theme, search, filters, three
responsive breakpoints, accessibility, and SEO (internal links, RSS, sitemap, canonical/hreflang):

```bash
bunx playwright install          # Chromium
bun run test:e2e
```

The suite runs on Chromium; Firefox and WebKit are checked manually before a release. On systems
where Playwright cannot manage its own Chromium, point it at a system build:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium bun run test:e2e
```

## Deployment

`bun run build` produces a Nitro server bundle for server-side rendering in `.output`. Production
runs on Cloudflare Workers at <https://www.chiloven.top> (custom domain, root base path). For hosts
that serve files only, `bun run generate` emits a fully static `.output/public` instead.

## License

Written content is licensed under **CC BY-NC-SA 4.0** unless a work overrides its `license` field;
novels are All Rights Reserved. The source code is available in this repository.
