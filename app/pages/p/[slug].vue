<script lang="ts" setup>
import type {Kind} from '#shared/config/kinds'
import type {ArticleDocument} from '#shared/types/article'
import type {NovelDocument} from '#shared/types/novel'
import ArticleReader from '~/components/article/ArticleReader.vue'
import NovelReader from '~/components/novel/NovelReader.vue'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

definePageMeta({layout: 'post'})

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

// `/p/:slug` is shared by articles and novels; resolve both collections and
// delegate to the matching reader (the two readers never share a component).
const {data: article} = await useAsyncData(
    () => `article-${active.value.articles}-${path.value}`,
    () => queryCollection(active.value.articles).path(path.value).first(),
)

const {data: novel} = await useAsyncData(
    () => `novel-${active.value.novels}-${path.value}`,
    () => queryCollection(active.value.novels).path(path.value).first(),
)

const kind = computed<Kind>(() => (article.value
    ? 'article'
    : 'novel'))
const source = computed(() => article.value ?? novel.value ?? null)
const collection = computed(() => (article.value
    ? active.value.articles
    : active.value.novels))

const articleDoc = computed<ArticleDocument | null>(() =>
    article.value
        ? article.value as unknown as ArticleDocument
        : null,
)

const novelDoc = computed<NovelDocument | null>(() =>
    novel.value
        ? novel.value as unknown as NovelDocument
        : null,
)

// Let the floating navigation highlight Articles or Novels on a post.
const navPostKind = useState<'article' | 'novel' | null>('nav-post-kind', () => null)
watchEffect(() => {
    navPostKind.value = source.value
        ? kind.value
        : null
})

if (!source.value
    || (isDraft(source.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const readingTime = computed(() => getReadingTime(source.value?.body))

// Articles keep chronological surround; novels opt out (a novel's publish
// date is not its reading order) and will use related works in a later pass.
const {data: surround} = await useAsyncData(
    () => `post-surround-${collection.value}-${path.value}`,
    async () => {
        if (kind.value !== 'article') {
            return {prev: null, next: null}
        }

        const items = await queryCollection(active.value.articles)
            .select('path', 'title', 'date')
            .order('date', 'ASC')
            .all()

        return getPostSurround(items, path.value)
    },
)

// Reading-face preload: novels pull the locale serif, articles the code face
// (the UI sans is already preloaded globally).
useHead(() => {
    const files = resolveFontFiles(locale.value)

    return {
        link: kind.value === 'novel'
            ? [fontPreloadLink(files.serif)]
            : [fontPreloadLink(files.code)],
    }
})

usePageMeta({
    title: () => source.value?.title,
    description: () => source.value?.description,
    type: 'article',
    image: () => source.value?.cover,
    article: {
        publishedTime: () => source.value?.date,
        modifiedTime: () => source.value?.updated,
        tags: () => source.value?.tags,
    },
})
</script>

<template>
    <ArticleReader
            v-if="articleDoc && surround"
            :article="articleDoc"
            :reading-time="readingTime"
            :surround="surround"
    />

    <NovelReader
            v-else-if="novelDoc"
            :novel="novelDoc"
            :reading-time="readingTime"
    />
</template>
