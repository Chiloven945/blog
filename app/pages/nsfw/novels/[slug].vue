<script lang="ts" setup>
import type {NovelDocument} from '#shared/types/novel'
import NovelReader from '~/components/novel/NovelReader.vue'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

// NSFW novels live in a separate collection, so a normal query can never
// return them. The route path already carries the /nsfw/ namespace and its
// own canonical URL.
const novelAsync = useAsyncData(
    () => `nsfw-novel-${active.value.nsfwNovels}-${path.value}`,
    () => queryCollection(active.value.nsfwNovels).path(path.value).first(),
)

const novel = novelAsync.data

// The presentation flag comes from the collection, not from frontmatter.
const novelDoc = computed<NovelDocument | null>(() =>
    novel.value
        ? {...(novel.value as unknown as NovelDocument), nsfw: true}
        : null,
)

await novelAsync

if (!novel.value
    || (isDraft(novel.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const readingTime = computed(() => getReadingTime(novel.value?.body))

// NSFW novels preload the reading serif, exactly like normal novels.
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
            :related="[]"
    />
</template>
