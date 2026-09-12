<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'

const props = defineProps<{
    article: ArticleDocument
    readingTime: number
}>()

const {t, locale} = useI18n()

const subtype = computed(() => resolveArticleSubtype(props.article.subtype))
const subtypeLabel = computed(() =>
    subtype.value
        ? t(subtype.value.labelKey)
        : null
)
const categories = computed(() => props.article.categories ?? [])
const tags = computed(() => props.article.tags ?? [])
const published = computed(() => formatPostDate(props.article.date, locale.value))
const updated = computed(() =>
    props.article.updated
        ? formatPostDate(props.article.updated, locale.value)
        : null,
)
</script>

<template>
    <header class="border-b border-default pb-8">
        <div
                class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] uppercase"
        >
            <span class="text-primary">{{ t('articles.kind') }}</span>

            <template v-if="subtypeLabel">
                <span aria-hidden="true" class="text-dimmed">/</span>
                <span class="text-muted">{{ subtypeLabel }}</span>
            </template>

            <template v-for="category in categories" :key="category">
                <span aria-hidden="true" class="text-dimmed">/</span>
                <span class="text-muted">{{ category }}</span>
            </template>

            <template v-if="article.series">
                <span aria-hidden="true" class="text-dimmed">/</span>
                <span class="text-muted">{{ article.series }}</span>
            </template>
        </div>

        <h1
                class="mt-5 font-display-sans text-3xl leading-tight font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl"
        >
            {{ article.title }}
        </h1>

        <p v-if="article.description" class="mt-4 max-w-3xl text-lg/8 text-muted">
            {{ article.description }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <time :datetime="article.date">{{ published }}</time>

            <template v-if="updated">
                <span aria-hidden="true">·</span>
                <span>{{ t('post.updated') }} {{ updated }}</span>
            </template>

            <span aria-hidden="true">·</span>
            <span>{{ t('post.readingTime', {minutes: readingTime}) }}</span>
        </div>

        <div v-if="tags.length" class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span v-for="tag in tags" :key="tag">#{{ tag }}</span>
        </div>
    </header>
</template>
