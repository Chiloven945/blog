<script lang="ts" setup>
import type {NovelDocument} from '#shared/types/novel'
import NovelReader from '~/components/novel/NovelReader.vue'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

definePageMeta({layout: 'post'})

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

// Novels have their own URL tree; this page never queries the article
// collection. The content path is already locale-prefixed and matches the
// route path.
const novelAsync = useAsyncData(
    () => `novel-${active.value.novels}-${path.value}`,
    () => queryCollection(active.value.novels).path(path.value).first(),
)

const novel = novelAsync.data

const novelDoc = computed<NovelDocument | null>(() =>
    novel.value
        ? novel.value as unknown as NovelDocument
        : null,
)

const {related: relatedNovels} = useRelatedNovels(novelDoc)

await novelAsync

if (!novel.value
    || (isDraft(novel.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const readingTime = computed(() => getReadingTime(novel.value?.body))

// Novels preload the reading serif (the UI sans is already preloaded globally).
useHead(() => {
    const files = resolveFontFiles(locale.value)

    return {
        link: [fontPreloadLink(files.serif)],
    }
})

usePageMeta({
    title: () => novel.value?.title,
    description: () => novel.value?.description,
    type: 'article',
    image: () => novel.value?.cover,
    article: {
        publishedTime: () => novel.value?.date,
        modifiedTime: () => novel.value?.updated,
        tags: () => novel.value?.tags,
    },
})
</script>

<template>
    <NovelReader
            v-if="novelDoc"
            :novel="novelDoc"
            :reading-time="readingTime"
            :related="relatedNovels"
    />
</template>
