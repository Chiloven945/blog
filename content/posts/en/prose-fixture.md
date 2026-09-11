---
title: Prose Capability Test
description: A regression fixture covering every M5 Markdown / MDC / Math capability.
date: "2026-09-04"
type: article
categories:
  - Testing
tags:
  - markdown
  - mdc
  - math
cover: /images/posts/prose-fixture/cover.png
coverAlt: Prose capability test cover
comments: false
toc: true
draft: false
featured: false
---

This fixture exercises headings, links, images, quotes, tables, code, MDC components, math, footnotes, and custom anchors.

## Level Two Heading

A paragraph with **bold**, *italic*, `inline code`, an [internal link](/en/p/code-article), and an [external link](https://nuxt.com).

### Level Three Heading

Unordered list:

- First item
- Second item
  - Nested item

Ordered list:

1. First step
2. Second step

## Quote

> A blockquote with a left border and no giant quote icon.
>
> A second paragraph.

## Table

| Language | Use | Year |
| --- | --- | --- |
| Java | Backend | 1995 |
| TypeScript | Frontend | 2012 |
| Rust | Systems | 2010 |

## Image

![Demo image](/images/posts/prose-fixture/demo.png)

## Code

```java [Main.java]
public final class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

```ts [theme.ts]
export const brand = {
    primary: '#527398',
    accent: '#34495e',
} as const
```

## Callout

::callout{type="info" title="Info"}
An `info` callout.
::

::callout{type="warning" title="Warning"}
A `warning` callout.
::

::callout{type="danger" title="Danger"}
A `danger` callout.
::

::callout{type="success" title="Success"}
A `success` callout.
::

::callout{type="note"}
A `note` callout without a title.
::

## Figure

::figure
---
src: /images/posts/prose-fixture/demo.png
alt: Figure example
caption: A caption rendered by the Figure component.
---
::

## Gallery

::gallery
---
images:
  - src: /images/posts/prose-fixture/grid-1.png
    alt: Grid one
    caption: One
  - src: /images/posts/prose-fixture/grid-2.png
    alt: Grid two
    caption: Two
  - src: /images/posts/prose-fixture/grid-3.png
    alt: Grid three
    caption: Three
---
::

## LinkCard

::link-card
---
href: https://nuxt.com
title: Nuxt
description: An open source framework for building modern web applications.
icon: i-lucide-hexagon
---
::

## Spotify

::spotify-embed
---
type: playlist
id: 37i9dQZF1DXcBWIGoYBM5M
title: Spotify playlist example
---
::

## Math

Inline math $E = mc^2$ and $a^2 + b^2 = c^2$.

Display math:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## Footnotes

A footnote reference[^1] and another one[^2].

[^1]: The first footnote.
[^2]: The second footnote, with `code`.

## Custom Anchor

:span{#custom-anchor}This paragraph carries a custom anchor, reachable via an [anchor link](#custom-anchor).
