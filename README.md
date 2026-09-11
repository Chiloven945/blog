# blog

Personal site built with **Nuxt 4**, **Nuxt UI 4**, and **Nuxt Content 3**, generated as a static
site and deployed to GitHub Pages.

> Full product, design, content, and migration specification lives in [ROADMAP.md](./ROADMAP.md).

## Stack

| Concern                   | Choice                                           |
|---------------------------|--------------------------------------------------|
| Runtime / package manager | [Bun](https://bun.sh)                            |
| Framework                 | [Nuxt 4](https://nuxt.com)                       |
| UI primitives             | [Nuxt UI 4](https://ui.nuxt.com)                 |
| Content                   | [Nuxt Content 3](https://content.nuxt.com) + MDC |
| Images / Fonts            | `@nuxt/image`, `@nuxt/fonts`                     |
| i18n                      | `@nuxtjs/i18n` (`zh-cn`, `zh-tw`, `en`)          |
| SEO                       | `@nuxtjs/sitemap`, `@nuxtjs/robots`              |
| Comments                  | Giscus                                           |
| Testing                   | Vitest, Playwright                               |
| Linting                   | ESLint (`@nuxt/eslint`)                          |

## Getting started

```bash
bun install
bun run dev
```

## Scripts

| Script                  | Description                            |
|-------------------------|----------------------------------------|
| `bun run dev`           | Start the dev server                   |
| `bun run build`         | Build for production                   |
| `bun run generate`      | Static-generate to `.output/public`    |
| `bun run preview`       | Preview the generated output           |
| `bun run typecheck`     | Run Nuxt type checking                 |
| `bun run lint`          | Run ESLint                             |
| `bun run test`          | Run unit tests (Vitest)                |
| `bun run test:e2e`      | Run end-to-end tests (Playwright)      |
| `bun run content:check` | Validate content                       |
| `bun run new:post`      | Scaffold a new post                    |
| `bun run new:page`      | Scaffold a new page                    |
| `bun run migrate:hugo`  | Migrate content from the old Hugo site |

## Status

Currently at **M0 — project initialization and baseline freeze**. See `ROADMAP.md` §46 for the full
milestone plan.
