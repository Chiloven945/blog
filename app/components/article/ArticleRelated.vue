<script lang="ts" setup>
import type {ArticleCardItem} from '#shared/types/article'
import ArticleIndexRow from './ArticleIndexRow.vue'

defineProps<{
    items: ArticleCardItem[]
}>()

const {t} = useI18n()
</script>

<template>
    <section
            v-if="items.length"
            aria-labelledby="related-articles"
            class="mt-12 border-t border-default pt-6"
    >
        <h2
                id="related-articles"
                class="font-mono text-xs tracking-[0.2em] text-muted uppercase"
        >
            {{ t('article.related') }}
        </h2>

        <ol class="mt-4">
            <ArticleIndexRow
                    v-for="(item, index) in items"
                    :key="item.path"
                    :article="item"
                    :index="index"
            />
        </ol>
    </section>
</template>
