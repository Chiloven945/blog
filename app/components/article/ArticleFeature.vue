<script lang="ts" setup>
import type {ArticleCardItem} from '#shared/types/article'

const props = defineProps<{
    article: ArticleCardItem
}>()

const {t, locale} = useI18n()

const subtype = computed(() => resolveArticleSubtype(props.article.subtype))
const subtypeLabel = computed(() => (subtype.value
    ? t(subtype.value.labelKey)
    : null))
const formattedDate = computed(() =>
    formatPostDate(props.article.updated || props.article.date, locale.value),
)
</script>

<template>
    <article v-reveal class="reveal border border-default">
        <NuxtLink
                :to="article.path"
                class="focus-ring group grid lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
            <div class="flex flex-col p-6 lg:p-8">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] uppercase">
                    <span v-if="subtypeLabel" class="text-primary">{{ subtypeLabel }}</span>
                    <span v-if="article.series" class="text-muted">/ {{ article.series }}</span>
                </div>

                <h2
                        class="mt-4 font-display-sans text-2xl leading-tight font-bold text-highlighted transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl"
                >
                    {{ article.title }}
                </h2>

                <p
                        v-if="article.description"
                        class="mt-3 max-w-2xl text-base/7 text-muted"
                >
                    {{ article.description }}
                </p>

                <div
                        class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 font-mono text-xs text-muted"
                >
                    <time :datetime="article.updated || article.date">{{ formattedDate }}</time>
                </div>
            </div>

            <div
                    v-if="article.cover"
                    class="order-first overflow-hidden border-b border-default bg-elevated lg:order-last lg:border-s lg:border-b-0"
            >
                <NuxtImg
                        :alt="article.coverAlt || article.title"
                        :src="article.cover"
                        class="h-full max-h-80 w-full object-cover lg:max-h-none"
                        format="webp"
                        height="440"
                        loading="lazy"
                        width="704"
                />
            </div>
        </NuxtLink>
    </article>
</template>
