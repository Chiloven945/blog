<script lang="ts" setup>
// Unlisted, noindex reference for design tokens, components, prose, math,
// and footnotes. Keep it around for debugging the theme or MDC rendering.
import katex from 'katex'
import 'katex/dist/katex.min.css'
import {licenseKeys, resolveLicense} from '#shared/config/licenses'

useSeoMeta({title: 'Style & Content Reference', robots: 'noindex'})

const {t} = useI18n()
const modalOpen = ref(false)
const inputValue = ref('')

const semanticColors = [
    {key: 'primary', token: '--ui-primary'},
    {key: 'secondary', token: '--ui-secondary'},
    {key: 'success', token: '--ui-success'},
    {key: 'info', token: '--ui-info'},
    {key: 'warning', token: '--ui-warning'},
    {key: 'error', token: '--ui-error'},
    {key: 'neutral', token: '--ui-color-neutral-500'},
]

const brandScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const inlineMathEl = ref<HTMLElement | null>(null)
const displayMathEl = ref<HTMLElement | null>(null)

onMounted(() => {
    if (inlineMathEl.value) {
        katex.render('a^2 + b^2 = c^2', inlineMathEl.value, {throwOnError: false})
    }

    if (displayMathEl.value) {
        katex.render(
            '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}',
            displayMathEl.value,
            {throwOnError: false, displayMode: true},
        )
    }
})

const galleryImages = [
    {
        src: '/images/home/art-01.webp',
        alt: 'Art 01',
        caption: 'First'
    },
    {
        src: '/images/home/art-02.webp',
        alt: 'Art 02',
        caption: 'Second'
    },
    {
        src: '/images/social/og-default.png',
        alt: 'Social card',
        caption: 'Third'
    },
]

const sampleCode = 'export function greet(name: string) {\n  return `Hello, ${name}!`\n}'

const mermaidFlowchart = `graph TD
    A[Request] --> B{Cached?}
    B -- Yes --> C[Serve cache]
    B -- No --> D[Build page]
    D --> C`

const mermaidSequence = `sequenceDiagram
    participant U as User
    participant S as Server
    U->>S: GET /articles
    S-->>U: 200 HTML`

const licenseList = licenseKeys.map((key) => {
    const entry = resolveLicense(key)

    return {
        key,
        label: entry.labelKey
            ? t(entry.labelKey)
            : entry.label,
        url: entry.url ?? null,
        badge: entry.badge ?? null,
    }
})
</script>

