---
title: 排版能力測試
description: 覆蓋 M5 全部 Markdown / MDC / Math 能力的回歸 fixture。
date: "2026-09-04"
type: article
categories:
  - 測試
tags:
  - markdown
  - mdc
  - math
cover: /images/posts/prose-fixture/cover.png
coverAlt: 排版能力測試封面
comments: false
toc: true
draft: false
featured: false
---

這是一篇用於回歸測試的 fixture，覆蓋標題、連結、圖片、引用、表格、程式碼、MDC 元件、數學公式、腳註與自訂錨點。

## 二級標題

正文段落，包含**粗體**、*斜體*、`行內程式碼`，以及[內部連結](/zh-tw/p/code-article)和[外部連結](https://nuxt.com)。

### 三級標題

無序清單：

- 第一項
- 第二項
  - 巢狀項

有序清單：

1. 第一步
2. 第二步

## 引用

> 這是一段引用。左側邊框，不使用巨大的引號圖示。
>
> 第二段引用。

## 表格

| 語言 | 用途 | 年份 |
| --- | --- | --- |
| Java | 後端 | 1995 |
| TypeScript | 前端 | 2012 |
| Rust | 系統 | 2010 |

## 圖片

![範例圖片](/images/posts/prose-fixture/demo.png)

## 程式碼

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

::callout{type="info" title="提示"}
這是一條 `info` 提示。
::

::callout{type="warning" title="注意"}
這是一條 `warning` 警告。
::

::callout{type="danger" title="危險"}
這是一條 `danger` 提示。
::

::callout{type="success" title="成功"}
這是一條 `success` 提示。
::

::callout{type="note"}
這是一條沒有標題的 `note`。
::

## Figure

::figure
---
src: /images/posts/prose-fixture/demo.png
alt: Figure 範例
caption: 這是 Figure 元件的圖片說明。
---
::

## Gallery

::gallery
---
images:
  - src: /images/posts/prose-fixture/grid-1.png
    alt: 網格 1
    caption: 圖一
  - src: /images/posts/prose-fixture/grid-2.png
    alt: 網格 2
    caption: 圖二
  - src: /images/posts/prose-fixture/grid-3.png
    alt: 網格 3
    caption: 圖三
---
::

## LinkCard

::link-card
---
href: https://nuxt.com
title: Nuxt
description: 一個用於建構現代 Web 應用的開源框架。
icon: i-lucide-hexagon
---
::

## Spotify

::spotify-embed
---
type: playlist
id: 37i9dQZF1DXcBWIGoYBM5M
title: Spotify 播放清單範例
---
::

## 數學公式

行內公式 $E = mc^2$，以及 $a^2 + b^2 = c^2$。

塊級公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## 腳註

這裡有一個腳註引用[^1]，以及另一個[^2]。

[^1]: 第一條腳註內容。
[^2]: 第二條腳註內容，包含 `程式碼`。

## 自訂錨點

:span{#custom-anchor}這段文字帶有自訂錨點，可以透過 [錨點連結](#custom-anchor) 跳轉。
