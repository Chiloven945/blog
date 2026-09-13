<script lang="ts" setup>
import type {NovelCardItem} from '#shared/types/novel'
import NovelCard from './NovelCard.vue'

defineProps<{
    items: NovelCardItem[]
}>()

const {t} = useI18n()
</script>

<template>
    <section
            v-if="items.length"
            aria-labelledby="related-novels"
            class="mt-16 border-t border-default pt-6"
    >
        <h2
                id="related-novels"
                class="font-mono text-xs tracking-[0.2em] text-muted uppercase"
        >
            {{ t('novel.related') }}
        </h2>

        <div class="mt-2 [&>article:last-child]:border-b-0">
            <NovelCard
                    v-for="item in items"
                    :key="item.path"
                    :novel="item"
            />
        </div>
    </section>
</template>
