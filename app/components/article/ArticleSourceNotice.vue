<script lang="ts" setup>
import type {ArticleSource} from '#shared/types/article'

const props = defineProps<{
    source: ArticleSource
}>()

const {t} = useI18n()

const authors = computed(() => props.source.authors ?? [])
</script>

<template>
    <aside class="border-s-2 border-primary bg-elevated px-4 py-3 text-sm">
        <p class="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            {{ t('articles.source') }}
        </p>

        <p class="mt-1 text-default">
            <a
                    v-if="source.url"
                    :href="source.url"
                    class="link"
                    rel="noopener noreferrer"
                    target="_blank"
            >
                {{ source.title || source.url }}
            </a>
            <span v-else>{{ source.title }}</span>
        </p>

        <p v-if="authors.length" class="mt-0.5 text-xs text-muted">
            {{ t('articles.sourceAuthors') }}: {{ authors.join(', ') }}
        </p>

        <p v-if="source.note" class="mt-1 text-xs text-muted">
            {{ source.note }}
        </p>
    </aside>
</template>
