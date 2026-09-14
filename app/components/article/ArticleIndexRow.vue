<script lang="ts" setup>
import type {ArticleCardItem} from '#shared/types/article'

const props = defineProps<{
    article: ArticleCardItem
    index: number
}>()

const {t, locale} = useI18n()

const number = computed(() => String(props.index + 1).padStart(2, '0'))
const subtype = computed(() => resolveArticleSubtype(props.article.subtype))
const subtypeLabel = computed(() =>
    subtype.value
        ? t(subtype.value.labelKey)
        : null
)
const formattedDate = computed(() => formatPostDate(props.article.date, locale.value))
</script>

<template>
    <li v-reveal="index * 40" class="reveal">
        <NuxtLink
                :to="article.path"
                class="focus-ring group flex items-baseline gap-4 border-t border-default px-2 py-4 transition-colors hover:bg-elevated"
        >
            <span class="w-6 shrink-0 font-mono text-xs text-dimmed tabular-nums">
                {{ number }}
            </span>

            <span
                    v-if="subtypeLabel"
                    class="hidden w-24 shrink-0 font-mono text-xs tracking-[0.15em] text-muted uppercase md:block"
            >
                {{ subtypeLabel }}
            </span>

            <span class="min-w-0 flex-1">
                <span
                        class="block leading-snug font-bold text-highlighted transition-colors group-hover:text-primary"
                >
                    {{ article.title }}
                </span>
                <span
                        v-if="article.description"
                        class="mt-0.5 line-clamp-2 text-sm text-muted md:line-clamp-1"
                >
                    {{ article.description }}
                </span>
            </span>

            <time :datetime="article.date" class="shrink-0 font-mono text-xs text-muted">
                {{ formattedDate }}
            </time>
        </NuxtLink>
    </li>
</template>
