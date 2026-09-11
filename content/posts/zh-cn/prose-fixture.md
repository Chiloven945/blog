---
title: 排版能力测试
description: 覆盖 M5 全部 Markdown / MDC / Math 能力的回归 fixture。
date: "2026-09-04"
type: article
categories:
  - 测试
tags:
  - markdown
  - mdc
  - math
cover: /images/posts/prose-fixture/cover.png
coverAlt: 排版能力测试封面
comments: false
toc: true
draft: false
featured: false
---

这是一篇用于回归测试的 fixture，覆盖标题、链接、图片、引用、表格、代码、MDC 组件、数学公式、脚注与自定义锚点。

## 二级标题

正文段落，包含**加粗**、*斜体*、`行内代码`，以及[内部链接](/p/code-article)和[外部链接](https://nuxt.com)。

### 三级标题

无序列表：

- 第一项
- 第二项
  - 嵌套项

有序列表：

1. 第一步
2. 第二步

## 引用

> 这是一段引用。左侧边框，不使用巨大的引号图标。
>
> 第二段引用。

## 表格

| 语言 | 用途 | 年份 |
| --- | --- | --- |
| Java | 后端 | 1995 |
| TypeScript | 前端 | 2012 |
| Rust | 系统 | 2010 |

## 图片

![示例图片](/images/posts/prose-fixture/demo.png)

## 代码

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
这是一条 `info` 提示。
::

::callout{type="warning" title="注意"}
这是一条 `warning` 警告。
::

::callout{type="danger" title="危险"}
这是一条 `danger` 提示。
::

::callout{type="success" title="成功"}
这是一条 `success` 提示。
::

::callout{type="note"}
这是一条没有标题的 `note`。
::

## Figure

::figure
---
src: /images/posts/prose-fixture/demo.png
alt: Figure 示例
caption: 这是 Figure 组件的图片说明。
---
::

## Gallery

::gallery
---
images:
  - src: /images/posts/prose-fixture/grid-1.png
    alt: 网格 1
    caption: 图一
  - src: /images/posts/prose-fixture/grid-2.png
    alt: 网格 2
    caption: 图二
  - src: /images/posts/prose-fixture/grid-3.png
    alt: 网格 3
    caption: 图三
---
::

## LinkCard

::link-card
---
href: https://nuxt.com
title: Nuxt
description: 一个用于构建现代 Web 应用的开源框架。
icon: i-lucide-hexagon
---
::

## Spotify

::spotify-embed
---
type: playlist
id: 37i9dQZF1DXcBWIGoYBM5M
title: Spotify 播放列表示例
---
::

## 数学公式

行内公式 $E = mc^2$，以及 $a^2 + b^2 = c^2$。

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## 脚注

这里有一个脚注引用[^1]，以及另一个[^2]。

[^1]: 第一条脚注内容。
[^2]: 第二条脚注内容，包含 `代码`。

## 自定义锚点

:span{#custom-anchor}自定义锚点文字，可以通过 [锚点链接](#custom-anchor) 跳转。