<template>
    <div class="space-y-12">
        <header class="space-y-3 border-b border-default pb-6">
            <p class="text-xs uppercase tracking-[0.2em] text-muted">
                Dev reference
            </p>
            <h1 class="text-3xl font-bold text-highlighted">
                Style &amp; Content Reference
            </h1>
            <p class="text-muted">
                Unlisted, noindex reference for design tokens, components, prose, math,
                and footnotes. Not linked from the site — reach it directly at
                <code>/dev/style</code> when debugging the theme or MDC rendering.
            </p>
        </header>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Colors
            </h2>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                        v-for="c in semanticColors"
                        :key="c.key"
                        class="rounded-sm border border-default p-3"
                >
                    <div
                            :style="{ backgroundColor: `var(${c.token})` }"
                            class="mb-2 h-10 rounded-sm"
                    />
                    <p class="text-sm text-toned">
                        {{ c.key }}
                    </p>
                </div>
            </div>
            <div>
                <p class="mb-2 text-sm text-muted">
                    brand scale
                </p>
                <div class="flex flex-wrap gap-1">
                    <div
                            v-for="s in brandScale"
                            :key="s"
                            :style="{ backgroundColor: `var(--color-brand-${s})` }"
                            class="flex h-10 w-16 items-end justify-center rounded-xs"
                    >
            <span
                    :class="s < 400 ? 'text-black' : 'text-white'"
                    class="text-[10px]"
            >{{ s }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Typography
            </h2>
            <div class="space-y-2">
                <p class="text-4xl font-bold">
                    Heading 1 — 标题
                </p>
                <h2 class="text-3xl font-bold">
                    Heading 2 — 标题
                </h2>
                <h3 class="text-2xl font-bold">
                    Heading 3
                </h3>
                <p class="text-base">
                    正文段落：Source Han Sans 中文测试 ABCDEFG abcdefg 0123456789. The
                    quick brown fox jumps over the lazy dog.
                </p>
                <p class="text-sm text-muted">
                    Muted small text / 次要文本。
                </p>
                <p>
                    链接示例 <a href="#">这是一个链接</a>，以及 <a href="#">English link</a>。
                </p>
                <p class="italic">
                    Synthetic italic 斜体测试。
                </p>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Button
            </h2>
            <div class="flex flex-wrap items-center gap-3">
                <UButton>Primary</UButton>
                <UButton
                        color="neutral"
                        variant="outline"
                >
                    Outline
                </UButton>
                <UButton
                        color="neutral"
                        variant="soft"
                >
                    Soft
                </UButton>
                <UButton
                        color="neutral"
                        variant="ghost"
                >
                    Ghost
                </UButton>
                <UButton variant="link">
                    Link
                </UButton>
                <UButton disabled>
                    Disabled
                </UButton>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Input
            </h2>
            <div class="grid gap-3 sm:max-w-md">
                <UInput
                        v-model="inputValue"
                        placeholder="Type something…"
                />
                <UInput
                        disabled
                        placeholder="Disabled"
                />
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Card
            </h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <UCard>
                    <template #header>
                        <p class="font-bold text-highlighted">
                            Card title
                        </p>
                    </template>
                    <p class="text-sm text-muted">
                        A quiet card: 1px border, no shadow, small radius.
                    </p>
                </UCard>
                <UCard variant="soft">
                    <p class="font-bold text-highlighted">
                        Soft card
                    </p>
                    <p class="mt-1 text-sm text-muted">
                        Uses the elevated surface.
                    </p>
                </UCard>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Border
            </h2>
            <div class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-sm border border-default p-4 text-sm">
                    border-default
                </div>
                <div class="rounded-sm border border-muted p-4 text-sm">
                    border-muted
                </div>
                <div class="rounded-sm border border-accented p-4 text-sm">
                    border-accented
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Code
            </h2>
            <p>
                Inline <code class="rounded-xs bg-elevated px-1.5 py-0.5 text-sm">const answer =
                42</code>
                code.
            </p>
            <ProsePre
                    :code="sampleCode"
                    filename="greet.ts"
                    language="ts"
            >
                <span class="line">export function greet(name: string) {</span>
                <span class="line">  return `Hello, ${name}!`</span>
                <span class="line">}</span>
            </ProsePre>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Content / Prose
            </h2>
            <div class="post-body space-y-6">
                <Callout
                        title="Note"
                        type="info"
                >
                    Callouts, figures, galleries, link cards, math, and footnotes all
                    render through the same components posts use.
                </Callout>

                <p class="text-sm">
                    Inline math renders as <span ref="inlineMathEl"/>, display math
                    below, and an
                    <ProseA href="https://nuxt.com">external link</ProseA>
                    .
                </p>

                <div ref="displayMathEl"/>

                <Figure
                        alt="Homepage art"
                        caption="Figure with caption"
                        src="/images/home/art-01.webp"
                />

                <Gallery :images="galleryImages"/>

                <LinkCard
                        description="The framework this site is built with."
                        href="https://nuxt.com"
                        title="Nuxt"
                />

                <p class="text-sm">
                    A statement that needs a source<sup id="fnref-1"><a
                        class="text-primary"
                        href="#fn-1"
                >[1]</a></sup>.
                </p>

                <section data-footnotes>
                    <h2 class="sr-only">
                        Footnotes
                    </h2>
                    <ol>
                        <li id="fn-1">
                            Sample footnote text. <a
                                data-footnote-backref
                                href="#fnref-1"
                        >↩</a>
                        </li>
                    </ol>
                </section>
            </div>
        </section>

        <section class="space-y-6">
            <h2 class="text-xl font-bold text-highlighted">
                Footnotes
            </h2>

            <div
                    class="post-body prose-article space-y-3"
                    data-footnote-example="article"
            >
                <p class="text-sm">
                    Article footnote reference<sup><a
                        id="dev-fnref-a1"
                        data-footnote-ref
                        href="#dev-fn-a1"
                >1</a></sup>.
                </p>
                <section data-footnotes>
                    <h2 class="sr-only">
                        Footnotes
                    </h2>
                    <ol>
                        <li id="dev-fn-a1">
                            Article footnote text. <a
                                data-footnote-backref
                                href="#dev-fnref-a1"
                        >↩</a>
                        </li>
                    </ol>
                </section>
            </div>

            <div
                    class="post-body prose-novel space-y-3"
                    data-footnote-example="novel"
            >
                <p>
                    小说脚注引用<sup><a
                        id="dev-fnref-n1"
                        data-footnote-ref
                        href="#dev-fn-n1"
                >1</a></sup>。
                </p>
                <section data-footnotes>
                    <h2 class="sr-only">
                        Footnotes
                    </h2>
                    <ol>
                        <li id="dev-fn-n1">
                            小说脚注文本。 <a
                                data-footnote-backref
                                href="#dev-fnref-n1"
                        >↩</a>
                        </li>
                    </ol>
                </section>
            </div>
        </section>

        <section class="space-y-6">
            <h2 class="text-xl font-bold text-highlighted">
                Licenses
            </h2>

            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div
                        v-for="license in licenseList"
                        :key="license.key"
                        class="flex items-center gap-3 rounded-sm border border-default p-4"
                >
                    <img
                            v-if="license.badge"
                            :alt="license.label"
                            :src="license.badge"
                            class="h-6 w-auto shrink-0"
                            height="42"
                            width="120"
                    >
                    <div class="min-w-0">
                        <a
                                v-if="license.url"
                                :href="license.url"
                                class="link block text-sm"
                                rel="noopener noreferrer"
                                target="_blank"
                        >
                            {{ license.label }}
                        </a>
                        <span v-else class="block text-sm text-highlighted">{{
                                license.label
                            }}</span>
                        <code class="mt-0.5 block font-mono text-xs text-dimmed">{{
                                license.key
                            }}</code>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-2">
                <div>
                    <p class="mb-2 text-sm text-muted">
                        Article license block
                    </p>
                    <div class="post-body prose-article">
                        <PostLicense license="cc-by-sa-4.0"/>
                    </div>
                </div>

                <div>
                    <p class="mb-2 text-sm text-muted">
                        Novel colophon
                    </p>
                    <div class="post-body prose-novel">
                        <NovelColophon
                                date="2026-01-01"
                                license="all-rights-reserved"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Diagrams
            </h2>
            <p class="text-sm text-muted">
                Markdown fenced code blocks with the <code>mermaid</code> language
                render as diagrams (client-side, with the raw source as the no-JS
                fallback).
            </p>
            <ProsePre
                    :code="mermaidFlowchart"
                    language="mermaid"
            />
            <ProsePre
                    :code="mermaidSequence"
                    language="mermaid"
            />
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold text-highlighted">
                Modal
            </h2>
            <UButton @click="modalOpen = true">
                Open modal
            </UButton>
            <UModal
                    v-model:open="modalOpen"
                    description="A quiet modal with a light shadow."
                    title="Modal title"
            >
                <template #body>
                    <p class="text-sm text-muted">
                        Modal content. 1px border, 6px radius, subtle elevation.
                    </p>
                </template>
                <template #footer>
                    <div class="flex w-full justify-end gap-2">
                        <UButton
                                color="neutral"
                                variant="outline"
                                @click="modalOpen = false"
                        >
                            Cancel
                        </UButton>
                        <UButton @click="modalOpen = false">
                            Confirm
                        </UButton>
                    </div>
                </template>
            </UModal>
        </section>
    </div>
</template>
